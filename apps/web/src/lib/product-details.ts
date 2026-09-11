export type ProductFact = {
  label: string;
  value: string;
};

export type ProductProperty = {
  title: string;
  description: string;
};

export type ProductApplication = {
  title: string;
  description?: string;
};

export type ProductSource = {
  label: string;
  organisation?: string;
  href: string;
};

export type ProductMedia = {
  src: string;
  alt?: string;
};

export type ProductDetailData = {
  category?: string;
  subCategory?: string;

  strapline?: string;
  overview?: string;

  manufacturer?: string;
  manufacturerHref?: string;

  availability?: string;
  officialUrl?: string;

  facts?: ProductFact[];
  properties?: ProductProperty[];
  applications?: ProductApplication[];
  sustainability?: ProductProperty[];
  sources?: ProductSource[];

  topics?: string[];
  media?: ProductMedia[];
};

const PRODUCT_DETAILS: Record<string, ProductDetailData> = {
  "holcim-ecopact": {
    category: "Building Materials",
    subCategory: "Concrete",

    strapline:
      "Lower-carbon concrete designed for buildings and infrastructure.",

    overview:
      "ECOPact is Holcim's range of low-carbon concrete. The manufacturer positions the range for structural and general construction applications while reducing embodied carbon compared with conventional concrete reference mixes.",

    manufacturer: "Holcim",
    manufacturerHref: "https://www.holcim.com/",

    availability: "More than 30 markets",

    officialUrl:
      "https://www.holcim.com/building-materials-solutions/ecopact",

    facts: [
      {
        label: "Product type",
        value: "Low-carbon concrete",
      },
      {
        label: "Manufacturer",
        value: "Holcim",
      },
      {
        label: "Availability",
        value: "30+ markets",
      },
      {
        label: "Carbon",
        value: "At least 30% lower CO₂",
      },
      {
        label: "Performance",
        value: "Conventional-concrete performance",
      },
      {
        label: "Use",
        value: "Buildings & infrastructure",
      },
    ],

    properties: [
      {
        title: "Lower embodied carbon",
        description:
          "Holcim states that ECOPact starts at at least 30% lower CO₂ emissions compared with standard CEM I concrete, without offsets.",
      },
      {
        title: "Performance",
        description:
          "The manufacturer states that ECOPact provides equal or better properties than conventional concrete.",
      },
      {
        title: "Mix flexibility",
        description:
          "The range is offered across different strengths and applications according to local market requirements.",
      },
      {
        title: "Conventional handling",
        description:
          "Holcim states that ECOPact can be placed, pumped and finished like conventional concrete.",
      },
    ],

    applications: [
      {
        title: "Foundations",
        description:
          "Concrete applications at building and infrastructure foundation level.",
      },
      {
        title: "Columns & beams",
        description:
          "Structural frame applications where locally available mixes are suitable.",
      },
      {
        title: "Walls",
        description:
          "Concrete wall applications across appropriate construction types.",
      },
      {
        title: "Driveways & walkways",
        description:
          "External and general concrete applications identified by the manufacturer.",
      },
    ],

    sustainability: [
      {
        title: "Carbon reduction",
        description:
          "Manufacturer-reported reduction starts at 30% compared with standard CEM I concrete without offsets.",
      },
      {
        title: "Circular construction",
        description:
          "The product range uses supplementary cementitious materials and can incorporate recycled construction-demolition materials where local norms allow.",
      },
      {
        title: "Local production",
        description:
          "Holcim describes ECOPact as locally produced across participating markets.",
      },
    ],

    sources: [
      {
        label: "ECOPact — official product record",
        organisation: "Holcim",
        href:
          "https://www.holcim.com/building-materials-solutions/ecopact",
      },
      {
        label: "Sustainable offering",
        organisation: "Holcim",
        href:
          "https://www.holcim.com/sustainable-offering",
      },
    ],

    topics: [
      "Low-carbon concrete",
      "Embodied carbon",
      "Circular construction",
    ],

    // Production media intentionally omitted until Arknoz records
    // appropriate reuse/provenance rights.
    media: [],
  },
};

export function getProductDetail(
  slug: string
): ProductDetailData | undefined {
  return PRODUCT_DETAILS[slug];
}
