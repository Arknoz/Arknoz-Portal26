import crypto from "node:crypto";

import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
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

const ALLOWED_EXTENSIONS =
  new Set(Object.keys(MIME_BY_EXTENSION));

const DEFAULT_MAX_BYTES =
  50 * 1024 * 1024;

const CONTRIBUTION_TYPES =
  new Set([
    "projects",
    "products",
    "knowledge",
    "organisations",
    "education",
    "opportunities",
  ]);

const ENTITY_TYPE_BY_CONTRIBUTION: Record<
  string,
  string
> = {
  projects: "project",
  products: "product",
  knowledge: "knowledge",
  organisations: "organisation",
  education: "education",
  opportunities: "opportunity",
};

function maxUploadBytes() {
  const configured =
    Number(
      process.env.ARKNOZ_MAX_UPLOAD_BYTES
    );

  if (
    Number.isFinite(configured) &&
    configured > 0
  ) {
    return configured;
  }

  return DEFAULT_MAX_BYTES;
}

function safeFilename(
  originalName: string
) {
  const normalized =
    originalName
      .toLowerCase()
      .replace(
        /[^a-z0-9._-]+/g,
        "-"
      )
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  return normalized || "source-file";
}

function extensionOf(
  filename: string
) {
  const lower =
    filename.toLowerCase();

  const dotIndex =
    lower.lastIndexOf(".");

  return dotIndex >= 0
    ? lower.slice(dotIndex)
    : "";
}

function validManifestKey(
  key: string
) {
  return /^incoming\/\d{4}\/\d{2}\/[0-9a-f-]+\/manifest\.json$/i.test(
    key
  );
}

async function readJsonObject(
  key: string
) {
  const response =
    await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

  if (!response.Body) {
    throw new Error(
      `R2 object has no body: ${key}`
    );
  }

  const text =
    await response.Body.transformToString();

  return JSON.parse(text);
}

async function writeJsonObject(
  key: string,
  value: unknown
) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body:
        JSON.stringify(
          value,
          null,
          2
        ),
      ContentType:
        "application/json",
    })
  );
}

async function sha256Object(
  key: string
) {
  const response =
    await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

  if (!response.Body) {
    throw new Error(
      "Uploaded source could not be read."
    );
  }

  const bytes =
    await response.Body
      .transformToByteArray();

  return crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
}

function normalizeDetails(
  input: unknown
): Record<string, unknown> {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return {};
  }

  const serialized =
    JSON.stringify(input);

  if (
    Buffer.byteLength(
      serialized,
      "utf8"
    ) >
    64 * 1024
  ) {
    throw new Error(
      "Contribution details are too large."
    );
  }

  return JSON.parse(
    serialized
  ) as Record<string, unknown>;
}

async function getOwnedStoredManifest(
  manifestKey: string,
  contributorUserId: string
) {
  const key =
    String(
      manifestKey || ""
    ).trim();

  if (!validManifestKey(key)) {
    throw new Error(
      "Invalid contribution manifest."
    );
  }

  const manifest =
    await readJsonObject(key);

  if (
    manifest?.submission
      ?.contributor_user_id !==
    contributorUserId
  ) {
    throw new Error(
      "You do not own this contribution."
    );
  }

  if (
    manifest?.import?.status !==
    "source_stored"
  ) {
    throw new Error(
      "Source upload must be completed before submission."
    );
  }

  return {
    key,
    manifest,
  };
}

export type CreateUploadInput = {
  originalFilename: string;
  declaredSizeBytes: number;
  contributorUserId: string;
};

