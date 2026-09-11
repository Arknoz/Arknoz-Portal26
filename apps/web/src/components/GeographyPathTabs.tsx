"use client";

import Link from "next/link";
import { KeyboardEvent, useMemo, useState } from "react";

const steps = [
  {
    id: "world",
    number: "01",
    title: "World",
    short: "Global view",
    text: "Start from the whole Built World and discover connected regions and themes.",
    panelTitle: "Start with the whole Built World.",
    panelText:
      "Use the global layer when you want broad discovery before narrowing by geography.",
    changes: ["Global relevance", "Cross-world discovery", "Broad comparison"],
    constant: "Canonical Arknoz identity",
    example: "Explore all nine Arknoz worlds",
    actionLabel: "Explore Arknoz",
    actionHref: "/explore",
  },
  {
    id: "continent",
    number: "02",
    title: "Continent",
    short: "Regional lens",
    text: "Use continental context for broad geographic discovery and comparison.",
    panelTitle: "Add a continental or major regional lens.",
    panelText:
      "Move into Africa, Asia, Europe, the Middle East, North America, Latin America or Oceania.",
    changes: ["Regional relevance", "Comparative context", "Discovery emphasis"],
    constant: "The underlying records stay canonical",
    example: "Asia → India, Singapore, Japan",
    actionLabel: "View continents & regions",
    actionHref: "#continents",
  },
  {
    id: "country",
    number: "03",
    title: "Country",
    short: "Local truth",
    text: "Country pages organise local projects, institutions, knowledge and applicability.",
    panelTitle: "Country context introduces local truth.",
    panelText:
      "Projects and entities remain global records while regulation, terminology, evidence and availability can change by country.",
    changes: ["Regulation", "Terminology", "Availability", "Local evidence"],
    constant: "Canonical project, product, person and organisation identity",
    example: "India → local projects, institutions and knowledge",
    actionLabel: "View countries",
    actionHref: "#countries",
  },
  {
    id: "region-state",
    number: "04",
    title: "Region / State",
    short: "Administrative layer",
    text: "Where useful, Arknoz adds the local administrative layer that matters.",
    panelTitle: "Go below country level only when it adds meaning.",
    panelText:
      "States, provinces, regions and districts can refine relevance without creating duplicate Arknoz records.",
    changes: ["Local administration", "Regional practice", "Sub-national context"],
    constant: "The same underlying entity record",
    example: "India → Maharashtra → Mumbai",
    actionLabel: "Open a country context",
    actionHref: "/global/india",
  },
  {
    id: "city-place",
    number: "05",
    title: "City / Place",
    short: "Most local view",
    text: "Move into cities and places for the most contextual Built World view.",
    panelTitle: "Reach the most local discovery layer.",
    panelText:
      "City and place pages bring nearby projects, people, organisations, universities, knowledge and opportunities together.",
    changes: ["Nearby relevance", "Local connections", "Place-based discovery"],
    constant: "Global Arknoz identity and relationships",
    example: "Mumbai → connected local Built World",
    actionLabel: "Open a city example",
    actionHref: "/global/mumbai",
  },
] as const;

type StepId = (typeof steps)[number]["id"];

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

function StepIcon({ id }: { id: StepId }) {
  if (id === "world") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" />
      </svg>
    );
  }

  if (id === "continent") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="m12 4 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4M4 16l8 4 8-4" />
      </svg>
    );
  }

  if (id === "country") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M6 21V4M7 5h10l-2 4 2 4H7" />
      </svg>
    );
  }

  if (id === "region-state") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="m5 6 5-2 4 2 5-2v14l-5 2-4-2-5 2V6Z" />
        <path d="M10 4v14M14 6v14" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 20V9l5-3v14M9 20V4l6 3v13M15 20V10l5-2v12" />
      <path d="M2 20h20" />
    </svg>
  );
}

