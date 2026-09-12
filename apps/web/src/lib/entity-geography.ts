import type {
  EntityRecord,
} from "@/lib/entities";

import {
  type GeographyItem,
  getGeographyDescendants,
  isGeographyWithin,
} from "@/lib/geography";

/**
 * Canonical rule:
 *
 * If an entity has geographySlug, geography membership is determined
 * only from the Arknoz geography tree.
 *
 * geography string remains a human-readable label and legacy fallback
 * while older records are migrated.
 */
export function entityMatchesGeography(
  entity: EntityRecord,
  context?: GeographyItem
) {
  if (!context || context.type === "global") {
    return true;
  }

  if (entity.geographySlug) {
    return isGeographyWithin(
      entity.geographySlug,
      context.slug
    );
  }

  // Transitional fallback for existing records that have not yet
  // received a canonical geographySlug.
  const terms = [
    context.name,
    context.slug,
    ...getGeographyDescendants(
      context.slug
    ).flatMap((item) => [
      item.name,
      item.slug,
    ]),
  ].map((value) =>
    value.toLowerCase()
  );

  const legacy =
    entity.geography.toLowerCase();

  return terms.some((term) =>
    legacy.includes(term)
  );
}

export function getEntityGeographyMode(
  entity: EntityRecord
) {
  return entity.geographySlug
    ? "canonical"
    : "legacy";
}