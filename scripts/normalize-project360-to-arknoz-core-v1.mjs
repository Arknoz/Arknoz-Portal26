import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  projects:
    "data/project-360/batch-01-candidates-v1.json",

  research:
    "data/project-360/batch-01-research-consolidated-v1.json",

  identity:
    "data/project-360/batch-01-wikidata-identity-candidates-v1.json",

  core:
    "data/arknoz-core/canonical-entity-standard-v1.json",

  extension:
    "data/arknoz-core/project-entity-extension-v1.json",

  output:
    "data/project-360/batch-01-core-normalized-candidates-v1.json",
};

function readJson(relativePath) {
  const fullPath =
    path.join(root, relativePath);

  const raw =
    fs.readFileSync(fullPath, "utf8")
      .replace(/^\uFEFF/, "");

  return JSON.parse(raw);
}

function fail(message) {
  throw new Error(`SAFETY BLOCK: ${message}`);
}

const candidateData =
  readJson(files.projects);

const researchData =
  readJson(files.research);

const identityData =
  readJson(files.identity);

const core =
  readJson(files.core);

const extension =
  readJson(files.extension);

if (
  extension.inherits !==
  "ARKNOZ_CANONICAL_ENTITY_STANDARD_V1"
) {
  fail("Project extension does not inherit Arknoz Core");
}

if (
  !Array.isArray(extension.public_sections) ||
  extension.public_sections.length !== 6
) {
  fail("Project extension must contain exactly 6 sections");
}

const projects =
  Array.isArray(candidateData.projects)
    ? candidateData.projects
    : [];

const researchProjects =
  Array.isArray(researchData.projects)
    ? researchData.projects
    : [];

const identityProjects =
  Array.isArray(identityData.projects)
    ? identityData.projects
    : [];

if (projects.length !== 20) {
  fail(`expected 20 project candidates, got ${projects.length}`);
}

if (researchProjects.length !== 16) {
  fail(`expected 16 research projects, got ${researchProjects.length}`);
}

const researchById =
  new Map(
    researchProjects.map(
      (item) => [String(item.id), item]
    )
  );

const identityById =
  new Map(
    identityProjects.map(
      (item) => [String(item.project_id), item]
    )
  );

const allowedVerificationStates =
  new Set(
    Array.isArray(core.claim_standard?.verification_states)
      ? core.claim_standard.verification_states
      : []
  );

function namespacedSourceRef(
  projectId,
  sourceKey
) {
  return `${projectId}:SRC:${sourceKey}`;
}

function normalizeSource(
  projectId,
  source
) {
  const sourceKey =
    String(source.source_key ?? "").trim();

  if (!sourceKey) {
    fail(`source without source_key in ${projectId}`);
  }

  const organisation =
    String(source.organisation ?? "").trim();

  const sourceType =
    String(source.source_type ?? "").trim();

  if (!sourceType) {
    fail(
      `source ${sourceKey} in ${projectId} missing source_type`
    );
  }

  return {
    source_ref:
      namespacedSourceRef(
        projectId,
        sourceKey
      ),

    source_type:
      sourceType,

    source_identity:
      organisation || null,

    retrieved_at:
      null,

    source_url:
      String(source.url ?? "").trim() || null,

    external_id:
      null,

    original_field:
      null,

    original_value:
      null,

    document_page:
      null,

    document_section:
      null,

    license:
      null,

    attribution:
      null,

    content_hash:
      null,

    legacy: {
      source_key:
        sourceKey,

      role:
        String(source.role ?? "").trim() || null,

      organisation:
        organisation || null,
    },

    provenance_status:
      "PARTIAL_LEGACY",

    normalization_gaps: [
      "retrieved_at"
    ],

    canonical_authorized:
      false,

    publication_authorized:
      false,
  };
}

