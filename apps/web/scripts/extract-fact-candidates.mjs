import crypto from "node:crypto";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\extract-fact-candidates.mjs "<manifest-key>"'
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
    console.error(
      `FAIL: Missing ${key}`
    );
    process.exit(1);
  }
}

const r2 = new S3Client({
  region:
    process.env.R2_REGION ||
    "auto",

  endpoint:
    process.env.R2_ENDPOINT,

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

async function getJson(key) {
  const result =
    await r2.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

  const buffer =
    await bodyToBuffer(
      result.Body
    );

  return JSON.parse(
    buffer.toString("utf8")
  );
}

async function tryGetJson(key) {
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
  data
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,

      Body:
        JSON.stringify(
          data,
          null,
          2
        ),

      ContentType:
        "application/json",
    })
  );
}

function cleanSentence(
  value = ""
) {
  return String(value)
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForDuplicate(
  value = ""
) {
  return String(value)
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(
  text = ""
) {
  return String(text)
    .replace(/\r/g, "")
    .split(
      /(?<=[.!?])\s+|\n+/
    )
    .map(cleanSentence)
    .filter(
      (sentence) =>
        sentence.length >= 30 &&
        sentence.length <= 600
    );
}

function detectFactType(
  sentence
) {
  if (
    /\b\d+(?:\.\d+)?\s?(mm|cm|m|metre|meter|mpa|kn|kg|ton|tonne|%|sqm|m²)\b/i.test(
      sentence
    )
  ) {
    return "technical_metric";
  }

  if (
    /\b(19|20)\d{2}\b/.test(
      sentence
    )
  ) {
    return "date_or_time";
  }

  if (
    /(concrete|rcc|steel|cement|reinforcement|rebar|grout|epoxy|mortar)/i.test(
      sentence
    )
  ) {
    return "material";
  }

  if (
    /(crack|damage|defect|failure|deterioration|corrosion|weak|distress)/i.test(
      sentence
    )
  ) {
    return "condition";
  }

  if (
    /(strengthen|repair|retrofit|replace|provide|install|recommend|propose)/i.test(
      sentence
    )
  ) {
    return "action_or_recommendation";
  }

  if (
    /(column|beam|slab|foundation|wall|footing|structure|structural)/i.test(
      sentence
    )
  ) {
    return "technical_description";
  }

  return null;
}

function confidenceFor(
  sentence,
  type
) {
  let score = 0.58;

  if (
    type ===
    "technical_metric"
  ) {
    score += 0.18;
  }

  if (
    /\d/.test(sentence)
  ) {
    score += 0.07;
  }

  if (
    /(shall|is|are|was|were|measured|observed|specified|provided)/i.test(
      sentence
    )
  ) {
    score += 0.05;
  }

  return Math.min(
    score,
    0.92
  );
}

function visualKindToFactType(
  kind,
  value
) {
  const normalizedKind =
    String(kind || "")
      .toLowerCase()
      .trim();

  if (
    [
      "dimension",
      "quantity",
      "scale",
    ].includes(
      normalizedKind
    )
  ) {
    return "technical_metric";
  }

  if (
    normalizedKind ===
    "date"
  ) {
    return "date_or_time";
  }

  if (
    [
      "material",
      "material_grade",
      "reinforcement_notation",
    ].includes(
      normalizedKind
    )
  ) {
    return "material";
  }

  if (
    normalizedKind ===
    "note" &&
    /(strengthen|repair|retrofit|replace|provide|install|recommend|propose)/i.test(
      value
    )
  ) {
    return "action_or_recommendation";
  }

  return "technical_description";
}

function visualCandidateText(
  kind,
  value
) {
  const labels = {
    drawing_title:
      "Drawing title",

    drawing_number:
      "Drawing number",

    revision:
      "Revision",

    scale:
      "Scale",

    project_name:
      "Project name",

    location:
      "Location",

    level:
      "Level",

    floor:
      "Floor",

    grid:
      "Grid",

    structural_element:
      "Structural element",

    dimension:
      "Dimension",

    reinforcement_notation:
      "Reinforcement notation",

    material_grade:
      "Material grade",

    material:
      "Material",

    detail_reference:
      "Detail reference",

    section_reference:
      "Section reference",

    note:
      "Drawing note",

    legend:
      "Legend",

    schedule:
      "Schedule",

    quantity:
      "Quantity",

    date:
      "Date",

    organisation:
      "Organisation",

    person:
      "Person",

    discipline:
      "Discipline",

    other:
      "Visual observation",
  };

  const label =
    labels[kind] ||
    "Visual observation";

  return `${label}: ${cleanSentence(
    value
  )}`;
}

function findPageRecord(
  pagesDocument,
  pageNumber
) {
  const pages =
    Array.isArray(
      pagesDocument?.pages
    )
      ? pagesDocument.pages
      : [];

  return (
    pages.find(
      (page, index) =>
        Number(
          page?.page ??
          page?.page_number ??
          index + 1
        ) ===
        Number(pageNumber)
    ) || null
  );
}

function clampVisualPipelineConfidence(
  value
) {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return 0.5;
  }

  /*
   * IMPORTANT:
   *
   * Vision-model confidence means
   * "how clearly the model believes
   * it can read the page".
   *
   * It is NOT factual verification.
   *
   * We deliberately cap visual
   * candidates below 0.80 so they
   * cannot accidentally appear
   * equivalent to deterministic
   * high-confidence source facts.
   */
  return Math.max(
    0.4,
    Math.min(
      number,
      0.79
    )
  );
}

try {
  const manifest =
    await getJson(
      manifestKey
    );

  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const pagesKey =
    `${basePath}/processed/pages.json`;

  const visualKey =
    `${basePath}/processed/visual-evidence.json`;

  const evidenceKey =
    `${basePath}/evidence/evidence-index.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const candidatesKey =
    `${basePath}/processed/fact-candidates.json`;

  const pagesDocument =
    await getJson(
      pagesKey
    );

  const visualDocument =
    await tryGetJson(
      visualKey
    );

  const evidenceIndex =
    await getJson(
      evidenceKey
    );

  const master =
    await getJson(
      masterKey
    );

  const candidates = [];

  const seen =
    new Set();

  let textCandidateCount = 0;
  let visualCandidateCount = 0;
  let duplicateCount = 0;

  /*
   * ------------------------------------
   * PART A — TEXT-DERIVED CANDIDATES
   * ------------------------------------
   */

  for (
    const page of
      pagesDocument.pages || []
  ) {
    const sentences =
      splitSentences(
        page.text
      );

    for (
      const sentence of
      sentences
    ) {
      const factType =
        detectFactType(
          sentence
        );

      if (!factType) {
        continue;
      }

      const normalized =
        normalizeForDuplicate(
          sentence
        );

      if (!normalized) {
        continue;
      }

      if (
        seen.has(normalized)
      ) {
        duplicateCount += 1;
        continue;
      }

      seen.add(normalized);

      const evidenceId =
        crypto.randomUUID();

      const confidence =
        confidenceFor(
          sentence,
          factType
        );

      candidates.push({
        id:
          evidenceId,

        fact_type:
          factType,

        candidate_fact:
          sentence,

        source_mode:
          "text",

        source: {
          import_id:
            manifest.import.id,

          object_key:
            manifest.source.object_key,

          page:
            page.page,

          page_text_sha256:
            page.text_sha256,
        },

        evidence: {
          evidence_type:
            "page_text",

          page:
            page.page,

          page_text_sha256:
            page.text_sha256,
        },

        confidence,

        status:
          "candidate",

        review_required:
          true,

        verification: {
          source_verified:
            false,

          independently_verified:
            false,
        },

        publication: {
          allowed:
            false,

          status:
            "blocked",
        },
      });

      textCandidateCount += 1;
    }
  }

  /*
   * ------------------------------------
   * PART B — VISUAL-DERIVED CANDIDATES
   * ------------------------------------
   *
   * Only consume observations created by
   * Stage 4B.
   *
   * We do NOT treat the visual model's
   * summary as a fact.
   *
   * We do NOT create facts from warnings.
   *
   * We do NOT verify anything here.
   */

  const visualPages =
    visualDocument?.status ===
      "visual_candidates_ready" &&
    Array.isArray(
      visualDocument?.pages
    )
      ? visualDocument.pages
      : [];

  for (
    const visualPage of
      visualPages
  ) {
    const pageNumber =
      Number(
        visualPage
          ?.page_number
      );

    if (
      !Number.isFinite(
        pageNumber
      )
    ) {
      continue;
    }

    const pageRecord =
      findPageRecord(
        pagesDocument,
        pageNumber
      );

    const observations =
      Array.isArray(
        visualPage
          ?.observations
      )
        ? visualPage.observations
        : [];

    for (
      const observation of
      observations
    ) {
      const value =
        cleanSentence(
          observation?.value
        );

      const visibleBasis =
        cleanSentence(
          observation
            ?.evidence
            ?.visible_basis
        );

      if (
        !value ||
        !visibleBasis
      ) {
        continue;
      }

      const kind =
        String(
          observation?.kind ||
          "other"
        )
          .toLowerCase()
          .trim();

      const factType =
        visualKindToFactType(
          kind,
          value
        );

      const candidateFact =
        visualCandidateText(
          kind,
          value
        );

      /*
       * Deduplicate using both the
       * labelled fact and raw value.
       *
       * This catches obvious repeated
       * visual observations while
       * remaining conservative about
       * text-vs-visual differences.
       */

      const normalizedFact =
        normalizeForDuplicate(
          candidateFact
        );

      const normalizedValue =
        normalizeForDuplicate(
          value
        );

      if (
        seen.has(
          normalizedFact
        ) ||
        seen.has(
          normalizedValue
        )
      ) {
        duplicateCount += 1;
        continue;
      }

      seen.add(
        normalizedFact
      );

      seen.add(
        normalizedValue
      );

      const visualId =
        observation
          ?.candidate_id ||
        `visual-${crypto.randomUUID()}`;

      const originalVisualConfidence =
        Number(
          observation
            ?.confidence
        );

      const pipelineConfidence =
        clampVisualPipelineConfidence(
          originalVisualConfidence
        );

      candidates.push({
        id:
          visualId,

        fact_type:
          factType,

        candidate_fact:
          candidateFact,

        source_mode:
          "visual",

        source: {
          import_id:
            manifest.import.id,

          object_key:
            manifest.source.object_key,

          page:
            pageNumber,

          page_text_sha256:
            pageRecord
              ?.text_sha256 ||
            null,

          visual_evidence_key:
            visualKey,

          render_sha256:
            visualPage
              ?.render_sha256 ||
            observation
              ?.evidence
              ?.render_sha256 ||
            null,
        },

        evidence: {
          evidence_type:
            "visual_page_analysis",

          page:
            pageNumber,

          visual_kind:
            kind,

          visible_basis:
            visibleBasis,

          visual_evidence_key:
            visualKey,

          render_sha256:
            visualPage
              ?.render_sha256 ||
            observation
              ?.evidence
              ?.render_sha256 ||
            null,

          /*
           * Keep original model reading
           * confidence separately from
           * Arknoz pipeline confidence.
           */
          visual_reading_confidence:
            Number.isFinite(
              originalVisualConfidence
            )
              ? originalVisualConfidence
              : null,
        },

        confidence:
          pipelineConfidence,

        status:
          "candidate",

        review_required:
          true,

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

      visualCandidateCount += 1;
    }
  }

  /*
   * ------------------------------------
   * SAVE COMBINED EVIDENCE POOL
   * ------------------------------------
   */

  evidenceIndex.evidence_items =
    candidates;

  evidenceIndex.candidate_summary = {
    total:
      candidates.length,

    text:
      textCandidateCount,

    visual:
      visualCandidateCount,

    duplicates_removed:
      duplicateCount,

    auto_approved:
      0,
  };

  evidenceIndex.status =
    "fact_candidates_ready";

  evidenceIndex.updated_at =
    new Date().toISOString();

  await putJson(
    evidenceKey,
    evidenceIndex
  );

  /*
   * ------------------------------------
   * FACT CANDIDATE FILE
   * ------------------------------------
   */

  await putJson(
    candidatesKey,
    {
      schema:
        "arknoz-fact-candidates-v1",

      import_id:
        manifest.import.id,

      candidate_count:
        candidates.length,

      candidate_sources: {
        text:
          textCandidateCount,

        visual:
          visualCandidateCount,

        duplicates_removed:
          duplicateCount,
      },

      candidates,

      safeguards: {
        auto_verified:
          0,

        independently_verified:
          0,

        publication_allowed:
          false,

        visual_candidates_are_ai_interpretations:
          true,

        visual_candidates_require_review:
          true,
      },

      generated_at:
        new Date().toISOString(),
    }
  );

  /*
   * ------------------------------------
   * PROJECT MASTER UPDATE
   * ------------------------------------
   */

  master.evidence =
    master.evidence || {};

  master.evidence.evidence_status =
    "fact_candidates_ready";

  master.evidence.fact_candidates_key =
    candidatesKey;

  master.evidence.candidate_count =
    candidates.length;

  master.evidence
    .text_candidate_count =
    textCandidateCount;

  master.evidence
    .visual_candidate_count =
    visualCandidateCount;

  master.evidence
    .candidate_duplicates_removed =
    duplicateCount;

  await putJson(
    masterKey,
    master
  );

  /*
   * ------------------------------------
   * MANIFEST UPDATE
   * ------------------------------------
   */

  manifest.processing =
    manifest.processing ||
    {};

  manifest.processing.fact_extraction =
    "complete";

  manifest.processing
    .fact_candidate_sources = {
      text:
        textCandidateCount,

      visual:
        visualCandidateCount,

      total:
        candidates.length,
    };

  manifest.evidence =
    manifest.evidence ||
    {};

  manifest.evidence.fact_candidate_count =
    candidates.length;

  manifest.evidence
    .text_fact_candidate_count =
    textCandidateCount;

  manifest.evidence
    .visual_fact_candidate_count =
    visualCandidateCount;

  manifest.import.status =
    "fact_candidates_ready";

  manifest.publication =
    manifest.publication ||
    {};

  manifest.publication.allowed =
    false;

  manifest.publication.status =
    "private";

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  /*
   * ------------------------------------
   * TERMINAL RESULT
   * ------------------------------------
   */

  console.log("");
  console.log(
    "FACT EXTRACTION: PASS"
  );

  console.log(
    `TEXT CANDIDATES: ${textCandidateCount}`
  );

  console.log(
    `VISUAL CANDIDATES: ${visualCandidateCount}`
  );

  console.log(
    `DUPLICATES REMOVED: ${duplicateCount}`
  );

  console.log(
    `TOTAL CANDIDATES: ${candidates.length}`
  );

  console.log(
    `FACT FILE: ${candidatesKey}`
  );

  console.log(
    `EVIDENCE INDEX: ${evidenceKey}`
  );

  console.log(
    "AUTO-APPROVED FACTS: 0"
  );

  console.log(
    "INDEPENDENTLY VERIFIED: 0"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: TEXT + VISUAL CANDIDATES READY"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "FACT EXTRACTION: FAIL"
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