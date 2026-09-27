export type DashboardFamily =
  | "individual"
  | "organisation"
  | "team"
  | "leadership";


export type DashboardService = {
  id: string;
  title: string;
  group: string;
  href: string;
  access?: "FREE" | "PRO" | "ONE" | "TEAM";
  protected?: boolean;
};


export type DashboardSpec = {
  id: string;
  title: string;
  family: DashboardFamily;
  services: DashboardService[];
};


function slug(
  value: string
) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function service(
  title: string,
  group: string,
  href: string,
  access:
    DashboardService["access"] = "TEAM",
  protectedRoute = false
): DashboardService {
  return {
    id: slug(title),
    title,
    group,
    href,
    access,
    protected:
      protectedRoute || undefined,
  };
}


const INDIVIDUAL: DashboardSpec = {
  id: "individual",
  title: "Individual",
  family: "individual",

  services: [
    service(
      "Profile",
      "Identity",
      "/dashboard/profile",
      "FREE",
      true
    ),

    service(
      "Experience & Credentials",
      "Identity",
      "/dashboard/experience-credentials",
      "FREE",
      true
    ),

    service(
      "Arknoz Points",
      "Identity",
      "/dashboard/arknoz-points",
      "FREE",
      true
    ),

    service(
      "Saved",
      "My World",
      "/dashboard/saved",
      "FREE",
      true
    ),

    service(
      "Activity",
      "My World",
      "/dashboard/activity",
      "FREE",
      true
    ),

    service(
      "Opportunities",
      "My World",
      "/dashboard/opportunities",
      "FREE",
      true
    ),

    service(
      "Messages",
      "Professional",
      "/dashboard/messages",
      "PRO",
      true
    ),

    service(
      "Arknoz CV",
      "Professional",
      "/dashboard/arknoz-cv",
      "PRO",
      true
    ),

    service(
      "Services",
      "Professional",
      "/dashboard/services",
      "PRO",
      true
    ),

    service(
      "Contributions",
      "Intelligence & Work",
      "/dashboard/contributions",
      "PRO",
      true
    ),

    service(
      "Advanced Analytics",
      "Intelligence & Work",
      "/dashboard/advanced-analytics",
      "PRO",
      true
    ),

    service(
      "Professional Tools",
      "Intelligence & Work",
      "/dashboard/professional-tools",
      "PRO",
      true
    ),
  ],
};


function organisationService(
  dashboard:
    "company" |
    "university" |
    "institution",

  id: string,
  title: string,
  group: string,
  access: "FREE" | "ONE"
) {
  const suffix =
    access === "ONE"
      ? "?plan=one"
      : "";

  return service(
    title,
    group,
    `/preview/workspaces/${dashboard}/${id}${suffix}`,
    access
  );
}


const COMPANY: DashboardSpec = {
  id: "company",
  title: "Company",
  family: "organisation",

  services: [
    organisationService(
      "company",
      "company-profile",
      "Company Profile",
      "Company Identity",
      "FREE"
    ),

    organisationService(
      "company",
      "people",
      "People",
      "Company Identity",
      "FREE"
    ),

    organisationService(
      "company",
      "products-services",
      "Products & Services",
      "Company Identity",
      "FREE"
    ),

    organisationService(
      "company",
      "projects",
      "Projects",
      "Business World",
      "FREE"
    ),

    organisationService(
      "company",
      "knowledge",
      "Knowledge",
      "Business World",
      "FREE"
    ),

    organisationService(
      "company",
      "opportunities",
      "Opportunities",
      "Business World",
      "FREE"
    ),

    organisationService(
      "company",
      "contributions",
      "Contributions",
      "Growth & Participation",
      "ONE"
    ),

    organisationService(
      "company",
      "portfolio-workspace",
      "Portfolio Workspace",
      "Growth & Participation",
      "ONE"
    ),

    organisationService(
      "company",
      "collaboration",
      "Collaboration",
      "Growth & Participation",
      "ONE"
    ),

    organisationService(
      "company",
      "market-intelligence",
      "Market Intelligence",
      "Intelligence & Control",
      "ONE"
    ),

    organisationService(
      "company",
      "analytics-benchmarks",
      "Analytics & Benchmarks",
      "Intelligence & Control",
      "ONE"
    ),

    organisationService(
      "company",
      "team-permissions",
      "Team & Permissions",
      "Intelligence & Control",
      "ONE"
    ),
  ],
};


