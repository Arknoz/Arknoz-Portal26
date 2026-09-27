import { entityMatchesGeography } from "@/lib/entity-geography";
import { entityMatchesSubsection } from "@/lib/entity-subsections";
import {
  arknozSections,
  arknozExploreSections,
  buildArknozSectionHref,
  getArknozSection,
  isExploreArknozSection,
} from "@/lib/arknoz-sections";
import SectionSubsectionStrip from "@/components/SectionSubsectionStrip";
import type { ArknozSectionKey, ExploreSectionKey } from "@/lib/arknoz-sections";
import Link from "next/link";
import ArknozPageShell from "@/components/ArknozPageShell";
import ArknozChapter from "@/components/ArknozChapter";
import ArknozPanel from "@/components/ArknozPanel";
import ArknozTile from "@/components/ArknozTile";
import ArknozPlacementSlot from "@/components/ArknozPlacementSlot";

import { getGeographyContextNav } from "@/components/GeographyContextBar";
import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import { resolveFeaturedPlacementContext } from "@/lib/featured-slots";
import CommunityMemberAccess from "@/components/auth/CommunityMemberAccess";
import ShowcaseChapter from "@/components/ShowcaseChapter";
import ProjectCategoryShowcaseScreen from "@/components/ProjectCategoryShowcaseScreen";
import CoreWorldCategoryShowcaseScreen from "@/components/CoreWorldCategoryShowcaseScreen";
import CoreWorldCategoryIndexBody from "@/components/CoreWorldCategoryIndexBody";
import { createShowcaseContext } from "@/lib/universal-showcase";
import { getAssignedShowcaseItems } from "@/lib/showcase-data";
import { getArknozVisualTheme } from "@/lib/arknoz-visual-theme";

import {
  entities,
  type EntityRecord,
  type EntityType,
} from "@/lib/entities";
import { getProductionEntities } from "@/lib/data/production-entities";

import {
  type GeographyItem,
  findGeography,
  getChildren,
} from "@/lib/geography";

type WorldConfig = {
  eyebrow: string;
  path: string;
  entityTypes: EntityType[];
  popular: string[];
  lanes: string[];
};

type HeroFeature = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};

function getWorldConfig(
  title: string,
  sectionKey?: ArknozSectionKey
): WorldConfig {
  const section =
    sectionKey
      ? getArknozSection(sectionKey)
      : arknozSections.find(
          (item) =>
            item.title === title
        );

  if (!section) {
    return {
      eyebrow: title.toUpperCase(),
      path: "/explore",
      entityTypes: [],
      popular: [],
      lanes: [],
    };
  }

  return {
    eyebrow:
      section.title.toUpperCase(),

    path:
      section.href,

    entityTypes:
      section.entityTypes,

    popular:
      section.subsections
        .slice(0, 5)
        .map(
          (subsection) =>
            subsection.label
        ),

    lanes:
      section.subsections.map(
        (subsection) =>
          subsection.label
      ),
  };
}

const connectedWorlds =
  arknozExploreSections.map(
    (section) =>
      [
        section.title,
        section.href,
      ] as const
  );

function buildConnectedWorldHref(
  href: string,
  geoSlug?: string
) {
  if (!geoSlug) {
    return href;
  }

  const section =
    arknozSections.find(
      (item) =>
        item.href === href
    );

  if (!section) {
    return href;
  }

  return buildArknozSectionHref(
    section.key,
    {
      geo: geoSlug,
    }
  );
}
const approvedFeatureImages: Record<string, string> = {

  "mass-timber-system":
    "/visuals/arknoz-neutral.svg",

  "urban-biodiversity":
    "/visuals/arknoz-neutral.svg",

  "politecnico-di-milano":
    "/visuals/arknoz-neutral.svg",

  "white-arkitekter":
    "/visuals/arknoz-neutral.svg",
};

function getEntityHref(entity: EntityRecord) {
  switch (entity.type) {
    case "project":
      return `/projects/${entity.slug}`;

    case "product":
      return `/products/${entity.slug}`;

    case "knowledge":
      return `/knowledge/${entity.slug}`;

    case "person":
      return `/people/${entity.slug}`;

    case "organisation":
      return `/organisations/${entity.slug}`;

    case "university":
      return `/universities/${entity.slug}`;

    case "opportunity":
      return `/opportunities/opportunity/${entity.slug}`;

    case "place":
      return `/places/${entity.slug}`;
  }
}

