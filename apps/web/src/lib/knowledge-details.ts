export type KnowledgeFact = {
  label: string;
  value: string;
};

export type KnowledgeTheme = {
  title: string;
  description: string;
};

export type KnowledgeSource = {
  label: string;
  organisation: string;
  status?: string;
};

export type KnowledgeDetailData = {
  section?: string;
  recordType?: string;

  strapline?: string;
  abstract?: string;

  publisher?: string;
  year?: string;
  pages?: string;
  language?: string;
  geography?: string;

  access?: string;
  rights?: string;

  facts?: KnowledgeFact[];
  themes?: KnowledgeTheme[];
  topics?: string[];
  sources?: KnowledgeSource[];
};

const KNOWLEDGE_DETAILS: Record<
  string,
  KnowledgeDetailData
> = {
  "world-cities-report-2024": {
    section: "Books & Publications",
    recordType: "Report",

    strapline:
      "Cities and Climate Action",

    abstract:
      "World Cities Report 2024 examines the relationship between urbanisation and climate change, including the exposure of cities to climate hazards, the role of cities in emissions, resilience and adaptation, and the unequal effects of climate risk on urban communities.",

    publisher: "UN-Habitat",
    year: "2024",
    pages: "373",
    language: "English",
    geography: "Global",

    access:
      "Official publication source available",

    rights:
      "All rights reserved. Public access does not imply redistribution rights.",

    facts: [
      {
        label: "Type",
        value: "World Cities Report",
      },
      {
        label: "Publisher",
        value: "UN-Habitat",
      },
      {
        label: "Published",
        value: "2024",
      },
      {
        label: "Pages",
        value: "373",
      },
      {
        label: "Coverage",
        value: "Global",
      },
      {
        label: "Language",
        value: "English",
      },
    ],

    themes: [
      {
        title: "Urban climate risk",
        description:
          "Cities face growing exposure to heat, flooding, storms, drought and other climate-related hazards.",
      },
      {
        title: "Adaptation & resilience",
        description:
          "Urban planning, infrastructure and governance influence how cities prepare for and respond to climate impacts.",
      },
      {
        title: "Climate mitigation",
        description:
          "Cities are major centres of population, buildings, infrastructure and economic activity, making urban climate action important to emissions reduction.",
      },
      {
        title: "Equity & vulnerability",
        description:
          "Climate impacts are unevenly distributed, with vulnerable and lower-income urban communities often facing greater exposure and fewer resources.",
      },
    ],

    topics: [
      "Cities & Climate",
      "Urban Resilience",
      "Climate Action",
      "Urban Inequality",
    ],

    sources: [
      {
        label:
          "World Cities Report 2024: Cities and Climate Action",
        organisation: "UN-Habitat",
        status: "Official publication",
      },
      {
        label:
          "World Cities Report 2024 — Executive Summary",
        organisation: "UN-Habitat",
        status: "Official source",
      },
    ],
  },
};

export function getKnowledgeDetail(
  slug: string
): KnowledgeDetailData | undefined {
  return KNOWLEDGE_DETAILS[slug];
}
