import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  normalizedV1:
    "data/project-360/batch-01-core-normalized-candidates-v1.json",

  candidates:
    "data/project-360/batch-01-candidates-v1.json",

  goldRecords:
    "data/gold-master-v1/records/projects-m18-import-v3.json",

  goldSources:
    "data/gold-master-v1/research/projects-source-pack-v3.json",

  core:
    "data/arknoz-core/canonical-entity-standard-v1.json",

  output:
    "data/project-360/batch-01-core-normalized-candidates-v2.json",
};

function readJson(relativePath) {
  const full =
    path.join(root, relativePath);

  return JSON.parse(
    fs.readFileSync(full, "utf8")
      .replace(/^\uFEFF/, "")
  );
}

function fail(message) {
  throw new Error(
    `SAFETY BLOCK: ${message}`
  );
}

const v1 =
  readJson(files.normalizedV1);

const candidates =
  readJson(files.candidates);

const goldRecords =
  readJson(files.goldRecords);

const goldSources =
  readJson(files.goldSources);

const core =
  readJson(files.core);

const projects =
  Array.isArray(v1.projects)
    ? structuredClone(v1.projects)
    : [];

const claims =
  Array.isArray(v1.claims)
    ? structuredClone(v1.claims)
    : [];

const sources =
  Array.isArray(v1.sources)
    ? structuredClone(v1.sources)
    : [];

const conflicts =
  Array.isArray(v1.conflicts)
    ? structuredClone(v1.conflicts)
    : [];

if (projects.length !== 20) {
  fail(
    `expected 20 V1 projects, got ${projects.length}`
  );
}

if (claims.length !== 170) {
  fail(
    `expected 170 V1 claims, got ${claims.length}`
  );
}

if (sources.length !== 53) {
  fail(
    `expected 53 V1 sources, got ${sources.length}`
  );
}

if (conflicts.length !== 3) {
  fail(
    `expected 3 V1 conflicts, got ${conflicts.length}`
  );
}

const candidateProjects =
  Array.isArray(candidates.projects)
    ? candidates.projects
    : [];

const goldRecordItems =
  Array.isArray(goldRecords.records)
    ? goldRecords.records
    : [];

const goldSourceItems =
  Array.isArray(goldSources.records)
    ? goldSources.records
    : [];

if (goldRecordItems.length !== 4) {
  fail(
    `expected 4 Gold Master records, got ${goldRecordItems.length}`
  );
}

if (goldSourceItems.length !== 4) {
  fail(
    `expected 4 Gold Master source records, got ${goldSourceItems.length}`
  );
}

/*
  Explicit mapping is intentional.

  High Line uses "high-line-new-york" in Gold Master,
  so we do not rely on candidate slug equality.
*/
const goldMap = [
  {
    projectId: "P360-B01-001",
    title: "Sydney Opera House",
    goldSlug: "sydney-opera-house",
  },
  {
    projectId: "P360-B01-007",
    title: "Elizabeth Line",
    goldSlug: "elizabeth-line",
  },
  {
    projectId: "P360-B01-011",
    title: "High Line",
    goldSlug: "high-line-new-york",
  },
  {
    projectId: "P360-B01-014",
    title: "Noor Ouarzazate Solar Complex",
    goldSlug: "noor-ouarzazate-solar-complex",
  },
];

const allowedClaimStates =
  new Set([
    "CANDIDATE",
    "SOURCE_BACKED",
    "REVIEWED",
    "CANONICAL",
    "REJECTED",
  ]);

function sourceRef(
  projectId,
  sourceKey
) {
  return `${projectId}:GM:SRC:${sourceKey}`;
}

const goldRecordBySlug =
  new Map();

for (const item of goldRecordItems) {
  const slug =
    String(
      item?.entity?.slug ?? ""
    ).trim();

  if (!slug) {
    fail(
      "Gold Master record missing entity.slug"
    );
  }

  if (goldRecordBySlug.has(slug)) {
    fail(
      `duplicate Gold Master record slug: ${slug}`
    );
  }

  goldRecordBySlug.set(
    slug,
    item
  );
}

const goldSourceBySlug =
  new Map();

for (const item of goldSourceItems) {
  const slug =
    String(item.slug ?? "").trim();

  if (!slug) {
    fail(
      "Gold Master source-pack record missing slug"
    );
  }

  if (goldSourceBySlug.has(slug)) {
    fail(
      `duplicate Gold Master source slug: ${slug}`
    );
  }

  goldSourceBySlug.set(
    slug,
    item
  );
}

let addedClaims = 0;
let addedSources = 0;

const processedProjectIds =
  new Set();

