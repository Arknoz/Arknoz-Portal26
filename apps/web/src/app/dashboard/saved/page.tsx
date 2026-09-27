import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";
import MemberSavedItems from "@/components/MemberSavedItems";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Saved | My Arknoz",
};

export default async function SavedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?returnTo=%2Fdashboard%2Fsaved");
  }

  return (
    <>
      <GlobalHeader />

      <main className="min-h-screen bg-[#f7f9fc]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1512px] px-5 py-8 sm:px-8 lg:px-10">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-blue-700"
            >
              ← My Arknoz
            </Link>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              PERSONAL WORKSPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17315c] sm:text-4xl">
              Saved
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Return to projects, products, knowledge and other Arknoz records
              you want to keep close.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1512px] px-5 py-8 sm:px-8 lg:px-10">
          <MemberSavedItems />
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}