export type OrganisationService = {
  id: string;
  title: string;
  description: string;
  access: "FREE" | "ONE";
};

export type OrganisationGroup = {
  id: string;
  title: string;
  accessLabel: "FREE" | "ONE";
  services: OrganisationService[];
};

export type OrganisationDashboardDefinition = {
  id:
    | "company"
    | "university"
    | "institution";

  dashboardTitle: string;

  workspaceType: string;

  workspaceIdLabel: string;

  freePlanLabel: string;

  subtitle: string;

  groups: OrganisationGroup[];
};


export const COMPANY_V3:
  OrganisationDashboardDefinition = {
  id: "company",

  dashboardTitle:
    "Company Dashboard",

  workspaceType:
    "Company",

  workspaceIdLabel:
    "Company ID",

  freePlanLabel:
    "Free Company",

  subtitle:
    "Manage company identity, portfolio, participation and Built World intelligence.",

  groups: [
    {
      id: "company-identity",

      title:
        "Company Identity",

      accessLabel:
        "FREE",

      services: [
        {
          id: "company-profile",

          title:
            "Company Profile",

          description:
            "Identity, locations, disciplines and public company presence.",

          access:
            "FREE",
        },

        {
          id: "people",

          title:
            "People",

          description:
            "Leadership, professionals and connected company members.",

          access:
            "FREE",
        },

        {
          id: "products-services",

          title:
            "Products & Services",

          description:
            "Products, systems, services and company capabilities.",

          access:
            "FREE",
        },
      ],
    },

    {
      id: "business-world",

      title:
        "Business World",

      accessLabel:
        "FREE",

      services: [
        {
          id: "projects",

          title:
            "Projects",

          description:
            "Published projects and connected portfolio records.",

          access:
            "FREE",
        },

        {
          id: "knowledge",

          title:
            "Knowledge",

          description:
            "Research, insights, publications and company knowledge.",

          access:
            "FREE",
        },

        {
          id: "opportunities",

          title:
            "Opportunities",

          description:
            "Jobs, competitions, calls and collaboration opportunities.",

          access:
            "FREE",
        },
      ],
    },

    {
      id: "growth-participation",

      title:
        "Growth & Participation",

      accessLabel:
        "ONE",

      services: [
        {
          id: "contributions",

          title:
            "Contributions",

          description:
            "Contribute structured company records and evidence.",

          access:
            "ONE",
        },

        {
          id: "portfolio-workspace",

          title:
            "Portfolio Workspace",

          description:
            "Organise connected projects and company portfolio assets.",

          access:
            "ONE",
        },

        {
          id: "collaboration",

          title:
            "Collaboration",

          description:
            "Work with teams, partners and authorised collaborators.",

          access:
            "ONE",
        },
      ],
    },

    {
      id: "intelligence-control",

      title:
        "Intelligence & Control",

      accessLabel:
        "ONE",

      services: [
        {
          id: "market-intelligence",

          title:
            "Market Intelligence",

          description:
            "Explore markets, sectors, places and Built World activity.",

          access:
            "ONE",
        },

        {
          id: "analytics-benchmarks",

          title:
            "Analytics & Benchmarks",

          description:
            "Analyse portfolio, sector and organisational signals.",

          access:
            "ONE",
        },

        {
          id: "team-permissions",

          title:
            "Team & Permissions",

          description:
            "Manage workspace roles, access and permissions.",

          access:
            "ONE",
        },
      ],
    },
  ],
};


