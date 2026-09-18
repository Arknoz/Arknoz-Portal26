import path from "node:path";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { PDFParse } from "pdf-parse";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\process-import.mjs "<manifest-object-key>"'
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
    accessKeyId:
      process.env.R2_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket =
  process.env.R2_BUCKET_NAME;

async function bodyToBuffer(body) {
  const chunks = [];

  for await (const chunk of body) {
    chunks.push(
      Buffer.from(chunk)
    );
  }

  return Buffer.concat(chunks);
}

async function getJson(key) {
  const response =
    await r2.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

  const buffer =
    await bodyToBuffer(
      response.Body
    );

  return JSON.parse(
    buffer.toString("utf8")
  );
}

async function putJson(
  key,
  value
) {
  await r2.send(
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

function normalizeText(
  value = ""
) {
  return value
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function classifyCandidate(
  text,
  filename
) {
  const haystack =
    `${filename}\n${text}`
      .toLowerCase();

  const scores = {
    project: 0,
    product: 0,
    knowledge: 0,
    person: 0,
    organisation: 0,
    place: 0,
  };

  const projectTerms = [
    "project",
    "construction",
    "architect",
    "engineer",
    "contractor",
    "site",
    "building",
    "bridge",
    "tunnel",
    "infrastructure",
    "masterplan",
    "strengthening",
    "rehabilitation",

    // Building / structural drawings
    "foundation",
    "foundation details",
    "footing",
    "column",
    "column details",
    "beam",
    "beam details",
    "slab",
    "slab details",
    "lintel",
    "staircase",
    "stair case",

    "rc details",
    "rcc details",
    "reinforcement details",
    "structural drawing",
    "general arrangement",
    "ga drawing",
    "floor plan",
    "section",
    "elevation",

    // Typical construction drawing language
    "drawing no",
    "drawing number",
    "revision",
    "scale",
    "reinforcement",
    "bar bending",
    "concrete grade",
    "steel grade",
  ];

  const productTerms = [
    "product",
    "manufacturer",
    "model number",
    "technical datasheet",
    "product specification",
    "material data sheet",
  ];

  const knowledgeTerms = [
    "research",
    "journal",
    "paper",
    "study",
    "publication",
    "methodology",
    "literature review",
  ];

  const personTerms = [
    "curriculum vitae",
    "biography",
    "profile",
    "education",
    "experience",
  ];

  const organisationTerms = [
    "company profile",
    "organisation profile",
    "organization profile",
    "about us",
    "our company",
  ];

  const placeTerms = [
    "city profile",
    "regional profile",
    "country profile",
    "municipality",
  ];

  for (
    const term of projectTerms
  ) {
    if (
      haystack.includes(term)
    ) {
      scores.project += 1;
    }
  }

  for (
    const term of productTerms
  ) {
    if (
      haystack.includes(term)
    ) {
      scores.product += 1;
    }
  }

  for (
    const term of knowledgeTerms
  ) {
    if (
      haystack.includes(term)
    ) {
      scores.knowledge += 1;
    }
  }

  for (
    const term of personTerms
  ) {
    if (
      haystack.includes(term)
    ) {
      scores.person += 1;
    }
  }

  for (
    const term of
      organisationTerms
  ) {
    if (
      haystack.includes(term)
    ) {
      scores.organisation += 1;
    }
  }

  for (
    const term of placeTerms
  ) {
    if (
      haystack.includes(term)
    ) {
      scores.place += 1;
    }
  }

  const ranked =
    Object.entries(scores)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );

  const [
    entityType,
    topScore,
  ] = ranked[0];

  let confidence = 0;

  if (topScore > 0) {
    confidence =
      Math.min(
        0.95,
        0.45 +
          topScore * 0.08
      );
  }

  return {
    entity_type:
      topScore > 0
        ? entityType
        : null,

    confidence,

    scores,
  };
}

function classifyProjectCategory(
  text
) {
  const t =
    text.toLowerCase();

  const categories = {
    Buildings: [
      "building",
      "residential",
      "office",
      "hospital",
      "school",
      "hotel",
      "tower",
      "house",

      "foundation",
      "foundation details",
      "footing",
      "column",
      "beam",
      "slab",
      "lintel",
      "staircase",
      "stair case",
      "rc details",
      "rcc details",
      "reinforcement details",
    ],

    Infrastructure: [
      "water",
      "sewer",
      "utility",
      "pipeline",
      "drainage",
      "treatment plant",
      "civil infrastructure",
    ],

    Transport: [
      "railway",
      "metro",
      "road",
      "highway",
      "bridge",
      "airport",
      "station",
      "transport",
    ],

    "Urban & Cities": [
      "masterplan",
      "urban development",
      "city planning",
      "district",
      "mixed-use development",
    ],

    "Industrial & Energy": [
      "power plant",
      "solar",
      "wind farm",
      "industrial",
      "factory",
      "energy",
      "substation",
    ],

    "Landscape & Public Realm": [
      "landscape",
      "park",
      "public realm",
      "public space",
      "garden",
      "plaza",
    ],
  };

  const scores = {};

  for (
    const [
      category,
      terms,
    ] of Object.entries(
      categories
    )
  ) {
    scores[category] = 0;

    for (const term of terms) {
      if (t.includes(term)) {
        scores[category] += 1;
      }
    }
  }

  const ranked =
    Object.entries(scores)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );

  const [
    category,
    score,
  ] = ranked[0];

  return {
    category:
      score > 0
        ? category
        : null,

    confidence:
      score > 0
        ? Math.min(
            0.9,
            0.4 +
              score * 0.1
          )
        : 0,

    scores,
  };
}

try {
  const manifest =
    await getJson(
      manifestKey
    );

  const sourceKey =
    manifest
      ?.source
      ?.object_key;

  if (!sourceKey) {
    throw new Error(
      "Manifest does not contain source.object_key"
    );
  }

  console.log(
    "Reading source from R2..."
  );

  const sourceResponse =
    await r2.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: sourceKey,
      })
    );

  const sourceBuffer =
    await bodyToBuffer(
      sourceResponse.Body
    );

  const extension =
    (
      manifest
        ?.source
        ?.extension ||
      path.extname(
        manifest
          ?.source
          ?.original_filename ||
        ""
      )
    ).toLowerCase();

  let extractedText = "";
  let pageCount = null;

  if (
    extension === ".pdf"
  ) {
    console.log(
      "Extracting PDF text..."
    );

    const parser =
      new PDFParse({
        data:
          sourceBuffer,
      });

    try {
      const parsed =
        await parser.getText();

      extractedText =
        normalizeText(
          parsed.text
        );

      pageCount =
        parsed.total ?? null;
    } finally {
      await parser.destroy();
    }
  } else if (
    extension === ".txt" ||
    extension === ".csv" ||
    extension === ".json"
  ) {
    extractedText =
      normalizeText(
        sourceBuffer
          .toString("utf8")
      );
  } else {
    console.log(
      `No text extractor configured yet for ${extension}`
    );
  }

  const filename =
    manifest
      ?.source
      ?.original_filename ||
    "";

  const classificationText =
    `${filename}\n${extractedText}`;

  const entityClassification =
    classifyCandidate(
      extractedText,
      filename
    );

  let projectClassification = {
    category: null,
    confidence: 0,
    scores: {},
  };

  if (
    entityClassification
      .entity_type ===
    "project"
  ) {
    projectClassification =
      classifyProjectCategory(
        classificationText
      );
  }

  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const extractionKey =
    `${basePath}/processed/extraction.json`;

  const extraction = {
    schema:
      "arknoz-extraction-v1",

    import_id:
      manifest.import.id,

    source: {
      filename,

      object_key:
        sourceKey,

      extension,

      page_count:
        pageCount,
    },

    extraction: {
      text_available:
        extractedText.length >
        0,

      character_count:
        extractedText.length,

      text:
        extractedText.length >
        1000000
          ? extractedText.slice(
              0,
              1000000
            )
          : extractedText,
    },

    classification_candidate: {
      entity_type:
        entityClassification
          .entity_type,

      entity_confidence:
        entityClassification
          .confidence,

      entity_scores:
        entityClassification
          .scores,

      project_category:
        projectClassification
          .category,

      project_category_confidence:
        projectClassification
          .confidence,

      project_category_scores:
        projectClassification
          .scores,

      requires_review:
        true,
    },

    generated_at:
      new Date()
        .toISOString(),
  };

  await putJson(
    extractionKey,
    extraction
  );

  manifest.import.status =
    "processed";

  manifest.classification =
    manifest.classification ||
    {};

  manifest.classification.entity_type =
    entityClassification
      .entity_type;

  manifest.classification.confidence =
    entityClassification
      .confidence;

  manifest.classification.status =
    entityClassification
      .entity_type
      ? "candidate"
      : "review_required";

  if (
    entityClassification
      .entity_type ===
    "project"
  ) {
    manifest.classification.category =
      projectClassification
        .category;
  }

  manifest.evidence =
    manifest.evidence ||
    {};

  manifest.evidence.extraction_status =
    extractedText.length > 0
      ? "text_extracted"
      : "no_text_extracted";

  manifest.processing =
    manifest.processing ||
    {};

  manifest.processing.extraction =
    "complete";

  manifest.processing.classification =
    entityClassification
      .entity_type
      ? "candidate_generated"
      : "review_required";

  manifest.publication =
    manifest.publication ||
    {};

  manifest.publication.status =
    "private";

  manifest.publication.allowed =
    false;

  manifest.rights =
    manifest.rights ||
    {};

  manifest.rights.status =
    manifest.rights.status ||
    "unknown";

  manifest.rights.review_required =
    true;

  manifest.updated_at =
    new Date()
      .toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ PROCESSING: PASS"
  );

  console.log(
    `ENTITY CANDIDATE: ${
      entityClassification
        .entity_type ||
      "UNKNOWN"
    }`
  );

  console.log(
    `ENTITY CONFIDENCE: ${Math.round(
      entityClassification
        .confidence *
        100
    )}%`
  );

  if (
    entityClassification
      .entity_type ===
    "project"
  ) {
    console.log(
      `PROJECT CATEGORY: ${
        projectClassification
          .category ||
        "REVIEW REQUIRED"
      }`
    );

    console.log(
      `CATEGORY CONFIDENCE: ${Math.round(
        projectClassification
          .confidence *
          100
      )}%`
    );
  }

  console.log(
    `TEXT CHARACTERS: ${extractedText.length}`
  );

  if (
    pageCount !== null
  ) {
    console.log(
      `PDF PAGES: ${pageCount}`
    );
  }

  console.log(
    `EXTRACTION: ${extractionKey}`
  );

  console.log(
    "RIGHTS: UNKNOWN / PRIVATE"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: REVIEW REQUIRED"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ PROCESSING: FAIL"
  );

  console.error(
    error?.name ||
    "Unknown error"
  );

  console.error(
    error?.message ||
    error
  );

  console.error("");
  process.exit(1);
}