import Link from "next/link";
import { notFound } from "next/navigation";

import GlobalHeader from "@/components/GlobalHeader";
import ProjectDetailTabs from "@/components/ProjectDetailTabs";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import UniversalRecordOverview from "@/components/UniversalRecordOverview";
import UniversalRecordSystem from "@/components/UniversalRecordSystem";

import type {
  EntityRecord,
} from "@/lib/entities";

import {
  applyProject26MDToProjectRecord,
} from "@/lib/project26-md-project-bridge";
import { validateProject26MD } from "@/lib/project26-md";
import type {
  ArknozAccessMode,
} from "@/lib/entitlements/arknoz-audience";
import {
  buildArknozSectionHref,
} from "@/lib/arknoz-sections";

import {
  buildGeographyHref,
} from "@/lib/geography";


export default function ProjectDetailPage({
  entity,
  candidatePreview = false,
  recordAccessMode = "sign_in",
  lensAccessMode = "preview",
}: {
  entity: EntityRecord;
  browsingGeoSlug?: string;
  candidatePreview?: boolean;
  recordAccessMode?: ArknozAccessMode;
  lensAccessMode?: ArknozAccessMode;
}) {

  /*
   * PROJECT 26 MD SERVER BOUNDARY
   *
   * Existing projects pass through unchanged.
   * READY MD projects use the canonical MD renderer payload.
   * HOLD MD projects are never promoted.
   */
  const project =
    applyProject26MDToProjectRecord(
      entity.project
    );

  /*
   * PROJECT26-ONLY DETAIL GATE
   *
   * Only the current normalized Project26 contract may render
   * through the public Project Detail page.
   */
  const project26MD =
    (
      entity.project as
        | { project26MD?: unknown }
        | undefined
    )?.project26MD;

  const project26Validation =
    project26MD === undefined
      ? undefined
      : validateProject26MD(project26MD);

  if (
    !project?.structuredRecord ||
    !project26Validation?.ready
  ) {
    notFound();
  }


  /*
   * PROJECT 26 CLIENT DATA BOUNDARY
   *
   * The public Overview is rendered here from the original
   * server-side entity.
   *
   * ProjectDetailTabs is a client component, therefore data
   * outside the viewer's entitlement is removed BEFORE the
   * entity is serialized to the browser.
   */

  const recordFullAccess =
    recordAccessMode === "full";

  const lensFullAccess =
    lensAccessMode === "full";


  const project26TabsEntity:
    EntityRecord =
    recordFullAccess &&
    lensFullAccess
      ? {
          ...entity,
          project,
        }
      : {
          ...entity,

          project:
            project
              ? {
                  ...project,

                  ...(recordFullAccess
                    ? {}
                    : {
                        structuredRecord:
                          undefined,

                        facts: [],

                        signature: [],

                        topics: [],

                        anatomy: [],

                        timeline: [],

                        people: [],

                        documents: [],

                        sources: [],
                      }),

                  /*
                   * Lens analytical material is never sent to
                   * a non-Pro browser.
                   */
                  lens:
                    lensFullAccess
                      ? project.lens
                      : undefined,
                }
              : undefined,
        };

  const facts =
    project?.facts ?? [];

  const signature =
    project?.signature?.length
      ? project.signature
      : facts;


  /*
   * OVERVIEW FACT PRIORITY
   * Uses recorded data only.
   * Nothing is invented.
   */
  const overviewFactPriority = (
    fact: {
      label: string;
      overviewRole?: string;
      overviewPriority?: number;
    }
  ) => {

    /*
     * New normalized Arknoz project data.
     */
    if (
      typeof fact.overviewPriority ===
      "number"
    ) {
      return fact.overviewPriority;
    }


    const rolePriority:
      Record<string, number> = {
        "project-type": 0,
        location: 1,
        "lead-designer": 2,
        completion: 3,
        status: 4,
        area: 5,
        height: 5,
        floors: 5,
        capacity: 5,
        use: 6,
        other: 20,
      };


    if (
      fact.overviewRole &&
      rolePriority[
        fact.overviewRole
      ] !== undefined
    ) {
      return rolePriority[
        fact.overviewRole
      ];
    }



    return 20;
  };

  const overviewFacts =
    [
      ...signature,
      ...facts,
    ]
      .filter(
        (
          fact,
          index,
          array
        ) =>
          array.findIndex(
            (candidate) =>
              candidate.label
                .trim()
                .toLowerCase() ===
                fact.label
                  .trim()
                  .toLowerCase()
          ) === index
      )
      .filter(
        (fact) =>
          !/(fee|fees|cost|costs|price|pricing|budget|investment|contract value|project value|construction value)/i.test(
            fact.label.trim()
          )
      )
      .map(
        (
          fact,
          index
        ) => ({
          fact,
          index,
        })
      )
      .sort(
        (
          a,
          b
        ) => {

          const priorityDifference =
            overviewFactPriority(
              a.fact
            ) -
            overviewFactPriority(
              b.fact
            );


          return priorityDifference !== 0
            ? priorityDifference
            : a.index - b.index;
        }
      )
      .slice(
        0,
        6
      )
      .map(
        ({ fact }) =>
          fact
      );


  /*
   * =========================================================
   * PROJECT 26 — PUBLIC PROJECT PROFILE PAYLOAD
   *
   * Universal publication boundary for Record Index 01.
   *
   * Overview:
   *   signature orientation facts
   *
   * Project Profile:
   *   editorial Project Brief + deliberately public factual
   *   profile information
   *
   * Protected structuredRecord is NOT used to construct this
   * payload for logged-out users.
   * =========================================================
   */

  const publicProjectBrief =
    project?.projectBrief?.trim() ?? "";


  const normalizeProject26PublicFact = (
    label: string,
    value: string
  ) =>
    `${label.trim().toLowerCase()}::${value
      .trim()
      .toLowerCase()}`;


  const overviewPublicFactKeys =
    new Set(
      overviewFacts.map(
        (fact) =>
          normalizeProject26PublicFact(
            fact.label,
            fact.value
          )
      )
    );


  const publicProjectProfile =
    (project?.publicProfile ?? [])
      .filter(
        (field) =>
          field.label.trim().length > 0 &&
          field.value.trim().length > 0
      )
      .filter(
        (field) =>
          field.role === "team" ||
          !overviewPublicFactKeys.has(
            normalizeProject26PublicFact(
              field.label,
              field.value
            )
          )
      )
      .map(
        (
          field,
          index
        ) => ({
          field,
          index,
        })
      )
      .sort(
        (
          a,
          b
        ) => {

          const priorityDifference =
            (a.field.priority ?? 100) -
            (b.field.priority ?? 100);


          return priorityDifference !== 0
            ? priorityDifference
            : a.index - b.index;

        }
      )
      .map(
        ({ field }) =>
          field
      );

  const media =
    project?.media?.length
      ? project.media
      : entity.media ?? [];


  /*
   * PROJECT OVERVIEW MEDIA ORDER
   *
   * Semantic media roles define Overview presentation:
   * hero -> record -> context -> drawing -> diagram.
   * Unknown roles retain their original relative order.
   * Source media is never mutated.
   */
  const overviewMediaRolePriority:
    Record<string, number> = {
      hero: 0,
      record: 1,
      context: 2,
      drawing: 3,
      diagram: 4,
    };

  const overviewMedia =
    media
      .map(
        (item, index) => ({
          item,
          index,
        })
      )
      .sort(
        (a, b) => {
          const roleDifference =
            (
              overviewMediaRolePriority[
                a.item.role ?? ""
              ] ?? 100
            ) -
            (
              overviewMediaRolePriority[
                b.item.role ?? ""
              ] ?? 100
            );

          return roleDifference !== 0 ? roleDifference : a.index - b.index;
        }
      )
      .map(
        ({ item }) => item
      );

  const sources =
    project?.sources ?? [];


  const primarySourceUrl =
    sources[0]?.href;

  const category =
    project?.category ??
    "Projects";

  const categorySlug =
    entity.sectionSubsections
      ?.projects?.[0];


  const categoryHref =
    categorySlug
      ? buildArknozSectionHref(
          "projects",
          {
            subsection:
              categorySlug,
          }
        )
      : "/projects";


  /*
   * Canonical context rule:
   * store the deepest geography leaf on the entity;
   * parent geography is inherited from the geography tree.
   */
  const contextHref =
    entity.geographySlug
      ? buildGeographyHref(
          entity.geographySlug
        )
      : undefined;


  /*
   * OVERVIEW RULE
   *
   * Overview = concise identity and orientation.
   * Record = deeper Arknoz interpretation and evidence.
   *
   * Do not duplicate the full Lens here.
   */

  /*
   * Permanent Arknoz rule:
   *
   * OVERVIEW:
   * project identity + short orientation + core facts.
   *
   * RECORD:
   * deeper Arknoz interpretation, evidence and intelligence.
   *
   * Never place the full Lens on Overview.
   */


  /*
   * PROJECT OVERVIEW FRAME FIT
   *
   * The Project conforms to the frozen Arknoz Overview.
   * Canonical Project data is never rewritten here.
   */
  const compactOverviewText = (
    value: string | undefined,
    _maxLength: number
  ) => {
    const normalized =
      value
        ?.replace(/\s+/g, " ")
        .trim();

    return normalized || undefined;
  };

  const overviewStrapline =
    compactOverviewText(
      project?.strapline,
      80
    );

  const overviewSummary =
    compactOverviewText(
      entity.summary,
      110
    ) ?? entity.summary;

  return (
    <>
      <GlobalHeader />

      <main>

        <UniversalRecordSystem
          overview={
            <>
              {/* ==================================================
                  SCREEN 1
                  UNIVERSAL ARKNOZ OVERVIEW
              ================================================== */}

        <section className="bg-[#f4f6f9] lg:h-[calc(100svh-106px)]">

          <div className="mx-auto flex h-full max-w-[1500px] flex-col px-5 py-4 lg:px-7">

            {/* BREADCRUMB */}

            <nav className="mb-3 flex shrink-0 flex-wrap items-center gap-2 text-[10px] font-semibold">

              <Link
                href="/projects"
                className="text-blue-700"
              >
                Projects
              </Link>

              <span className="text-slate-400">
                /
              </span>

              <Link
                href={categoryHref}
                className="cursor-pointer text-blue-700 transition hover:text-blue-950"
              >
                {category}
              </Link>

              <span className="text-slate-400">
                /
              </span>

              <span className="text-slate-950">
                {entity.title}
              </span>


              {candidatePreview ? (
                <>
                </>
              ) : null}

            </nav>


            <UniversalRecordOverview
              typeLabel="Project"

              arknozEntityId={
                entity.arknozEntityId
              }

              title={
                entity.title
              }

              strapline={
                overviewStrapline
              }

              summary={overviewSummary}

              facts={
                overviewFacts
              }

              media={
                overviewMedia
                  .filter(
                    (item) =>
                      Boolean(
                        item.src
                      )
                  )
                  .map(
                    (item) => ({
                      src:
                        item.src,

                      alt:
                        item.alt ??
                        entity.title,

                      attribution:
                        item.attribution,

                      license:
                        item.license,

                      sourceUrl:
                        item.sourceUrl,

                      rightsStatus:
                        item.rightsStatus,

                      provenanceStatus:
                        item.provenanceStatus,
                    })
                  )
              }

              visualLabel={
                category
              }

              contextLabel={
                entity.geography
              }
              contextHref={
                contextHref
              }
              provenanceLabel="Source-backed record"

              sourceCount={
                sources.length
              }

              officialUrl={primarySourceUrl}

              sourceLinkLabel="Open primary source"



              continueHref="#arknoz-record-workspace"



              continueLabel="Explore project"
            />

          </div>

        </section>


            </>
          }

          workspace={
            <>
              {/* ==================================================
                  SCREEN 2
                  RECORD · CONNECTIONS · INTELLIGENCE
              ================================================== */}

        <section
          id="project-record"
          className="border-t border-slate-200 bg-white"
        >

          <div className="mx-auto max-w-[1500px] px-5 lg:px-7">

            <ProjectDetailTabs
              entity={project26TabsEntity}
              candidatePreview={
                candidatePreview
              }
              recordAccessMode={
                recordAccessMode
              }
              lensAccessMode={
                lensAccessMode
              }
              publicProjectBrief={
                publicProjectBrief
              }
              publicProjectProfile={
                publicProjectProfile
              }              publicRecordSourceCount={
                sources.length
              }
              publicRecordMediaCount={
                media.length
              }
            />

          </div>

        </section>


            </>
          }
        />

        {/* ==================================================
            UNIVERSAL FINAL SCREEN
        ================================================== */}

        <UniversalPublicLastScreen />

      </main>
    </>
  );
}
