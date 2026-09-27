import {
  type ArknozShowcaseType,
} from "@/lib/universal-showcase";

export type ShowcaseEntityRef = {
  type: string;
  slug: string;
};

export type ShowcaseAssignmentStatus =
  | "draft"
  | "active"
  | "disabled";

export type ShowcaseAssignment = {
  assignment_id: string;
  showcase_key: string;
  showcase_type: ArknozShowcaseType;
  entity_ref: ShowcaseEntityRef;
  status: ShowcaseAssignmentStatus;
  position?: number;
  starts_at?: string;
  ends_at?: string;
};

function isWithinWindow(
  assignment: ShowcaseAssignment,
  now = new Date()
) {
  if (
    assignment.starts_at &&
    new Date(assignment.starts_at) > now
  ) {
    return false;
  }

  if (
    assignment.ends_at &&
    new Date(assignment.ends_at) <= now
  ) {
    return false;
  }

  return true;
}

export function resolveShowcaseAssignments(
  assignments: readonly ShowcaseAssignment[],
  showcaseKey: string,
  type: ArknozShowcaseType,
  limit = 9
) {
  const normalizedKey =
    showcaseKey.trim().toLowerCase();

  return assignments
    .filter(
      (assignment) =>
        assignment.status === "active" &&
        assignment.showcase_type === type &&
        assignment.showcase_key
          .trim()
          .toLowerCase() === normalizedKey &&
        isWithinWindow(assignment)
    )
    .sort(
      (a, b) =>
        (a.position ?? 999) -
        (b.position ?? 999)
    )
    .slice(0, limit);
}

export function validateShowcaseAssignments(
  assignments: readonly ShowcaseAssignment[]
) {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const assignment of assignments) {
    if (assignment.status !== "active") {
      continue;
    }

    const key = [
      assignment.showcase_key
        .trim()
        .toLowerCase(),
      assignment.showcase_type,
      assignment.entity_ref.type,
      assignment.entity_ref.slug,
    ].join("::");

    if (seen.has(key)) {
      errors.push(
        `Duplicate active showcase assignment: ${key}`
      );
      continue;
    }

    seen.add(key);
  }

  return errors;
}
