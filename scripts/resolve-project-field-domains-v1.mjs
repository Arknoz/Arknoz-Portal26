import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const inputPath =
  "data/project-360/batch-01-core-normalized-candidates-v2.json";

const extensionPath =
  "data/arknoz-core/project-entity-extension-v1.json";

const outputPath =
  "data/project-360/batch-01-field-domain-resolution-candidates-v1.json";

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

const data =
  readJson(inputPath);

const extension =
  readJson(extensionPath);

const claims =
  Array.isArray(data.claims)
    ? data.claims
    : [];

const allowedDomains =
  new Set(
    Array.isArray(extension.claim_domains)
      ? extension.claim_domains
      : []
  );

if (claims.length !== 191) {
  fail(
    `expected 191 claims, got ${claims.length}`
  );
}

if (allowedDomains.size !== 16) {
  fail(
    `expected 16 Project claim domains, got ${allowedDomains.size}`
  );
}

/*
  Resolver philosophy:
  - Exact/safe semantic matches are AUTO_HIGH.
  - Broader but still useful deterministic matches are AUTO_MEDIUM.
  - Ambiguous fields remain REVIEW_REQUIRED.
  - This file is only a mapping candidate layer.
*/

const exact = new Map([
  ["identity", "IDENTITY"],
  ["location", "LOCATION"],
  ["project_type", "TYPOLOGY"],

  ["architect", "TEAM"],
  ["lead_designer", "TEAM"],
  ["client_owner", "TEAM"],
  ["owner_operator", "TEAM"],
  ["professional_team", "TEAM"],
  ["design_team", "TEAM"],
  ["design_collaborators", "TEAM"],
  ["project_lead", "TEAM"],
  ["original_architect", "TEAM"],
  ["conversion_architect", "TEAM"],
  ["adaptive_reuse_architect", "TEAM"],
  ["adaptive_reuse_client", "TEAM"],

  ["construction_started", "DATES"],
  ["opened_year", "DATES"],
  ["opening", "DATES"],
  ["opening_date", "DATES"],
  ["museum_opening", "DATES"],
  ["revenue_service_opened", "DATES"],
  ["first_section_opened", "DATES"],
  ["original_completion", "DATES"],
  ["original_commissioning", "DATES"],
  ["csp_complex_operational_since", "DATES"],

  ["world_heritage_criterion", "HERITAGE"],
  ["world_heritage_inscription_year", "HERITAGE"],
]);

const rules = [
  {
    domain: "MATERIALS",
    regex: /(material|materials)/i,
    reason: "material terminology",
  },
  {
    domain: "SUSTAINABILITY",
    regex: /(sustainab|climate|ecology|environmental|flood)/i,
    reason: "environmental / sustainability terminology",
  },
  {
    domain: "TEAM",
    regex: /(architect|designer|client|owner|operator|team|collaborator)/i,
    reason: "participant / professional-team terminology",
  },
  {
    domain: "DATES",
    regex: /(date|dates|opened|opening|completion|commission|chronology|started|operational_since)/i,
    reason: "date / chronology terminology",
  },
  {
    domain: "DIMENSIONS",
    regex: /(area|length|span|dimensions|geometry|scale|station_count)/i,
    reason: "size / quantity / geometry terminology",
  },
  {
    domain: "ENGINEERING",
    regex: /(structural|engineering|bridge_sections|artificial_island)/i,
    reason: "engineering / structural terminology",
  },
  {
    domain: "SYSTEMS",
    regex: /(system|technology|ventilation|grid_services|mechanical_service)/i,
    reason: "technical systems terminology",
  },
  {
    domain: "CONSTRUCTION",
    regex: /(construction|construction_methodology)/i,
    reason: "construction terminology",
  },
  {
    domain: "IMPACT",
    regex: /(impact|urban_social_role|community_participation)/i,
    reason: "social / urban impact terminology",
  },
  {
    domain: "HISTORY",
    regex: /(original_history)/i,
    reason: "historical terminology",
  },
  {
    domain: "TYPOLOGY",
    regex: /(project_type|bridge_type)/i,
    reason: "project typology terminology",
  },
  {
    domain: "DESIGN",
    regex: /(design|programme|public_realm|object_strategy|urban_strategy|workplace)/i,
    reason: "design / programme terminology",
  },
  {
    domain: "OPERATION",
    regex: /(passenger_capacity|generation_capacity|battery_power_capacity|battery_energy_capacity|total_capacity|route|connections|transport_configuration)/i,
    reason: "operational / capacity terminology",
  },
];

function resolveField(fieldKey) {

  if (exact.has(fieldKey)) {
    return {
      proposed_domain:
        exact.get(fieldKey),

      resolution_state:
        "AUTO_HIGH",

      reason:
        "exact deterministic mapping",
    };
  }

  const matches =
    rules.filter(
      (rule) =>
        rule.regex.test(fieldKey)
    );

  const domains =
    [
      ...new Set(
        matches.map(
          (item) => item.domain
        )
      ),
    ];

  if (domains.length === 1) {
    return {
      proposed_domain:
        domains[0],

      resolution_state:
        "AUTO_MEDIUM",

      reason:
        matches[0].reason,
    };
  }

  if (domains.length > 1) {
    return {
      proposed_domain:
        null,

      resolution_state:
        "REVIEW_REQUIRED",

      reason:
        `multiple possible domains: ${domains.join(", ")}`,
    };
  }

  return {
    proposed_domain:
      null,

    resolution_state:
      "REVIEW_REQUIRED",

    reason:
      "no deterministic domain rule",
  };
}

