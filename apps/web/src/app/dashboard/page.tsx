import Link from "next/link";
import { redirect } from "next/navigation";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My Arknoz | Arknoz",
  description:
    "Your personal Arknoz dashboard.",
};

const MODULES = [
  {
    title: "Profile",
    description:
      "Manage your Arknoz identity, professional information and public profile.",
    href: "/people",
  },
  {
    title: "Saved",
    description:
      "Return to projects, products, knowledge and other records you have saved.",
    href: "/explore",
  },
  {
    title: "Contributions",
    description:
      "Submit and follow your contributions to the Arknoz platform.",
    href: "/contribute",
  },
  {
    title: "Messages",
    description:
      "Your Arknoz conversations, notices and future collaboration messages.",
    href: "#",
  },
  {
    title: "Meetings",
    description:
      "Meetings, invitations and follow-up activity connected to your Arknoz work.",
    href: "#",
  },
  {
    title: "Opportunities",
    description:
      "Jobs, competitions, collaborations and other Built World opportunities.",
    href: "/opportunities",
  },
  {
    title: "Activity",
    description:
      "Your recent Arknoz activity, contributions and participation.",
    href: "#",
  },
  {
    title: "Settings",
    description:
      "Account, privacy, communication and future membership settings.",
    href: "#",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/sign-in?returnTo=%2Fdashboard"
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <GlobalHeader />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
                PERSONAL DASHBOARD
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                My Arknoz
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Your personal place to manage your Arknoz
                identity, saved information, contributions,
                opportunities and activity across the Built
                World.
              </p>
            </div>

            <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              Arknoz ID active
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {MODULES.map((module) => (
                <Link
                  key={module.title}
                  href={module.href}
                  className="rounded-[22px] border border-slate-200 bg-white p-6 transition hover:border-[#17315c] hover:shadow-sm"
                >
                  <h2 className="text-lg font-bold text-[#17315c]">
                    {module.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {module.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[22px] border border-slate-200 p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                YOUR ARKNOZ
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">
                    Account
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Individual
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Arknoz ID
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Active
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Workspace
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Personal
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-blue-100 bg-blue-50/60 p-6">
              <p className="text-sm font-bold text-[#17315c]">
                One Arknoz identity.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                If you later receive an organisation,
                university, Editor, Advisor, KP, RKP or
                other authorised role, additional Arknoz
                workspaces can appear under the same
                identity.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}