export type ProfileKind =
  | "person"
  | "organisation"
  | "university";

export type ProfileFact = {
  label: string;
  value: string;
};

export type ProfileFocus = {
  title: string;
  description: string;
};

export type ProfileActivity = {
  label: string;
  title: string;
  description?: string;
  href?: string;
};

export type ProfileSource = {
  label: string;
  organisation: string;
  href: string;
};

export type ProfileConnection = {
  type: string;
  title: string;
  href: string;
  description?: string;
};

export type ProfileDetailData = {
  kind: ProfileKind;

  category: string;
  professionalLine: string;
  tagline: string;
  overview: string;

  location: string;

  officialUrl?: string;
  officialLabel?: string;

  statusLabel?: string;

  facts: ProfileFact[];
  focus: ProfileFocus[];
  activities: ProfileActivity[];
  sources: ProfileSource[];
  connections: ProfileConnection[];
};

const PROFILE_DETAILS: Record<
  string,
  ProfileDetailData
> = {

  // ---------------------------------------------------------
  // PERSON
  // ---------------------------------------------------------

  "stefano-boeri": {
    kind: "person",

    category: "Architects & Urbanists",

    professionalLine:
      "Architect · Urban Planner · Professor",

    tagline:
      "Architecture, urban forestry and the transformation of contemporary cities.",

    overview:
      "Stefano Boeri is an architect and urban planner based in Milan. His professional and academic work spans architecture, urban design, biodiversity and urban forestry, including the Bosco Verticale project and research into the relationship between cities, climate and living systems.",

    location: "Milan, Italy",

    officialUrl:
      "https://www.stefanoboeriarchitetti.net/en/stefano-boeri-biography/",

    officialLabel: "Official biography",

    statusLabel: "Public professional record",

    facts: [
      {
        label: "Profession",
        value: "Architect & urban planner",
      },
      {
        label: "Academic role",
        value: "Full Professor",
      },
      {
        label: "Institution",
        value: "Politecnico di Milano",
      },
      {
        label: "Location",
        value: "Milan, Italy",
      },
      {
        label: "Practice",
        value: "Stefano Boeri Architetti",
      },
      {
        label: "Academic field",
        value: "Urban planning",
      },
    ],

    focus: [
      {
        title: "Urban Forestry",
        description:
          "Research and design exploring the integration of vegetation, biodiversity and urban environments.",
      },
      {
        title: "Urban Planning",
        description:
          "Planning and urban-design work addressing transformation at metropolitan and city scales.",
      },
      {
        title: "Biodiversity",
        description:
          "Built World approaches that consider coexistence between human, plant and animal species.",
      },
      {
        title: "Climate & Cities",
        description:
          "Architectural and urban questions connected to environmental and climate challenges.",
      },
    ],

    activities: [
      {
        label: "PROJECT",
        title: "Bosco Verticale",
        description:
          "Residential towers in Milan integrating substantial living vegetation into the architecture.",
        href: "/projects/bosco-verticale",
      },
      {
        label: "ACADEMIC",
        title: "Politecnico di Milano",
        description:
          "Full Professor in the Department of Architecture and Urban Studies.",
        href:
          "/universities/politecnico-di-milano",
      },
      {
        label: "KNOWLEDGE",
        title: "Urban Biodiversity",
        description:
          "Connected Arknoz knowledge context.",
        href: "/knowledge/urban-biodiversity",
      },
    ],

    sources: [
      {
        label: "Stefano Boeri — official biography",
        organisation:
          "Stefano Boeri Architetti",
        href:
          "https://www.stefanoboeriarchitetti.net/en/stefano-boeri-biography/",
      },
      {
        label: "Stefano Boeri — faculty record",
        organisation:
          "Politecnico di Milano",
        href:
          "https://www.dastu.polimi.it/it/personale/stefano.boeri",
      },
    ],

    connections: [
      {
        type: "PROJECT",
        title: "Bosco Verticale",
        href: "/projects/bosco-verticale",
        description:
          "Architectural authorship connection.",
      },
      {
        type: "UNIVERSITY",
        title: "Politecnico di Milano",
        href:
          "/universities/politecnico-di-milano",
        description:
          "Current academic affiliation.",
      },
      {
        type: "KNOWLEDGE",
        title: "Urban Biodiversity",
        href: "/knowledge/urban-biodiversity",
        description:
          "Related Built World knowledge.",
      },
    ],
  },


  // ---------------------------------------------------------
  // ORGANISATION
  // ---------------------------------------------------------

  "white-arkitekter": {
    kind: "organisation",

    category: "Architecture & Design Practices",

    professionalLine:
      "Architecture · Urban Design · Research",

    tagline:
      "Employee-owned architecture and design practice working toward more sustainable built environments.",

    overview:
      "White Arkitekter is a Scandinavian architecture practice founded in Gothenburg in 1951. The practice works across architecture and the wider built environment and describes employee ownership, collaboration, research and sustainability as central to its organisation and work.",

    location: "Gothenburg, Sweden",

    officialUrl:
      "https://whitearkitekter.com/about-white/",

    officialLabel: "Official website",

    statusLabel: "Official organisation record",

    facts: [
      {
        label: "Type",
        value: "Architecture practice",
      },
      {
        label: "Founded",
        value: "1951",
      },
      {
        label: "Head office",
        value: "Gothenburg, Sweden",
      },
      {
        label: "Ownership",
        value: "Employee-owned",
      },
      {
        label: "Presence",
        value: "Sweden, UK, Germany, Canada",
      },
      {
        label: "Research",
        value: "White Research Lab",
      },
    ],

    focus: [
      {
        title: "Architecture",
        description:
          "Architecture across multiple building and civic typologies.",
      },
      {
        title: "Urban Development",
        description:
          "Planning and urban-development work across built environments.",
      },
      {
        title: "Landscape & Interiors",
        description:
          "Landscape architecture, interior architecture and design expertise.",
      },
      {
        title: "Research & Sustainability",
        description:
          "Applied research and sustainability work integrated with professional practice.",
      },
    ],

    activities: [
      {
        label: "PRACTICE",
        title: "Architecture",
        description:
          "Design practice operating across multiple sectors.",
      },
      {
        label: "RESEARCH",
        title: "White Research Lab",
        description:
          "The practice's platform for applied research and development.",
      },
      {
        label: "PRESENCE",
        title: "International offices",
        description:
          "Official presence includes Sweden, the United Kingdom, Germany and Canada.",
      },
    ],

    sources: [
      {
        label: "About White",
        organisation: "White Arkitekter",
        href:
          "https://whitearkitekter.com/about-white/",
      },
      {
        label: "Offices and contact",
        organisation: "White Arkitekter",
        href:
          "https://whitearkitekter.com/contact-us/",
      },
    ],

    connections: [],
  },


  // ---------------------------------------------------------
  // UNIVERSITY
  // ---------------------------------------------------------

  "politecnico-di-milano": {
    kind: "university",

    category: "Universities & Institutions",

    professionalLine:
      "Architecture · Engineering · Design",

    tagline:
      "A public scientific-technological university connecting education, research and the productive world.",

    overview:
      "Politecnico di Milano is a public scientific-technological university educating engineers, architects and industrial designers. Its institutional mission connects teaching, research, innovation, technology transfer and relationships with industry and public administration.",

    location: "Milan, Italy",

    officialUrl:
      "https://www.polimi.it/en/the-politecnico/about-polimi",

    officialLabel: "Official university",

    statusLabel: "Official institution record",

    facts: [
      {
        label: "Type",
        value: "Public university",
      },
      {
        label: "Location",
        value: "Milan, Italy",
      },
      {
        label: "Fields",
        value: "Engineering, Architecture, Design",
      },
      {
        label: "Programmes",
        value: "70+ programmes",
      },
      {
        label: "Activity",
        value: "Teaching & research",
      },
      {
        label: "Context",
        value: "Scientific-technological",
      },
    ],

    focus: [
      {
        title: "Architecture",
        description:
          "Architecture and Built Environment education and research.",
      },
      {
        title: "Engineering",
        description:
          "Engineering disciplines spanning multiple scientific and technological fields.",
      },
      {
        title: "Design",
        description:
          "Industrial and design education integrated within the university.",
      },
      {
        title: "Research & Innovation",
        description:
          "Research, experimental development and technology-transfer relationships.",
      },
    ],

    activities: [
      {
        label: "PROGRAMME",
        title: "Architectural Design",
        description:
          "Bachelor of Science programme in architectural design.",
      },
      {
        label: "PROGRAMME",
        title: "Building Engineering / Architecture",
        description:
          "Integrated architectural and engineering education.",
      },
      {
        label: "PROGRAMME",
        title: "Architectural Engineering",
        description:
          "Master of Science programme focused on high-performance and lower-impact buildings.",
      },
    ],

    sources: [
      {
        label: "About Polimi",
        organisation:
          "Politecnico di Milano",
        href:
          "https://www.polimi.it/en/the-politecnico/about-polimi",
      },
      {
        label: "Politecnico programmes",
        organisation:
          "Politecnico di Milano",
        href:
          "https://www.polimi.it/en/prospective-students/politecnico-programmes",
      },
    ],

    connections: [
      {
        type: "PERSON",
        title: "Stefano Boeri",
        href: "/people/stefano-boeri",
        description:
          "Current faculty affiliation.",
      },
    ],
  },
};

export function getProfileDetail(
  slug: string
): ProfileDetailData | undefined {
  return PROFILE_DETAILS[slug];
}