function getEntityImage(
  entity: EntityRecord
) {
  if (
    entity.type === "project" &&
    entity.project?.media?.[0]?.src
  ) {
    return entity.project.media[0].src;
  }

  return approvedFeatureImages[
    entity.slug
  ];
}

function collectGeographyTerms(
  context: GeographyItem
) {
  const terms = new Set<string>();

  function visit(item: GeographyItem) {
    terms.add(
      item.name.toLowerCase()
    );

    terms.add(
      item.slug
        .replaceAll("-", " ")
        .toLowerCase()
    );

    getChildren(item.slug).forEach(
      visit
    );
  }

  visit(context);

  return Array.from(terms);
}

function matchesContext(
  entity: EntityRecord,
  context?: GeographyItem
) {
  if (
    !context ||
    context.type === "global"
  ) {
    return true;
  }

  const geography =
    entity.geography.toLowerCase();

  return collectGeographyTerms(
    context
  ).some(
    (term) =>
      geography.includes(term)
  );
}

function WorldRecordCard({
  entity,
}: {
  entity: EntityRecord;
}) {
  const image =
    getEntityImage(entity);

  return (
    <Link
      href={getEntityHref(entity)}
      className="group overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      {image ? (
        <div className="aspect-[1.55/1] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </div>
      ) : (
        <div className="flex aspect-[1.55/1] items-center justify-center bg-gradient-to-br from-[#dcebf8] to-[#b8cfe2]">
          <span className="text-4xl font-bold text-[#0b2949]/25">
            {entity.title
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      )}

      <div className="p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
          {entity.subtitle}
        </p>

        <h3 className="mt-2 text-xl font-bold text-slate-950">
          {entity.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {entity.geography}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {entity.summary}
        </p>

        {entity.trust && (
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {entity.trust}
          </p>
        )}

        <p className="mt-5 text-sm font-bold text-blue-700">
          Explore →
        </p>
      </div>
    </Link>
  );
}

