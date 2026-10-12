import {
  ARKNOZ_ENTITY_ID_PATTERN,
  type ArknozProjectId,
} from "@/lib/entities";

/*
 * ================================================================
 * PROJECT 26 MD
 * Model-Driven Project Knowledge + Presentation System
 *
 * No individual project is the master.
 * Project 26 MD is the master contract.
 *
 * A project becomes READY only when:
 *
 * SCHEMA
 * + DEPTH
 * + TYPE COVERAGE
 * + EVIDENCE
 * + MEDIA RIGHTS
 * + VISUAL COMPLETENESS
 * = PASS
 *
 * The same canonical MD record feeds the Project 26 UI.
 * ================================================================
 */


export const PROJECT26_MD_VERSION =
  "1.0.0" as const;


export type Project26MDProjectKind =
  | "building"
  | "infrastructure"
  | "landscape"
  | "urbanism"
  | "heritage"
  | "interior"
  | "industrial"
  | "mixed";


export type Project26MDProvenanceStatus =
  | "source-verified"
  | "source-backed";


export type Project26MDRightsStatus =
  | "public-domain"
  | "cc0"
  | "cc-by"
  | "cc-by-sa"
  | "licensed-reuse";


export type Project26MDOverviewRole =
  | "project-type"
  | "location"
  | "lead-designer"
  | "completion"
  | "status"
  | "area"
  | "height"
  | "floors"
  | "capacity"
  | "use"
  | "other";


export type Project26MDRecord01Role =
  | "commission"
  | "purpose"
  | "team"
  | "programme"
  | "scale"
  | "development"
  | "status"
  | "recognition"
  | "other";


export type Project26MDRecord01Family =
  | "commissionPurpose"
  | "programmeScale"
  | "development"
  | "statusRecognition"
  | "additional";


export type Project26MDRecord02Section =
  | "projectData"
  | "site"
  | "team"
  | "programme"
  | "design"
  | "structure"
  | "systems"
  | "materials"
  | "products"
  | "performance"
  | "delivery"
  | "history"
  | "approvals";


export type Project26MDTerm = {
  slug: string;
  label: string;
};


export type Project26MDEvidenceSource = {
  id: string;
  label: string;
  url: string;
  publisher?: string;
  type?:
    | "primary"
    | "institutional"
    | "academic"
    | "archive"
    | "technical"
    | "other";
};


export type Project26MDClaim = {
  id: string;
  label: string;
  value: string;

  description?: string;

  /*
   * First-class Project Overview placement.
   *
   * Explicit only. The UI never guesses a role from the label.
   */
  overviewRole?: Project26MDOverviewRole;

  overviewPriority?: number;

  record01Role?: Project26MDRecord01Role;

  record02Section?: Project26MDRecord02Section;

  provenanceStatus:
    Project26MDProvenanceStatus;

  evidenceIds: string[];
};


export type Project26MDMedia = {
  id: string;

  src: string;

  alt: string;

  role:
    | "hero"
    | "record"
    | "context"
    | "drawing"
    | "diagram";

  rightsStatus:
    Project26MDRightsStatus;

  sourceLabel: string;

  sourceUrl: string;

  evidenceIds?: string[];
};


export type Project26MDDocument = {
  id: string;

  title: string;

  href: string;

  kind:
    | "drawing"
    | "report"
    | "archive"
    | "reference"
    | "document";

  rightsStatus:
    Project26MDRightsStatus;

  sourceLabel: string;

  sourceUrl: string;
};


export type Project26MDRecord = {

  schemaVersion:
    typeof PROJECT26_MD_VERSION;


  identity: {

    slug:
      string;

    arknozEntityId?:
      ArknozProjectId;

    title:
      string;

    geography:
      string;

    summary:
      string;

    projectBrief:
      string;
  };


  classification: {

    projectKind:
      Project26MDProjectKind;

    primaryCategory:
      Project26MDTerm;

    typologies:
      Project26MDTerm[];

    useSectors:
      Project26MDTerm[];

    subtypes:
      Project26MDTerm[];

    searchAliases:
      string[];
  };


  claims:
    Project26MDClaim[];


  evidence: {

    sources:
      Project26MDEvidenceSource[];
  };


  media:
    Project26MDMedia[];


  documents:
    Project26MDDocument[];
};


