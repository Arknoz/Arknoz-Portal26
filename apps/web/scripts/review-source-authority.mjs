import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\review-source-authority.mjs "<manifest-key>"'
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
  const response = await r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const buffer = await bodyToBuffer(response.Body);
  return JSON.parse(buffer.toString("utf8"));
}

async function putJson(key, value) {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(value, null, 2),
      ContentType: "application/json",
    })
  );
}

try {
  const manifest = await getJson(manifestKey);

  const basePath =
    manifestKey.replace(/\/manifest\.json$/, "");

  const declarationKey =
    `${basePath}/authority/source-declaration.json`;

  const reviewKey =
    `${basePath}/authority/authority-review.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const publicationGateKey =
    `${basePath}/publication/publication-gate.json`;

  const declaration =
    await getJson(declarationKey);

  const master =
    await getJson(masterKey);

  const publicationGate =
    await getJson(publicationGateKey);

  const issues = [];

  if (
    declaration?.rights?.declaration_received !== true
  ) {
    issues.push(
      "declaration_not_received"
    );
  }

  if (
    declaration?.contributor?.identity_verified !== true
  ) {
    issues.push(
      "contributor_identity_not_verified"
    );
  }

  if (
    declaration?.contributor?.role_verified !== true
  ) {
    issues.push(
      "contributor_role_not_verified"
    );
  }

  if (
    declaration?.verification?.authority_verified !== true
  ) {
    issues.push(
      "source_authority_not_verified"
    );
  }

  if (
    declaration?.verification?.rights_verified !== true
  ) {
    issues.push(
      "rights_not_verified"
    );
  }

  const factualDataAllowed =
    declaration
      ?.permissions
      ?.arknoz_may_publish_extracted_facts === true;

  const documentDisplayAllowed =
    declaration
      ?.permissions
      ?.arknoz_may_display_document === true;

  const documentDownloadAllowed =
    declaration
      ?.permissions
      ?.arknoz_may_offer_document_download === true;

  const imageDisplayAllowed =
    declaration
      ?.permissions
      ?.arknoz_may_display_images === true;

  const drawingDisplayAllowed =
    declaration
      ?.permissions
      ?.arknoz_may_display_drawings === true;

  if (!factualDataAllowed) {
    issues.push(
      "factual_data_publication_not_granted"
    );
  }

  const authorityReady =
    declaration
      ?.verification
      ?.authority_verified === true;

  const rightsReady =
    declaration
      ?.verification
      ?.rights_verified === true;

  const projectRecordAllowed =
    authorityReady &&
    rightsReady &&
    factualDataAllowed;

  const review = {
    schema:
      "arknoz-authority-review-v1",

    import_id:
      manifest.import.id,

    source_classification:
      declaration
        ?.source_classification
        ?.type || "unknown",

    authority: {
      declaration_received:
        declaration
          ?.rights
          ?.declaration_received === true,

      identity_verified:
        declaration
          ?.contributor
          ?.identity_verified === true,

      role_verified:
        declaration
          ?.contributor
          ?.role_verified === true,

      authority_verified:
        authorityReady,

      rights_verified:
        rightsReady,
    },

    permissions: {
      publish_extracted_facts:
        factualDataAllowed,

      display_document:
        documentDisplayAllowed,

      download_document:
        documentDownloadAllowed,

      display_images:
        imageDisplayAllowed,

      display_drawings:
        drawingDisplayAllowed,
    },

    decisions: {
      project_record_allowed:
        projectRecordAllowed,

      factual_data_allowed:
        projectRecordAllowed,

      document_display_allowed:
        projectRecordAllowed &&
        documentDisplayAllowed,

      document_download_allowed:
        projectRecordAllowed &&
        documentDownloadAllowed,

      image_display_allowed:
        projectRecordAllowed &&
        imageDisplayAllowed,

      drawing_display_allowed:
        projectRecordAllowed &&
        drawingDisplayAllowed,
    },

    issues,

    status:
      issues.length === 0
        ? "authority_and_rights_ready"
        : "blocked",

    reviewed_at:
      new Date().toISOString(),
  };

  await putJson(
    reviewKey,
    review
  );

  master.source_authority =
    master.source_authority || {};

  master.source_authority.review_key =
    reviewKey;

  master.source_authority.authority_verified =
    authorityReady;

  master.source_authority.rights_verified =
    rightsReady;

  master.publication =
    master.publication || {};

  master.publication.allowed =
    projectRecordAllowed;

  master.publication.status =
    projectRecordAllowed
      ? "eligible_for_publication_review"
      : "blocked";

  await putJson(
    masterKey,
    master
  );

  publicationGate.gate =
    publicationGate.gate || {};

  publicationGate.gate.project_publication_allowed =
    projectRecordAllowed;

  publicationGate.gate.document_publication_allowed =
    projectRecordAllowed &&
    documentDisplayAllowed;

  publicationGate.gate.media_publication_allowed =
    projectRecordAllowed &&
    (
      imageDisplayAllowed ||
      drawingDisplayAllowed
    );

  publicationGate.authority_review_key =
    reviewKey;

  publicationGate.updated_at =
    new Date().toISOString();

  await putJson(
    publicationGateKey,
    publicationGate
  );

  manifest.processing =
    manifest.processing || {};

  manifest.processing.authority_review =
    "complete";

  manifest.import.status =
    projectRecordAllowed
      ? "authority_and_rights_ready"
      : "authority_or_rights_blocked";

  manifest.authority =
    manifest.authority || {};

  manifest.authority.review_key =
    reviewKey;

  manifest.authority.project_record_allowed =
    projectRecordAllowed;

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ AUTHORITY REVIEW: PASS"
  );

  console.log(
    `DECLARATION RECEIVED: ${
      review.authority.declaration_received
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `AUTHORITY VERIFIED: ${
      authorityReady
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `RIGHTS VERIFIED: ${
      rightsReady
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `FACT PUBLICATION PERMISSION: ${
      factualDataAllowed
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `PROJECT RECORD ALLOWED: ${
      projectRecordAllowed
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `ISSUES: ${issues.length}`
  );

  console.log(
    `REVIEW: ${reviewKey}`
  );

  console.log(
    `STATUS: ${review.status.toUpperCase()}`
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ AUTHORITY REVIEW: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}