for (const mapping of goldMap) {

  const candidate =
    candidateProjects.find(
      (item) =>
        String(item.id) ===
        mapping.projectId
    );

  if (!candidate) {
    fail(
      `candidate missing: ${mapping.projectId}`
    );
  }

  if (
    String(candidate.title) !==
    mapping.title
  ) {
    fail(
      `candidate title mismatch for ${mapping.projectId}`
    );
  }

  if (
    candidate.existing_gold_master !==
    true
  ) {
    fail(
      `${mapping.projectId} is not marked existing_gold_master`
    );
  }

  const normalizedProject =
    projects.find(
      (item) =>
        String(item.source_project_id) ===
        mapping.projectId
    );

  if (!normalizedProject) {
    fail(
      `normalized V1 project missing: ${mapping.projectId}`
    );
  }

  if (
    normalizedProject.normalization_status !==
    "GOLD_MASTER_ADAPTER_REQUIRED"
  ) {
    fail(
      `${mapping.projectId} does not require Gold Master adapter`
    );
  }

  const goldRecord =
    goldRecordBySlug.get(
      mapping.goldSlug
    );

  const sourcePack =
    goldSourceBySlug.get(
      mapping.goldSlug
    );

  if (!goldRecord) {
    fail(
      `Gold Master record missing: ${mapping.goldSlug}`
    );
  }

  if (!sourcePack) {
    fail(
      `Gold Master source pack missing: ${mapping.goldSlug}`
    );
  }

  if (
    String(goldRecord.entity.title) !==
    mapping.title
  ) {
    fail(
      `Gold Master title mismatch: ${mapping.goldSlug}`
    );
  }

  if (
    String(sourcePack.title) !==
    mapping.title
  ) {
    fail(
      `Gold source-pack title mismatch: ${mapping.goldSlug}`
    );
  }

  const recordFacts =
    Array.isArray(goldRecord.facts)
      ? goldRecord.facts
      : [];

  const packFacts =
    Array.isArray(sourcePack.facts)
      ? sourcePack.facts
      : [];

  const packSources =
    Array.isArray(sourcePack.sources)
      ? sourcePack.sources
      : [];

  if (
    recordFacts.length !==
    packFacts.length
  ) {
    fail(
      `fact count mismatch for ${mapping.goldSlug}`
    );
  }

  const recordFactKeys =
    recordFacts
      .map(
        (item) =>
          String(item.fact_key)
      )
      .sort();

  const packFactKeys =
    packFacts
      .map(
        (item) =>
          String(item.fact_key)
      )
      .sort();

  if (
    JSON.stringify(recordFactKeys) !==
    JSON.stringify(packFactKeys)
  ) {
    fail(
      `fact-key mismatch between Gold files for ${mapping.goldSlug}`
    );
  }

  const knownSourceKeys =
    new Set();

  for (const source of packSources) {

    const sourceKey =
      String(
        source.source_key ?? ""
      ).trim();

    if (!sourceKey) {
      fail(
        `Gold source missing source_key in ${mapping.goldSlug}`
      );
    }

    if (knownSourceKeys.has(sourceKey)) {
      fail(
        `duplicate source_key ${sourceKey} in ${mapping.goldSlug}`
      );
    }

    knownSourceKeys.add(
      sourceKey
    );

    sources.push({
      source_ref:
        sourceRef(
          mapping.projectId,
          sourceKey
        ),

      source_type:
        String(
          source.source_type ?? ""
        ).trim() || "unknown",

      source_identity:
        String(
          source.organisation ?? ""
        ).trim() || null,

      retrieved_at:
        String(
          source.last_checked_at ?? ""
        ).trim() || null,

      source_url:
        String(
          source.url ?? ""
        ).trim() || null,

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
        gold_master_slug:
          mapping.goldSlug,

        source_key:
          sourceKey,

        label:
          String(
            source.label ?? ""
          ).trim() || null,

        independent:
          source.independent === true,

        last_checked_at:
          String(
            source.last_checked_at ?? ""
          ).trim() || null,
      },

      provenance_status:
        "GOLD_MASTER_SOURCE_PACK",

      normalization_gaps:
        [],

      canonical_authorized:
        false,

      publication_authorized:
        false,
    });

    addedSources++;
  }

  /*
    Use richer facts from projects-m18-import-v3.
    The facts remain CANDIDATE because Gold Master itself
    marks them as candidate and requires a later verification gate.
  */
  let factIndex = 0;

  for (const fact of recordFacts) {

    factIndex++;

    const factKey =
      String(
        fact.fact_key ?? ""
      ).trim();

    if (!factKey) {
      fail(
        `Gold fact missing fact_key in ${mapping.goldSlug}`
      );
    }

    const evidence =
      Array.isArray(fact.evidence)
        ? fact.evidence
        : [];

    const refs = [];

    const evidenceQualifiers = [];

    for (const item of evidence) {

      const sourceKey =
        String(
          item.source_key ?? ""
        ).trim();

      if (!sourceKey) {
        fail(
          `evidence without source_key for ${mapping.goldSlug}/${factKey}`
        );
      }

      if (
        !knownSourceKeys.has(
          sourceKey
        )
      ) {
        fail(
          `fact ${factKey} references unknown source ${sourceKey}`
        );
      }

      const ref =
        sourceRef(
          mapping.projectId,
          sourceKey
        );

      if (!refs.includes(ref)) {
        refs.push(ref);
      }

      evidenceQualifiers.push({
        source_ref:
          ref,

        support_type:
          String(
            item.support_type ?? ""
          ).trim() || null,

        is_independent:
          item.is_independent === true,

        evidence_locator:
          String(
            item.evidence_locator ?? ""
          ).trim() || null,
      });
    }

    const verificationState =
      "CANDIDATE";

    if (
      !allowedClaimStates.has(
        verificationState
      )
    ) {
      fail(
        `unsupported Core verification state: ${verificationState}`
      );
    }

    claims.push({
      claim_id:
        `${mapping.projectId}-GM-C${String(factIndex).padStart(2, "0")}`,

      entity_id:
        mapping.projectId,

      field_key:
        factKey,

      value:
        fact.value,

      verification_state:
        verificationState,

      source_refs:
        refs,

      value_normalized:
        null,

      unit:
        fact.unit ?? null,

      language:
        null,

      valid_from:
        null,

      valid_to:
        null,

      qualifiers: {
        evidence:
          evidenceQualifiers,

        origin_type:
          String(
            fact.origin_type ?? ""
          ).trim() || null,

        gold_master_fact_status:
          String(
            fact.fact_status ?? ""
          ).trim() || null,

        publication_disposition:
          String(
            fact.publication_disposition ?? ""
          ).trim() || null,

        promotion_eligible:
          fact.promotion_eligible === true,

        hold_reason:
          fact.hold_reason ?? null,
      },

      review_note:
        null,

      legacy: {
        source_layer:
          "GOLD_MASTER_V1",

        gold_master_slug:
          mapping.goldSlug,

        fact_key:
          factKey,

        label:
          String(
            fact.label ?? ""
          ).trim() || null,
      },

      candidate_only:
        true,

      canonical_authorized:
        false,

      publication_authorized:
        false,
    });

    addedClaims++;
  }

  const goldRefs =
    packSources.map(
      (source) =>
        sourceRef(
          mapping.projectId,
          String(source.source_key)
        )
    );

  normalizedProject.source_provenance =
    Array.from(
      new Set([
        ...(
          Array.isArray(
            normalizedProject.source_provenance
          )
            ? normalizedProject.source_provenance
            : []
        ),
        ...goldRefs,
      ])
    );

  normalizedProject.evidence_state =
    "PARTIALLY_SOURCE_BACKED";

  normalizedProject.review_state =
    "NORMALIZED";

  normalizedProject.normalization_status =
    "GOLD_MASTER_NORMALIZED";

  normalizedProject.normalization_gaps =
    (
      Array.isArray(
        normalizedProject.normalization_gaps
      )
        ? normalizedProject.normalization_gaps
        : []
    ).filter(
      (item) =>
        item !==
        "gold_master_claim_adapter"
    );

  normalizedProject.gold_master_compatibility = {
    gold_master_slug:
      mapping.goldSlug,

    canonical_path:
      String(
        goldRecord.entity.canonical_path ??
        ""
      ).trim() || null,

    geography_label:
      String(
        goldRecord.entity.geography_label ??
        ""
      ).trim() || null,

    geography_slug:
      String(
        goldRecord.entity.geography_slug ??
        ""
      ).trim() || null,

    project_parent:
      String(
        goldRecord.entity.project_parent ??
        ""
      ).trim() || null,

    intended_content_status:
      String(
        goldRecord.entity.intended_content_status ??
        ""
      ).trim() || null,

    intended_verification_status:
      String(
        goldRecord.entity.intended_verification_status ??
        ""
      ).trim() || null,

    fact_count:
      recordFacts.length,

    source_count:
      packSources.length,
  };

  processedProjectIds.add(
    mapping.projectId
  );
}

