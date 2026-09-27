export type DashboardAccess =
  | "FREE"
  | "PRO"
  | "ONE";

export type DashboardService = {
  id: string;
  title: string;
  description: string;
  access: DashboardAccess;
};

export type DashboardGroup = {
  id: string;
  title: string;
  accessLabel: string;
  services: DashboardService[];
};

export type WorkspaceDashboardDefinition = {
  id:
    | "individual"
    | "company"
    | "university"
    | "institution";

  title: string;
  shortTitle: string;
  subtitle: string;

  freeLabel: string;
  paidLabel: string;

  groups: DashboardGroup[];
};


export const INDIVIDUAL_DASHBOARD: WorkspaceDashboardDefinition = {
  id: "individual",

  title: "My Arknoz",
  shortTitle: "Individual",

  subtitle:
    "Your permanent professional identity and personal Built World workspace.",

  freeLabel: "Free",
  paidLabel: "Arknoz Pro",

  groups: [
    {
      id: "identity",
      title: "Identity",
      accessLabel: "FREE",

      services: [
        {
          id: "profile",
          title: "Profile",
          description:
            "Your professional identity and public member information.",
          access: "FREE",
        },

        {
          id: "experience-credentials",
          title: "Experience & Credentials",
          description:
            "Professional experience, qualifications and credentials.",
          access: "FREE",
        },

        {
          id: "arknoz-points",
          title: "Arknoz Points",
          description:
            "Your trusted participation and contribution points.",
          access: "FREE",
        },
      ],
    },

    {
      id: "my-world",
      title: "My World",
      accessLabel: "FREE",

      services: [
        {
          id: "saved",
          title: "Saved",
          description:
            "Projects, products, knowledge and records saved for later.",
          access: "FREE",
        },

        {
          id: "activity",
          title: "Activity",
          description:
            "Your recent Arknoz activity and continuity.",
          access: "FREE",
        },

        {
          id: "opportunities",
          title: "Opportunities",
          description:
            "Relevant jobs, competitions, calls and opportunities.",
          access: "FREE",
        },
      ],
    },

    {
      id: "professional",
      title: "Professional",
      accessLabel: "PRO",

      services: [
        {
          id: "messages",
          title: "Messages",
          description:
            "Professional member-to-member communication.",
          access: "PRO",
        },

        {
          id: "arknoz-cv",
          title: "Arknoz CV",
          description:
            "Structured professional CV built from verified Arknoz information.",
          access: "PRO",
        },

        {
          id: "services",
          title: "Services",
          description:
            "Publish and manage professional services.",
          access: "PRO",
        },
      ],
    },

    {
      id: "intelligence-work",
      title: "Intelligence & Work",
      accessLabel: "PRO",

      services: [
        {
          id: "contributions",
          title: "Contributions",
          description:
            "Contribute structured projects, products, knowledge and evidence.",
          access: "PRO",
        },

        {
          id: "advanced-analytics",
          title: "Advanced Analytics",
          description:
            "Deeper professional analysis across your Arknoz world.",
          access: "PRO",
        },

        {
          id: "professional-tools",
          title: "Professional Tools",
          description:
            "Higher-value professional workspace capabilities.",
          access: "PRO",
        },
      ],
    },
  ],
};


