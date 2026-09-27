export type TeamRoleId =
  | "leadership"
  | "advisers"
  | "editors"
  | "knowledge-contributor"
  | "regional-partner"
  | "operations";


export type LeadershipPortfolioId =
  | "knowledge-intelligence"
  | "education-institutions"
  | "community-network"
  | "growth-partnerships"
  | "product-platform"
  | "operations-trust";


export type TeamPanel = {
  title: string;
  routeKey?: string;
  description: string;
  href?: string;
};


export type TeamPanelGroup = {
  eyebrow: string;
  title: string;
  panels: TeamPanel[];
};


export type TeamRoleDashboardDefinition = {
  id: TeamRoleId;
  teamRoleLabel?: string;
  eyebrow: string;
  title: string;
  description: string;
  accessGrant: string;
  scopeLabel: string;
  scopeValue: string;
  groups: TeamPanelGroup[];
};


const COMMON_GROUPS: TeamPanelGroup[] = [
  {
    eyebrow: "MEMBER",
    title: "My Arknoz",

    panels: [
      {
        title: "Profile",
        description:
          "Professional identity, profile information and public presence.",
      },

      {
        title: "Contributions",
        description:
          "Your contributions, submissions and participation across Arknoz.",
      },

      {
        title: "Activity",
        description:
          "Your recent Arknoz activity and connected work.",
      },
    ],
  },

  {
    eyebrow: "PLATFORM",
    title: "My Platform",

    panels: [
      {
        title: "Messages",
        description:
          "Professional communication and role-related conversations.",
      },

      {
        title: "Saved",
        description:
          "Saved projects, knowledge, organisations and other Arknoz records.",
      },

      {
        title: "Opportunities",
        description:
          "Relevant Built World opportunities and professional activity.",
      },
    ],
  },
];


function makeGroups(
  workspaceTitle: string,
  workspace: TeamPanel[],
  controlTitle: string,
  control: TeamPanel[]
): TeamPanelGroup[] {
  return [
    ...COMMON_GROUPS,

    {
      eyebrow: "ROLE",
      title: workspaceTitle,
      panels: workspace,
    },

    {
      eyebrow: "ROLE",
      title: controlTitle,
      panels: control,
    },
  ];
}


type LeadershipPortfolioDefinition = {
  title: string;
  description: string;
  workspaceTitle: string;
  controlTitle: string;
  workspace: TeamPanel[];
  control: TeamPanel[];
};


