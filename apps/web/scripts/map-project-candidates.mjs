import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\map-project-candidates.mjs "<manifest-key>"'
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

const PROJECT_CATEGORIES = [
  "Buildings",
  "Infrastructure",
  "Transport",
  "Urban & Cities",
  "Industrial & Energy",
  "Landscape & Public Realm",
];

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

function extractMetrics(text = "") {
  const results = [];

  const regex =
    /(\d+(?:\.\d+)?)\s*(mm|cm|m|metre|meter|m²|sqm|mpa|kn|kg|tonne|ton|%)/gi;

  let match;

  while ((match = regex.exec(text)) !== null) {
    results.push({
      value: Number(match[1]),
      unit: match[2],
      raw: match[0],
    });
  }

  return results;
}

function mapDimension(candidate) {
  const text =
    candidate.candidate_fact.toLowerCase();

  if (
    candidate.fact_type === "date_or_time"
  ) {
    return "temporal";
  }

  if (
    candidate.fact_type === "technical_metric"
  ) {
    return "attributes_facts";
  }

  if (
    candidate.fact_type === "material"
  ) {
    return "attributes_facts";
  }

  if (
    candidate.fact_type === "condition"
  ) {
    return "attributes_facts";
  }

  if (
    candidate.fact_type === "action_or_recommendation"
  ) {
    return "attributes_facts";
  }

  if (
    candidate.fact_type === "technical_description"
  ) {
    return "attributes_facts";
  }

  if (
    /(architect|engineer|consultant|contractor|developer|client|owner|supplier|manufacturer)/i.test(
      text
    )
  ) {
    return "relationships";
  }

  if (
    /(located|location|address|city|district|state|country|site at|situated)/i.test(
      text
    )
  ) {
    return "geography";
  }

  return "attributes_facts";
}

function mapAttributeGroup(candidate) {
  const text =
    candidate.candidate_fact.toLowerCase();

  if (
    candidate.fact_type === "technical_metric"
  ) {
    return "metrics";
  }

  if (
    candidate.fact_type === "material"
  ) {
    return "materials";
  }

  if (
    candidate.fact_type === "condition"
  ) {
    return "conditions";
  }

  if (
    candidate.fact_type === "action_or_recommendation"
  ) {
    return "actions";
  }

  if (
    /(structural|column|beam|slab|foundation|wall|footing)/i.test(
      text
    )
  ) {
    return "systems";
  }

  if (
    /(performance|capacity|strength|load|resistance)/i.test(
      text
    )
  ) {
    return "performance";
  }

  return "technical_notes";
}

try {
  const manifest =
    await getJson(manifestKey);

  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const candidatesKey =
    `${basePath}/processed/fact-candidates.json`;

  const evidenceKey =
    `${basePath}/evidence/evidence-index.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const candidateDoc =
    await getJson(candidatesKey);

  const evidenceIndex =
    await getJson(evidenceKey);

  const master =
    await getJson(masterKey);

  if (
    master.identity.category &&
    !PROJECT_CATEGORIES.includes(
      master.identity.category
    )
  ) {
    throw new Error(
      `Invalid Project category: ${master.identity.category}`
    );
  }

  const mapped = {
    identity: [],
    attributes_facts: {
      metrics: [],
      materials: [],
      conditions: [],
      actions: [],
      systems: [],
      performance: [],
      technical_notes: [],
    },
    relationships: [],
    geography: [],
    temporal: [],
    sources: [],
    evidence: [],
    documents_media: [],
    rights: [],
    publication: [],
    activity_signals: [],
    contextual_connections: [],
  };

  const reviewQueue = [];

  for (
    const candidate of
      candidateDoc.candidates || []
  ) {
    const dimension =
      mapDimension(candidate);

    const mappedItem = {
      candidate_id: candidate.id,

      text:
        candidate.candidate_fact,

      confidence:
        candidate.confidence,

      source_page:
        candidate.source.page,

      evidence_ref:
        candidate.id,

      status:
        "candidate",

      review_required:
        true,
    };

    if (
      dimension === "attributes_facts"
    ) {
      const group =
        mapAttributeGroup(candidate);

      if (group === "metrics") {
        mappedItem.metrics =
          extractMetrics(
            candidate.candidate_fact
          );
      }

      mapped.attributes_facts[
        group
      ].push(mappedItem);
    } else {
      mapped[dimension].push(
        mappedItem
      );
    }

    reviewQueue.push({
      candidate_id:
        candidate.id,

      dimension,

      confidence:
        candidate.confidence,

      source_page:
        candidate.source.page,

      priority:
        candidate.confidence >= 0.85
          ? "high"
          : candidate.confidence >= 0.7
          ? "medium"
          : "low",

      status:
        "pending_review",
    });
  }

  const mappedKey =
    `${basePath}/processed/mapped-project-candidates.json`;

  const reviewKey =
    `${basePath}/review/review-queue.json`;

  const mappedDocument = {
    schema:
      "arknoz-project-candidate-map-v1",

    import_id:
      manifest.import.id,

    project_category:
      master.identity.category,

    project_type:
      master.identity.type,

    project_subtype:
      master.identity.subtype,

    dimensions: mapped,

    candidate_count:
      candidateDoc.candidate_count,

    auto_approved_count: 0,

    generated_at:
      new Date().toISOString(),
  };

  const reviewDocument = {
    schema:
      "arknoz-review-queue-v1",

    import_id:
      manifest.import.id,

    total:
      reviewQueue.length,

    high_priority:
      reviewQueue.filter(
        (x) =>
          x.priority === "high"
      ).length,

    medium_priority:
      reviewQueue.filter(
        (x) =>
          x.priority === "medium"
      ).length,

    low_priority:
      reviewQueue.filter(
        (x) =>
          x.priority === "low"
      ).length,

    items:
      reviewQueue,

    generated_at:
      new Date().toISOString(),
  };

  await putJson(
    mappedKey,
    mappedDocument
  );

  await putJson(
    reviewKey,
    reviewDocument
  );

  master.candidate_data =
    mapped;

  master.validation =
    master.validation || {};

  master.validation.fact_candidates =
    candidateDoc.candidate_count;

  master.validation.auto_approved_facts =
    0;

  master.validation.review_queue_key =
    reviewKey;

  master.validation.mapped_candidates_key =
    mappedKey;

  master.validation.ready_for_validation =
    true;

  master.publication.status =
    "private";

  master.publication.allowed =
    false;

  await putJson(
    masterKey,
    master
  );

  evidenceIndex.status =
    "mapped_to_project_master";

  evidenceIndex.updated_at =
    new Date().toISOString();

  await putJson(
    evidenceKey,
    evidenceIndex
  );

  manifest.processing.candidate_mapping =
    "complete";

  manifest.import.status =
    "mapped_candidates_ready";

  manifest.review = {
    queue_key: reviewKey,
    total: reviewQueue.length,
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "PROJECT CANDIDATE MAPPING: PASS"
  );

  console.log(
    `TOTAL CANDIDATES: ${reviewQueue.length}`
  );

  console.log(
    `HIGH: ${reviewDocument.high_priority}`
  );

  console.log(
    `MEDIUM: ${reviewDocument.medium_priority}`
  );

  console.log(
    `LOW: ${reviewDocument.low_priority}`
  );

  console.log(
    `MAPPED DATA: ${mappedKey}`
  );

  console.log(
    `REVIEW QUEUE: ${reviewKey}`
  );

  console.log(
    "AUTO-APPROVED: 0"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: READY FOR VALIDATION"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "PROJECT CANDIDATE MAPPING: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}