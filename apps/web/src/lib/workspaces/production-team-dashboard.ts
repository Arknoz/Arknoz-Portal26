import {
  getLeadershipDashboard,
  TEAM_ROLE_DASHBOARDS,
} from "@/lib/workspaces/team-role-dashboards";

import type {
  LeadershipPortfolioId,
  TeamRoleDashboardDefinition,
} from "@/lib/workspaces/team-role-dashboards";

import type {
  ProductionLeadershipPortfolio,
  ProductionTeamAssignment,
} from "@/lib/workspaces/production-team-access";


const LEADERSHIP_DASHBOARDS:
  Record<
    ProductionLeadershipPortfolio,
    LeadershipPortfolioId
  > = {
    knowledge_intelligence:
      "knowledge-intelligence",

    education_institutions:
      "education-institutions",

    community_network:
      "community-network",

    growth_partnerships:
      "growth-partnerships",

    product_platform:
      "product-platform",

    operations_trust:
      "operations-trust",
  };


export function getProductionTeamDashboard(
  assignment:
    ProductionTeamAssignment
): TeamRoleDashboardDefinition {

  switch (
    assignment.teamRole
  ) {

    case "adviser":
      return TEAM_ROLE_DASHBOARDS[
        "advisers"
      ];


    case "editor":
      return TEAM_ROLE_DASHBOARDS[
        "editors"
      ];


    case "knowledge_contributor":
      return TEAM_ROLE_DASHBOARDS[
        "knowledge-contributor"
      ];


    case "regional_partner":
      return TEAM_ROLE_DASHBOARDS[
        "regional-partner"
      ];


    case "operations":
      return TEAM_ROLE_DASHBOARDS[
        "operations"
      ];


    case "leadership": {

      if (
        !assignment
          .leadershipPortfolio
      ) {
        throw new Error(
          "Leadership assignment requires a portfolio."
        );
      }


      return getLeadershipDashboard(
        LEADERSHIP_DASHBOARDS[
          assignment
            .leadershipPortfolio
        ]
      );
    }
  }
}