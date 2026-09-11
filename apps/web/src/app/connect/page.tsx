import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import Link from "next/link";

const services = [
  "University to Industry",
  "Arknoz Tools",
  "Professional Journeys",
  "Compare & Select",
  "Workspace",
  "Collaborate",
  "Community",
  "Alerts & Watches",
];

export default function ConnectPage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="bg-[#0d2747] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
            Phase 2 · Coming January 2027
          </p>

          <h1 className="mt-4 text-5xl font-bold md:text-7xl">
            Connect the Built World.
          </h1>

          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-200">
            Turn discovery into professional action, collaboration and continuity.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <span className="text-sm">🔒</span>
              <h2 className="mt-4 text-xl font-bold">{service}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Preview only. This capability activates in Phase 2.
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/explore"
          className="mt-10 inline-flex font-semibold text-blue-700"
        >
          ← Continue with Explore
        </Link>
      </section>

      <GlobalFooter />
    </main>
  );
}