function normalizeClaim(
  projectId,
  claim,
  knownSourceKeys
) {
  const claimId =
    String(claim.claim_id ?? "").trim();

  const fieldKey =
    String(claim.target_key ?? "").trim();

  const verificationState =
    String(
      claim.verification_status ?? ""
    ).trim();

  if (!claimId) {
    fail(`claim without claim_id in ${projectId}`);
  }

  if (!fieldKey) {
    fail(
      `claim ${claimId} missing target_key`
    );
  }

  if (
    !allowedVerificationStates.has(
      verificationState
    )
  ) {
    fail(
      `claim ${claimId} has unsupported verification state: ${verificationState}`
    );
  }

  const legacySourceKeys =
    Array.isArray(claim.source_keys)
      ? claim.source_keys.map(String)
      : [];

  for (const sourceKey of legacySourceKeys) {
    if (!knownSourceKeys.has(sourceKey)) {
      fail(
        `claim ${claimId} references unknown source key ${sourceKey}`
      );
    }
  }

  return {
    claim_id:
      claimId,

    entity_id:
      projectId,

    field_key:
      fieldKey,

    value:
      claim.value,

    verification_state:
      verificationState,

    source_refs:
      legacySourceKeys.map(
        (sourceKey) =>
          namespacedSourceRef(
            projectId,
            sourceKey
          )
      ),

    value_normalized:
      null,

    unit:
      null,

    language:
      null,

    valid_from:
      null,

    valid_to:
      null,

    qualifiers:
      null,

    review_note:
      null,

    legacy: {
      target_key:
        fieldKey,

      label:
        String(claim.label ?? "").trim() || null,

      source_keys:
        legacySourceKeys,
    },

    candidate_only:
      true,

    canonical_authorized:
      false,

    publication_authorized:
      false,
  };
}

function normalizeConflict(
  projectId,
  conflict,
  knownSourceKeys
) {
  const conflictId =
    String(conflict.conflict_id ?? "").trim();

  const fieldKey =
    String(conflict.target_key ?? "").trim();

  if (!conflictId) {
    fail(
      `conflict without conflict_id in ${projectId}`
    );
  }

  const values =
    Array.isArray(conflict.values)
      ? conflict.values.map(
          (item) => {
            const sourceKey =
              String(
                item.source_key ?? ""
              ).trim();

            if (
              sourceKey &&
              !knownSourceKeys.has(sourceKey)
            ) {
              fail(
                `conflict ${conflictId} references unknown source ${sourceKey}`
              );
            }

            return {
              value:
                item.value,

              source_ref:
                sourceKey
                  ? namespacedSourceRef(
                      projectId,
                      sourceKey
                    )
                  : null,
            };
          }
        )
      : [];

  return {
    conflict_id:
      conflictId,

    entity_id:
      projectId,

    field_key:
      fieldKey,

    label:
      String(conflict.label ?? "").trim() || null,

    values,

    conflict_state:
      String(conflict.status ?? "").toUpperCase() ===
      "UNRESOLVED"
        ? "UNRESOLVED_CONFLICT"
        : "POTENTIAL_CONFLICT",

    canonical_value:
      conflict.canonical_value ?? null,

    review_action:
      String(conflict.action ?? "").trim() || null,

    candidate_only:
      true,

    canonical_authorized:
      false,

    publication_authorized:
      false,
  };
}

const normalizedProjects = [];

const normalizedClaims = [];

const normalizedSources = [];

const normalizedConflicts = [];

let goldMasterPending = 0;

let strongIdentityCandidates = 0;