export const COMPANY_DASHBOARD: WorkspaceDashboardDefinition = {
  id: "company",

  title: "Company Workspace",
  shortTitle: "Company",

  subtitle:
    "Manage your company's Built World presence, portfolio, participation and intelligence.",

  freeLabel: "Free Company",
  paidLabel: "Arknoz ONE",

  groups: [
    {
      id: "company-identity",
      title: "Company Identity",
      accessLabel: "FREE",

      services: [
        {
          id: "company-profile",
          title: "Company Profile",
          description:
            "Identity, locations, disciplines, capabilities and public presence.",
          access: "FREE",
        },

        {
          id: "people",
          title: "People",
          description:
            "Connected leadership, professionals and authorised members.",
          access: "FREE",
        },

        {
          id: "products-services",
          title: "Products & Services",
          description:
            "Products, systems, professional services and capabilities.",
          access: "FREE",
        },
      ],
    },

    {
      id: "business-world",
      title: "Business World",
      accessLabel: "FREE",

      services: [
        {
          id: "projects",
          title: "Projects",
          description:
            "Published projects and connected portfolio records.",
          access: "FREE",
        },

        {
          id: "knowledge",
          title: "Knowledge",
          description:
            "Research, insights, publications and company knowledge.",
          access: "FREE",
        },

        {
          id: "opportunities",
          title: "Opportunities",
          description:
            "Jobs, competitions, collaborations and relevant opportunities.",
          access: "FREE",
        },
      ],
    },

    {
      id: "growth-participation",
      title: "Growth & Participation",
      accessLabel: "ARKNOZ ONE",

      services: [
        {
          id: "contributions",
          title: "Contributions",
          description:
            "Structured company contributions to the Arknoz knowledge graph.",
          access: "ONE",
        },

        {
          id: "portfolio-workspace",
          title: "Portfolio Workspace",
          description:
            "Organise and work across connected projects and company assets.",
          access: "ONE",
        },

        {
          id: "collaboration",
          title: "Collaboration",
          description:
            "Work with internal teams, partners and authorised collaborators.",
          access: "ONE",
        },
      ],
    },

    {
      id: "intelligence-control",
      title: "Intelligence & Control",
      accessLabel: "ARKNOZ ONE",

      services: [
        {
          id: "market-intelligence",
          title: "Market Intelligence",
          description:
            "Explore markets, places, sectors, technologies and activity.",
          access: "ONE",
        },

        {
          id: "analytics-benchmarks",
          title: "Analytics & Benchmarks",
          description:
            "Compare portfolio, sector and organisational performance signals.",
          access: "ONE",
        },

        {
          id: "team-permissions",
          title: "Team & Permissions",
          description:
            "Manage organisational roles, workspace access and permissions.",
          access: "ONE",
        },
      ],
    },
  ],
};


export const UNIVERSITY_DASHBOARD: WorkspaceDashboardDefinition = {
  id: "university",

  title: "University Workspace",
  shortTitle: "University",

  subtitle:
    "Connect academic identity, research, projects, programmes and industry collaboration.",

  freeLabel: "Free University",
  paidLabel: "Arknoz ONE",

  groups: [
    {
      id: "university-identity",
      title: "University Identity",
      accessLabel: "FREE",

      services: [
        {
          id: "university-profile",
          title: "University Profile",
          description:
            "Institutional identity, locations, faculties and public presence.",
          access: "FREE",
        },

        {
          id: "people",
          title: "People",
          description:
            "Faculty, researchers, professionals and authorised members.",
          access: "FREE",
        },

        {
          id: "programmes",
          title: "Programmes",
          description:
            "Academic programmes, courses and learning pathways.",
          access: "FREE",
        },
      ],
    },

    {
      id: "research-world",
      title: "Research World",
      accessLabel: "FREE",

      services: [
        {
          id: "research",
          title: "Research",
          description:
            "Research themes, outputs, initiatives and areas of expertise.",
          access: "FREE",
        },

        {
          id: "projects",
          title: "Projects",
          description:
            "Academic, research and Built World project records.",
          access: "FREE",
        },

        {
          id: "opportunities",
          title: "Opportunities",
          description:
            "Research calls, competitions, placements and collaboration opportunities.",
          access: "FREE",
        },
      ],
    },

    {
      id: "evidence-collaboration",
      title: "Evidence & Collaboration",
      accessLabel: "ARKNOZ ONE",

      services: [
        {
          id: "contributions",
          title: "Contributions",
          description:
            "Submit structured research, projects, knowledge and evidence.",
          access: "ONE",
        },

        {
          id: "publications-evidence",
          title: "Publications & Evidence",
          description:
            "Manage connected research outputs, sources and supporting evidence.",
          access: "ONE",
        },

        {
          id: "industry-collaboration",
          title: "Industry Collaboration",
          description:
            "Connect university work with companies, institutions and Built World partners.",
          access: "ONE",
        },
      ],
    },

    {
      id: "intelligence-control",
      title: "Intelligence & Control",
      accessLabel: "ARKNOZ ONE",

      services: [
        {
          id: "research-analytics",
          title: "Research Analytics",
          description:
            "Analyse research activity, themes, networks and connected outputs.",
          access: "ONE",
        },

        {
          id: "impact-benchmarking",
          title: "Impact & Benchmarking",
          description:
            "Understand research impact, collaboration and comparative signals.",
          access: "ONE",
        },

        {
          id: "team-permissions",
          title: "Team & Permissions",
          description:
            "Manage university workspace roles, access and organisational permissions.",
          access: "ONE",
        },
      ],
    },
  ],
};


