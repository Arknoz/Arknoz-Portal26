export type GeographyItem = {
  name: string;
  slug: string;
  type: "global" | "continent" | "country" | "region" | "city" | "place";
  parent?: string;
  subtitle: string;
};

export const geography: GeographyItem[] = [
  {
    name: "Global",
    slug: "global",
    type: "global",
    subtitle: "One connected Built World",
  },

  { name: "Africa", slug: "africa", type: "continent", parent: "global", subtitle: "People, places and potential" },
  { name: "Asia", slug: "asia", type: "continent", parent: "global", subtitle: "Scale, innovation and diversity" },
  { name: "Europe", slug: "europe", type: "continent", parent: "global", subtitle: "Heritage, research and transformation" },
  { name: "North America", slug: "north-america", type: "continent", parent: "global", subtitle: "Innovation, cities and infrastructure" },
  { name: "South America", slug: "south-america", type: "continent", parent: "global", subtitle: "Urban growth and natural systems" },
  { name: "Oceania", slug: "oceania", type: "continent", parent: "global", subtitle: "Cities, islands and resilience" },
  { name: "Antarctica", slug: "antarctica", type: "continent", parent: "global", subtitle: "Research and extreme environments" },

  { name: "India", slug: "india", type: "country", parent: "asia", subtitle: "Growth, knowledge and opportunity" },
  { name: "Singapore", slug: "singapore", type: "country", parent: "asia", subtitle: "Urban innovation and global connections" },
  { name: "United Arab Emirates", slug: "united-arab-emirates", type: "country", parent: "asia", subtitle: "Cities, infrastructure and ambition" },
  { name: "Kenya", slug: "kenya", type: "country", parent: "africa", subtitle: "People, potential and progress" },
  { name: "Japan", slug: "japan", type: "country", parent: "asia", subtitle: "Technology, craft and resilience" },

  { name: "Maharashtra", slug: "maharashtra", type: "region", parent: "india", subtitle: "Regional Built World context" },
  { name: "Mumbai", slug: "mumbai", type: "city", parent: "maharashtra", subtitle: "Projects, people, products and knowledge" },

  { name: "Nairobi", slug: "nairobi", type: "city", parent: "kenya", subtitle: "Projects, people and opportunities" },
];

export function findGeography(slug: string) {
  return geography.find((item) => item.slug === slug);
}

export function getChildren(parent: string) {
  return geography.filter((item) => item.parent === parent);
}
export function getGeographyAncestors(
  slug: string
) {
  const result: GeographyItem[] = [];
  const visited = new Set<string>();

  let current = findGeography(slug);

  while (
    current?.parent &&
    !visited.has(current.parent)
  ) {
    visited.add(current.parent);

    const parent =
      findGeography(current.parent);

    if (!parent) {
      break;
    }

    result.push(parent);
    current = parent;
  }

  return result;
}

export function getGeographyDescendants(
  slug: string
) {
  const result: GeographyItem[] = [];
  const queue = [...getChildren(slug)];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (
      !current ||
      visited.has(current.slug)
    ) {
      continue;
    }

    visited.add(current.slug);
    result.push(current);

    queue.push(
      ...getChildren(current.slug)
    );
  }

  return result;
}

export function getGeographyLineage(
  slug: string
) {
  const current = findGeography(slug);

  if (!current) {
    return [];
  }

  return [
    current,
    ...getGeographyAncestors(slug),
  ];
}

export function isGeographyWithin(
  recordGeoSlug: string,
  contextGeoSlug: string
) {
  if (contextGeoSlug === "global") {
    return true;
  }

  if (recordGeoSlug === contextGeoSlug) {
    return true;
  }

  return getGeographyAncestors(
    recordGeoSlug
  ).some(
    (ancestor) =>
      ancestor.slug === contextGeoSlug
  );
}
export function buildGeographyHref(
  slug: string
) {
  if (slug === "global") {
    return "/global";
  }

  return `/global/${slug}`;
}

export function getGeographyPath(
  slug: string
) {
  const current = findGeography(slug);

  if (!current) {
    return [];
  }

  return [
    ...getGeographyAncestors(slug)
      .reverse(),
    current,
  ];
}

export function getGeographyRoot(
  slug: string
) {
  const path = getGeographyPath(slug);

  return path.length > 0
    ? path[0]
    : undefined;
}

export function getGeographyParent(
  slug: string
) {
  const current = findGeography(slug);

  if (!current?.parent) {
    return undefined;
  }

  return findGeography(current.parent);
}

export function geographyExists(
  slug: string
) {
  return Boolean(
    findGeography(slug)
  );
}

export function validateGeographyTree() {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const item of geography) {
    if (slugs.has(item.slug)) {
      errors.push(
        `Duplicate geography slug: ${item.slug}`
      );
    }

    slugs.add(item.slug);
  }

  for (const item of geography) {
    if (
      item.type !== "global" &&
      !item.parent
    ) {
      errors.push(
        `Missing parent: ${item.slug}`
      );
    }

    if (
      item.parent &&
      !findGeography(item.parent)
    ) {
      errors.push(
        `Unknown parent "${item.parent}" for ${item.slug}`
      );
    }

    const lineage =
      getGeographyLineage(
        item.slug
      );

    const lineageSlugs =
      lineage.map(
        (node) => node.slug
      );

    if (
      new Set(lineageSlugs).size !==
      lineageSlugs.length
    ) {
      errors.push(
        `Circular geography lineage: ${item.slug}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