export type Project26MDValidationGate =
  | "schema"
  | "overview"
  | "depth"
  | "typeCoverage"
  | "evidence"
  | "media"
  | "visual";


export type Project26MDValidationIssue = {

  gate:
    Project26MDValidationGate;

  code:
    string;

  message:
    string;
};


export type Project26MDValidationReport = {

  version:
    typeof PROJECT26_MD_VERSION;

  ready:
    boolean;

  gates: {

    schema:
      boolean;

    overview:
      boolean;

    depth:
      boolean;

    typeCoverage:
      boolean;

    evidence:
      boolean;

    media:
      boolean;

    visual:
      boolean;
  };

  metrics: {

    claims:
      number;

    overviewClaims:
      number;

    overviewRoles:
      number;

    record01Claims:
      number;

    record01Families:
      number;

    record02Claims:
      number;

    record02Sections:
      number;

    sources:
      number;

    media:
      number;

    documents:
      number;

    evidenceCoverage:
      number;
  };

  issues:
    Project26MDValidationIssue[];
};


/*
 * PROJECT26 RECORD 01 ORDER
 *
 * Canonical semantic hierarchy.
 * No project names, labels or slug-specific rules.
 * Claims sharing a role retain original relative order.
 */
const RECORD01_ROLE_PRIORITY:
  Record<
    Project26MDRecord01Role,
    number
  > = {

    commission: 0,
    purpose: 1,
    team: 2,
    programme: 3,
    scale: 4,
    development: 5,
    status: 6,
    recognition: 7,
    other: 8,
  };


const RECORD01_FAMILY:
  Record<
    Project26MDRecord01Role,
    Project26MDRecord01Family
  > = {

    commission:
      "commissionPurpose",

    purpose:
      "commissionPurpose",

    team:
      "commissionPurpose",

    programme:
      "programmeScale",

    scale:
      "programmeScale",

    development:
      "development",

    status:
      "statusRecognition",

    recognition:
      "statusRecognition",

    other:
      "additional",
  };


const REQUIRED_RECORD02:
  Record<
    Project26MDProjectKind,
    Project26MDRecord02Section[]
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


function hasText(
  value: unknown
): value is string {

  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}


function slugify(
  value: string
): string {

  return value

    .trim()

    .toLowerCase()

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      ""
    );
}


function roleFamily(
  role:
    Project26MDRecord01Role
): Project26MDRecord01Family {

  return RECORD01_FAMILY[
    role
  ];
}