export default function GeographyPathTabs() {
  const [activeId, setActiveId] = useState<StepId>("world");

  const activeIndex = useMemo(
    () => Math.max(0, steps.findIndex((step) => step.id === activeId)),
    [activeId]
  );

  const active = steps[activeIndex];
  const nextStep = steps[(activeIndex + 1) % steps.length];

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;

    event.preventDefault();

    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") nextIndex = (activeIndex + 1) % steps.length;
    if (event.key === "ArrowLeft") nextIndex = (activeIndex - 1 + steps.length) % steps.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = steps.length - 1;

    setActiveId(steps[nextIndex].id);

    requestAnimationFrame(() => {
      document.getElementById(`geography-tab-${steps[nextIndex].id}`)?.focus();
    });
  }

  return (
    <section id="geography-path" className="scroll-mt-24 bg-[#f6f8fb] py-14">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-5xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              GLOBAL GEOGRAPHY
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              World → continent → country → region → city.
            </h2>
            <p className="mt-2 max-w-4xl text-slate-600">
              One connected geography system. Move deeper without creating duplicate records.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 md:flex">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Click or use ← → keys
          </div>
        </div>

        <div className="relative mt-9">
          <div className="absolute left-[9%] right-[9%] top-6 hidden h-px bg-slate-300 md:block" />
          <div
            className="absolute left-[9%] top-6 hidden h-px bg-blue-600 transition-[width] duration-500 md:block"
            style={{ width: `${(activeIndex / (steps.length - 1)) * 82}%` }}
          />

          <div
            className="relative grid gap-3 md:grid-cols-5"
            role="tablist"
            aria-label="Arknoz geography levels"
            onKeyDown={handleKeys}
          >
            {steps.map((step, index) => {
              const selected = active.id === step.id;
              const completed = index < activeIndex;

              return (
                <button
                  key={step.id}
                  id={`geography-tab-${step.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`geography-panel-${step.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(step.id)}
                  className={`group relative rounded-[24px] border px-5 pb-5 pt-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                    selected
                      ? "-translate-y-1 border-[#0b2949] bg-[#0b2949] text-white shadow-[0_18px_50px_rgba(11,41,73,.18)]"
                      : "border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition ${
                        selected
                          ? "border-blue-300/30 bg-blue-500/20 text-blue-100"
                          : completed
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      <StepIcon id={step.id} />
                    </span>

                    <span
                      className={`text-[10px] font-bold tracking-[0.18em] ${
                        selected ? "text-blue-200" : "text-blue-700"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <p
                    className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                      selected ? "text-blue-200" : "text-slate-400"
                    }`}
                  >
                    {step.short}
                  </p>

                  <h3 className="mt-1.5 text-xl font-bold">{step.title}</h3>

                  <p
                    className={`mt-2 text-sm leading-5 ${
                      selected ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {step.text}
                  </p>

                  {selected && (
                    <div className="mt-4 h-1 w-10 rounded-full bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`geography-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`geography-tab-${active.id}`}
          className="mt-5 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid lg:grid-cols-[1.15fr_.85fr]">
            <div className="p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <StepIcon id={active.id} />
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    STEP {active.number}
                  </p>
                  <p className="text-xs text-slate-500">{active.short}</p>
                </div>
              </div>

              <h3 className="mt-5 max-w-3xl text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                {active.panelTitle}
              </h3>

              <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                {active.panelText}
              </p>

              <div className="mt-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                  WHAT CHANGES AT THIS LEVEL
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {active.changes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-[#f8fafc] p-7 lg:border-l lg:border-t-0">
              <div className="rounded-[20px] border border-slate-200 bg-white p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-blue-700">
                  WHAT STAYS GLOBAL
                </p>
                <p className="mt-2 font-bold text-slate-950">{active.constant}</p>
              </div>

              <div className="mt-3 rounded-[20px] border border-slate-200 bg-white p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-blue-700">
                  EXAMPLE PATH
                </p>
                <p className="mt-2 font-bold text-slate-950">{active.example}</p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={active.actionHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0f55c8] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b46a8]"
                >
                  {active.actionLabel}
                  <ArrowRight />
                </Link>

                {activeIndex < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveId(nextStep.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    Next: {nextStep.title}
                    <ArrowRight />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              aria-label={`Open ${step.title}`}
              onClick={() => setActiveId(step.id)}
              className={`h-2.5 rounded-full transition-all ${
                step.id === active.id ? "w-7 bg-blue-600" : "w-2.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
