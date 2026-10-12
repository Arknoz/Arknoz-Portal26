import "server-only";

import {
  readdir,
  readFile,
} from "node:fs/promises";

import path from "node:path";

import type {
  EntityRecord,
  ProjectRecordData,
} from "@/lib/entities";

import {
  buildProject26ProductionProjectRecord,
} from "@/lib/project26-md-production-adapter";


export type Project26LocalPreview = {
  entity:
    EntityRecord;

  project:
    ProjectRecordData;
};


function geographySlug(
  value:
    string
) {

  const normalized =
    value
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

  return normalized || "global";
}


/*
 * ================================================================
 * PROJECT26 LOCAL PREVIEW
 *
 * Development only.
 *
 * Reads READY Project26 research packages and feeds them through the
 * exact same production adapter / Project26 renderer contract.
 *
 * Production builds can NEVER use this fallback.
 * ================================================================
 */

export async function getProject26LocalPreview(
  slug:
    string
):
  Promise<
    Project26LocalPreview |
    undefined
  > {

  if (
    process.env.NODE_ENV ===
      "production"
  ) {
    return undefined;
  }


  const packageDirectory =
    path.resolve(
      process.cwd(),
      "research",
      "project26-md",
      "research-packages"
    );


  let filenames:
    string[];


  try {

    filenames =
      await readdir(
        packageDirectory
      );

  }
  catch {

    return undefined;
  }


  for (
    const filename
    of filenames
      .filter(
        (name) =>
          name.endsWith(".json")
      )
      .sort()
  ) {

    const packagePath =
      path.join(
        packageDirectory,
        filename
      );


    let parsed:
      unknown;


    try {

      parsed =
        JSON.parse(
          await readFile(
            packagePath,
            "utf8"
          )
        );

    }
    catch {

      continue;
    }


    const candidateSlug =
      (
        parsed as {
          project?: {
            identity?: {
              slug?: unknown;
            };
          };
        }
      )
        ?.project
        ?.identity
        ?.slug;


    if (
      candidateSlug !==
        slug
    ) {
      continue;
    }


    /*
     * The production adapter fails closed for HOLD packages.
     */
    let adapted;


    try {

      adapted =
        buildProject26ProductionProjectRecord(
          parsed
        );

    }
    catch {

      return undefined;
    }


    const entity =
      {
        slug:
          adapted.slug,

        arknozEntityId:
          adapted.arknozEntityId,

        type:
          "project",

        title:
          adapted.title,

        subtitle:
          adapted.project
            .classification
            ?.primaryCategory
            ?.label ||
          "Project",

        geography:
          adapted.geography,

        geographySlug:
          geographySlug(
            adapted.geography
          ),

        summary:
          adapted.summary,

        trust:
          "Project26 READY",

        sectionSubsections:
          adapted.projectSubsection
            ? {
                projects: [
                  adapted
                    .projectSubsection
                    .slug,
                ],
              }
            : undefined,

        media:
          adapted.project.media,

        project:
          adapted.project,
      } as EntityRecord;


    return {
      entity,
      project:
        adapted.project,
    };
  }


  return undefined;
}


/*
 * ================================================================
 * PROJECT26 LOCAL COLLECTION
 *
 * Development only.
 * Only collectionVisible=true packages are considered.
 * Existing single-project loader remains authoritative for READY/HOLD.
 * ================================================================
 */

export async function getProject26LocalPreviews():
  Promise<
    Project26LocalPreview[]
  > {

  if (
    process.env.NODE_ENV ===
      "production"
  ) {
    return [];
  }

  const packageDirectory =
    path.resolve(
      process.cwd(),
      "research",
      "project26-md",
      "research-packages"
    );

  let filenames:
    string[];

  try {

    filenames =
      await readdir(
        packageDirectory
      );

  }
  catch {

    return [];
  }

  const previews:
    Project26LocalPreview[] = [];

  for (
    const filename
    of filenames
      .filter(
        (name) =>
          name.endsWith(".json")
      )
      .sort()
  ) {

    const packagePath =
      path.join(
        packageDirectory,
        filename
      );

    let parsed:
      unknown;

    try {

      parsed =
        JSON.parse(
          await readFile(
            packagePath,
            "utf8"
          )
        );

    }
    catch {

      continue;
    }

    const packageInfo =
      parsed as {
        research?: {
          collectionVisible?:
            unknown;
        };
        project?: {
          identity?: {
            slug?:
              unknown;
          };
        };
      };

    if (
      packageInfo
        .research
        ?.collectionVisible !==
        true
    ) {
      continue;
    }

    const slug =
      packageInfo
        .project
        ?.identity
        ?.slug;

    if (
      typeof slug !==
        "string" ||
      slug.trim().length ===
        0
    ) {
      continue;
    }

    const preview =
      await getProject26LocalPreview(
        slug
      );

    if (preview) {
      previews.push(
        preview
      );
    }
  }

  return previews;
}
