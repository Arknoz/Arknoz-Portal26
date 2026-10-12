import type {
  ProjectRecordData,
} from "@/lib/entities";

import {
  buildProject26MDRendererModel,
  validateProject26MD,
  type Project26MDRecord,
} from "@/lib/project26-md";


type ProjectRecordWithMD =
  ProjectRecordData & {
    project26MD?: unknown;
  };


/*
 * ================================================================
 * PROJECT 26 MD -> PROJECT RECORD BRIDGE
 *
 * Universal server-side adapter.
 *
 * No project names.
 * No slug rules.
 * No label inference.
 * No fabricated content.
 *
 * Existing Project 26 records pass through unchanged.
 *
 * MD record:
 * READY -> translated into the existing Project 26 renderer contract.
 * HOLD  -> existing project record returned unchanged.
 * ================================================================
 */

export function applyProject26MDToProjectRecord(
  project:
    ProjectRecordData | undefined
):
  ProjectRecordData | undefined {

  if (!project) {
    return project;
  }


  const mdInput =
    (
      project as
        ProjectRecordWithMD
    ).project26MD;


  /*
   * Existing projects do not yet carry Project 26 MD.
   * They therefore remain byte-for-byte data-compatible.
   */
  if (
    mdInput === undefined
  ) {
    return project;
  }


  const validation =
    validateProject26MD(
      mdInput
    );


  /*
   * A thin or incomplete MD package can never replace
   * the existing Project Record.
   */
  if (
    !validation.ready
  ) {
    return project;
  }


  const mdRecord =
    mdInput as
      Project26MDRecord;


  const renderer =
    buildProject26MDRendererModel(
      mdRecord
    );


  /*
   * PROJECT26 OVERVIEW LEAD
   *
   * Deterministic, project-agnostic and source-backed.
   *
   * Uses validated Overview claims only.
   * Existing manually prepared straplines always take priority.
   */
  const overviewProjectType =
    mdRecord
      .claims
      .find(
        (claim) =>
          claim.overviewRole ===
          "project-type"
      )
      ?.value
      .trim();


  const overviewLeadDesigner =
    mdRecord
      .claims
      .find(
        (claim) =>
          claim.overviewRole ===
          "lead-designer"
      )
      ?.value
      .trim();


  const project26OverviewStrapline =
    project
      .strapline
      ?.trim() ||
    (
      overviewProjectType &&
      overviewLeadDesigner

        ? `${overviewProjectType} by ${overviewLeadDesigner}.`

        : (
            overviewProjectType ||
            overviewLeadDesigner ||
            undefined
          )
    );


  const nextProject = {

    ...project,


    classification: {

      primaryCategory:
        mdRecord
          .classification
          .primaryCategory,

      typologies:
        mdRecord
          .classification
          .typologies,

      useSectors:
        mdRecord
          .classification
          .useSectors,

      subtypes:
        mdRecord
          .classification
          .subtypes
          .map(
            (term) =>
              term.label
          ),

      searchAliases:
        mdRecord
          .classification
          .searchAliases,
    },


    strapline:
      project26OverviewStrapline,


    projectBrief:
      renderer.projectBrief,


    /*
     * Project 26 Overview receives only explicit MD Overview facts.
     *
     * Both arrays are populated because the existing Overview
     * renderer already uses signature first and facts as fallback.
     */
    facts:
      renderer.overviewFacts,

    signature:
      renderer.overviewFacts,


    publicProfile:
      renderer.publicProfile,


    structuredRecord:
      renderer.structuredRecord,


    sources:
      renderer.sources,


    media:
      mdRecord.media.map(
        (item) => ({

          src:
            item.src,

          alt:
            item.alt,

          role:
            item.role,

          sourceUrl:
            item.sourceUrl,

          attribution:
            item.sourceLabel,

          rightsStatus:
            item.rightsStatus,

          provenanceStatus:
            "source-backed",
        })
      ),


    documents:
      mdRecord.documents.map(
        (document) => ({

          id:
            document.id,

          title:
            document.title,

          label:
            document.title,

          href:
            document.href,

          type:
            document.kind,

          kind:
            document.kind,

          sourceLabel:
            document.sourceLabel,

          sourceUrl:
            document.sourceUrl,

          rightsStatus:
            document.rightsStatus,

          provenanceStatus:
            "source-backed",
        })
      ),
  };


  /*
   * Conversion is deliberately isolated here rather than in TSX.
   *
   * The MD validator has already proven the canonical data contract.
   */
  return (
    nextProject as
      unknown as
      ProjectRecordData
  );
}