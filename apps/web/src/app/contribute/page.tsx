import Link from "next/link";
import { redirect } from "next/navigation";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import ContributionUploader from "@/components/ContributionUploader";

import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Contribute | Arknoz",

  description:
    "Contribute trusted Built World information, sources and supporting material to Arknoz.",
};

const PROCESS = [
  "Choose the contribution area",
  "Upload supporting source material privately",
  "Accept the contributor responsibility declaration",
  "Submit the contribution to Arknoz Admin",
  "Admin checks relevance and completeness",
  "Admin assigns the appropriate Editor",
  "Editor reviews information, sources and evidence",
  "Authority, permissions and publication rights are checked",
  "Arknoz makes the final publication decision",
];

export default async function ContributePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/sign-in?returnTo=%2Fcontribute&action=contribute"
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <GlobalHeader />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10">
          <div className="max-w-5xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
              ARKNOZ CONTRIBUTION
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Contribute to the Built World.
            </h1>

            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">
              Add trusted information, records and supporting
              material across Arknoz — including projects,
              products, materials, knowledge, research,
              education, opportunities, people,
              organisations, universities, places,
              collaborations, standards, data and other
              Built World information.
            </p>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-500">
              Contributions remain private during intake and
              editorial review. Submission does not
              automatically verify, endorse or publish
              information on Arknoz.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            <ContributionUploader />
          </div>

          <aside className="space-y-5">
            <div className="rounded-[22px] border border-slate-200 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  CONTRIBUTION PROCESS
                </p>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Arknoz ID active
                </span>
              </div>

              <ol className="mt-5 space-y-4 text-sm">
                {PROCESS.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                      {index + 1}
                    </span>

                    <span className="leading-6 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[22px] border border-blue-100 bg-blue-50/60 p-6">
              <p className="text-sm font-bold text-[#17315c]">
                Admin and Editor controlled.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Public contributions first enter the private
                Arknoz intake workflow. Admin reviews the
                submission and assigns an Editor before any
                publication decision is made.
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-200 p-6">
              <p className="text-sm font-bold text-[#17315c]">
                Contributor responsibility.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The contributor must confirm responsibility
                for the submitted information and confirm
                sufficient ownership, authority or permission
                to provide the source material to Arknoz.
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-200 p-6">
              <p className="text-sm font-bold text-[#17315c]">
                Publication remains separate.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submission, source review, verification,
                authority, rights and publication are
                separate stages. Nothing becomes public
                automatically.
              </p>
            </div>

            <Link
              href="/community"
              className="block rounded-[18px] border border-slate-200 px-5 py-4 text-center text-sm font-semibold text-[#17315c] hover:border-[#17315c]"
            >
              Back to Community
            </Link>
          </aside>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}