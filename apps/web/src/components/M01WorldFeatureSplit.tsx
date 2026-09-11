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

const imageBySlug: Record<string, string> = {
  "bosco-verticale":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=82",
  "urban-biodiversity":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=82",
  "politecnico-di-milano":
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=82",
  "white-arkitekter":
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=82",
};

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
    <section id="featured" className="scroll-mt-24 bg-white py-7">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-[.92fr_1.08fr] lg:px-10">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
          <div className="relative min-h-[170px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1500&q=82"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08203d]/92 via-[#0b2a49]/70 to-[#0b2a49]/30" />

            <div className="relative p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                GLOBAL DISCOVERY
              </p>
              <div className="mt-1.5 flex items-end justify-between gap-5">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Explore the World
                  </h2>
                  <p className="mt-1 max-w-lg text-sm text-slate-200">
                    One global Arknoz. Local relevance where it matters.
                  </p>
                </div>

                <Link
                  href="/global"
                  className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold"
                >
                  View world
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm transition focus-within:ring-4 focus-within:ring-blue-100">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go()}
                placeholder="Search a country, city or region..."
                className="min-w-0 flex-1 bg-transparent px-4 py-2 outline-none"
              />
              <button
                type="button"
                onClick={go}
                className="rounded-full bg-[#0d2a4a] px-6 py-2 font-semibold text-white transition hover:bg-[#0a223c]"
              >
                Go
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3">
              <Link
                href="/global"
                className="col-span-2 rounded-2xl bg-[#0d2a4a] p-4 text-white transition hover:-translate-y-0.5 md:col-span-1"
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-blue-200">
                  GLOBAL
                </p>
                <h3 className="mt-2 text-lg font-bold">One Built World</h3>
              </Link>

              {geoLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span>{label}</span>
                  <span className="text-blue-700">
                    <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="font-bold text-slate-950">One global format. Local truth.</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Geography changes relevance and context - not canonical truth.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Quick places
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {quickLinks.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                ARKNOZ SELECTS
              </p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950">
                Featured Across the Built World
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Genuine records from different parts of Arknoz.
              </p>
            </div>

            <Link
              href="/explore"
              className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-700"
            >
              View all
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featured.map((entity) =>
              entity ? (
                <Link
                  key={`${entity.type}-${entity.slug}`}
                  href={getEntityHref(entity)}
                  className="group grid min-h-[160px] grid-cols-[.9fr_1.1fr] overflow-hidden rounded-[20px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)]"
                >
                  <div className="overflow-hidden bg-slate-100">
                    <img
                      src={imageBySlug[entity.slug]}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-col p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      {entity.subtitle}
                    </p>
                    <h3 className="mt-1.5 text-base font-bold leading-snug text-slate-950">
                      {entity.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {entity.geography}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-blue-700">
                      Open
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              ) : null
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              More projects
              <ArrowRight />
            </Link>
            <Link
              href="/knowledge"
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              More knowledge
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
