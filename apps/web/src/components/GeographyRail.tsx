"use client";

import { buildGeographyHref } from "@/lib/geography";

import Link from "next/link";
import { useRef, useState } from "react";
import { geography } from "@/lib/geography";

const continents = geography.filter(
  (item) => item.type === "continent"
);

export default function GeographyRail() {
  const rail = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  function move(direction: number) {
    rail.current?.scrollBy({
      left: direction * 650,
      behavior: "smooth",
    });
  }

  const match = geography.find(
    (item) =>
      item.name.toLowerCase() === query.trim().toLowerCase()
  );

  return (
    <section
      id="world"
      className="scroll-mt-24 bg-slate-50 py-12"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Explore the World
            </h2>
            <p className="mt-2 text-slate-600">
              Global → continent → country → region → city → place.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or place..."
              className="w-full sm:w-[280px] rounded-full border border-slate-300 bg-white px-5 py-3 outline-none focus:border-blue-500"
            />

            {match ? (
              <Link
                href={
                  match.type === "global"
                    ? "/global"
                    : buildGeographyHref(match.slug)
                }
                className="rounded-full bg-[#17315c] px-5 py-3 font-semibold text-white"
              >
                Go
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-full bg-slate-200 px-5 py-3 font-semibold text-slate-500"
              >
                Go
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous regions"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white text-xl"
          >
            ‹
          </button>

          <div
            ref={rail}
            className="flex flex-1 snap-x gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Link
              href="/global"
              className="min-w-[230px] snap-start rounded-2xl bg-[#0d2747] p-6 text-white"
            >
              <p className="text-sm uppercase tracking-wider text-blue-200">
                Global
              </p>
              <h3 className="mt-8 text-2xl font-bold">
                One Built World
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Explore globally
              </p>
            </Link>

            {continents.map((item) => (
              <Link
                key={item.slug}
                href={buildGeographyHref(item.slug)}
                className="min-w-[230px] snap-start rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm uppercase tracking-wider text-slate-500">
                  Continent
                </p>

                <h3 className="mt-8 text-2xl font-bold text-slate-950">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {item.subtitle}
                </p>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next regions"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white text-xl"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
