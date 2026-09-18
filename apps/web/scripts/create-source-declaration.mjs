import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\create-source-declaration.mjs "<manifest-key>"'
  );
  process.exit(1);
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

  const declaration = {
    schema: "arknoz-source-declaration-v1",

    import_id: manifest.import.id,

    source: {
      original_filename:
        manifest.source.original_filename,

      object_key:
        manifest.source.object_key,

      sha256:
        manifest.source.sha256,
    },

    contributor: {
      name: null,
      organisation: null,
      email: null,

      relationship_to_project: null,

      identity_verified: false,
      organisation_verified: false,
      role_verified: false,
    },

    source_classification: {
      type: "unknown",

      allowed_values: [
        "project_owner",
        "architect",
        "engineer",
        "contractor",
        "manufacturer",
        "operator",
        "government",
        "institution",
        "authorised_partner",
        "public_authoritative_source",
        "secondary_source",
        "private_upload",
        "unknown"
      ],

      authority_status:
        "unverified",
    },

    permissions: {
      arknoz_may_store_source:
        true,

      arknoz_may_analyse_source:
        true,

      arknoz_may_publish_extracted_facts:
        false,

      arknoz_may_display_document:
        false,

      arknoz_may_offer_document_download:
        false,

      arknoz_may_display_images:
        false,

      arknoz_may_display_drawings:
        false,

      arknoz_may_crop_or_transform_media:
        false,
    },

    rights: {
      declaration_received:
        false,

      rights_holder_confirmed:
        false,

      licence:
        null,

      attribution_required:
        null,

      attribution_text:
        null,

      expiry_date:
        null,

      restrictions: [],
    },

    verification: {
      reviewed_by_arknoz:
        false,

      authority_verified:
        false,

      rights_verified:
        false,

      status:
        "pending",
    },

    publication: {
      factual_data_allowed:
        false,

      document_allowed:
        false,

      media_allowed:
        false,

      project_record_allowed:
        false,
    },

    created_at:
      new Date().toISOString(),
  };

  await putJson(
    declarationKey,
    declaration
  );

  manifest.authority =
    manifest.authority || {};

  manifest.authority.source_declaration_key =
    declarationKey;

  manifest.authority.status =
    "declaration_pending";

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ SOURCE DECLARATION: PASS"
  );

  console.log(
    `DECLARATION: ${declarationKey}`
  );

  console.log(
    "SOURCE AUTHORITY: UNVERIFIED"
  );

  console.log(
    "PUBLICATION RIGHTS: NOT GRANTED"
  );

  console.log(
    "STATUS: DECLARATION PENDING"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ SOURCE DECLARATION: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}