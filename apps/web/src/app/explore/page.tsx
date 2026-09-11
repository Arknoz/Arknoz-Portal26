import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <Link href="/" className="text-sm font-semibold text-blue-700">
          ← Global Home
        </Link>

        <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-950">
          Explore the Built World
        </h1>

        <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-600">
          Projects, products, knowledge, learning, opportunities, people, organisations, universities and places.
        </p>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <p className="font-semibold text-slate-900">
            Arknoz Phase 1
          </p>
          <p className="mt-2 text-slate-600">
            This destination is active. Its complete production experience will be built in the next implementation batches.
          </p>
        </div>
      </section>
    </main>
  );
}
