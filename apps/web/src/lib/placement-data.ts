import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  resolvePlacementAssignment,
  resolvePlacementEntityRef,
  validateActivePlacementAssignments,
  type PlacementAssignment,
  type PlacementEntityRef,
} from "@/lib/placement-resolver";

type PlacementRegistry = {
  assignments: PlacementAssignment[];
};

function findPlacementAssignmentsFile() {
  let current =
    process.cwd();

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
        "placement-assignments-v1.json"
      );

    if (
      fs.existsSync(
        candidate
      )
    ) {
      return candidate;
    }

    const parent =
      path.dirname(
        current
      );

    if (
      parent === current
    ) {
      break;
    }

    current =
      parent;
  }

  throw new Error(
    "Arknoz placement assignments registry could not be located."
  );
}

const assignmentsPath =
  findPlacementAssignmentsFile();

const assignmentsRegistry =
  JSON.parse(
    fs.readFileSync(
      assignmentsPath,
      "utf8"
    )
  ) as PlacementRegistry;

const assignments =
  assignmentsRegistry.assignments;

const validationErrors =
  validateActivePlacementAssignments(
    assignments
  );

if (
  validationErrors.length >
  0
) {
  throw new Error(
    `Invalid Arknoz placement assignments: ${validationErrors.join(
      "; "
    )}`
  );
}

export function getPlacementAssignments() {
  return assignments;
}

export function getActivePlacementAssignment(
  slotId: string,
  context?: string | null
) {
  return resolvePlacementAssignment(
    assignments,
    slotId,
    context
  );
}

export function getActivePlacementEntityRef(
  slotId: string,
  context?: string | null
): PlacementEntityRef | null {
  return resolvePlacementEntityRef(
    assignments,
    slotId,
    context
  );
}

export function getActivePlacementsForContext(
  context?: string | null
) {
  const normalized =
    (context ?? "global")
      .trim()
      .toLowerCase();

  return assignments.filter(
    (assignment) =>
      assignment.status ===
        "active" &&
      assignment.context_key
        .trim()
        .toLowerCase() ===
        normalized
  );
}