export const INSTITUTION_DASHBOARD: WorkspaceDashboardDefinition = {
  id: "institution",

  title: "Institution Workspace",
  shortTitle: "Institution",

  subtitle:
    "Manage institutional identity, programmes, evidence, networks and Built World intelligence.",

  freeLabel: "Free Institution",
  paidLabel: "Arknoz ONE",

  groups: [
    {
      id: "institution-identity",
      title: "Institution Identity",
      accessLabel: "FREE",

      services: [
        {
          id: "institution-profile",
          title: "Institution Profile",
          description:
            "Public identity, mandate, locations, disciplines and organisational presence.",
          access: "FREE",
        },

        {
          id: "people",
          title: "People",
          description:
            "Leadership, experts, professionals and authorised members.",
          access: "FREE",
        },

        {
          id: "knowledge-standards",
          title: "Knowledge & Standards",
          description:
            "Research, guidance, standards, policy and institutional knowledge.",
          access: "FREE",
        },
      ],
    },

    {
      id: "public-work",
      title: "Public Work",
      accessLabel: "FREE",

      services: [
        {
          id: "programmes",
          title: "Programmes",
          description:
            "Institutional programmes, initiatives and areas of work.",
          access: "FREE",
        },

        {
          id: "projects",
          title: "Projects",
          description:
            "Built World projects, initiatives and connected activities.",
          access: "FREE",
        },

        {
          id: "opportunities",
          title: "Opportunities",
          description:
            "Calls, grants, collaborations, jobs and public opportunities.",
          access: "FREE",
        },
      ],
    },

    {
      id: "network-evidence",
      title: "Network & Evidence",
      accessLabel: "ARKNOZ ONE",

      services: [
        {
          id: "contributions",
          title: "Contributions",
          description:
            "Contribute structured institutional knowledge and evidence.",
          access: "ONE",
        },

        {
          id: "collaboration-network",
          title: "Collaboration & Network",
          description:
            "Manage institutional relationships and authorised collaboration.",
          access: "ONE",
        },

        {
          id: "impact-evidence",
          title: "Impact & Evidence",
          description:
            "Connect programmes and projects to evidence, outcomes and impact.",
          access: "ONE",
        },
      ],
    },

    {
      id: "intelligence-control",
      title: "Intelligence & Control",
      accessLabel: "ARKNOZ ONE",

      services: [
        {
          id: "institutional-analytics",
          title: "Institutional Analytics",
          description:
            "Analyse institutional activity, programmes and connected records.",
          access: "ONE",
        },

        {
          id: "geographic-intelligence",
          title: "Geographic Intelligence",
          description:
            "Understand projects, programmes, places and regional Built World patterns.",
          access: "ONE",
        },

        {
          id: "team-permissions",
          title: "Team & Permissions",
          description:
            "Manage authorised members, roles and institutional workspace access.",
          access: "ONE",
        },
      ],
    },
  ],
};


export const DASHBOARD_MASTER = {
  individual: INDIVIDUAL_DASHBOARD,
  company: COMPANY_DASHBOARD,
  university: UNIVERSITY_DASHBOARD,
  institution: INSTITUTION_DASHBOARD,
} as const;