/* ============================================================
   FINAL VALIDATION
   ============================================================ */

if (processedProjectIds.size !== 4) {
  fail(
    `expected 4 adapted Gold Master projects, got ${processedProjectIds.size}`
  );
}

if (addedClaims !== 21) {
  fail(
    `expected 21 Gold Master claims, got ${addedClaims}`
  );
}

if (addedSources !== 15) {
  fail(
    `expected 15 Gold Master sources, got ${addedSources}`
  );
}

if (claims.length !== 191) {
  fail(
    `expected 191 total claims, got ${claims.length}`
  );
}

if (sources.length !== 68) {
  fail(
    `expected 68 total sources, got ${sources.length}`
  );
}

if (conflicts.length !== 3) {
  fail(
    `expected 3 preserved conflicts, got ${conflicts.length}`
  );
}

const stillPending =
  projects.filter(
    (item) =>
      item.normalization_status ===
      "GOLD_MASTER_ADAPTER_REQUIRED"
  );

if (stillPending.length !== 0) {
  fail(
    `Gold Master projects still pending: ${stillPending.length}`
  );
}

const goldNormalized =
  projects.filter(
    (item) =>
      item.normalization_status ===
      "GOLD_MASTER_NORMALIZED"
  );

if (goldNormalized.length !== 4) {
  fail(
    `expected 4 Gold Master normalized projects, got ${goldNormalized.length}`
  );
}

