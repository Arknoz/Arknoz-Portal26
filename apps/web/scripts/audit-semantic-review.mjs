import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\audit-semantic-review.mjs "<manifest-key>"'
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

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values = []) {
  return [...new Set(values)];
}

try {
  const manifest =
    await getJson(manifestKey);

  const basePath =
    manifestKey.replace(
      /\/manifest\.json$/,
      ""
    );

  const packageKey =
    `${basePath}/review/semantic-review-package.json`;

  const semanticKey =
    `${basePath}/review/semantic-review-ai.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const reviewPackage =
    await getJson(packageKey);

  const semantic =
    await getJson(semanticKey);

  const master =
    await getJson(masterKey);

  //
  // BUILD AUTHORITATIVE INPUT CANDIDATE SET
  //

  const inputCandidates =
    new Map();

  for (
    const page of
      reviewPackage.pages || []
  ) {
    for (
      const cluster of
        page.clusters || []
    ) {
      for (
        const candidate of
          cluster.candidates || []
      ) {
        inputCandidates.set(
          candidate.id,
          {
            id: candidate.id,
            page: page.page,
            type: candidate.type,
            text: candidate.text,
            confidence:
              candidate.confidence,
          }
        );
      }
    }
  }

  const inputIds =
    new Set(
      inputCandidates.keys()
    );

  const combined =
    semantic.combined || {};

  const confirmed =
    new Set(
      unique(
        combined
          .confirmed_candidate_ids ||
          []
      )
    );

  const rejected =
    new Set(
      unique(
        combined
          .rejected_candidate_ids ||
          []
      )
    );

  const uncertain =
    new Set(
      unique(
        combined
          .uncertain_candidate_ids ||
          []
      )
    );

  //
  // UNKNOWN IDS RETURNED BY AI
  //

  const returnedIds =
    unique([
      ...confirmed,
      ...rejected,
      ...uncertain,
    ]);

  const unknownReturnedIds =
    returnedIds.filter(
      (id) => !inputIds.has(id)
    );

  //
  // OVERLAPS
  //

  const overlaps = [];

  for (const id of inputIds) {
    const statuses = [];

    if (confirmed.has(id)) {
      statuses.push("confirmed");
    }

    if (rejected.has(id)) {
      statuses.push("rejected");
    }

    if (uncertain.has(id)) {
      statuses.push("uncertain");
    }

    if (statuses.length > 1) {
      overlaps.push({
        candidate_id: id,
        statuses,
      });
    }
  }

  //
  // MISSING / UNACCOUNTED INPUTS
  //

  const accountedIds =
    new Set(
      returnedIds.filter(
        (id) => inputIds.has(id)
      )
    );

  const missingItems = [];

  for (const id of inputIds) {
    if (!accountedIds.has(id)) {
      missingItems.push(
        inputCandidates.get(id)
      );
    }
  }

  //
  // PROPOSED FIELD VALIDATION
  //

  const proposals =
    combined
      .proposed_project_fields ||
    [];

  const proposalAudits = [];

  for (
    let index = 0;
    index < proposals.length;
    index++
  ) {
    const proposal =
      proposals[index];

    const refs =
      unique(
        proposal.candidate_ids ||
        []
      );

    const unknownRefs =
      refs.filter(
        (id) => !inputIds.has(id)
      );

    const nonConfirmedRefs =
      refs.filter(
        (id) =>
          inputIds.has(id) &&
          !confirmed.has(id)
      );

    proposalAudits.push({
      index,

      field:
        proposal.field || null,

      value:
        proposal.value || null,

      confidence:
        Number(
          proposal.confidence
        ) || 0,

      candidate_ids:
        refs,

      unknown_candidate_ids:
        unknownRefs,

      non_confirmed_candidate_ids:
        nonConfirmedRefs,

      valid_for_verification:
        refs.length > 0 &&
        unknownRefs.length === 0 &&
        nonConfirmedRefs.length === 0,
    });
  }

  const invalidProposals =
    proposalAudits.filter(
      (item) =>
        !item.valid_for_verification
    );

  //
  // DUPLICATE PROPOSALS
  //

  const proposalSeen =
    new Map();

  const duplicateProposals =
    [];

  for (
    const item of
      proposalAudits
  ) {
    const key =
      `${item.field}|` +
      `${normalize(item.value)}|` +
      `${[...item.candidate_ids]
        .sort()
        .join(",")}`;

    if (
      proposalSeen.has(key)
    ) {
      duplicateProposals.push({
        duplicate_index:
          item.index,

        original_index:
          proposalSeen.get(key),

        field:
          item.field,

        value:
          item.value,
      });
    } else {
      proposalSeen.set(
        key,
        item.index
      );
    }
  }

  //
  // POSSIBLE CONFLICTS IN SINGLE-VALUE FIELDS
  //

  const singleValueFields =
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
    ]);

  const fieldValues =
    new Map();

  for (
    const proposal of
      proposalAudits
  ) {
    if (
      !singleValueFields.has(
        proposal.field
      )
    ) {
      continue;
    }

    if (
      !proposal.valid_for_verification
    ) {
      continue;
    }

    if (
      !fieldValues.has(
        proposal.field
      )
    ) {
      fieldValues.set(
        proposal.field,
        []
      );
    }

    fieldValues
      .get(proposal.field)
      .push({
        value:
          proposal.value,

        normalized:
          normalize(
            proposal.value
          ),

        candidate_ids:
          proposal.candidate_ids,
      });
  }

  const possibleConflicts =
    [];

  for (
    const [
      field,
      values,
    ] of fieldValues
  ) {
    const distinct =
      unique(
        values.map(
          (item) =>
            item.normalized
        )
      );

    if (
      distinct.length > 1
    ) {
      possibleConflicts.push({
        field,
        values,
      });
    }
  }

  //
  // COVERAGE
  //

  const inputCount =
    inputIds.size;

  const accountedCount =
    accountedIds.size;

  const coveragePercent =
    inputCount > 0
      ? Number(
          (
            (accountedCount /
              inputCount) *
            100
          ).toFixed(2)
        )
      : 100;

  //
  // VERIFICATION GATE
  //

  const readyForVerification =
    missingItems.length === 0 &&
    overlaps.length === 0 &&
    unknownReturnedIds.length === 0 &&
    invalidProposals.length === 0 &&
    possibleConflicts.length === 0;

  const auditKey =
    `${basePath}/review/semantic-validation.json`;

  const audit = {
    schema:
      "arknoz-semantic-validation-v1",

    import_id:
      manifest.import.id,

    totals: {
      input_candidates:
        inputCount,

      accounted_candidates:
        accountedCount,

      coverage_percent:
        coveragePercent,

      confirmed:
        confirmed.size,

      rejected:
        rejected.size,

      uncertain:
        uncertain.size,

      missing:
        missingItems.length,

      overlapping:
        overlaps.length,

      unknown_returned_ids:
        unknownReturnedIds.length,

      proposed_fields:
        proposalAudits.length,

      invalid_proposed_fields:
        invalidProposals.length,

      duplicate_proposals:
        duplicateProposals.length,

      possible_field_conflicts:
        possibleConflicts.length,
    },

    missing_candidates:
      missingItems,

    overlaps,

    unknown_returned_ids:
      unknownReturnedIds,

    proposal_audit:
      proposalAudits,

    invalid_proposals:
      invalidProposals,

    duplicate_proposals:
      duplicateProposals,

    possible_field_conflicts:
      possibleConflicts,

    gate: {
      ready_for_verification:
        readyForVerification,

      verified_facts:
        0,

      publication_allowed:
        false,

      reason:
        readyForVerification
          ? "Semantic output is fully reconciled. Verification may proceed."
          : "Semantic output is incomplete or contains unresolved validation issues.",
    },

    generated_at:
      new Date().toISOString(),
  };

  await putJson(
    auditKey,
    audit
  );

  //
  // UPDATE PROJECT MASTER
  //

  master.validation =
    master.validation || {};

  master.validation.semantic_validation_key =
    auditKey;

  master.validation.semantic_coverage_percent =
    coveragePercent;

  master.validation.semantic_missing_candidates =
    missingItems.length;

  master.validation.semantic_overlap_count =
    overlaps.length;

  master.validation.invalid_ai_proposals =
    invalidProposals.length;

  master.validation.possible_ai_conflicts =
    possibleConflicts.length;

  master.validation.ready_for_verification =
    readyForVerification;

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

  manifest.processing.semantic_validation =
    "complete";

  manifest.import.status =
    readyForVerification
      ? "ready_for_verification"
      : "semantic_reconciliation_required";

  manifest.semantic_validation = {
    object_key:
      auditKey,

    coverage_percent:
      coveragePercent,

    missing_candidates:
      missingItems.length,

    overlaps:
      overlaps.length,

    invalid_proposals:
      invalidProposals.length,

    conflicts:
      possibleConflicts.length,

    ready_for_verification:
      readyForVerification,
  };

  manifest.updated_at =
    new Date().toISOString();

  await putJson(
    manifestKey,
    manifest
  );

  console.log("");
  console.log(
    "ARKNOZ SEMANTIC VALIDATION: PASS"
  );

  console.log(
    `INPUT CANDIDATES: ${inputCount}`
  );

  console.log(
    `ACCOUNTED: ${accountedCount}`
  );

  console.log(
    `COVERAGE: ${coveragePercent}%`
  );

  console.log(
    `MISSING: ${missingItems.length}`
  );

  console.log(
    `OVERLAPS: ${overlaps.length}`
  );

  console.log(
    `UNKNOWN IDS: ${unknownReturnedIds.length}`
  );

  console.log(
    `PROPOSED FIELDS: ${proposalAudits.length}`
  );

  console.log(
    `INVALID PROPOSALS: ${invalidProposals.length}`
  );

  console.log(
    `DUPLICATE PROPOSALS: ${duplicateProposals.length}`
  );

  console.log(
    `POSSIBLE CONFLICTS: ${possibleConflicts.length}`
  );

  console.log(
    `AUDIT: ${auditKey}`
  );

  console.log(
    "VERIFIED FACTS: 0"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    `READY FOR VERIFICATION: ${
      readyForVerification
        ? "YES"
        : "NO"
    }`
  );

  console.log("");
} catch (error) {
  console.error("");
  console.error(
    "ARKNOZ SEMANTIC VALIDATION: FAIL"
  );

  console.error(
    error?.message || error
  );

  console.error("");
  process.exit(1);
}