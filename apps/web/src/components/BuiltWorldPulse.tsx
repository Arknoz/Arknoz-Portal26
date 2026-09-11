import Link from "next/link";
import {entities} from "@/lib/entities";
import {getEntityHref} from "@/components/EntityCard";

const pulseSlugs = [
  "bosco-verticale",
  "urban-biodiversity",
  "research-fellowship",
  "milan",
];

export default function BuiltWorldPulse() {
  const items = pulseSlugs
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-white pt-4">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-t-3xl bg-gradient-to-r from-[#0d2a4a] via-[#0a2440] to-[#06192e] text-white">
          <div className="grid gap-6 px-7 py-7 lg:grid-cols-[1.05fr_1.95fr] lg:px-9">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                  ARKNOZ PULSE
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  What is moving across the Built World.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  A compact cross-world view of projects, knowledge, opportunities and places worth following now.
                </p>
              </div>

              <Link href="/explore" className="mt-5 inline-flex w-fit items-center gap-8 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0d2a4a]">
                Explore the pulse <span>-></span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((entity) => {
                if (!entity) return null;
                return (
                  <Link
                    key={entity.slug}
                    href={getEntityHref(entity)}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200">
                      {entity.subtitle}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-snug text-white">
                      {entity.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300">{entity.geography}</p>
                    <div className="mt-5 text-sm font-semibold text-blue-100">Open -></div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 px-7 py-3 text-xs text-slate-300 lg:px-9">
            One platform. Multiple worlds. Connected through genuine relationships and evidence.
          </div>
        </div>
      </div>
    </section>
  );
}
