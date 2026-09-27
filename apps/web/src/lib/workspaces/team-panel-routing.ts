import type {
  TeamPanel,
  TeamRoleDashboardDefinition,
} from "@/lib/workspaces/team-role-dashboards";


const LEADERSHIP_PORTFOLIO_PATHS:
  Record<string, string> = {
  "Knowledge & Intelligence":
    "knowledge-intelligence",

  "Education & Institutions":
    "education-institutions",

  "Community & Network":
    "community-network",

  "Growth & Partnerships":
    "growth-partnerships",

  "Product & Platform":
    "product-platform",

  "Operations & Trust":
    "operations-trust",
};


export function toTeamPanelSlug(
  value: string
) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export function getTeamPanelHref(
  dashboard:
    TeamRoleDashboardDefinition,
  panel:
    TeamPanel
) {
  if (panel.href) {
    return panel.href;
  }

  const panelSlug =
    panel.routeKey ??
    toTeamPanelSlug(
      panel.title
    );


  if (
    dashboard.id ===
    "leadership"
  ) {
    const portfolio =
      LEADERSHIP_PORTFOLIO_PATHS[
        dashboard.title
      ];

    if (!portfolio) {
      return "#";
    }

    return (
      `/preview/workspaces/team/leadership/${portfolio}/${panelSlug}`
    );
  }


  return (
    `/preview/workspaces/team/${dashboard.id}/${panelSlug}`
  );
}


export function findRolePanel(
  dashboard:
    TeamRoleDashboardDefinition,
  panelSlug:
    string
) {
  const roleGroups =
    dashboard.groups;

  for (
    const group
    of roleGroups
  ) {
    const panel =
      group.panels.find(
        (candidate) =>
          (
            candidate.routeKey ??
            toTeamPanelSlug(
              candidate.title
            )
          ) === panelSlug
      );

    if (panel) {
      return {
        panel,
        group,
      };
    }
  }

  return null;
}


export function getRelatedArknozPage(
  panelTitle: string
):
  | {
      href: string;
      label: string;
    }
  | null {

  const value =
    panelTitle.toLowerCase();


  if (
    value.includes("knowledge") ||
    value.includes("research") ||
    value.includes("source") ||
    value.includes("evidence") ||
    value.includes("standard")
  ) {
    return {
      href: "/knowledge",
      label: "Open Arknoz Knowledge",
    };
  }


  if (
    value.includes("project")
  ) {
    return {
      href: "/projects",
      label: "Open Arknoz Projects",
    };
  }


  if (
    value.includes("organisation") ||
    value.includes("institution")
  ) {
    return {
      href: "/organisations",
      label: "Open Organisations",
    };
  }


  if (
    value.includes("education") ||
    value.includes("university") ||
    value.includes("programme") ||
    value.includes("learning")
  ) {
    return {
      href: "/learning",
      label: "Open Arknoz Learning",
    };
  }


  if (
    value.includes("opportunit")
  ) {
    return {
      href: "/opportunities",
      label: "Open Opportunities",
    };
  }


  if (
    value.includes("community") ||
    value.includes("member") ||
    value.includes("adviser") ||
    value.includes("network")
  ) {
    return {
      href: "/community",
      label: "Open Arknoz Community",
    };
  }


  if (
    value.includes("regional") ||
    value.includes("region")
  ) {
    return {
      href: "/global",
      label: "Open Arknoz Global",
    };
  }


  if (
    value.includes("product") ||
    value.includes("platform")
  ) {
    return {
      href: "/products",
      label: "Open Arknoz Products",
    };
  }


  if (
    value.includes("intelligence")
  ) {
    return {
      href: "/intelligence",
      label: "Open Arknoz Intelligence",
    };
  }


  return null;
}