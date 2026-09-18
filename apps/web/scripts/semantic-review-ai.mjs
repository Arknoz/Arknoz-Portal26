import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\semantic-review-ai.mjs "<manifest-key>"'
  );
  process.exit(1);
}

const required = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_AI_TOKEN",
  "ARKNOZ_AI_MODEL",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`FAIL: Missing ${key}`);
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

function onlyKnownIds(
  ids,
  allowedIds
) {
  if (!Array.isArray(ids)) {
    return [];
  }

  return [
    ...new Set(
      ids.map(String)
    ),
  ].filter(
    (id) =>
      allowedIds.has(id)
  );
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

function clamp01(value) {
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
 * Some Stage 4B observations came
 * through with kind = "other".
 *
 * We do NOT rewrite the original
 * evidence. We derive a conservative
 * semantic kind only for Stage 10
 * mapping decisions.
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

/*
 * This is the deterministic guard
 * AFTER the AI proposes a field.
 *
 * Even if the AI makes a bad mapping,
 * the mapping does not survive unless
 * the visual evidence kind is allowed
 * to support that Project field.
 */
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
    /*
     * Reinforcement descriptions such
     * as TOP R/F or BOTTOM R/F describe
     * a system/arrangement, not a
     * material name.
     */
    if (
      field ===
      "attributes_facts.system"
    ) {
      return true;
    }

    /*
     * Explicit measurable
     * reinforcement notation may be a
     * technical metric.
     */
    if (
      field ===
        "attributes_facts.metric" &&
      /\d/.test(
        String(value)
      )
    ) {
      return true;
    }

    /*
     * Only an explicit material/grade
     * expression may become material.
     */
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
   * Important:
   *
   * drawing_title
   * drawing_number
   * revision
   * scale
   * section_reference
   * detail_reference
   * drawing date
   * legend
   * schedule
   * discipline
   * person
   * organisation
   * level
   * floor
   * grid
   * other
   *
   * may be valid document evidence,
   * but we do not have an appropriate
   * Project-level field for them here.
   */
  return false;
}

function visualValueGrounded(
  proposalValue,
  candidate
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

  const rawValue =
    normalize(
      rawCandidateValue(
        candidate
      )
    );

  if (!proposed) {
    return false;
  }

  return (
    proposed === rawValue ||
    candidateFact.includes(
      proposed
    ) ||
    (
      rawValue &&
      proposed.includes(
        rawValue
      )
    )
  );
}

/*
 * Every candidate must receive exactly
 * one semantic disposition.
 *
 * If the model omits a candidate or
 * places it in more than one bucket,
 * Arknoz defaults it to UNCERTAIN.
 */
function buildDisposition(
  candidateIds,
  result
) {
  const confirmedRaw =
    new Set(
      onlyKnownIds(
        result
          ?.confirmed_candidate_ids,
        candidateIds
      )
    );

  const rejectedRaw =
    new Set(
      onlyKnownIds(
        result
          ?.rejected_candidate_ids,
        candidateIds
      )
    );

  const uncertainRaw =
    new Set(
      onlyKnownIds(
        result
          ?.uncertain_candidate_ids,
        candidateIds
      )
    );

  const confirmed = [];
  const rejected = [];
  const uncertain = [];

  for (
    const id of
      candidateIds
  ) {
    const matches = [
      confirmedRaw.has(id),
      rejectedRaw.has(id),
      uncertainRaw.has(id),
    ].filter(Boolean).length;

    if (matches !== 1) {
      uncertain.push(id);
      continue;
    }

    if (
      confirmedRaw.has(id)
    ) {
      confirmed.push(id);
    } else if (
      rejectedRaw.has(id)
    ) {
      rejected.push(id);
    } else {
      uncertain.push(id);
    }
  }

  return {
    confirmed,
    rejected,
    uncertain,
  };
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

  const cleaned =
    value
      .trim()
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
    return JSON.parse(
      cleaned
    );
  } catch {
    const first =
      cleaned.indexOf(
        "{"
      );

    const last =
      cleaned.lastIndexOf(
        "}"
      );

    if (
      first >= 0 &&
      last > first
    ) {
      try {
        return JSON.parse(
          cleaned.slice(
            first,
            last + 1
          )
        );
      } catch {
        return null;
      }
    }
  }

  return null;
}

