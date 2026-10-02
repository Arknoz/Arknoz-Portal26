import UniversalRunningRail from "@/components/UniversalRunningRail";

import type {
  EntityRecord,
} from "@/lib/entities";


export type ArknozShowcaseType =
  | "featured"
  | "editors-choice"
  | "member-choice";


const presentation = {
  featured: {
    eyebrow: "ARKNOZ FEATURED",
    title: "Featured across Arknoz.",
    direction: "forward" as const,
    viewAll: "View all featured",
  },

  "editors-choice": {
    eyebrow: "EDITOR'S CHOICE",
    title: "Selected by Arknoz.",
    direction: "reverse" as const,
    viewAll: "Explore selections",
  },

  "member-choice": {
    eyebrow: "MEMBERS CHOICE",
    title: "What Arknoz members are discovering.",
    direction: "forward" as const,
    viewAll: "Explore member choices",
  },
};


function entityHref(
  entity: EntityRecord
): string {

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

  return "/explore";
}


function entityImage(
  entity: EntityRecord
) {

  if (
    entity.type === "project" &&
    entity.project?.media?.[0]?.src
  ) {
    return entity.project.media[0].src;
  }

  return "/visuals/portal/knowledge.png";
}


export default function ShowcaseChapter({
  type,
  items,
  contextLabel,
  viewAllHref,
}: {
  type: ArknozShowcaseType;
  items: EntityRecord[];
  contextLabel?: string;
  viewAllHref?: string;
}) {

  if (!items.length) {
    return null;
  }

  const config =
    presentation[type];


  return (
    <UniversalRunningRail
      eyebrow={config.eyebrow}
      title={
        contextLabel
          ? `${config.title} · ${contextLabel}`
          : config.title
      }
      items={
        items
          .slice(0, 10)
          .map((entity) => ({
            eyebrow:
              entity.subtitle ||
              entity.type.toUpperCase(),

            title:
              entity.title,

            context:
              entity.geography,

            href:
              entityHref(entity),

            image:
              entityImage(entity),
          }))
      }
      viewAllHref={viewAllHref}
      viewAllLabel={config.viewAll}
      direction={config.direction}
      dataName={type}
    />
  );
}