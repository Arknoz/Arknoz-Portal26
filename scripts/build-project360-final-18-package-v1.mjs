import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  core:
    "data/project-360/batch-01-core-normalized-candidates-v2.json",

  gate:
    "data/project-360/batch-01-identity-dedupe-gate-v1.json",

  reviewed:
    "data/project-360/batch-01-identity-reviewed-decisions-v1.json",

  domains:
    "data/arknoz-core/project-field-domain-registry-v1.json",

  output:
    "data/project-360/batch-01-final-18-package-v1.json",
};

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(
      path.join(root, relativePath),
      "utf8"
    ).replace(/^\uFEFF/, "")
  );
}

function fail(message) {
  throw new Error(
    `SAFETY BLOCK: ${message}`
  );
}

const core =
  readJson(files.core);

const gate =
  readJson(files.gate);

const reviewed =
  readJson(files.reviewed);

const domains =
  readJson(files.domains);

const projects =
  Array.isArray(core.projects)
    ? core.projects
    : [];

const claims =
  Array.isArray(core.claims)
    ? core.claims
    : [];

const sources =
  Array.isArray(core.sources)
    ? core.sources
    : [];

const conflicts =
  Array.isArray(core.conflicts)
    ? core.conflicts
    : [];

if (projects.length !== 20) {
  fail(
    `expected 20 source projects, got ${projects.length}`
  );
}

const gateProjects =
  Array.isArray(gate.projects)
    ? gate.projects
    : [];

const reviewedDecisions =
  Array.isArray(reviewed.decisions)
    ? reviewed.decisions
    : [];

const domainAudit =
  Array.isArray(domains.claim_resolution_audit)
    ? domains.claim_resolution_audit
    : [];

if (gateProjects.length !== 20) {
  fail(
    `expected 20 gate records, got ${gateProjects.length}`
  );
}

if (reviewedDecisions.length !== 7) {
  fail(
    `expected 7 reviewed identity decisions, got ${reviewedDecisions.length}`
  );
}

/* ============================================================
   RESOLVED 18
   ============================================================ */

const resolvedIds =
  new Set();

for (const item of gateProjects) {

  if (
    item.gate_state ===
    "IDENTITY_GATE_PASS"
  ) {
    resolvedIds.add(
      String(item.project_id)
    );
  }
}

for (const item of reviewedDecisions) {

  if (
    item.decision ===
    "RESOLVED_STRONG_CANDIDATE"
  ) {
    resolvedIds.add(
      String(item.project_id)
    );
  }
}

if (resolvedIds.size !== 18) {
  fail(
    `expected 18 resolved project IDs, got ${resolvedIds.size}`
  );
}

const heldIds =
  new Set(
    reviewedDecisions
      .filter(
        (item) =>
          item.decision ===
          "HOLD_SCOPE_REVIEW"
      )
      .map(
        (item) =>
          String(item.project_id)
      )
  );

if (heldIds.size !== 2) {
  fail(
    `expected 2 held project IDs, got ${heldIds.size}`
  );
}

for (const id of heldIds) {

  if (resolvedIds.has(id)) {
    fail(
      `project cannot be both resolved and held: ${id}`
    );
  }
}

/* ============================================================
   FILTER PROJECTS
   ============================================================ */

const finalProjects =
  projects.filter(
    (project) =>
      resolvedIds.has(
        String(project.source_project_id)
      )
  );

if (finalProjects.length !== 18) {
  fail(
    `expected 18 final projects, got ${finalProjects.length}`
  );
}

/* ============================================================
   CLAIMS
   ============================================================ */

const finalClaims =
  claims.filter(
    (claim) =>
      resolvedIds.has(
        String(claim.entity_id)
      )
  );

const finalClaimIds =
  new Set(
    finalClaims.map(
      (claim) =>
        String(claim.claim_id)
    )
  );

/* ============================================================
   SOURCE REFERENCES
   ============================================================ */

const usedSourceRefs =
  new Set();

for (const claim of finalClaims) {

  for (
    const sourceRef of
    Array.isArray(claim.source_refs)
      ? claim.source_refs
      : []
  ) {

    if (sourceRef) {
      usedSourceRefs.add(
        String(sourceRef)
      );
    }
  }
}

const finalSources =
  sources.filter(
    (source) =>
      usedSourceRefs.has(
        String(source.source_ref)
      )
  );

const finalSourceRefs =
  new Set(
    finalSources.map(
      (source) =>
        String(source.source_ref)
    )
  );

for (const ref of usedSourceRefs) {

  if (!finalSourceRefs.has(ref)) {
    fail(
      `claim references missing source: ${ref}`
    );
  }
}

/* ============================================================
   CONFLICTS
   ============================================================ */

function conflictProjectId(conflict) {

  return String(
    conflict.entity_id ??
    conflict.project_id ??
    conflict.source_project_id ??
    ""
  );
}

const finalConflicts =
  conflicts.filter(
    (conflict) =>
      resolvedIds.has(
        conflictProjectId(conflict)
      )
  );

/* ============================================================
   IDENTITY LAYER
   ============================================================ */

const reviewedById =
  new Map(
    reviewedDecisions.map(
      (item) =>
        [
          String(item.project_id),
          item,
        ]
    )
  );

const gateById =
  new Map(
    gateProjects.map(
      (item) =>
        [
          String(item.project_id),
          item,
        ]
    )
  );