const UNIVERSITY: DashboardSpec = {
  id: "university",
  title: "University",
  family: "organisation",

  services: [
    organisationService(
      "university",
      "university-profile",
      "University Profile",
      "University Identity",
      "FREE"
    ),

    organisationService(
      "university",
      "people",
      "People",
      "University Identity",
      "FREE"
    ),

    organisationService(
      "university",
      "programmes",
      "Programmes",
      "University Identity",
      "FREE"
    ),

    organisationService(
      "university",
      "research",
      "Research",
      "Research World",
      "FREE"
    ),

    organisationService(
      "university",
      "projects",
      "Projects",
      "Research World",
      "FREE"
    ),

    organisationService(
      "university",
      "opportunities",
      "Opportunities",
      "Research World",
      "FREE"
    ),

    organisationService(
      "university",
      "contributions",
      "Contributions",
      "Evidence & Collaboration",
      "ONE"
    ),

    organisationService(
      "university",
      "publications-evidence",
      "Publications & Evidence",
      "Evidence & Collaboration",
      "ONE"
    ),

    organisationService(
      "university",
      "industry-collaboration",
      "Industry Collaboration",
      "Evidence & Collaboration",
      "ONE"
    ),

    organisationService(
      "university",
      "research-analytics",
      "Research Analytics",
      "Intelligence & Control",
      "ONE"
    ),

    organisationService(
      "university",
      "impact-benchmarking",
      "Impact & Benchmarking",
      "Intelligence & Control",
      "ONE"
    ),

    organisationService(
      "university",
      "team-permissions",
      "Team & Permissions",
      "Intelligence & Control",
      "ONE"
    ),
  ],
};


const INSTITUTION: DashboardSpec = {
  id: "institution",
  title: "Institution",
  family: "organisation",

  services: [
    organisationService(
      "institution",
      "institution-profile",
      "Institution Profile",
      "Institution Identity",
      "FREE"
    ),

    organisationService(
      "institution",
      "people",
      "People",
      "Institution Identity",
      "FREE"
    ),

    organisationService(
      "institution",
      "knowledge-standards",
      "Knowledge & Standards",
      "Institution Identity",
      "FREE"
    ),

    organisationService(
      "institution",
      "programmes",
      "Programmes",
      "Public Work",
      "FREE"
    ),

    organisationService(
      "institution",
      "projects",
      "Projects",
      "Public Work",
      "FREE"
    ),

    organisationService(
      "institution",
      "opportunities",
      "Opportunities",
      "Public Work",
      "FREE"
    ),

    organisationService(
      "institution",
      "contributions",
      "Contributions",
      "Network & Evidence",
      "ONE"
    ),

    organisationService(
      "institution",
      "collaboration-network",
      "Collaboration & Network",
      "Network & Evidence",
      "ONE"
    ),

    organisationService(
      "institution",
      "impact-evidence",
      "Impact & Evidence",
      "Network & Evidence",
      "ONE"
    ),

    organisationService(
      "institution",
      "institutional-analytics",
      "Institutional Analytics",
      "Intelligence & Control",
      "ONE"
    ),

    organisationService(
      "institution",
      "geographic-intelligence",
      "Geographic Intelligence",
      "Intelligence & Control",
      "ONE"
    ),

    organisationService(
      "institution",
      "team-permissions",
      "Team & Permissions",
      "Intelligence & Control",
      "ONE"
    ),
  ],
};


const TEAM_COMMON = [
  "Profile",
  "Contributions",
  "Activity",
  "Messages",
  "Saved",
  "Opportunities",
] as const;


