import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import Link from "next/link";

const services = [
  "Market & Geographic Intelligence",
  "Project Intelligence",
  "Product & System Intelligence",
  "Performance & Benchmarking",
  "Research & Evidence Intelligence",
  "Standards & Regulatory Intelligence",
  "Organisation & Network Intelligence",
  "Trends, Signals & Decision Support",
];

export default function IntelligencePage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="bg-[#17152f] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-200">
            Phase 3 · Planned April 2027
          </p>

          <h1 className="mt-4 text-5xl font-bold md:text-7xl">
            Understand the Built World.
          </h1>

          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-200">
            Evidence-led analysis activates progressively where Arknoz has sufficient trusted, comparable and current data.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-purple-100 bg-purple-50 p-6"
            >
              <span className="text-sm">🔒</span>
              <h2 className="mt-4 text-xl font-bold">{service}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Preview only. Activation depends on coverage and evidence quality.
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/explore"
          className="mt-10 inline-flex font-semibold text-purple-700"
        >
          ← Continue with Explore
        </Link>
      </section>

      <GlobalFooter />
    </main>
  );
}
