"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const featuredSlugs = [
  "bosco-verticale",
  "urban-biodiversity",
  "politecnico-di-milano",
  "white-arkitekter",
];

const geoLinks = [
  ["Africa", "/global/africa"],
  ["Asia", "/global/asia"],
  ["Europe", "/global/europe"],
  ["North America", "/global/north-america"],
  ["South America", "/global/south-america"],
  ["Oceania", "/global/oceania"],
] as const;

const quickLinks = [
  ["India", "/global/india"],
  ["Kenya", "/global/kenya"],
  ["Singapore", "/global/singapore"],
  ["UAE", "/global/uae"],
  ["Japan", "/global/japan"],
  ["Mumbai", "/global/mumbai"],
  ["Nairobi", "/global/nairobi"],
] as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function M01WorldFeatureSplit() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const featured = featuredSlugs
    .map((slug) => entities.find((entity) => entity.slug === slug))
    .filter(Boolean);

  function go() {
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <section id="featured" className="scroll-mt-24 bg-white py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(15,85,200,0.06) 0, rgba(15,85,200,0.06) 1px, transparent 1px), linear-gradient(135deg, rgba(255,255,255,0.88), rgba(248,250,252,0.95))",
            backgroundSize: "18px 18px, auto",
          }}
        >
          <div className="relative">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  GLOBAL DISCOVERY
                </p>
                <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950">
                  Explore the World
                </h2>
                <p className="mt-2 text-slate-600">
                  One global Arknoz. Local relevance where it matters.
                </p>
              </div>

              <Link href="/global" className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700">
                View world
                <ArrowRight />
              </Link>
            </div>

            <div className="mt-5 flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm transition focus-within:ring-4 focus-within:ring-blue-100">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go()}
                placeholder="Search a country, city or region..."
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 outline-none"
              />

              <button
                type="button"
                onClick={go}
                className="rounded-full bg-[#0d2a4a] px-6 py-2.5 font-semibold text-white transition hover:bg-[#0a223c]"
              >
                Go
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
              <Link href="/global" className="col-span-2 rounded-2xl bg-[#0d2a4a] p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg md:col-span-1">
                <p className="text-xs uppercase tracking-[0.16em] text-blue-200">
                  GLOBAL
                </p>
                <h3 className="mt-3 text-xl font-bold">One Built World</h3>
              </Link>

              {geoLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                >
                  <span>{label}</span>
                  <span className="text-blue-700">
                    <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/90 p-4">
              <p className="font-bold text-slate-950">One global format. Local truth.</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                Geography changes relevance and context - not canonical truth.
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Quick places
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickLinks.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                ARKNOZ SELECTS
              </p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950">
                Featured Across the Built World
              </h2>
              <p className="mt-2 text-slate-600">
                Genuine records from different parts of Arknoz.
              </p>
            </div>

            <Link href="/explore" className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700">
              View all
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {featured.map((entity) =>
              entity ? (
                <Link
                  key={`${entity.type}-${entity.slug}`}
                  href={getEntityHref(entity)}
                  className="group rounded-2xl border border-slate-200 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    {entity.subtitle}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-950">
                    {entity.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {entity.geography}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blue-700">
                    Open
                    <ArrowRight />
                  </span>
                </Link>
              ) : null
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/projects" className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50">
              More projects
              <ArrowRight />
            </Link>
            <Link href="/knowledge" className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50">
              More knowledge
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
