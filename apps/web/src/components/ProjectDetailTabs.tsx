"use client";

import { useState } from "react";
import Link from "next/link";
import type { EntityRecord } from "@/lib/entities";

type TabKey = "overview" | "connected" | "deep";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="5.5" y="8.5" width="9" height="7" rx="1.7" />
      <path d="M7.5 8.5V6.5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <span className="transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  );
}

export default function ProjectDetailTabs({
  entity,
}: {
  entity: EntityRecord;
}) {
  const [active, setActive] = useState<TabKey>("overview");

  const p = entity.project;
  const anatomy = p?.anatomy ?? [];
  const people = p?.people ?? [];
  const timeline = p?.timeline ?? [];
  const sources = p?.sources ?? [];
  const connections = p?.connections ?? [];
  const learning = p?.learning ?? [];
  const topics = p?.topics ?? [];

  const timelineHighlights =
    timeline.length > 4
      ? [
          timeline[0]!,
          timeline[1]!,
          timeline[timeline.length - 2]!,
          timeline[timeline.length - 1]!,
        ]
      : timeline;

  const tabs: {
    id: TabKey;
    label: string;
    locked?: boolean;
  }[] = [
    {
      id: "overview",
      label: "Project Overview",
    },
    {
      id: "connected",
      label: "Connected World",
    },
    {
      id: "deep",
      label: "Deep Analysis",
      locked: true,
    },
  ];

  const exploreDoors = [
    {
      label: "Knowledge",
      note: "Research, case studies and references",
      href: "/knowledge",
    },
    {
      label: "Education",
      note: "Learning and professional development",
      href: "/learning",
    },
    {
      label: "Materials & Products",
      note: "Materials, systems and equipment",
      href: "/products",
    },
    {
      label: "Projects",
      note: "Other Built World projects",
      href: "/projects",
    },
    {
      label: "Standards",
      note: "Standards and technical references",
      href: "/knowledge/standards-references",
    },
    {
      label: "Places",
      note: "Geography and project context",
      href: p?.placeHref ?? "/global",
    },
  ];

  const analysisModules = [
    {
      title: "Technical Analysis",
      note: "Structure, materials and systems",
    },
    {
      title: "Performance",
      note: "Operation, maintenance and lifecycle",
    },
    {
      title: "Engineering Lessons",
      note: "Transferable project intelligence",
    },
    {
      title: "Comparison",
      note: "Relevant projects and precedents",
    },
    {
      title: "Risks & Opportunities",
      note: "Constraints and future potential",
    },
    {
      title: "Arknoz Review",
      note: "Original professional interpretation",
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* TAB RAIL */}

      <div className="shrink-0 rounded-[18px] bg-[#f2f5f9] p-1.5 ring-1 ring-slate-200/60">
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const selected = active === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(tab.id)}
                className={`group flex items-center justify-center gap-2 rounded-[13px] px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                  selected
                    ? "bg-[#0b2949] text-white shadow-[0_5px_16px_rgba(11,41,73,.18)]"
                    : "text-slate-600 hover:bg-white hover:text-[#0b2949]"
                }`}
              >
                {tab.label}
                {tab.locked ? <LockIcon /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={active}
        className="ark-tab-enter mt-3 min-h-0 flex-1 overflow-hidden"
      >

        {/* ==================================================
            PROJECT OVERVIEW
        ================================================== */}

        {active === "overview" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[.88fr_1.12fr] lg:grid-rows-[1.08fr_.92fr]">

            {/* STORY */}

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    PROJECT STORY
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    Understand the project
                  </h3>
                </div>

                <span className="text-[8px] text-slate-400">
                  Source-grounded
                </span>
              </div>

              <p className="mt-3 text-[11px] leading-[1.65] text-slate-700">
                {p?.understanding ?? entity.summary}
              </p>

              {(p?.visualStatement || p?.strapline) ? (
                <div className="mt-3 rounded-[14px] bg-[#f4f7fa] p-3 ring-1 ring-slate-200/70">
                  <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    WHY IT MATTERS
                  </p>

                  <p className="mt-1.5 text-[11px] font-semibold leading-[1.55] text-slate-950">
                    {p?.visualStatement ?? p?.strapline}
                  </p>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#edf3f8] px-2.5 py-1 text-[8px] font-bold text-[#0b2949]">
                  {p?.category ?? "Project"}
                </span>

                <span className="rounded-full bg-[#edf3f8] px-2.5 py-1 text-[8px] font-bold text-[#0b2949]">
                  {entity.geography}
                </span>

                {entity.trust ? (
                  <span className="rounded-full bg-[#edf3f8] px-2.5 py-1 text-[8px] font-bold text-[#0b2949]">
                    {entity.trust}
                  </span>
                ) : null}
              </div>
            </article>

            {/* SYSTEMS */}

            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-4 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    HOW IT WORKS
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    Project systems & anatomy
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[8px] text-slate-300">
                  {anatomy.length} systems
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {anatomy.slice(0, 6).map((item, index) => (
                  <div
                    key={item.title}
                    className="min-h-0 rounded-[12px] border border-white/10 bg-white/[0.06] p-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-300/15 text-[7px] font-bold text-blue-200">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold leading-3.5">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[8px] leading-[1.35] text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* DEVELOPMENT */}

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    DEVELOPMENT
                  </p>

                  <h3 className="mt-1 text-[14px] font-bold">
                    Project evolution
                  </h3>
                </div>

                <span className="text-[8px] text-slate-400">
                  {timeline.length} milestones
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {timelineHighlights.map((item) => (
                  <div
                    key={`${item.date}-${item.title}`}
                    className="rounded-[12px] bg-white p-2.5 ring-1 ring-slate-200/70"
                  >
                    <p className="text-[12px] font-bold text-blue-700">
                      {item.date}
                    </p>

                    <p className="mt-0.5 text-[8.5px] font-bold leading-3">
                      {item.title}
                    </p>

                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-[7.5px] leading-3 text-slate-500">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>

            {/* TEAM + EVIDENCE */}

            <article className="grid min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)] lg:grid-cols-2 lg:gap-4">

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  PEOPLE & ORGANISATIONS
                </p>

                <h3 className="mt-1 text-[14px] font-bold">
                  Project team
                </h3>

                <div className="mt-2 space-y-1.5">
                  {people.slice(0, 4).map((item) => (
                    <div
                      key={`${item.role}-${item.name}`}
                      className="rounded-[11px] bg-[#f5f7fa] px-2.5 py-2"
                    >
                      <p className="text-[6.5px] font-bold uppercase tracking-[0.13em] text-blue-700">
                        {item.role}
                      </p>

                      <p className="mt-0.5 text-[9px] font-bold">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  EVIDENCE
                </p>

                <h3 className="mt-1 text-[14px] font-bold">
                  Sources behind the record
                </h3>

                <div className="mt-2 space-y-1.5">
                  {sources.slice(0, 3).map((source) => (
                    <a
                      key={`${source.label}-${source.href}`}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-2 rounded-[11px] bg-[#f5f7fa] px-2.5 py-2 transition hover:bg-white hover:ring-1 hover:ring-slate-200"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[8.5px] font-bold">
                          {source.label}
                        </p>

                        {source.organisation ? (
                          <p className="truncate text-[7px] text-slate-500">
                            {source.organisation}
                          </p>
                        ) : null}
                      </div>

                      <span className="shrink-0 text-[9px] text-blue-700">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-2 rounded-[11px] bg-[#0b2949] px-3 py-2 text-white">
                  <p className="text-[7px] uppercase tracking-[0.14em] text-blue-200">
                    RECORD CONFIDENCE
                  </p>

                  <p className="mt-1 text-[9px] font-semibold">
                    {sources.length} evidence sources · verified project record
                  </p>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        {/* ==================================================
            CONNECTED WORLD
        ================================================== */}

        {active === "connected" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-rows-[.86fr_1.14fr]">

            <div className="grid min-h-0 gap-3 lg:grid-cols-[.82fr_1.18fr]">

              <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-4 text-white">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  CONNECTED BUILT WORLD
                </p>

                <h3 className="mt-2 text-[20px] font-bold leading-tight">
                  {entity.title}
                </h3>

                <p className="mt-1 text-[9px] text-slate-300">
                  {entity.geography}
                </p>

                <p className="mt-3 text-[10px] leading-5 text-slate-300">
                  One project can connect to knowledge, education, materials, products, people, organisations, places and other projects.
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[8px]">
                    {p?.category ?? "Project"}
                  </span>

                  {topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[8px]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </article>

              <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                      VERIFIED NETWORK
                    </p>

                    <h3 className="mt-1 text-[15px] font-bold">
                      Recorded relationships
                    </h3>
                  </div>

                  <span className="text-[7.5px] text-slate-400">
                    No inferred links
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {connections.slice(0, 4).map((item) => (
                    <Link
                      key={`${item.type}-${item.title}-${item.href}`}
                      href={item.href}
                      className="group rounded-[12px] bg-[#f5f7fa] p-2.5 ring-1 ring-slate-200/70"
                    >
                      <p className="text-[6.5px] font-bold uppercase tracking-[0.13em] text-blue-700">
                        {item.type}
                      </p>

                      <p className="mt-0.5 text-[9px] font-bold">
                        {item.title}
                      </p>

                      {item.description ? (
                        <p className="mt-1 text-[7.5px] leading-3 text-slate-500">
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  ))}

                  {learning.slice(0, 2).map((item) => (
                    <Link
                      key={`${item.title}-${item.href}`}
                      href={item.href}
                      className="rounded-[12px] bg-[#eef4fa] p-2.5 ring-1 ring-blue-100"
                    >
                      <p className="text-[6.5px] font-bold uppercase tracking-[0.13em] text-blue-700">
                        LEARNING
                      </p>

                      <p className="mt-0.5 text-[9px] font-bold">
                        {item.title}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {topics.slice(0, 5).map((topic) => (
                    <Link
                      key={topic}
                      href={`/search?q=${encodeURIComponent(topic)}`}
                      className="rounded-full bg-[#edf3f8] px-2.5 py-1 text-[7.5px] font-semibold text-slate-700 hover:text-blue-700"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </article>
            </div>

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    EXPLORE ACROSS ARKNOZ
                  </p>

                  <h3 className="mt-1 text-[15px] font-bold">
                    From one project to the wider Built World
                  </h3>
                </div>

                <span className="text-[7.5px] text-slate-400">
                  Discovery pathways
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {exploreDoors.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group rounded-[13px] border border-slate-200 bg-white p-3 transition hover:-translate-y-[1px] hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-bold text-blue-700">
                        0{index + 1}
                      </span>

                      <ArrowIcon />
                    </div>

                    <p className="mt-2 text-[10px] font-bold">
                      {item.label}
                    </p>

                    <p className="mt-1 text-[7.5px] leading-3 text-slate-500">
                      {item.note}
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        ) : null}

        {/* ==================================================
            DEEP ANALYSIS
        ================================================== */}

        {active === "deep" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-rows-[1.18fr_.82fr]">

            <article className="grid min-h-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071b31] via-[#0b2949] to-[#123d68] p-5 text-white lg:grid-cols-[.7fr_1.3fr] lg:gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-blue-200">
                    ARKNOZ PRO
                  </span>

                  <LockIcon />
                </div>

                <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  DEEP ANALYSIS
                </p>

                <h3 className="mt-2 text-[22px] font-bold leading-tight">
                  Go beyond the project record.
                </h3>

                <p className="mt-3 text-[10px] leading-5 text-slate-300">
                  Original Arknoz analysis built from verified project evidence, technical context and connected Built World knowledge.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {analysisModules.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[13px] border border-white/10 bg-white/[0.06] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-bold text-blue-200">
                        0{index + 1}
                      </span>

                      <LockIcon />
                    </div>

                    <p className="mt-2 text-[9px] font-bold">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[7.5px] leading-3 text-slate-300">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid min-h-0 grid-cols-3 gap-3">
              <article className="overflow-hidden rounded-[18px] border border-slate-200 bg-white p-4">
                <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-blue-700">
                  TECHNICAL INPUT
                </p>

                <h4 className="mt-1.5 text-[12px] font-bold">
                  Evidence & documents
                </h4>

                <p className="mt-1.5 text-[8.5px] leading-4 text-slate-500">
                  Approved technical evidence can support deeper project interpretation.
                </p>
              </article>

              <article className="overflow-hidden rounded-[18px] border border-slate-200 bg-white p-4">
                <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-blue-700">
                  CONNECTED CONTEXT
                </p>

                <h4 className="mt-1.5 text-[12px] font-bold">
                  Compare the Built World
                </h4>

                <p className="mt-1.5 text-[8.5px] leading-4 text-slate-500">
                  Projects, materials, systems, places and verified relationships.
                </p>
              </article>

              <article className="overflow-hidden rounded-[18px] border border-slate-200 bg-white p-4">
                <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-blue-700">
                  ARKNOZ OUTPUT
                </p>

                <h4 className="mt-1.5 text-[12px] font-bold">
                  Professional intelligence
                </h4>

                <p className="mt-1.5 text-[8.5px] leading-4 text-slate-500">
                  Arknoz-original analysis remains separate from public factual evidence.
                </p>
              </article>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}