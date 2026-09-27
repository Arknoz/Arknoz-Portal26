export type OrganisationKind =
  | "company"
  | "university"
  | "institution";

export type OrganisationModuleTemplate =
  | "profile"
  | "people"
  | "catalogue"
  | "opportunity"
  | "contribution"
  | "portfolio"
  | "collaboration"
  | "evidence"
  | "intelligence"
  | "analytics"
  | "permissions";

export type OrganisationModuleDefinition = {
  template: OrganisationModuleTemplate;
  entityLabel: string;
  publicHref?: string;
};

export const ORG_MODULE_DEFINITIONS:
  Record<
    OrganisationKind,
    Record<
      string,
      OrganisationModuleDefinition
    >
  > = {

  company: {
    "company-profile": {
      template: "profile",
      entityLabel: "Company",
      publicHref: "/organisations",
    },

    people: {
      template: "people",
      entityLabel: "Company person",
      publicHref: "/people",
    },

    "products-services": {
      template: "catalogue",
      entityLabel: "Product or service",
      publicHref: "/products",
    },

    projects: {
      template: "catalogue",
      entityLabel: "Project",
      publicHref: "/projects",
    },

    knowledge: {
      template: "catalogue",
      entityLabel: "Knowledge record",
      publicHref: "/knowledge",
    },

    opportunities: {
      template: "opportunity",
      entityLabel: "Opportunity",
      publicHref: "/opportunities",
    },

    contributions: {
      template: "contribution",
      entityLabel: "Company contribution",
    },

    "portfolio-workspace": {
      template: "portfolio",
      entityLabel: "Portfolio",
    },

    collaboration: {
      template: "collaboration",
      entityLabel: "Collaboration",
    },

    "market-intelligence": {
      template: "intelligence",
      entityLabel: "Market intelligence view",
    },

    "analytics-benchmarks": {
      template: "analytics",
      entityLabel: "Analytics view",
    },

    "team-permissions": {
      template: "permissions",
      entityLabel: "Company member",
    },
  },


  university: {
    "university-profile": {
      template: "profile",
      entityLabel: "University",
      publicHref: "/universities",
    },

    people: {
      template: "people",
      entityLabel: "University person",
      publicHref: "/people",
    },

    programmes: {
      template: "catalogue",
      entityLabel: "Academic programme",
      publicHref: "/learning",
    },

    research: {
      template: "catalogue",
      entityLabel: "Research record",
      publicHref: "/knowledge/research-innovation",
    },

    projects: {
      template: "catalogue",
      entityLabel: "Research or academic project",
      publicHref: "/projects",
    },

    opportunities: {
      template: "opportunity",
      entityLabel: "Academic opportunity",
      publicHref: "/opportunities",
    },

    contributions: {
      template: "contribution",
      entityLabel: "University contribution",
    },

    "publications-evidence": {
      template: "evidence",
      entityLabel: "Publication or evidence record",
    },

    "industry-collaboration": {
      template: "collaboration",
      entityLabel: "Industry collaboration",
    },

    "research-analytics": {
      template: "analytics",
      entityLabel: "Research analytics view",
    },

    "impact-benchmarking": {
      template: "analytics",
      entityLabel: "Impact benchmark",
    },

    "team-permissions": {
      template: "permissions",
      entityLabel: "University member",
    },
  },


  institution: {
    "institution-profile": {
      template: "profile",
      entityLabel: "Institution",
      publicHref: "/organisations",
    },

    people: {
      template: "people",
      entityLabel: "Institution person",
      publicHref: "/people",
    },

    "knowledge-standards": {
      template: "catalogue",
      entityLabel: "Knowledge or standard",
      publicHref: "/knowledge/standards-references",
    },

    programmes: {
      template: "catalogue",
      entityLabel: "Programme",
      publicHref: "/learning",
    },

    projects: {
      template: "catalogue",
      entityLabel: "Project",
      publicHref: "/projects",
    },

    opportunities: {
      template: "opportunity",
      entityLabel: "Institution opportunity",
      publicHref: "/opportunities",
    },

    contributions: {
      template: "contribution",
      entityLabel: "Institution contribution",
    },

    "collaboration-network": {
      template: "collaboration",
      entityLabel: "Institution collaboration",
    },

    "impact-evidence": {
      template: "evidence",
      entityLabel: "Impact evidence",
    },

    "institutional-analytics": {
      template: "analytics",
      entityLabel: "Institution analytics view",
    },

    "geographic-intelligence": {
      template: "intelligence",
      entityLabel: "Geographic intelligence view",
    },

    "team-permissions": {
      template: "permissions",
      entityLabel: "Institution member",
    },
  },
};


export function getOrganisationModuleDefinition(
  kind: OrganisationKind,
  moduleId: string
) {
  return (
    ORG_MODULE_DEFINITIONS[kind]?.[
      moduleId
    ] ?? null
  );
}