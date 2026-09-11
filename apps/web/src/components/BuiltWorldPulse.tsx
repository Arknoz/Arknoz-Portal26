import Link from "next/link";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const worldLinks = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
] as const;

const pulseSlugs = [
  "bosco-verticale",
  "urban-biodiversity",
  "research-fellowship",
  "milan",
];

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function BuiltWorldPulse() {
  const items = pulseSlugs
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-white pt-0">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-t-[30px] bg-[#0b2949] text-white">
          <div className="grid gap-6 px-7 py-8 lg:grid-cols-[.64fr_1.36fr] lg:px-9">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                ARKNOZ PULSE
              </p>
              <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight">
                What is moving across the Built World.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                A compact cross-world view of records worth following now.
              </p>

              <Link
                href="/explore"
                className="group mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b2949]"
              >
                Explore the pulse
                <ArrowRight />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((entity) =>
                entity ? (
                  <Link
                    key={`${entity.type}-${entity.slug}`}
                    href={getEntityHref(entity)}
                    className="group rounded-[20px] border border-white/10 bg-white/[0.055] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">
                      {entity.subtitle}
                    </p>
                    <h3 className="mt-2 text-base font-bold">{entity.title}</h3>
                    <p className="mt-1 text-xs text-slate-300">{entity.geography}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                      Open
                      <ArrowRight />
                    </span>
                  </Link>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-y border-white/10 bg-[#0b2949] text-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              EXPLORE BY WORLD
            </span>

            {worldLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/[0.1]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/10 lg:h-10 lg:w-px" />

          <Link
            href="/explore"
            className="group flex shrink-0 items-center justify-between gap-6 rounded-[18px] border border-white/10 bg-white/[0.055] px-4 py-3"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
                WHAT'S NEW
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Latest projects and opportunities
              </p>
            </div>
            <span className="text-white">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