export async function createContributionUpload(
  input: CreateUploadInput
) {
  const originalName =
    String(
      input.originalFilename || ""
    ).trim();

  if (!originalName) {
    throw new Error(
      "Filename is required."
    );
  }

  const sizeBytes =
    Number(
      input.declaredSizeBytes
    );

  if (
    !Number.isFinite(sizeBytes) ||
    sizeBytes <= 0
  ) {
    throw new Error(
      "Invalid file size."
    );
  }

  if (
    sizeBytes >
    maxUploadBytes()
  ) {
    throw new Error(
      "File exceeds Arknoz upload limit."
    );
  }

  const extension =
    extensionOf(originalName);

  if (
    !ALLOWED_EXTENSIONS.has(
      extension
    )
  ) {
    throw new Error(
      "This file type is not supported."
    );
  }

  const mimeType =
    MIME_BY_EXTENSION[
      extension
    ];

  const now =
    new Date();

  const importId =
    crypto.randomUUID();

  const year =
    String(
      now.getUTCFullYear()
    );

  const month =
    String(
      now.getUTCMonth() + 1
    ).padStart(2, "0");

  const storedFilename =
    safeFilename(
      originalName
    );

  const basePath =
    `incoming/${year}/${month}/${importId}`;

  const sourceKey =
    `${basePath}/original/${storedFilename}`;

  const manifestKey =
    `${basePath}/manifest.json`;

  const provisionalManifest = {
    schema:
      "arknoz-ingest-manifest-v2",

    import: {
      id: importId,
      created_at:
        now.toISOString(),
      status:
        "awaiting_source_upload",
    },

    source: {
      original_filename:
        originalName,

      stored_filename:
        storedFilename,

      extension,

      mime_type:
        mimeType,

      declared_size_bytes:
        sizeBytes,

      size_bytes:
        null,

      sha256:
        null,

      bucket,

      object_key:
        sourceKey,
    },

    submission: {
      contributor_user_id:
        input.contributorUserId,

      source:
        "arknoz_web_contribution",

      upload_status:
        "pending",

      review_status:
        "draft",
    },

    classification: {
      entity_type:
        null,

      category:
        null,

      type:
        null,

      subtype:
        null,

      confidence:
        null,

      status:
        "not_processed",
    },

    evidence: {
      extraction_status:
        "not_processed",

      evidence_count:
        0,

      manifest_keys:
        [],
    },

    rights: {
      status:
        "unknown",

      public_display_allowed:
        false,

      public_download_allowed:
        false,

      review_required:
        true,
    },

    publication: {
      status:
        "private",

      allowed:
        false,
    },

    review: {
      match_status:
        "pending",

      canonical_entity_id:
        null,

      decision:
        "pending",
    },

    processing: {
      extraction:
        "pending",

      classification:
        "pending",

      relationships:
        "pending",

      evidence_mapping:
        "pending",

      rights_review:
        "pending",
    },
  };

  await writeJsonObject(
    manifestKey,
    provisionalManifest
  );

  const uploadCommand =
    new PutObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
      ContentType:
        mimeType,
    });

  const uploadUrl =
    await getSignedUrl(
      client,
      uploadCommand,
      {
        expiresIn:
          15 * 60,
      }
    );

  return {
    importId,
    manifestKey,
    sourceKey,

    originalFilename:
      originalName,

    mimeType,

    declaredSizeBytes:
      sizeBytes,

    uploadUrl,

    uploadHeaders: {
      "Content-Type":
        mimeType,
    },

    expiresInSeconds:
      15 * 60,
  };
}

