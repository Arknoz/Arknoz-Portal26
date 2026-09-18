import crypto from "node:crypto";
import path from "node:path";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  createCanvas,
} from "@napi-rs/canvas";

const manifestKey =
  process.argv[2];

if (!manifestKey) {
  console.error("");
  console.error(
    "ARKNOZ VISUAL EVIDENCE: FAIL"
  );
  console.error(
    "Provide an existing R2 manifest key."
  );
  console.error("");
  process.exit(1);
}

const requiredEnv = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_AI_TOKEN",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error("");
    console.error(
      "ARKNOZ VISUAL EVIDENCE: FAIL"
    );
    console.error(
      `Missing environment variable: ${key}`
    );
    console.error("");
    process.exit(1);
  }
}

const bucket =
  process.env.R2_BUCKET_NAME;

const visionModel =
  process.env.ARKNOZ_VISION_MODEL ||
  "@cf/meta/llama-3.2-11b-vision-instruct";

const normalizerModel =
  process.env.ARKNOZ_AI_MODEL ||
  "@cf/meta/llama-3.1-8b-instruct-fast";

const maxVisualPages =
  Math.max(
    1,
    Number(
      process.env
        .ARKNOZ_VISUAL_MAX_PAGES ||
      6
    )
  );

const textDensityThreshold =
  Math.max(
    1,
    Number(
      process.env
        .ARKNOZ_VISUAL_TEXT_DENSITY_THRESHOLD ||
      1800
    )
  );

const maxRenderDimension =
  Math.max(
    1000,
    Number(
      process.env
        .ARKNOZ_VISUAL_MAX_DIMENSION ||
      2200
    )
  );

const r2 =
  new S3Client({
    region:
      process.env.R2_REGION ||
      "auto",

    endpoint:
      process.env.R2_ENDPOINT,

    credentials: {
      accessKeyId:
        process.env
          .R2_ACCESS_KEY_ID,

      secretAccessKey:
        process.env
          .R2_SECRET_ACCESS_KEY,
    },
  });

async function bodyToBuffer(
  body
) {
  const chunks = [];

  for await (
    const chunk of body
  ) {
    chunks.push(
      Buffer.from(chunk)
    );
  }

  return Buffer.concat(
    chunks
  );
}

async function getBuffer(
  key
) {
  const response =
    await r2.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

  return bodyToBuffer(
    response.Body
  );
}

async function getJson(
  key
) {
  const buffer =
    await getBuffer(key);

  return JSON.parse(
    buffer.toString("utf8")
  );
}

async function tryGetJson(
  key
) {
  try {
    return await getJson(key);
  } catch (error) {
    const status =
      error?.$metadata
        ?.httpStatusCode;

    if (
      status === 404 ||
      error?.name ===
        "NoSuchKey"
    ) {
      return null;
    }

    throw error;
  }
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

function sha256(
  value
) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

function getPageItems(
  pagesDocument
) {
  if (
    Array.isArray(
      pagesDocument
    )
  ) {
    return pagesDocument;
  }

  if (
    Array.isArray(
      pagesDocument?.pages
    )
  ) {
    return pagesDocument.pages;
  }

  if (
    Array.isArray(
      pagesDocument
        ?.page_evidence
    )
  ) {
    return pagesDocument
      .page_evidence;
  }

  if (
    Array.isArray(
      pagesDocument?.items
    )
  ) {
    return pagesDocument.items;
  }

  return [];
}

function pageNumberOf(
  item,
  index
) {
  return Number(
    item?.page_number ??
    item?.page ??
    item?.page_no ??
    index + 1
  );
}

function getPageText(
  pagesDocument,
  targetPage
) {
  const items =
    getPageItems(
      pagesDocument
    );

  for (
    let i = 0;
    i < items.length;
    i += 1
  ) {
    const item =
      items[i];

    if (
      pageNumberOf(
        item,
        i
      ) !== targetPage
    ) {
      continue;
    }

    const text =
      item?.text ??
      item?.extracted_text ??
      item?.content ??
      item?.page_text ??
      "";

    if (
      typeof text ===
      "string"
    ) {
      return text;
    }
  }

  return "";
}

function drawingFilenameHint(
  filename
) {
  const value =
    filename.toLowerCase();

  const terms = [
    "drawing",
    "plan",
    "section",
    "elevation",
    "detail",
    "details",
    "foundation",
    "footing",
    "column",
    "beam",
    "slab",
    "lintel",
    "stair",
    "staircase",
    "rc detail",
    "rcc detail",
    "reinforcement",
    "general arrangement",
    "ga ",
    "structural",
  ];

  return terms.some(
    (term) =>
      value.includes(term)
  );
}

function clampConfidence(
  value
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      1,
      number
    )
  );
}

