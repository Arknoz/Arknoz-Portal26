import { NextResponse } from "next/server";

import { entityMatchesGeography } from "@/lib/entity-geography";
import { findGeography } from "@/lib/geography";
import {
  arknozSections,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";
import { getProductionEntities } from "@/lib/data/production-entities";

import type {
  EntityRecord,
  EntityType,
} from "@/lib/entities";


export const dynamic = "force-dynamic";
export const revalidate = 0;


function normalizeText(
  value: string
) {

  return value
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]/g, " ")
    .replace(
      /[^a-z0-9\s]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}


function toSlug(
  value: string
) {

  return normalizeText(value)
    .replace(/\s+/g, "-");
}


const aliases:
  Record<string, string[]> = {

  job: [
    "jobs",
    "career",
    "careers",
  ],

  jobs: [
    "job",
    "career",
    "careers",
  ],

  career: [
    "careers",
    "job",
    "jobs",
  ],

  careers: [
    "career",
    "job",
    "jobs",
  ],

  university: [
    "universities",
  ],

  universities: [
    "university",
  ],

  course: [
    "courses",
  ],

  courses: [
    "course",
  ],

  project: [
    "projects",
  ],

  projects: [
    "project",
  ],

  product: [
    "products",
  ],

  products: [
    "product",
  ],

};


function tokenVariants(
  token: string
) {

  const values =
    new Set<string>();


  values.add(token);


  if (
    token.length > 4 &&
    token.endsWith("ies")
  ) {
    values.add(
      `${token.slice(0, -3)}y`
    );
  }


  if (
    token.length > 3 &&
    token.endsWith("s") &&
    !token.endsWith("ss")
  ) {
    values.add(
      token.slice(0, -1)
    );
  }


  if (
    token.length > 3 &&
    !token.endsWith("s")
  ) {
    values.add(
      `${token}s`
    );
  }


  for (
    const alias of
    aliases[token] ?? []
  ) {
    values.add(alias);
  }


  return Array.from(values);
}


function includesToken(
  field: string,
  token: string
) {

  return tokenVariants(token)
    .some(
      (variant) =>
        field.includes(
          variant
        )
    );
}


function matchesAllTerms(
  field: string,
  terms: string[]
) {

  return terms.every(
    (term) =>
      includesToken(
        field,
        term
      )
  );
}


function getSubsectionText(
  entity: EntityRecord
) {

  const values =
    Object.values(
      entity.sectionSubsections ??
      {}
    )
      .flat()
      .filter(
        (
          value
        ): value is string =>
          typeof value ===
          "string"
      );


  return normalizeText(
    values.join(" ")
  );
}


type SectionIntent = {
  key: ArknozSectionKey;
  title: string;
  entityTypes: readonly EntityType[];
};


type SubsectionIntent = {
  sectionKey: ArknozSectionKey;
  slug: string;
  label: string;
  entityTypes: readonly EntityType[];
};


function findSectionIntent(
  query: string
): SectionIntent | undefined {

  const normalized =
    normalizeText(query);


  return arknozSections
    .map(
      (section) => ({
        key:
          section.key,

        title:
          section.title,

        entityTypes:
          section.entityTypes as readonly EntityType[],
      })
    )
    .find(
      (section) =>
        normalizeText(
          section.title
        ) === normalized ||
        normalizeText(
          section.key
        ) === normalized
    );
}


function findSubsectionIntent(
  query: string
): SubsectionIntent | undefined {

  const normalized =
    normalizeText(query);

  const terms =
    normalized
      .split(" ")
      .filter(
        (term) =>
          term !== "and" &&
          term !== "the" &&
          term !== "of"
      );


  if (
    terms.length === 0
  ) {
    return undefined;
  }


  const candidates =
    arknozSections.flatMap(
      (section) =>
        (
          section.subsections ??
          []
        ).map(
          (subsection) => ({

            sectionKey:
              section.key,

            slug:
              subsection.slug,

            label:
              subsection.label,

            entityTypes:
              section.entityTypes as readonly EntityType[],

            searchable:
              normalizeText(
                `${subsection.label} ${subsection.slug}`
              ),
          })
        )
    );


  const exact =
    candidates.find(
      (candidate) =>
        normalizeText(
          candidate.label
        ) === normalized ||
        normalizeText(
          candidate.slug
        ) === normalized
    );


  if (exact) {

    return {
      sectionKey:
        exact.sectionKey,

      slug:
        exact.slug,

      label:
        exact.label,

      entityTypes:
        exact.entityTypes,
    };
  }


  const matching =
    candidates
      .filter(
        (candidate) =>
          matchesAllTerms(
            candidate.searchable,
            terms
          )
      )
      .sort(
        (a, b) =>
          a.searchable.length -
          b.searchable.length
      );


  if (
    matching.length !== 1
  ) {
    return undefined;
  }


  const candidate =
    matching[0];


  return {
    sectionKey:
      candidate.sectionKey,

    slug:
      candidate.slug,

    label:
      candidate.label,

    entityTypes:
      candidate.entityTypes,
  };
}


function entityMatchesSubsectionIntent(
  entity: EntityRecord,
  intent: SubsectionIntent
) {

  const assigned =
    entity.sectionSubsections?.[
      intent.sectionKey
    ] ?? [];


  return assigned.includes(
    intent.slug
  );
}


