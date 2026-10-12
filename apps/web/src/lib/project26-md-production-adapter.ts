import type {
  ArknozProjectId,
  ProjectRecordData,
} from "@/lib/entities";

import {
  arknozSections,
} from "@/lib/arknoz-sections";

import {
  ingestProject26MDResearchPackage,
  type Project26MDResearchPackageReport,
} from "@/lib/project26-md-research-package";

import {
  applyProject26MDToProjectRecord,
} from "@/lib/project26-md-project-bridge";


type ProjectRecordWithMDInput =
  ProjectRecordData & {
    project26MD:
      unknown;
  };


export type Project26ProjectSubsection = {

  slug:
    string;

  label:
    string;
};


export type Project26ProductionAdapterResult = {

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

  project:
    ProjectRecordData;

  projectSubsection?:
    Project26ProjectSubsection;

  report:
    Project26MDResearchPackageReport;
};


/*
 * ================================================================
 * PROJECT26 KIND -> CANONICAL ARKNOZ PROJECT SECTION
 *
 * This is the discovery/navigation layer.
 *
 * It does NOT replace Project26 classification.
 *
 * Example:
 * building
 *   -> Projects / Buildings & Architecture
 *
 * classification remains:
 * Institutional / Research Institute / Laboratory
 * ================================================================
 */

const projectSubsectionSlugByKind:
  Record<string, string> = {

    building:
      "buildings-architecture",

    interior:
      "interiors-renovation-adaptive-reuse",

    landscape:
      "landscape-public-realm",

    urbanism:
      "urbanism-planning-development",

    development:
      "urbanism-planning-development",

    infrastructure:
      "infrastructure-mobility",

    industrial:
      "industrial-energy-utilities",
  };


function resolveProjectSubsection(
  projectKind:
    string
):
  Project26ProjectSubsection |
  undefined {

  const slug =
    projectSubsectionSlugByKind[
      projectKind
    ];


  if (!slug) {
    return undefined;
  }


  const projectsSection =
    arknozSections.find(
      (section) =>
        section.key ===
        "projects"
    );


  const subsection =
    projectsSection
      ?.subsections
      .find(
        (item) =>
          item.slug ===
          slug
      );


  if (!subsection) {
    return undefined;
  }


  return {

    slug:
      subsection.slug,

    label:
      subsection.label,
  };
}


/*
 * ================================================================
 * PROJECT26 RESEARCH PACKAGE -> PRODUCTION PROJECT RECORD
 *
 * Pure adapter only.
 *
 * - No database writes.
 * - No R2 writes.
 * - No publishing.
 * - No project-specific slug rules.
 * - No fabricated content.
 *
 * Research-package validation remains authoritative.
 * Project26 renderer bridge remains authoritative.
 * Canonical Arknoz section taxonomy remains authoritative
 * for navigation/discovery.
 * ================================================================
 */

export function buildProject26ProductionProjectRecord(
  input:
    unknown
):
  Project26ProductionAdapterResult {

  const report =
    ingestProject26MDResearchPackage(
      input
    );


  if (
    report.release !==
      "READY" ||
    report.ready !==
      true ||
    !report.record
  ) {

    const issueSummary =
      report.packageIssues
        .map(
          (issue) =>
            `${issue.code}: ${issue.message}`
        )
        .join("; ");


    throw new Error(
      issueSummary
        ? `Project26 package is not READY: ${issueSummary}`
        : "Project26 package is not READY."
    );
  }


  const bridgeInput =
    {
      project26MD:
        report.record,
    } as ProjectRecordWithMDInput;


  const bridgedProject =
    applyProject26MDToProjectRecord(
      bridgeInput
    );


  if (!bridgedProject) {

    throw new Error(
      "Project26 production bridge returned no Project record."
    );
  }


  const projectSubsection =
    resolveProjectSubsection(
      report
        .record
        .classification
        .projectKind
    );


  /*
   * category is the canonical Arknoz Project-section label.
   *
   * Detailed Project26 classification remains untouched
   * in project.classification.
   */
  const project:
    ProjectRecordData =
      projectSubsection
        ? {
            ...bridgedProject,

            category:
              projectSubsection.label,
          }
        : bridgedProject;


  return {

    slug:
      report.record.identity.slug,

    arknozEntityId:
      report.record.identity.arknozEntityId,

    title:
      report.record.identity.title,

    geography:
      report.record.identity.geography,

    summary:
      report.record.identity.summary,

    project,

    projectSubsection,

    report,
  };
}
