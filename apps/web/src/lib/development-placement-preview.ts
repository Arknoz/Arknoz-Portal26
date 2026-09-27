import "server-only";

import fs from "node:fs";
import path from "node:path";

import type { EntityRecord } from "@/lib/entities";
import { findGeography } from "@/lib/geography";
import { getPlacementAssignments } from "@/lib/placement-data";

type CandidateEntity = {
  slug?: unknown;
  title?: unknown;
  geography_label?: unknown;
  geography_slug?: unknown;
  project_parent?: unknown;
  intended_content_status?: unknown;
  intended_verification_status?: unknown;
};

type CandidateRecord = {
  entity?: CandidateEntity;
};

type CandidatePackage = {
  rules?: {
    entity_publication_is_not_authorized?: unknown;
    media_publication_is_not_authorized?: unknown;
  };
  records?: CandidateRecord[];
};

type DevelopmentAssignment = {
  assignment_id?: string;
  slot_id?: string;
  context_key?: string;
  status?: string;
  placement_type?: string;
  replaceable?: boolean;
  paid_lock?: boolean;
  entity_ref?: {
    type?: string;
    slug?: string;
  };
};

function text(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

function normalize(
  value?: string | null
) {
  return (
    value ??
    "global"
  )
    .trim()
    .toLowerCase();
}

function findRepoDataFile(
  ...parts: string[]
) {
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
        ...parts
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
    `Arknoz development source file not found: ${parts.join(
      "/"
    )}`
  );
}

function getCandidatePackage() {
  const sourcePath =
    findRepoDataFile(
      "gold-master-v1",
      "records",
      "projects-m18-import-v3.json"
    );

  const parsed =
    JSON.parse(
      fs.readFileSync(/*turbopackIgnore: true*/
        sourcePath,
        "utf8"
      ).replace(
        /^\uFEFF/,
        ""
      )
    ) as CandidatePackage;

  if (
    parsed.rules
      ?.entity_publication_is_not_authorized !==
      true ||
    parsed.rules
      ?.media_publication_is_not_authorized !==
      true
  ) {
    throw new Error(
      "Development candidate source lost its publication safeguards."
    );
  }

  return parsed;
}

function getCanonicalGeographySlug(
  sourcePath: string
) {
  const leaf =
    sourcePath
      .split("/")
      .map((value) =>
        value.trim()
      )
      .filter(Boolean)
      .at(-1);

  if (
    !leaf ||
    !findGeography(
      leaf
    )
  ) {
    return undefined;
  }

  return leaf;
}

function getDevelopmentProjectCandidate(
  slug: string
): EntityRecord | null {
  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    return null;
  }

  const candidatePackage =
    getCandidatePackage();

  const record =
    candidatePackage.records?.find(
      (item) =>
        text(
          item.entity?.slug
        ) === slug
    );

  if (
    !record?.entity
  ) {
    return null;
  }

  if (
    text(
      record.entity
        .intended_content_status
    ) !== "draft" ||
    text(
      record.entity
        .intended_verification_status
    ) !== "unverified"
  ) {
    return null;
  }

  const title =
    text(
      record.entity.title
    );

  const geography =
    text(
      record.entity
        .geography_label
    );

  const geographySlug =
    getCanonicalGeographySlug(
      text(
        record.entity
          .geography_slug
      )
    );

  const category =
    text(
      record.entity
        .project_parent
    ) ||
    "Projects";

  if (
    !title ||
    !geography
  ) {
    return null;
  }

  return {
    slug,
    type: "project",
    title,
    subtitle:
      "Project Candidate",
    geography,
    geographySlug,
    summary:
      "Development-only Arknoz project candidate. Draft and not publicly published.",
    trust:
      "Candidate · Unverified",

    project: {
      category,

      media: [
        {
          src:
            `/preview/media/${slug}`,
          alt:
            `${title} project image`,
          role:
            "hero",
          rightsStatus:
            "candidate",
          provenanceStatus:
            "source_identified",
        },
      ],
    },
  };
}

export function getDevelopmentPlacementEntity(
  slotId: string,
  context?: string | null
): EntityRecord | null {
  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    return null;
  }

  const normalizedSlot =
    slotId
      .trim()
      .toUpperCase();

  const normalizedContext =
    normalize(
      context
    );

  const assignments =
    getPlacementAssignments() as
      DevelopmentAssignment[];

  const matches =
    assignments.filter(
      (assignment) =>
        assignment.slot_id
          ?.trim()
          .toUpperCase() ===
          normalizedSlot &&
        normalize(
          assignment.context_key
        ) ===
          normalizedContext &&
        assignment.status ===
          "draft" &&
        assignment.placement_type ===
          "editorial" &&
        assignment.replaceable ===
          true &&
        assignment.paid_lock ===
          false
    );

  if (
    matches.length >
    1
  ) {
    throw new Error(
      `Multiple development placement candidates found for ${normalizedSlot}::${normalizedContext}`
    );
  }

  const assignment =
    matches[0];

  if (
    !assignment ||
    assignment.entity_ref
      ?.type !== "project"
  ) {
    return null;
  }

  const slug =
    text(
      assignment.entity_ref
        .slug
    );

  if (!slug) {
    return null;
  }

  return getDevelopmentProjectCandidate(
    slug
  );
}
