import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const filePath = process.argv[2];

if (!filePath || !fs.existsSync(filePath)) {
  console.error("FAIL: Provide a valid file path.");
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

const client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const now = new Date();
const year = String(now.getUTCFullYear());
const month = String(now.getUTCMonth() + 1).padStart(2, "0");

const importId = crypto.randomUUID();

const originalName = path.basename(filePath);
const extension = path.extname(originalName).toLowerCase();

const safeName = originalName
  .toLowerCase()
  .replace(/[^a-z0-9._-]+/g, "-")
  .replace(/-+/g, "-");

const basePath = `incoming/${year}/${month}/${importId}`;

const sourceKey = `${basePath}/original/${safeName}`;
const manifestKey = `${basePath}/manifest.json`;

const fileBuffer = fs.readFileSync(filePath);

const sha256 = crypto
  .createHash("sha256")
  .update(fileBuffer)
  .digest("hex");

const mimeMap = {
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".csv": "text/csv",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const mimeType =
  mimeMap[extension] || "application/octet-stream";

const manifest = {
  schema: "arknoz-ingest-manifest-v1",

  import: {
    id: importId,
    created_at: now.toISOString(),
    status: "source_stored",
  },

  source: {
    original_filename: originalName,
    stored_filename: safeName,
    extension,
    mime_type: mimeType,
    size_bytes: fileBuffer.length,
    sha256,
    bucket: process.env.R2_BUCKET_NAME,
    object_key: sourceKey,
  },

  classification: {
    entity_type: null,
    category: null,
    type: null,
    subtype: null,
    confidence: null,
    status: "not_processed",
  },

  evidence: {
    extraction_status: "not_processed",
    evidence_count: 0,
  },

  rights: {
    status: "unknown",
    public_display_allowed: false,
    public_download_allowed: false,
    review_required: true,
  },

  publication: {
    status: "private",
    allowed: false,
  },

  processing: {
    extraction: "pending",
    classification: "pending",
    relationships: "pending",
    evidence_mapping: "pending",
    rights_review: "pending",
  },
};

try {
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: sourceKey,
      Body: fileBuffer,
      ContentType: mimeType,
      Metadata: {
        "arknoz-import-id": importId,
        "original-filename": encodeURIComponent(originalName),
      },
    })
  );

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: manifestKey,
      Body: JSON.stringify(manifest, null, 2),
      ContentType: "application/json",
    })
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: sourceKey,
    })
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: manifestKey,
    })
  );

  console.log("");
  console.log("ARKNOZ INGESTION: PASS");
  console.log(`IMPORT ID: ${importId}`);
  console.log(`SOURCE: ${sourceKey}`);
  console.log(`MANIFEST: ${manifestKey}`);
  console.log(`SIZE: ${fileBuffer.length} bytes`);
  console.log(`SHA256: ${sha256}`);
  console.log("RIGHTS: UNKNOWN / PRIVATE");
  console.log("STATUS: READY FOR PROCESSING");
  console.log("");
} catch (error) {
  console.error("ARKNOZ INGESTION: FAIL");
  console.error(error?.name || "Unknown error");
  console.error(error?.message || "");
  process.exit(1);
}