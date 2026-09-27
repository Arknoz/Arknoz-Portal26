import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";
import OrganisationAccountMenu from "@/components/OrganisationAccountMenu";
import ProductionOrganisationModuleWorkspace from "@/components/ProductionOrganisationModuleWorkspace";

import {
  getOrganisationModuleDefinition,
} from "@/lib/workspaces/organisation-module-definitions";

import type {
  OrganisationDashboardDefinition,
} from "@/lib/workspaces/organisation-dashboard-v3";


const UTILITIES = {
  settings: {
    title:
      "Settings",

    description:
      "Workspace identity, preferences and configuration.",
  },

  notifications: {
    title:
      "Notifications",

    description:
      "Workspace alerts and notification preferences.",
  },

  security: {
    title:
      "Security",

    description:
      "Workspace access and security controls.",
  },
} as const;


export default function ProductionOrganisationModuleV3({
  dashboard,
  moduleId,
  workspaceId,
  userId,
  roleLabel,
  oneUnlocked,
}: {
  dashboard:
    OrganisationDashboardDefinition;

  moduleId:
    string;

  workspaceId:
    string;

  userId:
    string;

  roleLabel:
    string;

  oneUnlocked:
    boolean;
}) {

  const baseHref =
    `/workspace/${workspaceId}`;


  const profileModuleId =
    dashboard.groups[0]
      ?.services[0]
      ?.id ?? "";


  const utility =
    UTILITIES[
      moduleId as
        keyof typeof UTILITIES
    ];


  let found:
    {
      service: {
        id: string;
        title: string;
        description: string;
        access:
          "FREE" |
          "ONE";
      };

      groupTitle:
        string;
    } |
    null =
      null;


  for (
    const group
    of dashboard.groups
  ) {

    const service =
      group.services.find(
        (item) =>
          item.id ===
            moduleId
      );


    if (service) {

      found = {
        service,

        groupTitle:
          group.title,
      };

      break;
    }
  }


  if (
    !utility &&
    !found
  ) {
    notFound();
  }


  if (
    found?.service.access ===
      "ONE" &&
    !oneUnlocked
  ) {
    redirect(
      baseHref
    );
  }


  const definition =
    found
      ? getOrganisationModuleDefinition(
          dashboard.id,
          moduleId
        )
      : null;


  if (
    found &&
    !definition
  ) {
    notFound();
  }


  const title =
    utility?.title ??
    found?.service.title ??
    "";


  const description =
    utility?.description ??
    found?.service.description ??
    "";


  return (
    <>
      <GlobalHeader />


      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-[1512px] items-center justify-between gap-5 px-5 py-3 sm:px-8 lg:px-10">

          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {dashboard.workspaceIdLabel}
              </p>

              <p className="mt-0.5 text-xs font-bold text-[#17315c]">
                {workspaceId
                  .slice(0, 8)
                  .toUpperCase()}
              </p>

            </div>


            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                PLAN
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {oneUnlocked
                  ? "Arknoz ONE"
                  : dashboard.freePlanLabel}
              </p>

            </div>


            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                ROLE
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                {roleLabel}
              </p>

            </div>

          </div>


          <OrganisationAccountMenu
            baseHref={baseHref}
            profileModuleId={profileModuleId}
            oneUnlocked={false}
          />

        </div>

      </div>


      <main className="bg-[#f7f8fa]">

        <section className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10">

          <Link
            href={baseHref}
            className="text-xs font-bold text-blue-700"
          >
            Back to dashboard
          </Link>


          <div className="mt-5 border-b border-slate-200 pb-5">

            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  {utility
                    ? "WORKSPACE UTILITY"
                    : found?.groupTitle}
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#17315c]">
                  {title}
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {description}
                </p>

              </div>


              <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                {found?.service.access ??
                  "UTILITY"}
              </span>

            </div>

          </div>


          {definition ? (

            <div className="mt-5">

              <ProductionOrganisationModuleWorkspace
                kind={dashboard.id}
                moduleId={moduleId}
                template={
                  definition.template
                }
                entityLabel={
                  definition.entityLabel
                }
                workspaceId={
                  workspaceId
                }
                userId={
                  userId
                }
              />


              <div className="mt-4 flex flex-wrap gap-2">

                {definition.publicHref ? (

                  <Link
                    href={
                      definition.publicHref
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#17315c] hover:bg-slate-50"
                  >
                    Browse related public Arknoz data
                  </Link>

                ) : null}


                <Link
                  href={baseHref}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Return to dashboard
                </Link>

              </div>

            </div>

          ) : (

            <div className="mt-5 rounded-[20px] border border-slate-200 bg-white p-5">

              <h2 className="text-lg font-bold text-[#17315c]">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                This workspace utility is ready for its dedicated account controls.
              </p>

            </div>

          )}

        </section>

      </main>


      <GlobalFooter />
    </>
  );
}