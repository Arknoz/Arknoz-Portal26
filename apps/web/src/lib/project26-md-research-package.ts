import {
  PROJECT26_MD_VERSION,
  validateProject26MD,
  type Project26MDProjectKind,
  type Project26MDRecord,
  type Project26MDValidationReport,
} from "@/lib/project26-md";


export const PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA =
  "arknoz-project26-md-research-v1" as const;


export const PROJECT26_MD_RESEARCH_PACKAGE_VERSION =
  "1.1.0" as const;


export type Project26MDResearchStatus =
  | "draft"
  | "reviewed";


export type Project26MDIntakeRoute =
  | "arknoz-curated"
  | "contributor-submitted";


export type Project26MDResearchPackage = {

  schema:
    typeof PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA;

  packageVersion:
    typeof PROJECT26_MD_RESEARCH_PACKAGE_VERSION;


  research: {

    intake: {

      route:
        Project26MDIntakeRoute;

      adminReviewCompleted:
        boolean;

      contributorManifestKey?:
        string;

      contributorDeclarationVerified?:
        boolean;
    };

    reviewStatus:
      Project26MDResearchStatus;

    evidenceReviewed:
      boolean;

    mediaRightsReviewed:
      boolean;

    collectionVisible?:
      boolean;

    preparedBy?:
      string;

    notes?:
      string[];
  };


  project: {

    identity:
      Project26MDRecord["identity"];

    classification:
      Project26MDRecord["classification"];

    claims:
      Project26MDRecord["claims"];

    sources:
      Project26MDRecord["evidence"]["sources"];

    media:
      Project26MDRecord["media"];

    documents:
      Project26MDRecord["documents"];
  };
};


export type Project26MDResearchPackageIssue = {

  code:
    string;

  message:
    string;
};


export type Project26MDResearchPackageReport = {

  schema:
    typeof PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA;

  packageVersion:
    typeof PROJECT26_MD_RESEARCH_PACKAGE_VERSION;

  slug:
    string;

  release:
    "READY" | "HOLD";

  ready:
    boolean;

  packageIssues:
    Project26MDResearchPackageIssue[];

  mdValidation:
    Project26MDValidationReport | null;

  record:
    Project26MDRecord | null;
};


/*
 * ================================================================
 * PROJECT 26 MD â€” RESEARCH BRIEF
 *
 * This tells any future researcher / research agent what depth
 * the MD system expects before a project can become READY.
 *
 * The validator remains the authority.
 * ================================================================
 */

const TYPE_FOCUS:
  Record<
    Project26MDProjectKind,
    string[]
  > = {

    building: [
      "site",
      "design",
      "structure",
      "materials",
      "systems",
    ],

    infrastructure: [
      "site",
      "design",
      "structure",
      "systems",
      "delivery",
    ],

    landscape: [
      "site",
      "design",
      "materials",
      "systems",
      "performance",
    ],

    urbanism: [
      "site",
      "programme",
      "design",
      "systems",
      "delivery",
    ],

    heritage: [
      "site",
      "design",
      "structure",
      "materials",
      "history",
    ],

    interior: [
      "programme",
      "design",
      "materials",
      "systems",
      "products",
    ],

    industrial: [
      "programme",
      "design",
      "structure",
      "systems",
      "performance",
    ],

    mixed: [
      "site",
      "design",
      "structure",
      "materials",
      "systems",
    ],
  };