export function validateProject26MD(
  input: unknown
): Project26MDValidationReport {

  const issues:
    Project26MDValidationIssue[] = [];


  const addIssue = (
    gate:
      Project26MDValidationGate,

    code:
      string,

    message:
      string
  ) => {

    issues.push({
      gate,
      code,
      message,
    });
  };


  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {

    addIssue(
      "schema",
      "MD_RECORD_INVALID",
      "Project 26 MD record must be an object."
    );


    return {

      version:
        PROJECT26_MD_VERSION,

      ready:
        false,

      gates: {
        schema:
          false,

        overview:
          false,

        depth:
          false,

        typeCoverage:
          false,

        evidence:
          false,

        media:
          false,

        visual:
          false,
      },

      metrics: {
        claims:
          0,

        overviewClaims:
          0,

        overviewRoles:
          0,

        record01Claims:
          0,

        record01Families:
          0,

        record02Claims:
          0,

        record02Sections:
          0,

        sources:
          0,

        media:
          0,

        documents:
          0,

        evidenceCoverage:
          0,
      },

      issues,
    };
  }


  const record =
    input as Partial<Project26MDRecord>;


  if (
    record.schemaVersion !==
    PROJECT26_MD_VERSION
  ) {

    addIssue(
      "schema",
      "MD_VERSION_INVALID",
      `schemaVersion must be ${PROJECT26_MD_VERSION}.`
    );
  }


  const identity =
    record.identity;


  if (
    !identity ||
    !hasText(
      identity.slug
    ) ||
    !hasText(
      identity.title
    ) ||
    !hasText(
      identity.geography
    ) ||
    !hasText(
      identity.summary
    ) ||
    !hasText(
      identity.projectBrief
    )
  ) {

    addIssue(
      "schema",
      "MD_IDENTITY_INCOMPLETE",
      "Identity requires slug, title, geography, summary and projectBrief."
    );
  }


  if (
    identity &&
    identity.arknozEntityId !== undefined &&
    (
      typeof identity.arknozEntityId !== "string" ||
      !ARKNOZ_ENTITY_ID_PATTERN.test(
        identity.arknozEntityId
      ) ||
      !identity.arknozEntityId.startsWith(
        "ARK-PRJ-"
      )
    )
  ) {
    addIssue(
      "schema",
      "MD_PROJECT_ID_INVALID",
      "arknozEntityId must use the permanent Project ID format ARK-PRJ-00000001."
    );
  }

  if (
    identity &&
    hasText(
      identity.summary
    ) &&
    identity.summary.trim().length <
      90
  ) {

    addIssue(
      "depth",
      "MD_SUMMARY_TOO_THIN",
      "Project summary must provide substantive project orientation."
    );
  }


  if (
    identity &&
    hasText(
      identity.projectBrief
    ) &&
    identity.projectBrief.trim().length <
      120
  ) {

    addIssue(
      "depth",
      "MD_BRIEF_TOO_THIN",
      "Project brief must provide substantive project context."
    );
  }


  const classification =
    record.classification;


  const kinds:
    Project26MDProjectKind[] = [
      "building",
      "infrastructure",
      "landscape",
      "urbanism",
      "heritage",
      "interior",
      "industrial",
      "mixed",
    ];


  if (
    !classification ||
    !kinds.includes(
      classification.projectKind
    ) ||
    !classification.primaryCategory ||
    !hasText(
      classification.primaryCategory.slug
    ) ||
    !hasText(
      classification.primaryCategory.label
    ) ||
    !Array.isArray(
      classification.typologies
    ) ||
    classification.typologies.length <
      1 ||
    !Array.isArray(
      classification.useSectors
    ) ||
    !Array.isArray(
      classification.subtypes
    ) ||
    !Array.isArray(
      classification.searchAliases
    )
  ) {

    addIssue(
      "schema",
      "MD_CLASSIFICATION_INVALID",
      "Project classification is incomplete."
    );
  }


  const claims =
    Array.isArray(
      record.claims
    )
      ? record.claims
      : [];


  if (
    claims.length === 0
  ) {

    addIssue(
      "schema",
      "MD_CLAIMS_MISSING",
      "Project 26 MD requires factual claims."
    );
  }


  /*
   * ==============================================================
   * PROJECT 26 MD — OVERVIEW
   *
   * Overview is now a first-class validated MD layer.
   *
   * It must orient the project clearly before the user enters
   * the deeper Project Record.
   *
   * No regex inference. No label guessing.
   * ==============================================================
   */

  const allowedOverviewRoles:
    Project26MDOverviewRole[] = [
      "project-type",
      "location",
      "lead-designer",
      "completion",
      "status",
      "area",
      "height",
      "floors",
      "capacity",
      "use",
      "other",
    ];


  for (
    const claim
    of claims
  ) {

    if (
      claim.overviewRole !== undefined &&
      !allowedOverviewRoles.includes(
        claim.overviewRole
      )
    ) {

      addIssue(
        "schema",
        "MD_OVERVIEW_ROLE_INVALID",
        `Claim ${claim.id} contains an invalid overviewRole.`
      );
    }


    if (
      claim.overviewPriority !== undefined &&
      (
        typeof claim.overviewPriority !== "number" ||
        !Number.isFinite(
          claim.overviewPriority
        ) ||
        claim.overviewPriority < 0
      )
    ) {

      addIssue(
        "schema",
        "MD_OVERVIEW_PRIORITY_INVALID",
        `Claim ${claim.id} contains an invalid overviewPriority.`
      );
    }
  }


  const overview =
    claims.filter(
      (
        claim
      ): claim is Project26MDClaim &
        {
          overviewRole:
            Project26MDOverviewRole;
        } =>
        claim.overviewRole !== undefined &&
        allowedOverviewRoles.includes(
          claim.overviewRole
        )
    );


  const overviewRoles =
    new Set(
      overview.map(
        (claim) =>
          claim.overviewRole
      )
    );


  /*
   * Six facts gives the existing Overview enough data to create
   * a deliberate project orientation rather than a sparse page.
   */
  if (
    overview.length < 6
  ) {

    addIssue(
      "overview",
      "MD_OVERVIEW_TOO_THIN",
      `Project Overview requires at least 6 substantive facts; found ${overview.length}.`
    );
  }


  /*
   * These two roles are universal to every project.
   */
  if (
    !overviewRoles.has(
      "project-type"
    )
  ) {

    addIssue(
      "overview",
      "MD_OVERVIEW_PROJECT_TYPE_MISSING",
      "Project Overview requires an explicit project-type fact."
    );
  }


  if (
    !overviewRoles.has(
      "location"
    )
  ) {

    addIssue(
      "overview",
      "MD_OVERVIEW_LOCATION_MISSING",
      "Project Overview requires an explicit location fact."
    );
  }


  /*
   * Other roles remain project-sensitive.
   *
   * A bridge, mosque, house, landscape or masterplan therefore
   * does not need an identical set of Overview fields.
   */
  if (
    overviewRoles.size < 4
  ) {

    addIssue(
      "overview",
      "MD_OVERVIEW_COVERAGE_INSUFFICIENT",
      `Project Overview requires at least 4 meaningful fact roles; found ${overviewRoles.size}.`
    );
  }


  const sources =
    record.evidence &&
    Array.isArray(
      record.evidence.sources
    )
      ? record.evidence.sources
      : [];


  const media =
    Array.isArray(
      record.media
    )
      ? record.media
      : [];


  const documents =
    Array.isArray(
      record.documents
    )
      ? record.documents
      : [];


  if (
    !Array.isArray(
      record.documents
    )
  ) {

    addIssue(
      "schema",
      "MD_DOCUMENTS_INVALID",
      "documents must be an array. Empty is valid."
    );
  }


  const allowedProvenance:
    Project26MDProvenanceStatus[] = [
      "source-verified",
      "source-backed",
    ];


  const sourceIds =
    new Set(
      sources
        .filter(
          (source) =>
            hasText(
              source.id
            )
        )
        .map(
          (source) =>
            source.id
        )
    );


  let evidencedClaims =
    0;


  for (
    const claim
    of claims
  ) {

    if (
      !hasText(
        claim.id
      ) ||
      !hasText(
        claim.label
      ) ||
      !hasText(
        claim.value
      )
    ) {

      addIssue(
        "schema",
        "MD_CLAIM_INVALID",
        "Every claim requires id, label and value."
      );

      continue;
    }


    if (
      !allowedProvenance.includes(
        claim.provenanceStatus
      )
    ) {

      addIssue(
        "evidence",
        "MD_PROVENANCE_INVALID",
        `Claim ${claim.id} has invalid provenanceStatus.`
      );
    }


    if (
      !Array.isArray(
        claim.evidenceIds
      ) ||
      claim.evidenceIds.length ===
        0
    ) {

      addIssue(
        "evidence",
        "MD_CLAIM_UNSOURCED",
        `Claim ${claim.id} has no evidence reference.`
      );

      continue;
    }


    const missing =
      claim.evidenceIds.filter(
        (id) =>
          !sourceIds.has(
            id
          )
      );


    if (
      missing.length > 0
    ) {

      addIssue(
        "evidence",
        "MD_EVIDENCE_REFERENCE_MISSING",
        `Claim ${claim.id} references unknown evidence: ${missing.join(", ")}.`
      );

      continue;
    }


    evidencedClaims +=
      1;
  }


  if (
    sources.length < 4
  ) {

    addIssue(
      "evidence",
      "MD_SOURCES_INSUFFICIENT",
      "Project 26 MD requires at least four credible evidence sources."
    );
  }


  for (
    const source
    of sources
  ) {

    if (
      !hasText(
        source.id
      ) ||
      !hasText(
        source.label
      ) ||
      !hasText(
        source.url
      )
    ) {

      addIssue(
        "evidence",
        "MD_SOURCE_INVALID",
        "Every evidence source requires id, label and URL."
      );
    }
  }


  const record01 =
    claims.filter(
      (
        claim
      ): claim is Project26MDClaim &
        {
          record01Role:
            Project26MDRecord01Role;
        } =>
        Boolean(
          claim.record01Role
        )
    );


  const record01Families =
    new Set(
      record01.map(
        (claim) =>
          roleFamily(
            claim.record01Role
          )
      )
    );


  if (
    record01.length < 8
  ) {

    addIssue(
      "depth",
      "MD_RECORD01_TOO_THIN",
      `Record 01 requires at least 8 substantive fields; found ${record01.length}.`
    );
  }


  if (
    record01Families.size < 4
  ) {

    addIssue(
      "visual",
      "MD_RECORD01_VISUAL_GAPS",
      `Record 01 requires coverage across at least 4 presentation groups; found ${record01Families.size}.`
    );
  }


  const record02 =
    claims.filter(
      (
        claim
      ): claim is Project26MDClaim &
        {
          record02Section:
            Project26MDRecord02Section;
        } =>
        Boolean(
          claim.record02Section
        )
    );


  const record02Sections =
    new Set(
      record02.map(
        (claim) =>
          claim.record02Section
      )
    );


  if (
    record02.length < 12
  ) {

    addIssue(
      "depth",
      "MD_RECORD02_TOO_THIN",
      `Record 02 requires at least 12 substantive fields; found ${record02.length}.`
    );
  }


  if (
    record02Sections.size < 5
  ) {

    addIssue(
      "visual",
      "MD_RECORD02_VISUAL_GAPS",
      `Record 02 requires at least 5 populated knowledge sections; found ${record02Sections.size}.`
    );
  }


  if (
    classification &&
    kinds.includes(
      classification.projectKind
    )
  ) {

    const required =
      REQUIRED_RECORD02[
        classification.projectKind
      ];


    const missing =
      required.filter(
        (section) =>
          !record02Sections.has(
            section
          )
      );


    if (
      missing.length > 0
    ) {

      addIssue(
        "typeCoverage",
        "MD_TYPE_COVERAGE_MISSING",
        `Project kind ${classification.projectKind} requires Record 02 coverage for: ${missing.join(", ")}.`
      );
    }
  }


  const allowedRights:
    Project26MDRightsStatus[] = [
      "public-domain",
      "cc0",
      "cc-by",
      "cc-by-sa",
      "licensed-reuse",
    ];


  if (
    media.length < 3
  ) {

    addIssue(
      "media",
      "MD_MEDIA_INSUFFICIENT",
      `Project 26 MD requires at least 3 reusable media items; found ${media.length}.`
    );
  }

  if (
    media.length > 18
  ) {
    addIssue(
      "media",
      "MD_MEDIA_EXCESS",
      `Project 26 MD allows a maximum of 18 reusable media items; found ${media.length}.`
    );
  }


  for (
    const item
    of media
  ) {

    if (
      !hasText(
        item.id
      ) ||
      !hasText(
        item.src
      ) ||
      !hasText(
        item.alt
      ) ||
      !hasText(
        item.sourceLabel
      ) ||
      !hasText(
        item.sourceUrl
      ) ||
      !allowedRights.includes(
        item.rightsStatus
      )
    ) {

      addIssue(
        "media",
        "MD_MEDIA_INVALID",
        `Media ${item.id || "(missing id)"} is not publication-ready.`
      );
    }
  }


  if (
    documents.length > 10
  ) {
    addIssue(
      "media",
      "MD_DOCUMENTS_EXCESS",
      `Project 26 MD allows a maximum of 10 supporting documents/files; found ${documents.length}.`
    );
  }

  for (
    const document
    of documents
  ) {

    if (
      !hasText(
        document.id
      ) ||
      !hasText(
        document.title
      ) ||
      !hasText(
        document.href
      ) ||
      !hasText(
        document.sourceLabel
      ) ||
      !hasText(
        document.sourceUrl
      ) ||
      !allowedRights.includes(
        document.rightsStatus
      )
    ) {

      addIssue(
        "media",
        "MD_DOCUMENT_INVALID",
        `Document ${document.id || "(missing id)"} is not publication-ready.`
      );
    }
  }


  const evidenceCoverage =
    claims.length > 0
      ? Math.round(
          (
            evidencedClaims /
            claims.length
          ) *
          100
        )
      : 0;


  if (
    evidenceCoverage < 100
  ) {

    addIssue(
      "evidence",
      "MD_EVIDENCE_COVERAGE_INCOMPLETE",
      `Every published factual claim must be evidence-linked. Current coverage: ${evidenceCoverage}%.`
    );
  }


  const gatePass = (
    gate:
      Project26MDValidationGate
  ): boolean =>
    !issues.some(
      (issue) =>
        issue.gate ===
        gate
    );


  const gates = {

    schema:
      gatePass(
        "schema"
      ),

    overview:
      gatePass(
        "overview"
      ),

    depth:
      gatePass(
        "depth"
      ),

    typeCoverage:
      gatePass(
        "typeCoverage"
      ),

    evidence:
      gatePass(
        "evidence"
      ),

    media:
      gatePass(
        "media"
      ),

    visual:
      gatePass(
        "visual"
      ),
  };


  const ready =
    Object.values(
      gates
    ).every(
      Boolean
    );


  return {

    version:
      PROJECT26_MD_VERSION,

    ready,

    gates,

    metrics: {

      claims:
        claims.length,

      overviewClaims:
        overview.length,

      overviewRoles:
        overviewRoles.size,

      record01Claims:
        record01.length,

      record01Families:
        record01Families.size,

      record02Claims:
        record02.length,

      record02Sections:
        record02Sections.size,

      sources:
        sources.length,

      media:
        media.length,

      documents:
        documents.length,

      evidenceCoverage,
    },

    issues,
  };
}


