import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const files = {
  automatic:
    "data/project-360/batch-01-field-domain-resolution-candidates-v1.json",

  reviewed:
    "data/project-360/batch-01-field-domain-reviewed-exceptions-v1.json",

  candidates:
    "data/project-360/batch-01-core-normalized-candidates-v2.json",

  extension:
    "data/arknoz-core/project-entity-extension-v1.json",

  output:
    "data/arknoz-core/project-field-domain-registry-v1.json",
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

const automatic =
  readJson(files.automatic);

const reviewed =
  readJson(files.reviewed);

const candidates =
  readJson(files.candidates);

const extension =
  readJson(files.extension);

const mappings =
  Array.isArray(automatic.mappings)
    ? automatic.mappings
    : [];

const claims =
  Array.isArray(candidates.claims)
    ? candidates.claims
    : [];

const allowedDomains =
  new Set(
    Array.isArray(extension.claim_domains)
      ? extension.claim_domains
      : []
  );

if (mappings.length !== 117) {
  fail(
    `expected 117 automatic mapping records, got ${mappings.length}`
  );
}

if (claims.length !== 191) {
  fail(
    `expected 191 claims, got ${claims.length}`
  );
}

if (allowedDomains.size !== 16) {
  fail(
    `expected 16 existing Project domains, got ${allowedDomains.size}`
  );
}

const fieldReviewed =
  Array.isArray(reviewed.field_level_resolutions)
    ? reviewed.field_level_resolutions
    : [];

const claimOverrides =
  Array.isArray(reviewed.claim_level_overrides)
    ? reviewed.claim_level_overrides
    : [];

const taxonomyGaps =
  Array.isArray(reviewed.taxonomy_gaps)
    ? reviewed.taxonomy_gaps
    : [];

if (fieldReviewed.length !== 25) {
  fail(
    `expected 25 reviewed field-level mappings, got ${fieldReviewed.length}`
  );
}

if (claimOverrides.length !== 6) {
  fail(
    `expected 6 claim-level overrides, got ${claimOverrides.length}`
  );
}

if (taxonomyGaps.length !== 1) {
  fail(
    `expected 1 taxonomy gap, got ${taxonomyGaps.length}`
  );
}

const automaticByField =
  new Map();

for (const item of mappings) {

  const fieldKey =
    String(item.field_key ?? "").trim();

  if (!fieldKey) {
    fail(
      "automatic mapping contains blank field_key"
    );
  }

  if (automaticByField.has(fieldKey)) {
    fail(
      `duplicate automatic field mapping: ${fieldKey}`
    );
  }

  automaticByField.set(
    fieldKey,
    item
  );
}

const reviewedByField =
  new Map();

for (const item of fieldReviewed) {

  const fieldKey =
    String(item.field_key ?? "").trim();

  const domain =
    String(item.reviewed_domain ?? "").trim();

  if (!automaticByField.has(fieldKey)) {
    fail(
      `reviewed field not found in automatic map: ${fieldKey}`
    );
  }

  const original =
    automaticByField.get(fieldKey);

  if (
    original.resolution_state !==
    "REVIEW_REQUIRED"
  ) {
    fail(
      `reviewed field was not originally REVIEW_REQUIRED: ${fieldKey}`
    );
  }

  if (!allowedDomains.has(domain)) {
    fail(
      `invalid reviewed domain ${domain} for ${fieldKey}`
    );
  }

  reviewedByField.set(
    fieldKey,
    domain
  );
}

const overridesByClaim =
  new Map();

const overrideFields =
  new Map();

for (const item of claimOverrides) {

  const claimId =
    String(item.claim_id ?? "").trim();

  const fieldKey =
    String(item.field_key ?? "").trim();

  const domain =
    String(item.domain ?? "").trim();

  if (!claimId || !fieldKey || !domain) {
    fail(
      "claim-level override missing claim_id, field_key or domain"
    );
  }

  if (!allowedDomains.has(domain)) {
    fail(
      `invalid claim override domain ${domain}`
    );
  }

  if (overridesByClaim.has(claimId)) {
    fail(
      `duplicate claim override: ${claimId}`
    );
  }

  overridesByClaim.set(
    claimId,
    {
      field_key:
        fieldKey,

      domain,

      reason:
        String(item.reason ?? "").trim() || null,
    }
  );

  if (!overrideFields.has(fieldKey)) {
    overrideFields.set(
      fieldKey,
      []
    );
  }

  overrideFields
    .get(fieldKey)
    .push(claimId);
}

const gapsByClaim =
  new Map();

const gapFields =
  new Map();

for (const item of taxonomyGaps) {

  const claimId =
    String(item.claim_id ?? "").trim();

  const fieldKey =
    String(item.field_key ?? "").trim();

  if (!claimId || !fieldKey) {
    fail(
      "taxonomy gap missing claim_id or field_key"
    );
  }

  gapsByClaim.set(
    claimId,
    item
  );

  if (!gapFields.has(fieldKey)) {
    gapFields.set(
      fieldKey,
      []
    );
  }

  gapFields
    .get(fieldKey)
    .push(claimId);
}

const registry =
  [];

for (
  const item of
  [...mappings].sort(
    (a, b) =>
      String(a.field_key).localeCompare(
        String(b.field_key)
      )
  )
) {

  const fieldKey =
    String(item.field_key);

  const state =
    String(item.resolution_state);

  if (
    state === "AUTO_HIGH" ||
    state === "AUTO_MEDIUM"
  ) {

    const domain =
      String(item.proposed_domain ?? "");

    if (!allowedDomains.has(domain)) {
      fail(
        `automatic field ${fieldKey} has invalid domain ${domain}`
      );
    }

    registry.push({
      field_key:
        fieldKey,

      observed_count:
        Number(item.observed_count),

      domain,

      registry_state:
        state,

      resolution_method:
        "DETERMINISTIC_FIELD_RULE",

      claim_override_ids:
        [],

      taxonomy_gap_claim_ids:
        [],

      reason:
        String(item.reason ?? "").trim() || null,
    });

    continue;
  }

  if (state !== "REVIEW_REQUIRED") {
    fail(
      `unexpected mapping state ${state} for ${fieldKey}`
    );
  }

  if (reviewedByField.has(fieldKey)) {

    registry.push({
      field_key:
        fieldKey,

      observed_count:
        Number(item.observed_count),

      domain:
        reviewedByField.get(fieldKey),

      registry_state:
        "HUMAN_REVIEWED",

      resolution_method:
        "FIELD_LEVEL_HUMAN_REVIEW",

      claim_override_ids:
        [],

      taxonomy_gap_claim_ids:
        [],

      reason:
        "Reviewed from actual claim context.",
    });

    continue;
  }

  if (overrideFields.has(fieldKey)) {

    registry.push({
      field_key:
        fieldKey,

      observed_count:
        Number(item.observed_count),

      domain:
        null,

      registry_state:
        "CLAIM_LEVEL_ONLY",

      resolution_method:
        "CLAIM_LEVEL_OVERRIDE_REQUIRED",

      claim_override_ids:
        overrideFields.get(fieldKey),

      taxonomy_gap_claim_ids:
        [],

      reason:
        "Legacy field contains heterogeneous semantics; no single field-level domain is safe.",
    });

    continue;
  }

  if (gapFields.has(fieldKey)) {

    registry.push({
      field_key:
        fieldKey,

      observed_count:
        Number(item.observed_count),

      domain:
        null,

      registry_state:
        "TAXONOMY_GAP",

      resolution_method:
        "TAXONOMY_REVIEW_REQUIRED",

      claim_override_ids:
        [],

      taxonomy_gap_claim_ids:
        gapFields.get(fieldKey),

      reason:
        String(
          taxonomyGaps.find(
            (gap) =>
              String(gap.field_key) ===
              fieldKey
          )?.reason ?? ""
        ).trim() || null,
    });

    continue;
  }

  fail(
    `review-required field is unaccounted: ${fieldKey}`
  );
}

if (registry.length !== 117) {
  fail(
    `expected 117 registry fields, got ${registry.length}`
  );
}

const counts = {
  auto_high:
    registry.filter(
      (item) =>
        item.registry_state ===
        "AUTO_HIGH"
    ).length,

  auto_medium:
    registry.filter(
      (item) =>
        item.registry_state ===
        "AUTO_MEDIUM"
    ).length,

  human_reviewed:
    registry.filter(
      (item) =>
        item.registry_state ===
        "HUMAN_REVIEWED"
    ).length,

  claim_level_only:
    registry.filter(
      (item) =>
        item.registry_state ===
        "CLAIM_LEVEL_ONLY"
    ).length,

  taxonomy_gap:
    registry.filter(
      (item) =>
        item.registry_state ===
        "TAXONOMY_GAP"
    ).length,
};

if (
  counts.auto_high !== 27 ||
  counts.auto_medium !== 62 ||
  counts.human_reviewed !== 25 ||
  counts.claim_level_only !== 2 ||
  counts.taxonomy_gap !== 1
) {
  fail(
    `unexpected registry-state counts: ${JSON.stringify(counts)}`
  );
}

const registryByField =
  new Map(
    registry.map(
      (item) =>
        [item.field_key, item]
    )
  );

let claimsResolved = 0;
let taxonomyGapClaims = 0;
let unaccountedClaims = 0;

const claimResolutionAudit =
  [];

for (const claim of claims) {

  const claimId =
    String(claim.claim_id);

  const fieldKey =
    String(claim.field_key);

  const fieldEntry =
    registryByField.get(fieldKey);

  if (!fieldEntry) {
    fail(
      `claim references field absent from registry: ${claimId}/${fieldKey}`
    );
  }

  let domain = null;
  let method = null;
  let status = null;

  if (fieldEntry.domain) {

    domain =
      fieldEntry.domain;

    method =
      fieldEntry.resolution_method;

    status =
      "RESOLVED";

    claimsResolved++;
  }
  else if (overridesByClaim.has(claimId)) {

    const override =
      overridesByClaim.get(claimId);

    if (
      override.field_key !==
      fieldKey
    ) {
      fail(
        `claim override field mismatch for ${claimId}`
      );
    }

    domain =
      override.domain;

    method =
      "CLAIM_LEVEL_OVERRIDE";

    status =
      "RESOLVED";

    claimsResolved++;
  }
  else if (gapsByClaim.has(claimId)) {

    method =
      "TAXONOMY_GAP";

    status =
      "TAXONOMY_REVIEW_REQUIRED";

    taxonomyGapClaims++;
  }
  else {

    status =
      "UNACCOUNTED";

    unaccountedClaims++;
  }

  claimResolutionAudit.push({
    claim_id:
      claimId,

    field_key:
      fieldKey,

    domain,

    resolution_method:
      method,

    resolution_status:
      status,
  });
}

if (claimsResolved !== 190) {
  fail(
    `expected 190 resolved claims, got ${claimsResolved}`
  );
}

if (taxonomyGapClaims !== 1) {
  fail(
    `expected 1 taxonomy-gap claim, got ${taxonomyGapClaims}`
  );
}

if (unaccountedClaims !== 0) {
  fail(
    `expected 0 unaccounted claims, got ${unaccountedClaims}`
  );
}

const domainSummary =
  [];

for (const domain of allowedDomains) {

  const resolvedClaims =
    claimResolutionAudit.filter(
      (item) =>
        item.domain === domain
    );

  const fieldKeys =
    new Set(
      resolvedClaims.map(
        (item) =>
          item.field_key
      )
    );

  domainSummary.push({
    domain,
    resolved_claims:
      resolvedClaims.length,

    distinct_field_keys:
      fieldKeys.size,
  });
}

const output = {
  standard:
    "ARKNOZ_PROJECT_FIELD_DOMAIN_REGISTRY_V1",

  scope:
    "PROJECT",

  inherits:
    "ARKNOZ_PROJECT_ENTITY_EXTENSION_V1",

  purpose:
    "Reusable Project claim-field classification registry combining deterministic mappings, reviewed field-level resolutions, claim-level semantic overrides and explicit taxonomy gaps.",

  rules: [
    "A field-level domain is used only when the field is semantically stable.",
    "CLAIM_LEVEL_ONLY fields must be resolved from claim context or an explicit reviewed override.",
    "TAXONOMY_GAP fields are never force-mapped.",
    "This registry classifies claims; it does not change claim values or verification states.",
    "No canonical or publication authorization is granted by this registry.",
  ],

  summary: {
    allowed_project_domains:
      allowedDomains.size,

    field_keys:
      registry.length,

    auto_high:
      counts.auto_high,

    auto_medium:
      counts.auto_medium,

    human_reviewed:
      counts.human_reviewed,

    claim_level_only_fields:
      counts.claim_level_only,

    taxonomy_gap_fields:
      counts.taxonomy_gap,

    claims_examined:
      claims.length,

    claims_resolved:
      claimsResolved,

    taxonomy_gap_claims:
      taxonomyGapClaims,

    unaccounted_claims:
      unaccountedClaims,

    canonical_authorized:
      0,

    publication_authorized:
      0,
  },

  fields:
    registry,

  claim_level_overrides:
    claimOverrides,

  taxonomy_gaps:
    taxonomyGaps,

  domain_summary:
    domainSummary,

  claim_resolution_audit:
    claimResolutionAudit,
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
  "=== FIELD-DOMAIN REGISTRY COMPLETE ==="
);

console.log(
  `Output: .\\${files.output.replaceAll("/", "\\")}`
);

console.log(
  `Field keys: ${registry.length}`
);

console.log(
  `AUTO_HIGH: ${counts.auto_high}`
);

console.log(
  `AUTO_MEDIUM: ${counts.auto_medium}`
);

console.log(
  `HUMAN_REVIEWED: ${counts.human_reviewed}`
);

console.log(
  `CLAIM_LEVEL_ONLY fields: ${counts.claim_level_only}`
);

console.log(
  `TAXONOMY_GAP fields: ${counts.taxonomy_gap}`
);

console.log(
  `Claims resolved: ${claimsResolved} / ${claims.length}`
);

console.log(
  `Taxonomy-gap claims: ${taxonomyGapClaims}`
);

console.log(
  `Unaccounted claims: ${unaccountedClaims}`
);

console.log(
  "16-domain Project taxonomy changed: NO"
);

console.log(
  "V2 claims changed: NO"
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