import {
  type ExploreSectionKey,
} from "@/lib/arknoz-sections";

import {
  getGeographyAncestors,
  type GeographyItem,
} from "@/lib/geography";

export const ARKNOZ_SHOWCASE_TYPES = [
  "featured",
  "editors-choice",
  "member-choice",
] as const;

export type ArknozShowcaseType =
  (typeof ARKNOZ_SHOWCASE_TYPES)[number];

export const ARKNOZ_SHOWCASE_ORDER:
  readonly ArknozShowcaseType[] = [
    "featured",
    "editors-choice",
    "member-choice",
  ];

export const ARKNOZ_SHOWCASE_MAX_ITEMS = 9;

export type ArknozShowcaseGeographyLevel =
  | "global"
  | "continent"
  | "country"
  | "city";

export type ArknozShowcaseContext = {
  geographyLevel:
    ArknozShowcaseGeographyLevel;
  geographySlug: string;
  sectionKey: ExploreSectionKey;
  subsectionSlug?: string;
};

function normalisePart(
  value: string | undefined
) {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") ??
    ""
  );
}

export function resolveShowcaseGeography(
  context?: GeographyItem
): {
  geographyLevel:
    ArknozShowcaseGeographyLevel;
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
    ...getGeographyAncestors(
      context.slug
    ),
  ];

  const city = lineage.find(
    (item) =>
      item.type === "city"
  );

  if (city) {
    return {
      geographyLevel: "city",
      geographySlug: city.slug,
    };
  }

  const country = lineage.find(
    (item) =>
      item.type === "country"
  );

  if (country) {
    return {
      geographyLevel: "country",
      geographySlug: country.slug,
    };
  }

  const continent = lineage.find(
    (item) =>
      item.type === "continent"
  );

  if (continent) {
    return {
      geographyLevel: "continent",
      geographySlug:
        continent.slug,
    };
  }

  return {
    geographyLevel: "global",
    geographySlug: "global",
  };
}

export function createShowcaseContext(
  sectionKey: ExploreSectionKey,
  subsectionSlug?: string,
  geography?: GeographyItem
): ArknozShowcaseContext {
  const geo =
    resolveShowcaseGeography(
      geography
    );

  return {
    ...geo,
    sectionKey,
    subsectionSlug:
      normalisePart(
        subsectionSlug
      ) || undefined,
  };
}

export function buildShowcaseScopeKey(
  context: ArknozShowcaseContext
) {
  return [
    context.geographyLevel,
    normalisePart(
      context.geographySlug
    ) || "global",
    context.sectionKey,
    normalisePart(
      context.subsectionSlug
    ) || "all",
  ].join(":");
}

export function buildShowcaseKey(
  type: ArknozShowcaseType,
  context: ArknozShowcaseContext
) {
  return [
    "arknoz-showcase",
    type,
    buildShowcaseScopeKey(
      context
    ),
  ].join(":");
}
