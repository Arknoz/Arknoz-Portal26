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