export const UNIVERSITY_V3:
  OrganisationDashboardDefinition = {
  id: "university",

  dashboardTitle:
    "University Dashboard",

  workspaceType:
    "University",

  workspaceIdLabel:
    "University ID",

  freePlanLabel:
    "Free University",

  subtitle:
    "Connect academic identity, programmes, research and industry collaboration.",

  groups: [
    {
      id: "university-identity",

      title:
        "University Identity",

      accessLabel:
        "FREE",

      services: [
        {
          id: "university-profile",

          title:
            "University Profile",

          description:
            "Identity, locations, faculties and public university presence.",

          access:
            "FREE",
        },

        {
          id: "people",

          title:
            "People",

          description:
            "Faculty, researchers and authorised university members.",

          access:
            "FREE",
        },

        {
          id: "programmes",

          title:
            "Programmes",

          description:
            "Academic programmes, courses and learning pathways.",

          access:
            "FREE",
        },
      ],
    },

    {
      id: "research-world",

      title:
        "Research World",

      accessLabel:
        "FREE",

      services: [
        {
          id: "research",

          title:
            "Research",

          description:
            "Research themes, initiatives, outputs and expertise.",

          access:
            "FREE",
        },

        {
          id: "projects",

          title:
            "Projects",

          description:
            "Academic, research and Built World project records.",

          access:
            "FREE",
        },

        {
          id: "opportunities",

          title:
            "Opportunities",

          description:
            "Research calls, placements, competitions and opportunities.",

          access:
            "FREE",
        },
      ],
    },

    {
      id: "evidence-collaboration",

      title:
        "Evidence & Collaboration",

      accessLabel:
        "ONE",

      services: [
        {
          id: "contributions",

          title:
            "Contributions",

          description:
            "Contribute structured research, projects and evidence.",

          access:
            "ONE",
        },

        {
          id: "publications-evidence",

          title:
            "Publications & Evidence",

          description:
            "Manage connected outputs, sources and research evidence.",

          access:
            "ONE",
        },

        {
          id: "industry-collaboration",

          title:
            "Industry Collaboration",

          description:
            "Connect university work with Built World partners.",

          access:
            "ONE",
        },
      ],
    },

    {
      id: "intelligence-control",

      title:
        "Intelligence & Control",

      accessLabel:
        "ONE",

      services: [
        {
          id: "research-analytics",

          title:
            "Research Analytics",

          description:
            "Analyse research activity, themes, networks and outputs.",

          access:
            "ONE",
        },

        {
          id: "impact-benchmarking",

          title:
            "Impact & Benchmarking",

          description:
            "Understand impact, collaboration and comparative signals.",

          access:
            "ONE",
        },

        {
          id: "team-permissions",

          title:
            "Team & Permissions",

          description:
            "Manage university roles, access and workspace permissions.",

          access:
            "ONE",
        },
      ],
    },
  ],
};


export const INSTITUTION_V3:
  OrganisationDashboardDefinition = {
  id: "institution",

  dashboardTitle:
    "Institution Dashboard",

  workspaceType:
    "Institution",

  workspaceIdLabel:
    "Institution ID",

  freePlanLabel:
    "Free Institution",

  subtitle:
    "Manage institutional identity, programmes, evidence, networks and intelligence.",

  groups: [
    {
      id: "institution-identity",

      title:
        "Institution Identity",

      accessLabel:
        "FREE",

      services: [
        {
          id: "institution-profile",

          title:
            "Institution Profile",

          description:
            "Identity, mandate, locations and institutional presence.",

          access:
            "FREE",
        },

        {
          id: "people",

          title:
            "People",

          description:
            "Leadership, experts and authorised institution members.",

          access:
            "FREE",
        },

        {
          id: "knowledge-standards",

          title:
            "Knowledge & Standards",

          description:
            "Research, guidance, standards and institutional knowledge.",

          access:
            "FREE",
        },
      ],
    },

    {
      id: "public-work",

      title:
        "Public Work",

      accessLabel:
        "FREE",

      services: [
        {
          id: "programmes",

          title:
            "Programmes",

          description:
            "Institutional programmes, initiatives and areas of work.",

          access:
            "FREE",
        },

        {
          id: "projects",

          title:
            "Projects",

          description:
            "Built World projects, initiatives and connected activity.",

          access:
            "FREE",
        },

        {
          id: "opportunities",

          title:
            "Opportunities",

          description:
            "Calls, grants, jobs and public collaboration opportunities.",

          access:
            "FREE",
        },
      ],
    },

    {
      id: "network-evidence",

      title:
        "Network & Evidence",

      accessLabel:
        "ONE",

      services: [
        {
          id: "contributions",

          title:
            "Contributions",

          description:
            "Contribute institutional knowledge, projects and evidence.",

          access:
            "ONE",
        },

        {
          id: "collaboration-network",

          title:
            "Collaboration & Network",

          description:
            "Manage institutional relationships and collaboration.",

          access:
            "ONE",
        },

        {
          id: "impact-evidence",

          title:
            "Impact & Evidence",

          description:
            "Connect programmes and projects to outcomes and evidence.",

          access:
            "ONE",
        },
      ],
    },

    {
      id: "intelligence-control",

      title:
        "Intelligence & Control",

      accessLabel:
        "ONE",

      services: [
        {
          id: "institutional-analytics",

          title:
            "Institutional Analytics",

          description:
            "Analyse programmes, projects and institutional activity.",

          access:
            "ONE",
        },

        {
          id: "geographic-intelligence",

          title:
            "Geographic Intelligence",

          description:
            "Understand programmes, projects, places and regional patterns.",

          access:
            "ONE",
        },

        {
          id: "team-permissions",

          title:
            "Team & Permissions",

          description:
            "Manage authorised members, roles and workspace access.",

          access:
            "ONE",
        },
      ],
    },
  ],
};