export async function finalizeContributionUpload(
  manifestKey: string,
  contributorUserId: string
) {
  const key =
    String(
      manifestKey || ""
    ).trim();

  if (!validManifestKey(key)) {
    throw new Error(
      "Invalid contribution manifest."
    );
  }

  const manifest =
    await readJsonObject(key);

  if (
    manifest?.submission
      ?.contributor_user_id !==
    contributorUserId
  ) {
    throw new Error(
      "You do not own this contribution."
    );
  }

  if (
    manifest?.import?.status ===
    "source_stored"
  ) {
    return manifest;
  }

  const sourceKey =
    manifest?.source
      ?.object_key;

  if (!sourceKey) {
    throw new Error(
      "Contribution source key is missing."
    );
  }

  const head =
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: sourceKey,
      })
    );

  const actualSize =
    Number(
      head.ContentLength || 0
    );

  const declaredSize =
    Number(
      manifest?.source
        ?.declared_size_bytes ||
        0
    );

  if (actualSize <= 0) {
    throw new Error(
      "Uploaded source is empty."
    );
  }

  if (
    declaredSize > 0 &&
    actualSize !==
      declaredSize
  ) {
    throw new Error(
      "Uploaded file size does not match the declared source."
    );
  }

  if (
    actualSize >
    maxUploadBytes()
  ) {
    throw new Error(
      "Uploaded source exceeds Arknoz upload limit."
    );
  }

  const sha256 =
    await sha256Object(
      sourceKey
    );

  const finalizedAt =
    new Date()
      .toISOString();

  manifest.import.status =
    "source_stored";

  manifest.source.size_bytes =
    actualSize;

  manifest.source.sha256 =
    sha256;

  delete manifest.source
    .declared_size_bytes;

  manifest.submission
    .upload_status =
    "complete";

  manifest.submission
    .uploaded_at =
    finalizedAt;

  manifest.updated_at =
    finalizedAt;

  manifest.rights = {
    status:
      "unknown",

    public_display_allowed:
      false,

    public_download_allowed:
      false,

    review_required:
      true,
  };

  manifest.publication = {
    status:
      "private",

    allowed:
      false,
  };

  await writeJsonObject(
    key,
    manifest
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: sourceKey,
    })
  );

  return manifest;
}

export async function submitContributionForAdminReview(
  input: {
    manifestKey: string;

    contributorUserId:
      string;

    contributionType:
      string;

    declarationAccepted:
      boolean;

    details?:
      Record<
        string,
        unknown
      >;

    supportingManifestKeys?:
      string[];
  }
) {
  const contributionType =
    String(
      input.contributionType ||
        ""
    ).trim();

  if (
    !CONTRIBUTION_TYPES.has(
      contributionType
    )
  ) {
    throw new Error(
      "Select a valid Arknoz contribution type."
    );
  }

  if (
    input.declarationAccepted !==
    true
  ) {
    throw new Error(
      "Contributor declaration must be accepted."
    );
  }

  const primary =
    await getOwnedStoredManifest(
      input.manifestKey,
      input.contributorUserId
    );

  const supportingKeys =
    Array.from(
      new Set(
        (
          input
            .supportingManifestKeys ??
          []
        )
          .map((item) =>
            String(
              item || ""
            ).trim()
          )
          .filter(Boolean)
          .filter(
            (item) =>
              item !==
              primary.key
          )
      )
    );

  if (
    supportingKeys.length >
    9
  ) {
    throw new Error(
      "A contribution can include a maximum of 10 evidence files."
    );
  }

  const supporting =
    [];

  for (
    const supportingKey
    of supportingKeys
  ) {
    supporting.push(
      await getOwnedStoredManifest(
        supportingKey,
        input.contributorUserId
      )
    );
  }

  const details =
    normalizeDetails(
      input.details
    );

  const title =
    String(
      details.title || ""
    ).trim();

  const summary =
    String(
      details.summary || ""
    ).trim();

  const relationship =
    String(
      details.relationship ||
        ""
    ).trim();

  if (!title) {
    throw new Error(
      "Contribution title is required."
    );
  }

  if (!summary) {
    throw new Error(
      "Contribution summary is required."
    );
  }

  if (!relationship) {
    throw new Error(
      "Your relationship to the contribution is required."
    );
  }

  const submittedAt =
    new Date()
      .toISOString();

  const evidenceKeys = [
    primary.key,
    ...supportingKeys,
  ];

  const manifest =
    primary.manifest;

  manifest.schema =
    "arknoz-ingest-manifest-v2";

  manifest.submission = {
    ...manifest.submission,

    contribution_type:
      contributionType,

    target_entity_type:
      ENTITY_TYPE_BY_CONTRIBUTION[
        contributionType
      ],

    details,

    contributor_declaration: {
      accepted:
        true,

      accepted_at:
        submittedAt,

      version:
        "arknoz-contributor-declaration-v2",

      responsibility_confirmed:
        true,

      source_authority_or_permission_confirmed:
        true,
    },

    review_status:
      "submitted_for_admin_review",

    submitted_at:
      submittedAt,
  };

  manifest.classification = {
    ...manifest.classification,

    entity_type:
      ENTITY_TYPE_BY_CONTRIBUTION[
        contributionType
      ],

    status:
      "pending_review",
  };

  manifest.evidence = {
    ...manifest.evidence,

    evidence_count:
      evidenceKeys.length,

    manifest_keys:
      evidenceKeys,
  };

  manifest.rights = {
    ...manifest.rights,

    status:
      manifest?.rights
        ?.status ||
      "unknown",

    public_display_allowed:
      false,

    public_download_allowed:
      false,

    review_required:
      true,
  };

  manifest.publication = {
    status:
      "private",

    allowed:
      false,
  };

  manifest.review = {
    match_status:
      "pending",

    canonical_entity_id:
      null,

    decision:
      "pending",
  };

  manifest.updated_at =
    submittedAt;

  await writeJsonObject(
    primary.key,
    manifest
  );

  for (
    const evidence
    of supporting
  ) {
    evidence.manifest.submission = {
      ...evidence
        .manifest
        .submission,

      contribution_type:
        contributionType,

      parent_manifest_key:
        primary.key,

      review_status:
        "attached_evidence",
    };

    evidence.manifest
      .publication = {
        status:
          "private",

        allowed:
          false,
      };

    evidence.manifest
      .updated_at =
      submittedAt;

    await writeJsonObject(
      evidence.key,
      evidence.manifest
    );
  }

  const indexKey =
    `contributors/${input.contributorUserId}/${manifest.import.id}.json`;

  await writeJsonObject(
    indexKey,
    {
      manifest_key:
        primary.key,

      import_id:
        manifest.import.id,

      submitted_at:
        submittedAt,
    }
  );

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: primary.key,
    })
  );

  return manifest;
}

