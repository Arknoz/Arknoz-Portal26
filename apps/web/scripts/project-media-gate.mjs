#!/usr/bin/env node

/*
 * Arknoz Project Media Engine
 * Stage 2 — deterministic candidate gate
 *
 * INPUT:
 *   Project title
 *
 * PROCESS:
 *   1. Runs Stage-1 Commons discovery.
 *   2. Checks identity/relevance signals.
 *   3. Checks technical image suitability.
 *   4. Checks provenance + licence metadata completeness.
 *   5. Separates:
 *        MEDIA_READY_METADATA
 *        RIGHTS_REVIEW
 *        HOLD
 *
 * IMPORTANT:
 * - No R2 upload.
 * - No Supabase write.
 * - No publication approval.
 * - CC licence metadata alone does not resolve architectural
 *   copyright / freedom-of-panorama questions.
 */

import {
  spawnSync,
} from "node:child_process";

import {
  fileURLToPath,
} from "node:url";

import {
  dirname,
  join,
} from "node:path";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  dirname(__filename);

const DISCOVERY_SCRIPT =
  join(
    __dirname,
    "project-media-discovery.mjs"
  );

function parseArgs(argv) {
  const result = {
    query: "",
    limit: 20,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg =
      argv[i];

    if (arg === "--query") {
      result.query =
        String(argv[i + 1] || "").trim();

      i += 1;
      continue;
    }

    if (arg === "--limit") {
      const value =
        Number(argv[i + 1]);

      if (
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 50
      ) {
        result.limit = value;
      }

      i += 1;
    }
  }

  return result;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulTokens(value) {
  return normalizeText(value)
    .split(" ")
    .filter(
      (token) =>
        token.length >= 3 &&
        ![
          "the",
          "and",
          "with",
          "from",
          "view",
          "photo",
          "image",
          "file",
        ].includes(token)
    );
}

function exactProjectCoverage(
  query,
  title,
  description
) {
  const wanted =
    meaningfulTokens(query);

  if (wanted.length === 0) {
    return 0;
  }

  const haystack =
    new Set(
      meaningfulTokens(
        `${title} ${description}`
      )
    );

  const matched =
    wanted.filter(
      (token) =>
        haystack.has(token)
    ).length;

  return Number(
    (matched / wanted.length).toFixed(3)
  );
}

function technicalGate(candidate) {
  const allowedMime =
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ]);

  const width =
    Number(candidate.width) || 0;

  const height =
    Number(candidate.height) || 0;

  const longest =
    Math.max(width, height);

  const shortest =
    Math.min(width, height);

  const reasons = [];

  if (
    !allowedMime.has(candidate.mime)
  ) {
    reasons.push(
      `unsupported MIME: ${candidate.mime || "missing"}`
    );
  }

  if (longest < 1600) {
    reasons.push(
      "longest dimension below 1600px"
    );
  }

  if (
    candidate.mime !== "image/svg+xml" &&
    shortest < 900
  ) {
    reasons.push(
      "shortest dimension below 900px"
    );
  }

  return {
    pass:
      reasons.length === 0,

    reasons,
  };
}

function provenanceGate(candidate) {
  const reasons = [];

  if (!candidate.source_page) {
    reasons.push(
      "missing source page"
    );
  }

  if (!candidate.original_url) {
    reasons.push(
      "missing original URL"
    );
  }

  if (!candidate.creator) {
    reasons.push(
      "missing creator / attribution identity"
    );
  }

  if (!candidate.license_name) {
    reasons.push(
      "missing licence name"
    );
  }

  if (!candidate.license_url) {
    reasons.push(
      "missing licence URL"
    );
  }

  if (
    candidate.provenance_status !==
    "source_identified"
  ) {
    reasons.push(
      "source provenance not identified"
    );
  }

  return {
    pass:
      reasons.length === 0,

    reasons,
  };
}

function restrictionGate(candidate) {
  const raw =
    String(
      candidate.restrictions || ""
    ).trim();

  if (!raw) {
    return {
      pass: true,
      reasons: [],
    };
  }

  const normalized =
    normalizeText(raw);

  if (
    normalized === "none" ||
    normalized === "no known restrictions"
  ) {
    return {
      pass: true,
      reasons: [],
    };
  }

  return {
    pass: false,
    reasons: [
      `Commons restrictions metadata present: ${raw}`,
    ],
  };
}