const grouped =
  new Map();

for (const claim of claims) {

  const fieldKey =
    String(
      claim.field_key ?? ""
    ).trim();

  if (!fieldKey) {
    fail(
      `claim ${claim.claim_id} has blank field_key`
    );
  }

  if (!grouped.has(fieldKey)) {
    grouped.set(
      fieldKey,
      {
        field_key:
          fieldKey,

        observed_count:
          0,

        sample_values:
          [],
      }
    );
  }

  const entry =
    grouped.get(fieldKey);

  entry.observed_count++;

  if (
    entry.sample_values.length < 3
  ) {
    entry.sample_values.push(
      claim.value
    );
  }
}

const mappings =
  [];

for (
  const entry of
  [...grouped.values()]
    .sort(
      (a, b) =>
        a.field_key.localeCompare(
          b.field_key
        )
    )
) {

  const resolved =
    resolveField(
      entry.field_key
    );

  if (
    resolved.proposed_domain &&
    !allowedDomains.has(
      resolved.proposed_domain
    )
  ) {
    fail(
      `resolver proposed invalid domain ${resolved.proposed_domain}`
    );
  }

  mappings.push({
    field_key:
      entry.field_key,

    observed_count:
      entry.observed_count,

    proposed_domain:
      resolved.proposed_domain,

    resolution_state:
      resolved.resolution_state,

    reason:
      resolved.reason,

    sample_values:
      entry.sample_values,

    reviewed:
      false,

    canonical_authorized:
      false,
  });
}

if (mappings.length !== 117) {
  fail(
    `expected 117 distinct field keys, got ${mappings.length}`
  );
}

const high =
  mappings.filter(
    (item) =>
      item.resolution_state ===
      "AUTO_HIGH"
  );

const medium =
  mappings.filter(
    (item) =>
      item.resolution_state ===
      "AUTO_MEDIUM"
  );

const review =
  mappings.filter(
    (item) =>
      item.resolution_state ===
      "REVIEW_REQUIRED"
  );

const domainSummary =
  [];

for (const domain of allowedDomains) {

  const matching =
    mappings.filter(
      (item) =>
        item.proposed_domain ===
        domain
    );

  domainSummary.push({
    domain,
    field_key_count:
      matching.length,

    claim_count:
      matching.reduce(
        (sum, item) =>
          sum + item.observed_count,
        0
      ),
  });
}

const output = {
  standard:
    "ARKNOZ_PROJECT_FIELD_DOMAIN_RESOLUTION_CANDIDATES_V1",

  purpose:
    "Deterministic candidate mapping of Project claim field keys into the frozen Arknoz Project claim domains.",

  source:
    inputPath,

  rules: [
    "This is a candidate mapping layer only.",
    "AUTO_HIGH indicates an explicit deterministic field mapping.",
    "AUTO_MEDIUM indicates one unambiguous deterministic terminology rule.",
    "REVIEW_REQUIRED is preserved when classification is ambiguous or no safe rule exists.",
    "No claim value is changed.",
    "No verification state is changed.",
    "No canonical or publication authorization is granted.",
  ],

  summary: {
    claims_examined:
      claims.length,

    distinct_field_keys:
      mappings.length,

    auto_high:
      high.length,

    auto_medium:
      medium.length,

    review_required:
      review.length,

    canonical_authorized:
      0,
  },

  domain_summary:
    domainSummary,

  mappings,
};

const outFull =
  path.join(
    root,
    outputPath
  );

if (fs.existsSync(outFull)) {
  fail(
    `output already exists: ${outputPath}`
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
  "=== FIELD DOMAIN RESOLUTION COMPLETE ==="
);

console.log(
  `Output: .\\${outputPath.replaceAll("/", "\\")}`
);

console.log(
  `Claims examined: ${claims.length}`
);

console.log(
  `Distinct field keys: ${mappings.length}`
);

console.log(
  `AUTO_HIGH: ${high.length}`
);

console.log(
  `AUTO_MEDIUM: ${medium.length}`
);

console.log(
  `REVIEW_REQUIRED: ${review.length}`
);

console.log("");
console.log(
  "=== REVIEW REQUIRED FIELDS ==="
);

for (const item of review) {
  console.log(
    `${item.field_key} · count ${item.observed_count} · ${item.reason}`
  );
}

console.log("");
console.log(
  "Canonical changed: NO"
);

console.log(
  "Claims changed: NO"
);

console.log(
  "V2 changed: NO"
);

console.log(
  "Public UI changed: NO"
);

console.log(
  "Supabase changed: NO"
);