export function getProject26MDResearchBrief(
  projectKind:
    Project26MDProjectKind
) {

  return {

    projectKind,

    intake: {
      allowedRoutes: [
        "arknoz-curated",
        "contributor-submitted",
      ],

      adminReviewRequired:
        true,

      contributorRouteRequiresDeclaration:
        true,
    },

    overview: {
      minimumClaims:
        6,

      minimumRoles:
        4,

      requiredRoles: [
        "project-type",
        "location",
      ],
    },

    record01: {
      minimumClaims:
        8,

      minimumPresentationGroups:
        4,
    },

    record02: {
      minimumClaims:
        12,

      minimumSections:
        5,

      projectTypeFocus:
        [
          ...TYPE_FOCUS[
            projectKind
          ],
        ],
    },

    evidence: {
      minimumSources:
        4,

      claimCoverage:
        "100%",
    },

    media: {
      minimumReusableItems:
        3,

      maximumReusableItems:
        18,

      rightsReviewRequired:
        true,
    },

    documents: {
      requiredArray:
        true,

      minimumItems:
        0,

      maximumItems:
        10,

      rule:
        "Do not fabricate documents. Empty is valid when no cleared documents exist.",
    },

    prohibited: [
      "invented facts",
      "unlinked factual claims",
      "project-specific UI logic",
      "label guessing",
      "automatic provenance promotion",
      "uncleared media",
    ],
  };
}


function duplicateIds(
  value: unknown
): string[] {

  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  const seen =
    new Set<string>();

  const duplicates =
    new Set<string>();


  for (
    const item
    of value
  ) {

    if (
      !item ||
      typeof item !== "object" ||
      !(
        "id" in
        item
      )
    ) {
      continue;
    }


    const id =
      (
        item as {
          id?: unknown;
        }
      ).id;


    if (
      typeof id !== "string" ||
      !id.trim()
    ) {
      continue;
    }


    if (
      seen.has(
        id
      )
    ) {

      duplicates.add(
        id
      );
    }


    seen.add(
      id
    );
  }


  return [
    ...duplicates,
  ];
}


/*
 * ================================================================
 * RESEARCH PACKAGE -> CANONICAL PROJECT 26 MD
 *
 * No AI generation occurs here.
 * No facts are inferred here.
 * No missing content is manufactured here.
 *
 * Research arrives explicitly and is assembled deterministically.
 * ================================================================
 */

