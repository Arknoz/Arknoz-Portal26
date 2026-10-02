import type { ArknozSectionKey } from "@/lib/arknoz-sections";

export type EntityType =
  | "project"
  | "product"
  | "knowledge"
  | "person"
  | "organisation"
  | "university"
  | "opportunity"
  | "place";

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectMedia = {
  src: string;
  alt?: string;
  role?: string;
  sourceUrl?: string;
  attribution?: string;
  license?: string;
  rightsStatus?: string;
  provenanceStatus?: string;
};

export type ProjectAnatomyItem = {
  title: string;
  description: string;
};

export type ProjectTimelineItem = {
  date: string;
  title: string;
  description?: string;
};

export type ProjectParticipant = {
  role: string;
  name: string;
  href?: string;
};

export type ProjectSource = {
  label: string;
  organisation?: string;
  href: string;
};

export type ProjectConnection = {
  type: string;
  title: string;
  href: string;
  description?: string;
};

export type ProjectLearningLink = {
  title: string;
  href: string;
  description?: string;
};

export type ProjectRecordData = {
  category?: string;
  strapline?: string;
  visualStatement?: string;
  placeHref?: string;
  understanding?: string;
  facts?: ProjectFact[];
  signature?: ProjectFact[];
  media?: ProjectMedia[];
  topics?: string[];
  anatomy?: ProjectAnatomyItem[];
  timeline?: ProjectTimelineItem[];
  people?: ProjectParticipant[];
  sources?: ProjectSource[];
  connections?: ProjectConnection[];
  learning?: ProjectLearningLink[];
};

export type EntityRecord = {
  slug: string;
  type: EntityType;
  sectionSubsections?: Partial<Record<ArknozSectionKey, string[]>>;
  title: string;
  subtitle: string;
  geography: string;
  geographySlug?: string;
  summary: string;
  trust?: string;
  media?: ProjectMedia[];
  project?: ProjectRecordData;
};

export const entities: EntityRecord[] = [

  {
    slug: "holcim-ecopact",
    type: "product",
    title: "Holcim ECOPact",
    subtitle: "Product",
    geography: "Global",
    geographySlug: "global",
    summary:
      "Holcim's range of low-carbon concrete for buildings and infrastructure.",
    trust: "Official source",
  },
  {
    slug: "world-cities-report-2024",
    type: "knowledge",
    title: "World Cities Report 2024",
    subtitle: "Cities and Climate Action",
    geography: "Global",
    geographySlug: "global",
    summary:
      "UN-Habitat's 2024 World Cities Report examines cities and climate action, including urban climate risks, resilience, mitigation and inequality.",
    trust: "Official source",
  },


  {
    slug: "stefano-boeri",
    type: "person",
    title: "Stefano Boeri",
    subtitle: "Person",
    geography: "Italy",
    summary:
      "Professional identity connected to projects and design practice.",
  },

  {
    slug: "white-arkitekter",
    type: "organisation",
    title: "White Arkitekter",
    subtitle: "Organisation",
    geography: "Sweden",
    summary:
      "A practice represented as a canonical organisation.",
  },

  {
    slug: "politecnico-di-milano",
    type: "university",
    title: "Politecnico di Milano",
    subtitle: "University",
    geography: "Milan, Italy",
    summary:
      "University, programmes, research, people and Built World connections.",
  },

  {
    slug: "vancouver-tall-challenge",
    type: "opportunity",
    sectionSubsections: { opportunities: ["competitions-awards"] },
    title: "Vancouver Tall Challenge",
    subtitle: "Competition",
    geography: "Vancouver, Canada",
    summary:
      "An international architecture ideas competition exploring the future of height and density in downtown Vancouver.",
    trust: "Official source",
  },
  {
    slug: "research-fellowship",
    type: "opportunity",
    sectionSubsections: { opportunities: ["grants-funding-fellowships"] },
    title: "Research Fellowship",
    subtitle: "Opportunity",
    geography: "Global",
    geographySlug: "global",
    summary:
      "Example opportunity for research and professional development.",
  },

  {
    slug: "milan",
    type: "place",
    title: "Milan",
    subtitle: "Place",
    geography: "Italy",
    summary:
      "City context connecting projects, people, organisations and knowledge.",
  },
];

export function getEntity(type: EntityType, slug: string) {
  return entities.find(
    (entity) => entity.type === type && entity.slug === slug
  );
}