const allowedKinds =
  new Set([
    "drawing_title",
    "drawing_number",
    "revision",
    "scale",
    "project_name",
    "location",
    "level",
    "floor",
    "grid",
    "structural_element",
    "dimension",
    "reinforcement_notation",
    "material_grade",
    "material",
    "detail_reference",
    "section_reference",
    "note",
    "legend",
    "schedule",
    "quantity",
    "date",
    "organisation",
    "person",
    "discipline",
    "other",
  ]);

function normalizeKind(
  value
) {
  const kind =
    String(
      value || ""
    )
      .trim()
      .toLowerCase()
      .replace(
        /[\s-]+/g,
        "_"
      );

  if (
    allowedKinds.has(
      kind
    )
  ) {
    return kind;
  }

  return "other";
}

function tryParseJsonText(
  value
) {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  let text =
    value.trim();

  text =
    text
      .replace(
        /^```(?:json)?\s*/i,
        ""
      )
      .replace(
        /```\s*$/i,
        ""
      )
      .trim();

  try {
    const parsed =
      JSON.parse(text);

    if (
      typeof parsed ===
      "string"
    ) {
      try {
        return JSON.parse(
          parsed
        );
      } catch {
        return null;
      }
    }

    return parsed;
  } catch {
    // Continue.
  }

  const firstBrace =
    text.indexOf("{");

  const lastBrace =
    text.lastIndexOf("}");

  if (
    firstBrace >= 0 &&
    lastBrace > firstBrace
  ) {
    try {
      return JSON.parse(
        text.slice(
          firstBrace,
          lastBrace + 1
        )
      );
    } catch {
      return null;
    }
  }

  return null;
}

function validateAnalysisShape(
  input
) {
  if (
    !input ||
    typeof input !==
      "object" ||
    Array.isArray(input)
  ) {
    return null;
  }

  const observations =
    Array.isArray(
      input.observations
    )
      ? input.observations
      : [];

  const cleanedObservations =
    [];

  for (
    const item of
      observations
  ) {
    if (
      !item ||
      typeof item !==
        "object"
    ) {
      continue;
    }

    const value =
      String(
        item.value || ""
      ).trim();

    const visibleBasis =
      String(
        item.visible_basis ||
        ""
      ).trim();

    if (
      !value ||
      !visibleBasis
    ) {
      continue;
    }

    cleanedObservations.push({
      kind:
        normalizeKind(
          item.kind
        ),

      value,

      confidence:
        clampConfidence(
          item.confidence
        ),

      visible_basis:
        visibleBasis,
    });
  }

  return {
    page_class:
      String(
        input.page_class ||
        "unknown"
      ).trim(),

    drawing_title:
      String(
        input.drawing_title ||
        ""
      ).trim(),

    summary:
      String(
        input.summary ||
        ""
      ).trim(),

    observations:
      cleanedObservations,

    warnings:
      Array.isArray(
        input.warnings
      )
        ? input.warnings
            .map(
              (item) =>
                String(
                  item
                ).trim()
            )
            .filter(Boolean)
        : [],
  };
}

const responseSchema = {
  type: "object",

  additionalProperties:
    false,

  properties: {
    page_class: {
      type: "string",
    },

    drawing_title: {
      type: "string",
    },

    summary: {
      type: "string",
    },

    observations: {
      type: "array",

      items: {
        type: "object",

        additionalProperties:
          false,

        properties: {
          kind: {
            type: "string",
          },

          value: {
            type: "string",
          },

          confidence: {
            type: "number",
          },

          visible_basis: {
            type: "string",
          },
        },

        required: [
          "kind",
          "value",
          "confidence",
          "visible_basis",
        ],
      },
    },

    warnings: {
      type: "array",

      items: {
        type: "string",
      },
    },
  },

  required: [
    "page_class",
    "drawing_title",
    "summary",
    "observations",
    "warnings",
  ],
};

