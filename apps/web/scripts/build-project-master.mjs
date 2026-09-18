import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\build-project-master.mjs "<manifest-key>"'
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

const PROJECT_CATEGORIES = [
  "Buildings",
  "Infrastructure",
  "Transport",
  "Urban & Cities",
  "Industrial & Energy",
  "Landscape & Public Realm",
];

async function toBuffer(body) {
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

  const buffer = await toBuffer(result.Body);
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

function guessTitle(filename = "") {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}[_-]?/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function detectProjectType(text = "") {
  const t = text.toLowerCase();

  if (t.includes("residential")) return "Residential";
  if (t.includes("hospital")) return "Healthcare";
  if (t.includes("school")) return "Education";
  if (t.includes("office")) return "Office";

  if (t.includes("railway")) return "Railway Infrastructure";
  if (t.includes("metro")) return "Metro";
  if (t.includes("airport")) return "Airport";
  if (t.includes("bridge")) return "Bridge";

  if (t.includes("sewer")) return "Water & Wastewater";
  if (t.includes("pipeline")) return "Utility Infrastructure";

  if (t.includes("masterplan")) return "Urban Development";

  if (t.includes("solar")) return "Renewable Energy";
  if (t.includes("wind farm")) return "Renewable Energy";
  if (t.includes("power plant")) return "Energy Generation";

  if (t.includes("park")) return "Public Realm";
  if (t.includes("landscape")) return "Landscape";

  return null;
}

function detectSubtype(text = "") {
  const t = text.toLowerCase();

  if (t.includes("column strengthening"))
    return "Structural Strengthening";

  if (t.includes("cantilever") && t.includes("bridge"))
    return "Cantilever Bridge";

  if (t.includes("residential tower"))
    return "Residential Tower";

  if (t.includes("deep sewer"))
    return "Deep Sewer Tunnel";

  if (t.includes("offshore wind"))
    return "Offshore Wind Farm";

  if (t.includes("linear park"))
    return "Linear Park";

  return null;
}

try {
  const manifest = await getJson(manifestKey);

  const basePath =
    manifestKey.replace(/\/manifest\.json$/, "");

  const extractionKey =
    `${basePath}/processed/extraction.json`;

  const extraction = await getJson(extractionKey);

  const entityType =
    extraction?.classification_candidate?.entity_type;

  if (entityType !== "project") {
    console.error(
      `STOP: Entity candidate is "${entityType || "unknown"}", not project.`
    );
    process.exit(1);
  }

  const category =
    extraction?.classification_candidate
      ?.project_category;

  if (
    category &&
    !PROJECT_CATEGORIES.includes(category)
  ) {
    throw new Error(
      `Invalid Project parent category: ${category}`
    );
  }

  const text =
    extraction?.extraction?.text || "";

  const filename =
    extraction?.source?.filename || "";

  const projectMaster = {
    schema: "arknoz-project-master-v1",

    master_status: "draft",
    review_required: true,

    identity: {
      title: guessTitle(filename),
      official_name: null,
      slug: null,

      category: category || null,
      type: detectProjectType(text),
      subtype: detectSubtype(text),

      status: null,
      alternative_names: [],
    },

    attributes_facts: {
      summary: null,
      why_it_matters: null,

      metrics: [],

      design: [],
      systems: [],
      materials: [],
      performance: [],
    },

    relationships: {
      people: [],
      organisations: [],
      products: [],
      related_projects: [],
    },

    geography: {
      country: null,
      region: null,
      city: null,
      locality: null,
      latitude: null,
      longitude: null,
    },

    temporal: {
      concept_date: null,
      design_start: null,
      construction_start: null,
      completion_date: null,
      opening_date: null,
      operational_date: null,
    },

    sources: [
      {
        source_type: "uploaded_document",
        import_id: manifest.import.id,
        object_key: manifest.source.object_key,
        original_filename:
          manifest.source.original_filename,
        sha256: manifest.source.sha256,
      },
    ],

    evidence: {
      items: [],
      evidence_status: "pending",
    },

    documents_media: [
      {
        kind: "source_document",
        object_key: manifest.source.object_key,
        filename:
          manifest.source.original_filename,
        public: false,
      },
    ],

    rights: {
      status: "unknown",
      public_display_allowed: false,
      public_download_allowed: false,
      review_required: true,
    },

    publication: {
      status: "private",
      allowed: false,
      slug_ready: false,
    },

    activity_signals: {
      created_from_import:
        manifest.import.id,
    },

    contextual_connections: {
      topics: [],
      knowledge: [],
      places: [],
      opportunities: [],
    },

    validation: {
      valid_parent_category:
        category
          ? PROJECT_CATEGORIES.includes(category)
          : false,

      taxonomy_locked: true,

      unresolved_fields: [],
    },

    provenance: {
      extraction_key: extractionKey,
      manifest_key: manifestKey,
      generated_at:
        new Date().toISOString(),
    },
  };

  const unresolved = [];

  if (!projectMaster.identity.category)
    unresolved.push("identity.category");

  if (!projectMaster.identity.type)
    unresolved.push("identity.type");

  if (!projectMaster.identity.subtype)
    unresolved.push("identity.subtype");

  if (!projectMaster.identity.status)
    unresolved.push("identity.status");

  if (!projectMaster.geography.country)
    unresolved.push("geography.country");

  projectMaster.validation.unresolved_fields =
    unresolved;

  const masterKey =
    `${basePath}/master/project-master.json`;

  await putJson(masterKey, projectMaster);

  manifest.processing.project_master =
    "draft_created";

  manifest.import.status =
    "project_master_draft";

  manifest.publication.allowed = false;
  manifest.publication.status = "private";

  manifest.project_master = {
    object_key: masterKey,
    schema: "arknoz-project-master-v1",
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(manifestKey, manifest);

  console.log("");
  console.log("PROJECT MASTER: PASS");
  console.log(
    `CATEGORY: ${projectMaster.identity.category || "REVIEW REQUIRED"}`
  );
  console.log(
    `TYPE: ${projectMaster.identity.type || "REVIEW REQUIRED"}`
  );
  console.log(
    `SUBTYPE: ${projectMaster.identity.subtype || "REVIEW REQUIRED"}`
  );
  console.log(
    `UNRESOLVED: ${unresolved.length}`
  );
  console.log(`MASTER: ${masterKey}`);
  console.log("PUBLICATION: BLOCKED");
  console.log("STATUS: DRAFT / REVIEW REQUIRED");
  console.log("");
} catch (error) {
  console.error("");
  console.error("PROJECT MASTER: FAIL");
  console.error(error?.message || error);
  console.error("");
  process.exit(1);
}