function scoreText(
  entity: EntityRecord,
  query: string
) {

  const normalizedQuery =
    normalizeText(query);


  const terms =
    normalizedQuery
      .split(" ")
      .filter(Boolean);


  if (
    terms.length === 0
  ) {
    return 0;
  }


  const title =
    normalizeText(
      entity.title ?? ""
    );

  const subtitle =
    normalizeText(
      entity.subtitle ?? ""
    );

  const summary =
    normalizeText(
      entity.summary ?? ""
    );

  const geography =
    normalizeText(
      entity.geography ?? ""
    );

  const type =
    normalizeText(
      entity.type ?? ""
    );

  const subsections =
    getSubsectionText(
      entity
    );


  let score = 0;


  if (
    title ===
    normalizedQuery
  ) {
    score += 2000;
  }
  else if (
    title.startsWith(
      normalizedQuery
    )
  ) {
    score += 1200;
  }
  else if (
    title.includes(
      normalizedQuery
    )
  ) {
    score += 850;
  }


  if (
    subtitle ===
    normalizedQuery
  ) {
    score += 700;
  }
  else if (
    subtitle.includes(
      normalizedQuery
    )
  ) {
    score += 350;
  }


  let matchedTerms = 0;


  for (
    const term of terms
  ) {

    let matched =
      false;


    if (
      includesToken(
        title,
        term
      )
    ) {
      score += 200;
      matched = true;
    }


    if (
      includesToken(
        subtitle,
        term
      )
    ) {
      score += 120;
      matched = true;
    }


    if (
      includesToken(
        subsections,
        term
      )
    ) {
      score += 110;
      matched = true;
    }


    if (
      includesToken(
        geography,
        term
      )
    ) {
      score += 90;
      matched = true;
    }


    if (
      includesToken(
        type,
        term
      )
    ) {
      score += 70;
      matched = true;
    }


    if (
      includesToken(
        summary,
        term
      )
    ) {
      score += 35;
      matched = true;
    }


    if (matched) {
      matchedTerms += 1;
    }
  }


  if (
    matchedTerms !==
    terms.length
  ) {
    return 0;
  }


  return score;
}


function toSearchResult(
  entity: EntityRecord
): EntityRecord {

  return {
    slug:
      entity.slug,

    type:
      entity.type,

    title:
      entity.title,

    subtitle:
      entity.subtitle ?? "",

    geography:
      entity.geography ?? "Global",

    geographySlug:
      entity.geographySlug,

    summary:
      entity.summary ?? "",

    trust:
      entity.trust,

    sectionSubsections:
      entity.sectionSubsections,
  };
}


export async function GET(
  request: Request
) {

  try {

    const url =
      new URL(
        request.url
      );


    const query =
      (
        url.searchParams.get(
          "q"
        ) ?? ""
      ).trim();


    const world =
      (
        url.searchParams.get(
          "world"
        ) ?? "all"
      ).trim();


    const explicitGeoSlug =
      (
        url.searchParams.get(
          "geo"
        ) ?? ""
      ).trim();


    if (!query) {

      return NextResponse.json({
        query,
        total: 0,
        results: [],
      });
    }


    const sectionIntent =
      findSectionIntent(
        query
      );


    const subsectionIntent =
      sectionIntent
        ? undefined
        : findSubsectionIntent(
            query
          );


    const inferredGeography =
      !explicitGeoSlug
        ? findGeography(
            toSlug(query)
          )
        : undefined;


    const geography =
      explicitGeoSlug
        ? findGeography(
            explicitGeoSlug
          )
        : inferredGeography;


    const records =
      await getProductionEntities();


    const ranked =
      records
        .filter(
          (entity) => {

            if (
              world !== "all" &&
              entity.type !== world
            ) {
              return false;
            }


            if (
              sectionIntent &&
              !sectionIntent.entityTypes.includes(
                entity.type
              )
            ) {
              return false;
            }


            if (
              subsectionIntent &&
              !entityMatchesSubsectionIntent(
                entity,
                subsectionIntent
              )
            ) {
              return false;
            }


            if (
              geography &&
              geography.type !==
                "global" &&
              !entityMatchesGeography(
                entity,
                geography
              )
            ) {
              return false;
            }


            return true;
          }
        )
        .map(
          (entity) => {

            let score =
              scoreText(
                entity,
                query
              );


            if (
              sectionIntent
            ) {
              score += 900;
            }


            if (
              subsectionIntent
            ) {
              score += 1200;
            }


            if (
              geography &&
              !explicitGeoSlug
            ) {
              score += 1000;
            }


            return {
              entity,
              score,
            };
          }
        )
        .filter(
          (item) => {

            if (
              sectionIntent ||
              subsectionIntent ||
              (
                geography &&
                !explicitGeoSlug
              )
            ) {
              return true;
            }


            return (
              item.score >
              0
            );
          }
        )
        .sort(
          (a, b) => {

            if (
              b.score !==
              a.score
            ) {
              return (
                b.score -
                a.score
              );
            }


            return a.entity.title.localeCompare(
              b.entity.title
            );
          }
        );


    const results =
      ranked
        .slice(
          0,
          60
        )
        .map(
          (item) =>
            toSearchResult(
              item.entity
            )
        );


    return NextResponse.json({

      query,

      world,

      intent: {
        section:
          sectionIntent?.key ??
          null,

        subsection:
          subsectionIntent?.slug ??
          null,

        geography:
          geography?.slug ??
          null,
      },

      total:
        ranked.length,

      results,

    });

  }
  catch (error) {

    console.error(
      "[Arknoz search]",
      error
    );


    return NextResponse.json(
      {
        error:
          "Search is temporarily unavailable.",

        results: [],
      },
      {
        status: 500,
      }
    );
  }
}