import crypto from "node:crypto";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey =
  process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\verify-source-backed-facts.mjs "<manifest-key>"'
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

const MIN_TEXT_PROPOSAL_CONFIDENCE =
  0.85;

const MIN_VISUAL_PROPOSAL_CONFIDENCE =
  0.70;

const MIN_VISUAL_PIPELINE_CONFIDENCE =
  0.60;

const MAX_VISUAL_PIPELINE_CONFIDENCE =
  0.79;

const MIN_VISUAL_READING_CONFIDENCE =
  0.60;

const ALLOWED_FIELDS =
  new Set([
    "identity.title",
    "identity.type",
    "identity.subtype",
    "identity.status",

    "geography.country",
    "geography.region",
    "geography.city",

    "temporal.construction_start",
    "temporal.completion_date",

    "attributes_facts.material",
    "attributes_facts.system",
    "attributes_facts.condition",
    "attributes_facts.metric",
    "attributes_facts.performance",
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

function unique(values = []) {
  return [
    ...new Set(values),
  ];
}

function normalize(
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

function validSha256(value) {
  return /^[a-f0-9]{64}$/i.test(
    String(value || "")
  );
}

function getPageNumber(value) {
  const page =
    Number(value);

  if (
    !Number.isInteger(page) ||
    page < 1
  ) {
    return null;
  }

  return page;
}

function isVisualCandidate(
  candidate
) {
  return (
    candidate?.source_mode ===
      "visual" ||
    candidate
      ?.evidence
      ?.evidence_type ===
      "visual_page_analysis"
  );
}

function rawCandidateValue(
  candidate
) {
  const fact =
    String(
      candidate
        ?.candidate_fact ||
      ""
    ).trim();

  const colon =
    fact.indexOf(":");

  if (colon >= 0) {
    return fact
      .slice(
        colon + 1
      )
      .trim();
  }

  return fact;
}

/*
 * Derive a conservative semantic
 * meaning for old visual observations
 * that Stage 4B labelled "other".
 *
 * Original evidence is NOT rewritten.
 */
function effectiveVisualKind(
  candidate
) {
  const original =
    String(
      candidate
        ?.evidence
        ?.visual_kind ||
      ""
    )
      .toLowerCase()
      .trim();

  if (
    original &&
    original !== "other"
  ) {
    return original;
  }

  const value =
    rawCandidateValue(
      candidate
    );

  const basis =
    String(
      candidate
        ?.evidence
        ?.visible_basis ||
      ""
    );

  const combined =
    `${value} ${basis}`
      .toLowerCase();

  if (
    /\bsection\s*[-_ ]?\d+/i.test(
      value
    ) ||
    /\bsection reference\b/i.test(
      basis
    )
  ) {
    return "section_reference";
  }

  if (
    /\b(foundation|floor|roof|site|structural)\s+plan\b/i.test(
      value
    ) ||
    /\bplan title\b/i.test(
      basis
    )
  ) {
    return "drawing_title";
  }

  if (
    /^[-+]?\d+(?:\.\d+)?(?:\s*(?:mm|cm|m|metre|meter))?$/i.test(
      value.trim()
    ) &&
    /\b(dimension|dimension line|measurement|overall|length|width|depth|spacing|offset)\b/i.test(
      basis
    )
  ) {
    return "dimension";
  }

  if (
    /\b(r\/f|reinforcement|rebar|bar|bars|top r\/f|bottom r\/f|side face r\/f)\b/i.test(
      combined
    )
  ) {
    return "reinforcement_notation";
  }

  if (
    /\b(fe\s*\d{3}|m\s*\d{2,3}|grade)\b/i.test(
      combined
    )
  ) {
    return "material_grade";
  }

  if (
    /\b(concrete|rcc|steel|cement|grout|mortar)\b/i.test(
      combined
    )
  ) {
    return "material";
  }

  return (
    original ||
    "other"
  );
}

function visualKindSupportsField(
  kind,
  field,
  value
) {
  if (
    kind ===
    "project_name"
  ) {
    return (
      field ===
      "identity.title"
    );
  }

  if (
    kind ===
    "location"
  ) {
    return [
      "geography.country",
      "geography.region",
      "geography.city",
    ].includes(field);
  }

  if (
    kind ===
    "structural_element"
  ) {
    return (
      field ===
      "attributes_facts.system"
    );
  }

  if (
    kind ===
      "dimension" ||
    kind ===
      "quantity"
  ) {
    return (
      field ===
      "attributes_facts.metric"
    );
  }

  if (
    kind ===
      "material" ||
    kind ===
      "material_grade"
  ) {
    return (
      field ===
      "attributes_facts.material"
    );
  }

  if (
    kind ===
    "reinforcement_notation"
  ) {
    if (
      field ===
      "attributes_facts.system"
    ) {
      return true;
    }

    if (
      field ===
        "attributes_facts.metric" &&
      /\d/.test(
        String(value)
      )
    ) {
      return true;
    }

    if (
      field ===
        "attributes_facts.material" &&
      /\b(fe\s*\d{3}|steel|rebar|tmt)\b/i.test(
        String(value)
      )
    ) {
      return true;
    }

    return false;
  }

  if (
    kind === "note"
  ) {
    return [
      "attributes_facts.material",
      "attributes_facts.system",
      "attributes_facts.condition",
      "attributes_facts.metric",
      "attributes_facts.performance",
    ].includes(field);
  }

  /*
   * Drawing metadata does not become
   * a Project fact merely because it
   * is legible.
   */
  return false;
}

function valueGroundedInVisualCandidate(
  proposalValue,
  candidate,
  visualRecord
) {
  const proposed =
    normalize(
      proposalValue
    );

  const candidateFact =
    normalize(
      candidate
        ?.candidate_fact ||
      ""
    );

  const candidateValue =
    normalize(
      rawCandidateValue(
        candidate
      )
    );

  const observedValue =
    normalize(
      visualRecord
        ?.value ||
      ""
    );

  if (!proposed) {
    return false;
  }

  return (
    proposed ===
      candidateValue ||
    proposed ===
      observedValue ||
    candidateFact.includes(
      proposed
    ) ||
    (
      candidateValue &&
      proposed.includes(
        candidateValue
      )
    ) ||
    (
      observedValue &&
      proposed.includes(
        observedValue
      )
    )
  );
}

function buildTextPageMap(
  pagesDocument
) {
  const map =
    new Map();

  const pages =
    Array.isArray(
      pagesDocument?.pages
    )
      ? pagesDocument.pages
      : [];

  for (
    let index = 0;
    index < pages.length;
    index += 1
  ) {
    const page =
      pages[index];

    const pageNumber =
      getPageNumber(
        page?.page ??
        page?.page_number ??
        index + 1
      );

    if (!pageNumber) {
      continue;
    }

    map.set(
      pageNumber,
      {
        page_number:
          pageNumber,

        text_sha256:
          page
            ?.text_sha256 ||
          null,
      }
    );
  }

  return map;
}

function buildVisualMap(
  visualDocument
) {
  const map =
    new Map();

  const pages =
    Array.isArray(
      visualDocument?.pages
    )
      ? visualDocument.pages
      : [];

  for (
    const page of pages
  ) {
    const pageNumber =
      getPageNumber(
        page?.page_number
      );

    if (!pageNumber) {
      continue;
    }

    const pageRenderHash =
      page?.render_sha256 ||
      null;

    const observations =
      Array.isArray(
        page?.observations
      )
        ? page.observations
        : [];

    for (
      const observation of
        observations
    ) {
      const id =
        String(
          observation
            ?.candidate_id ||
          ""
        ).trim();

      if (!id) {
        continue;
      }

      map.set(
        id,
        {
          candidate_id:
            id,

          page_number:
            pageNumber,

          render_sha256:
            observation
              ?.evidence
              ?.render_sha256 ||
            pageRenderHash ||
            null,

          original_kind:
            String(
              observation
                ?.kind ||
              "other"
            )
              .toLowerCase()
              .trim(),

          value:
            String(
              observation
                ?.value ||
              ""
            ).trim(),

          visible_basis:
            String(
              observation
                ?.evidence
                ?.visible_basis ||
              ""
            ).trim(),

          reading_confidence:
            Number(
              observation
                ?.confidence
            ),
        }
      );
    }
  }

  return map;
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

  const validationKey =
    `${basePath}/review/semantic-validation.json`;

  const semanticKey =
    `${basePath}/review/semantic-review-ai.json`;

  const candidatesKey =
    `${basePath}/processed/fact-candidates.json`;

  const pagesKey =
    `${basePath}/processed/pages.json`;

  const visualKey =
    `${basePath}/processed/visual-evidence.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const verificationKey =
    `${basePath}/verified/source-verification.json`;

  const validation =
    await getJson(
      validationKey
    );

  const semantic =
    await getJson(
      semanticKey
    );

  const candidateDoc =
    await getJson(
      candidatesKey
    );

  const pagesDocument =
    await getJson(
      pagesKey
    );

  const visualDocument =
    await tryGetJson(
      visualKey
    );

  const master =
    await getJson(
      masterKey
    );

  /*
   * ==================================
   * SEMANTIC HARD GATE
   * ==================================
   */

  if (
    validation
      ?.gate
      ?.ready_for_verification !==
    true
  ) {
    throw new Error(
      "Semantic validation is not ready for verification."
    );
  }

  if (
    validation
      ?.totals
      ?.coverage_percent !==
    100
  ) {
    throw new Error(
      "Semantic candidate coverage is not 100%."
    );
  }

  if (
    validation
      ?.totals
      ?.missing !== 0 ||
    validation
      ?.totals
      ?.overlapping !== 0 ||
    validation
      ?.totals
      ?.unknown_returned_ids !== 0 ||
    validation
      ?.totals
      ?.invalid_proposed_fields !== 0 ||
    validation
      ?.totals
      ?.possible_field_conflicts !== 0
  ) {
    throw new Error(
      "Semantic validation still contains unresolved issues."
    );
  }

  /*
   * ==================================
   * CANDIDATE MAPS
   * ==================================
   */

  const candidateMap =
    new Map();

  for (
    const candidate of
      candidateDoc.candidates ||
      []
  ) {
    candidateMap.set(
      String(
        candidate.id
      ),
      candidate
    );
  }

  const confirmedIds =
    new Set(
      semantic
        ?.combined
        ?.confirmed_candidate_ids ||
      []
    );

  const proposals =
    semantic
      ?.combined
      ?.proposed_project_fields ||
    [];

  const textPageMap =
    buildTextPageMap(
      pagesDocument
    );

  const visualMap =
    buildVisualMap(
      visualDocument
    );

  const visualDocumentUsable =
    Boolean(
      visualDocument &&
      visualDocument.status ===
        "visual_candidates_ready" &&
      visualDocument
        ?.source
        ?.object_key ===
        manifest
          ?.source
          ?.object_key
    );

  const sourceVerified = [];
  const heldForReview = [];

  /*
   * ==================================
   * PROPOSALS
   * ==================================
   */

  for (
    let index = 0;
    index < proposals.length;
    index += 1
  ) {
    const proposal =
      proposals[index];

    const field =
      String(
        proposal?.field ||
        ""
      ).trim();

    const value =
      String(
        proposal?.value ||
        ""
      ).trim();

    const confidence =
      Number(
        proposal?.confidence
      ) || 0;

    const refs =
      unique(
        proposal
          ?.candidate_ids ||
        []
      ).map(String);

    const reasons = [];
    const evidence = [];

    /*
     * Determine evidence mode BEFORE
     * applying proposal confidence.
     */
    let hasVisualEvidence =
      false;

    let hasTextEvidence =
      false;

    for (
      const id of refs
    ) {
      const candidate =
        candidateMap.get(id);

      if (!candidate) {
        continue;
      }

      if (
        isVisualCandidate(
          candidate
        )
      ) {
        hasVisualEvidence =
          true;
      } else {
        hasTextEvidence =
          true;
      }
    }

    const proposalEvidenceMode =
      hasVisualEvidence &&
      hasTextEvidence
        ? "mixed"
        : hasVisualEvidence
          ? "visual"
          : "text";

    const minimumProposalConfidence =
      hasVisualEvidence
        ? MIN_VISUAL_PROPOSAL_CONFIDENCE
        : MIN_TEXT_PROPOSAL_CONFIDENCE;

    /*
     * --------------------------------
     * PROPOSAL-LEVEL CHECKS
     * --------------------------------
     */

    if (
      !ALLOWED_FIELDS.has(
        field
      )
    ) {
      reasons.push(
        "field_not_allowed"
      );
    }

    if (!value) {
      reasons.push(
        "empty_value"
      );
    }

    if (
      confidence <
      minimumProposalConfidence
    ) {
      reasons.push(
        hasVisualEvidence
          ? "visual_proposal_confidence_below_0_70"
          : "text_proposal_confidence_below_0_85"
      );
    }

    if (!refs.length) {
      reasons.push(
        "no_evidence_refs"
      );
    }

    const recommendationLanguage =
      /\b(recommend|recommended|recommendation|propose|proposed|suggest|suggested|should|to be provided|shall be provided|to be installed|shall be installed|to be repaired|shall be repaired)\b/i;

    if (
      recommendationLanguage.test(
        value
      )
    ) {
      reasons.push(
        "recommendation_or_future_action"
      );
    }

    /*
     * --------------------------------
     * EVIDENCE CHECKS
     * --------------------------------
     */

    for (
      const id of refs
    ) {
      const candidate =
        candidateMap.get(id);

      if (!candidate) {
        reasons.push(
          `missing_candidate:${id}`
        );

        continue;
      }

      if (
        !confirmedIds.has(
          id
        )
      ) {
        reasons.push(
          `candidate_not_confirmed:${id}`
        );
      }

      const sourceObjectKey =
        candidate
          ?.source
          ?.object_key ||
        null;

      if (!sourceObjectKey) {
        reasons.push(
          `missing_source_object:${id}`
        );
      } else if (
        sourceObjectKey !==
        manifest
          ?.source
          ?.object_key
      ) {
        reasons.push(
          `source_object_mismatch:${id}`
        );
      }

      const page =
        getPageNumber(
          candidate
            ?.source
            ?.page
        );

      if (!page) {
        reasons.push(
          `missing_source_page:${id}`
        );
      }

      /*
       * ==============================
       * VISUAL EVIDENCE
       * ==============================
       */

      if (
        isVisualCandidate(
          candidate
        )
      ) {
        const visualRecord =
          visualMap.get(id);

        const candidateRenderHash =
          candidate
            ?.source
            ?.render_sha256 ||
          candidate
            ?.evidence
            ?.render_sha256 ||
          null;

        const visibleBasis =
          String(
            candidate
              ?.evidence
              ?.visible_basis ||
            ""
          ).trim();

        const originalKind =
          String(
            candidate
              ?.evidence
              ?.visual_kind ||
            visualRecord
              ?.original_kind ||
            "other"
          )
            .toLowerCase()
            .trim();

        const effectiveKind =
          effectiveVisualKind(
            candidate
          );

        const pipelineConfidence =
          Number(
            candidate
              ?.confidence
          );

        const readingConfidence =
          Number(
            candidate
              ?.evidence
              ?.visual_reading_confidence ??
            visualRecord
              ?.reading_confidence
          );

        if (
          !visualDocumentUsable
        ) {
          reasons.push(
            `visual_evidence_document_not_usable:${id}`
          );
        }

        if (!visualRecord) {
          reasons.push(
            `visual_candidate_not_found_in_visual_evidence:${id}`
          );
        }

        if (!visibleBasis) {
          reasons.push(
            `missing_visible_basis:${id}`
          );
        }

        if (
          !validSha256(
            candidateRenderHash
          )
        ) {
          reasons.push(
            `missing_or_invalid_render_sha256:${id}`
          );
        }

        if (
          visualRecord &&
          candidateRenderHash &&
          visualRecord
            .render_sha256 !==
            candidateRenderHash
        ) {
          reasons.push(
            `render_sha256_mismatch:${id}`
          );
        }

        if (
          visualRecord &&
          page &&
          visualRecord
            .page_number !==
            page
        ) {
          reasons.push(
            `visual_page_mismatch:${id}`
          );
        }

        if (
          !Number.isFinite(
            pipelineConfidence
          ) ||
          pipelineConfidence <
            MIN_VISUAL_PIPELINE_CONFIDENCE ||
          pipelineConfidence >
            MAX_VISUAL_PIPELINE_CONFIDENCE
        ) {
          reasons.push(
            `visual_pipeline_confidence_not_eligible:${id}`
          );
        }

        if (
          !Number.isFinite(
            readingConfidence
          ) ||
          readingConfidence <
            MIN_VISUAL_READING_CONFIDENCE
        ) {
          reasons.push(
            `visual_reading_confidence_below_0_60:${id}`
          );
        }

        /*
         * Independent deterministic
         * semantic guard.
         */
        if (
          !visualKindSupportsField(
            effectiveKind,
            field,
            value
          )
        ) {
          reasons.push(
            `visual_kind_does_not_support_project_field:${id}:${effectiveKind}`
          );
        }

        if (
          visualRecord &&
          !valueGroundedInVisualCandidate(
            value,
            candidate,
            visualRecord
          )
        ) {
          reasons.push(
            `proposal_value_not_grounded_in_visual_observation:${id}`
          );
        }

        evidence.push({
          candidate_id:
            id,

          evidence_mode:
            "visual",

          source_object_key:
            sourceObjectKey,

          page,

          visual_evidence_key:
            candidate
              ?.source
              ?.visual_evidence_key ||
            visualKey,

          render_sha256:
            candidateRenderHash,

          original_visual_kind:
            originalKind,

          effective_visual_kind:
            effectiveKind,

          visible_basis:
            visibleBasis ||
            visualRecord
              ?.visible_basis ||
            null,

          source_statement:
            candidate
              ?.candidate_fact ||
            null,

          extraction_confidence:
            candidate
              ?.confidence ??
            null,

          visual_reading_confidence:
            Number.isFinite(
              readingConfidence
            )
              ? readingConfidence
              : null,

          traceability: {
            candidate_exists:
              true,

            candidate_confirmed:
              confirmedIds.has(
                id
              ),

            visual_record_exists:
              Boolean(
                visualRecord
              ),

            render_hash_matched:
              Boolean(
                visualRecord &&
                candidateRenderHash &&
                visualRecord
                  .render_sha256 ===
                  candidateRenderHash
              ),

            field_mapping_supported:
              visualKindSupportsField(
                effectiveKind,
                field,
                value
              ),
          },
        });

        continue;
      }

      /*
       * ==============================
       * TEXT EVIDENCE
       * ==============================
       */

      const pageHash =
        candidate
          ?.source
          ?.page_text_sha256 ||
        null;

      if (!pageHash) {
        reasons.push(
          `missing_page_hash:${id}`
        );
      }

      const authoritativePage =
        page
          ? textPageMap.get(
              page
            )
          : null;

      if (
        page &&
        !authoritativePage
      ) {
        reasons.push(
          `page_not_found_in_page_evidence:${id}`
        );
      }

      if (
        pageHash &&
        authoritativePage
          ?.text_sha256 &&
        pageHash !==
          authoritativePage
            .text_sha256
      ) {
        reasons.push(
          `page_hash_mismatch:${id}`
        );
      }

      evidence.push({
        candidate_id:
          id,

        evidence_mode:
          "text",

        source_object_key:
          sourceObjectKey,

        page,

        page_text_sha256:
          pageHash,

        source_statement:
          candidate
            ?.candidate_fact ||
          null,

        extraction_confidence:
          candidate
            ?.confidence ??
          null,

        traceability: {
          candidate_exists:
            true,

          candidate_confirmed:
            confirmedIds.has(
              id
            ),

          page_record_exists:
            Boolean(
              authoritativePage
            ),

          page_hash_matched:
            Boolean(
              pageHash &&
              authoritativePage
                ?.text_sha256 &&
              pageHash ===
                authoritativePage
                  .text_sha256
            ),
        },
      });
    }

    const uniqueReasons =
      unique(reasons);

    if (
      uniqueReasons.length >
      0
    ) {
      heldForReview.push({
        proposal_index:
          index,

        field,

        value,

        confidence,

        evidence_mode:
          proposalEvidenceMode,

        required_minimum_confidence:
          minimumProposalConfidence,

        candidate_ids:
          refs,

        evidence,

        reasons:
          uniqueReasons,

        status:
          "held_for_review",

        verified:
          false,

        independently_verified:
          false,

        publication_allowed:
          false,
      });

      continue;
    }

    /*
     * =================================
     * SOURCE VERIFIED
     * =================================
     *
     * This means only that the uploaded
     * source supports the fact and that
     * it can be traced back to evidence.
     *
     * It does NOT mean:
     *
     * independently verified
     * authority verified
     * rights approved
     * publication approved
     */

    sourceVerified.push({
      fact_id:
        crypto.randomUUID(),

      field,

      value,

      confidence,

      candidate_ids:
        refs,

      evidence_mode:
        proposalEvidenceMode,

      evidence,

      verification: {
        status:
          "source_verified",

        scope:
          "verified_against_uploaded_source",

        method:
          hasVisualEvidence
            ? "traceable_visual_source_evidence"
            : "traceable_text_source_evidence",

        independently_verified:
          false,

        verified_at:
          new Date()
            .toISOString(),
      },

      rights: {
        publication_allowed:
          false,

        reason:
          "Rights and publication review remain separate.",
      },

      publication: {
        allowed:
          false,

        status:
          "blocked",
      },
    });
  }

  /*
   * ==================================
   * COUNTS
   * ==================================
   */

  const textVerified =
    sourceVerified.filter(
      (fact) =>
        fact
          .evidence_mode ===
        "text"
    ).length;

  const visualVerified =
    sourceVerified.filter(
      (fact) =>
        fact
          .evidence_mode ===
        "visual"
    ).length;

  const mixedVerified =
    sourceVerified.filter(
      (fact) =>
        fact
          .evidence_mode ===
        "mixed"
    ).length;

  const visualHeld =
    heldForReview.filter(
      (proposal) =>
        proposal
          .evidence
          ?.some(
            (item) =>
              item
                .evidence_mode ===
              "visual"
          )
    ).length;

  /*
   * ==================================
   * VERIFICATION RECORD
   * ==================================
   */

  const verificationDocument = {
    schema:
      "arknoz-source-verification-v3",

    import_id:
      manifest.import.id,

    source: {
      object_key:
        manifest.source.object_key,

      original_filename:
        manifest.source.original_filename,

      sha256:
        manifest.source.sha256,
    },

    totals: {
      input_proposals:
        proposals.length,

      source_verified:
        sourceVerified.length,

      text_source_verified:
        textVerified,

      visual_source_verified:
        visualVerified,

      mixed_source_verified:
        mixedVerified,

      held_for_review:
        heldForReview.length,

      visual_held_for_review:
        visualHeld,

      independently_verified:
        0,

      publication_allowed:
        0,
    },

    source_verified_facts:
      sourceVerified,

    held_for_review:
      heldForReview,

    definitions: {
      source_verified:
        "The fact is supported by the uploaded source and is traceable to the specific source evidence.",

      visual_source_verified:
        "The fact is supported by a visible observation in the uploaded source, with candidate, page, render hash, visible basis and semantic mapping traceability.",

      independently_verified:
        "The fact has been corroborated using an independent authoritative source.",

      publishable:
        "The fact and all relevant authority, rights and publication controls have separately passed Arknoz publication gates.",
    },

    safeguards: {
      semantic_validation_required:
        true,

      coverage_required:
        100,

      confirmed_candidate_required:
        true,

      source_object_match_required:
        true,

      text_page_hash_required:
        true,

      visual_candidate_record_required:
        true,

      visual_page_required:
        true,

      visual_render_hash_required:
        true,

      visual_visible_basis_required:
        true,

      visual_effective_kind_required:
        true,

      visual_field_mapping_guard:
        true,

      visual_value_grounding_required:
        true,

      minimum_text_proposal_confidence:
        MIN_TEXT_PROPOSAL_CONFIDENCE,

      minimum_visual_proposal_confidence:
        MIN_VISUAL_PROPOSAL_CONFIDENCE,

      minimum_visual_pipeline_confidence:
        MIN_VISUAL_PIPELINE_CONFIDENCE,

      maximum_visual_pipeline_confidence:
        MAX_VISUAL_PIPELINE_CONFIDENCE,

      minimum_visual_reading_confidence:
        MIN_VISUAL_READING_CONFIDENCE,

      drawing_metadata_not_project_fact:
        true,

      recommendations_blocked:
        true,

      independently_verified:
        false,

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
    verificationKey,
    verificationDocument
  );

  /*
   * ==================================
   * PROJECT MASTER
   * ==================================
   */

  master.verified_data =
    master.verified_data ||
    {};

  master
    .verified_data
    .source_verified_facts =
    sourceVerified;

  master
    .verified_data
    .source_verified_count =
    sourceVerified.length;

  master
    .verified_data
    .text_source_verified_count =
    textVerified;

  master
    .verified_data
    .visual_source_verified_count =
    visualVerified;

  master
    .verified_data
    .mixed_source_verified_count =
    mixedVerified;

  master
    .verified_data
    .independently_verified_count =
    0;

  master
    .verified_data
    .verification_key =
    verificationKey;

  master.validation =
    master.validation ||
    {};

  master
    .validation
    .source_verification_status =
    "complete";

  master
    .validation
    .source_verified_fact_count =
    sourceVerified.length;

  master
    .validation
    .visual_source_verified_fact_count =
    visualVerified;

  master
    .validation
    .verification_review_count =
    heldForReview.length;

  master
    .validation
    .independently_verified_fact_count =
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
   * ==================================
   * MANIFEST
   * ==================================
   */

  manifest.processing =
    manifest.processing ||
    {};

  manifest
    .processing
    .source_verification =
    "complete";

  /*
   * Keep the existing status value for
   * downstream compatibility.
   */
  manifest.import.status =
    "source_verified";

  manifest.source_verification = {
    object_key:
      verificationKey,

    source_verified:
      sourceVerified.length,

    text_source_verified:
      textVerified,

    visual_source_verified:
      visualVerified,

    mixed_source_verified:
      mixedVerified,

    held_for_review:
      heldForReview.length,

    visual_held_for_review:
      visualHeld,

    independently_verified:
      0,
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
   * ==================================
   * TERMINAL OUTPUT
   * ==================================
   */

  console.log("");
  console.log(
    "ARKNOZ SOURCE VERIFICATION: PASS"
  );

  console.log(
    `INPUT PROPOSALS: ${proposals.length}`
  );

  console.log(
    `SOURCE-VERIFIED FACTS: ${sourceVerified.length}`
  );

  console.log(
    `TEXT SOURCE-VERIFIED: ${textVerified}`
  );

  console.log(
    `VISUAL SOURCE-VERIFIED: ${visualVerified}`
  );

  console.log(
    `MIXED SOURCE-VERIFIED: ${mixedVerified}`
  );

  console.log(
    `HELD FOR REVIEW: ${heldForReview.length}`
  );

  console.log(
    `VISUAL HELD FOR REVIEW: ${visualHeld}`
  );

  console.log(
    "INDEPENDENTLY VERIFIED: 0"
  );

  console.log(
    `VERIFICATION FILE: ${verificationKey}`
  );

  console.log(
    "RIGHTS APPROVAL: NO"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: SOURCE VERIFICATION COMPLETE"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ SOURCE VERIFICATION: FAIL"
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