import {
  arknozSections,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";
import {
  getGeographyAncestors,
  type GeographyItem,
} from "@/lib/geography";

export const FEATURED_SLOT_KEYS = [
  "01",
  "02",
  "03",
] as const;

export type FeaturedSlotKey =
  (typeof FEATURED_SLOT_KEYS)[number];

export type FeaturedGeographyLevel =
  | "global"
  | "continent"
  | "country"
  | "city";

export type FeaturedPlacementContext = {
  geographyLevel: FeaturedGeographyLevel;
  geographySlug: string;
  sectionKey: ArknozSectionKey;
};

export type FeaturedPlacementIdentity = {
  slot: FeaturedSlotKey;
  placementId: string;
  geographyLevel: FeaturedGeographyLevel;
  geographySlug: string;
  sectionKey: ArknozSectionKey;
};

function normalisePlacementPart(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildFeaturedPlacementId(
  context: FeaturedPlacementContext,
  slot: FeaturedSlotKey
) {
  const geographySlug =
    normalisePlacementPart(
      context.geographySlug
    ) || "global";

  return [
    "arknoz",
    context.geographyLevel,
    geographySlug,
    context.sectionKey,
    `slot-${slot}`,
  ].join(":");
}

export function getFeaturedPlacementIdentities(
  context: FeaturedPlacementContext
): FeaturedPlacementIdentity[] {
  return FEATURED_SLOT_KEYS.map(
    (slot) => ({
      slot,
      placementId:
        buildFeaturedPlacementId(
          context,
          slot
        ),
      geographyLevel:
        context.geographyLevel,
      geographySlug:
        context.geographySlug,
      sectionKey:
        context.sectionKey,
    })
  );
}

/**
 * ARKNOZ FEATURED-CARD RULE
 *
 * Every geography + section owns exactly
 * three permanent placement identities.
 *
 * Example:
 * city:mumbai + knowledge
 *   SLOT-01
 *   SLOT-02
 *   SLOT-03
 *
 * A slot may have 1, 30, 300 or more
 * eligible candidates behind it, but it
 * resolves to one visible card at render.
 *
 * Subsections and deep/detail pages inherit
 * their parent geography + section slots.
 * They DO NOT create new placement identities.
 */

export function resolveFeaturedPlacementGeography(
  context?: GeographyItem
): {
  geographyLevel: FeaturedGeographyLevel;
  geographySlug: string;
} {
  if (!context) {
    return {
      geographyLevel: "global",
      geographySlug: "global",
    };
  }

  if (
    context.type === "global" ||
    context.type === "continent" ||
    context.type === "country" ||
    context.type === "city"
  ) {
    return {
      geographyLevel: context.type,
      geographySlug: context.slug,
    };
  }

  const lineage = [
    context,
    ...getGeographyAncestors(context.slug),
  ];

  const city = lineage.find(
    (item) => item.type === "city"
  );

  if (city) {
    return {
      geographyLevel: "city",
      geographySlug: city.slug,
    };
  }

  const country = lineage.find(
    (item) => item.type === "country"
  );

  if (country) {
    return {
      geographyLevel: "country",
      geographySlug: country.slug,
    };
  }

  const continent = lineage.find(
    (item) => item.type === "continent"
  );

  if (continent) {
    return {
      geographyLevel: "continent",
      geographySlug: continent.slug,
    };
  }

  return {
    geographyLevel: "global",
    geographySlug: "global",
  };
}

export function resolveFeaturedPlacementContext(
  sectionKey: ArknozSectionKey,
  context?: GeographyItem
): FeaturedPlacementContext {
  const geography =
    resolveFeaturedPlacementGeography(context);

  return {
    ...geography,
    sectionKey,
  };
}

export type FeaturedResolverSlot = {
  sectionKey: ArknozSectionKey;
  slot: FeaturedSlotKey;
  resolverSlotId: string;
};

export function buildFeaturedResolverSlotId(
  sectionKey: ArknozSectionKey,
  slot: FeaturedSlotKey
) {
  return `${sectionKey.toUpperCase()}-P${slot}`;
}

export function getAllFeaturedResolverSlots():
  FeaturedResolverSlot[] {
  return arknozSections.flatMap(
    (section) =>
      FEATURED_SLOT_KEYS.map(
        (slot) => ({
          sectionKey: section.key,
          slot,
          resolverSlotId:
            buildFeaturedResolverSlotId(
              section.key,
              slot
            ),
        })
      )
  );
}

export const FEATURED_RESOLVER_SLOT_COUNT =
  arknozSections.length * FEATURED_SLOT_KEYS.length;

/**
 * Returns the three permanent resolver slots
 * owned by one Arknoz section.
 *
 * Example:
 * projects -> PROJECTS-P01 / P02 / P03
 *
 * Geography is supplied separately as context.
 */
export function getSectionFeaturedResolverSlots(
  sectionKey: ArknozSectionKey
): FeaturedResolverSlot[] {
  return FEATURED_SLOT_KEYS.map(
    (slot) => ({
      sectionKey,
      slot,
      resolverSlotId:
        buildFeaturedResolverSlotId(
          sectionKey,
          slot
        ),
    })
  );
}
