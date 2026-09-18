import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\publication-gate.mjs "<manifest-key>"'
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

try {
  const manifest =
    await getJson(manifestKey);

  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const verificationKey =
    `${basePath}/verified/source-verification.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const gateKey =
    `${basePath}/publication/publication-gate.json`;

  const verification =
    await getJson(
      verificationKey
    );

  const master =
    await getJson(
      masterKey
    );

  const sourceVerifiedFacts =
    verification
      ?.source_verified_facts ||
    [];

  //
  // DEFAULT SOURCE ASSESSMENT
  //
  // Uploaded documents stay conservative
  // until Arknoz knows who supplied them
  // and what authority/rights they have.
  //

  const sourceAssessment = {
    source_class:
      "contributor_supplied",

    authority_status:
      "unverified",

    contributor_identity_verified:
      false,

    contributor_role_verified:
      false,

    authoritative_source:
      false,

    independent_corroboration:
      false,
  };

  const rightsAssessment = {
    document_storage_allowed:
      true,

    document_analysis_allowed:
      true,

    document_public_display_allowed:
      false,

    document_public_download_allowed:
      false,

    extracted_factual_data_publication_rights:
      "unknown",

    status:
      "unknown",

    review_required:
      true,
  };

  const publishableFacts = [];

  const blockedFacts =
    sourceVerifiedFacts.map(
      (fact) => ({
        fact_id:
          fact.fact_id,

        field:
          fact.field,

        value:
          fact.value,

        source_verification:
          fact.verification,

        publication_status:
          "blocked",

        reasons: [
          "source_authority_not_verified",
          "publication_rights_not_confirmed",
        ],
      })
    );

  //
  // RECORD STATUS
  //

  const publicationReady =
    sourceVerifiedFacts.length > 0 &&
    sourceAssessment.authority_status ===
      "verified" &&
    rightsAssessment
      .extracted_factual_data_publication_rights ===
      "allowed" &&
    blockedFacts.length === 0;

  const gate = {
    schema:
      "arknoz-publication-gate-v1",

    import_id:
      manifest.import.id,

    source_assessment:
      sourceAssessment,

    rights_assessment:
      rightsAssessment,

    facts: {
      source_verified:
        sourceVerifiedFacts.length,

      independently_verified:
        0,

      publishable:
        publishableFacts.length,

      blocked:
        blockedFacts.length,
    },

    publishable_facts:
      publishableFacts,

    blocked_facts:
      blockedFacts,

    gate: {
      publication_ready:
        publicationReady,

      project_publication_allowed:
        false,

      document_publication_allowed:
        false,

      media_publication_allowed:
        false,
    },

    required_next_actions: [
      "Verify source/contributor authority",
      "Establish publication rights",
      "Resolve any facts still held for review",
      "Independently corroborate important public facts where appropriate",
    ],

    generated_at:
      new Date().toISOString(),
  };

  await putJson(
    gateKey,
    gate
  );

  //
  // UPDATE PROJECT MASTER
  //

  master.source_authority =
    sourceAssessment;

  master.rights =
    {
      ...(master.rights || {}),
      ...rightsAssessment,
    };

  master.publication =
    master.publication || {};

  master.publication.status =
    "blocked";

  master.publication.allowed =
    false;

  master.publication.gate_key =
    gateKey;

  master.publication.publishable_fact_count =
    0;

  master.publication.blocked_fact_count =
    blockedFacts.length;

  await putJson(
    masterKey,
    master
  );

  //
  // UPDATE MANIFEST
  //

  manifest.processing =
    manifest.processing || {};

  manifest.processing.publication_gate =
    "complete";

  manifest.import.status =
    "publication_blocked_pending_authority_and_rights";

  manifest.publication_gate = {
    object_key:
      gateKey,

    source_verified:
      sourceVerifiedFacts.length,

    publishable:
      0,

    blocked:
      blockedFacts.length,

    publication_ready:
      false,
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ PUBLICATION GATE: PASS"
  );

  console.log(
    `SOURCE-VERIFIED FACTS: ${sourceVerifiedFacts.length}`
  );

  console.log(
    "SOURCE AUTHORITY: UNVERIFIED"
  );

  console.log(
    "RIGHTS: UNKNOWN"
  );

  console.log(
    `PUBLISHABLE FACTS: ${publishableFacts.length}`
  );

  console.log(
    `BLOCKED FACTS: ${blockedFacts.length}`
  );

  console.log(
    `GATE FILE: ${gateKey}`
  );

  console.log(
    "PROJECT PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: AWAITING AUTHORITY / RIGHTS"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ PUBLICATION GATE: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}