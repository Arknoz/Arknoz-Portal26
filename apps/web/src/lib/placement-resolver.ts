export type PlacementEntityRef = {
  type: string;
  slug: string;
};

export type PlacementAssignmentStatus =
  | "draft"
  | "active"
  | "disabled";

export type PlacementAssignmentMode =
  | "curated"
  | "auto";

export type PlacementAssignment = {
  assignment_id: string;
  slot_id: string;
  context_key: string;
  entity_ref: PlacementEntityRef;
  mode: PlacementAssignmentMode;
  status: PlacementAssignmentStatus;
};

export function normalizePlacementContext(
  context?: string | null
) {
  const value =
    context
      ?.trim()
      .toLowerCase();

  return value || "global";
}

export function normalizePlacementSlotId(
  slotId: string
) {
  return slotId
    .trim()
    .toUpperCase();
}

export function getPlacementAssignmentKey(
  slotId: string,
  context?: string | null
) {
  return `${normalizePlacementSlotId(
    slotId
  )}::${normalizePlacementContext(
    context
  )}`;
}

export function resolvePlacementAssignment(
  assignments: readonly PlacementAssignment[],
  slotId: string,
  context?: string | null
): PlacementAssignment | null {
  const wantedKey =
    getPlacementAssignmentKey(
      slotId,
      context
    );

  const matches =
    assignments.filter(
      (assignment) =>
        assignment.status === "active" &&
        getPlacementAssignmentKey(
          assignment.slot_id,
          assignment.context_key
        ) === wantedKey
    );

  if (matches.length > 1) {
    throw new Error(
      `Multiple active Arknoz placement assignments for ${wantedKey}.`
    );
  }

  return matches[0] ?? null;
}

export function resolvePlacementEntityRef(
  assignments: readonly PlacementAssignment[],
  slotId: string,
  context?: string | null
): PlacementEntityRef | null {
  return (
    resolvePlacementAssignment(
      assignments,
      slotId,
      context
    )?.entity_ref ??
    null
  );
}

export function validateActivePlacementAssignments(
  assignments: readonly PlacementAssignment[]
) {
  const seen =
    new Set<string>();

  const errors:
    string[] = [];

  for (const assignment of assignments) {
    if (
      assignment.status !==
      "active"
    ) {
      continue;
    }

    const key =
      getPlacementAssignmentKey(
        assignment.slot_id,
        assignment.context_key
      );

    if (seen.has(key)) {
      errors.push(
        `Duplicate active placement: ${key}`
      );
      continue;
    }

    seen.add(key);
  }

  return errors;
}
