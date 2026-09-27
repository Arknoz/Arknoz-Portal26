import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  buildShowcaseKey,
  type ArknozShowcaseContext,
  type ArknozShowcaseType,
} from "@/lib/universal-showcase";

import {
  resolveShowcaseAssignments,
  validateShowcaseAssignments,
  type ShowcaseAssignment,
} from "@/lib/showcase-resolver";

type ShowcaseRegistry = {
  assignments: ShowcaseAssignment[];
};

function findShowcaseAssignmentsFile() {
  let current = process.cwd();

  for (
    let depth = 0;
    depth < 6;
    depth += 1
  ) {
    const candidate =
      path.join(
        current,
        "data",
        "arknoz-core",
        "showcase-assignments-v1.json"
      );

    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent =
      path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  throw new Error(
    "Arknoz showcase assignments registry could not be located."
  );
}

const assignmentsPath =
  findShowcaseAssignmentsFile();

const raw =
  fs
    .readFileSync(
      assignmentsPath,
      "utf8"
    )
    .replace(/^\uFEFF/, "");

const registry =
  JSON.parse(raw) as ShowcaseRegistry;

const assignments =
  registry.assignments ?? [];

const validationErrors =
  validateShowcaseAssignments(
    assignments
  );

if (validationErrors.length > 0) {
  throw new Error(
    `Invalid Arknoz showcase assignments: ${validationErrors.join(
      "; "
    )}`
  );
}

export function getShowcaseAssignments() {
  return assignments;
}

export function getAssignedShowcaseItems(
  type: ArknozShowcaseType,
  context: ArknozShowcaseContext,
  limit = 9
) {
  const showcaseKey =
    buildShowcaseKey(
      type,
      context
    );

  return resolveShowcaseAssignments(
    assignments,
    showcaseKey,
    type,
    limit
  );
}