export type ContributorSubmissionSummary = {
  importId: string;
  manifestKey: string;
  contributionType: string;
  targetEntityType: string | null;
  title: string;
  reviewStatus: string;
  matchStatus: string;
  publicationStatus: string;
  submittedAt: string | null;
  evidenceCount: number;
};

export async function listContributorSubmissions(
  contributorUserId: string
): Promise<
  ContributorSubmissionSummary[]
> {
  const prefix =
    `contributors/${contributorUserId}/`;

  const listing =
    await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: 100,
      })
    );

  const indexKeys =
    (listing.Contents ?? [])
      .map(
        (item) =>
          item.Key
      )
      .filter(
        (
          item
        ): item is string =>
          Boolean(item)
      );

  const results:
    ContributorSubmissionSummary[] =
    [];

  for (
    const indexKey
    of indexKeys
  ) {
    try {
      const index =
        await readJsonObject(
          indexKey
        );

      const manifestKey =
        String(
          index?.manifest_key ||
            ""
        );

      if (
        !validManifestKey(
          manifestKey
        )
      ) {
        continue;
      }

      const manifest =
        await readJsonObject(
          manifestKey
        );

      if (
        manifest?.submission
          ?.contributor_user_id !==
        contributorUserId
      ) {
        continue;
      }

      results.push({
        importId:
          String(
            manifest?.import?.id ||
              ""
          ),

        manifestKey,

        contributionType:
          String(
            manifest
              ?.submission
              ?.contribution_type ||
              ""
          ),

        targetEntityType:
          manifest
            ?.submission
            ?.target_entity_type ??
          null,

        title:
          String(
            manifest
              ?.submission
              ?.details
              ?.title ||
              "Contribution"
          ),

        reviewStatus:
          String(
            manifest
              ?.submission
              ?.review_status ||
              "submitted"
          ),

        matchStatus:
          String(
            manifest
              ?.review
              ?.match_status ||
              "pending"
          ),

        publicationStatus:
          String(
            manifest
              ?.publication
              ?.status ||
              "private"
          ),

        submittedAt:
          manifest
            ?.submission
            ?.submitted_at ??
          null,

        evidenceCount:
          Number(
            manifest
              ?.evidence
              ?.evidence_count ||
              0
          ),
      });
    } catch {
      continue;
    }
  }

  return results.sort(
    (a, b) =>
      String(
        b.submittedAt || ""
      ).localeCompare(
        String(
          a.submittedAt || ""
        )
      )
  );
}