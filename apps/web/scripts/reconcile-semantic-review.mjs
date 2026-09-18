import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\reconcile-semantic-review.mjs "<manifest-key>"'
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
  const result = await r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const buffer = await bodyToBuffer(result.Body);

  return JSON.parse(
    buffer.toString("utf8")
  );
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

async function objectExists(key) {
  try {
    await r2.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return true;
  } catch {
    return false;
  }
}

function unique(values = []) {
  return [...new Set(values)];
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function chunk(items, size) {
  const result = [];

  for (
    let i = 0;
    i < items.length;
    i += size
  ) {
    result.push(
      items.slice(i, i + size)
    );
  }

  return result;
}

const ALLOWED_FIELDS = new Set([
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

const SINGLE_VALUE_FIELDS = new Set([
  "identity.title",
  "identity.type",
  "identity.subtype",
  "identity.status",

  "geography.country",
  "geography.region",
  "geography.city",

  "temporal.construction_start",
  "temporal.completion_date",
]);

async function classifyBatch({
  page,
  pageText,
  candidates,
  projectContext,
}) {
  const allowedIds =
    new Set(
      candidates.map(
        (candidate) =>
          candidate.id
      )
    );

  const schema = {
    type: "object",

    properties: {
      decisions: {
        type: "array",

        items: {
          type: "object",

          properties: {
            candidate_id: {
              type: "string",
            },

            disposition: {
              type: "string",

              enum: [
                "confirmed",
                "rejected",
                "uncertain",
              ],
            },

            reason: {
              type: "string",
            },
          },

          required: [
            "candidate_id",
            "disposition",
            "reason",
          ],
        },
      },
    },

    required: [
      "decisions",
    ],
  };

  const systemPrompt = `
You are Arknoz's evidence reconciliation engine.

Your ONLY job is to classify every supplied candidate.

STRICT RULES:

1. Use only the supplied page text and candidates.
2. Never invent information.
3. Every supplied candidate ID must receive exactly one disposition:
   confirmed, rejected, or uncertain.
4. confirmed = the candidate is genuinely supported by the source page.
5. rejected = noise, fragment, boilerplate, incorrect interpretation, or unsupported.
6. uncertain = evidence exists but is insufficient or ambiguous.
7. Recommendations and proposed future work are not established project facts.
8. Do not create project fields.
9. Do not alter the Arknoz project category.
10. Do not infer rights or publication status.
11. Return only valid JSON matching the required schema.
`;

  const payload = {
    project_context:
      projectContext,

    source_page:
      page,

    page_text:
      pageText,

    candidates:
      candidates.map(
        (candidate) => ({
          id:
            candidate.id,

          type:
            candidate.type,

          text:
            candidate.text,

          confidence:
            candidate.confidence,
        })
      ),
  };

  const accountId =
    process.env
      .CLOUDFLARE_ACCOUNT_ID
      .trim();

  const model =
    process.env
      .ARKNOZ_AI_MODEL
      .trim();

  const url =
    `https://api.cloudflare.com/client/v4/accounts/` +
    `${accountId}/ai/run/${model}`;

  const response =
    await fetch(url, {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${
            process.env
              .CLOUDFLARE_AI_TOKEN
              .trim()
          }`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              systemPrompt,
          },

          {
            role: "user",
            content:
              JSON.stringify(
                payload
              ),
          },
        ],

        temperature: 0,

        max_tokens: 2200,

        response_format: {
          type:
            "json_schema",

          json_schema:
            schema,
        },
      }),
    });

  const data =
    await response.json();

  if (
    !response.ok ||
    data.success === false
  ) {
    throw new Error(
      `Workers AI HTTP ${response.status}: ` +
      JSON.stringify(
        data.errors || data
      )
    );
  }

  let result =
    data?.result?.response ??
    data?.result;

  if (
    typeof result === "string"
  ) {
    try {
      result =
        JSON.parse(result);
    } catch {
      throw new Error(
        `Invalid JSON returned for page ${page}`
      );
    }
  }

  const decisions =
    new Map();

  for (
    const decision of
      result?.decisions || []
  ) {
    const id =
      decision.candidate_id;

    const disposition =
      decision.disposition;

    if (
      !allowedIds.has(id)
    ) {
      continue;
    }

    if (
      ![
        "confirmed",
        "rejected",
        "uncertain",
      ].includes(
        disposition
      )
    ) {
      continue;
    }

    if (
      decisions.has(id)
    ) {
      continue;
    }

    decisions.set(
      id,
      {
        candidate_id:
          id,

        disposition,

        reason:
          String(
            decision.reason ||
            ""
          ),

        source:
          "workers_ai_reconciliation",
      }
    );
  }

  //
  // CRITICAL SAFETY RULE:
  // AI omission = UNCERTAIN, never confirmed.
  //

  for (
    const candidate of candidates
  ) {
    if (
      !decisions.has(
        candidate.id
      )
    ) {
      decisions.set(
        candidate.id,
        {
          candidate_id:
            candidate.id,

          disposition:
            "uncertain",

          reason:
            "AI omitted candidate; Arknoz defaulted safely to uncertain.",

          source:
            "arknoz_safety_default",
        }
      );
    }
  }

  return [
    ...decisions.values(),
  ];
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

  const semanticKey =
    `${basePath}/review/semantic-review-ai.json`;

  const initialSemanticKey =
    `${basePath}/review/semantic-review-ai-initial.json`;

  const reconciliationKey =
    `${basePath}/review/semantic-reconciliation.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const reviewPackage =
    await getJson(
      packageKey
    );

  const semantic =
    await getJson(
      semanticKey
    );

  const master =
    await getJson(
      masterKey
    );

  //
  // PRESERVE ORIGINAL AI OUTPUT ON FIRST RUN
  //

  if (
    !(await objectExists(
      initialSemanticKey
    ))
  ) {
    await putJson(
      initialSemanticKey,
      semantic
    );
  }

  //
  // BUILD AUTHORITATIVE INPUT MAP
  //

  const candidateMap =
    new Map();

  const pageMap =
    new Map();

  for (
    const page of
      reviewPackage.pages || []
  ) {
    pageMap.set(
      String(page.page),
      page
    );

    for (
      const cluster of
        page.clusters || []
    ) {
      for (
        const candidate of
          cluster.candidates || []
      ) {
        candidateMap.set(
          candidate.id,
          {
            id:
              candidate.id,

            page:
              page.page,

            type:
              candidate.type,

            text:
              candidate.text,

            confidence:
              candidate.confidence,
          }
        );
      }
    }
  }

  const allIds =
    new Set(
      candidateMap.keys()
    );

  const combined =
    semantic.combined || {};

  const confirmed =
    new Set(
      (
        combined
          .confirmed_candidate_ids ||
        []
      ).filter(
        (id) =>
          allIds.has(id)
      )
    );

  const rejected =
    new Set(
      (
        combined
          .rejected_candidate_ids ||
        []
      ).filter(
        (id) =>
          allIds.has(id)
      )
    );

  const uncertain =
    new Set(
      (
        combined
          .uncertain_candidate_ids ||
        []
      ).filter(
        (id) =>
          allIds.has(id)
      )
    );

  //
  // ONLY RETRY CANDIDATES NOT ALREADY DISPOSITIONED
  //

  const missing =
    [];

  for (
    const id of allIds
  ) {
    if (
      !confirmed.has(id) &&
      !rejected.has(id) &&
      !uncertain.has(id)
    ) {
      missing.push(
        candidateMap.get(id)
      );
    }
  }

  console.log("");
  console.log(
    `MISSING CANDIDATES TO RECONCILE: ${missing.length}`
  );

  //
  // GROUP MISSING ITEMS BY PAGE
  //

  const missingByPage =
    new Map();

  for (
    const candidate of
      missing
  ) {
    const pageKey =
      String(
        candidate.page
      );

    if (
      !missingByPage.has(
        pageKey
      )
    ) {
      missingByPage.set(
        pageKey,
        []
      );
    }

    missingByPage
      .get(pageKey)
      .push(candidate);
  }

  const retryDecisions =
    [];

  //
  // SMALL BATCHES TO AVOID TRUNCATED JSON
  //

  for (
    const [
      pageNumber,
      candidates,
    ] of missingByPage
  ) {
    const pagePackage =
      pageMap.get(
        pageNumber
      );

    const batches =
      chunk(
        candidates,
        10
      );

    for (
      let i = 0;
      i < batches.length;
      i++
    ) {
      console.log(
        `AI reconciliation: page ${pageNumber}, batch ${i + 1}/${batches.length}...`
      );

      const decisions =
        await classifyBatch({
          page:
            Number(
              pageNumber
            ),

          pageText:
            pagePackage
              ?.page_text ||
            "",

          candidates:
            batches[i],

          projectContext:
            reviewPackage
              .project_context,
        });

      retryDecisions.push(
        ...decisions
      );

      console.log(
        `PAGE ${pageNumber} BATCH ${i + 1}: complete`
      );
    }
  }

  //
  // APPLY RETRY DECISIONS
  //

  for (
    const decision of
      retryDecisions
  ) {
    const id =
      decision
        .candidate_id;

    if (
      decision.disposition ===
      "confirmed"
    ) {
      confirmed.add(id);
    } else if (
      decision.disposition ===
      "rejected"
    ) {
      rejected.add(id);
    } else {
      uncertain.add(id);
    }
  }

  //
  // ENSURE EXACTLY ONE DISPOSITION
  //

  for (
    const id of allIds
  ) {
    const statuses = [
      confirmed.has(id),
      rejected.has(id),
      uncertain.has(id),
    ].filter(Boolean)
      .length;

    if (
      statuses === 0
    ) {
      uncertain.add(id);
    }

    if (
      statuses > 1
    ) {
      confirmed.delete(id);
      rejected.delete(id);
      uncertain.add(id);
    }
  }

  //
  // CLEAN PROJECT FIELD PROPOSALS
  //

  const originalProposals =
    combined
      .proposed_project_fields ||
    [];

  const eligibleProposals =
    [];

  const discardedProposals =
    [];

  const seenProposalKeys =
    new Set();

  for (
    const proposal of
      originalProposals
  ) {
    const field =
      String(
        proposal.field ||
        ""
      );

    const value =
      String(
        proposal.value ||
        ""
      ).trim();

    const refs =
      unique(
        proposal
          .candidate_ids ||
        []
      ).filter(
        (id) =>
          allIds.has(id)
      );

    const confidence =
      Number(
        proposal.confidence
      ) || 0;

    let discardReason =
      null;

    if (
      !ALLOWED_FIELDS.has(
        field
      )
    ) {
      discardReason =
        "field_not_allowed";
    } else if (
      !value
    ) {
      discardReason =
        "empty_value";
    } else if (
      refs.length === 0
    ) {
      discardReason =
        "no_valid_evidence_refs";
    } else if (
      refs.some(
        (id) =>
          !confirmed.has(id)
      )
    ) {
      discardReason =
        "evidence_not_confirmed";
    } else if (
      confidence < 0.75
    ) {
      discardReason =
        "confidence_below_0_75";
    }

    const key =
      `${field}|${normalize(
        value
      )}|${[
        ...refs,
      ]
        .sort()
        .join(",")}`;

    if (
      !discardReason &&
      seenProposalKeys.has(
        key
      )
    ) {
      discardReason =
        "duplicate_proposal";
    }

    if (
      discardReason
    ) {
      discardedProposals.push({
        ...proposal,
        reconciliation_reason:
          discardReason,
      });

      continue;
    }

    seenProposalKeys.add(
      key
    );

    eligibleProposals.push({
      field,
      value,
      candidate_ids:
        refs,
      confidence,

      status:
        "evidence_backed_ai_proposal",

      verified:
        false,

      publication_allowed:
        false,
    });
  }

  //
  // HOLD CONFLICTING SINGLE-VALUE FIELDS
  //

  const groupedSingles =
    new Map();

  for (
    const proposal of
      eligibleProposals
  ) {
    if (
      !SINGLE_VALUE_FIELDS.has(
        proposal.field
      )
    ) {
      continue;
    }

    if (
      !groupedSingles.has(
        proposal.field
      )
    ) {
      groupedSingles.set(
        proposal.field,
        []
      );
    }

    groupedSingles
      .get(proposal.field)
      .push(proposal);
  }

  const conflictingFields =
    new Set();

  const conflicts =
    [];

  for (
    const [
      field,
      proposals,
    ] of groupedSingles
  ) {
    const values =
      unique(
        proposals.map(
          (proposal) =>
            normalize(
              proposal.value
            )
        )
      );

    if (
      values.length > 1
    ) {
      conflictingFields.add(
        field
      );

      conflicts.push({
        field,
        proposals,
        status:
          "unresolved_conflict",
      });
    }
  }

  const finalProposals =
    eligibleProposals.filter(
      (proposal) =>
        !conflictingFields.has(
          proposal.field
        )
    );

  //
  // BUILD RECONCILED SEMANTIC OUTPUT
  //

  const reconciled = {
    ...semantic,

    schema:
      "arknoz-semantic-review-ai-v1-reconciled",

    totals: {
      input_review_candidates:
        allIds.size,

      confirmed_candidates:
        confirmed.size,

      rejected_candidates:
        rejected.size,

      uncertain_candidates:
        uncertain.size,

      proposed_project_fields:
        finalProposals.length,

      unresolved_field_conflicts:
        conflicts.length,
    },

    combined: {
      confirmed_candidate_ids:
        [...confirmed],

      rejected_candidate_ids:
        [...rejected],

      uncertain_candidate_ids:
        [...uncertain],

      proposed_project_fields:
        finalProposals,
    },

    reconciliation: {
      retry_input_count:
        missing.length,

      retry_decision_count:
        retryDecisions.length,

      discarded_proposal_count:
        discardedProposals.length,

      unresolved_conflict_count:
        conflicts.length,

      original_ai_output:
        initialSemanticKey,

      reconciliation_file:
        reconciliationKey,
    },

    safeguards: {
      candidate_ids_validated:
        true,

      all_candidates_dispositioned:
        true,

      parent_category_locked:
        true,

      unsupported_ai_facts_allowed:
        false,

      omitted_candidates_default_to_uncertain:
        true,

      conflicting_single_value_fields_blocked:
        true,

      auto_verified:
        false,

      rights_auto_approved:
        false,

      publication_allowed:
        false,
    },

    reconciled_at:
      new Date().toISOString(),
  };

  //
  // SAVE RECONCILIATION EVIDENCE
  //

  const reconciliationDoc = {
    schema:
      "arknoz-semantic-reconciliation-v1",

    import_id:
      manifest.import.id,

    before: {
      input_candidates:
        allIds.size,

      previously_confirmed:
        (
          combined
            .confirmed_candidate_ids ||
          []
        ).length,

      previously_rejected:
        (
          combined
            .rejected_candidate_ids ||
          []
        ).length,

      previously_uncertain:
        (
          combined
            .uncertain_candidate_ids ||
          []
        ).length,

      missing_candidates:
        missing.length,

      proposed_fields:
        originalProposals.length,
    },

    retry_decisions:
      retryDecisions,

    after: {
      confirmed:
        confirmed.size,

      rejected:
        rejected.size,

      uncertain:
        uncertain.size,

      total_accounted:
        confirmed.size +
        rejected.size +
        uncertain.size,

      usable_project_field_proposals:
        finalProposals.length,

      discarded_project_field_proposals:
        discardedProposals.length,

      unresolved_field_conflicts:
        conflicts.length,
    },

    discarded_proposals:
      discardedProposals,

    unresolved_conflicts:
      conflicts,

    final_project_field_proposals:
      finalProposals,

    verified_facts:
      0,

    publication_allowed:
      false,

    generated_at:
      new Date().toISOString(),
  };

  await putJson(
    reconciliationKey,
    reconciliationDoc
  );

  await putJson(
    semanticKey,
    reconciled
  );

  //
  // UPDATE MASTER
  //

  master.validation =
    master.validation || {};

  master.validation.semantic_reconciliation_key =
    reconciliationKey;

  master.validation.semantic_reconciliation_status =
    "complete";

  master.validation.reconciled_confirmed_candidates =
    confirmed.size;

  master.validation.reconciled_rejected_candidates =
    rejected.size;

  master.validation.reconciled_uncertain_candidates =
    uncertain.size;

  master.validation.reconciled_project_field_proposals =
    finalProposals.length;

  master.validation.unresolved_semantic_conflicts =
    conflicts.length;

  master.validation.verified_fact_count =
    0;

  master.publication =
    master.publication || {};

  master.publication.status =
    "private";

  master.publication.allowed =
    false;

  await putJson(
    masterKey,
    master
  );

  //
  // UPDATE MANIFEST
  //

  manifest.processing =
    manifest.processing || {};

  manifest.processing.semantic_reconciliation =
    "complete";

  manifest.import.status =
    "semantic_reconciled";

  manifest.semantic_reconciliation = {
    object_key:
      reconciliationKey,

    confirmed:
      confirmed.size,

    rejected:
      rejected.size,

    uncertain:
      uncertain.size,

    usable_proposals:
      finalProposals.length,

    unresolved_conflicts:
      conflicts.length,
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ SEMANTIC RECONCILIATION: PASS"
  );

  console.log(
    `RETRIED MISSING: ${missing.length}`
  );

  console.log(
    `CONFIRMED: ${confirmed.size}`
  );

  console.log(
    `REJECTED: ${rejected.size}`
  );

  console.log(
    `UNCERTAIN: ${uncertain.size}`
  );

  console.log(
    `TOTAL ACCOUNTED: ${
      confirmed.size +
      rejected.size +
      uncertain.size
    }/${allIds.size}`
  );

  console.log(
    `USABLE FIELD PROPOSALS: ${finalProposals.length}`
  );

  console.log(
    `DISCARDED FIELD PROPOSALS: ${discardedProposals.length}`
  );

  console.log(
    `UNRESOLVED FIELD CONFLICTS: ${conflicts.length}`
  );

  console.log(
    `RECONCILIATION: ${reconciliationKey}`
  );

  console.log(
    "VERIFIED FACTS: 0"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    "STATUS: READY FOR RE-AUDIT"
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ SEMANTIC RECONCILIATION: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}