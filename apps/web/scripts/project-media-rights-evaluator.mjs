#!/usr/bin/env node

/*
 * Arknoz Project Media Engine
 * Stage 3B — Jurisdiction + Licence Rights Evaluator
 *
 * PURPOSE
 * -------
 * Evaluate the small selected Project media package against:
 *
 *   1. Arknoz jurisdiction policy
 *   2. file licence metadata
 *   3. subject type
 *   4. required downstream visual-content inspection
 *
 * IMPORTANT
 * ---------
 * This does NOT upload files.
 * This does NOT authorize publication.
 * This does NOT automatically approve technical drawings.
 *
 * Architectural photographs that pass jurisdiction + licence
 * metadata move to READY_FOR_VISUAL_RIGHTS_CHECK.
 *
 * Technical drawings remain RIGHTS_REVIEW until their underlying
 * work rights are independently resolved.
 */

import {
  readFileSync,
} from "node:fs";

import {
  dirname,
  join,
  resolve,
} from "node:path";

import {
  spawnSync,
} from "node:child_process";

import {
  fileURLToPath,
  pathToFileURL,
} from "node:url";


const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  dirname(__filename);

const REPO_ROOT =
  resolve(
    __dirname,
    "../../.."
  );

const POLICY_PATH =
  join(
    REPO_ROOT,
    "data",
    "arknoz-core",
    "media-jurisdiction-rights-policy-v1.json"
  );

const PACKAGE_SELECTOR =
  join(
    __dirname,
    "project-media-package-selector.mjs"
  );


function parseArgs(argv) {
  const result = {
    query: "",
    country: "",
    perSearch: 12,
  };

  for (
    let i = 2;
    i < argv.length;
    i += 1
  ) {
    const arg =
      argv[i];

    if (arg === "--query") {
      result.query =
        String(
          argv[i + 1] || ""
        ).trim();

      i += 1;
      continue;
    }

    if (arg === "--country") {
      result.country =
        String(
          argv[i + 1] || ""
        )
          .trim()
          .toUpperCase();

      i += 1;
      continue;
    }

    if (arg === "--per-search") {
      const value =
        Number(
          argv[i + 1]
        );

      if (
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 30
      ) {
        result.perSearch =
          value;
      }

      i += 1;
    }
  }

  return result;
}


function runPackageSelector(
  query,
  perSearch
) {
  const child =
    spawnSync(
      process.execPath,
      [
        PACKAGE_SELECTOR,
        "--query",
        query,
        "--per-search",
        String(perSearch),
      ],
      {
        encoding: "utf8",
        maxBuffer:
          50 * 1024 * 1024,
      }
    );

  if (child.error) {
    throw child.error;
  }

  if (child.status !== 0) {
    throw new Error(
      child.stderr ||
      `Package selector exited with ${child.status}`
    );
  }

  if (!child.stdout.trim()) {
    throw new Error(
      "Package selector returned empty output."
    );
  }

  return JSON.parse(
    child.stdout
  );
}


function readPolicy() {
  const text =
    readFileSync(
      POLICY_PATH,
      "utf8"
    );

  return JSON.parse(
    text
  );
}


function normalizeLicenseFamily(
  licenseName
) {
  const value =
    String(
      licenseName || ""
    )
      .trim()
      .toUpperCase();

  if (
    value === "CC0" ||
    value.startsWith("CC0 ")
  ) {
    return "CC0";
  }

  if (
    value.includes(
      "PUBLIC DOMAIN"
    )
  ) {
    return "PUBLIC_DOMAIN";
  }

  if (
    value.startsWith(
      "CC BY-SA"
    )
  ) {
    return "CC_BY_SA";
  }

  if (
    value.startsWith(
      "CC BY"
    )
  ) {
    return "CC_BY";
  }

  return "UNKNOWN";
}


function subjectPolicyKey(
  item
) {
  const route =
    item.rights_route;

  if (
    route ===
      "TECHNICAL_DRAWING_REVIEW"
  ) {
    return "building_drawing_or_plan";
  }

  if (
    route ===
      "SEPARATE_ARTWORK_REVIEW"
  ) {
    return "interior_artwork";
  }

  if (
    route ===
      "ARCHITECTURAL_PHOTOGRAPH"
  ) {
    return "building_photograph";
  }

  return null;
}


function complianceRequirements(
  licensePolicy
) {
  const requirements = [];

  if (
    licensePolicy
      ?.attribution_required
  ) {
    requirements.push(
      "ATTRIBUTION"
    );
  }

  if (
    licensePolicy
      ?.license_link_required
  ) {
    requirements.push(
      "LICENSE_LINK"
    );
  }

  if (
    licensePolicy
      ?.change_notice_required_when_applicable
  ) {
    requirements.push(
      "CHANGE_NOTICE_WHEN_APPLICABLE"
    );
  }

  if (
    licensePolicy
      ?.share_alike_required_for_adaptations
  ) {
    requirements.push(
      "SHARE_ALIKE_FOR_ADAPTATIONS"
    );
  }

  return requirements;
}


