import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  robots: {
    index: false,
    follow: false,
  },
};
import {
  notFound,
  redirect,
} from "next/navigation";

import ProductionTeamPanelPage from "@/components/ProductionTeamPanelPage";

import {
  findRolePanel,
  toTeamPanelSlug,
} from "@/lib/workspaces/team-panel-routing";

import {
  requireProductionTeamAssignment,
} from "@/lib/workspaces/production-team-access";

import {
  getProductionTeamDashboard,
} from "@/lib/workspaces/production-team-dashboard";


const COMMON_PANEL_DESTINATIONS:
  Record<
    string,
    string
  > = {
    profile:
      "/dashboard/profile",

    contributions:
      "/dashboard/contributions",

    activity:
      "/dashboard/activity",

    messages:
      "/dashboard/messages",

    saved:
      "/dashboard/saved",

    opportunities:
      "/dashboard/opportunities",
  };


export default async function ProductionTeamPanelRoute({
  params,
}: {
  params: Promise<{
    panel:
      string;
  }>;
}) {

  const {
    panel,
  } =
    await params;


  const assignment =
    await requireProductionTeamAssignment(
      `/team/${panel}`
    );


  const dashboard =
    getProductionTeamDashboard(
      assignment
    );


  const match =
    findRolePanel(
      dashboard,
      panel
    );


  if (!match) {
    notFound();
  }


  const panelKey =
    match.panel.routeKey ??
    toTeamPanelSlug(
      match.panel.title
    );


  if (
    COMMON_PANEL_DESTINATIONS[
      panelKey
    ]
  ) {
    redirect(
      COMMON_PANEL_DESTINATIONS[
        panelKey
      ]
    );
  }


  return (
    <ProductionTeamPanelPage
      dashboard={
        dashboard
      }
      group={
        match.group
      }
      panel={
        match.panel
      }
      assignmentId={
        assignment.id
      }
      userId={
        assignment.userId
      }
      panelKey={
        panelKey
      }
      accessGrant={
        assignment.accessGrant
      }
      scopeLabel={
        assignment.scopeLabel
      }
      scopeValue={
        assignment.scopeValue
      }
    />
  );
}