async function readCloudflareResponse(
  response
) {
  const rawHttp =
    await response.text();

  let payload;

  try {
    payload =
      JSON.parse(rawHttp);
  } catch {
    throw new Error(
      `Cloudflare returned a non-JSON HTTP response: ${rawHttp.slice(
        0,
        500
      )}`
    );
  }

  if (
    !response.ok ||
    payload?.success ===
      false
  ) {
    throw new Error(
      `Cloudflare AI HTTP ${response.status}: ${JSON.stringify(
        payload?.errors ||
        payload
      )}`
    );
  }

  return payload;
}

function extractModelResult(
  payload
) {
  return (
    payload
      ?.result
      ?.response ??
    payload?.result ??
    null
  );
}

async function normalizeVisionProse({
  rawVisionText,
  pageNumber,
}) {
  console.log(
    `Vision page ${pageNumber} returned prose; running JSON normalizer...`
  );

  const accountId =
    process.env
      .CLOUDFLARE_ACCOUNT_ID
      .trim();

  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/` +
    `${accountId}/ai/run/${normalizerModel}`;

  const systemPrompt = `
You are a strict lossless JSON formatter for Arknoz.

You are NOT analysing an image.
You have NO access to the source drawing.
You may ONLY restructure information explicitly present in the supplied VISION_OUTPUT.

STRICT RULES:

1. Do not add any fact.
2. Do not infer any fact.
3. Do not correct the vision model.
4. Do not expand abbreviations using outside knowledge.
5. Do not invent dimensions, materials, reinforcement, locations, names, dates or relationships.
6. Do not turn speculation into certainty.
7. If a detail is absent, omit it.
8. If something is described as unclear, likely, appears, seems or uncertain, preserve that uncertainty.
9. Each observation must correspond to a distinct assertion already present in VISION_OUTPUT.
10. value must be taken directly or minimally normalized from VISION_OUTPUT.
11. visible_basis must describe only the supporting wording already present in VISION_OUTPUT.
12. Do not create Project-level conclusions.
13. Do not infer rights or publication permission.
14. Output valid JSON only.
15. Use only these observation kinds:

drawing_title
drawing_number
revision
scale
project_name
location
level
floor
grid
structural_element
dimension
reinforcement_notation
material_grade
material
detail_reference
section_reference
note
legend
schedule
quantity
date
organisation
person
discipline
other

CONFIDENCE RULE:

- 0.70 for a direct, unhedged assertion explicitly present in VISION_OUTPUT.
- 0.55 for a hedged or uncertain assertion.
- Never exceed 0.70 in this normalization fallback.

The confidence describes restructuring confidence only.
It is NOT factual verification.

Return exactly this structure:

{
  "page_class": "string",
  "drawing_title": "string",
  "summary": "string",
  "observations": [
    {
      "kind": "string",
      "value": "string",
      "confidence": 0.0,
      "visible_basis": "string"
    }
  ],
  "warnings": [
    "string"
  ]
}
`;

  const userPayload = {
    page_number:
      pageNumber,

    vision_output:
      rawVisionText,
  };

  const response =
    await fetch(
      endpoint,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.CLOUDFLARE_AI_TOKEN.trim()}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            messages: [
              {
                role:
                  "system",

                content:
                  systemPrompt,
              },

              {
                role:
                  "user",

                content:
                  JSON.stringify(
                    userPayload
                  ),
              },
            ],

            temperature:
              0,

            max_tokens:
              3500,

            response_format: {
              type:
                "json_schema",

              json_schema:
                responseSchema,
            },
          }),

        signal:
          AbortSignal.timeout(
            120000
          ),
      }
    );

  const payload =
    await readCloudflareResponse(
      response
    );

  let result =
    extractModelResult(
      payload
    );

  if (
    typeof result ===
    "string"
  ) {
    result =
      tryParseJsonText(
        result
      );
  }

  const validated =
    validateAnalysisShape(
      result
    );

  if (!validated) {
    throw new Error(
      "JSON normalizer did not return a usable visual evidence object."
    );
  }

  return validated;
}

async function analysePage({
  pageNumber,
  imageBuffer,
  extractedPageText,
}) {
  const accountId =
    process.env
      .CLOUDFLARE_ACCOUNT_ID
      .trim();

  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/` +
    `${accountId}/ai/run/${visionModel}`;

  const prompt = `
You are the visual evidence extraction stage of Arknoz, a Built World evidence system.

Analyse ONLY what is visibly observable on this technical document page.

This is not a general design review.
This is not a reconstruction exercise.
This is not permission to infer missing information.

STRICT RULES:

1. Do not invent facts.
2. Do not infer building use, project type, location, designer, client, contractor or project status unless visibly supported.
3. Do not convert normal engineering conventions into facts unless the relevant notation is visibly legible.
4. Dimensions may only be recorded when visibly legible.
5. Reinforcement notation may only be recorded when visibly legible.
6. Material grades may only be recorded when visibly legible.
7. Drawing numbers, titles, revisions, scales and dates may only be recorded when visible.
8. A proposed note or instruction is not evidence that work was actually executed.
9. Do not infer public rights, copyright ownership or publication permission.
10. If something is unclear or unreadable, omit it rather than guess.
11. Every observation must explain its visible basis.
12. Confidence means visual-reading confidence from 0 to 1. It is NOT independent verification.
13. All observations are CANDIDATES only.
14. Nothing in this output is verified or publishable.
15. Return valid JSON only.
16. Do not use markdown.
17. Do not include commentary before or after the JSON.

Required JSON structure:

{
  "page_class": "string",
  "drawing_title": "string",
  "summary": "string",
  "observations": [
    {
      "kind": "string",
      "value": "string",
      "confidence": 0.0,
      "visible_basis": "string"
    }
  ],
  "warnings": [
    "string"
  ]
}

PAGE NUMBER:
${pageNumber}

EXTRACTED PAGE TEXT, IF AVAILABLE:
${String(
  extractedPageText || ""
).slice(0, 6000)}
`;

  const response =
    await fetch(
      endpoint,
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.CLOUDFLARE_AI_TOKEN.trim()}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            messages: [
              {
                role:
                  "system",

                content:
                  "You conservatively extract visible evidence from Built World drawings. Return valid JSON only. Never invent missing facts.",
              },

              {
                role:
                  "user",

                content:
                  prompt,
              },
            ],

            image:
              `data:image/png;base64,${imageBuffer.toString(
                "base64"
              )}`,

            temperature:
              0,

            max_tokens:
              3500,

            response_format: {
              type:
                "json_schema",

              json_schema:
                responseSchema,
            },
          }),

        signal:
          AbortSignal.timeout(
            120000
          ),
      }
    );

  const payload =
    await readCloudflareResponse(
      response
    );

  const result =
    extractModelResult(
      payload
    );

  /*
   * --------------------------------
   * PATH 1:
   * Vision model already returned
   * structured JSON.
   * --------------------------------
   */

  if (
    result &&
    typeof result ===
      "object" &&
    !Array.isArray(result)
  ) {
    const validated =
      validateAnalysisShape(
        result
      );

    if (validated) {
      return {
        analysis:
          validated,

        response_mode:
          "vision_structured_json",

        normalizer_used:
          false,

        normalizer_model:
          null,

        vision_response_sha256:
          sha256(
            JSON.stringify(
              result
            )
          ),
      };
    }
  }

  /*
   * --------------------------------
   * PATH 2:
   * Vision returned a string that
   * contains valid JSON.
   * --------------------------------
   */

  if (
    typeof result ===
    "string"
  ) {
    const directParsed =
      tryParseJsonText(
        result
      );

    if (directParsed) {
      const validated =
        validateAnalysisShape(
          directParsed
        );

      if (validated) {
        return {
          analysis:
            validated,

          response_mode:
            "vision_json_string",

          normalizer_used:
            false,

          normalizer_model:
            null,

          vision_response_sha256:
            sha256(result),
        };
      }
    }

    /*
     * --------------------------------
     * PATH 3:
     * Vision understood the page but
     * ignored JSON instructions.
     *
     * Use Arknoz text model only as a
     * LOSSLESS FORMAT NORMALIZER.
     * --------------------------------
     */

    const normalized =
      await normalizeVisionProse({
        rawVisionText:
          result,

        pageNumber,
      });

    return {
      analysis:
        normalized,

      response_mode:
        "vision_prose_normalized_to_json",

      normalizer_used:
        true,

      normalizer_model:
        normalizerModel,

      vision_response_sha256:
        sha256(result),
    };
  }

  throw new Error(
    "Vision model returned an unsupported response format."
  );
}

