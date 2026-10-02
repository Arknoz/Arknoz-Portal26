import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const root = process.cwd();

const inputPath = process.argv[2]
  ? resolve(root, process.argv[2])
  : resolve(
      root,
      "data",
      "gold-master-v1",
      "records",
      "projects-m18-import-v3.json"
    );

const standardPath = resolve(
  root,
  "data",
  "gold-master-v1",
  "standards",
  "project-research-standard-v1.json"
);

const reportPath = resolve(
  root,
  "data",
  "gold-master-v1",
  "reports",
  "project-standard-v1-report.json"
);

function cleanJson(text) {
  return JSON.parse(text.replace(/^\uFEFF/, ""));
}

function text(value) {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value.map(text).filter(Boolean).join(", ");
  }

  return String(value).trim();
}

function norm(value) {
  return text(value)
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function validHttpUrl(value) {
  try {
    const url = new URL(text(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function buildFactIndex(facts) {
  const index = new Map();

  for (const fact of facts) {
    const label = norm(fact?.label);
    const value = text(fact?.value);

    if (!label || !value) continue;

    if (!index.has(label)) {
      index.set(label, []);
    }

    index.get(label).push(value);
  }

  return index;
}

function hasAnyFact(index, labels = []) {
  return labels.some((label) => index.has(norm(label)));
}

function findDuplicates(items, keyFn) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    const key = keyFn(item);

    if (!key) continue;

    if (seen.has(key)) {
      duplicates.add(key);
    } else {
      seen.add(key);
    }
  }

  return [...duplicates];
}

function chooseProfile(standard, entity) {
  const haystack = norm(
    [
      entity?.project_parent,
      entity?.title,
      entity?.geography_label
    ]
      .filter(Boolean)
      .join(" ")
  );

  for (const profile of standard.type_profiles ?? []) {
    if (
      (profile.match ?? []).some((term) =>
        haystack.includes(norm(term))
      )
    ) {
      return profile;
    }
  }

  return null;
}

const [standardRaw, packageRaw] = await Promise.all([
  readFile(standardPath, "utf8"),
  readFile(inputPath, "utf8")
]);

const standard = cleanJson(standardRaw);
const candidatePackage = cleanJson(packageRaw);

const records = Array.isArray(candidatePackage.records)
  ? candidatePackage.records
  : [];

if (records.length === 0) {
  throw new Error("No project records found in candidate package.");
}

const results = [];

for (const record of records) {
  const entity = record?.entity ?? {};
  const facts = Array.isArray(record?.facts)
    ? record.facts
    : [];
  const sources = Array.isArray(record?.sources)
    ? record.sources
    : [];

  const factIndex = buildFactIndex(facts);

  const errors = [];
  const warnings = [];
  const notes = [];

  const missingIdentity = [];

  for (const field of standard.identity_required ?? []) {
    if (!text(entity[field])) {
      missingIdentity.push(field);
      errors.push(`Missing identity field: ${field}`);
    }
  }

  const badFacts = facts
    .map((fact, index) => ({
      index,
      label: text(fact?.label),
      value: text(fact?.value)
    }))
    .filter((fact) => !fact.label || !fact.value);

  for (const fact of badFacts) {
    errors.push(
      `Fact ${fact.index + 1} has blank label or value`
    );
  }

  const duplicateFacts = findDuplicates(
    facts,
    (fact) =>
      `${norm(fact?.label)}::${norm(text(fact?.value))}`
  );

  for (const duplicate of duplicateFacts) {
    warnings.push(`Duplicate fact: ${duplicate}`);
  }

  const badSources = sources
    .map((source, index) => ({
      index,
      label: text(source?.label),
      url: text(source?.url)
    }))
    .filter(
      (source) =>
        !source.label ||
        !source.url ||
        !validHttpUrl(source.url)
    );

  for (const source of badSources) {
    errors.push(
      `Source ${source.index + 1} has invalid label or URL`
    );
  }

  const duplicateSourceUrls = findDuplicates(
    sources,
    (source) => norm(source?.url)
  );

  for (const duplicate of duplicateSourceUrls) {
    warnings.push(`Duplicate source URL: ${duplicate}`);
  }

  const primaryTypes = new Set(
    (standard.source_quality?.primary_source_types ?? [])
      .map(norm)
  );

  const primarySources = sources.filter((source) =>
    primaryTypes.has(norm(source?.source_type))
  );

  const independentSources = sources.filter(
    (source) => source?.independent === true
  );

  const minSources =
    standard.source_quality?.minimum_research_sources ?? 2;

  if (sources.length < minSources) {
    warnings.push(
      `Only ${sources.length} source(s); research target is ${minSources}+`
    );
  }

  if (
    standard.source_quality?.prefer_primary_source &&
    primarySources.length === 0
  ) {
    warnings.push("No primary / official source recorded");
  }

  if (
    standard.source_quality?.prefer_independent_source &&
    independentSources.length === 0
  ) {
    warnings.push("No independent supporting source recorded");
  }

  const universalTargets = (
    standard.universal_targets ?? []
  ).map((target) => ({
    key: target.key,
    label: target.label,
    present: hasAnyFact(
      factIndex,
      target.labels ?? []
    )
  }));

  const missingUniversal = universalTargets
    .filter((target) => !target.present)
    .map((target) => target.label);

  const profile = chooseProfile(standard, entity);

  const typeTargets = (profile?.targets ?? []).map(
    (target) => ({
      label: target.label,
      present: hasAnyFact(
        factIndex,
        target.labels ?? []
      )
    })
  );

  const missingTypeSpecific = typeTargets
    .filter((target) => !target.present)
    .map((target) => target.label);

  if (missingUniversal.length > 0) {
    notes.push(
      `Universal research gaps: ${missingUniversal.join(", ")}`
    );
  }

  if (profile && missingTypeSpecific.length > 0) {
    notes.push(
      `${profile.key} research suggestions: ` +
        missingTypeSpecific.join(", ")
    );
  }

  const structurePass = errors.length === 0;

  const strongSourceBase =
    sources.length >= minSources &&
    primarySources.length >= 1;

  const substantiveUniversalCount =
    universalTargets.filter((item) => item.present).length;

  let researchStatus;

  if (!structurePass) {
    researchStatus = "HOLD_STRUCTURE";
  } else if (!strongSourceBase) {
    researchStatus = "NEEDS_SOURCE_ENRICHMENT";
  } else if (substantiveUniversalCount < 3) {
    researchStatus = "NEEDS_FACT_ENRICHMENT";
  } else {
    researchStatus = "READY_FOR_RESEARCH_REVIEW";
  }

  results.push({
    slug: text(entity.slug),
    title: text(entity.title),

    project_parent: text(entity.project_parent),

    structure: structurePass
      ? "PASS"
      : "HOLD",

    research_status: researchStatus,

    identity: {
      missing: missingIdentity
    },

    facts: {
      count: facts.length,
      universal_targets: universalTargets,
      missing_universal: missingUniversal,
      type_profile: profile?.key ?? null,
      type_targets: typeTargets,
      missing_type_specific: missingTypeSpecific,
      duplicate_facts: duplicateFacts
    },

    sources: {
      count: sources.length,
      primary_count: primarySources.length,
      independent_count: independentSources.length,
      duplicate_urls: duplicateSourceUrls
    },

    errors,
    warnings,
    notes,

    publication_note:
      "This validator measures research readiness only. " +
      "It does not authorize public publication."
  });
}

const report = {
  schema: "arknoz.project-standard-report.v1",
  generated_at: new Date().toISOString(),
  input: inputPath,
  standard: standard.schema,
  record_count: results.length,
  results
};

await mkdir(dirname(reportPath), { recursive: true });

await writeFile(
  reportPath,
  JSON.stringify(report, null, 2) + "\n",
  "utf8"
);

console.log("");
console.log("=== ARKNOZ PROJECT STANDARD V1 ===");
console.log("");

console.table(
  results.map((result) => ({
    Project: result.title || result.slug,
    Structure: result.structure,
    Facts: result.facts.count,
    Sources: result.sources.count,
    Primary: result.sources.primary_count,
    Independent: result.sources.independent_count,
    Research: result.research_status
  }))
);

for (const result of results) {
  console.log("");
  console.log(`--- ${result.title || result.slug} ---`);

  if (result.errors.length) {
    console.log("ERRORS:");
    for (const item of result.errors) {
      console.log(`  - ${item}`);
    }
  }

  if (result.warnings.length) {
    console.log("WARNINGS:");
    for (const item of result.warnings) {
      console.log(`  - ${item}`);
    }
  }

  if (result.notes.length) {
    console.log("RESEARCH GAPS:");
    for (const item of result.notes) {
      console.log(`  - ${item}`);
    }
  }

  if (
    !result.errors.length &&
    !result.warnings.length &&
    !result.notes.length
  ) {
    console.log("No research gaps detected by V1 rules.");
  }
}

console.log("");
console.log(`Report: ${reportPath}`);
console.log("");
