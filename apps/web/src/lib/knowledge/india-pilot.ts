export type KnowledgeSection =
  | "books-publications"
  | "research-innovation"
  | "case-studies-solutions"
  | "standards-references"
  | "methods-practice"
  | "ideas-insights";

export type IndiaKnowledgeRecord = {
  slug: string;
  title: string;
  section: KnowledgeSection;
  domain: string;
  publisher: string;
  year?: string;
  geography: "India";
  summary: string;
  topics: string[];
  sourceUrl: string | null;
  trust: "Official source";
  featured?: boolean;
};

export const INDIA_KNOWLEDGE_RECORDS: IndiaKnowledgeRecord[] = [

  // ============================================================
  // 01 — BOOKS & PUBLICATIONS
  // ============================================================

  {
    slug: "reforms-urban-planning-capacity-india",
    title: "Reforms in Urban Planning Capacity in India",
    section: "books-publications",
    domain: "Urban Planning & Design",
    publisher: "NITI Aayog",
    year: "2021",
    geography: "India",
    summary:
      "A national review of India's urban planning capacity, governance, professional resources, planning education and institutional reform.",
    topics: ["Urban Planning", "Governance", "Planning Capacity"],
    sourceUrl: null,
    trust: "Official source",
    featured: true,
  },

  {
    slug: "compendium-emerging-construction-technologies-4",
    title:
      "Compendium of Emerging Construction Technologies for Housing & Infrastructure - Fourth Edition",
    section: "books-publications",
    domain: "Materials & Building Systems",
    publisher: "BMTPC",
    year: "2023",
    geography: "India",
    summary:
      "A structured compendium of emerging construction technologies relevant to housing and infrastructure delivery in India.",
    topics: ["Construction Technology", "Housing", "Innovation"],
    sourceUrl: null,
    trust: "Official source",
    featured: true,
  },

  {
    slug: "waste-wise-cities",
    title:
      "Waste-Wise Cities: Best Practices in Municipal Solid Waste Management",
    section: "books-publications",
    domain: "Infrastructure & Urban Systems",
    publisher: "NITI Aayog",
    year: "2021",
    geography: "India",
    summary:
      "A collection of Indian city practices and approaches to municipal solid waste management.",
    topics: ["Solid Waste", "Urban Services", "Circular Economy"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "composite-water-management-index-2",
    title: "Composite Water Management Index 2.0",
    section: "books-publications",
    domain: "Infrastructure & Urban Systems",
    publisher: "NITI Aayog",
    year: "2019",
    geography: "India",
    summary:
      "A national framework examining water-management performance across Indian states and union territories.",
    topics: ["Water", "Infrastructure", "Governance"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "replicable-energy-efficient-residential-designs",
    title:
      "Handbook of Replicable Designs for Energy Efficient Residential Buildings",
    section: "books-publications",
    domain: "Architecture & Building Design",
    publisher: "Bureau of Energy Efficiency",
    geography: "India",
    summary:
      "Design guidance for improving energy performance in residential buildings across Indian climatic conditions.",
    topics: ["Residential Design", "Energy Efficiency", "Climate"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "handbook-of-landscape-cpwd",
    title: "A Handbook of Landscape",
    section: "books-publications",
    domain: "Landscape & Public Realm",
    publisher: "Central Public Works Department",
    geography: "India",
    summary:
      "CPWD reference material covering landscape planning, horticulture and landscape development practice.",
    topics: ["Landscape", "Horticulture", "Public Realm"],
    sourceUrl: null,
    trust: "Official source",
  },


  // ============================================================
  // 02 — RESEARCH & INNOVATION
  // ============================================================

  {
    slug: "study-on-smart-homes-india",
    title: "Study on Smart Homes",
    section: "research-innovation",
    domain: "MEP & Building Services",
    publisher: "Bureau of Energy Efficiency",
    geography: "India",
    summary:
      "Research examining smart-home technologies and their relationship with residential energy performance.",
    topics: ["Smart Homes", "Building Services", "Energy"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "district-cooling-roadmap-india",
    title: "District Cooling Roadmap for India",
    section: "research-innovation",
    domain: "MEP & Building Services",
    publisher: "Bureau of Energy Efficiency",
    geography: "India",
    summary:
      "A roadmap examining district cooling as an energy-efficient approach to large-scale cooling demand.",
    topics: ["District Cooling", "HVAC", "Energy"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "future-proofing-indias-cooling",
    title: "Future-Proofing India's Cooling",
    section: "research-innovation",
    domain: "Sustainability, Energy & Climate",
    publisher: "Bureau of Energy Efficiency",
    geography: "India",
    summary:
      "Research focused on India's growing cooling demand and pathways toward more efficient and sustainable cooling.",
    topics: ["Cooling", "Climate", "Energy Efficiency"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "residential-retrofit-four-climates",
    title:
      "Energy-Efficient Retrofit Manuals: Transforming Existing Buildings - Residential, 4 Climates",
    section: "research-innovation",
    domain: "Architecture & Building Design",
    publisher: "Bureau of Energy Efficiency",
    geography: "India",
    summary:
      "Climate-responsive retrofit guidance for improving energy performance of India's existing residential buildings.",
    topics: ["Retrofit", "Housing", "Climate Responsive Design"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "treated-wastewater-trading-mechanism",
    title:
      "Water Trading Mechanism to Promote Reuse of Treated Wastewater",
    section: "research-innovation",
    domain: "Infrastructure & Urban Systems",
    publisher: "NITI Aayog",
    year: "2023",
    geography: "India",
    summary:
      "An examination of mechanisms that can support reuse and market-based allocation of treated wastewater.",
    topics: ["Wastewater", "Reuse", "Water Infrastructure"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "thermal-properties-building-materials",
    title:
      "Thermal Properties of Building Materials and Construction Technologies",
    section: "research-innovation",
    domain: "Materials & Building Systems",
    publisher: "BMTPC",
    geography: "India",
    summary:
      "Technical knowledge on thermal behaviour of building materials and construction technologies used in India.",
    topics: ["Materials", "Thermal Performance", "Building Physics"],
    sourceUrl: null,
    trust: "Official source",
  },


  // ============================================================
  // 03 — CASE STUDIES & SOLUTIONS
  // ============================================================

  {
    slug: "piloting-innovative-technologies-demonstration-construction",
    title:
      "Piloting Innovative Technologies Through Demonstration Construction",
    section: "case-studies-solutions",
    domain: "Construction & Project Delivery",
    publisher: "BMTPC",
    year: "2022",
    geography: "India",
    summary:
      "Documented application of innovative building technologies through demonstration construction projects.",
    topics: ["Demonstration Projects", "Innovation", "Construction"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "innovative-housing-technologies-pmay-u",
    title: "Use of Innovative Housing Technologies under PMAY(U)",
    section: "case-studies-solutions",
    domain: "Housing, Development & Real Estate",
    publisher: "BMTPC",
    year: "2022",
    geography: "India",
    summary:
      "Examples of innovative construction technologies applied to housing delivery under PMAY(U).",
    topics: ["Affordable Housing", "PMAY(U)", "Construction Technology"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "best-practices-water-management-2",
    title: "Compendium of Best Practices in Water Management - 2.0",
    section: "case-studies-solutions",
    domain: "Infrastructure & Urban Systems",
    publisher: "NITI Aayog",
    geography: "India",
    summary:
      "A collection of practical Indian approaches and examples in water-resource management.",
    topics: ["Water Management", "Best Practice", "Infrastructure"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "all-weather-tap-water-himalayas",
    title:
      "Compendium on All Weather Tap Water Supply in the Higher Reaches of the Himalayas",
    section: "case-studies-solutions",
    domain: "Infrastructure & Urban Systems",
    publisher: "NITI Aayog",
    geography: "India",
    summary:
      "Solutions and field practices addressing reliable tap-water supply in challenging Himalayan conditions.",
    topics: ["Water Supply", "Himalayas", "Climate Resilience"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "circular-economy-municipal-solid-liquid-waste",
    title: "Circular Economy in Municipal Solid and Liquid Waste",
    section: "case-studies-solutions",
    domain: "Sustainability, Energy & Climate",
    publisher: "Ministry of Housing and Urban Affairs",
    geography: "India",
    summary:
      "Indian circular-economy approaches and case material for municipal solid, liquid and construction waste streams.",
    topics: ["Circular Economy", "Waste", "C&D Waste"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "demonstration-housing-projects-bmtpc",
    title: "Demonstration Housing Projects",
    section: "case-studies-solutions",
    domain: "Housing, Development & Real Estate",
    publisher: "BMTPC",
    geography: "India",
    summary:
      "Demonstration housing projects showing practical application of alternative and emerging construction technologies.",
    topics: ["Housing", "Demonstration", "Building Technology"],
    sourceUrl: null,
    trust: "Official source",
  },


  // ============================================================
  // 04 — STANDARDS & REFERENCES
  // ============================================================

  {
    slug: "national-building-code-india-2016",
    title: "National Building Code of India 2016",
    section: "standards-references",
    domain: "Civil & Structural Engineering",
    publisher: "Bureau of Indian Standards",
    year: "2016",
    geography: "India",
    summary:
      "India's comprehensive model code covering building administration, fire safety, structures, materials, services, sustainability and asset management.",
    topics: ["Building Code", "Safety", "Construction"],
    sourceUrl: null,
    trust: "Official source",
    featured: true,
  },

  {
    slug: "energy-conservation-building-code-2017",
    title: "Energy Conservation Building Code 2017",
    section: "standards-references",
    domain: "MEP & Building Services",
    publisher: "Bureau of Energy Efficiency",
    year: "2017",
    geography: "India",
    summary:
      "Minimum energy-performance requirements for commercial buildings covering envelope, HVAC, lighting and related systems.",
    topics: ["ECBC", "Energy", "Commercial Buildings"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "eco-niwas-samhita-2018",
    title: "Eco Niwas Samhita 2018",
    section: "standards-references",
    domain: "Architecture & Building Design",
    publisher: "Bureau of Energy Efficiency",
    year: "2018",
    geography: "India",
    summary:
      "Residential building energy-code provisions focused on envelope performance, daylight and natural ventilation.",
    topics: ["Residential", "Envelope", "Energy Code"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "harmonised-accessibility-guidelines-2015",
    title:
      "Harmonised Guidelines and Space Standards on Barrier Free Built Environment for Persons with Disability and Elderly Persons",
    section: "standards-references",
    domain: "Interiors & Fit-out",
    publisher: "Ministry of Urban Development",
    year: "2015",
    geography: "India",
    summary:
      "Accessibility guidance and dimensional standards for creating inclusive and barrier-free built environments.",
    topics: ["Accessibility", "Universal Design", "Interiors"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "national-transit-oriented-development-policy",
    title: "National Transit Oriented Development Policy",
    section: "standards-references",
    domain: "Urban Planning & Design",
    publisher: "Ministry of Housing and Urban Affairs",
    geography: "India",
    summary:
      "National policy guidance for integrating land use, density, public space and transport around mass-transit systems.",
    topics: ["TOD", "Urban Planning", "Public Transport"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "model-building-bye-laws-2016",
    title: "Model Building Bye-Laws 2016",
    section: "standards-references",
    domain: "Housing, Development & Real Estate",
    publisher: "Ministry of Urban Development",
    year: "2016",
    geography: "India",
    summary:
      "Model regulatory guidance addressing development controls, building approvals, safety, sustainability and construction requirements.",
    topics: ["Building Bye-Laws", "Development Control", "Approvals"],
    sourceUrl: null,
    trust: "Official source",
  },


  // ============================================================
  // 05 — METHODS & PRACTICE
  // ============================================================

  {
    slug: "cpwd-works-manual-2022",
    title: "CPWD Works Manual 2022",
    section: "methods-practice",
    domain: "Construction & Project Delivery",
    publisher: "Central Public Works Department",
    year: "2022",
    geography: "India",
    summary:
      "Operational procedures and workflows for planning, procurement, construction, maintenance and delivery of public works.",
    topics: ["Project Delivery", "Procurement", "Works Management"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "cpwd-maintenance-manual-2023",
    title: "CPWD Maintenance Manual 2023",
    section: "methods-practice",
    domain: "Operations, Maintenance & Asset Management",
    publisher: "Central Public Works Department",
    year: "2023",
    geography: "India",
    summary:
      "Practice guidance for inspection, repair, maintenance and management of government buildings and associated services.",
    topics: ["Maintenance", "Asset Management", "Operations"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "confined-masonry-construction-guidebook",
    title: "Confined Masonry Construction Guidebook",
    section: "methods-practice",
    domain: "Civil & Structural Engineering",
    publisher: "BMTPC",
    geography: "India",
    summary:
      "Technical guidance for understanding and applying confined masonry construction practice.",
    topics: ["Masonry", "Structures", "Construction"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "ghtc-light-house-project-operational-guidelines",
    title:
      "Operational Guidelines for Construction of Light House Projects under GHTC",
    section: "methods-practice",
    domain: "Construction & Project Delivery",
    publisher: "BMTPC",
    geography: "India",
    summary:
      "Operational guidance supporting delivery of Light House Projects using innovative construction systems.",
    topics: ["GHTC", "Light House Projects", "Construction"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "urdpfi-guidelines-2014",
    title:
      "Urban and Regional Development Plans Formulation and Implementation Guidelines 2014",
    section: "methods-practice",
    domain: "Urban Planning & Design",
    publisher: "Ministry of Urban Development",
    year: "2014",
    geography: "India",
    summary:
      "National guidance for preparation and implementation of urban and regional development plans.",
    topics: ["URDPFI", "Master Planning", "Regional Planning"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "urban-green-guidelines-2014",
    title: "Urban Green Guidelines 2014",
    section: "methods-practice",
    domain: "Landscape & Public Realm",
    publisher: "Ministry of Urban Development",
    year: "2014",
    geography: "India",
    summary:
      "Guidance for planning, provision and management of urban green areas and open-space systems.",
    topics: ["Urban Green", "Open Space", "Landscape"],
    sourceUrl: null,
    trust: "Official source",
  },


  // ============================================================
  // 06 — IDEAS & INSIGHTS
  // ============================================================

  {
    slug: "national-urban-transport-policy",
    title: "National Urban Transport Policy",
    section: "ideas-insights",
    domain: "Infrastructure & Urban Systems",
    publisher: "Ministry of Urban Development",
    geography: "India",
    summary:
      "A national policy framework emphasising people-focused mobility, public transport, integrated land-use planning and sustainable urban transport.",
    topics: ["Mobility", "Public Transport", "Urban Policy"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "india-cooling-action-plan",
    title: "India Cooling Action Plan",
    section: "ideas-insights",
    domain: "Sustainability, Energy & Climate",
    publisher: "Ministry of Environment, Forest and Climate Change",
    year: "2019",
    geography: "India",
    summary:
      "India's long-term framework for reducing cooling demand, improving efficiency and addressing refrigerant transition.",
    topics: ["Cooling", "Climate", "Energy"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "sustainable-urban-plastic-waste-management",
    title: "Handbook on Sustainable Urban Plastic Waste Management",
    section: "ideas-insights",
    domain: "Sustainability, Energy & Climate",
    publisher: "NITI Aayog",
    geography: "India",
    summary:
      "A knowledge resource on sustainable approaches to plastic-waste management in Indian urban areas.",
    topics: ["Plastic Waste", "Circular Economy", "Cities"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "faecal-sludge-septage-service-business-models",
    title:
      "Faecal Sludge and Septage Management in Urban Areas: Service and Business Models",
    section: "ideas-insights",
    domain: "Infrastructure & Urban Systems",
    publisher: "NITI Aayog",
    geography: "India",
    summary:
      "Approaches to service delivery and viable operating models for faecal sludge and septage management.",
    topics: ["Sanitation", "FSSM", "Urban Services"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "tdr-guidelines-urban-infrastructure-transition",
    title:
      "TDR Guidelines for Implementation of TDR Tool for Achieving Urban Infrastructure Transition in India",
    section: "ideas-insights",
    domain: "Housing, Development & Real Estate",
    publisher: "NITI Aayog",
    geography: "India",
    summary:
      "Guidance on using transferable development rights as a planning and infrastructure implementation tool.",
    topics: ["TDR", "Development", "Urban Finance"],
    sourceUrl: null,
    trust: "Official source",
  },

  {
    slug: "sustainable-habitat-urban-transport-standards",
    title:
      "Standards for the National Mission for Sustainable Habitat - Urban Transport",
    section: "ideas-insights",
    domain: "Infrastructure & Urban Systems",
    publisher: "Ministry of Urban Development",
    geography: "India",
    summary:
      "A framework connecting sustainable habitat objectives with urban mobility, public transport and non-motorised movement.",
    topics: ["Sustainable Habitat", "Mobility", "Transport"],
    sourceUrl: null,
    trust: "Official source",
  },
];

export const INDIA_KNOWLEDGE_SECTIONS: {
  slug: KnowledgeSection;
  label: string;
}[] = [
  { slug: "books-publications", label: "Books & Publications" },
  { slug: "research-innovation", label: "Research & Innovation" },
  { slug: "case-studies-solutions", label: "Case Studies & Solutions" },
  { slug: "standards-references", label: "Standards & References" },
  { slug: "methods-practice", label: "Methods & Practice" },
  { slug: "ideas-insights", label: "Ideas & Insights" },
];

export const INDIA_KNOWLEDGE_FEATURED =
  INDIA_KNOWLEDGE_RECORDS.filter((record) => record.featured).slice(0, 3);