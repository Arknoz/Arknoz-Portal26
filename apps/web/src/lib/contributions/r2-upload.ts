import crypto from "node:crypto";

import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REQUIRED_ENV = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
] as const;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const bucket = process.env.R2_BUCKET_NAME!;

const client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const MIME_BY_EXTENSION: Record<string, string> = {
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".csv": "text/csv",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(MIME_BY_EXTENSION));
const DEFAULT_MAX_BYTES = 50 * 1024 * 1024;

function maxUploadBytes() {
  const configured = Number(process.env.ARKNOZ_MAX_UPLOAD_BYTES);

  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return DEFAULT_MAX_BYTES;
}

function safeFilename(originalName: string) {
  const normalized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "source-file";
}

function extensionOf(filename: string) {
  const lower = filename.toLowerCase();
  const dotIndex = lower.lastIndexOf(".");

  return dotIndex >= 0 ? lower.slice(dotIndex) : "";
}

async function readJsonObject(key: string) {
  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(`R2 object has no body: ${key}`);
  }

  const text = await response.Body.transformToString();
  return JSON.parse(text);
}

async function sha256Object(key: string) {
  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error("Uploaded source could not be read.");
  }

  const bytes = await response.Body.transformToByteArray();

  return crypto.createHash("sha256").update(bytes).digest("hex");
}

export type CreateUploadInput = {
  originalFilename: string;
  declaredSizeBytes: number;
  contributorUserId: string;
};

export async function createContributionUpload(input: CreateUploadInput) {
  const originalName = String(input.originalFilename || "").trim();

  if (!originalName) {
    throw new Error("Filename is required.");
  }

  const sizeBytes = Number(input.declaredSizeBytes);

  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    throw new Error("Invalid file size.");
  }

  if (sizeBytes > maxUploadBytes()) {
    throw new Error("File exceeds Arknoz upload limit.");
  }

  const extension = extensionOf(originalName);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("This file type is not supported.");
  }

  const mimeType = MIME_BY_EXTENSION[extension];
  const now = new Date();
  const importId = crypto.randomUUID();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const storedFilename = safeFilename(originalName);
  const basePath = `incoming/${year}/${month}/${importId}`;
  const sourceKey = `${basePath}/original/${storedFilename}`;
  const manifestKey = `${basePath}/manifest.json`;

  const provisionalManifest = {
    schema: "arknoz-ingest-manifest-v1",
    import: {
      id: importId,
      created_at: now.toISOString(),
      status: "awaiting_source_upload",
    },
    source: {
      original_filename: originalName,
      stored_filename: storedFilename,
      extension,
      mime_type: mimeType,
      declared_size_bytes: sizeBytes,
      size_bytes: null,
      sha256: null,
      bucket,
      object_key: sourceKey,
    },
    submission: {
      contributor_user_id: input.contributorUserId,
      source: "arknoz_web_contribution",
      upload_status: "pending",
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

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: manifestKey,
      Body: JSON.stringify(provisionalManifest, null, 2),
      ContentType: "application/json",
    })
  );

  const uploadCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: sourceKey,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(client, uploadCommand, {
    expiresIn: 15 * 60,
  });

  return {
    importId,
    manifestKey,
    sourceKey,
    originalFilename: originalName,
    mimeType,
    declaredSizeBytes: sizeBytes,
    uploadUrl,
    uploadHeaders: {
      "Content-Type": mimeType,
    },
    expiresInSeconds: 15 * 60,
  };
}