function evaluateItem({
  item,
  policy,
  jurisdiction,
}) {
  const licenseFamily =
    normalizeLicenseFamily(
      item.license_name
    );

  const licensePolicy =
    policy.license_policy[
      licenseFamily
    ] ||
    policy.license_policy.UNKNOWN;

  const policyKey =
    subjectPolicyKey(
      item
    );

  const subjectRule =
    policyKey
      ? jurisdiction
          ?.rules
          ?.[policyKey]
      : null;

  const licensePass =
    licensePolicy
      ?.license_gate === "PASS" ||
    licensePolicy
      ?.license_gate ===
        "PASS_WITH_COMPLIANCE";

  const jurisdictionPass =
    subjectRule
      ?.jurisdiction_gate ===
        "PASS";

  const isArchitecturalPhoto =
    item.rights_route ===
      "ARCHITECTURAL_PHOTOGRAPH";

  const isTechnicalDrawing =
    item.rights_route ===
      "TECHNICAL_DRAWING_REVIEW";

  let state =
    "RIGHTS_REVIEW";

  let nextGate =
    "HUMAN_RIGHTS_REVIEW";

  let reason =
    "Media requires additional rights review.";

  /*
   * Architectural photographs:
   * jurisdiction + licence metadata may pass,
   * but visual content must still be inspected.
   */

  if (
    isArchitecturalPhoto &&
    licensePass &&
    jurisdictionPass
  ) {
    state =
      "READY_FOR_VISUAL_RIGHTS_CHECK";

    nextGate =
      "VISUAL_CONTENT_CHECK";

    reason =
      "Jurisdiction and file-licence metadata gates passed; visual inspection is still required for separate artworks or other materially depicted protected content.";
  }

  /*
   * Technical drawings deliberately remain review-required.
   */

  if (isTechnicalDrawing) {
    state =
      "RIGHTS_REVIEW";

    nextGate =
      "UNDERLYING_DRAWING_RIGHTS_REVIEW";

    reason =
      "Technical drawing selected successfully, but reproduction rights in the underlying architectural drawing must be resolved separately.";
  }

  /*
   * Unknown or rejected licence metadata fails closed.
   */

  if (!licensePass) {
    state =
      "RIGHTS_REVIEW";

    nextGate =
      "LICENSE_REVIEW";

    reason =
      "File licence is not accepted automatically by the Arknoz licence policy.";
  }

  /*
   * Unknown jurisdiction policy also fails closed.
   */

  if (
    isArchitecturalPhoto &&
    !jurisdictionPass
  ) {
    state =
      "RIGHTS_REVIEW";

    nextGate =
      "JURISDICTION_REVIEW";

    reason =
      "Arknoz does not have an automatic PASS rule for this subject in the selected jurisdiction.";
  }

  return {
    slot:
      item.slot,

    commons_page_title:
      item.commons_page_title,

    subject_class:
      item.subject_class,

    rights_route:
      item.rights_route,

    policy_key:
      policyKey,

    jurisdiction_gate:
      subjectRule
        ?.jurisdiction_gate ||
      "UNCONFIGURED",

    license_name:
      item.license_name,

    license_family:
      licenseFamily,

    license_gate:
      licensePolicy
        ?.license_gate ||
      "RIGHTS_REVIEW",

    compliance_requirements:
      complianceRequirements(
        licensePolicy
      ),

    creator:
      item.creator,

    source_page:
      item.source_page,

    original_url:
      item.original_url,

    state,

    next_gate:
      nextGate,

    reason,

    visual_content_check_required:
      state ===
      "READY_FOR_VISUAL_RIGHTS_CHECK",

    storage_authorized:
      false,

    publication_authorized:
      false,

    database_write_authorized:
      false,
  };
}


async function main() {
  const args =
    parseArgs(
      process.argv
    );

  if (
    !args.query ||
    !args.country
  ) {
    console.error(
      'Usage: node project-media-rights-evaluator.mjs --query "Sydney Opera House" --country AU [--per-search 12]'
    );

    process.exitCode = 2;
    return;
  }

  const policy =
    readPolicy();

  const jurisdiction =
    policy.jurisdictions[
      args.country
    ];

  const selectedPackage =
    runPackageSelector(
      args.query,
      args.perSearch
    );

  const items =
    selectedPackage
      .media_package
      .selected || [];

  const evaluated =
    items.map(
      (item) =>
        evaluateItem({
          item,
          policy,
          jurisdiction,
        })
    );

  const counts = {
    READY_FOR_VISUAL_RIGHTS_CHECK:
      evaluated.filter(
        (item) =>
          item.state ===
          "READY_FOR_VISUAL_RIGHTS_CHECK"
      ).length,

    RIGHTS_REVIEW:
      evaluated.filter(
        (item) =>
          item.state ===
          "RIGHTS_REVIEW"
      ).length,

    HOLD:
      evaluated.filter(
        (item) =>
          item.state ===
          "HOLD"
      ).length,
  };

  const output = {
    schema:
      "arknoz.project-media-rights-evaluator.v1",

    mode:
      "RIGHTS_METADATA_EVALUATION_ONLY",

    project:
      args.query,

    country_code:
      args.country,

    jurisdiction_configured:
      Boolean(
        jurisdiction?.configured
      ),

    selected_media_count:
      items.length,

    counts,

    items:
      evaluated,

    all_media_rights_ready:
      evaluated.every(
        (item) =>
          item.state ===
          "RIGHTS_READY"
      ),

    visual_rights_check_required:
      evaluated.some(
        (item) =>
          item.visual_content_check_required
      ),

    technical_rights_review_required:
      evaluated.some(
        (item) =>
          item.next_gate ===
          "UNDERLYING_DRAWING_RIGHTS_REVIEW"
      ),

    storage_authorized:
      false,

    database_write_authorized:
      false,

    publication_authorized:
      false,
  };

  process.stdout.write(
    JSON.stringify(
      output,
      null,
      2
    ) + "\n"
  );
}


const isMain =
  Boolean(
    process.argv[1]
  ) &&
  import.meta.url ===
    pathToFileURL(
      process.argv[1]
    ).href;

if (isMain) {
  main().catch(
    (error) => {
      console.error(
        `[Arknoz Media Rights Evaluator] FAIL: ${error.message}`
      );

      process.exitCode = 1;
    }
  );
}