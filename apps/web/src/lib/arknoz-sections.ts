export type ArknozSectionKey =
  | "projects"
  | "products"
  | "knowledge"
  | "learning"
  | "opportunities"
  | "people"
  | "organisations"
  | "universities"
  | "places"
  | "community"
  | "connect"
  | "intelligence";

export type ArknozEntityType =
  | "project"
  | "product"
  | "knowledge"
  | "person"
  | "organisation"
  | "university"
  | "opportunity"
  | "place";

export type ArknozSubsectionRoute =
  | {
      kind: "query";
      key: "type" | "view";
      value: string;
    }
  | {
      kind: "path";
      value: string;
    }
  | {
      kind: "href";
      value: string;
    };

export type ArknozSubsection = {
  slug: string;
  label: string;
  description?: string;
  route: ArknozSubsectionRoute;
};

export type ArknozSection = {
  key: ArknozSectionKey;
  title: string;
  short: string;
  href: string;
  description: string;
  geoAware: boolean;
  entityTypes: ArknozEntityType[];
  subsections: ArknozSubsection[];
};

export const arknozSections: ArknozSection[] = [
  {
    key: "projects",
    title: "Projects",
    short: "Projects",
    href: "/projects",
    description:
      "Explore built work from individual buildings to infrastructure, interiors, landscapes and urban projects.",
    geoAware: true,
    entityTypes: ["project"],
    subsections: [
      {
        slug: "buildings",
        label: "Buildings",
        route: { kind: "query", key: "type", value: "buildings" },
      },
      {
        slug: "infrastructure",
        label: "Infrastructure",
        route: { kind: "query", key: "type", value: "infrastructure" },
      },
      {
        slug: "interiors",
        label: "Interiors",
        route: { kind: "query", key: "type", value: "interiors" },
      },
      {
        slug: "landscapes",
        label: "Landscapes",
        route: { kind: "query", key: "type", value: "landscapes" },
      },
      {
        slug: "urban-masterplanning",
        label: "Urban & Masterplanning",
        route: { kind: "query", key: "type", value: "urban" },
      },
      {
        slug: "case-projects",
        label: "Case Projects",
        route: { kind: "query", key: "type", value: "case-projects" },
      },
    ],
  },

  {
    key: "products",
    title: "Products",
    short: "Products",
    href: "/products",
    description:
      "Discover materials, components, building systems, equipment and technologies used across the Built World.",
    geoAware: true,
    entityTypes: ["product"],
    subsections: [
      {
        slug: "materials",
        label: "Materials",
        route: { kind: "query", key: "type", value: "materials" },
      },
      {
        slug: "components",
        label: "Components",
        route: { kind: "query", key: "type", value: "components" },
      },
      {
        slug: "building-systems",
        label: "Building Systems",
        route: { kind: "query", key: "type", value: "systems" },
      },
      {
        slug: "equipment",
        label: "Equipment",
        route: { kind: "query", key: "type", value: "equipment" },
      },
      {
        slug: "technologies",
        label: "Technologies",
        route: { kind: "query", key: "type", value: "technologies" },
      },
    ],
  },

  {
    key: "knowledge",
    title: "Knowledge",
    short: "Knowledge",
    href: "/knowledge",
    description:
      "Move through publications, research, standards, case studies, methods and ideas for the Built World.",
    geoAware: true,
    entityTypes: ["knowledge"],
    subsections: [
      {
        slug: "books-publications",
        label: "Books & Publications",
        description:
          "Explore books, reports, journals and publications that document ideas, evidence and practice across the Built World.",
        route: { kind: "path", value: "books-publications" },
      },
      {
        slug: "research-innovation",
        label: "Research & Innovation",
        description:
          "Explore research, experiments and innovations advancing knowledge, methods and technologies across the Built World.",
        route: { kind: "path", value: "research-innovation" },
      },
      {
        slug: "case-studies-solutions",
        label: "Case Studies & Solutions",
        description:
          "Explore applied case studies and solutions showing how Built World challenges are addressed in practice.",
        route: { kind: "path", value: "case-studies-solutions" },
      },
      {
        slug: "standards-references",
        label: "Standards & References",
        description:
          "Explore standards, codes, guidelines and reference material that support informed Built World practice.",
        route: { kind: "path", value: "standards-references" },
      },
      {
        slug: "methods-practice",
        label: "Methods & Practice",
        description:
          "Explore methods, workflows and professional practices used to plan, design, deliver and evaluate the Built World.",
        route: { kind: "path", value: "methods-practice" },
      },
      {
        slug: "ideas-insights",
        label: "Ideas & Insights",
        description:
          "Explore perspectives, ideas and insights that help interpret change, debate and emerging directions across the Built World.",
        route: { kind: "path", value: "ideas-insights" },
      },
    ],
  },

  {
    key: "learning",
    title: "Learning & Education",
    short: "Learning",
    href: "/learning",
    description:
      "Find structured learning for students, professionals and organisations across the Built World.",
    geoAware: true,
    entityTypes: [],
    subsections: [
      {
        slug: "courses",
        label: "Courses",
        route: { kind: "query", key: "type", value: "courses" },
      },
      {
        slug: "programmes",
        label: "Programmes",
        route: { kind: "query", key: "type", value: "programmes" },
      },
      {
        slug: "skills",
        label: "Skills",
        route: { kind: "query", key: "type", value: "skills" },
      },
      {
        slug: "professional-learning",
        label: "Professional Learning",
        route: {
          kind: "query",
          key: "type",
          value: "professional-learning",
        },
      },
      {
        slug: "tutorials",
        label: "Tutorials",
        route: { kind: "query", key: "type", value: "tutorials" },
      },
    ],
  },

  {
    key: "opportunities",
    title: "Opportunities",
    short: "Opportunities",
    href: "/opportunities",
    description:
      "Discover ways to work, compete, study, participate and advance across the Built World.",
    geoAware: true,
    entityTypes: ["opportunity"],
    subsections: [
      {
        slug: "jobs",
        label: "Jobs",
        route: { kind: "query", key: "type", value: "jobs" },
      },
      {
        slug: "internships",
        label: "Internships",
        route: { kind: "query", key: "type", value: "internships" },
      },
      {
        slug: "competitions",
        label: "Competitions",
        route: { kind: "query", key: "type", value: "competitions" },
      },
      {
        slug: "scholarships",
        label: "Scholarships",
        route: { kind: "query", key: "type", value: "scholarships" },
      },
      {
        slug: "grants",
        label: "Grants",
        route: { kind: "query", key: "type", value: "grants" },
      },
      {
        slug: "fellowships",
        label: "Fellowships",
        route: { kind: "query", key: "type", value: "fellowships" },
      },
      {
        slug: "events",
        label: "Events",
        route: { kind: "query", key: "type", value: "events" },
      },
      {
        slug: "awards",
        label: "Awards",
        route: { kind: "query", key: "type", value: "awards" },
      },
    ],
  },

  {
    key: "people",
    title: "People",
    short: "People",
    href: "/people",
    description:
      "Find the people shaping projects, knowledge, education, products and places.",
    geoAware: true,
    entityTypes: ["person"],
    subsections: [
      {
        slug: "professionals",
        label: "Professionals",
        route: { kind: "query", key: "type", value: "professionals" },
      },
      {
        slug: "experts",
        label: "Experts",
        route: { kind: "query", key: "type", value: "experts" },
      },
      {
        slug: "researchers",
        label: "Researchers",
        route: { kind: "query", key: "type", value: "researchers" },
      },
      {
        slug: "educators",
        label: "Educators",
        route: { kind: "query", key: "type", value: "educators" },
      },
      {
        slug: "students",
        label: "Students",
        route: { kind: "query", key: "type", value: "students" },
      },
      {
        slug: "emerging-professionals",
        label: "Emerging Professionals",
        route: {
          kind: "query",
          key: "type",
          value: "emerging-professionals",
        },
      },
    ],
  },

  {
    key: "organisations",
    title: "Organisations",
    short: "Organisations",
    href: "/organisations",
    description:
      "Discover the organisations delivering, manufacturing, regulating, researching and supporting the Built World.",
    geoAware: true,
    entityTypes: ["organisation"],
    subsections: [
      {
        slug: "firms",
        label: "Firms",
        route: { kind: "query", key: "type", value: "firms" },
      },
      {
        slug: "manufacturers",
        label: "Manufacturers",
        route: { kind: "query", key: "type", value: "manufacturers" },
      },
      {
        slug: "contractors",
        label: "Contractors",
        route: { kind: "query", key: "type", value: "contractors" },
      },
      {
        slug: "consultancies",
        label: "Consultancies",
        route: { kind: "query", key: "type", value: "consultancies" },
      },
      {
        slug: "professional-bodies",
        label: "Professional Bodies",
        route: {
          kind: "query",
          key: "type",
          value: "professional-bodies",
        },
      },
      {
        slug: "institutions",
        label: "Institutions",
        route: { kind: "query", key: "type", value: "institutions" },
      },
      {
        slug: "government",
        label: "Government",
        route: { kind: "query", key: "type", value: "government" },
      },
    ],
  },

  {
    key: "universities",
    title: "Universities",
    short: "Universities",
    href: "/universities",
    description:
      "Explore universities through their programmes, research, people, labs, student work and partnerships.",
    geoAware: true,
    entityTypes: ["university"],
    subsections: [
      {
        slug: "programmes",
        label: "Programmes",
        route: { kind: "query", key: "view", value: "programmes" },
      },
      {
        slug: "research",
        label: "Research",
        route: { kind: "query", key: "view", value: "research" },
      },
      {
        slug: "faculty",
        label: "Faculty",
        route: { kind: "query", key: "view", value: "faculty" },
      },
      {
        slug: "labs",
        label: "Labs",
        route: { kind: "query", key: "view", value: "labs" },
      },
      {
        slug: "student-work",
        label: "Student Work",
        route: { kind: "query", key: "view", value: "student-work" },
      },
      {
        slug: "scholarships",
        label: "Scholarships",
        route: { kind: "query", key: "view", value: "scholarships" },
      },
      {
        slug: "partnerships",
        label: "Partnerships",
        route: { kind: "query", key: "view", value: "partnerships" },
      },
    ],
  },

  {
    key: "places",
    title: "Places",
    short: "Places",
    href: "/places",
    description:
      "Explore geography as context: from the world to continents, countries, regions, cities and sites.",
    geoAware: true,
    entityTypes: ["place"],
    subsections: [
      {
        slug: "world",
        label: "World",
        route: { kind: "href", value: "/global" },
      },
      {
        slug: "continents",
        label: "Continents",
        route: { kind: "href", value: "/global" },
      },
      {
        slug: "countries",
        label: "Countries",
        route: { kind: "href", value: "/global" },
      },
      {
        slug: "regions",
        label: "Regions",
        route: { kind: "query", key: "type", value: "regions" },
      },
      {
        slug: "cities",
        label: "Cities",
        route: { kind: "query", key: "type", value: "cities" },
      },
      {
        slug: "sites",
        label: "Sites",
        route: { kind: "query", key: "type", value: "sites" },
      },
      {
        slug: "local-context",
        label: "Local Context",
        route: { kind: "query", key: "type", value: "context" },
      },
    ],
  },

  {
    key: "community",
    title: "Community",
    short: "Community",
    href: "/community",
    description:
      "Members, collaboration, contribution, news and development, competitions and jobs, and regional chapters. Community participation will be free with an Arknoz ID.",
    geoAware: true,
    entityTypes: [],
    subsections: [
      {
        slug: "members",
        label: "Arknoz Members",
        route: { kind: "query", key: "type", value: "members" },
      },
      {
        slug: "collaboration",
        label: "Collaboration",
        route: { kind: "query", key: "type", value: "collaboration" },
      },
      {
        slug: "contribution",
        label: "Contribution",
        route: { kind: "query", key: "type", value: "contribution" },
      },
      {
        slug: "news-development",
        label: "Arknoz News & Development",
        route: {
          kind: "query",
          key: "type",
          value: "news-development",
        },
      },
      {
        slug: "competitions-jobs",
        label: "Competitions & Jobs",
        route: {
          kind: "query",
          key: "type",
          value: "competitions-jobs",
        },
      },
      {
        slug: "chapters",
        label: "Arknoz Chapters",
        route: { kind: "query", key: "type", value: "chapters" },
      },
    ],
  },

  {
    key: "connect",
    title: "Connect",
    short: "Connect",
    href: "/connect",
    description:
      "Turn discovery into professional action, collaboration and continuity.",
    geoAware: true,
    entityTypes: [],
    subsections: [
      {
        slug: "university-industry",
        label: "University to Industry",
        route: {
          kind: "query",
          key: "type",
          value: "university-industry",
        },
      },
      {
        slug: "arknoz-tools",
        label: "Arknoz Tools",
        route: { kind: "query", key: "type", value: "arknoz-tools" },
      },
      {
        slug: "professional-journeys",
        label: "Professional Journeys",
        route: {
          kind: "query",
          key: "type",
          value: "professional-journeys",
        },
      },
      {
        slug: "compare-select",
        label: "Compare & Select",
        route: { kind: "query", key: "type", value: "compare-select" },
      },
      {
        slug: "workspace",
        label: "Workspace",
        route: { kind: "query", key: "type", value: "workspace" },
      },
      {
        slug: "collaborate",
        label: "Collaborate",
        route: { kind: "query", key: "type", value: "collaborate" },
      },
      {
        slug: "community",
        label: "Community",
        route: { kind: "query", key: "type", value: "community" },
      },
      {
        slug: "alerts-watches",
        label: "Alerts & Watches",
        route: { kind: "query", key: "type", value: "alerts-watches" },
      },
    ],
  },

  {
    key: "intelligence",
    title: "Intelligence",
    short: "Intelligence",
    href: "/intelligence",
    description:
      "Evidence-led analysis built from sufficient trusted, comparable and current Built World data.",
    geoAware: true,
    entityTypes: [],
    subsections: [
      {
        slug: "market-geographic",
        label: "Market & Geographic Intelligence",
        route: {
          kind: "query",
          key: "type",
          value: "market-geographic",
        },
      },
      {
        slug: "project-intelligence",
        label: "Project Intelligence",
        route: {
          kind: "query",
          key: "type",
          value: "project-intelligence",
        },
      },
      {
        slug: "product-system",
        label: "Product & System Intelligence",
        route: {
          kind: "query",
          key: "type",
          value: "product-system",
        },
      },
      {
        slug: "performance-benchmarking",
        label: "Performance & Benchmarking",
        route: {
          kind: "query",
          key: "type",
          value: "performance-benchmarking",
        },
      },
      {
        slug: "research-evidence",
        label: "Research & Evidence Intelligence",
        route: {
          kind: "query",
          key: "type",
          value: "research-evidence",
        },
      },
      {
        slug: "standards-regulatory",
        label: "Standards & Regulatory Intelligence",
        route: {
          kind: "query",
          key: "type",
          value: "standards-regulatory",
        },
      },
      {
        slug: "organisation-network",
        label: "Organisation & Network Intelligence",
        route: {
          kind: "query",
          key: "type",
          value: "organisation-network",
        },
      },
      {
        slug: "trends-signals-decision-support",
        label: "Trends, Signals & Decision Support",
        route: {
          kind: "query",
          key: "type",
          value: "trends-signals-decision-support",
        },
      },
    ],
  },
];

