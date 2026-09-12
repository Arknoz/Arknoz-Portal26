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
  media?: ProjectMedia[];
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
  project?: ProjectRecordData;
};

export const entities: EntityRecord[] = [
  {
    slug: "bosco-verticale",
    type: "project",
    sectionSubsections: { projects: ["buildings"] },
    title: "Bosco Verticale",
    subtitle: "Project",
    geography: "Milan, Italy",
    summary:
      "A pair of residential towers in Milan that integrate living vegetation directly into the architecture.",
    trust: "Completed",
    project: {
      category: "Buildings",
      strapline:
        "Architecture and living nature integrated into one vertical urban habitat.",
      visualStatement:
        "Two residential towers shaped around architecture, vegetation and urban biodiversity.",
      placeHref: "/places/milan",

      media: [
        {
          src: "https://www.arup.com/globalassets/images/projects/b/bosco-verticale/bosco-verticale-header.webp?height=1035&quality=80&width=1840",
          alt: "Bosco Verticale planted residential facade",
        },
        {
          src: "https://www.arup.com/globalassets/images/projects/b/bosco-verticale/bosco-verticale-2.jpg?height=1238&quality=80&width=2200",
          alt: "Bosco Verticale balconies and vegetation",
        },
        {
          src: "https://www.arup.com/globalassets/images/projects/b/bosco-verticale/new_porta_nuova.jpg?height=802&quality=80&width=1200",
          alt: "Bosco Verticale tree engineering detail",
        },
      ],

      understanding:
        "Bosco Verticale is a prototype for integrating substantial living vegetation into high-density residential architecture. The project combines two towers with trees, shrubs and plants distributed according to facade exposure while addressing the engineering demands of planting at height.",

      facts: [
        { label: "Location", value: "Milan, Italy" },
        { label: "Project", value: "Boeri Studio" },
        { label: "Year", value: "2007–2014" },
        { label: "Client", value: "COIMA Sgr" },
        { label: "Heights", value: "110 m / 76 m" },
        { label: "GFA", value: "18,200 m²" },
        { label: "Trees", value: "800" },
        { label: "Plant species", value: "About 100" },
      ],

      anatomy: [
        {
          title: "Two residential towers",
          description:
            "The project consists of two residential towers approximately 110 metres and 76 metres high in Milan's Porta Nuova district.",
        },
        {
          title: "Living facade",
          description:
            "The towers host 800 trees, 4,500 shrubs and around 20,000 plants distributed in relation to the solar exposure of the facades.",
        },
        {
          title: "Tree engineering",
          description:
            "Structural stability of the trees was studied through botanical analysis, wind assessment and wind-tunnel testing.",
        },
        {
          title: "Metro and vibration engineering",
          description:
            "Engineering work also addressed the existing Milan Metro tunnels below the site and vibration effects on the buildings.",
        },
      ],

      timeline: [
        {
          date: "2007",
          title: "Project period begins",
          description:
            "The official project record identifies the development period as 2007–2014.",
        },
        {
          date: "2014",
          title: "Project completed",
          description:
            "The two Vertical Forest towers were completed in Milan.",
        },
        {
          date: "2014",
          title: "International Highrise Award",
          description:
            "Bosco Verticale received the International Highrise Award.",
        },
        {
          date: "2015",
          title: "CTBUH recognition",
          description:
            "The project received global tall-building recognition from CTBUH.",
        },
      ],

      people: [
        {
          role: "Architecture",
          name: "Boeri Studio",
        },
        {
          role: "Architect",
          name: "Stefano Boeri",
          href: "/people/stefano-boeri",
        },
        {
          role: "Structural engineering",
          name: "Arup Italia",
        },
        {
          role: "Facilities design",
          name: "Deerns Italia",
        },
        {
          role: "Landscape / park",
          name: "LAND",
        },
        {
          role: "Botanical consultancy",
          name: "Emanuela Borio & Laura Gatti",
        },
      ],

      sources: [
        {
          label: "Vertical Forest — official project record",
          organisation: "Stefano Boeri Architetti",
          href:
            "https://www.stefanoboeriarchitetti.net/en/project/vertical-forest/",
        },
        {
          label: "Bosco Verticale — engineering project record",
          organisation: "Arup",
          href: "https://www.arup.com/projects/bosco-verticale/",
        },
      ],

      connections: [
        {
          type: "PLACE",
          title: "Milan",
          href: "/places/milan",
          description:
            "The project is located in Milan's Porta Nuova district.",
        },
        {
          type: "PERSON",
          title: "Stefano Boeri",
          href: "/people/stefano-boeri",
          description:
            "Architectural authorship of the project.",
        },
      ],

      learning: [
        {
          title: "Urban Biodiversity",
          href: "/knowledge/urban-biodiversity",
          description:
            "Explore Arknoz knowledge around biodiversity in the Built World.",
        },
      ],
    },
  },

  {
    slug: "wonderwoods-utrecht",
    type: "project",
    sectionSubsections: { projects: ["buildings"] },
    title: "Wonderwoods",
    subtitle: "Project",
    geography: "Utrecht, Netherlands",
    summary:
      "A mixed-use Vertical Forest project in Utrecht by Stefano Boeri Architetti and MVSA Architects.",
    trust: "Completed",
    project: {
      category: "Buildings",
      strapline:
        "A mixed-use vertical forest in the heart of Utrecht.",
      placeHref: "/global",
      understanding:
        "Wonderwoods combines mixed-use urban functions with the Vertical Forest model as part of Utrecht's Beurskwartier regeneration.",
      facts: [
        { label: "Location", value: "Utrecht, Netherlands" },
        { label: "Project", value: "SBA + MVSA Architects" },
        { label: "Year", value: "2017–2025" },
        { label: "Typology", value: "Vertical Forest" },
      ],
      sources: [
        {
          label: "Wonderwoods — official project record",
          organisation: "Stefano Boeri Architetti",
          href: "https://www.stefanoboeriarchitetti.net/en/project/wonderwoods/",
        },
      ],
    },
  },

  {
    slug: "trudo-vertical-forest",
    type: "project",
    sectionSubsections: { projects: ["buildings"] },
    title: "Trudo Vertical Forest",
    subtitle: "Project",
    geography: "Eindhoven, Netherlands",
    summary:
      "A social-housing application of the Vertical Forest model in Eindhoven.",
    trust: "Completed",
    project: {
      category: "Buildings",
      strapline:
        "Vertical Forest architecture applied to social housing.",
      placeHref: "/global",
      understanding:
        "Trudo Vertical Forest applies the Vertical Forest model to social housing, combining compact apartments with planted balconies and shared environmental benefits.",
      facts: [
        { label: "Location", value: "Eindhoven, Netherlands" },
        { label: "Project", value: "Stefano Boeri Architetti" },
        { label: "Year", value: "2017–2021" },
        { label: "Typology", value: "Vertical Forest" },
      ],
      sources: [
        {
          label: "Trudo Vertical Forest — official project record",
          organisation: "Stefano Boeri Architetti",
          href: "https://www.stefanoboeriarchitetti.net/en/project/trudo-vertical-forest/",
        },
      ],
    },
  },

  {
    slug: "nanjing-vertical-forest",
    type: "project",
    sectionSubsections: { projects: ["buildings"] },
    title: "Nanjing Vertical Forest",
    subtitle: "Project",
    geography: "Nanjing, China",
    summary:
      "A two-tower Vertical Forest development in Nanjing integrating architecture and extensive vegetation.",
    trust: "Ongoing",
    project: {
      category: "Buildings",
      strapline:
        "Vertical Forest architecture adapted to the urban context of Nanjing.",
      placeHref: "/global",
      understanding:
        "Nanjing Vertical Forest extends the Vertical Forest typology into a pair of green towers in Nanjing with mixed public, commercial and working functions.",
      facts: [
        { label: "Location", value: "Nanjing, China" },
        { label: "Project", value: "Stefano Boeri Architetti China" },
        { label: "Year", value: "2016–ongoing" },
        { label: "Typology", value: "Vertical Forest" },
      ],
      sources: [
        {
          label: "Nanjing Vertical Forest — official project record",
          organisation: "Stefano Boeri Architetti",
          href: "https://www.stefanoboeriarchitetti.net/en/project/nanjing-vertical-forest/",
        },
      ],
    },
  },
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
    slug: "mass-timber-system",
    type: "product",
    title: "Mass Timber System",
    subtitle: "Product & System",
    geography: "Global",
    geographySlug: "global",
    summary: "A structured material and building-system example.",
    trust: "Technical information",
  },

  {
    slug: "urban-biodiversity",
    type: "knowledge",
    title: "Urban Biodiversity",
    subtitle: "Knowledge",
    geography: "Global",
    geographySlug: "global",
    summary:
      "Research and evidence related to biodiversity in the Built World.",
    trust: "Evidence-led",
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
    sectionSubsections: { opportunities: ["competitions"] },
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
    sectionSubsections: { opportunities: ["fellowships"] },
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





