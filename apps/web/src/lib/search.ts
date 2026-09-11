import { entities, type EntityRecord } from "@/lib/entities";
import { geography } from "@/lib/geography";

export type SearchResult =
  | {
      kind: "entity";
      title: string;
      subtitle: string;
      description: string;
      href: string;
      geography: string;
    }
  | {
      kind: "geography";
      title: string;
      subtitle: string;
      description: string;
      href: string;
      geography: string;
    };

const routeByType: Record<EntityRecord["type"], string> = {
  project: "projects",
  product: "products",
  knowledge: "knowledge",
  person: "people",
  organisation: "organisations",
  university: "universities",
  opportunity: "opportunities",
  place: "places",
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchArknoz(query: string): SearchResult[] {
  const q = normalize(query);

  if (!q) return [];

  const entityResults: SearchResult[] = entities
    .filter((entity) => {
      const haystack = normalize(
        [
          entity.title,
          entity.subtitle,
          entity.geography,
          entity.summary,
          entity.trust ?? "",
        ].join(" ")
      );

      return haystack.includes(q);
    })
    .map((entity) => ({
      kind: "entity",
      title: entity.title,
      subtitle: entity.subtitle,
      description: entity.summary,
      geography: entity.geography,
      href: `/${routeByType[entity.type]}/${entity.slug}`,
    }));

  const geographyResults: SearchResult[] = geography
    .filter((item) =>
      normalize(
        `${item.name} ${item.type} ${item.subtitle}`
      ).includes(q)
    )
    .map((item) => ({
      kind: "geography",
      title: item.name,
      subtitle: item.type,
      description: item.subtitle,
      geography: item.parent ?? "Global",
      href:
        item.type === "global"
          ? "/global"
          : `/global/${item.slug}`,
    }));

  return [...entityResults, ...geographyResults];
}