export function getArknozSection(
  key: ArknozSectionKey
) {
  return arknozSections.find(
    (section) => section.key === key
  );
}

export function findArknozSectionByTitle(
  title: string
) {
  return arknozSections.find(
    (section) =>
      section.title.toLowerCase() ===
      title.toLowerCase()
  );
}

export function getArknozSubsection(
  sectionKey: ArknozSectionKey,
  subsectionSlug: string
) {
  return getArknozSection(
    sectionKey
  )?.subsections.find(
    (subsection) =>
      subsection.slug === subsectionSlug
  );
}

function withQuery(
  href: string,
  key: string,
  value?: string
) {
  if (!value) {
    return href;
  }

  const [pathname, existingQuery = ""] =
    href.split("?");

  const params =
    new URLSearchParams(existingQuery);

  params.set(key, value);

  const query = params.toString();

  return query
    ? `${pathname}?${query}`
    : pathname;
}

export function buildArknozSectionHref(
  sectionKey: ArknozSectionKey,
  options?: {
    subsection?: string;
    geo?: string;
  }
) {
  const section =
    getArknozSection(sectionKey);

  if (!section) {
    return "/";
  }

  let href = section.href;

  if (options?.subsection) {
    const subsection =
      getArknozSubsection(
        sectionKey,
        options.subsection
      );

    if (subsection) {
      const route = subsection.route;

      if (route.kind === "path") {
        href =
          `${section.href}/${route.value}`;
      }

      if (route.kind === "href") {
        href = route.value;
      }

      if (route.kind === "query") {
        href = withQuery(
          section.href,
          route.key,
          route.value
        );
      }
    }
  }

  if (
    section.geoAware &&
    options?.geo &&
    options.geo !== "global"
  ) {
    href = withQuery(
      href,
      "geo",
      options.geo
    );
  }

  return href;
}
export const paidArknozSectionKeys =
  new Set<ArknozSectionKey>([
    "connect",
    "intelligence",
  ]);

export function isPaidArknozSection(
  key: ArknozSectionKey
) {
  return paidArknozSectionKeys.has(key);
}
