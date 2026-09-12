import {
  geographyExists,
  validateGeographyTree,
} from "./geography";

import {
  arknozSections,
  getArknozSection,
  getArknozSubsection,
  type ArknozSectionKey,
} from "./arknoz-sections";

import {
  entities,
} from "./entities";

export function validateArknozArchitecture() {
  const errors: string[] = [];

  // ==========================================================
  // GEOGRAPHY TREE
  // ==========================================================

  const geographyResult =
    validateGeographyTree();

  errors.push(
    ...geographyResult.errors
  );

  // ==========================================================
  // SECTION + SUBSECTION REGISTRY
  // ==========================================================

  const sectionKeys =
    new Set<string>();

  for (const section of arknozSections) {
    if (
      sectionKeys.has(
        section.key
      )
    ) {
      errors.push(
        `Duplicate section key: ${section.key}`
      );
    }

    sectionKeys.add(
      section.key
    );

    const subsectionSlugs =
      new Set<string>();

    for (
      const subsection
      of section.subsections
    ) {
      if (
        subsectionSlugs.has(
          subsection.slug
        )
      ) {
        errors.push(
          `Duplicate subsection "${subsection.slug}" in ${section.key}`
        );
      }

      subsectionSlugs.add(
        subsection.slug
      );
    }
  }

  // ==========================================================
  // ENTITY RECORD INTEGRITY
  // ==========================================================

  const entityKeys =
    new Set<string>();

  for (const entity of entities) {
    const entityKey =
      `${entity.type}:${entity.slug}`;

    if (
      entityKeys.has(
        entityKey
      )
    ) {
      errors.push(
        `Duplicate entity record: ${entityKey}`
      );
    }

    entityKeys.add(
      entityKey
    );

    // --------------------------------------------------------
    // Canonical geography reference
    // Legacy records without geographySlug remain valid during
    // migration. Only explicit canonical references are checked.
    // --------------------------------------------------------

    if (
      entity.geographySlug &&
      !geographyExists(
        entity.geographySlug
      )
    ) {
      errors.push(
        `Unknown geographySlug "${entity.geographySlug}" on ${entityKey}`
      );
    }

    // --------------------------------------------------------
    // Canonical subsection references
    // --------------------------------------------------------

    if (
      entity.sectionSubsections
    ) {
      for (
        const [
          rawSectionKey,
          subsectionSlugs,
        ]
        of Object.entries(
          entity.sectionSubsections
        )
      ) {
        const sectionKey =
          rawSectionKey as
            ArknozSectionKey;

        const section =
          getArknozSection(
            sectionKey
          );

        if (!section) {
          errors.push(
            `Unknown section "${rawSectionKey}" on ${entityKey}`
          );

          continue;
        }

        if (
          section.entityTypes.length >
            0 &&
          !section.entityTypes.includes(
            entity.type
          )
        ) {
          errors.push(
            `Entity ${entityKey} cannot be classified under section "${sectionKey}"`
          );
        }

        const seenSubsections =
          new Set<string>();

        for (
          const subsectionSlug
          of subsectionSlugs ??
            []
        ) {
          if (
            seenSubsections.has(
              subsectionSlug
            )
          ) {
            errors.push(
              `Duplicate subsection "${subsectionSlug}" on ${entityKey}`
            );

            continue;
          }

          seenSubsections.add(
            subsectionSlug
          );

          if (
            !getArknozSubsection(
              sectionKey,
              subsectionSlug
            )
          ) {
            errors.push(
              `Unknown subsection "${subsectionSlug}" in section "${sectionKey}" on ${entityKey}`
            );
          }
        }
      }
    }
  }

  return {
    valid:
      errors.length === 0,

    errors,

    summary: {
      sections:
        arknozSections.length,

      entities:
        entities.length,

      canonicalGeographyEntities:
        entities.filter(
          (entity) =>
            Boolean(
              entity.geographySlug
            )
        ).length,

      legacyGeographyEntities:
        entities.filter(
          (entity) =>
            !entity.geographySlug
        ).length,
    },
  };
}

export function assertArknozArchitecture() {
  const result =
    validateArknozArchitecture();

  if (!result.valid) {
    throw new Error(
      [
        "Arknoz architecture validation failed:",
        ...result.errors.map(
          (error) => `- ${error}`
        ),
      ].join("\n")
    );
  }

  return result;
}