for (const project of projects) {
  const projectId =
    String(project.id ?? "").trim();

  const title =
    String(project.title ?? "").trim();

  const slug =
    String(project.slug ?? "").trim();

  if (!projectId || !title || !slug) {
    fail(
      "project candidate missing id/title/slug"
    );
  }

  const research =
    researchById.get(projectId) ?? null;

  const identity =
    identityById.get(projectId) ?? null;

  const existingGoldMaster =
    project.existing_gold_master === true;

  if (
    !research &&
    !existingGoldMaster
  ) {
    fail(
      `${projectId} has neither research record nor Gold Master reference`
    );
  }

  if (
    research &&
    existingGoldMaster
  ) {
    fail(
      `${projectId} unexpectedly exists in both research pack and Gold Master reference path`
    );
  }

  const sources =
    research && Array.isArray(research.sources)
      ? research.sources
      : [];

  const claims =
    research && Array.isArray(research.claims)
      ? research.claims
      : [];

  const conflicts =
    research && Array.isArray(research.conflicts)
      ? research.conflicts
      : [];

  const sourceKeys =
    new Set(
      sources.map(
        (source) =>
          String(source.source_key ?? "").trim()
      )
    );

  for (const source of sources) {
    normalizedSources.push(
      normalizeSource(
        projectId,
        source
      )
    );
  }

  for (const claim of claims) {
    normalizedClaims.push(
      normalizeClaim(
        projectId,
        claim,
        sourceKeys
      )
    );
  }

  for (const conflict of conflicts) {
    normalizedConflicts.push(
      normalizeConflict(
        projectId,
        conflict,
        sourceKeys
      )
    );
  }

  const externalIds = [];

  const identityCandidates = [];

  if (identity) {
    const status =
      String(
        identity.identity_status ?? ""
      ).trim();

    const preferred =
      String(
        identity.preferred_candidate_wikidata_id ??
        ""
      ).trim();

    if (
      status === "STRONG" &&
      preferred
    ) {
      strongIdentityCandidates++;

      externalIds.push({
        system:
          "WIKIDATA",

        value:
          preferred,

        match_status:
          "STRONG_CANDIDATE",

        canonical_authorized:
          false,
      });
    }

    const candidates =
      Array.isArray(
        identity.candidate_wikidata_ids
      )
        ? identity.candidate_wikidata_ids
        : [];

    for (const candidate of candidates) {
      identityCandidates.push(
        String(candidate)
      );
    }
  }

  if (existingGoldMaster) {
    goldMasterPending++;
  }

  normalizedProjects.push({
    source_project_id:
      projectId,

    arknoz_id:
      null,

    entity_type:
      "PROJECT",

    canonical_name:
      title,

    slug,

    aliases:
      [],

    short_description:
      null,

    status:
      null,

    primary_place_id:
      null,

    external_ids:
      externalIds,

    official_urls:
      [],

    source_provenance:
      sources.map(
        (source) =>
          namespacedSourceRef(
            projectId,
            String(source.source_key)
          )
      ),

    review_state:
      "NORMALIZED",

    evidence_state:
      research
        ? "PARTIALLY_SOURCE_BACKED"
        : "UNVERIFIED",

    conflict_state:
      conflicts.length > 0
        ? "UNRESOLVED_CONFLICT"
        : "NONE",

    publication_state:
      "PRIVATE",

    publication_authorized:
      false,

    published_at:
      null,

    relationship_ids:
      [],

    created_at:
      null,

    updated_at:
      null,

    project_extension: {
      project_type:
        null,

      project_family:
        String(project.family ?? "").trim() || null,

      project_subtype:
        null,

      project_status:
        null,

      region:
        String(project.region ?? "").trim() || null,

      country:
        String(project.country ?? "").trim() || null,

      location:
        String(project.location ?? "").trim() || null,

      existing_gold_master:
        existingGoldMaster,
    },

    identity_review: {
      identity_status:
        identity
          ? String(identity.identity_status ?? "")
          : "MISSING",

      preferred_candidate_wikidata_id:
        identity
          ? String(
              identity.preferred_candidate_wikidata_id ??
              ""
            ) || null
          : null,

      candidate_wikidata_ids:
        identityCandidates,

      resolution_note:
        identity
          ? String(
              identity.resolution_note ?? ""
            ) || null
          : null,
    },

    normalization_status:
      existingGoldMaster
        ? "GOLD_MASTER_ADAPTER_REQUIRED"
        : "RESEARCH_NORMALIZED",

    normalization_gaps: [
      "arknoz_id",
      "created_at",
      "updated_at",
      ...(existingGoldMaster
        ? ["gold_master_claim_adapter"]
        : []),
    ],

    candidate_only:
      true,

    canonical_authorized:
      false,
  });
}

if (
  normalizedClaims.length !==
  Number(researchData.claim_count)
) {
  fail(
    `normalized claim count ${normalizedClaims.length} does not match research claim count ${researchData.claim_count}`
  );
}