export default async function WorldIndexPage({
  sectionKey,
  activeSubsection,
  title,
  description,
  geoSlug,
  recordSourceOverride,
  compactHero,
  featuredOverride,
  hideTopSubsectionStrip,
}: {
  title: string;
  description: string;
  geoSlug?: string;
  sectionKey?: ArknozSectionKey;
  activeSubsection?: string;
  recordSourceOverride?: EntityRecord[];
  compactHero?: boolean;
  featuredOverride?: HeroFeature[];
  hideTopSubsectionStrip?: boolean;
}) {
  const context =
    geoSlug
      ? findGeography(geoSlug)
      : undefined;

  const config = getWorldConfig(title, sectionKey);
  const visualTheme =
    getArknozVisualTheme(sectionKey);

  // Projects now use real published production entities.
  // Other Arknoz sections remain unchanged.
  const recordSource =
    recordSourceOverride ??
    (sectionKey === "projects"
      ? await getProductionEntities()
      : entities);
  const activeSection =
    sectionKey
      ? getArknozSection(sectionKey)
      : undefined;

  const activeSubsectionConfig =
    activeSubsection &&
    activeSection
      ? activeSection.subsections.find(
          (subsection) =>
            subsection.slug ===
            activeSubsection
        )
      : undefined;

  const displayTitle =
    activeSubsectionConfig?.label ??
    title;

  const displayDescription =
    activeSubsectionConfig?.description ??
    description;

  const heroPopular =
    activeSection
      ? activeSection.subsections
          .map((subsection) => ({
            label: subsection.label,
            href: buildArknozSectionHref(
              activeSection.key,
              {
                subsection:
                  subsection.slug,
                geo:
                  context &&
                  context.type !== "global"
                    ? context.slug
                    : undefined,
              }
            ),
          }))
      : config.popular;

  const worldRecords =
    config.entityTypes.length > 0
      ? recordSource.filter(
          (entity) =>
            config.entityTypes.includes(
              entity.type
            )
        )
      : [];

  const visibleRecords =
    worldRecords.filter(
      (entity) =>
        entityMatchesGeography(
          entity,
          context
        ) &&
        entityMatchesSubsection(
          entity,
          sectionKey,
          activeSubsection
        )
    );

  const showcaseContext =
    sectionKey &&
    isExploreArknozSection(sectionKey)
      ? createShowcaseContext(
          sectionKey as ExploreSectionKey,
          activeSubsection,
          context
        )
      : undefined;

  function resolveAssignedShowcaseEntities(
    type: "featured" | "editors-choice"
  ): EntityRecord[] {
    if (!showcaseContext) {
      return [];
    }

    return getAssignedShowcaseItems(
      type,
      showcaseContext
    ).flatMap((assignment) => {
      const entity =
        recordSource.find(
          (candidate) =>
            candidate.type ===
              assignment.entity_ref.type &&
            candidate.slug ===
              assignment.entity_ref.slug
        );

      if (!entity) {
        return [];
      }

      const belongsToCurrentContext =
        visibleRecords.some(
          (candidate) =>
            candidate.type === entity.type &&
            candidate.slug === entity.slug
        );

      return belongsToCurrentContext
        ? [entity]
        : [];
    });
  }

  const featuredShowcaseRecords =
    resolveAssignedShowcaseEntities(
      "featured"
    );

  const featuredShowcaseKeys =
    new Set(
      featuredShowcaseRecords.map(
        (entity) =>
          `${entity.type}:${entity.slug}`
      )
    );

  const editorsChoiceRecords =
    resolveAssignedShowcaseEntities(
      "editors-choice"
    ).filter(
      (entity) =>
        !featuredShowcaseKeys.has(
          `${entity.type}:${entity.slug}`
        )
    );

  // Member Choice intentionally remains empty until
  // genuine member_actions can be converted into a
  // validated anti-gaming ranking.
  const memberChoiceRecords:
    EntityRecord[] = [];
  const featured =
    visibleRecords
      .map((entity) => {
        const image =
          getEntityImage(entity) ??
          (
            recordSourceOverride &&
            sectionKey === "knowledge"
              ? "/visuals/arknoz-neutral.svg"
              : undefined
          );

        if (!image) {
          return null;
        }

        return {
          type:
            entity.subtitle.toUpperCase(),
          title: entity.title,
          meta: entity.geography,
          href:
            getEntityHref(entity),
          image,
        };
      })
      .filter(
        (
          item
        ): item is HeroFeature =>
          item !== null
      )
      .slice(0, 3);

  const locationLabel =
    context &&
    context.type !== "global"
      ? context.name
      : undefined;

  const heroEyebrowBase =
    activeSubsectionConfig
      ? `${config.eyebrow} · ${activeSubsectionConfig.label.toUpperCase()}`
      : config.eyebrow;

  const heroEyebrow =
    locationLabel
      ? `${locationLabel.toUpperCase()} · ${heroEyebrowBase}`
      : heroEyebrowBase;

  const heroTitle =
    locationLabel
      ? `${displayTitle} in ${locationLabel}.`
      : `Explore ${displayTitle}.`;

  const heroDescription =
    locationLabel
      ? `${displayDescription} Explore genuine Arknoz records connected to ${locationLabel} without duplicating their canonical identity.`
      : displayDescription;

  const discoverLanes =
    activeSection
      ? activeSection.subsections.map(
          (subsection) => ({
            label:
              subsection.label,
            href:
              buildArknozSectionHref(
                activeSection.key,
                {
                  subsection:
                    subsection.slug,
                  geo:
                    context &&
                    context.type !==
                      "global"
                      ? context.slug
                      : undefined,
                }
              ),
          })
        )
      : config.lanes.map(
          (lane) => ({
            label: lane,
            href: `/search?q=${encodeURIComponent(
              lane
            )}`,
          })
        );
  const featuredSearchParams =
    new URLSearchParams();

  if (sectionKey) {
    featuredSearchParams.set(
      "section",
      sectionKey
    );
  }

  if (activeSubsection) {
    featuredSearchParams.set(
      "subsection",
      activeSubsection
    );
  }

  if (
    context &&
    context.type !== "global"
  ) {
    featuredSearchParams.set(
      "geo",
      context.slug
    );
  }

  const featuredQuery =
    featuredSearchParams.toString();

  const featuredHref =
    featuredQuery
      ? `/featured?${featuredQuery}`
      : "/featured";
  const ticker = [
    {
      text:
        locationLabel
          ? `Explore ${displayTitle.toLowerCase()} connected to ${locationLabel}`
          : `Explore genuine ${displayTitle.toLowerCase()} across Arknoz`,
      href: "#showcases",
    },
    {
      text:
        `Discover ${title.toLowerCase()} by topic and discipline`,
      href: "#explore-world",
    },
    {
      text:
        locationLabel
          ? `Keep ${locationLabel} as the active geography context`
          : "Move across one connected Built World",
      href: "#connected-world",
    },
  ];

  const communityParams = new URLSearchParams();

  if (geoSlug) {
    communityParams.set("geo", geoSlug);
  }

  if (activeSubsection) {
    communityParams.set("type", activeSubsection);
  }

  const communityQuery = communityParams.toString();

  const communityReturnTo = communityQuery
    ? `/community?${communityQuery}`
    : "/community";

  return (
    <ArknozPageShell tone="light" className="min-h-screen">
      <UniversalPublicFirstScreen
        eyebrow={heroEyebrow}
        breadcrumb={[
          {
            label: "Explore",
            href: "/explore",
          },

          ...(activeSubsectionConfig
            ? [
                {
                  label: title,
                  href: config.path,
                },
              ]
            : [
                {
                  label: title,
                },
              ]),

          ...(activeSubsectionConfig
            ? [
                {
                  label:
                    activeSubsection ===
                    "competitions-awards"
                      ? "Competitions"
                      : activeSubsection ===
                          "jobs-careers"
                        ? "Jobs"
                        : activeSubsection ===
                            "events-conferences-exhibitions"
                          ? "Events"
                          : activeSubsection ===
                              "grants-funding-fellowships"
                            ? "Funding"
                            : activeSubsectionConfig.label,
                },
              ]
            : []),
        ]}
        title={heroTitle}
        description={
          heroDescription
        }
        searchPlaceholder={
          locationLabel
            ? `Search ${title.toLowerCase()} in ${locationLabel}...`
            : `Search ${displayTitle.toLowerCase()}...`
        }
        searchGeo={
          context &&
          context.type !== "global"
            ? context.slug
            : undefined
        }
        popular={
          heroPopular
        }
        contextNav={
          context &&
          context.type !== "global"
            ? getGeographyContextNav(context)
            : undefined
        }
        featured={featuredOverride ?? featured}
        featuredHref={featuredHref}
        placementContext={
          sectionKey
            ? resolveFeaturedPlacementContext(
                sectionKey,
                context
              )
            : undefined
        }
        ticker={ticker}
        theme={visualTheme}
      />
      {sectionKey &&
        !(sectionKey === "knowledge" && hideTopSubsectionStrip) && (
          <SectionSubsectionStrip
            sectionKey={sectionKey}
            geoSlug={
              context &&
              context.type !== "global"
                ? context.slug
                : undefined
            }
            activeSubsection={
              activeSubsection
            }
          />
        )}

      {sectionKey === "community" && (
        <CommunityMemberAccess
          returnTo={communityReturnTo}
          area={activeSubsection}
        />
      )}
      {activeSubsectionConfig &&
      sectionKey &&
      (
        sectionKey === "projects" ||
        sectionKey === "products" ||
        sectionKey === "knowledge" ||
        sectionKey === "learning" ||
        sectionKey === "opportunities" ||
        sectionKey === "community"
      ) ? (

        <div data-dedicated-category-index="true">

          <CoreWorldCategoryIndexBody
            sectionKey={sectionKey}
            sectionTitle={title}
            sectionHref={config.path}
            categoryLabel={
              activeSubsectionConfig.label
            }
            description={
              displayDescription
            }
            records={
              visibleRecords
            }
            siblingCategories={
              discoverLanes
            }
            locationLabel={
              locationLabel
            }
          />

        </div>

      ) : null}

      {sectionKey === "projects" && !activeSubsectionConfig ? (

        <div data-project-category-journey="true">

          {(activeSection?.subsections ?? [])
            .filter(
              (subsection) =>
                !activeSubsection ||
                subsection.slug === activeSubsection
            )
            .slice(0, 6)
            .map((subsection) => {

              const allProjectCategories =
                activeSection?.subsections ??
                [];


              const categoryIndex =
                allProjectCategories.findIndex(
                  (candidate) =>
                    candidate.slug ===
                    subsection.slug
                );


              const screenNumber =
                Math.max(
                  0,
                  categoryIndex
                ) + 2;


              const categoryRecords =
                worldRecords.filter(
                  (entity) =>
                    entityMatchesGeography(
                      entity,
                      context
                    ) &&
                    entityMatchesSubsection(
                      entity,
                      "projects",
                      subsection.slug
                    )
                );


              const categoryShowcaseContext =
                createShowcaseContext(
                  "projects",
                  subsection.slug,
                  context
                );


              const assignedFeatured =
                getAssignedShowcaseItems(
                  "featured",
                  categoryShowcaseContext
                );


              const categoryFeaturedProject =
                assignedFeatured
                  .map((assignment) =>
                    categoryRecords.find(
                      (entity) =>
                        entity.type ===
                          assignment.entity_ref.type &&
                        entity.slug ===
                          assignment.entity_ref.slug
                    )
                  )
                  .find(
                    (
                      entity
                    ): entity is EntityRecord =>
                      Boolean(entity)
                  );


              const moreProjects =
                categoryRecords
                  .filter(
                    (entity) =>
                      !categoryFeaturedProject ||
                      entity.type !==
                        categoryFeaturedProject.type ||
                      entity.slug !==
                        categoryFeaturedProject.slug
                  )
                  .slice(0, 6);


              const categoryHref =
                buildArknozSectionHref(
                  "projects",
                  {
                    subsection:
                      subsection.slug,

                    geo:
                      context &&
                      context.type !==
                        "global"
                        ? context.slug
                        : undefined,
                  }
                );


              return (

                <ProjectCategoryShowcaseScreen
                  key={subsection.slug}
                  screenNumber={
                    screenNumber
                  }
                  category={{
                    slug:
                      subsection.slug,
                    label:
                      subsection.label,
                  }}
                  categoryHref={
                    categoryHref
                  }
                  featuredProject={
                    categoryFeaturedProject
                  }
                  projects={
                    moreProjects
                  }
                  totalCount={
                    categoryRecords.length
                  }
                />

              );

            })}

        </div>

      ) : null}

      {!activeSubsectionConfig &&
      (
        sectionKey === "products" ||
        sectionKey === "knowledge" ||
        sectionKey === "learning" ||
        sectionKey === "opportunities" ||
        sectionKey === "community"
      ) ? (

        <div data-core-five-world-journey="true">

          {(activeSection?.subsections ?? [])
            .filter(
              (subsection) =>
                !activeSubsection ||
                subsection.slug === activeSubsection
            )
            .slice(0, 6)
            .map((subsection) => {

              const allCategories =
                activeSection?.subsections ??
                [];


              const categoryIndex =
                allCategories.findIndex(
                  (candidate) =>
                    candidate.slug ===
                    subsection.slug
                );


              const screenNumber =
                Math.max(
                  0,
                  categoryIndex
                ) + 2;


              const categoryRecords =
                worldRecords.filter(
                  (entity) =>
                    entityMatchesGeography(
                      entity,
                      context
                    ) &&
                    entityMatchesSubsection(
                      entity,
                      sectionKey,
                      subsection.slug
                    )
                );


              const categoryShowcaseContext =
                createShowcaseContext(
                  sectionKey as ExploreSectionKey,
                  subsection.slug,
                  context
                );


              const categoryFeaturedRecord =
                getAssignedShowcaseItems(
                  "featured",
                  categoryShowcaseContext
                )
                  .map((assignment) =>
                    categoryRecords.find(
                      (entity) =>
                        entity.type ===
                          assignment.entity_ref.type &&
                        entity.slug ===
                          assignment.entity_ref.slug
                    )
                  )
                  .find(
                    (
                      entity
                    ): entity is EntityRecord =>
                      Boolean(entity)
                  );


              const additionalRecords =
                categoryRecords
                  .filter(
                    (entity) =>
                      !categoryFeaturedRecord ||
                      entity.type !==
                        categoryFeaturedRecord.type ||
                      entity.slug !==
                        categoryFeaturedRecord.slug
                  )
                  .slice(0, 6);


              const categoryHref =
                buildArknozSectionHref(
                  sectionKey,
                  {
                    subsection:
                      subsection.slug,

                    geo:
                      context &&
                      context.type !==
                        "global"
                        ? context.slug
                        : undefined,
                  }
                );


              return (

                <CoreWorldCategoryShowcaseScreen
                  key={`${sectionKey}-${subsection.slug}`}
                  world={sectionKey}
                  screenNumber={
                    screenNumber
                  }
                  category={{
                    slug:
                      subsection.slug,
                    label:
                      subsection.label,
                  }}
                  categoryHref={
                    categoryHref
                  }
                  featuredRecord={
                    categoryFeaturedRecord
                  }
                  records={
                    additionalRecords
                  }
                  totalCount={
                    categoryRecords.length
                  }
                />

              );

            })}

        </div>

      ) : null}
      {(
        sectionKey === "projects" ||
        sectionKey === "products" ||
        sectionKey === "knowledge" ||
        sectionKey === "learning" ||
        sectionKey === "opportunities" ||
        sectionKey === "community"
      ) ? null : (
        <>

          <ShowcaseChapter
            type="featured"
            items={featuredShowcaseRecords}
            contextLabel={
              locationLabel
                ? `${displayTitle} · ${locationLabel}`
                : activeSubsectionConfig
                  ? displayTitle
                  : undefined
            }
            viewAllHref={config.path}
          />

          <ShowcaseChapter
            type="editors-choice"
            items={editorsChoiceRecords}
            contextLabel={
              locationLabel
                ? `${displayTitle} · ${locationLabel}`
                : activeSubsectionConfig
                  ? displayTitle
                  : undefined
            }
            viewAllHref={config.path}
          />

          <ShowcaseChapter
            type="member-choice"
            items={memberChoiceRecords}
            contextLabel={
              locationLabel
                ? `${displayTitle} · ${locationLabel}`
                : activeSubsectionConfig
                  ? displayTitle
                  : undefined
            }
            viewAllHref={config.path}
          />

        </>
      )}

      {(
        sectionKey === "projects" ||
        sectionKey === "products" ||
        sectionKey === "knowledge" ||
        sectionKey === "learning" ||
        sectionKey === "opportunities" ||
        sectionKey === "community"
      ) ? null : (
      <ArknozChapter
        id="connected-world"
        tone="dark"
        className="border-t border-white/10"
      >
        <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[0.82fr_1.18fr]">

          <ArknozPanel
            tone="dark"
            accent
            className="relative flex min-h-[300px] flex-col overflow-hidden lg:min-h-0"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg,#0b3154 0%,#123d68 100%)",
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.28) 1px,transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                Connected Built World
              </p>

              <h2 className="mt-3 max-w-lg text-[31px] font-semibold leading-[1.02] tracking-[-0.04em] xl:text-[38px]">
                {locationLabel
                  ? `Explore ${locationLabel} across Arknoz`
                  : "Continue across the Built World"}
              </h2>

              <p className="mt-4 max-w-md text-[10px] leading-5 text-slate-400">
                Projects, products, knowledge, education, opportunities and
                the Arknoz community remain connected through one canonical
                platform structure.
              </p>
            </div>

            <ArknozPlacementSlot
              slotKey={`${sectionKey ?? "world"}.index.connected.left-middle`}
              tone="dark"
              fallback={{
                placementType: "related",
                eyebrow: "Explore further",
                label: "Global",
                title:
                  "Explore the Built World through place and geography",
                description:
                  "Move from connected content into continent, country, region and city context.",
                href: "/global",
                cta: "Explore Global",
              }}
              className="relative mt-6 max-w-[450px]"
            />

            <div className="mt-auto border-t border-white/10 pt-4">
              <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Arknoz connection
              </p>

              <p className="mt-2 text-[11px] font-semibold text-slate-200">
                One context. Multiple worlds.
              </p>

              <p className="mt-2 max-w-sm text-[8px] leading-4 text-slate-500">
                Move between related parts of the Built World without losing
                the active Arknoz context.
              </p>
            </div>
          </ArknozPanel>


          <div className="grid h-full min-h-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">

            {connectedWorlds
              .filter(([label]) => label !== title)
              .map(([label, href]) => (
                <ArknozTile
                  key={href}
                  eyebrow="Connected world"
                  title={label}
                  description={
                    locationLabel
                      ? `Continue into ${label.toLowerCase()} in ${locationLabel}.`
                      : `Continue into the Arknoz ${label.toLowerCase()} world.`
                  }
                  href={
                    locationLabel
                      ? buildConnectedWorldHref(
                          href,
                          context?.slug
                        )
                      : href
                  }
                  tone="dark"
                  className="h-full min-h-[150px] border-t-[3px] border-t-blue-300/60"
                />
              ))}

            <ArknozTile
              eyebrow="Discover"
              title="Search Arknoz"
              description="Search across the connected Built World."
              href="/search"
              tone="dark"
              className="h-full min-h-[150px] border-t-[3px] border-t-blue-300/60"
            />

          </div>

        </div>
      </ArknozChapter>
      )}
      <UniversalPublicLastScreen />
    </ArknozPageShell>
  );
}