function normalizeAnalysis({
  analysis,
  pageNumber,
  imageHash,
  responseMode,
  normalizerUsed,
  normalizerModelUsed,
  visionResponseSha256,
}) {
  const observations =
    Array.isArray(
      analysis?.observations
    )
      ? analysis.observations
      : [];

  const normalized = [];

  for (
    const item of observations
  ) {
    const value =
      String(
        item?.value || ""
      ).trim();

    const visibleBasis =
      String(
        item?.visible_basis ||
        ""
      ).trim();

    if (
      !value ||
      !visibleBasis
    ) {
      continue;
    }

    normalized.push({
      candidate_id:
        `visual-p${String(
          pageNumber
        ).padStart(
          3,
          "0"
        )}-${String(
          normalized.length +
            1
        ).padStart(
          3,
          "0"
        )}`,

      lifecycle:
        "candidate",

      source_mode:
        "visual",

      kind:
        normalizeKind(
          item?.kind
        ),

      value,

      confidence:
        clampConfidence(
          item?.confidence
        ),

      evidence: {
        page_number:
          pageNumber,

        visible_basis:
          visibleBasis,

        render_sha256:
          imageHash,

        evidence_type:
          "visual_page_analysis",

        analysis_response_mode:
          responseMode,

        vision_response_sha256:
          visionResponseSha256,

        normalizer_used:
          normalizerUsed,

        normalizer_model:
          normalizerModelUsed,
      },

      verification: {
        source_verified:
          false,

        independently_verified:
          false,
      },

      rights: {
        inherited_from_source:
          true,

        public_display_permission:
          false,
      },

      publication: {
        allowed:
          false,

        status:
          "blocked",
      },
    });
  }

  return {
    page_number:
      pageNumber,

    page_class:
      String(
        analysis?.page_class ||
        "unknown"
      ).trim(),

    drawing_title:
      String(
        analysis?.drawing_title ||
        ""
      ).trim(),

    summary:
      String(
        analysis?.summary ||
        ""
      ).trim(),

    render_sha256:
      imageHash,

    processing: {
      response_mode:
        responseMode,

      normalizer_used:
        normalizerUsed,

      normalizer_model:
        normalizerModelUsed,

      vision_response_sha256:
        visionResponseSha256,
    },

    observations:
      normalized,

    warnings:
      Array.isArray(
        analysis?.warnings
      )
        ? analysis.warnings
            .map(
              (item) =>
                String(
                  item
                ).trim()
            )
            .filter(Boolean)
        : [],
  };
}

