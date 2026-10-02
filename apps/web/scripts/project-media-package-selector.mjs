#!/usr/bin/env node

/*
 * Arknoz Project Media Engine
 * Stage 2D — Balanced Media Package Selector
 *
 * GOAL
 * ----
 * Convert a large discovery pool into the small, balanced media
 * package Arknoz actually wants for a Project.
 *
 * Default target:
 *   1 hero
 *   2 exterior
 *   2 interior
 *   1 detail/material
 *   1 aerial/context
 *   2 technical drawings
 *
 * IMPORTANT
 * ---------
 * Selection is NOT rights approval.
 * Selection is NOT storage authorization.
 * Selection is NOT publication authorization.
 *
 * No R2.
 * No Supabase.
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


const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  dirname(__filename);

const BALANCED_DISCOVERY =
  join(
    __dirname,
    "project-media-balanced-discovery.mjs"
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


function runBalancedDiscovery(
  query,
  perSearch
) {
  const child =
    spawnSync(
      process.execPath,
      [
        BALANCED_DISCOVERY,
        "--query",
        query,
        "--per-search",
        String(perSearch),
      ],
      {
        encoding: "utf8",
        maxBuffer:
          40 * 1024 * 1024,
      }
    );

  if (child.error) {
    throw child.error;
  }

  if (child.status !== 0) {
    throw new Error(
      child.stderr ||
      `Balanced discovery exited with ${child.status}`
    );
  }

  if (!child.stdout.trim()) {
    throw new Error(
      "Balanced discovery returned empty output."
    );
  }

  return JSON.parse(
    child.stdout
  );
}


function candidateKey(candidate) {
  return (
    candidate.commons_page_title ||
    candidate.source_page ||
    candidate.original_url ||
    ""
  )
    .trim()
    .toLowerCase();
}


function usable(candidate) {
  if (!candidate) {
    return false;
  }

  const baseReady =
    candidate.rights_gate !== "HOLD" &&
    candidate.original_url &&
    candidate.source_page &&
    candidate.license_name &&
    candidate.creator;

  if (!baseReady) {
    return false;
  }

  const width =
    Number(candidate.width || 0);

  const height =
    Number(candidate.height || 0);

  const subjectClass =
    candidate.subject?.subject_class;

  const technicalClasses =
    new Set([
      "PLAN",
      "SECTION",
      "ELEVATION",
      "DRAWING",
    ]);

  if (
    technicalClasses.has(
      subjectClass
    )
  ) {
    const longSide =
      Math.max(
        width,
        height
      );

    const shortSide =
      Math.min(
        width,
        height
      );

    return (
      longSide >= 1400 &&
      shortSide >= 800
    );
  }

  /*
   * Keep the proven photographic threshold unchanged.
   */
  return (
    width >= 1600 &&
    height >= 900
  );
}


function sortCandidates(candidates) {
  return [...candidates]
    .sort(
      (a, b) =>
        Number(b.balanced_rank || 0) -
        Number(a.balanced_rank || 0)
    );
}


function chooseFromClass({
  candidates,
  classes,
  count,
  selectedKeys,
}) {
  const selected = [];

  const pool =
    sortCandidates(
      candidates.filter(
        (candidate) =>
          usable(candidate) &&
          classes.includes(
            candidate.subject?.subject_class
          ) &&
          !selectedKeys.has(
            candidateKey(candidate)
          )
      )
    );

  for (const candidate of pool) {
    if (
      selected.length >= count
    ) {
      break;
    }

    const key =
      candidateKey(candidate);

    selectedKeys.add(key);
    selected.push(candidate);
  }

  return selected;
}


function chooseHero(
  candidates,
  selectedKeys
) {
  /*
   * Hero should preferably be explicit exterior architecture.
   *
   * We do not use INTERIOR, ARTWORK_DOMINANT or technical drawings
   * as automatic hero fallback.
   */

  const explicit =
    chooseFromClass({
      candidates,
      classes: [
        "EXTERIOR_ARCHITECTURE",
      ],
      count: 1,
      selectedKeys,
    });

  if (explicit.length === 1) {
    return explicit;
  }

  /*
   * Safe fallback:
   * generic architectural candidate discovered through GENERAL.
   */

  const fallback =
    sortCandidates(
      candidates.filter(
        (candidate) =>
          usable(candidate) &&
          candidate.subject?.subject_class ===
            "ARCHITECTURE_UNSPECIFIED" &&
          Array.isArray(
            candidate.discovered_by
          ) &&
          candidate.discovered_by.includes(
            "GENERAL"
          ) &&
          !selectedKeys.has(
            candidateKey(candidate)
          )
      )
    );

  if (fallback.length === 0) {
    return [];
  }

  const chosen =
    fallback[0];

  selectedKeys.add(
    candidateKey(chosen)
  );

  return [chosen];
}


function compactCandidate(
  candidate,
  slot
) {
  return {
    slot,

    commons_page_title:
      candidate.commons_page_title,

    subject_class:
      candidate.subject?.subject_class,

    subject_confidence:
      candidate.subject?.confidence,

    rights_route:
      candidate.subject?.rights_route,

    license_name:
      candidate.license_name,

    license_url:
      candidate.license_url,

    creator:
      candidate.creator,

    attribution_required:
      candidate.attribution_required,

    source_page:
      candidate.source_page,

    original_url:
      candidate.original_url,

    preview_url:
      candidate.preview_url,

    width:
      candidate.width,

    height:
      candidate.height,

    mime:
      candidate.mime,

    rights_gate:
      candidate.rights_gate,

    balanced_rank:
      candidate.balanced_rank,

    discovered_by:
      candidate.discovered_by,

    publication_approved:
      false,

    public_storage_authorized:
      false,

    database_publication_authorized:
      false,
  };
}