export const LEADERSHIP_PORTFOLIOS:
  Record<
    LeadershipPortfolioId,
    LeadershipPortfolioDefinition
  > = {

  "knowledge-intelligence": {
    title:
      "Knowledge & Intelligence",

    description:
      "Leadership responsibility for Arknoz knowledge, research, evidence and intelligence.",

    workspaceTitle:
      "Knowledge Leadership",

    controlTitle:
      "Knowledge Intelligence & Control",

    workspace: [
      {
        title:
          "Knowledge Coverage",
        description:
          "Coverage across Arknoz knowledge domains, geographies and Built World topics.",
      },

      {
        title:
          "Contribution Pipeline",
        description:
          "Strategic visibility across incoming knowledge and contribution activity.",
      },

      {
        title:
          "Research & Standards",
        description:
          "Research, standards, references and priority knowledge sources.",
      },
    ],

    control: [
      {
        title:
          "Evidence & Quality",
        description:
          "Knowledge quality, evidence strength, provenance and publication health.",
      },

      {
        title:
          "Intelligence Reports",
        description:
          "Leadership intelligence derived from connected Arknoz knowledge.",
      },

      {
        title:
          "Knowledge Gaps & Priorities",
        description:
          "Missing coverage and strategic priorities for future knowledge development.",
      },
    ],
  },


  "education-institutions": {
    title:
      "Education & Institutions",

    description:
      "Leadership responsibility for universities, learning and academic relationships.",

    workspaceTitle:
      "Education Leadership",

    controlTitle:
      "Education Intelligence & Growth",

    workspace: [
      {
        title:
          "University Network",
        description:
          "Universities, faculties and academic organisations connected to Arknoz.",
      },

      {
        title:
          "Programmes & Learning",
        description:
          "Learning programmes, professional education and academic content.",
      },

      {
        title:
          "Research Institutions",
        description:
          "Research centres, institutes and academic Built World activity.",
      },
    ],

    control: [
      {
        title:
          "Academic Partnerships",
        description:
          "Strategic university and institutional partnerships.",
      },

      {
        title:
          "Education Opportunities",
        description:
          "Research calls, academic opportunities and institutional collaboration.",
      },

      {
        title:
          "Education Growth & Impact",
        description:
          "Development, reach and strategic impact of Arknoz education activity.",
      },
    ],
  },


  "community-network": {
    title:
      "Community & Network",

    description:
      "Leadership responsibility for the Arknoz professional community and global network.",

    workspaceTitle:
      "Community Leadership",

    controlTitle:
      "Network Intelligence & Growth",

    workspace: [
      {
        title:
          "Member Network",
        description:
          "Professional members and the overall Arknoz member ecosystem.",
      },

      {
        title:
          "Contributors & Experts",
        description:
          "Knowledge contributors, specialists and expert participation.",
      },

      {
        title:
          "Advisers & Chapters",
        description:
          "Advisory relationships, chapters and structured community leadership.",
      },
    ],

    control: [
      {
        title:
          "Regional Network",
        description:
          "Regional partners and geographic community development.",
      },

      {
        title:
          "Collaboration",
        description:
          "Cross-sector and cross-region collaboration across Arknoz.",
      },

      {
        title:
          "Community Growth & Health",
        description:
          "Participation, engagement and sustainable network development.",
      },
    ],
  },


  "growth-partnerships": {
    title:
      "Growth & Partnerships",

    description:
      "Leadership responsibility for Arknoz business growth, expansion and strategic partnerships.",

    workspaceTitle:
      "Growth Workspace",

    controlTitle:
      "Growth Intelligence & Control",

    workspace: [
      {
        title:
          "Strategic Partnerships",
        description:
          "High-value company, university, institution and industry relationships.",
      },

      {
        title:
          "Regional Expansion",
        description:
          "Priority regions, market development and international expansion.",
      },

      {
        title:
          "Organisation Growth",
        description:
          "Companies, practices and institutions relevant to Arknoz growth.",
      },
    ],

    control: [
      {
        title:
          "Business Pipeline",
        description:
          "Business-development activity and strategic commercial relationships.",
      },

      {
        title:
          "Opportunities",
        routeKey:
          "growth-opportunities",
        description:
          "Strategic opportunities requiring leadership involvement.",
      },

      {
        title:
          "Growth Reports & Priorities",
        description:
          "Growth performance, priorities and leadership reporting.",
      },
    ],
  },


  "product-platform": {
    title:
      "Product & Platform",

    description:
      "Leadership responsibility for Arknoz product direction and platform development.",

    workspaceTitle:
      "Product Leadership",

    controlTitle:
      "Product Intelligence & Control",

    workspace: [
      {
        title:
          "Product Roadmap",
        description:
          "Major product initiatives, priorities and future platform development.",
      },

      {
        title:
          "Arknoz Pro & ONE",
        description:
          "Professional products, paid capabilities and commercial product development.",
      },

      {
        title:
          "Search, Data & Intelligence",
        description:
          "Discovery, connected data, intelligence and future AI capabilities.",
      },
    ],

    control: [
      {
        title:
          "Experience & Adoption",
        description:
          "User experience, adoption signals and product engagement.",
      },

      {
        title:
          "Product Issues",
        description:
          "Major product issues and improvement priorities.",
      },

      {
        title:
          "Release Priorities",
        description:
          "Important releases, readiness and product-development decisions.",
      },
    ],
  },


  "operations-trust": {
    title:
      "Operations & Trust",

    description:
      "Leadership responsibility for operational health, trust, verification and platform integrity.",

    workspaceTitle:
      "Operations Leadership",

    controlTitle:
      "Trust & Control",

    workspace: [
      {
        title:
          "Operational Health",
        description:
          "Major operational activity, bottlenecks and service health.",
      },

      {
        title:
          "Verification & Review",
        description:
          "Identity, organisation, evidence and publication verification.",
      },

      {
        title:
          "Data Quality & Provenance",
        description:
          "Accuracy, sources, rights, provenance and record quality.",
      },
    ],

    control: [
      {
        title:
          "Security & Access",
        description:
          "Important access, security and trust controls requiring leadership visibility.",
      },

      {
        title:
          "Compliance & Risk",
        description:
          "Major compliance, policy and operational risk matters.",
      },

      {
        title:
          "Escalations & Reports",
        description:
          "Serious operational escalations and leadership-level reporting.",
      },
    ],
  },
};


