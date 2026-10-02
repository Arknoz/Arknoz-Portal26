import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import ContributionUploader from "@/components/ContributionUploader";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import GlobalHeader from "@/components/GlobalHeader";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Contribute | Arknoz",

  description:
    "Contribute genuine Built World projects, products, research, organisations, education and opportunities to Arknoz.",
};

export default async function ContributePage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/sign-in?returnTo=%2Fcontribute&action=contribute"
    );
  }

  const isPro =
    String(
      user.app_metadata
        ?.membership ??
        ""
    ).toUpperCase() ===
    "PRO";

  if (!isPro) {
    redirect(
      "/dashboard?locked=contributions#contributions"
    );
  }

  return (
    <>
      <GlobalHeader />

      <main className="min-h-screen bg-[#f5f7fa] text-slate-950">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1512px] px-5 py-8 sm:px-8 lg:px-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              MY ARKNOZ · PRO CONTRIBUTION
            </p>

            <h1 className="mt-2 max-w-5xl text-4xl font-bold tracking-[-0.04em] text-[#17315c] sm:text-5xl">
              Contribute to the Built World.
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
              Add genuine records and evidence to
              Arknoz. Every contribution remains
              private until Arknoz review. Existing
              canonical records are enriched rather
              than duplicated.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Project",
                "Product",
                "Knowledge & Research",
                "Organisation",
                "Education",
                "Opportunity",
              ].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-[#f7f9fc] px-3 py-1.5 text-[10px] font-bold text-slate-600"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1512px] px-5 py-8 sm:px-8 lg:px-10">
          <ContributionUploader />
        </section>

        <UniversalFooterStrip />
      </main>

      <UniversalPublicLastScreen />
    </>
  );
}