function teamDashboard(
  id:
    | "advisers"
    | "editors"
    | "knowledge-contributor"
    | "regional-partner"
    | "operations",

  title: string,

  workspace:
    string[],

  control:
    string[]
): DashboardSpec {

  const base =
    `/preview/workspaces/team/${id}`;


  const common =
    TEAM_COMMON.map(
      (title, index) =>
        service(
          title,
          index < 3
            ? "My Arknoz"
            : "My Platform",
          `${base}/${slug(title)}`,
          "TEAM"
        )
    );


  const role =
    [
      ...workspace.map(
        (title) =>
          service(
            title,
            "Role Workspace",
            `${base}/${slug(title)}`,
            "TEAM"
          )
      ),

      ...control.map(
        (title) =>
          service(
            title,
            "Role Intelligence & Control",
            `${base}/${slug(title)}`,
            "TEAM"
          )
      ),
    ];


  return {
    id,
    title,
    family: "team",
    services: [
      ...common,
      ...role,
    ],
  };
}


const ADVISERS =
  teamDashboard(
    "advisers",
    "Board of Advisers",

    [
      "Strategic Briefing",
      "Review Requests",
      "Intelligence & Reports",
    ],

    [
      "Adviser Notes",
      "Recommendations",
      "Decision History",
    ]
  );


const EDITORS =
  teamDashboard(
    "editors",
    "Board of Editors",

    [
      "Editorial Inbox",
      "Under Review",
      "Sources & Evidence",
    ],

    [
      "Editorial Decisions",
      "Return to Admin",
      "Published History",
    ]
  );


const KNOWLEDGE_CONTRIBUTOR =
  teamDashboard(
    "knowledge-contributor",
    "Knowledge Contributor",

    [
      "Create Contribution",
      "Research & Sources",
      "Drafts",
    ],

    [
      "Review Feedback",
      "Published Knowledge",
      "Contribution History",
    ]
  );


const REGIONAL_PARTNER =
  teamDashboard(
    "regional-partner",
    "Regional Knowledge Partner",

    [
      "Regional Overview",
      "Knowledge & Projects",
      "Organisations & Institutions",
    ],

    [
      "Opportunities & Partnerships",
      "Regional Growth",
      "Contribution & Business Pipeline",
    ]
  );


const OPERATIONS =
  teamDashboard(
    "operations",
    "Internal Operations",

    [
      "Operational Queue",
      "Members & Organisations",
      "Contribution Processing",
    ],

    [
      "Verification & Review",
      "Data Quality",
      "Issues & Reports",
    ]
  );


type LeadershipSpec = {
  id: string;
  title: string;
  portfolio: string;
  workspaceTitle: string;
  controlTitle: string;
  workspace: string[];
  control: string[];
};


