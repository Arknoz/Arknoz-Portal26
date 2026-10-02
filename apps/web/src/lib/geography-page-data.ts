import { resolvePortalImage } from "@/lib/portal-image";
import {
  entities,
  type EntityRecord,
} from "@/lib/entities";

import {
  type GeographyItem,
} from "@/lib/geography";

import {
  entityMatchesGeography,
} from "@/lib/entity-geography";

import {
  getProductionEntities,
} from "@/lib/data/production-entities";

import {
  getActivePlacementEntityRef,
} from "@/lib/placement-data";

import {
  getDevelopmentPlacementEntity,
} from "@/lib/development-placement-preview";

import {
  getAllFeaturedResolverSlots,
} from "@/lib/featured-slots";


export type GeographyDisplayRecord = {
  type: string;
  title: string;
  subtitle: string;
  context: string;
  href: string;
  image: string;
};


function entityHref(
  entity: EntityRecord
) {

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


function entityImage(
  entity: EntityRecord
) {
  const realImage =
    entity.type === "project"
      ? entity.project?.media?.[0]?.src
      : null;

  return resolvePortalImage({
    src: realImage,
    kind: entity.type,
  });
}


function displayRecord(
  entity: EntityRecord
): GeographyDisplayRecord {

  const preview =
    process.env.NODE_ENV === "development" &&
    entity.trust === "Candidate · Unverified";

  return {
    type:
      entity.type,

    title:
      entity.title,

    subtitle:
      entity.subtitle,

    context:
      entity.geography,

    href:
      preview &&
      entity.type === "project"
        ? `/preview/projects/${entity.slug}`
        : entityHref(entity),

    image:
      entityImage(entity),
  };
}


export async function getGeographyPageData(
  context: GeographyItem
) {

  const production =
    await getProductionEntities();


  const combined =
    new Map<string, EntityRecord>();


  for (const entity of entities) {

    combined.set(
      `${entity.type}:${entity.slug}`,
      entity
    );
  }


  for (const entity of production) {

    combined.set(
      `${entity.type}:${entity.slug}`,
      entity
    );
  }


  const records =
    [...combined.values()]
      .filter(
        (entity) =>
          entityMatchesGeography(
            entity,
            context
          )
      );


  const resolverSlots =
    getAllFeaturedResolverSlots()
      .map(
        (item) =>
          item.resolverSlotId
      );


  const featured: EntityRecord[] = [];


  for (
    let index = 0;
    index < resolverSlots.length;
    index++
  ) {

    const slotId =
      resolverSlots[index];


    const ref =
      getActivePlacementEntityRef(
        slotId,
        context.slug
      );


    let selected:
      EntityRecord | undefined;


    if (
      ref &&
      ref.type === "project"
    ) {

      selected =
        production.find(
          (candidate) =>
            candidate.type === "project" &&
            candidate.slug === ref.slug
        );
    }


    if (
      !selected &&
      process.env.NODE_ENV === "development"
    ) {

      selected =
        getDevelopmentPlacementEntity(
          slotId,
          context.slug
        ) ?? undefined;
    }


    if (
      !selected ||
      !entityMatchesGeography(
        selected,
        context
      )
    ) {
      continue;
    }


    if (
      !featured.some(
        (item) =>
          item.type === selected.type &&
          item.slug === selected.slug
      )
    ) {
      featured.push(selected);
    }


    if (featured.length >= 12) {
      break;
    }
  }


  return {
    records:
      records.map(displayRecord),

    featured:
      featured.map(displayRecord),
  };
}