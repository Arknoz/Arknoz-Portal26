import { buildGeographyHref } from "@/lib/geography";
import Link from "next/link";

import { getGeographyContextNav } from "@/components/GeographyContextBar";
import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import { getAllFeaturedResolverSlots } from "@/lib/featured-slots";
import { getProductionEntities } from "@/lib/data/production-entities";
import { getActivePlacementEntityRef } from "@/lib/placement-data";
import { getDevelopmentPlacementEntity } from "@/lib/development-placement-preview";
import { entityMatchesGeography } from "@/lib/entity-geography";

import {
  arknozSections,
  buildArknozSectionHref,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";

import {
  type GeographyItem,
  findGeography,
  getChildren,
} from "@/lib/geography";

const cityPlacementSlots =
  getAllFeaturedResolverSlots().map(
    (item) => item.resolverSlotId
  );
export default async function CityGeographyPage({
  context,
}: {
  context: GeographyItem;
}) {
  const children =
    getChildren(context.slug);

  const parent =
    context.parent
      ? findGeography(context.parent)
      : undefined;

  const popular =
    arknozSections
      .slice(0, 6)
      .map((section) => ({
        label: section.short,
        href: buildArknozSectionHref(
          section.key,
          {
            geo: context.slug,
          }
        ),
      }));

  const projectsHref =
    buildArknozSectionHref(
      "projects",
      {
        geo: context.slug,
      }
    );

  const knowledgeHref =
    buildArknozSectionHref(
      "knowledge",
      {
        geo: context.slug,
      }
    );

  const opportunitiesHref =
    buildArknozSectionHref(
      "opportunities",
      {
        geo: context.slug,
      }
    );

  // ARKNOZ_CITY_PLACEMENT_WIRING_V1
  //
  // Permanent City slots are reused for every city.
  // context.slug selects the actual city placement.
  // Draft/disabled assignments resolve to nothing.
  const cityPlacementRefs =
    cityPlacementSlots.map(
      (slotId) =>
        getActivePlacementEntityRef(
          slotId,
          context.slug
        )
    );

  const needsProductionProjects =
    cityPlacementRefs.some(
      (ref) =>
        ref?.type === "project"
    );

  const productionRecords =
    needsProductionProjects
      ? await getProductionEntities()
      : [];

  const cityFeatured =
    cityPlacementRefs.flatMap(
      (ref) => {
        if (
          !ref ||
          ref.type !== "project"
        ) {
          return [];
        }

        const entity =
          productionRecords.find(
            (candidate) =>
              candidate.type ===
                "project" &&
              candidate.slug ===
                ref.slug
          );

        if (
          !entity ||
          entity.type !== "project" ||
          !entityMatchesGeography(
            entity,
            context
          )
        ) {
          return [];
        }

        return [
          {
            type: "PROJECT",
            title: entity.title,
            meta:
              entity.geography ||
              entity.subtitle ||
              context.name,
            href:
              `/projects/${entity.slug}`,
            image:
              entity.project
                ?.media?.[0]
                ?.src ||
              "/visuals/portal/place.png",
          },
        ];
      }
    );
  // ARKNOZ_DEV_DISCOVERY_OVERLAY_V5
  const cityDisplayFeatured =
    process.env.NODE_ENV === "development"
      ? cityPlacementSlots.flatMap(
          (slotId) => {
            const entity =
              getDevelopmentPlacementEntity(
                slotId,
                context.slug
              );

            if (
              !entity ||
              !entityMatchesGeography(
                entity,
                context
              )
            ) {
              return [];
            }

            return [
              {
                type: "PROJECT",
                title: entity.title,
                meta:
                  entity.geography ||
                  entity.subtitle ||
                  context.name,
                href:
                  `/preview/projects/${entity.slug}`,
                image:
                  entity.project?.media?.[0]?.src ||
                  "/visuals/portal/place.png",
              },
            ];
          }
        )
      : cityFeatured;

  // ARKNOZ_GEOGRAPHY_HOME_AGGREGATOR_V1
  //
  // Geography Home owns NO additional placement identities.
  // It displays up to three unique cards resolved from the
  // geography's existing 12 sections x 3 slots = 36 slots.
  const cityHomeFeatured =
    cityDisplayFeatured
      .filter(
        (item, index, items) =>
          items.findIndex(
            (candidate) =>
              candidate.href === item.href
          ) === index
      )
      .slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <UniversalPublicFirstScreen
        eyebrow={`${context.name.toUpperCase()} · CITY`}
        title={`Explore ${context.name}.`}
        description={`Discover projects, products, knowledge, people, organisations, universities and opportunities shaping ${context.name}'s built environment.`}
        searchPlaceholder={`Search ${context.name} — project, product, knowledge, person, organisation or topic...`}
        searchGeo={context.slug}
        popular={popular}
        contextNav={getGeographyContextNav(context)}
        featured={cityHomeFeatured}
        ticker={[
          {
            text: `Explore projects in ${context.name}`,
            href: projectsHref,
          },
          {
            text: `Discover knowledge in ${context.name}`,
            href: knowledgeHref,
          },
          {
            text: `Explore opportunities in ${context.name}`,
            href: opportunitiesHref,
          },
        ]}
      />

      <section
        id="connected"
        className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              CONNECTED BUILT WORLD
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Explore {context.name} across Arknoz.
            </h2>
          </div>

          {parent && (
            <Link
              href={buildGeographyHref(parent.slug)}
              className="font-semibold text-blue-700"
            >
              Back to {parent.name} →
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {arknozSections.map(
            (section) => (
              <Link
                key={section.key}
                href={buildArknozSectionHref(
                  section.key,
                  {
                    geo: context.slug,
                  }
                )}
                className="group rounded-[22px] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    {section.short}
                  </p>

                  {isPaidArknozSection(
                    section.key
                  ) && (
                    <span className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Arknoz Pro · Coming Later
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {section.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>

                <p className="mt-5 font-semibold text-blue-700">
                  Explore in {context.name} →
                </p>
              </Link>
            )
          )}
        </div>
      </section>

      {children.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              PLACES
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Explore within {context.name}.
            </h2>

            <div className="mt-7 flex gap-4 overflow-x-auto pb-3">
              {children.map(
                (child) => (
                  <Link
                    key={child.slug}
                    href={buildGeographyHref(child.slug)}
                    className="min-w-[250px] rounded-[22px] border border-slate-200 bg-white p-6"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {child.type}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-950">
                      {child.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {child.subtitle}
                    </p>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10">
        <div className="rounded-[24px] border border-blue-100 bg-blue-50 p-7">
          <strong>
            Explore the city in context.
          </strong>

          <p className="mt-2 max-w-4xl text-slate-600">
            Discover projects, products, publications, people and organisations
            connected to this city, with related regional, national and global
            views available across Arknoz.
          </p>
        </div>
      </section>

      <UniversalPublicLastScreen />
    </main>
  );
}