const LEADERSHIP: LeadershipSpec[] = [

  {
    id:
      "leadership-knowledge-intelligence",

    title:
      "Leadership — Knowledge & Intelligence",

    portfolio:
      "knowledge-intelligence",

    workspaceTitle:
      "Knowledge Leadership",

    controlTitle:
      "Knowledge Intelligence & Control",

    workspace: [
      "Knowledge Coverage",
      "Contribution Pipeline",
      "Research & Standards",
    ],

    control: [
      "Evidence & Quality",
      "Intelligence Reports",
      "Knowledge Gaps & Priorities",
    ],
  },


  {
    id:
      "leadership-education-institutions",

    title:
      "Leadership — Education & Institutions",

    portfolio:
      "education-institutions",

    workspaceTitle:
      "Education Leadership",

    controlTitle:
      "Education Intelligence & Growth",

    workspace: [
      "University Network",
      "Programmes & Learning",
      "Research Institutions",
    ],

    control: [
      "Academic Partnerships",
      "Education Opportunities",
      "Education Growth & Impact",
    ],
  },


  {
    id:
      "leadership-community-network",

    title:
      "Leadership — Community & Network",

    portfolio:
      "community-network",

    workspaceTitle:
      "Community Leadership",

    controlTitle:
      "Network Intelligence & Growth",

    workspace: [
      "Member Network",
      "Contributors & Experts",
      "Advisers & Chapters",
    ],

    control: [
      "Regional Network",
      "Collaboration",
      "Community Growth & Health",
    ],
  },


  {
    id:
      "leadership-growth-partnerships",

    title:
      "Leadership — Growth & Partnerships",

    portfolio:
      "growth-partnerships",

    workspaceTitle:
      "Growth Workspace",

    controlTitle:
      "Growth Intelligence & Control",

    workspace: [
      "Strategic Partnerships",
      "Regional Expansion",
      "Organisation Growth",
    ],

    control: [
      "Business Pipeline",
      "Opportunities",
      "Growth Reports & Priorities",
    ],
  },


  {
    id:
      "leadership-product-platform",

    title:
      "Leadership — Product & Platform",

    portfolio:
      "product-platform",

    workspaceTitle:
      "Product Leadership",

    controlTitle:
      "Product Intelligence & Control",

    workspace: [
      "Product Roadmap",
      "Arknoz Pro & ONE",
      "Search, Data & Intelligence",
    ],

    control: [
      "Experience & Adoption",
      "Product Issues",
      "Release Priorities",
    ],
  },


  {
    id:
      "leadership-operations-trust",

    title:
      "Leadership — Operations & Trust",

    portfolio:
      "operations-trust",

    workspaceTitle:
      "Operations Leadership",

    controlTitle:
      "Trust & Control",

    workspace: [
      "Operational Health",
      "Verification & Review",
      "Data Quality & Provenance",
    ],

    control: [
      "Security & Access",
      "Compliance & Risk",
      "Escalations & Reports",
    ],
  },
];


function leadershipDashboard(
  spec:
    LeadershipSpec
): DashboardSpec {

  const base =
    `/preview/workspaces/team/leadership/${spec.portfolio}`;


  return {
    id:
      spec.id,

    title:
      spec.title,

    family:
      "leadership",

    services: [

      ...TEAM_COMMON.map(
        (title, index) =>
          service(
            title,
            index < 3
              ? "My Arknoz"
              : "My Platform",
            `${base}/${slug(title)}`,
            "TEAM"
          )
      ),


      ...spec.workspace.map(
        (title) =>
          service(
            title,
            spec.workspaceTitle,
            `${base}/${slug(title)}`,
            "TEAM"
          )
      ),


      ...spec.control.map(
        (title) =>
          service(
            title,
            spec.controlTitle,
            `${base}/${slug(title)}`,
            "TEAM"
          )
      ),
    ],
  };
}


export const DASHBOARD_SPECS:
  DashboardSpec[] = [

  INDIVIDUAL,
  COMPANY,
  UNIVERSITY,
  INSTITUTION,

  ADVISERS,
  EDITORS,
  KNOWLEDGE_CONTRIBUTOR,
  REGIONAL_PARTNER,
  OPERATIONS,

  ...LEADERSHIP.map(
    leadershipDashboard
  ),
];


export const DASHBOARD_ENDPOINTS =
  DASHBOARD_SPECS.flatMap(
    (dashboard) =>
      dashboard.services.map(
        (service, index) => ({
          dashboardId:
            dashboard.id,

          dashboardTitle:
            dashboard.title,

          family:
            dashboard.family,

          slot:
            index + 1,

          ...service,
        })
      )
  );


if (
  DASHBOARD_SPECS.length !==
  15
) {
  throw new Error(
    `Arknoz dashboard registry must contain 15 dashboards; found ${DASHBOARD_SPECS.length}.`
  );
}


for (
  const dashboard
  of DASHBOARD_SPECS
) {
  if (
    dashboard.services.length !==
    12
  ) {
    throw new Error(
      `${dashboard.title} must contain exactly 12 services; found ${dashboard.services.length}.`
    );
  }
}


if (
  DASHBOARD_ENDPOINTS.length !==
  180
) {
  throw new Error(
    `Arknoz dashboard registry must contain exactly 180 endpoints; found ${DASHBOARD_ENDPOINTS.length}.`
  );
}