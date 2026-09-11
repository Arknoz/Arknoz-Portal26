import Link from "next/link";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function PhaseRoadmap() {
  const phases = [
    {
      title: "01 EXPLORE",
      status: "AVAILABLE NOW",
      headline: "The Built World organised.",
      text: "Search, discover and follow the Built World globally.",
      href: "/explore",
      action: "Start exploring",
      className: "border-blue-200 bg-blue-50",
      accent: "text-blue-700",
    },
    {
      title: "02 CONNECT",
      status: "COMING JAN 2027",
      headline: "The Built World made useful.",
      text: "Compare, collaborate, organise and grow together.",
      href: "/connect",
      action: "Preview Connect",
      className: "border-slate-200 bg-white",
      accent: "text-slate-950",
    },
    {
      title: "03 INTELLIGENCE",
      status: "PLANNED APR 2027",
      headline: "The Built World understood.",
      text: "Evidence-led insight where Arknoz has sufficient trusted data.",
      href: "/intelligence",
      action: "Preview Intelligence",
      className: "border-purple-200 bg-purple-50",
      accent: "text-purple-700",
    },
  ];

  return (
    <section id="roadmap" className="bg-slate-50 py-8">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="mb-5 flex items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
              ARKNOZ ROADMAP
            </p>
            <h2 className="mt-1.5 text-3xl font-bold text-slate-950">
              Explore. Connect. Intelligence.
            </h2>
          </div>

          <p className="hidden max-w-xl text-right text-sm text-slate-600 md:block">
            Each later phase activates only when the product and data are ready.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className={`rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)] ${phase.className}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className={`font-bold ${phase.accent}`}>{phase.title}</span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                  {phase.status}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-950">
                {phase.headline}
              </h3>
              <p className="mt-2 text-slate-600">{phase.text}</p>

              <Link href={phase.href} className={`group mt-5 inline-flex items-center gap-1.5 font-semibold ${phase.accent}`}>
                {phase.action}
                <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
