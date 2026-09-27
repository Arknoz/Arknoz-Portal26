export type ArknozLiveMetric = {
  key: string;
  label: string;
  value?: number | string | null;
};

const defaultMetrics: ArknozLiveMetric[] = [
  { key: "visitors-today", label: "Visitors today" },
  { key: "members", label: "Members" },
  { key: "records", label: "Total records" },
  { key: "projects", label: "Projects" },
  { key: "products", label: "Products" },
  { key: "knowledge", label: "Knowledge" },
  { key: "opportunities", label: "Opportunities" },
];

export default function ArknozLivePlatformPanel({
  metrics = defaultMetrics,
}: {
  metrics?: ArknozLiveMetric[];
}) {
  return (
    <section
      aria-label="Arknoz live platform data"
      className="overflow-hidden rounded-[16px] border border-white/12 bg-[#0b223b]"
    >
      <div className="grid lg:grid-cols-[155px_repeat(7,minmax(0,1fr))]">

        <div className="flex min-h-[58px] items-center justify-between border-b border-white/10 px-4 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-blue-200">
              Arknoz Live
            </p>

            <p className="mt-1 text-[12px] font-semibold text-white">
              Platform now
            </p>
          </div>

          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        {metrics.map((metric) => {
          const hasValue =
            metric.value !== null &&
            metric.value !== undefined &&
            metric.value !== "";

          return (
            <div
              key={metric.key}
              className="flex min-h-[58px] flex-col justify-center border-b border-r border-white/10 px-3 lg:border-b-0"
            >
              <p className="text-[7px] font-bold uppercase tracking-[0.10em] text-slate-500">
                {metric.label}
              </p>

              <p
                className={
                  hasValue
                    ? "mt-1.5 text-[18px] font-semibold leading-none text-white"
                    : "mt-1.5 text-[9px] text-slate-400"
                }
              >
                {hasValue ? metric.value : "Connecting…"}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
}