async function reviewPage(
  pagePackage,
  projectContext,
  authoritativeCandidateMap
) {
  const candidateIds =
    new Set();

  const candidates = [];

  /*
   * Stage 9 provides the grouped
   * candidates.
   *
   * Stage 10 now enriches each one
   * from the authoritative Stage 5
   * fact-candidates file so the AI can
   * see visual provenance.
   */
  for (
    const cluster of
      pagePackage.clusters ||
      []
  ) {
    for (
      const packagedCandidate of
        cluster.candidates ||
        []
    ) {
      const id =
        String(
          packagedCandidate
            ?.id ||
          ""
        );

      if (!id) {
        continue;
      }

      candidateIds.add(id);

      const authoritative =
        authoritativeCandidateMap.get(
          id
        );

      const visual =
        isVisualCandidate(
          authoritative
        );

      candidates.push({
        id,

        type:
          authoritative
            ?.fact_type ??
          packagedCandidate
            ?.type ??
          null,

        text:
          authoritative
            ?.candidate_fact ??
          packagedCandidate
            ?.text ??
          "",

        confidence:
          authoritative
            ?.confidence ??
          packagedCandidate
            ?.confidence ??
          0,

        source_mode:
          visual
            ? "visual"
            : "text",

        visual_kind:
          visual
            ? (
                authoritative
                  ?.evidence
                  ?.visual_kind ||
                "other"
              )
            : null,

        effective_visual_kind:
          visual
            ? effectiveVisualKind(
                authoritative
              )
            : null,

        visible_basis:
          visual
            ? (
                authoritative
                  ?.evidence
                  ?.visible_basis ||
                null
              )
            : null,

        visual_reading_confidence:
          visual
            ? (
                authoritative
                  ?.evidence
                  ?.visual_reading_confidence ??
                null
              )
            : null,
      });
    }
  }

  const schema = {
    type: "object",

    properties: {
      confirmed_candidate_ids: {
        type: "array",

        items: {
          type: "string",
        },
      },

      rejected_candidate_ids: {
        type: "array",

        items: {
          type: "string",
        },
      },

      uncertain_candidate_ids: {
        type: "array",

        items: {
          type: "string",
        },
      },

      merged_groups: {
        type: "array",

        items: {
          type: "object",

          properties: {
            canonical_candidate_id: {
              type: "string",
            },

            merged_candidate_ids: {
              type: "array",

              items: {
                type: "string",
              },
            },
          },

          required: [
            "canonical_candidate_id",
            "merged_candidate_ids",
          ],
        },
      },

      proposed_project_fields: {
        type: "array",

        items: {
          type: "object",

          properties: {
            field: {
              type: "string",
            },

            value: {
              type: "string",
            },

            candidate_ids: {
              type: "array",

              items: {
                type: "string",
              },
            },

            confidence: {
              type: "number",
            },
          },

          required: [
            "field",
            "value",
            "candidate_ids",
            "confidence",
          ],
        },
      },

      notes: {
        type: "array",

        items: {
          type: "string",
        },
      },
    },

    required: [
      "confirmed_candidate_ids",
      "rejected_candidate_ids",
      "uncertain_candidate_ids",
      "merged_groups",
      "proposed_project_fields",
      "notes",
    ],
  };

  const systemPrompt = `
You are the Arknoz evidence-review engine.

Your job has TWO separate decisions:

A. Decide whether each candidate accurately represents evidence from the supplied source page.
B. Only when appropriate, map confirmed evidence to an allowed PROJECT-LEVEL field.

A candidate may be valid CONFIRMED evidence without being suitable for any Project-level field.

STRICT RULES:

1. Use only the supplied source-page text, candidate facts, candidate provenance and Project context.
2. Never invent a project name, location, date, metric, organisation, person, relationship or status.
3. Every proposed Project field must cite one or more supplied candidate IDs.
4. Never propose or modify identity.category.
5. Recommendations, proposals, suggested work and future actions are not established Project facts.
6. Nothing returned by you is verified, independently verified, rights-cleared or publishable.
7. Only use candidate IDs supplied in this request.
8. Return only valid JSON matching the requested schema.
9. Every candidate must appear in exactly ONE of confirmed_candidate_ids, rejected_candidate_ids or uncertain_candidate_ids.
10. If evidence is insufficient, use uncertain.

VISUAL EVIDENCE RULES:

11. A valid visual observation may be CONFIRMED even when it must NOT become a Project field.
12. drawing_title is document metadata. Do NOT map drawing_title to identity.title.
13. drawing_number, revision, scale, section_reference, detail_reference, legend, drawing date and drawing labels are document metadata. Do NOT map them to Project identity, geography or Project lifecycle dates.
14. "SECTION 1-1", "FOUNDATION PLAN", detail names, sheet titles and similar drawing labels are NEVER geography.
15. Geography fields require an explicit genuine place name from a candidate whose semantic kind is location.
16. identity.title requires a genuine project-name candidate, not a drawing title.
17. A dimension or quantity may map only to attributes_facts.metric.
18. A material or material-grade candidate may map only to attributes_facts.material.
19. Reinforcement notation may describe attributes_facts.system or, where an explicit measurable notation is present, attributes_facts.metric.
20. Labels such as LONG BAR, SHORT BAR, TOP R/F, BOTTOM R/F and SIDE FACE R/F are reinforcement arrangement/notation, not material names by themselves.
21. Do not convert a document scale into a Project metric.
22. Do not convert a drawing date into construction_start or completion_date.
23. Do not convert a section/detail reference into a city, region or country.
24. For visual evidence, keep proposed-field confidence at or below 0.79. This confidence concerns semantic mapping only; it is NOT verification.
25. If effective_visual_kind is "other", normally confirm the evidence if readable but do not propose a Project field unless the supplied evidence unambiguously supports one under these rules.

TEXT EVIDENCE RULES:

26. Preserve conservative treatment of text evidence.
27. Text evidence may map to allowed Project fields only when directly supported.
28. Distinguish observed/existing conditions from recommendations or future work.

Allowed Project field names:

identity.title
identity.type
identity.subtype
identity.status
geography.country
geography.region
geography.city
temporal.construction_start
temporal.completion_date
attributes_facts.material
attributes_facts.system
attributes_facts.condition
attributes_facts.metric
attributes_facts.performance

Never return identity.category.
`;

  const userPayload = {
    project_context:
      projectContext,

    source_page:
      pagePackage.page,

    page_text:
      pagePackage.page_text,

    candidates,
  };

  const model =
    process.env
      .ARKNOZ_AI_MODEL
      .trim();

  const accountId =
    process.env
      .CLOUDFLARE_ACCOUNT_ID
      .trim();

  const url =
    `https://api.cloudflare.com/client/v4/accounts/` +
    `${accountId}/ai/run/${model}`;

  const response =
    await fetch(
      url,
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

            temperature: 0,

            max_tokens: 6000,

            response_format: {
              type:
                "json_schema",

              json_schema:
                schema,
            },
          }),

        signal:
          AbortSignal.timeout(
            120000
          ),
      }
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    data.success === false
  ) {
    throw new Error(
      `Workers AI HTTP ${response.status} on page ` +
      `${pagePackage.page}: ` +
      JSON.stringify(
        data.errors ||
        data
      )
    );
  }

  let result =
    data?.result?.response ??
    data?.result;

  if (
    typeof result ===
    "string"
  ) {
    const parsed =
      tryParseJsonText(
        result
      );

    if (!parsed) {
      throw new Error(
        `Invalid/truncated JSON returned for page ` +
        `${pagePackage.page}. ` +
        `Response length: ${result.length} characters.`
      );
    }

    result = parsed;
  }

  if (
    !result ||
    typeof result !==
      "object"
  ) {
    throw new Error(
      `Unexpected AI response for page ${pagePackage.page}`
    );
  }

  /*
   * Fail closed:
   *
   * missing IDs or IDs returned in
   * multiple disposition arrays become
   * UNCERTAIN automatically.
   */
  const disposition =
    buildDisposition(
      candidateIds,
      result
    );

  const confirmedSet =
    new Set(
      disposition.confirmed
    );

  const cleaned = {
    page:
      pagePackage.page,

    confirmed_candidate_ids:
      disposition.confirmed,

    rejected_candidate_ids:
      disposition.rejected,

    uncertain_candidate_ids:
      disposition.uncertain,

    merged_groups: [],

    proposed_project_fields:
      [],

    discarded_project_fields:
      [],

    notes:
      Array.isArray(
        result.notes
      )
        ? result.notes.map(
            String
          )
        : [],
  };

  /*
   * Keep merged groups only when all
   * IDs are genuine supplied IDs.
   */
  for (
    const group of
      result.merged_groups ||
      []
  ) {
    const canonical =
      String(
        group
          ?.canonical_candidate_id ||
        ""
      );

    if (
      !candidateIds.has(
        canonical
      )
    ) {
      continue;
    }

    const mergedIds =
      onlyKnownIds(
        group
          ?.merged_candidate_ids,
        candidateIds
      );

    cleaned
      .merged_groups
      .push({
        canonical_candidate_id:
          canonical,

        merged_candidate_ids:
          mergedIds,
      });
  }

  /*
   * =================================
   * DETERMINISTIC FIELD GUARD
   * =================================
   *
   * The model may propose a field,
   * but Arknoz decides whether that
   * evidence kind is actually allowed
   * to support it.
   */
  for (
    const fieldProposal of
      result
        .proposed_project_fields ||
      []
  ) {
    const field =
      String(
        fieldProposal
          ?.field ||
        ""
      ).trim();

    const value =
      String(
        fieldProposal
          ?.value ||
        ""
      ).trim();

    if (
      !ALLOWED_FIELDS.has(
        field
      ) ||
      field ===
        "identity.category" ||
      !value
    ) {
      continue;
    }

    /*
     * A field proposal may only rely
     * on candidates that Stage 10 has
     * CONFIRMED.
     */
    const rawRefs =
      onlyKnownIds(
        fieldProposal
          ?.candidate_ids,
        candidateIds
      ).filter(
        (id) =>
          confirmedSet.has(id)
      );

    if (
      !rawRefs.length
    ) {
      continue;
    }

    const supportedRefs = [];
    const rejectedRefs = [];

    for (
      const id of
        rawRefs
    ) {
      const candidate =
        authoritativeCandidateMap.get(
          id
        );

      if (!candidate) {
        rejectedRefs.push({
          id,

          reason:
            "candidate_not_found",
        });

        continue;
      }

      /*
       * Existing text evidence keeps
       * its previous Stage 10 behavior.
       */
      if (
        !isVisualCandidate(
          candidate
        )
      ) {
        supportedRefs.push(
          id
        );

        continue;
      }

      const kind =
        effectiveVisualKind(
          candidate
        );

      if (
        !visualKindSupportsField(
          kind,
          field,
          value
        )
      ) {
        rejectedRefs.push({
          id,

          reason:
            `visual_kind_${kind}_does_not_support_${field}`,
        });

        continue;
      }

      if (
        !visualValueGrounded(
          value,
          candidate
        )
      ) {
        rejectedRefs.push({
          id,

          reason:
            "proposal_value_not_grounded_in_visual_candidate",
        });

        continue;
      }

      supportedRefs.push(id);
    }

    /*
     * Bad AI mappings are discarded,
     * not converted into uncertain
     * facts and not allowed downstream.
     */
    if (
      !supportedRefs.length
    ) {
      cleaned
        .discarded_project_fields
        .push({
          field,

          value,

          candidate_ids:
            rawRefs,

          reasons:
            rejectedRefs,
        });

      continue;
    }

    const hasVisual =
      supportedRefs.some(
        (id) =>
          isVisualCandidate(
            authoritativeCandidateMap.get(
              id
            )
          )
      );

    let confidence =
      clamp01(
        fieldProposal
          ?.confidence
      );

    /*
     * Important:
     *
     * visual semantic mapping uses a
     * separate controlled confidence.
     *
     * This is deliberately capped at
     * 0.79. Stage 12 will later use a
     * separate visual-verification
     * threshold rather than pretending
     * 0.79 is equivalent to text 0.85.
     */
    if (hasVisual) {
      confidence =
        Math.min(
          confidence,
          0.79
        );
    }

    cleaned
      .proposed_project_fields
      .push({
        field,

        value,

        candidate_ids:
          supportedRefs,

        confidence,

        evidence_mode:
          hasVisual
            ? "visual_or_mixed"
            : "text",

        status:
          "ai_proposal",

        verified:
          false,

        independently_verified:
          false,

        publication_allowed:
          false,
      });
  }

  return cleaned;
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

  const packageKey =
    `${basePath}/review/semantic-review-package.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const candidatesKey =
    `${basePath}/processed/fact-candidates.json`;

  const reviewPackage =
    await getJson(
      packageKey
    );

  const master =
    await getJson(
      masterKey
    );

  /*
   * Stage 5 is the authoritative
   * candidate source because it
   * contains provenance that Stage 9
   * clustering may not preserve.
   */
  const candidateDoc =
    await getJson(
      candidatesKey
    );

  const authoritativeCandidateMap =
    new Map();

  for (
    const candidate of
      candidateDoc.candidates ||
      []
  ) {
    authoritativeCandidateMap.set(
      String(
        candidate.id
      ),
      candidate
    );
  }

  const pageResults = [];

  for (
    const page of
      reviewPackage.pages ||
      []
  ) {
    console.log(
      `AI semantic review: page ${page.page}...`
    );

    const result =
      await reviewPage(
        page,

        reviewPackage
          .project_context,

        authoritativeCandidateMap
      );

    pageResults.push(
      result
    );

    console.log(
      `PAGE ${page.page}: complete`
    );
  }

  const confirmed = [
    ...new Set(
      pageResults.flatMap(
        (item) =>
          item
            .confirmed_candidate_ids
      )
    ),
  ];

  const rejected = [
    ...new Set(
      pageResults.flatMap(
        (item) =>
          item
            .rejected_candidate_ids
      )
    ),
  ];

  const uncertain = [
    ...new Set(
      pageResults.flatMap(
        (item) =>
          item
            .uncertain_candidate_ids
      )
    ),
  ];

  const proposedFields =
    pageResults.flatMap(
      (item) =>
        item
          .proposed_project_fields
    );

  const discardedFields =
    pageResults.flatMap(
      (item) =>
        item
          .discarded_project_fields ||
        []
    );

  const visualCandidateIds =
    new Set(
      [
        ...authoritativeCandidateMap
          .entries(),
      ]
        .filter(
          (
            [
              ,
              candidate,
            ]
          ) =>
            isVisualCandidate(
              candidate
            )
        )
        .map(
          ([id]) =>
            id
        )
    );

  const confirmedVisual =
    confirmed.filter(
      (id) =>
        visualCandidateIds.has(
          id
        )
    ).length;

  const semanticKey =
    `${basePath}/review/semantic-review-ai.json`;

  /*
   * Keep schema identifier compatible
   * with the existing Stage 11 audit.
   */
  const semanticDocument = {
    schema:
      "arknoz-semantic-review-ai-v1",

    import_id:
      manifest.import.id,

    model:
      process.env
        .ARKNOZ_AI_MODEL,

    totals: {
      input_review_candidates:
        reviewPackage
          ?.totals
          ?.review_candidates ||
        0,

      confirmed_candidates:
        confirmed.length,

      confirmed_visual_candidates:
        confirmedVisual,

      rejected_candidates:
        rejected.length,

      uncertain_candidates:
        uncertain.length,

      proposed_project_fields:
        proposedFields.length,

      discarded_project_fields:
        discardedFields.length,
    },

    pages:
      pageResults,

    combined: {
      confirmed_candidate_ids:
        confirmed,

      rejected_candidate_ids:
        rejected,

      uncertain_candidate_ids:
        uncertain,

      proposed_project_fields:
        proposedFields,
    },

    safeguards: {
      candidate_ids_validated:
        true,

      exact_candidate_disposition:
        true,

      omitted_candidates_default_uncertain:
        true,

      parent_category_locked:
        true,

      visual_provenance_in_prompt:
        true,

      drawing_metadata_not_project_identity:
        true,

      drawing_labels_not_geography:
        true,

      visual_field_mapping_guard:
        true,

      visual_proposal_confidence_ceiling:
        0.79,

      unsupported_ai_facts_allowed:
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

    generated_at:
      new Date()
        .toISOString(),
  };

  await putJson(
    semanticKey,
    semanticDocument
  );

  /*
   * PROJECT MASTER
   */

  master.validation =
    master.validation ||
    {};

  master.validation
    .semantic_ai_key =
    semanticKey;

  master.validation
    .semantic_ai_status =
    "complete";

  master.validation
    .ai_confirmed_candidates =
    confirmed.length;

  master.validation
    .ai_confirmed_visual_candidates =
    confirmedVisual;

  master.validation
    .ai_rejected_candidates =
    rejected.length;

  master.validation
    .ai_uncertain_candidates =
    uncertain.length;

  master.validation
    .ai_proposed_fields =
    proposedFields.length;

  master.validation
    .ai_discarded_field_proposals =
    discardedFields.length;

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
   * MANIFEST
   */

  manifest.processing =
    manifest.processing ||
    {};

  manifest.processing
    .semantic_ai =
    "complete";

  manifest.import.status =
    "semantic_ai_review_ready";

  manifest.semantic_ai = {
    object_key:
      semanticKey,

    confirmed:
      confirmed.length,

    confirmed_visual:
      confirmedVisual,

    rejected:
      rejected.length,

    uncertain:
      uncertain.length,

    proposed_fields:
      proposedFields.length,

    discarded_field_proposals:
      discardedFields.length,
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
   * TERMINAL
   */

  console.log("");
  console.log(
    "ARKNOZ SEMANTIC AI REVIEW: PASS"
  );

  console.log(
    `CONFIRMED CANDIDATES: ${confirmed.length}`
  );

  console.log(
    `CONFIRMED VISUAL CANDIDATES: ${confirmedVisual}`
  );

  console.log(
    `REJECTED CANDIDATES: ${rejected.length}`
  );

  console.log(
    `UNCERTAIN CANDIDATES: ${uncertain.length}`
  );

  console.log(
    `PROPOSED PROJECT FIELDS: ${proposedFields.length}`
  );

  console.log(
    `DISCARDED FIELD PROPOSALS: ${discardedFields.length}`
  );

  console.log(
    `AI REVIEW: ${semanticKey}`
  );

  console.log(
    "VERIFIED FACTS: 0"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: READY FOR FINAL VALIDATION"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ SEMANTIC AI REVIEW: FAIL"
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