export async function finalizeContributionUpload(
  manifestKey: string,
  contributorUserId: string
) {
  const key = String(manifestKey || "").trim();

  if (!/^incoming\/\d{4}\/\d{2}\/[0-9a-f-]+\/manifest\.json$/i.test(key)) {
    throw new Error("Invalid contribution manifest.");
  }

  const manifest = await readJsonObject(key);

  if (manifest?.submission?.contributor_user_id !== contributorUserId) {
    throw new Error("You do not own this contribution.");
  }

  if (manifest?.import?.status === "source_stored") {
    return manifest;
  }

  const sourceKey = manifest?.source?.object_key;

  if (!sourceKey) {
    throw new Error("Contribution source key is missing.");
  }

  const head = await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
    })
  );

  const actualSize = Number(head.ContentLength || 0);
  const declaredSize = Number(manifest?.source?.declared_size_bytes || 0);

  if (actualSize <= 0) {
    throw new Error("Uploaded source is empty.");
  }

  if (declaredSize > 0 && actualSize !== declaredSize) {
    throw new Error("Uploaded file size does not match the declared source.");
  }

  if (actualSize > maxUploadBytes()) {
    throw new Error("Uploaded source exceeds Arknoz upload limit.");
  }

  const sha256 = await sha256Object(sourceKey);
  const finalizedAt = new Date().toISOString();

  manifest.import.status = "source_stored";
  manifest.source.size_bytes = actualSize;
  manifest.source.sha256 = sha256;
  delete manifest.source.declared_size_bytes;
  manifest.submission.upload_status = "complete";
  manifest.submission.uploaded_at = finalizedAt;
  manifest.updated_at = finalizedAt;

  manifest.rights = {
    status: "unknown",
    public_display_allowed: false,
    public_download_allowed: false,
    review_required: true,
  };

  manifest.publication = {
    status: "private",
    allowed: false,
  };

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(manifest, null, 2),
      ContentType: "application/json",
    })
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
    })
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return manifest;
}

const CONTRIBUTION_TYPES = new Set([
  "projects",
  "products_materials",
  "knowledge_publications",
  "education_learning",
  "jobs_opportunities",
  "people_professionals",
  "organisations",
  "universities_schools",
  "places_geography",
  "community_collaboration",
  "standards_references_data",
  "other_built_world",
]);

export async function submitContributionForAdminReview(input: {
  manifestKey: string;
  contributorUserId: string;
  contributionType: string;
  declarationAccepted: boolean;
}) {
  const manifestKey = String(input.manifestKey || "").trim();
  const contributionType = String(input.contributionType || "").trim();

  if (!/^incoming\/\d{4}\/\d{2}\/[0-9a-f-]+\/manifest\.json$/i.test(manifestKey)) {
    throw new Error("Invalid contribution manifest.");
  }

  if (!CONTRIBUTION_TYPES.has(contributionType)) {
    throw new Error("Select a valid Arknoz contribution type.");
  }

  if (input.declarationAccepted !== true) {
    throw new Error("Contributor declaration must be accepted.");
  }

  const manifest = await readJsonObject(manifestKey);

  if (manifest?.submission?.contributor_user_id !== input.contributorUserId) {
    throw new Error("You do not own this contribution.");
  }

  if (manifest?.import?.status !== "source_stored") {
    throw new Error("Source upload must be completed before submission.");
  }

  const submittedAt = new Date().toISOString();

  manifest.submission = {
    ...manifest.submission,
    contribution_type: contributionType,
    contributor_declaration: {
      accepted: true,
      accepted_at: submittedAt,
      version: "arknoz-contributor-declaration-v1",
      responsibility_confirmed: true,
      source_authority_or_permission_confirmed: true,
    },
    review_status: "submitted_for_admin_review",
    submitted_at: submittedAt,
  };

  manifest.rights = {
    ...manifest.rights,
    status: manifest?.rights?.status || "unknown",
    public_display_allowed: false,
    public_download_allowed: false,
    review_required: true,
  };

  manifest.publication = {
    status: "private",
    allowed: false,
  };

  manifest.updated_at = submittedAt;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: manifestKey,
      Body: JSON.stringify(manifest, null, 2),
      ContentType: "application/json",
    })
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: manifestKey,
    })
  );

  return manifest;
}