if (
  normalizedClaims.length !== 170
) {
  fail(
    `expected 170 normalized claims, got ${normalizedClaims.length}`
  );
}

if (
  normalizedConflicts.length !==
  Number(
    researchData.unresolved_conflict_count
  )
) {
  fail(
    `normalized conflict count ${normalizedConflicts.length} does not match source conflict count ${researchData.unresolved_conflict_count}`
  );
}

if (
  normalizedConflicts.length !== 3
) {
  fail(
    `expected 3 preserved conflicts, got ${normalizedConflicts.length}`
  );
}

if (
  normalizedProjects.length !== 20
) {
  fail(
    `expected 20 normalized projects, got ${normalizedProjects.length}`
  );
}

if (
  goldMasterPending !== 4
) {
  fail(
    `expected 4 Gold Master adapter projects, got ${goldMasterPending}`
  );
}

const output = {
  standard:
    "ARKNOZ_PROJECT_360_CORE_NORMALIZED_CANDIDATES_V1",

  purpose:
    "Deterministic candidate-layer normalization of Project 360 Batch 01 into Arknoz Core-compatible structures without assigning canonical Arknoz IDs or publication authority.",

  inherits: [
    "ARKNOZ_CANONICAL_ENTITY_STANDARD_V1",
    "ARKNOZ_PROJECT_ENTITY_EXTENSION_V1",
  ],

  rules: [
    "This is a candidate normalization layer only.",
    "No Arknoz canonical IDs are assigned in this pass.",
    "Legacy research values are preserved without reinterpretation.",
    "Legacy source keys are namespaced to avoid cross-project collisions.",
    "Missing retrieval timestamps are preserved as explicit provenance gaps.",
    "Gold Master projects remain pending a separate Gold Master adapter.",
    "Wikidata STRONG matches remain candidate external IDs and are not canonicalized.",
    "Conflicts remain unresolved unless explicitly resolved by a later review step.",
    "Nothing in this file is automatically publication-authorized.",
  ],

  summary: {
    project_candidates:
      normalizedProjects.length,

    research_projects_normalized:
      researchProjects.length,

    gold_master_adapter_required:
      goldMasterPending,

    claims_normalized:
      normalizedClaims.length,

    sources_normalized:
      normalizedSources.length,

    conflicts_preserved:
      normalizedConflicts.length,

    strong_wikidata_identity_candidates:
      strongIdentityCandidates,

    canonical_arknoz_ids_assigned:
      0,

    canonical_authorized:
      0,

    publication_authorized:
      0,
  },

  projects:
    normalizedProjects,

  claims:
    normalizedClaims,

  sources:
    normalizedSources,

  conflicts:
    normalizedConflicts,
};

const outFull =
  path.join(
    root,
    files.output
  );

if (fs.existsSync(outFull)) {
  fail(
    `output already exists: ${files.output}`
  );
}

fs.writeFileSync(
  outFull,
  JSON.stringify(
    output,
    null,
    2
  ),
  "utf8"
);

console.log("");
console.log(
  "=== CORE NORMALIZATION COMPLETE ==="
);

console.log(
  `File: .\\${files.output.replaceAll("/", "\\")}`
);

console.log(
  `Projects normalized: ${normalizedProjects.length}`
);

console.log(
  `Research projects normalized: ${researchProjects.length}`
);

console.log(
  `Gold Master adapter required: ${goldMasterPending}`
);

console.log(
  `Claims normalized: ${normalizedClaims.length}`
);

console.log(
  `Sources normalized: ${normalizedSources.length}`
);

console.log(
  `Conflicts preserved: ${normalizedConflicts.length}`
);

console.log(
  `Strong Wikidata identity candidates: ${strongIdentityCandidates}`
);

console.log(
  "Canonical Arknoz IDs assigned: 0"
);

console.log(
  "Canonical authorized: NO"
);

console.log(
  "Publication authorized: NO"
);

console.log(
  "Existing research modified: NO"
);

console.log(
  "Gold Master modified: NO"
);

console.log(
  "Public UI modified: NO"
);

console.log(
  "Supabase modified: NO"
);