export type FooterMetrics = {
  visitorsToday?: string | number | null;
  members?: string | number | null;
  projects?: string | number | null;
  productsSystems?: string | number | null;
  knowledgeItems?: string | number | null;
  opportunities?: string | number | null;
};

function show(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

export default function FooterMetricsPanel({
  metrics,
}: {
  metrics?: FooterMetrics;
}) {
  const items = [
    ["Visitors today", metrics?.visitorsToday],
    ["Members", metrics?.members],
    ["Projects", metrics?.projects],
    ["Products & systems", metrics?.productsSystems],
    ["Knowledge", metrics?.knowledgeItems],
    ["Opportunities", metrics?.opportunities],
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4">
      <div className="grid gap-4 xl:grid-cols-[250px_1fr] xl:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">
            ARKNOZ AT A GLANCE
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            Live platform data
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Genuine analytics and database values only.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {items.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#0a223c] px-4 py-3"
            >
              <div className="text-xl font-bold leading-none text-white">
                {show(value)}
              </div>
              <div className="mt-1.5 text-[12px] leading-4 text-slate-300">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
