import Link from "next/link";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";

import {
  toTeamPanelSlug,
} from "@/lib/workspaces/team-panel-routing";

import type {
  TeamPanel,
  TeamPanelGroup,
  TeamRoleDashboardDefinition,
} from "@/lib/workspaces/team-role-dashboards";


function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function Panel({
  panel,
  baseHref,
}: {
  panel:
    TeamPanel;

  baseHref:
    string;
}) {

  const panelKey =
    panel.routeKey ??
    toTeamPanelSlug(
      panel.title
    );


  return (
    <Link
      href={
        `${baseHref}/${panelKey}`
      }
      className="group flex min-h-[76px] items-start justify-between gap-3 border-t border-slate-100 px-4 py-3 transition hover:bg-slate-50"
    >

      <div className="min-w-0">

        <h3 className="text-[12px] font-bold leading-4 text-[#17315c]">
          {panel.title}
        </h3>

        <p className="mt-1 text-[9px] leading-[15px] text-slate-500">
          {panel.description}
        </p>

      </div>


      <span className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-slate-500">
        <Arrow />
      </span>

    </Link>
  );
}


function Group({
  group,
  baseHref,
}: {
  group:
    TeamPanelGroup;

  baseHref:
    string;
}) {

  return (
    <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">

      <div className="min-h-[70px] px-4 py-3">

        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
          {group.eyebrow}
        </p>

        <h2 className="mt-1 text-[14px] font-bold text-[#17315c]">
          {group.title}
        </h2>

      </div>


      {group.panels.map(
        (panel) => (
          <Panel
            key={
              panel.routeKey ??
              panel.title
            }
            panel={panel}
            baseHref={
              baseHref
            }
          />
        )
      )}

    </section>
  );
}


export default function ProductionTeamRoleDashboard({
  dashboard,
  accessGrant,
  scopeLabel,
  scopeValue,
}: {
  dashboard:
    TeamRoleDashboardDefinition;

  accessGrant:
    string;

  scopeLabel:
    string | null;

  scopeValue:
    string | null;
}) {

  const baseHref =
    "/team";


  return (
    <>
      <GlobalHeader />


      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-5 px-5 py-2.5 sm:px-8 lg:px-10">

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                ARKNOZ ID
              </p>

              <p className="mt-0.5 text-[11px] font-bold text-[#17315c]">
                Linked account
              </p>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                TEAM ROLE
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {dashboard.teamRoleLabel ??
                  dashboard.title}
              </p>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                TEAM GRANT
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {accessGrant}
              </p>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {scopeLabel ??
                  "SCOPE / REGION"}
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-600">
                {scopeValue ??
                  "Not specified"}
              </p>

            </div>

          </div>


          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-[#17315c]"
          >
            Account
          </Link>

        </div>

      </div>


      <main className="bg-[#f7f8fa]">

        <section className="mx-auto max-w-[1512px] px-5 py-4 sm:px-8 lg:px-10">

          <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                {dashboard.eyebrow}
              </p>

              <h1 className="mt-0.5 text-[26px] font-bold tracking-[-0.03em] text-[#17315c]">
                {dashboard.title}
              </h1>

              <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-500">
                {dashboard.description}
              </p>

            </div>


            <div className="flex gap-1.5">

              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-700">
                TEAM ACCESS
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">
                12 SERVICES
              </span>

            </div>

          </div>


          <div className="mt-3 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">

            {dashboard.groups.map(
              (group) => (
                <Group
                  key={
                    group.title
                  }
                  group={
                    group
                  }
                  baseHref={
                    baseHref
                  }
                />
              )
            )}

          </div>

        </section>

      </main>


      <GlobalFooter />
    </>
  );
}