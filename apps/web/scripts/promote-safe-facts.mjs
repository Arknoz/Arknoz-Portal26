import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\promote-safe-facts.mjs "<manifest-key>"'
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
  return JSON.parse(buffer.toString("utf8"));
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

function isSafe(candidate) {
  if (
    candidate?.validation?.decision !==
    "promotion_candidate"
  ) {
    return false;
  }

  if (
    typeof candidate.confidence !== "number" ||
    candidate.confidence < 0.85
  ) {
    return false;
  }

  if (!candidate?.source?.page) {
    return false;
  }

  if (!candidate?.source?.page_text_sha256) {
    return false;
  }

  const text =
    candidate.candidate_fact || "";

  if (text.length < 35) {
    return false;
  }

  // Recommendations are not treated as established project facts.
  if (
    /\b(recommend|recommended|propose|proposed|should|shall be provided|to be provided|suggest)\b/i.test(
      text
    )
  ) {
    return false;
  }

  return true;
}

try {
  const manifest = await getJson(manifestKey);

  const basePath =
    manifestKey.replace(/\/manifest\.json$/, "");

  const qcKey =
    `${basePath}/review/quality-control.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const evidenceKey =
    `${basePath}/evidence/evidence-index.json`;

  const qc = await getJson(qcKey);
  const master = await getJson(masterKey);
  const evidence = await getJson(evidenceKey);

  const safeFacts =
    (qc.promotion_candidates || []).filter(
      isSafe
    );

  const provisionalFacts =
    safeFacts.map((candidate) => ({
      fact_id: candidate.id,

      fact_type:
        candidate.fact_type,

      value:
        candidate.candidate_fact,

      confidence:
        candidate.confidence,

      evidence: {
        source_object_key:
          candidate.source.object_key,

        source_page:
          candidate.source.page,

        page_text_sha256:
          candidate.source.page_text_sha256,
      },

      status:
        "provisional",

      verified:
        false,

      publication_allowed:
        false,

      review_required:
        true,
    }));

  master.provisional_facts =
    provisionalFacts;

  master.validation =
    master.validation || {};

  master.validation.provisional_fact_count =
    provisionalFacts.length;

  master.validation.verified_fact_count =
    0;

  master.validation.safe_promotion_complete =
    true;

  master.publication.status =
    "private";

  master.publication.allowed =
    false;

  await putJson(
    masterKey,
    master
  );

  evidence.status =
    "safe_promotion_complete";

  evidence.provisional_fact_ids =
    provisionalFacts.map(
      (fact) => fact.fact_id
    );

  evidence.updated_at =
    new Date().toISOString();

  await putJson(
    evidenceKey,
    evidence
  );

  const promotionKey =
    `${basePath}/review/safe-promotion.json`;

  await putJson(
    promotionKey,
    {
      schema:
        "arknoz-safe-promotion-v1",

      import_id:
        manifest.import.id,

      promotion_candidate_count:
        (qc.promotion_candidates || [])
          .length,

      safely_promoted_count:
        provisionalFacts.length,

      verified_count: 0,

      provisional_facts:
        provisionalFacts,

      safeguards: {
        fact_level_evidence_required:
          true,

        source_page_required:
          true,

        page_hash_required:
          true,

        recommendation_filter:
          true,

        auto_verified:
          false,

        publication_allowed:
          false,
      },

      generated_at:
        new Date().toISOString(),
    }
  );

  manifest.processing.safe_promotion =
    "complete";

  manifest.import.status =
    "provisional_facts_ready";

  manifest.safe_promotion = {
    object_key: promotionKey,
    provisional_fact_count:
      provisionalFacts.length,
    verified_fact_count: 0,
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ SAFE PROMOTION: PASS"
  );

  console.log(
    `QC PROMOTION CANDIDATES: ${
      (qc.promotion_candidates || []).length
    }`
  );

  console.log(
    `PROVISIONAL FACTS: ${provisionalFacts.length}`
  );

  console.log(
    "VERIFIED FACTS: 0"
  );

  console.log(
    `PROMOTION FILE: ${promotionKey}`
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: PROVISIONAL FACTS READY"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ SAFE PROMOTION: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}