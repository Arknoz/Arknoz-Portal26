import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey =
  process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\validate-project-candidates.mjs "<manifest-key>"'
  );
  process.exit(1);
}

const requiredEnv = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(
      `FAIL: Missing ${key}`
    );
    process.exit(1);
  }
}

/*
 * The six Arknoz Project parent
 * categories are permanently locked.
 */
const PROJECT_CATEGORIES = [
  "Buildings",
  "Infrastructure",
  "Transport",
  "Urban & Cities",
  "Industrial & Energy",
  "Landscape & Public Realm",
];

const ALLOWED_VISUAL_KINDS =
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

const r2 = new S3Client({
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

const bucket =
  process.env.R2_BUCKET_NAME;

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

function normalize(
  text = ""
) {
  return String(text)
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function looksWeakText(
  text = ""
) {
  const t =
    String(text).trim();

  if (t.length < 35) {
    return true;
  }

  if (
    /^(figure|table|page|note|photo|drawing)\b/i.test(
      t
    )
  ) {
    return true;
  }

  if (
    /^[\d\s.,:%()/-]+$/.test(
      t
    )
  ) {
    return true;
  }

  return false;
}

function containsUsefulTechnicalSignal(
  text = ""
) {
  return /(column|beam|slab|foundation|footing|concrete|rcc|steel|reinforcement|rebar|strength|load|repair|strengthen|retrofit|crack|damage|corrosion|mpa|mm|cm|kn|kg|tonne|meter|metre|drawing|revision|scale|section|detail|grid|level|floor|structural)/i.test(
    text
  );
}

function isVisualCandidate(
  candidate
) {
  return (
    candidate?.source_mode ===
      "visual" ||
    candidate?.evidence
      ?.evidence_type ===
      "visual_page_analysis"
  );
}

function validSha256(
  value
) {
  return /^[a-f0-9]{64}$/i.test(
    String(value || "")
  );
}

function validateVisualEvidence(
  candidate
) {
  const problems = [];

  const text =
    String(
      candidate
        ?.candidate_fact ||
      ""
    ).trim();

  const page =
    Number(
      candidate
        ?.source
        ?.page ??
      candidate
        ?.evidence
        ?.page
    );

  const visibleBasis =
    String(
      candidate
        ?.evidence
        ?.visible_basis ||
      ""
    ).trim();

  const renderHash =
    candidate
      ?.source
      ?.render_sha256 ||
    candidate
      ?.evidence
      ?.render_sha256 ||
    "";

  const visualKind =
    String(
      candidate
        ?.evidence
        ?.visual_kind ||
      ""
    )
      .toLowerCase()
      .trim();

  const confidence =
    Number(
      candidate?.confidence
    );

  if (!text) {
    problems.push(
      "missing_candidate_fact"
    );
  }

  if (
    !Number.isInteger(page) ||
    page < 1
  ) {
    problems.push(
      "invalid_page_reference"
    );
  }

  if (!visibleBasis) {
    problems.push(
      "missing_visible_basis"
    );
  }

  if (
    !validSha256(
      renderHash
    )
  ) {
    problems.push(
      "missing_or_invalid_render_sha256"
    );
  }

  if (
    !visualKind ||
    !ALLOWED_VISUAL_KINDS.has(
      visualKind
    )
  ) {
    problems.push(
      "invalid_visual_kind"
    );
  }

  if (
    !Number.isFinite(
      confidence
    ) ||
    confidence < 0 ||
    confidence > 0.79
  ) {
    problems.push(
      "invalid_visual_pipeline_confidence"
    );
  }

  return {
    valid:
      problems.length === 0,

    problems,

    page,

    visual_kind:
      visualKind,

    visible_basis:
      visibleBasis,

    render_sha256:
      renderHash,
  };
}

function determineTextDecision(
  candidate
) {
  const text =
    candidate
      ?.candidate_fact ||
    "";

  if (
    looksWeakText(text)
  ) {
    return {
      decision:
        "reject_noise",

      reason:
        "weak_or_fragmentary_text",
    };
  }

  if (
    !containsUsefulTechnicalSignal(
      text
    )
  ) {
    return {
      decision:
        "review",

      reason:
        "limited_project_signal",
    };
  }

  if (
    Number(
      candidate.confidence
    ) >= 0.85
  ) {
    return {
      decision:
        "promotion_candidate",

      reason:
        "high_confidence_text_with_technical_signal",
    };
  }

  if (
    Number(
      candidate.confidence
    ) >= 0.7
  ) {
    return {
      decision:
        "review",

      reason:
        "medium_confidence_text",
    };
  }

  return {
    decision:
      "review_low",

    reason:
      "low_confidence_text",
  };
}

function determineVisualDecision(
  candidate
) {
  const evidenceCheck =
    validateVisualEvidence(
      candidate
    );

  if (
    !evidenceCheck.valid
  ) {
    return {
      decision:
        "reject_noise",

      reason:
        "invalid_visual_evidence",

      visual_validation:
        evidenceCheck,
    };
  }

  const confidence =
    Number(
      candidate.confidence
    );

  /*
   * IMPORTANT:
   *
   * Visual AI observations never
   * become promotion candidates in
   * deterministic QC.
   *
   * A clearly readable drawing is
   * still an AI interpretation until
   * later evidence/source validation.
   */

  if (
    confidence >= 0.6
  ) {
    return {
      decision:
        "review",

      reason:
        "visual_evidence_requires_semantic_review",

      visual_validation:
        evidenceCheck,
    };
  }

  return {
    decision:
      "review_low",

    reason:
      "low_confidence_visual_evidence",

    visual_validation:
      evidenceCheck,
  };
}

function determineDecision(
  candidate
) {
  if (
    isVisualCandidate(
      candidate
    )
  ) {
    return determineVisualDecision(
      candidate
    );
  }

  return determineTextDecision(
    candidate
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

  const candidatesKey =
    `${basePath}/processed/fact-candidates.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const candidateDoc =
    await getJson(
      candidatesKey
    );

  const master =
    await getJson(
      masterKey
    );

  /*
   * --------------------------------
   * TAXONOMY HARD GATE
   * --------------------------------
   */

  if (
    master
      ?.identity
      ?.category &&
    !PROJECT_CATEGORIES.includes(
      master.identity.category
    )
  ) {
    throw new Error(
      `Invalid parent category: ${master.identity.category}`
    );
  }

  const sourceCandidates =
    Array.isArray(
      candidateDoc
        ?.candidates
    )
      ? candidateDoc.candidates
      : [];

  /*
   * --------------------------------
   * DUPLICATE CHECK
   * --------------------------------
   */

  const unique = [];
  const duplicates = [];

  const seen =
    new Map();

  for (
    const candidate of
      sourceCandidates
  ) {
    const key =
      normalize(
        candidate
          ?.candidate_fact
      );

    if (!key) {
      /*
       * Empty candidates are not
       * silently discarded. Preserve
       * them for QC so they can be
       * explicitly rejected.
       */
      unique.push(
        candidate
      );

      continue;
    }

    if (
      seen.has(key)
    ) {
      duplicates.push({
        candidate_id:
          candidate.id,

        duplicate_of:
          seen.get(key),

        text:
          candidate
            .candidate_fact,

        source_mode:
          candidate
            ?.source_mode ||
          "unknown",
      });

      continue;
    }

    seen.set(
      key,
      candidate.id
    );

    unique.push(
      candidate
    );
  }

  /*
   * --------------------------------
   * VALIDATION
   * --------------------------------
   */

  const validated = [];

  for (
    const candidate of
      unique
  ) {
    const result =
      determineDecision(
        candidate
      );

    const visual =
      isVisualCandidate(
        candidate
      );

    validated.push({
      ...candidate,

      validation: {
        decision:
          result.decision,

        reason:
          result.reason,

        evidence_mode:
          visual
            ? "visual"
            : "text",

        auto_verified:
          false,

        source_verified:
          false,

        independently_verified:
          false,

        human_review_required:
          true,

        visual_validation:
          result
            .visual_validation ||
          null,
      },

      publication: {
        ...(
          candidate
            ?.publication ||
          {}
        ),

        allowed:
          false,

        status:
          "blocked",
      },
    });
  }

  /*
   * --------------------------------
   * GROUP RESULTS
   * --------------------------------
   */

  const promotionCandidates =
    validated.filter(
      (item) =>
        item
          .validation
          .decision ===
        "promotion_candidate"
    );

  const reviewCandidates =
    validated.filter(
      (item) =>
        item
          .validation
          .decision ===
          "review" ||
        item
          .validation
          .decision ===
          "review_low"
    );

  const rejectedNoise =
    validated.filter(
      (item) =>
        item
          .validation
          .decision ===
        "reject_noise"
    );

  const visualCandidates =
    validated.filter(
      (item) =>
        item
          .validation
          .evidence_mode ===
        "visual"
    );

  const textCandidates =
    validated.filter(
      (item) =>
        item
          .validation
          .evidence_mode ===
        "text"
    );

  const visualReview =
    reviewCandidates.filter(
      (item) =>
        item
          .validation
          .evidence_mode ===
        "visual"
    );

  const visualRejected =
    rejectedNoise.filter(
      (item) =>
        item
          .validation
          .evidence_mode ===
        "visual"
    );

  /*
   * --------------------------------
   * SAVE QC DOCUMENT
   * --------------------------------
   */

  const qcKey =
    `${basePath}/review/quality-control.json`;

  const qcDocument = {
    schema:
      "arknoz-project-quality-control-v2",

    import_id:
      manifest.import.id,

    project: {
      category:
        master
          ?.identity
          ?.category ||
        null,

      type:
        master
          ?.identity
          ?.type ||
        null,

      subtype:
        master
          ?.identity
          ?.subtype ||
        null,
    },

    totals: {
      original_candidates:
        sourceCandidates.length,

      unique_candidates:
        unique.length,

      duplicates:
        duplicates.length,

      text_candidates:
        textCandidates.length,

      visual_candidates:
        visualCandidates.length,

      promotion_candidates:
        promotionCandidates.length,

      review_candidates:
        reviewCandidates.length,

      visual_review_candidates:
        visualReview.length,

      rejected_noise:
        rejectedNoise.length,

      visual_rejected:
        visualRejected.length,

      auto_verified:
        0,

      source_verified:
        0,

      independently_verified:
        0,
    },

    promotion_candidates:
      promotionCandidates,

    review_candidates:
      reviewCandidates,

    rejected_noise:
      rejectedNoise,

    duplicates,

    safeguards: {
      taxonomy_locked:
        true,

      allowed_parent_categories:
        PROJECT_CATEGORIES,

      facts_auto_verified:
        false,

      visual_ai_auto_verified:
        false,

      visual_ai_auto_promoted:
        false,

      source_verification_required:
        true,

      independent_verification_separate:
        true,

      rights_auto_approved:
        false,

      publication_allowed:
        false,
    },

    generated_at:
      new Date()
        .toISOString(),
  };

  await putJson(
    qcKey,
    qcDocument
  );

  /*
   * --------------------------------
   * UPDATE PROJECT MASTER
   * --------------------------------
   */

  master.validation =
    master.validation ||
    {};

  master.validation
    .quality_control_key =
    qcKey;

  master.validation
    .promotion_candidates =
    promotionCandidates.length;

  master.validation
    .review_candidates =
    reviewCandidates.length;

  master.validation
    .visual_review_candidates =
    visualReview.length;

  master.validation
    .rejected_noise =
    rejectedNoise.length;

  master.validation
    .visual_rejected =
    visualRejected.length;

  master.validation
    .duplicates =
    duplicates.length;

  master.validation
    .auto_verified_facts =
    0;

  master.publication =
    master.publication ||
    {};

  master.publication.status =
    "private";

  master.publication.allowed =
    false;

  await putJson(
    masterKey,
    master
  );

  /*
   * --------------------------------
   * UPDATE MANIFEST
   * --------------------------------
   */

  manifest.processing =
    manifest.processing ||
    {};

  manifest.processing
    .quality_control =
    "complete";

  manifest.import.status =
    "quality_control_ready";

  manifest.quality_control = {
    object_key:
      qcKey,

    text_candidates:
      textCandidates.length,

    visual_candidates:
      visualCandidates.length,

    promotion_candidates:
      promotionCandidates.length,

    review_candidates:
      reviewCandidates.length,

    visual_review_candidates:
      visualReview.length,

    rejected_noise:
      rejectedNoise.length,

    visual_rejected:
      visualRejected.length,

    duplicates:
      duplicates.length,
  };

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
   * --------------------------------
   * TERMINAL OUTPUT
   * --------------------------------
   */

  console.log("");
  console.log(
    "ARKNOZ QUALITY CONTROL: PASS"
  );

  console.log(
    `ORIGINAL: ${sourceCandidates.length}`
  );

  console.log(
    `UNIQUE: ${unique.length}`
  );

  console.log(
    `TEXT CANDIDATES: ${textCandidates.length}`
  );

  console.log(
    `VISUAL CANDIDATES: ${visualCandidates.length}`
  );

  console.log(
    `DUPLICATES: ${duplicates.length}`
  );

  console.log(
    `PROMOTION CANDIDATES: ${promotionCandidates.length}`
  );

  console.log(
    `REVIEW: ${reviewCandidates.length}`
  );

  console.log(
    `VISUAL REVIEW: ${visualReview.length}`
  );

  console.log(
    `NOISE REJECTED: ${rejectedNoise.length}`
  );

  console.log(
    `VISUAL REJECTED: ${visualRejected.length}`
  );

  console.log(
    "AUTO-VERIFIED: 0"
  );

  console.log(
    `QC FILE: ${qcKey}`
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: QUALITY CONTROL READY"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ QUALITY CONTROL: FAIL"
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