const researchNormalized =
  projects.filter(
    (item) =>
      item.normalization_status ===
      "RESEARCH_NORMALIZED"
  );

if (researchNormalized.length !== 16) {
  fail(
    `expected 16 research-normalized projects, got ${researchNormalized.length}`
  );
}

const assignedArknozIds =
  projects.filter(
    (item) =>
      item.arknoz_id !== null
  );

if (assignedArknozIds.length !== 0) {
  fail(
    "Arknoz canonical IDs were unexpectedly assigned"
  );
}

const canonicalProjects =
  projects.filter(
    (item) =>
      item.canonical_authorized === true
  );

if (canonicalProjects.length !== 0) {
  fail(
    "canonical project authorization unexpectedly present"
  );
}

const publishedProjects =
  projects.filter(
    (item) =>
      item.publication_authorized === true
  );

if (publishedProjects.length !== 0) {
  fail(
    "publication authorization unexpectedly present"
  );
}

const output = {
  standard:
    "ARKNOZ_PROJECT_360_CORE_NORMALIZED_CANDIDATES_V2",

  purpose:
    "Unified Arknoz Core-compatible candidate layer for all 20 Project 360 Batch 01 projects, combining 16 normalized research projects with 4 normalized Gold Master projects without canonical or publication promotion.",

  generated_from: [
    files.normalizedV1,
    files.goldRecords,
    files.goldSources,
  ],

  rules: [
    "All 20 Project 360 Batch 01 projects are represented in one Core-compatible candidate layer.",
    "Gold Master facts remain CANDIDATE because the source package requires a later verification gate.",
    "Gold Master evidence locators and source provenance are preserved.",
    "No canonical Arknoz IDs are assigned.",
    "No project, fact or source is publication-authorized by this adapter.",
    "The V1 normalized candidate file remains unchanged.",
    "The Gold Master source files remain unchanged.",
  ],

  summary: {
    project_candidates:
      projects.length,

    research_projects_normalized:
      researchNormalized.length,

    gold_master_projects_normalized:
      goldNormalized.length,

    gold_master_adapter_required:
      0,

    legacy_research_claims:
      170,

    gold_master_claims:
      addedClaims,

    claims_normalized:
      claims.length,

    legacy_research_sources:
      53,

    gold_master_sources:
      addedSources,

    sources_normalized:
      sources.length,

    conflicts_preserved:
      conflicts.length,

    canonical_arknoz_ids_assigned:
      0,

    canonical_authorized:
      0,

    publication_authorized:
      0,
  },

  projects,
  claims,
  sources,
  conflicts,
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
  "=== GOLD MASTER ADAPTER COMPLETE ==="
);

console.log(
  `Output: .\\${files.output.replaceAll("/", "\\")}`
);

console.log(
  `Projects: ${projects.length}`
);

console.log(
  `Research-normalized projects: ${researchNormalized.length}`
);

console.log(
  `Gold Master normalized projects: ${goldNormalized.length}`
);

console.log(
  `Gold Master adapter pending: ${stillPending.length}`
);

console.log(
  `Gold Master claims added: ${addedClaims}`
);

console.log(
  `Total claims: ${claims.length}`
);

console.log(
  `Gold Master sources added: ${addedSources}`
);

console.log(
  `Total sources: ${sources.length}`
);

console.log(
  `Conflicts preserved: ${conflicts.length}`
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
  "V1 normalized file modified: NO"
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