export function ingestProject26MDResearchPackage(
  input: unknown
):
  Project26MDResearchPackageReport {

  const packageIssues:
    Project26MDResearchPackageIssue[] = [];


  const issue = (
    code:
      string,

    message:
      string
  ) => {

    packageIssues.push({
      code,
      message,
    });
  };


  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(
      input
    )
  ) {

    issue(
      "MD_PACKAGE_INVALID",
      "Research package must be an object."
    );


    return {

      schema:
        PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA,

      packageVersion:
        PROJECT26_MD_RESEARCH_PACKAGE_VERSION,

      slug:
        "(missing)",

      release:
        "HOLD",

      ready:
        false,

      packageIssues,

      mdValidation:
        null,

      record:
        null,
    };
  }


  const pkg =
    input as
      Partial<
        Project26MDResearchPackage
      >;


  if (
    pkg.schema !==
    PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA
  ) {

    issue(
      "MD_PACKAGE_SCHEMA_INVALID",
      `Package schema must be ${PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA}.`
    );
  }


  if (
    pkg.packageVersion !==
    PROJECT26_MD_RESEARCH_PACKAGE_VERSION
  ) {

    issue(
      "MD_PACKAGE_VERSION_INVALID",
      `Package version must be ${PROJECT26_MD_RESEARCH_PACKAGE_VERSION}.`
    );
  }


  const research =
    pkg.research;


  if (
    !research ||
    typeof research !==
      "object"
  ) {

    issue(
      "MD_RESEARCH_CONTROL_MISSING",
      "Research review controls are required."
    );
  }
  else {

    const intake =
      research.intake;

    if (
      !intake ||
      typeof intake !==
        "object"
    ) {
      issue(
        "MD_INTAKE_ROUTE_MISSING",
        "Project 26 intake route is required."
      );
    }
    else {

      if (
        intake.route !==
          "arknoz-curated" &&
        intake.route !==
          "contributor-submitted"
      ) {
        issue(
          "MD_INTAKE_ROUTE_INVALID",
          "Project 26 intake route must be arknoz-curated or contributor-submitted."
        );
      }

      if (
        intake.adminReviewCompleted !==
        true
      ) {
        issue(
          "MD_INTAKE_ADMIN_REVIEW_REQUIRED",
          "Admin review must be explicitly completed before Project 26 can become READY."
        );
      }

      if (
        intake.route ===
        "contributor-submitted"
      ) {

        if (
          typeof intake
            .contributorManifestKey !==
            "string" ||
          intake
            .contributorManifestKey
            .trim()
            .length === 0
        ) {
          issue(
            "MD_CONTRIBUTOR_MANIFEST_REQUIRED",
            "Contributor-submitted Project 26 intake requires a source contribution manifest reference."
          );
        }

        if (
          intake
            .contributorDeclarationVerified !==
          true
        ) {
          issue(
            "MD_CONTRIBUTOR_DECLARATION_REQUIRED",
            "Contributor-submitted Project 26 intake requires verified contributor declaration provenance."
          );
        }
      }
    }

    if (
      research.reviewStatus !==
      "reviewed"
    ) {

      issue(
        "MD_RESEARCH_NOT_REVIEWED",
        "Research package must be reviewed before READY."
      );
    }


    if (
      research.evidenceReviewed !==
      true
    ) {

      issue(
        "MD_EVIDENCE_REVIEW_REQUIRED",
        "Evidence review must be explicitly complete."
      );
    }


    if (
      research.mediaRightsReviewed !==
      true
    ) {

      issue(
        "MD_MEDIA_RIGHTS_REVIEW_REQUIRED",
        "Media rights review must be explicitly complete."
      );
    }
  }


  const project =
    pkg.project;


  if (
    !project ||
    typeof project !==
      "object"
  ) {

    issue(
      "MD_PACKAGE_PROJECT_MISSING",
      "Research package project payload is required."
    );


    return {

      schema:
        PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA,

      packageVersion:
        PROJECT26_MD_RESEARCH_PACKAGE_VERSION,

      slug:
        "(missing)",

      release:
        "HOLD",

      ready:
        false,

      packageIssues,

      mdValidation:
        null,

      record:
        null,
    };
  }


  const duplicateChecks = [

    {
      name:
        "claim",

      ids:
        duplicateIds(
          project.claims
        ),
    },

    {
      name:
        "source",

      ids:
        duplicateIds(
          project.sources
        ),
    },

    {
      name:
        "media",

      ids:
        duplicateIds(
          project.media
        ),
    },

    {
      name:
        "document",

      ids:
        duplicateIds(
          project.documents
        ),
    },
  ];


  for (
    const check
    of duplicateChecks
  ) {

    if (
      check.ids.length >
      0
    ) {

      issue(
        "MD_DUPLICATE_ID",
        `Duplicate ${check.name} IDs: ${check.ids.join(", ")}.`
      );
    }
  }


  /*
   * Direct deterministic assembly.
   */
  const record = {

    schemaVersion:
      PROJECT26_MD_VERSION,

    identity:
      project.identity,

    classification:
      project.classification,

    claims:
      project.claims,

    evidence: {
      sources:
        project.sources,
    },

    media:
      project.media,

    documents:
      project.documents,
  } as Project26MDRecord;


  const mdValidation =
    validateProject26MD(
      record
    );


  const ready =
    packageIssues.length ===
      0 &&
    mdValidation.ready;


  return {

    schema:
      PROJECT26_MD_RESEARCH_PACKAGE_SCHEMA,

    packageVersion:
      PROJECT26_MD_RESEARCH_PACKAGE_VERSION,

    slug:
      record
        .identity
        ?.slug ??
      "(missing)",

    release:
      ready
        ? "READY"
        : "HOLD",

    ready,

    packageIssues,

    mdValidation,

    record,
  };
}
