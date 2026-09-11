import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Join Arknoz
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          Build your own Built World.
        </h1>

        <p className="mt-5 text-xl leading-8 text-slate-600">
          Join to save projects, follow topics, organise collections
          and personalise what Arknoz shows you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            "Save projects and knowledge",
            "Follow people and organisations",
            "Build collections",
            "Personalise your interests",
            "Track opportunities",
            "Continue where you left off",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 p-5 font-medium"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-7">
          <strong>Arknoz Phase 1 membership is free.</strong>

          <p className="mt-2 text-slate-600">
            Supabase authentication will be connected in the next
            implementation step.
          </p>
        </div>

        <Link
          href="/sign-in"
          className="mt-8 inline-block font-semibold text-blue-700"
        >
          Already have an Arknoz ID? Sign in →
        </Link>
      </section>

      <GlobalFooter />
    </main>
  );
}
