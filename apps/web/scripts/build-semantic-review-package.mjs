import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\build-semantic-review-package.mjs "<manifest-key>"'
  );
  process.exit(1);
}

const required = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`FAIL: Missing ${key}`);
    process.exit(1);
  }
}

const r2 = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;

async function bodyToBuffer(body) {
  const chunks = [];

  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function getJson(key) {
  const result = await r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const buffer = await bodyToBuffer(result.Body);

  return JSON.parse(
    buffer.toString("utf8")
  );
}

async function putJson(key, data) {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
    })
  );
}

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function similarity(a, b) {
  const aa = new Set(
    normalize(a).split(" ").filter(Boolean)
  );

  const bb = new Set(
    normalize(b).split(" ").filter(Boolean)
  );

  if (!aa.size || !bb.size) return 0;

  const intersection = [...aa].filter(
    (x) => bb.has(x)
  ).length;

  const union = new Set([
    ...aa,
    ...bb,
  ]).size;

  return intersection / union;
}

function clusterCandidates(items) {
  const clusters = [];

  for (const item of items) {
    let matched = false;

    for (const cluster of clusters) {
      const score = similarity(
        item.candidate_fact,
        cluster.representative
      );

      if (score >= 0.58) {
        cluster.items.push(item);
        matched = true;
        break;
      }
    }

    if (!matched) {
      clusters.push({
        representative:
          item.candidate_fact,
        items: [item],
      });
    }
  }

  return clusters;
}

try {
  const manifest =
    await getJson(manifestKey);

  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const qcKey =
    `${basePath}/review/quality-control.json`;

  const pagesKey =
    `${basePath}/processed/pages.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const qc =
    await getJson(qcKey);

  const pages =
    await getJson(pagesKey);

  const master =
    await getJson(masterKey);

  const reviewItems =
    qc.review_candidates || [];

  const groupedByPage = {};

  for (const item of reviewItems) {
    const page =
      item?.source?.page || "unknown";

    if (!groupedByPage[page]) {
      groupedByPage[page] = [];
    }

    groupedByPage[page].push(item);
  }

  const pagePackages = [];

  for (const [pageNumber, items] of Object.entries(
    groupedByPage
  )) {
    const pageData =
      (pages.pages || []).find(
        (p) =>
          String(p.page) ===
          String(pageNumber)
      );

    const clusters =
      clusterCandidates(items);

    pagePackages.push({
      page:
        Number(pageNumber) ||
        pageNumber,

      page_text:
        pageData?.text || "",

      candidate_count:
        items.length,

      clusters:
        clusters.map(
          (cluster, index) => ({
            cluster_id:
              `${pageNumber}-${index + 1}`,

            representative:
              cluster.representative,

            candidate_ids:
              cluster.items.map(
                (x) => x.id
              ),

            candidates:
              cluster.items.map(
                (x) => ({
                  id: x.id,

                  type:
                    x.fact_type,

                  text:
                    x.candidate_fact,

                  confidence:
                    x.confidence,
                })
              ),
          })
        ),
    });
  }

  const reviewPackage = {
    schema:
      "arknoz-semantic-review-package-v1",

    import_id:
      manifest.import.id,

    project_context: {
      title:
        master?.identity?.title || null,

      category:
        master?.identity?.category || null,

      type:
        master?.identity?.type || null,

      subtype:
        master?.identity?.subtype || null,
    },

    rules: {
      allowed_parent_categories: [
        "Buildings",
        "Infrastructure",
        "Transport",
        "Urban & Cities",
        "Industrial & Energy",
        "Landscape & Public Realm",
      ],

      do_not_invent:
        true,

      evidence_required:
        true,

      recommendations_are_not_facts:
        true,

      uncertain_items_require_review:
        true,

      rights_remain_private:
        true,

      publication_allowed:
        false,
    },

    totals: {
      review_candidates:
        reviewItems.length,

      page_groups:
        pagePackages.length,

      clusters:
        pagePackages.reduce(
          (sum, page) =>
            sum + page.clusters.length,
          0
        ),
    },

    pages:
      pagePackages,

    expected_semantic_output: {
      confirmed_candidate_ids: [],
      rejected_candidate_ids: [],
      merged_groups: [],
      proposed_project_fields: {
        identity: {},
        attributes_facts: {},
        relationships: {},
        geography: {},
        temporal: {},
      },

      unresolved_items: [],

      notes: [],
    },

    generated_at:
      new Date().toISOString(),
  };

  const reviewPackageKey =
    `${basePath}/review/semantic-review-package.json`;

  await putJson(
    reviewPackageKey,
    reviewPackage
  );

  master.validation =
    master.validation || {};

  master.validation.semantic_review_package_key =
    reviewPackageKey;

  master.validation.semantic_review_status =
    "package_ready";

  await putJson(
    masterKey,
    master
  );

  manifest.processing.semantic_review_package =
    "complete";

  manifest.import.status =
    "semantic_review_package_ready";

  manifest.semantic_review = {
    object_key:
      reviewPackageKey,

    candidate_count:
      reviewItems.length,

    cluster_count:
      reviewPackage.totals.clusters,
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "SEMANTIC REVIEW PACKAGE: PASS"
  );

  console.log(
    `REVIEW CANDIDATES: ${reviewItems.length}`
  );

  console.log(
    `PAGE GROUPS: ${pagePackages.length}`
  );

  console.log(
    `CLUSTERS: ${reviewPackage.totals.clusters}`
  );

  console.log(
    `PACKAGE: ${reviewPackageKey}`
  );

  console.log(
    "AI CALL: NOT YET"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: READY FOR SEMANTIC REVIEW"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "SEMANTIC REVIEW PACKAGE: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}