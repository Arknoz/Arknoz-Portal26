"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { entities } from "@/lib/entities";
import { getEntityHref } from "@/components/EntityCard";

const popular = [
  "sustainable buildings",
  "mass timber",
  "BIM",
  "climate resilient cities",
  "universities",
  "jobs",
  "India",
  "green infrastructure",
];

const imageBySlug: Record<string, string> = {
  "bosco-verticale":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
  "urban-biodiversity":
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=80",
  "politecnico-di-milano":
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=80",
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function GlobalHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const featured = useMemo(
    () =>
      ["bosco-verticale", "urban-biodiversity", "politecnico-di-milano"]
        .map((slug) => entities.find((entity) => entity.slug === slug))
        .filter(Boolean),
    []
  );

  function runSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function searchFor(value: string) {
    setQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  const heroWords = ["PEOPLE", "PLACES", "IDEAS", "SOLUTIONS"];

  return (
    <section id="search" className="relative overflow-hidden bg-[#08203d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=2200&q=82)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#081c34]/95 via-[#0b2d50]/84 to-[#0b2a48]/76" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06182d]/85 via-transparent to-transparent" />

      <div className="relative mx-auto grid min-h-[600px] max-w-[1600px] items-center gap-12 px-6 py-14 lg:grid-cols-[1.38fr_.92fr] lg:px-10">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.24em] text-blue-100">
            {heroWords.map((word, index) => (
              <span key={word} className="flex items-center gap-2">
                <span>{word}</span>
                {index < heroWords.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-blue-100/80" />
                )}
              </span>
            ))}
          </div>

          <h1 className="mt-5 max-w-[790px] text-5xl font-bold leading-[0.96] tracking-[-0.045em] md:text-7xl xl:text-[78px]">
            One Built World.
            <br />
            Connected.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-7 text-slate-100 md:text-xl">
            Discover projects, products, knowledge, learning, opportunities,
            people, organisations, universities and places across the Built World.
          </p>

          <form
            onSubmit={runSearch}
            className="mt-8 flex max-w-4xl items-center rounded-full bg-white p-1.5 shadow-2xl transition focus-within:ring-4 focus-within:ring-blue-300/25"
          >
            <span className="pl-5 text-slate-500">
              <SearchIcon />
            </span>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Built World..."
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base text-slate-900 outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-[#0f55c8] px-8 py-3.5 font-semibold text-white transition duration-200 hover:bg-[#0b46a8]"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex max-w-5xl flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 text-slate-200">Popular:</span>
            {popular.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => searchFor(item)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-slate-50 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/15"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="self-center">
          <div className="mb-4 flex items-end justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                CURATED ACROSS ARKNOZ
              </p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.13em] text-white">
                ARKNOZ FEATURED NOW
              </p>
            </div>

            <a
              href="#featured"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              View all
              <ArrowRight />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {featured.map((entity) => {
              if (!entity) return null;

              return (
                <Link
                  key={`${entity.type}-${entity.slug}`}
                  href={getEntityHref(entity)}
                  className="group overflow-hidden rounded-2xl border border-white/20 bg-white text-slate-950 shadow-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)]"
                >
                  <div className="aspect-[1.35/1] overflow-hidden bg-slate-100">
                    <img
                      src={imageBySlug[entity.slug]}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {entity.subtitle}
                    </p>
                    <h2 className="mt-1.5 text-lg font-bold leading-tight">
                      {entity.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-500">
                      {entity.geography}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-5 text-right text-[11px] uppercase tracking-[0.2em] text-slate-300">
            A MORE CONNECTED AND SUSTAINABLE BUILT ENVIRONMENT FOR A BETTER TOMORROW.
          </p>
        </div>
      </div>
    </section>
  );
}