function rightsGate(candidate) {
  if (
    candidate.rights_gate === "HOLD"
  ) {
    return {
      state: "HOLD",
      reason:
        "Licence family is not accepted by Stage 1.",
    };
  }

  if (
    candidate.rights_gate ===
    "AUTO_SAFE_METADATA"
  ) {
    return {
      state:
        "MEDIA_READY_METADATA",

      reason:
        "Public Domain / CC0 metadata passed automated licence classification.",
    };
  }

  if (
    candidate.rights_gate ===
    "LICENSED_REVIEW"
  ) {
    return {
      state:
        "RIGHTS_REVIEW",

      reason:
        "Free licence metadata is present, but architectural/FOP and licence-compliance review remains required.",
    };
  }

  return {
    state: "HOLD",
    reason:
      "Unknown rights-gate result.",
  };
}

function classifyCandidate(
  candidate,
  query
) {
  const projectCoverage =
    exactProjectCoverage(
      query,
      candidate.commons_page_title,
      candidate.description
    );

  const technical =
    technicalGate(candidate);

  const provenance =
    provenanceGate(candidate);

  const restriction =
    restrictionGate(candidate);

  const rights =
    rightsGate(candidate);

  const holdReasons = [];

  if (projectCoverage < 0.67) {
    holdReasons.push(
      `project token coverage too low: ${projectCoverage}`
    );
  }

  if (!technical.pass) {
    holdReasons.push(
      ...technical.reasons
    );
  }

  if (!provenance.pass) {
    holdReasons.push(
      ...provenance.reasons
    );
  }

  if (!restriction.pass) {
    holdReasons.push(
      ...restriction.reasons
    );
  }

  if (rights.state === "HOLD") {
    holdReasons.push(
      rights.reason
    );
  }

  let gateState;

  if (holdReasons.length > 0) {
    gateState =
      "HOLD";
  }
  else if (
    rights.state ===
    "RIGHTS_REVIEW"
  ) {
    gateState =
      "RIGHTS_REVIEW";
  }
  else {
    gateState =
      "MEDIA_READY_METADATA";
  }

  return {
    ...candidate,

    deterministic_gate: {
      state:
        gateState,

      project_token_coverage:
        projectCoverage,

      technical_pass:
        technical.pass,

      provenance_pass:
        provenance.pass,

      restrictions_pass:
        restriction.pass,

      rights_state:
        rights.state,

      rights_reason:
        rights.reason,

      hold_reasons:
        holdReasons,
    },

    publication_approved:
      false,

    public_storage_authorized:
      false,

    database_publication_authorized:
      false,
  };
}

function runDiscovery(
  query,
  limit
) {
  const child =
    spawnSync(
      process.execPath,
      [
        DISCOVERY_SCRIPT,
        "--query",
        query,
        "--limit",
        String(limit),
      ],
      {
        encoding: "utf8",
        maxBuffer:
          20 * 1024 * 1024,
      }
    );

  if (child.error) {
    throw child.error;
  }

  if (child.status !== 0) {
    throw new Error(
      child.stderr ||
      `Discovery exited with ${child.status}`
    );
  }

  if (!child.stdout.trim()) {
    throw new Error(
      "Discovery returned empty output."
    );
  }

  return JSON.parse(
    child.stdout
  );
}

async function main() {
  const args =
    parseArgs(process.argv);

  if (!args.query) {
    console.error(
      'Usage: node project-media-gate.mjs --query "Sydney Opera House" [--limit 20]'
    );

    process.exitCode = 2;
    return;
  }

  const discovery =
    runDiscovery(
      args.query,
      args.limit
    );

  const candidates =
    discovery.candidates.map(
      (candidate) =>
        classifyCandidate(
          candidate,
          args.query
        )
    );

  const result = {
    schema:
      "arknoz.project-media-gate.v1",

    mode:
      "DETERMINISTIC_GATE_ONLY",

    query:
      args.query,

    candidate_count:
      candidates.length,

    media_ready_metadata:
      candidates.filter(
        (candidate) =>
          candidate.deterministic_gate.state ===
          "MEDIA_READY_METADATA"
      ).length,

    rights_review:
      candidates.filter(
        (candidate) =>
          candidate.deterministic_gate.state ===
          "RIGHTS_REVIEW"
      ).length,

    hold:
      candidates.filter(
        (candidate) =>
          candidate.deterministic_gate.state ===
          "HOLD"
      ).length,

    storage_authorized:
      false,

    publication_authorized:
      false,

    database_write_authorized:
      false,

    candidates,
  };

  process.stdout.write(
    JSON.stringify(
      result,
      null,
      2
    ) + "\n"
  );
}

main().catch(
  (error) => {
    console.error(
      `[Arknoz Project Media Gate] FAIL: ${error.message}`
    );

    process.exitCode = 1;
  }
);