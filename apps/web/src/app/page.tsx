import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Arknoz | Explore the Built World",
  },
  description:
    "Explore projects, products, knowledge, learning, opportunities, people, organisations, universities and places across the Built World.",
};

import GlobalHeader from "@/components/GlobalHeader";
import HomeContinuousExperience, {
  type HomeEditorialRecord,
} from "@/components/HomeContinuousExperience";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import { getProductionEntities } from "@/lib/data/production-entities";
import { getActivePlacementEntityRef } from "@/lib/placement-data";
import type { EntityRecord } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const homePlacementSlots = [
  "HOME-P01",
  "HOME-P02",
  "HOME-P03",
  "HOME-P04",
  "HOME-P05",
  "HOME-P06",
  "HOME-P07",
  "HOME-P08",
  "HOME-P09",
  "HOME-P10",
  "HOME-P11",
  "HOME-P12",
] as const;

export default async function Home() {
  // ARKNOZ_HOME_PLACEMENT_WIRING_V1
  //
  // Placement resolution stays server-side.
  // Client panels receive only independently publishable,
  // canonical production records.
  // Draft assignments resolve to no visible record.
  const placementRefs =
    homePlacementSlots.map(
      (slotId) =>
        getActivePlacementEntityRef(
          slotId,
          "global"
        )
    );

  const needsProductionRecords =
    placementRefs.some(
      (ref) =>
        Boolean(ref)
    );

  const productionRecords =
    needsProductionRecords
      ? await getProductionEntities()
      : [];

  const homePlacementEntities:
    Array<EntityRecord | null> =
    placementRefs.map(
      (ref) => {
        if (!ref) {
          return null;
        }

        return (
          productionRecords.find(
            (entity) =>
              entity.type === ref.type &&
              entity.slug === ref.slug
          ) ?? null
        );
      }
    );
  // HOME USES ONLY REAL ACTIVE PRODUCTION PLACEMENTS.
  // Missing assignments remain empty and resolve through
  // standard Arknoz category fallbacks.
  const homeDisplayEntities =
    homePlacementEntities;
  // ARKNOZ_HOME_UNIVERSAL_HERO_V1
  const homeHeroFallback = [
    {
      type: "PROJECTS",
      title: "Explore Projects",
      meta: "Built World projects",
      href: "/projects",
      image: "/visuals/portal/project.png",
    },
    {
      type: "KNOWLEDGE",
      title: "Explore Knowledge",
      meta: "Research · Cases · References",
      href: "/knowledge",
      image: "/visuals/portal/knowledge.png",
    },
    {
      type: "PRODUCTS",
      title: "Explore Products",
      meta: "Materials · Systems · Equipment",
      href: "/products",
      image: "/visuals/portal/product.png",
    },
    {
      type: "OPPORTUNITIES",
      title: "Explore Opportunities",
      meta: "Jobs · Competitions · Events",
      href: "/opportunities",
      image: "/visuals/portal/opportunity.png",
    },
  ];

  const homeHeroFeatured =
    [0, 1, 2, 3].map(
      (index) => {
        const entity =
          homeDisplayEntities[index] ?? null;

        if (!entity) {
          return homeHeroFallback[index];
        }

        const mediaItems =
          entity.project?.media ??
          entity.media ??
          [];

        const heroMedia =
          mediaItems.find(
            (item) =>
              (item.role ?? "").toLowerCase() === "hero"
          ) ??
          mediaItems[0];

        const galleryImages = [
          heroMedia,
          ...mediaItems.filter(
            (item) =>
              item !== heroMedia &&
              Boolean(item.src) &&
              ![
                "diagram",
                "drawing",
                "document",
              ].includes(
                (item.role ?? "").toLowerCase()
              )
          ),
        ]
          .map((item) => item?.src)
          .filter(
            (src): src is string =>
              typeof src === "string" &&
              src.length > 0 &&
              !src.includes(
                "commons.wikimedia.org/wiki/Special:Redirect"
              )
          )
          .slice(0, 7);

        return {
          type: entity.type.toUpperCase(),
          title: entity.title,
          meta:
            entity.geography ||
            entity.subtitle ||
            "Built World",
          href:
            process.env.NODE_ENV === "development" &&
            entity.type === "project" &&
            entity.trust?.includes("Candidate") === true
              ? `/preview/projects/${entity.slug}`
              : getEntityHref(entity),
          image:
            galleryImages[0] ||
            "/visuals/portal/project.png",
          images:
            galleryImages,
        };
      }
    );
  const homeJourneyRecords:
    HomeEditorialRecord[] =
    homeDisplayEntities
      .filter(
        (
          entity
        ): entity is EntityRecord =>
          Boolean(entity)
      )
      .map(
        (entity) => ({
          title:
            entity.title,

          subtitle:
            entity.subtitle,

          summary:
            entity.summary,

          geography:
            entity.geography,

          type:
            entity.type,

          href:
            process.env.NODE_ENV === "development" &&
            entity.type === "project" &&
            entity.trust?.includes("Candidate") === true
              ? `/preview/projects/${entity.slug}`
              : getEntityHref(entity),

          image:
            entity.media?.[0]?.src ||
            entity.project?.media?.[0]?.src ||
            undefined,
        })
      );

  return (
    <main
      className="
        bg-white
        text-slate-950

      "
      data-arknoz-home-continuous="true"
    >

      {/* ======================================================
          01 — FIRST SCREEN / GLOBAL ENTRY
         ====================================================== */}

      <GlobalHeader />

      <HomeContinuousExperience
        records={homeJourneyRecords}
        featured={homeHeroFeatured}
      />

      <UniversalPublicLastScreen />
    </main>
  );
}