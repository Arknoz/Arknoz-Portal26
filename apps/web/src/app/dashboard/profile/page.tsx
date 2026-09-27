import Link from "next/link";
import { redirect } from "next/navigation";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import MemberProfileEditor from "@/components/MemberProfileEditor";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile | My Arknoz",
  description: "Manage your Arknoz professional identity and public profile.",
};

export default async function DashboardProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?returnTo=%2Fdashboard%2Fprofile");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <GlobalHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-6 lg:px-10">
          <Link
            href="/dashboard"
            className="text-[11px] font-bold text-blue-700"
          >
            ← My Arknoz
          </Link>

          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              PROFESSIONAL IDENTITY
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17315c] sm:text-4xl">
              Profile
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Manage the professional information that forms your Arknoz member profile.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
        <MemberProfileEditor />
      </section>

      <GlobalFooter />
    </main>
  );
}
