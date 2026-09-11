export type EntityType =
  | "project"
  | "product"
  | "knowledge"
  | "person"
  | "organisation"
  | "university"
  | "opportunity"
  | "place";

export type EntityRecord = {
  slug: string;
  type: EntityType;
  title: string;
  subtitle: string;
  geography: string;
  summary: string;
  trust?: string;
};

export const entities: EntityRecord[] = [
  {
    slug: "bosco-verticale",
    type: "project",
    title: "Bosco Verticale",
    subtitle: "Project",
    geography: "Milan, Italy",
    summary: "A built project used to demonstrate connected Arknoz discovery.",
    trust: "Completed project",
  },
  {
    slug: "mass-timber-system",
    type: "product",
    title: "Mass Timber System",
    subtitle: "Product & System",
    geography: "Global",
    summary: "A structured material and building-system example.",
    trust: "Technical information",
  },
  {
    slug: "urban-biodiversity",
    type: "knowledge",
    title: "Urban Biodiversity",
    subtitle: "Knowledge",
    geography: "Global",
    summary: "Research and evidence related to biodiversity in the Built World.",
    trust: "Evidence-led",
  },
  {
    slug: "stefano-boeri",
    type: "person",
    title: "Stefano Boeri",
    subtitle: "Person",
    geography: "Italy",
    summary: "Professional identity connected to projects and design practice.",
  },
  {
    slug: "white-arkitekter",
    type: "organisation",
    title: "White Arkitekter",
    subtitle: "Organisation",
    geography: "Sweden",
    summary: "A practice represented as a canonical organisation.",
  },
  {
    slug: "politecnico-di-milano",
    type: "university",
    title: "Politecnico di Milano",
    subtitle: "University",
    geography: "Milan, Italy",
    summary: "University, programmes, research, people and Built World connections.",
  },
  {
    slug: "research-fellowship",
    type: "opportunity",
    title: "Research Fellowship",
    subtitle: "Opportunity",
    geography: "Global",
    summary: "Example opportunity for research and professional development.",
  },
  {
    slug: "milan",
    type: "place",
    title: "Milan",
    subtitle: "Place",
    geography: "Italy",
    summary: "City context connecting projects, people, organisations and knowledge.",
  },
];

export function getEntity(type: EntityType, slug: string) {
  return entities.find(
    (entity) => entity.type === type && entity.slug === slug
  );
}