export function getLeadershipDashboard(
  portfolioId:
    LeadershipPortfolioId
): TeamRoleDashboardDefinition {

  const portfolio =
    LEADERSHIP_PORTFOLIOS[
      portfolioId
    ];

  return {
    id:
      "leadership",

    teamRoleLabel:
      "Leadership Team",

    eyebrow:
      "ARKNOZ LEADERSHIP",

    title:
      portfolio.title,

    description:
      portfolio.description,

    accessGrant:
      "Full Pro + ONE",

    scopeLabel:
      "PORTFOLIO",

    scopeValue:
      portfolio.title,

    groups:
      makeGroups(
        portfolio.workspaceTitle,
        portfolio.workspace,
        portfolio.controlTitle,
        portfolio.control
      ),
  };
}


export const TEAM_ROLE_DASHBOARDS:
  Record<
    TeamRoleId,
    TeamRoleDashboardDefinition
  > = {

  leadership:
    getLeadershipDashboard(
      "knowledge-intelligence"
    ),


  advisers: {
    id: "advisers",

    teamRoleLabel:
      "Board of Advisers",

    eyebrow:
      "ARKNOZ ADVISORY BOARD",

    title:
      "Board of Advisers",

    description:
      "Your Arknoz member workspace with strategic advisory access and review responsibilities.",

    accessGrant:
      "Full Pro + ONE",

    scopeLabel:
      "SCOPE",

    scopeValue:
      "Advisory",

    groups:
      makeGroups(
        "Advisory Workspace",

        [
          {
            title:
              "Strategic Briefing",
            description:
              "Current Arknoz priorities, strategic context and major developments.",
          },

          {
            title:
              "Review Requests",
            description:
              "Matters specifically sent for Board of Advisers review.",
          },

          {
            title:
              "Intelligence & Reports",
            description:
              "Relevant platform, market and strategic intelligence.",
          },
        ],

        "Advisory Review & Response",

        [
          {
            title:
              "Adviser Notes",
            description:
              "Private observations and working notes.",
          },

          {
            title:
              "Recommendations",
            description:
              "Structured recommendations returned to Arknoz leadership.",
          },

          {
            title:
              "Decision History",
            description:
              "Previous advice, responses and recorded outcomes.",
          },
        ]
      ),
  },


  editors: {
    id: "editors",

    teamRoleLabel:
      "Board of Editors",

    eyebrow:
      "ARKNOZ EDITORIAL BOARD",

    title:
      "Board of Editors",

    description:
      "Your Arknoz member workspace with editorial review, evidence and publication responsibilities.",

    accessGrant:
      "Editorial Grant",

    scopeLabel:
      "SCOPE",

    scopeValue:
      "Editorial",

    groups:
      makeGroups(
        "Editorial Workspace",

        [
          {
            title:
              "Editorial Inbox",
            description:
              "New records and editorial tasks assigned by Arknoz Admin.",
          },

          {
            title:
              "Under Review",
            description:
              "Records currently being assessed by the editorial board.",
          },

          {
            title:
              "Sources & Evidence",
            description:
              "Review evidence, provenance, sources and record support.",
          },
        ],

        "Editorial Review & Control",

        [
          {
            title:
              "Editorial Decisions",
            description:
              "Recommend accept, revise, hold or reject.",
          },

          {
            title:
              "Return to Admin",
            description:
              "Completed editorial work ready for Admin action.",
          },

          {
            title:
              "Published History",
            description:
              "Previously reviewed records and publication outcomes.",
          },
        ]
      ),
  },


  "knowledge-contributor": {
    id:
      "knowledge-contributor",

    teamRoleLabel:
      "Knowledge Contributor",

    eyebrow:
      "ARKNOZ KNOWLEDGE TEAM",

    title:
      "Knowledge Contributor",

    description:
      "Your Arknoz member workspace with advanced contribution, research and evidence tools.",

    accessGrant:
      "Knowledge Grant",

    scopeLabel:
      "SCOPE",

    scopeValue:
      "Knowledge",

    groups:
      makeGroups(
        "Contribution Workspace",

        [
          {
            title:
              "Create Contribution",
            description:
              "Prepare structured source-backed Arknoz contributions.",
          },

          {
            title:
              "Research & Sources",
            description:
              "Organise research, sources, evidence and provenance.",
          },

          {
            title:
              "Drafts",
            description:
              "Knowledge contributions still being prepared.",
          },
        ],

        "Contribution Review & History",

        [
          {
            title:
              "Review Feedback",
            description:
              "Editorial and Admin feedback requiring action.",
          },

          {
            title:
              "Published Knowledge",
            description:
              "Accepted work connected to canonical Arknoz records.",
          },

          {
            title:
              "Contribution History",
            description:
              "Submission, review and publication history.",
          },
        ]
      ),
  },


  "regional-partner": {
    id:
      "regional-partner",

    teamRoleLabel:
      "Regional Knowledge Partner",

    eyebrow:
      "ARKNOZ REGIONAL PARTNER",

    title:
      "Regional Knowledge Partner",

    description:
      "Your Arknoz member workspace with regional knowledge, network and growth responsibilities.",

    accessGrant:
      "Regional Partner Grant",

    scopeLabel:
      "REGION",

    scopeValue:
      "Assigned Region",

    groups:
      makeGroups(
        "Regional Workspace",

        [
          {
            title:
              "Regional Overview",
            description:
              "Arknoz activity, coverage and priorities within your assigned geography.",
          },

          {
            title:
              "Knowledge & Projects",
            description:
              "Regional knowledge, Built World projects and important activity.",
          },

          {
            title:
              "Organisations & Institutions",
            description:
              "Companies, universities and institutions relevant to your region.",
          },
        ],

        "Regional Growth & Control",

        [
          {
            title:
              "Opportunities & Partnerships",
            description:
              "Regional opportunities, collaborations and strategic relationships.",
          },

          {
            title:
              "Regional Growth",
            description:
              "Network participation, coverage and Arknoz growth in your geography.",
          },

          {
            title:
              "Contribution & Business Pipeline",
            description:
              "Regional contributions, partnership leads and business-development activity.",
          },
        ]
      ),
  },


  operations: {
    id:
      "operations",

    teamRoleLabel:
      "Internal Operations",

    eyebrow:
      "ARKNOZ OPERATIONS",

    title:
      "Internal Operations",

    description:
      "Your Arknoz member workspace with operational, verification and data-quality responsibilities.",

    accessGrant:
      "Operations Grant",

    scopeLabel:
      "SCOPE",

    scopeValue:
      "Operational",

    groups:
      makeGroups(
        "Operations Workspace",

        [
          {
            title:
              "Operational Queue",
            description:
              "Assigned daily tasks and operational priorities.",
          },

          {
            title:
              "Members & Organisations",
            description:
              "Operational support for member and organisation workspaces.",
          },

          {
            title:
              "Contribution Processing",
            description:
              "Contribution intake, routing and workflow handling.",
          },
        ],

        "Operations Control",

        [
          {
            title:
              "Verification & Review",
            description:
              "Identity, organisation, evidence and publication verification.",
          },

          {
            title:
              "Data Quality",
            description:
              "Duplicates, corrections, incomplete records and provenance issues.",
          },

          {
            title:
              "Issues & Reports",
            description:
              "Operational issues, escalations, handovers and reporting.",
          },
        ]
      ),
  },
};