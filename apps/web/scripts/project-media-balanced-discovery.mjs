#!/usr/bin/env node

/*
 * Arknoz Project Media Engine
 * Stage 2C — Balanced Project Media Discovery
 *
 * PURPOSE
 * -------
 * Run multiple targeted Wikimedia Commons searches for one Project,
 * merge and deduplicate results, classify subject type, and report
 * the media balance available for the Project.
 *
 * Searches:
 *   GENERAL
 *   INTERIOR
 *   INTERIOR_SPACE
 *   DETAIL
 *   AERIAL_CONTEXT
 *   PLAN
 *   SECTION
 *
 * IMPORTANT
 * ---------
 * Discovery only.
 * No R2 upload.
 * No Supabase write.
 * No publication approval.
 */

import {
  spawnSync,
} from "node:child_process";

import {
  dirname,
  join,
} from "node:path";

import {
  fileURLToPath,
  pathToFileURL,
} from "node:url";

import {
  buildProjectMediaQueries,
  classifyProjectMediaSubject,
  targetMediaBalance,
} from "./project-media-subject-classifier.mjs";


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
    perSearch: 12,
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

    if (arg === "--per-search") {
      const value =
        Number(argv[i + 1]);

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


function runStage1(
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
          30 * 1024 * 1024,
      }
    );

  if (child.error) {
    throw child.error;
  }

  if (child.status !== 0) {
    throw new Error(
      child.stderr ||
      `Stage 1 discovery exited with ${child.status}`
    );
  }

  if (!child.stdout.trim()) {
    throw new Error(
      `Stage 1 returned empty output for query: ${query}`
    );
  }

  return JSON.parse(
    child.stdout
  );
}


function dedupeKey(candidate) {
  return (
    candidate.commons_page_title ||
    candidate.source_page ||
    candidate.original_url ||
    ""
  )
    .trim()
    .toLowerCase();
}


function subjectCounts(candidates) {
  const counts = {};

  for (const item of candidates) {
    const key =
      item.subject?.subject_class ||
      "UNKNOWN";

    counts[key] =
      (counts[key] || 0) + 1;
  }

  return counts;
}


function balanceStatus(
  candidates,
  target
) {
  const counts =
    subjectCounts(candidates);

  const exterior =
    counts.EXTERIOR_ARCHITECTURE || 0;

  const interior =
    counts.INTERIOR_ARCHITECTURE || 0;

  const detail =
    counts.DETAIL_MATERIAL || 0;

  const aerial =
    counts.AERIAL_CONTEXT || 0;

  const drawings =
    (counts.PLAN || 0) +
    (counts.SECTION || 0) +
    (counts.ELEVATION || 0) +
    (counts.DRAWING || 0);

  return {
    exterior: {
      found: exterior,
      target:
        target.EXTERIOR_ARCHITECTURE,
      target_met:
        exterior >=
        target.EXTERIOR_ARCHITECTURE,
    },

    interior: {
      found: interior,
      target:
        target.INTERIOR_ARCHITECTURE,
      target_met:
        interior >=
        target.INTERIOR_ARCHITECTURE,
    },

    detail: {
      found: detail,
      target:
        target.DETAIL_MATERIAL,
      target_met:
        detail >=
        target.DETAIL_MATERIAL,
    },

    aerial_context: {
      found: aerial,
      target:
        target.AERIAL_CONTEXT,
      target_met:
        aerial >=
        target.AERIAL_CONTEXT,
    },

    technical_drawing: {
      found: drawings,
      target:
        target.TECHNICAL_DRAWING,
      target_met:
        drawings >=
        target.TECHNICAL_DRAWING,
    },
  };
}


function rankCandidate(candidate) {
  let score = 0;

  const subject =
    candidate.subject || {};

  if (
    subject.confidence === "HIGH"
  ) {
    score += 3;
  }
  else if (
    subject.confidence === "MEDIUM"
  ) {
    score += 2;
  }

  if (
    candidate.rights_gate !== "HOLD"
  ) {
    score += 3;
  }

  if (
    candidate.width >= 1800 &&
    candidate.height >= 1000
  ) {
    score += 2;
  }

  if (
    candidate.creator
  ) {
    score += 1;
  }

  if (
    candidate.license_name &&
    candidate.license_url
  ) {
    score += 1;
  }

  score +=
    Number(
      candidate.project_match_score || 0
    );

  return Number(
    score.toFixed(3)
  );
}


async function main() {
  const args =
    parseArgs(process.argv);

  if (!args.query) {
    console.error(
      'Usage: node project-media-balanced-discovery.mjs --query "Sydney Opera House" [--per-search 12]'
    );

    process.exitCode = 2;
    return;
  }

  const searches =
    buildProjectMediaQueries(
      args.query
    );

  const merged =
    new Map();

  const searchSummary =
    [];

  for (const search of searches) {
    const result =
      runStage1(
        search.query,
        args.perSearch
      );

    searchSummary.push({
      purpose:
        search.purpose,

      query:
        search.query,

      returned:
        result.candidate_count,
    });

    for (
      const candidate
      of result.candidates
    ) {
      const key =
        dedupeKey(candidate);

      if (!key) {
        continue;
      }

      const existing =
        merged.get(key);

      if (!existing) {
        merged.set(
          key,
          {
            ...candidate,

            discovered_by: [
              search.purpose,
            ],
          }
        );

        continue;
      }

      if (
        !existing.discovered_by.includes(
          search.purpose
        )
      ) {
        existing.discovered_by.push(
          search.purpose
        );
      }

      if (
        Number(candidate.project_match_score) >
        Number(existing.project_match_score)
      ) {
        existing.project_match_score =
          candidate.project_match_score;
      }
    }
  }

  const candidates =
    [...merged.values()]
      .map((candidate) => {
        const subject =
          classifyProjectMediaSubject(
            candidate
          );

        return {
          ...candidate,

          subject,

          balanced_rank:
            rankCandidate({
              ...candidate,
              subject,
            }),
        };
      })
      .sort((a, b) => {
        return (
          b.balanced_rank -
          a.balanced_rank
        );
      });

  const target =
    targetMediaBalance();

  const balance =
    balanceStatus(
      candidates,
      target
    );

  const output = {
    schema:
      "arknoz.project-media-balanced-discovery.v1",

    mode:
      "DISCOVERY_ONLY",

    project:
      args.query,

    searches:
      searchSummary,

    total_searches:
      searches.length,

    total_raw_results:
      searchSummary.reduce(
        (sum, item) =>
          sum + item.returned,
        0
      ),

    unique_candidates:
      candidates.length,

    subject_counts:
      subjectCounts(candidates),

    target_media_balance:
      target,

    balance_status:
      balance,

    publication_authorized:
      false,

    storage_authorized:
      false,

    database_write_authorized:
      false,

    candidates,
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
  Boolean(process.argv[1]) &&
  import.meta.url ===
    pathToFileURL(process.argv[1]).href;

if (isMain) {
  main().catch(
    (error) => {
      console.error(
        `[Arknoz Balanced Media Discovery] FAIL: ${error.message}`
      );

      process.exitCode = 1;
    }
  );
}