try {
  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const extractionKey =
    `${basePath}/processed/extraction.json`;

  const pagesKey =
    `${basePath}/processed/pages.json`;

  const visualKey =
    `${basePath}/processed/visual-evidence.json`;

  const evidenceIndexKey =
    `${basePath}/evidence/evidence-index.json`;

  const manifest =
    await getJson(
      manifestKey
    );

  const extraction =
    await getJson(
      extractionKey
    );

  const pagesDocument =
    await tryGetJson(
      pagesKey
    );

  const sourceKey =
    manifest
      ?.source
      ?.object_key;

  if (!sourceKey) {
    throw new Error(
      "Manifest does not contain source.object_key."
    );
  }

  const filename =
    manifest
      ?.source
      ?.original_filename ||
    extraction
      ?.source
      ?.filename ||
    path.basename(
      sourceKey
    );

  const extension =
    (
      manifest
        ?.source
        ?.extension ||
      path.extname(
        filename
      )
    ).toLowerCase();

  /*
   * =================================
   * NON-PDF
   * =================================
   */

  if (
    extension !== ".pdf"
  ) {
    const skipped = {
      schema:
        "arknoz-visual-evidence-v2",

      generated_at:
        new Date()
          .toISOString(),

      manifest_key:
        manifestKey,

      source_key:
        sourceKey,

      filename,

      status:
        "not_applicable",

      reason:
        "Visual PDF extraction currently applies to PDF sources only.",

      pages: [],

      candidate_count:
        0,

      verified_fact_count:
        0,

      publication: {
        allowed:
          false,

        status:
          "blocked",
      },
    };

    await putJson(
      visualKey,
      skipped
    );

    console.log("");
    console.log(
      "ARKNOZ VISUAL EVIDENCE: PASS"
    );
    console.log(
      "STATUS: NOT APPLICABLE"
    );
    console.log(
      "PUBLICATION: BLOCKED"
    );
    console.log("");

    process.exit(0);
  }

  const extractedCharacters =
    Number(
      extraction
        ?.extraction
        ?.character_count ||
      0
    );

  const declaredPageCount =
    Number(
      extraction
        ?.source
        ?.page_count ||
      1
    );

  const charactersPerPage =
    extractedCharacters /
    Math.max(
      1,
      declaredPageCount
    );

  const filenameHint =
    drawingFilenameHint(
      filename
    );

  const lowTextDensity =
    charactersPerPage <
    textDensityThreshold;

  const visualRequired =
    filenameHint ||
    lowTextDensity;

  /*
   * =================================
   * VISUAL NOT REQUIRED
   * =================================
   */

  if (!visualRequired) {
    const skipped = {
      schema:
        "arknoz-visual-evidence-v2",

      generated_at:
        new Date()
          .toISOString(),

      manifest_key:
        manifestKey,

      source_key:
        sourceKey,

      filename,

      vision_model:
        visionModel,

      normalizer_model:
        normalizerModel,

      trigger: {
        drawing_filename_hint:
          filenameHint,

        low_text_density:
          lowTextDensity,

        characters_per_page:
          charactersPerPage,

        threshold:
          textDensityThreshold,
      },

      status:
        "not_required",

      pages: [],

      candidate_count:
        0,

      verified_fact_count:
        0,

      publication: {
        allowed:
          false,

        status:
          "blocked",
      },
    };

    await putJson(
      visualKey,
      skipped
    );

    manifest.processing =
      manifest.processing ||
      {};

    manifest.processing
      .visual_evidence =
      "not_required";

    manifest.processing
      .visual_evidence_key =
      visualKey;

    manifest.updated_at =
      new Date()
        .toISOString();

    await putJson(
      manifestKey,
      manifest
    );

    console.log("");
    console.log(
      "ARKNOZ VISUAL EVIDENCE: PASS"
    );
    console.log(
      "VISUAL ANALYSIS: NOT REQUIRED"
    );
    console.log(
      `TEXT DENSITY: ${Math.round(
        charactersPerPage
      )} chars/page`
    );
    console.log(
      "PUBLICATION: BLOCKED"
    );
    console.log("");

    process.exit(0);
  }

  /*
   * =================================
   * PDF VISUAL ANALYSIS
   * =================================
   */

  console.log(
    "Reading PDF from private R2..."
  );

  const pdfBuffer =
    await getBuffer(
      sourceKey
    );

  console.log(
    "Loading PDF renderer..."
  );

  const pdfjs =
    await import(
      "pdfjs-dist/legacy/build/pdf.mjs"
    );

  const loadingTask =
    pdfjs.getDocument({
      data:
        new Uint8Array(
          pdfBuffer
        ),

      useSystemFonts:
        true,

      verbosity:
        0,
    });

  const pdf =
    await loadingTask.promise;

  const pageLimit =
    Math.min(
      pdf.numPages,
      maxVisualPages
    );

  console.log("");
  console.log(
    "VISUAL ANALYSIS REQUIRED"
  );

  console.log(
    `REASON: ${
      filenameHint &&
      lowTextDensity
        ? "DRAWING HINT + LOW TEXT DENSITY"
        : filenameHint
          ? "DRAWING HINT"
          : "LOW TEXT DENSITY"
    }`
  );

  console.log(
    `PDF PAGES: ${pdf.numPages}`
  );

  console.log(
    `PAGES TO ANALYSE: ${pageLimit}`
  );

  console.log(
    `VISION MODEL: ${visionModel}`
  );

  console.log(
    `JSON NORMALIZER: ${normalizerModel}`
  );

  console.log("");

  const analysedPages = [];

  let totalCandidates =
    0;

  let normalizedFallbackPages =
    0;

  for (
    let pageNumber = 1;
    pageNumber <=
    pageLimit;
    pageNumber += 1
  ) {
    console.log(
      `Rendering page ${pageNumber}/${pageLimit}...`
    );

    const page =
      await pdf.getPage(
        pageNumber
      );

    const baseViewport =
      page.getViewport({
        scale: 1,
      });

    const largestDimension =
      Math.max(
        baseViewport.width,
        baseViewport.height
      );

    const renderScale =
      Math.min(
        2,
        maxRenderDimension /
          Math.max(
            1,
            largestDimension
          )
      );

    const viewport =
      page.getViewport({
        scale:
          renderScale,
      });

    const width =
      Math.max(
        1,
        Math.ceil(
          viewport.width
        )
      );

    const height =
      Math.max(
        1,
        Math.ceil(
          viewport.height
        )
      );

    const canvas =
      createCanvas(
        width,
        height
      );

    const context =
      canvas.getContext(
        "2d"
      );

    context.fillStyle =
      "#ffffff";

    context.fillRect(
      0,
      0,
      width,
      height
    );

    await page.render({
      canvasContext:
        context,

      viewport,
    }).promise;

    const imageBuffer =
      canvas.toBuffer(
        "image/png"
      );

    const imageHash =
      sha256(
        imageBuffer
      );

    const extractedPageText =
      getPageText(
        pagesDocument,
        pageNumber
      );

    console.log(
      `Analysing page ${pageNumber} visually...`
    );

    const analysisResult =
      await analysePage({
        pageNumber,
        imageBuffer,
        extractedPageText,
      });

    if (
      analysisResult
        .normalizer_used
    ) {
      normalizedFallbackPages +=
        1;
    }

    const normalized =
      normalizeAnalysis({
        analysis:
          analysisResult.analysis,

        pageNumber,

        imageHash,

        responseMode:
          analysisResult
            .response_mode,

        normalizerUsed:
          analysisResult
            .normalizer_used,

        normalizerModelUsed:
          analysisResult
            .normalizer_model,

        visionResponseSha256:
          analysisResult
            .vision_response_sha256,
      });

    normalized.render = {
      width,

      height,

      format:
        "png",

      persisted:
        false,

      purpose:
        "private_ephemeral_ai_analysis",
    };

    analysedPages.push(
      normalized
    );

    totalCandidates +=
      normalized
        .observations
        .length;

    console.log(
      `PAGE ${pageNumber}: ${normalized.observations.length} visual candidates`
    );

    console.log(
      `PAGE ${pageNumber} RESPONSE MODE: ${analysisResult.response_mode}`
    );

    page.cleanup();
  }

  await loadingTask.destroy();

  /*
   * =================================
   * SAVE VISUAL EVIDENCE
   * =================================
   */

  const visualEvidence = {
    schema:
      "arknoz-visual-evidence-v2",

    generated_at:
      new Date()
        .toISOString(),

    import_id:
      manifest
        ?.import
        ?.id ||
      null,

    manifest_key:
      manifestKey,

    source: {
      filename,

      object_key:
        sourceKey,

      source_sha256:
        manifest
          ?.source
          ?.sha256 ||
        null,
    },

    trigger: {
      drawing_filename_hint:
        filenameHint,

      low_text_density:
        lowTextDensity,

      extracted_characters:
        extractedCharacters,

      declared_page_count:
        declaredPageCount,

      characters_per_page:
        charactersPerPage,

      text_density_threshold:
        textDensityThreshold,
    },

    processing: {
      mode:
        "private_visual_evidence",

      vision_model:
        visionModel,

      json_normalizer_model:
        normalizerModel,

      pdf_pages:
        pdf.numPages,

      analysed_pages:
        pageLimit,

      normalized_fallback_pages:
        normalizedFallbackPages,

      page_limit:
        maxVisualPages,

      render_max_dimension:
        maxRenderDimension,

      rendered_images_persisted:
        false,

      fail_closed:
        true,
    },

    pages:
      analysedPages,

    candidate_count:
      totalCandidates,

    fact_status: {
      candidates:
        totalCandidates,

      provisional:
        0,

      source_verified:
        0,

      independently_verified:
        0,

      publishable:
        0,
    },

    safeguards: {
      vision_output_requires_structured_validation:
        true,

      prose_fallback_may_only_restructure_existing_output:
        true,

      normalizer_has_no_image_access:
        true,

      normalizer_may_not_add_facts:
        true,

      rendered_images_persisted:
        false,

      auto_verified:
        false,

      independently_verified:
        false,

      rights_auto_approved:
        false,

      publication_allowed:
        false,
    },

    rights: {
      inherited_from_source:
        true,

      public_display_permission:
        false,

      public_image_permission:
        false,
    },

    publication: {
      allowed:
        false,

      status:
        "blocked",
    },

    status:
      "visual_candidates_ready",
  };

  await putJson(
    visualKey,
    visualEvidence
  );

  /*
   * =================================
   * UPDATE EVIDENCE INDEX
   * =================================
   */

  const evidenceIndex =
    (
      await tryGetJson(
        evidenceIndexKey
      )
    ) || {};

  evidenceIndex
    .visual_evidence = {
      schema:
        "arknoz-visual-evidence-index-v2",

      source:
        visualKey,

      candidate_count:
        totalCandidates,

      normalized_fallback_pages:
        normalizedFallbackPages,

      pages:
        analysedPages.map(
          (page) => ({
            page_number:
              page.page_number,

            page_class:
              page.page_class,

            drawing_title:
              page.drawing_title,

            render_sha256:
              page.render_sha256,

            response_mode:
              page
                ?.processing
                ?.response_mode ||
              null,

            normalizer_used:
              page
                ?.processing
                ?.normalizer_used ||
              false,

            candidate_ids:
              page
                .observations
                .map(
                  (item) =>
                    item
                      .candidate_id
                ),
          })
        ),

      verification: {
        source_verified:
          0,

        independently_verified:
          0,
      },

      publication: {
        allowed:
          false,

        status:
          "blocked",
      },
    };

  await putJson(
    evidenceIndexKey,
    evidenceIndex
  );

  /*
   * =================================
   * UPDATE MANIFEST
   * =================================
   */

  manifest.processing =
    manifest.processing ||
    {};

  manifest.processing
    .visual_evidence =
    "complete";

  manifest.processing
    .visual_evidence_key =
    visualKey;

  manifest.processing
    .visual_candidate_count =
    totalCandidates;

  manifest.processing
    .visual_normalized_fallback_pages =
    normalizedFallbackPages;

  manifest.publication =
    manifest.publication ||
    {};

  manifest.publication.allowed =
    false;

  manifest.publication.status =
    "private";

  manifest.updated_at =
    new Date()
      .toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  /*
   * =================================
   * TERMINAL
   * =================================
   */

  console.log("");
  console.log(
    "ARKNOZ VISUAL EVIDENCE: PASS"
  );

  console.log(
    `PAGES ANALYSED: ${pageLimit}`
  );

  console.log(
    `VISUAL CANDIDATES: ${totalCandidates}`
  );

  console.log(
    `JSON NORMALIZER FALLBACK PAGES: ${normalizedFallbackPages}`
  );

  console.log(
    `VISUAL EVIDENCE: ${visualKey}`
  );

  console.log(
    "RENDERED PAGE IMAGES: NOT STORED"
  );

  console.log(
    "AUTO-VERIFIED FACTS: 0"
  );

  console.log(
    "INDEPENDENTLY VERIFIED: 0"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: VISUAL CANDIDATES READY"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ VISUAL EVIDENCE: FAIL"
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