/*
 * ================================================================
 * PROJECT 26 MD -> UI CONTRACT
 *
 * Explicit mapping only.
 *
 * No label guessing.
 * No regex interpretation.
 * No fabricated fields.
 * ================================================================
 */


export function buildProject26MDRendererModel(
  record:
    Project26MDRecord
) {

  const sourceMap =
    new Map(
      record.evidence.sources.map(
        (source) => [
          source.id,
          source,
        ]
      )
    );


  const sourceForClaim = (
    claim:
      Project26MDClaim
  ) => {

    const sourceId =
      claim.evidenceIds[0];


    return sourceId
      ? sourceMap.get(
          sourceId
        )
      : undefined;
  };


  /*
   * PROJECT26 CANONICAL OVERVIEW DISPLAY LABELS
   *
   * Semantic overviewRole controls presentation.
   * Values, evidence and provenance remain unchanged.
   * No project names or slug-specific rules.
   */
  const overviewDisplayLabel = (
    role: Project26MDOverviewRole,
    sourceLabel: string
  ) => {

    switch (role) {

      case "project-type":
        return "Project Type";

      case "location":
        return "Location";

      case "lead-designer":
        return "Lead Designer";

      case "completion":
        return "Completion";

      case "status":
        return "Status";

      case "area":
        return "Area";

      case "height":
        return "Height";

      case "floors":
        return "Floors";

      case "capacity":
        return "Capacity";

      case "use":
        return "Use";

      case "other":
        return sourceLabel;
    }
  };


  const overviewFacts =
    record.claims

      .filter(
        (
          claim
        ): claim is Project26MDClaim &
          {
            overviewRole:
              Project26MDOverviewRole;
          } =>
          Boolean(
            claim.overviewRole
          )
      )

      .sort(
        (a, b) =>
          (
            a.overviewPriority ??
            100
          ) -
          (
            b.overviewPriority ??
            100
          )
      )

      .map(
        (claim) => {

          const source =
            sourceForClaim(
              claim
            );


          return {

            label:
              overviewDisplayLabel(
                claim.overviewRole,
                claim.label
              ),

            value:
              claim.value,

            overviewRole:
              claim.overviewRole,

            overviewPriority:
              claim.overviewPriority,

            description:
              claim.description,

            provenanceStatus:
              claim.provenanceStatus,

            sourceLabel:
              source?.label,

            sourceUrl:
              source?.url,
          };
        }
      );


  const publicProfile =
    record.claims

      .filter(
        (
          claim
        ): claim is Project26MDClaim &
          {
            record01Role:
              Project26MDRecord01Role;
          } =>
          Boolean(
            claim.record01Role
          )
      )

      .map(
        (claim, index) => ({
          claim,
          index,
        })
      )

      .sort(
        (a, b) => {

          const priorityDifference =
            RECORD01_ROLE_PRIORITY[
              a.claim.record01Role
            ] -
            RECORD01_ROLE_PRIORITY[
              b.claim.record01Role
            ];

          return priorityDifference !== 0
            ? priorityDifference
            : a.index - b.index;
        }
      )

      .map(
        ({ claim }) => {

          const source =
            sourceForClaim(
              claim
            );


          return {

            label:
              claim.label,

            value:
              claim.value,

            role:
              claim.record01Role,

            priority:
              RECORD01_ROLE_PRIORITY[
                claim.record01Role
              ],

            description:
              claim.description,

            provenanceStatus:
              claim.provenanceStatus,

            sourceLabel:
              source?.label,

            sourceUrl:
              source?.url,
          };
        }
      );


  const sections:
    Project26MDRecord02Section[] = [
      "projectData",
      "site",
      "team",
      "programme",
      "design",
      "structure",
      "systems",
      "materials",
      "products",
      "performance",
      "delivery",
      "history",
      "approvals",
    ];


  const structuredRecord =
    Object.fromEntries(

      sections.map(
        (section) => [

          section,

          record.claims

            .filter(
              (claim) =>
                claim.record02Section ===
                section
            )

            .map(
              (claim) => {

                const source =
                  sourceForClaim(
                    claim
                  );


                return {

                  label:
                    claim.label,

                  value:
                    claim.value,

                  description:
                    claim.description,

                  provenanceStatus:
                    claim.provenanceStatus,

                  sourceLabel:
                    source?.label,

                  sourceUrl:
                    source?.url,
                };
              }
            ),
        ]
      )
    );


  return {

    md: {
      version:
        PROJECT26_MD_VERSION,

      projectKind:
        record.classification.projectKind,
    },


    identity:
      record.identity,


    classification: {

      primaryCategory:
        record.classification.primaryCategory,

      typologies:
        record.classification.typologies,

      useSectors:
        record.classification.useSectors,

      subtypes:
        record.classification.subtypes,

      searchAliases:
        record.classification.searchAliases,
    },


    projectBrief:
      record.identity.projectBrief,


    overviewFacts,


    publicProfile,


    structuredRecord,


    sources:
      record.evidence.sources.map(
        (source) => ({

          label:
            source.label,

          href:
            source.url,

          organisation:
            source.publisher,
        })
      ),


    media:
      record.media,


    documents:
      record.documents,
  };
}
