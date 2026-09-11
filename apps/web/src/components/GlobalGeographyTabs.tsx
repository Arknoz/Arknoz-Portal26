"use client";

import Link from "next/link";
import { useState } from "react";

const regions = [
  {
    id: "africa",
    label: "Africa",
    description:
      "Cities, projects, people and knowledge across African contexts.",
    countries: [
      {
        name: "Kenya",
        href: "/global/kenya",
        meta: "East Africa",
      },
    ],
  },
  {
    id: "asia",
    label: "Asia",
    description:
      "Fast-changing urban, infrastructure and building contexts across Asia.",
    countries: [
      {
        name: "India",
        href: "/global/india",
        meta: "South Asia",
      },
      {
        name: "Singapore",
        href: "/global/singapore",
        meta: "Southeast Asia",
      },
      {
        name: "Japan",
        href: "/global/japan",
        meta: "East Asia",
      },
    ],
  },
  {
    id: "europe",
    label: "Europe",
    description:
      "Projects, institutions, standards, research and established practice across Europe.",
    countries: [],
  },
  {
    id: "middle-east",
    label: "Middle East",
    description:
      "Rapid development, major projects, systems and regional practice.",
    countries: [
      {
        name: "United Arab Emirates",
        href: "/global/uae",
        meta: "Gulf",
      },
    ],
  },
  {
    id: "north-america",
    label: "North America",
    description:
      "Projects, technologies, institutions and professional practice.",
    countries: [],
  },
  {
    id: "latin-america",
    label: "Latin America",
    description:
      "Architecture, cities, landscape, infrastructure and local innovation.",
    countries: [],
  },
  {
    id: "oceania",
    label: "Oceania",
    description:
      "Built-environment practice, climate response and regional knowledge.",
    countries: [],
  },
] as const;

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function GlobalGeographyTabs() {
  const [activeId, setActiveId] = useState("asia");

  const active =
    regions.find((region) => region.id === activeId) ?? regions[1];

  return (
    <section id="continents" className="bg-white py-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            CONTINENTS & REGIONS
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Explore the Built World at continental scale.
          </h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Select a region to reveal the country context already available in Arknoz.
          </p>
        </div>

        <div
          className="mt-7 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Continents and regions"
        >
          {regions.map((region) => {
            const selected = region.id === active.id;

            return (
              <button
                key={region.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${region.id}`}
                id={`tab-${region.id}`}
                onClick={() => setActiveId(region.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-[#0b2949] bg-[#0b2949] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {region.label}
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8fafc]"
        >
          <div className="grid lg:grid-cols-[.72fr_1.28fr]">
            <div className="bg-[#0b2949] p-7 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                REGION
              </p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight">
                {active.label}
              </h3>
              <p className="mt-3 max-w-xl leading-7 text-slate-300">
                {active.description}
              </p>
            </div>

            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                AVAILABLE COUNTRY CONTEXT
              </p>

              {active.countries.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {active.countries.map((country) => (
                    <Link
                      key={country.href}
                      href={country.href}
                      className="group flex items-center justify-between gap-4 rounded-[18px] border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div>
                        <p className="font-bold text-slate-950">{country.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{country.meta}</p>
                      </div>

                      <span className="shrink-0 text-blue-700">
                        <ArrowRight />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[18px] border border-dashed border-slate-300 bg-white p-5">
                  <p className="text-sm leading-6 text-slate-600">
                    No country pages are published for this region yet. Arknoz will add them as genuine geographic records become available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