function buildPackage(
  discovery
) {
  const candidates =
    discovery.candidates || [];

  const selectedKeys =
    new Set();

  const slots = [];


  /*
   * HERO
   */

  const hero =
    chooseHero(
      candidates,
      selectedKeys
    );

  if (hero[0]) {
    slots.push(
      compactCandidate(
        hero[0],
        "HERO"
      )
    );
  }


  /*
   * EXTERIOR
   */

  const exterior =
    chooseFromClass({
      candidates,
      classes: [
        "EXTERIOR_ARCHITECTURE",
      ],
      count: 2,
      selectedKeys,
    });

  exterior.forEach(
    (candidate, index) => {
      slots.push(
        compactCandidate(
          candidate,
          `EXTERIOR_${index + 1}`
        )
      );
    }
  );


  /*
   * INTERIOR
   */

  const interior =
    chooseFromClass({
      candidates,
      classes: [
        "INTERIOR_ARCHITECTURE",
      ],
      count: 2,
      selectedKeys,
    });

  interior.forEach(
    (candidate, index) => {
      slots.push(
        compactCandidate(
          candidate,
          `INTERIOR_${index + 1}`
        )
      );
    }
  );


  /*
   * DETAIL
   */

  const detail =
    chooseFromClass({
      candidates,
      classes: [
        "DETAIL_MATERIAL",
      ],
      count: 1,
      selectedKeys,
    });

  if (detail[0]) {
    slots.push(
      compactCandidate(
        detail[0],
        "DETAIL_1"
      )
    );
  }


  /*
   * AERIAL / CONTEXT
   */

  const aerial =
    chooseFromClass({
      candidates,
      classes: [
        "AERIAL_CONTEXT",
      ],
      count: 1,
      selectedKeys,
    });

  if (aerial[0]) {
    slots.push(
      compactCandidate(
        aerial[0],
        "AERIAL_CONTEXT_1"
      )
    );
  }


  /*
   * TECHNICAL DRAWINGS
   */

  const drawings =
    chooseFromClass({
      candidates,
      classes: [
        "PLAN",
        "SECTION",
        "ELEVATION",
        "DRAWING",
      ],
      count: 2,
      selectedKeys,
    });

  drawings.forEach(
    (candidate, index) => {
      slots.push(
        compactCandidate(
          candidate,
          `TECHNICAL_DRAWING_${index + 1}`
        )
      );
    }
  );


  const target = {
    HERO: 1,
    EXTERIOR: 2,
    INTERIOR: 2,
    DETAIL: 1,
    AERIAL_CONTEXT: 1,
    TECHNICAL_DRAWING: 2,
  };


  const actual = {
    HERO:
      slots.filter(
        (item) =>
          item.slot === "HERO"
      ).length,

    EXTERIOR:
      slots.filter(
        (item) =>
          item.slot.startsWith(
            "EXTERIOR_"
          )
      ).length,

    INTERIOR:
      slots.filter(
        (item) =>
          item.slot.startsWith(
            "INTERIOR_"
          )
      ).length,

    DETAIL:
      slots.filter(
        (item) =>
          item.slot.startsWith(
            "DETAIL_"
          )
      ).length,

    AERIAL_CONTEXT:
      slots.filter(
        (item) =>
          item.slot.startsWith(
            "AERIAL_CONTEXT_"
          )
      ).length,

    TECHNICAL_DRAWING:
      slots.filter(
        (item) =>
          item.slot.startsWith(
            "TECHNICAL_DRAWING_"
          )
      ).length,
  };


  const gaps =
    Object.keys(target)
      .filter(
        (key) =>
          actual[key] <
          target[key]
      )
      .map(
        (key) => ({
          slot_family: key,
          target:
            target[key],
          selected:
            actual[key],
          missing:
            target[key] -
            actual[key],
        })
      );


  return {
    selected:
      slots,

    target,

    actual,

    gaps,

    target_count:
      Object.values(target)
        .reduce(
          (sum, value) =>
            sum + value,
          0
        ),

    selected_count:
      slots.length,

    complete:
      gaps.length === 0,
  };
}


async function main() {
  const args =
    parseArgs(process.argv);

  if (!args.query) {
    console.error(
      'Usage: node project-media-package-selector.mjs --query "Sydney Opera House" [--per-search 12]'
    );

    process.exitCode = 2;
    return;
  }

  const discovery =
    runBalancedDiscovery(
      args.query,
      args.perSearch
    );

  const mediaPackage =
    buildPackage(
      discovery
    );

  const output = {
    schema:
      "arknoz.project-media-package-selector.v1",

    mode:
      "SELECTION_ONLY",

    project:
      args.query,

    discovery_pool: {
      raw_results:
        discovery.total_raw_results,

      unique_candidates:
        discovery.unique_candidates,
    },

    media_package:
      mediaPackage,

    rights_evaluation_required:
      true,

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
  Boolean(process.argv[1]) &&
  import.meta.url ===
    pathToFileURL(
      process.argv[1]
    ).href;

if (isMain) {
  main().catch(
    (error) => {
      console.error(
        `[Arknoz Media Package Selector] FAIL: ${error.message}`
      );

      process.exitCode = 1;
    }
  );
}