const finalIdentity =
  finalProjects.map(
    (project) => {

      const projectId =
        String(
          project.source_project_id
        );

      const reviewedDecision =
        reviewedById.get(
          projectId
        );

      const gateDecision =
        gateById.get(
          projectId
        );

      if (reviewedDecision) {

        if (
          reviewedDecision.decision !==
          "RESOLVED_STRONG_CANDIDATE"
        ) {
          fail(
            `held identity entered final 18: ${projectId}`
          );
        }

        return {
          project_id:
            projectId,

          identity_resolution:
            "HUMAN_REVIEWED_STRONG",

          preferred_wikidata_id:
            reviewedDecision.preferred_wikidata_id,

          identity_scope:
            reviewedDecision.identity_scope,

          related_wikidata_ids:
            reviewedDecision.related_wikidata_ids ?? [],

          rejected_wikidata_ids:
            reviewedDecision.rejected_wikidata_ids ?? [],

          canonical_authorized:
            false,

          publication_authorized:
            false,
        };
      }

      if (
        !gateDecision ||
        gateDecision.gate_state !==
        "IDENTITY_GATE_PASS"
      ) {
        fail(
          `final project lacks passing identity gate: ${projectId}`
        );
      }

      return {
        project_id:
          projectId,

        identity_resolution:
          "DETERMINISTIC_STRONG",

        preferred_wikidata_id:
          gateDecision.preferred_wikidata_id,

        identity_scope:
          null,

        related_wikidata_ids:
          [],

        rejected_wikidata_ids:
          [],

        canonical_authorized:
          false,

        publication_authorized:
          false,
      };
    }
  );

/* ============================================================
   DOMAIN CLASSIFICATION
   ============================================================ */

const finalDomainAudit =
  domainAudit.filter(
    (item) =>
      finalClaimIds.has(
        String(item.claim_id)
      )
  );

const unresolvedDomainClaims =
  finalDomainAudit.filter(
    (item) =>
      item.resolution_status !==
      "RESOLVED"
  );

const finalProjectIds =
  new Set(
    finalProjects.map(
      (project) =>
        String(project.source_project_id)
    )
  );

if (
  finalProjectIds.size !== 18
) {
  fail(
    "duplicate project IDs detected in final package"
  );
}

/* ============================================================
   HELD PROJECTS
   ============================================================ */

const heldProjects =
  projects
    .filter(
      (project) =>
        heldIds.has(
          String(project.source_project_id)
        )
    )
    .map(
      (project) => ({
        project_id:
          project.source_project_id,

        canonical_name:
          project.canonical_name,

        slug:
          project.slug,

        status:
          "EXCLUDED_FROM_FINAL_18_IDENTITY_SCOPE_HOLD",
      })
    );

if (heldProjects.length !== 2) {
  fail(
    `expected 2 excluded held projects, got ${heldProjects.length}`
  );
}

/* ============================================================
   OUTPUT
   ============================================================ */

const output = {
  standard:
    "ARKNOZ_PROJECT360_BATCH01_FINAL_18_PACKAGE_V1",

  scope:
    "PROJECT_360_BATCH_01",

  status:
    "STRONG_CANDIDATE_REFERENCE_PACKAGE",

  purpose:
    "Clean reference package containing only the 18 identity-resolved Project candidates from Batch 01 and their connected claim, source, conflict, identity and domain-resolution records.",

  rules: [
    "The 2 remaining identity-scope holds are excluded from this package.",
    "No Arknoz primary IDs are assigned by this package.",
    "No claim verification state is upgraded.",
    "No canonical authorization is granted.",
    "No publication authorization is granted.",
    "No public UI or database state is changed.",
  ],

  summary: {
    source_projects:
      projects.length,

    final_projects:
      finalProjects.length,

    held_projects:
      heldProjects.length,

    claims:
      finalClaims.length,

    sources:
      finalSources.length,

    conflicts:
      finalConflicts.length,

    identity_records:
      finalIdentity.length,

    claim_domain_records:
      finalDomainAudit.length,

    unresolved_claim_domains:
      unresolvedDomainClaims.length,

    arknoz_ids_assigned:
      0,

    canonical_authorized:
      0,

    publication_authorized:
      0,
  },

  held_projects:
    heldProjects,

  projects:
    finalProjects,

  identities:
    finalIdentity,

  claims:
    finalClaims,

  sources:
    finalSources,

  conflicts:
    finalConflicts,

  claim_domain_resolution:
    finalDomainAudit,

  source_files: {
    normalized_core:
      files.core,

    identity_gate:
      files.gate,

    reviewed_identity:
      files.reviewed,

    field_domain_registry:
      files.domains,
  },
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
  "=== FINAL 18 PACKAGE CREATED ==="
);

console.log(
  `Output: .\\${files.output.replaceAll("/", "\\")}`
);

console.log(
  `Final projects: ${finalProjects.length}`
);

console.log(
  `Held projects excluded: ${heldProjects.length}`
);

console.log(
  `Claims: ${finalClaims.length}`
);

console.log(
  `Sources: ${finalSources.length}`
);

console.log(
  `Conflicts: ${finalConflicts.length}`
);

console.log(
  `Identity records: ${finalIdentity.length}`
);

console.log(
  `Domain-resolution records: ${finalDomainAudit.length}`
);

console.log(
  `Unresolved claim domains: ${unresolvedDomainClaims.length}`
);

console.log(
  "Arknoz IDs assigned: 0"
);

console.log(
  "Canonical changed: NO"
);

console.log(
  "Public UI changed: NO"
);

console.log(
  "Supabase changed: NO"
);