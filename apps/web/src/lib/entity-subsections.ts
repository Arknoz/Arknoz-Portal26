import type { EntityRecord } from "@/lib/entities";

import {
  getArknozSubsection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";

export function entityMatchesSubsection(
  entity: EntityRecord,
  sectionKey?: ArknozSectionKey,
  subsectionSlug?: string
) {
  if (
    !sectionKey ||
    !subsectionSlug
  ) {
    return true;
  }

  const subsection =
    getArknozSubsection(
      sectionKey,
      subsectionSlug
    );

  if (!subsection) {
    return false;
  }

  return (
    entity
      .sectionSubsections?.[
        sectionKey
      ]?.includes(
        subsectionSlug
      ) ?? false
  );
}