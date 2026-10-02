import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  projects:
    "data/project-360/batch-01-core-normalized-candidates-v2.json",

  identity:
    "data/project-360/batch-01-wikidata-identity-candidates-v1.json",

  output:
    "data/project-360/batch-01-identity-dedupe-gate-v1.json",
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

function normalizeTitle(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const projectData =
  readJson(files.projects);

const identityData =
  readJson(files.identity);

const projects =
  Array.isArray(projectData.projects)
    ? projectData.projects
    : [];

const identities =
  Array.isArray(identityData.projects)
    ? identityData.projects
    : [];

if (projects.length !== 20) {
  fail(
    `expected 20 normalized projects, got ${projects.length}`
  );
}

if (identities.length !== 20) {
  fail(
    `expected 20 identity records, got ${identities.length}`
  );
}

const identityByProject =
  new Map();

for (const item of identities) {

  const projectId =
    String(item.project_id ?? "").trim();

  if (!projectId) {
    fail(
      "identity record missing project_id"
    );
  }

  if (identityByProject.has(projectId)) {
    fail(
      `duplicate identity record for ${projectId}`
    );
  }

  identityByProject.set(
    projectId,
    item
  );
}

/* ============================================================
   EXACT DEDUPE SIGNALS
   ============================================================ */

function duplicateGroups(
  values,
  keyName
) {
  const groups =
    new Map();

  for (const item of values) {

    const key =
      String(item[keyName] ?? "").trim();

    if (!key) {
      continue;
    }

    if (!groups.has(key)) {
      groups.set(
        key,
        []
      );
    }

    groups
      .get(key)
      .push(item.project_id);
  }

  return [
    ...groups.entries()
  ]
    .filter(
      ([, ids]) =>
        ids.length > 1
    )
    .map(
      ([key, ids]) => ({
        key,
        project_ids:
          ids,
      })
    );
}

const identityRows =
  [];

for (const project of projects) {

  const projectId =
    String(
      project.source_project_id ?? ""
    ).trim();

  const title =
    String(
      project.canonical_name ?? ""
    ).trim();

  const slug =
    String(
      project.slug ?? ""
    ).trim();

  if (
    !projectId ||
    !title ||
    !slug
  ) {
    fail(
      "project missing source_project_id, canonical_name or slug"
    );
  }

  const identity =
    identityByProject.get(
      projectId
    );

  if (!identity) {
    fail(
      `identity record missing for ${projectId}`
    );
  }

  const status =
    String(
      identity.identity_status ?? ""
    ).trim();

  const preferred =
    String(
      identity.preferred_candidate_wikidata_id ??
      ""
    ).trim();

  const candidateIds =
    Array.isArray(
      identity.candidate_wikidata_ids
    )
      ? identity.candidate_wikidata_ids
          .map(
            (value) =>
              String(value).trim()
          )
          .filter(Boolean)
      : [];

  const externalIds =
    Array.isArray(project.external_ids)
      ? project.external_ids
      : [];

  const wikidataExternalIds =
    externalIds
      .filter(
        (item) =>
          String(item.system ?? "") ===
          "WIKIDATA"
      )
      .map(
        (item) =>
          String(item.value ?? "").trim()
      )
      .filter(Boolean);

  const preferredMatchesExternal =
    preferred
      ? (
          wikidataExternalIds.length === 1 &&
          wikidataExternalIds[0] === preferred
        )
      : false;

  identityRows.push({
    project_id:
      projectId,

    project:
      title,

    slug,

    normalized_title:
      normalizeTitle(title),

    identity_status:
      status,

    preferred_wikidata_id:
      preferred || null,

    candidate_wikidata_ids:
      candidateIds,

    external_wikidata_ids:
      wikidataExternalIds,

    preferred_matches_external:
      preferredMatchesExternal,

    candidate_only:
      true,

    arknoz_id_assignment_authorized:
      false,

    canonical_authorized:
      false,

    publication_authorized:
      false,
  });
}

const duplicateProjectIds =
  duplicateGroups(
    identityRows,
    "project_id"
  );

const duplicateSlugs =
  duplicateGroups(
    identityRows,
    "slug"
  );

const duplicateTitles =
  duplicateGroups(
    identityRows,
    "normalized_title"
  );

const strongRows =
  identityRows.filter(
    (item) =>
      item.identity_status ===
      "STRONG" &&
      item.preferred_wikidata_id
  );

const duplicateStrongWikidata =
  duplicateGroups(
    strongRows,
    "preferred_wikidata_id"
  );

/*
  Also test ALL candidate Wikidata IDs across projects.
  A shared candidate ID is not automatically a duplicate,
  but it is a deterministic collision signal requiring review.
*/

const candidateIdProjects =
  new Map();

for (const row of identityRows) {

  for (
    const candidateId of
    row.candidate_wikidata_ids
  ) {

    if (!candidateIdProjects.has(candidateId)) {
      candidateIdProjects.set(
        candidateId,
        new Set()
      );
    }

    candidateIdProjects
      .get(candidateId)
      .add(row.project_id);
  }
}

const sharedCandidateWikidata =
  [
    ...candidateIdProjects.entries()
  ]
    .filter(
      ([, projectIds]) =>
        projectIds.size > 1
    )
    .map(
      ([wikidata_id, projectIds]) => ({
        wikidata_id,
        project_ids:
          [...projectIds],
      })
    );

/* ============================================================
   PROJECT-BY-PROJECT GATE
   ============================================================ */

const gate =
  [];

for (const row of identityRows) {

  const reasons =
    [];

  const collisions =
    [];

  if (
    duplicateProjectIds.some(
      (item) =>
        item.project_ids.includes(
          row.project_id
        )
    )
  ) {
    collisions.push(
      "DUPLICATE_PROJECT_ID"
    );
  }

  if (
    duplicateSlugs.some(
      (item) =>
        item.project_ids.includes(
          row.project_id
        )
    )
  ) {
    collisions.push(
      "DUPLICATE_SLUG"
    );
  }

  if (
    duplicateTitles.some(
      (item) =>
        item.project_ids.includes(
          row.project_id
        )
    )
  ) {
    collisions.push(
      "DUPLICATE_NORMALIZED_TITLE"
    );
  }

  if (
    row.preferred_wikidata_id &&
    duplicateStrongWikidata.some(
      (item) =>
        item.project_ids.includes(
          row.project_id
        )
    )
  ) {
    collisions.push(
      "DUPLICATE_STRONG_WIKIDATA_ID"
    );
  }

  const sharedCandidateIds =
    sharedCandidateWikidata
      .filter(
        (item) =>
          item.project_ids.includes(
            row.project_id
          )
      )
      .map(
        (item) =>
          item.wikidata_id
      );

  if (sharedCandidateIds.length > 0) {
    collisions.push(
      "SHARED_WIKIDATA_CANDIDATE"
    );
  }

  let gateState;

  if (collisions.length > 0) {

    gateState =
      "HOLD_DUPLICATE_REVIEW";

    reasons.push(
      "Deterministic duplicate/collision signal present."
    );
  }
  else if (
    row.identity_status ===
    "STRONG"
  ) {

    if (
      !row.preferred_wikidata_id
    ) {
      gateState =
        "HOLD_IDENTITY_REVIEW";

      reasons.push(
        "STRONG identity has no preferred Wikidata ID."
      );
    }
    else if (
      !row.preferred_matches_external
    ) {
      gateState =
        "HOLD_IDENTITY_REVIEW";

      reasons.push(
        "Preferred Wikidata ID does not match the normalized candidate external ID."
      );
    }
    else {

      gateState =
        "IDENTITY_GATE_PASS";

      reasons.push(
        "Strong unique Wikidata identity with matching external ID and no deterministic duplicate signal."
      );
    }
  }
  else if (
    row.identity_status ===
    "AMBIGUOUS"
  ) {

    gateState =
      "HOLD_IDENTITY_REVIEW";

    reasons.push(
      "Identity remains ambiguous."
    );
  }
  else if (
    row.identity_status ===
    "UNRESOLVED"
  ) {

    gateState =
      "HOLD_IDENTITY_RESEARCH";

    reasons.push(
      "No resolved external identity candidate."
    );
  }
  else {

    gateState =
      "HOLD_IDENTITY_REVIEW";

    reasons.push(
      `Unknown identity state: ${row.identity_status}`
    );
  }

  gate.push({
    project_id:
      row.project_id,

    project:
      row.project,

    slug:
      row.slug,

    normalized_title:
      row.normalized_title,

    identity_status:
      row.identity_status,

    preferred_wikidata_id:
      row.preferred_wikidata_id,

    candidate_wikidata_ids:
      row.candidate_wikidata_ids,

    collision_signals:
      collisions,

    shared_candidate_wikidata_ids:
      sharedCandidateIds,

    gate_state:
      gateState,

    reasons,

    identity_resolved_for_candidate_layer:
      gateState ===
      "IDENTITY_GATE_PASS",

    arknoz_id_assignment_authorized:
      false,

    canonical_authorized:
      false,

    publication_authorized:
      false,
  });
}

/* ============================================================
   VALIDATION
   ============================================================ */

const passed =
  gate.filter(
    (item) =>
      item.gate_state ===
      "IDENTITY_GATE_PASS"
  );

const heldReview =
  gate.filter(
    (item) =>
      item.gate_state ===
      "HOLD_IDENTITY_REVIEW"
  );

const heldResearch =
  gate.filter(
    (item) =>
      item.gate_state ===
      "HOLD_IDENTITY_RESEARCH"
  );

const heldDuplicate =
  gate.filter(
    (item) =>
      item.gate_state ===
      "HOLD_DUPLICATE_REVIEW"
  );

if (gate.length !== 20) {
  fail(
    `expected 20 gate records, got ${gate.length}`
  );
}

if (passed.length !== 13) {
  fail(
    `expected 13 identity-gate passes, got ${passed.length}`
  );
}

if (heldReview.length !== 5) {
  fail(
    `expected 5 identity review holds, got ${heldReview.length}`
  );
}

if (heldResearch.length !== 2) {
  fail(
    `expected 2 identity research holds, got ${heldResearch.length}`
  );
}

if (heldDuplicate.length !== 0) {
  fail(
    `expected 0 duplicate-review holds in Batch 01, got ${heldDuplicate.length}`
  );
}

if (
  duplicateProjectIds.length !== 0 ||
  duplicateSlugs.length !== 0 ||
  duplicateTitles.length !== 0 ||
  duplicateStrongWikidata.length !== 0
) {
  fail(
    "unexpected exact duplicate collision in Batch 01"
  );
}

const output = {
  standard:
    "ARKNOZ_PROJECT_IDENTITY_DEDUPE_GATE_V1",

  scope:
    "PROJECT_360_BATCH_01",

  purpose:
    "Deterministic identity and exact-duplicate gate for Project candidates before Arknoz ID assignment or canonical promotion.",

  rules: [
    "External identifiers are identity evidence, not Arknoz primary IDs.",
    "A STRONG identity may pass only when the preferred external ID matches the normalized candidate external ID.",
    "Exact project-ID, slug, normalized-title or strong external-ID collisions are held for duplicate review.",
    "Shared candidate external IDs are review signals, not automatic duplicate conclusions.",
    "AMBIGUOUS identities remain held for human identity review.",
    "UNRESOLVED identities remain held for further research.",
    "Passing this gate does not assign an Arknoz ID.",
    "Passing this gate does not authorize canonical or public publication."
  ],

  summary: {
    projects_examined:
      gate.length,

    identity_gate_pass:
      passed.length,

    hold_identity_review:
      heldReview.length,

    hold_identity_research:
      heldResearch.length,

    hold_duplicate_review:
      heldDuplicate.length,

    duplicate_project_ids:
      duplicateProjectIds.length,

    duplicate_slugs:
      duplicateSlugs.length,

    duplicate_normalized_titles:
      duplicateTitles.length,

    duplicate_strong_wikidata_ids:
      duplicateStrongWikidata.length,

    shared_candidate_wikidata_ids:
      sharedCandidateWikidata.length,

    arknoz_ids_assigned:
      0,

    canonical_authorized:
      0,

    publication_authorized:
      0,
  },

  duplicate_signals: {
    project_ids:
      duplicateProjectIds,

    slugs:
      duplicateSlugs,

    normalized_titles:
      duplicateTitles,

    strong_wikidata:
      duplicateStrongWikidata,

    shared_candidate_wikidata:
      sharedCandidateWikidata,
  },

  projects:
    gate,
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
  "=== IDENTITY + DEDUPE GATE COMPLETE ==="
);

console.log(
  `Output: .\\${files.output.replaceAll("/", "\\")}`
);

console.log(
  `Projects examined: ${gate.length}`
);

console.log(
  `IDENTITY_GATE_PASS: ${passed.length}`
);

console.log(
  `HOLD_IDENTITY_REVIEW: ${heldReview.length}`
);

console.log(
  `HOLD_IDENTITY_RESEARCH: ${heldResearch.length}`
);

console.log(
  `HOLD_DUPLICATE_REVIEW: ${heldDuplicate.length}`
);

console.log(
  `Duplicate Project IDs: ${duplicateProjectIds.length}`
);

console.log(
  `Duplicate slugs: ${duplicateSlugs.length}`
);

console.log(
  `Duplicate normalized titles: ${duplicateTitles.length}`
);

console.log(
  `Duplicate strong Wikidata IDs: ${duplicateStrongWikidata.length}`
);

console.log(
  `Shared candidate Wikidata IDs: ${sharedCandidateWikidata.length}`
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