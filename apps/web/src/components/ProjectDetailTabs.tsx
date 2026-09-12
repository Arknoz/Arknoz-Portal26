"use client";

import { useState } from "react";
import Link from "next/link";
import {
  entities,
  type EntityRecord,
} from "@/lib/entities";

type TabKey =
  | "overview"
  | "project"
  | "connected"
  | "deep";

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

function VisualPanel({
  entity,
  title,
  description,
  compact = false,
}: {
  entity: EntityRecord;
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const media = entity.project?.media ?? [];

  return (
    <div className="group relative h-full min-h-0 overflow-hidden rounded-[20px] bg-[#0b2949] shadow-[0_8px_28px_rgba(15,23,42,.08)]">
      {media[0] ? (
        <img
          src={media[0].src}
          alt={media[0].alt ?? entity.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-[#071b31]/95 via-[#071b31]/18 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
          PROJECT FEATURE
        </p>

        <p className={`mt-1 font-bold ${compact ? "text-[13px]" : "text-lg"}`}>
          {title ?? entity.title}
        </p>

        {description ? (
          <p
            className={`mt-1 text-slate-200 ${
              compact
                ? "line-clamp-2 text-[9px] leading-4"
                : "line-clamp-2 text-[10px] leading-4"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function ProjectDetailTabs({
  entity,
}: {
  entity: EntityRecord;
}) {
  const [active, setActive] =
    useState<TabKey>("overview");

  const [overviewFocus, setOverviewFocus] =
    useState(0);

  const [projectFocus, setProjectFocus] =
    useState(0);

  const [hoveredRelation, setHoveredRelation] =
    useState<string | null>(null);

  const p = entity.project;

  const facts = p?.facts ?? [];
  const anatomy = p?.anatomy ?? [];
  const people = p?.people ?? [];
  const timeline = p?.timeline ?? [];
  const sources = p?.sources ?? [];
  const connections = p?.connections ?? [];
  const learning = p?.learning ?? [];

  const overviewItem =
    anatomy[overviewFocus] ?? anatomy[0];

  const projectItem =
    anatomy[projectFocus] ?? anatomy[0];

  const moreProjects = entities
    .filter(
      (item) =>
        item.type === "project" &&
        item.slug !== entity.slug
    )
    .slice(0, 3);

  const tabs: {
    id: TabKey;
    label: string;
    locked?: boolean;
  }[] = [
    { id: "overview", label: "Overview" },
    { id: "project", label: "Project" },
    { id: "connected", label: "Connected" },
    { id: "deep", label: "Deep", locked: true },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* ==================================================
          TAB RAIL
      ================================================== */}

      <div className="shrink-0 rounded-[18px] bg-[#f2f5f9] p-1.5 ring-1 ring-slate-200/60">
        <div className="grid grid-cols-4 gap-1">
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
                    : "text-slate-600 hover:-translate-y-[1px] hover:bg-white hover:text-[#0b2949] hover:shadow-sm"
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
        className="ark-tab-enter mt-4 min-h-0 flex-1 overflow-hidden"
      >

        {/* ==================================================
            OVERVIEW
        ================================================== */}

        {active === "overview" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1fr_.72fr_.62fr]">

            <article className="flex min-h-0 flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    ABOUT THIS PROJECT
                  </p>

                  <span className="text-[9px] text-slate-400">
                    Project overview
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-slate-700">
                  {p?.understanding ?? entity.summary}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  EXPLORE PROJECT SYSTEMS
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {anatomy.slice(0, 4).map((item, index) => {
                    const selected =
                      overviewFocus === index;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onMouseEnter={() =>
                          setOverviewFocus(index)
                        }
                        onFocus={() =>
                          setOverviewFocus(index)
                        }
                        onClick={() =>
                          setOverviewFocus(index)
                        }
                        className={`rounded-[12px] px-3 py-2.5 text-left transition-all duration-200 ${
                          selected
                            ? "bg-[#0b2949] text-white shadow-sm"
                            : "bg-[#f5f7fa] text-slate-900 hover:-translate-y-[1px] hover:bg-[#eef3f8]"
                        }`}
                      >
                        <p className="text-[10px] font-bold leading-4">
                          {item.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="min-h-0 rounded-[22px] bg-[#f5f7fa] p-5 ring-1 ring-slate-200/60">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  KEY FACTS
                </p>

                <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-400">
                  Verified data
                </span>
              </div>

              <div className="mt-2 divide-y divide-slate-200">
                {facts.slice(0, 8).map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-[86px_1fr] gap-3 py-[7px] text-[12px] transition hover:pl-1"
                  >
                    <span className="text-slate-500">
                      {fact.label}
                    </span>

                    <strong className="text-slate-950">
                      {fact.value}
                    </strong>
                  </div>
                ))}
              </div>
            </article>

            <div className="grid min-h-0 grid-rows-[1.13fr_.87fr] gap-3">
              <VisualPanel
                entity={entity}
                title={
                  overviewItem?.title ??
                  p?.visualStatement ??
                  entity.title
                }
                description={
                  overviewItem?.description
                }
              />

              <article className="grid grid-cols-2 gap-3 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,.03)]">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    LOCATION
                  </p>

                  <h3 className="mt-2 text-[15px] font-bold">
                    {entity.geography}
                  </h3>

                  <Link
                    href={p?.placeHref ?? "/global"}
                    className="group mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700"
                  >
                    View place
                    <ArrowIcon />
                  </Link>
                </div>

                <div className="border-l border-slate-200 pl-4">
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    SOURCES
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {sources.length}
                  </p>

                  <p className="text-[10px] text-slate-500">
                    identified sources
                  </p>
                </div>
              </article>
            </div>
          </div>
        ) : null}

        {/* ==================================================
            PROJECT
        ================================================== */}

        {active === "project" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[1fr_.82fr]">

            {/* ANATOMY */}
            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-4 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    PROJECT ANATOMY
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    How the project works
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] text-slate-300">
                  {anatomy.length} systems
                </span>
              </div>

              <div className="mt-3 grid h-[calc(100%-45px)] min-h-0 grid-cols-2 grid-rows-2 gap-2.5">
                {anatomy.slice(0, 4).map((item, index) => {
                  const selected =
                    projectFocus === index;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onMouseEnter={() =>
                        setProjectFocus(index)
                      }
                      onFocus={() =>
                        setProjectFocus(index)
                      }
                      onClick={() =>
                        setProjectFocus(index)
                      }
                      className={`min-h-0 overflow-hidden rounded-[14px] border p-3.5 text-left transition-all duration-200 ${
                        selected
                          ? "border-blue-300/35 bg-white/[0.13] shadow-[0_8px_22px_rgba(0,0,0,.10)]"
                          : "border-white/10 bg-white/[0.06] hover:-translate-y-[1px] hover:bg-white/[0.10]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                            selected
                              ? "bg-blue-300/25 text-white"
                              : "bg-blue-400/15 text-blue-200"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          <h4 className="text-[12px] font-bold leading-4 text-white">
                            {item.title}
                          </h4>

                          <p className="mt-1.5 text-[10px] leading-[1.45] text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>

            {/* PEOPLE */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    PEOPLE & ORGANISATIONS
                  </p>

                  <h3 className="mt-1 text-[15px] font-bold">
                    Project team
                  </h3>
                </div>

                <span className="text-[9px] text-slate-400">
                  Genuine roles
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {people.slice(0, 6).map((item) => (
                  <div
                    key={`${item.role}-${item.name}`}
                    className="group rounded-[13px] bg-[#f5f7fa] p-3 transition-all duration-200 hover:-translate-y-[2px] hover:bg-white hover:shadow-[0_5px_16px_rgba(15,23,42,.07)] hover:ring-1 hover:ring-slate-200"
                  >
                    <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-blue-700">
                      {item.role}
                    </p>

                    <p className="mt-1 text-[11px] font-bold text-slate-950">
                      {item.name}
                    </p>

                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-blue-700"
                      >
                        Open
                        <ArrowIcon />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>

            {/* DEVELOPMENT */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                DEVELOPMENT
              </p>

              <div className="relative mt-5">
                <div className="absolute left-2 right-2 top-[7px] h-px bg-slate-300" />

                <div className="relative grid grid-cols-4 gap-3">
                  {timeline.slice(0, 4).map((item) => (
                    <div
                      key={`${item.date}-${item.title}`}
                      className="group cursor-default"
                      title={item.description}
                    >
                      <div className="h-3.5 w-3.5 rounded-full border-[3px] border-white bg-blue-700 shadow-sm transition-transform duration-200 group-hover:scale-150" />

                      <p className="mt-3 text-[17px] font-bold text-blue-700 transition group-hover:translate-x-1">
                        {item.date}
                      </p>

                      <p className="mt-1 text-[10px] font-bold leading-4">
                        {item.title}
                      </p>

                      {item.description ? (
                        <p className="mt-1 line-clamp-2 max-h-0 overflow-hidden text-[9px] leading-4 text-slate-500 opacity-0 transition-all duration-200 group-hover:max-h-10 group-hover:opacity-100">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* EVIDENCE + DYNAMIC VISUAL */}
            <article className="grid min-h-0 grid-cols-[1.35fr_.65fr] gap-3 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  EVIDENCE
                </p>

                <div className="mt-3 space-y-2">
                  {sources.slice(0, 3).map((source) => (
                    <a
                      key={source.label}
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-[12px] bg-[#f5f7fa] px-3 py-2.5 transition-all duration-200 hover:-translate-y-[1px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold text-slate-900">
                          {source.label}
                        </p>

                        <p className="text-[9px] text-slate-500">
                          {source.organisation}
                        </p>
                      </div>

                      <span className="shrink-0 text-blue-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <VisualPanel
                entity={entity}
                compact
                title={projectItem?.title}
                description={projectItem?.description}
              />
            </article>
          </div>
        ) : null}

        {/* ==================================================
            CONNECTED
        ================================================== */}

        {active === "connected" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[.86fr_1.14fr]">

            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-5 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                CONNECTED BUILT WORLD
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Genuine relationships
              </h3>

              <div className="relative mt-5 grid grid-cols-[.8fr_1.15fr_.9fr] items-center gap-3">
                <div className="absolute left-[17%] right-[17%] top-1/2 h-px bg-white/10" />

                <div className="relative z-10">
                  {connections
                    .filter((item) => item.type === "PLACE")
                    .slice(0, 1)
                    .map((item) => {
                      const activeNode =
                        hoveredRelation === item.title;

                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          onMouseEnter={() =>
                            setHoveredRelation(item.title)
                          }
                          onMouseLeave={() =>
                            setHoveredRelation(null)
                          }
                          className={`block rounded-[14px] border p-3 transition-all duration-200 ${
                            activeNode
                              ? "scale-[1.03] border-blue-300/40 bg-blue-300/15 shadow-lg"
                              : "border-white/10 bg-white/[0.07] hover:bg-white/[0.11]"
                          }`}
                        >
                          <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                            PLACE
                          </p>

                          <p className="mt-1 text-[12px] font-bold">
                            {item.title}
                          </p>
                        </Link>
                      );
                    })}
                </div>

                <div
                  className={`relative z-10 rounded-[18px] bg-white p-4 text-center text-slate-950 shadow-lg transition-transform duration-200 ${
                    hoveredRelation
                      ? "scale-[1.03]"
                      : ""
                  }`}
                >
                  <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    PROJECT
                  </p>

                  <p className="mt-2 text-[16px] font-bold">
                    {entity.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {entity.geography}
                  </p>
                </div>

                <div className="relative z-10 space-y-2">
                  {connections
                    .filter((item) => item.type !== "PLACE")
                    .slice(0, 2)
                    .map((item) => {
                      const activeNode =
                        hoveredRelation === item.title;

                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          onMouseEnter={() =>
                            setHoveredRelation(item.title)
                          }
                          onMouseLeave={() =>
                            setHoveredRelation(null)
                          }
                          className={`block rounded-[14px] border p-3 transition-all duration-200 ${
                            activeNode
                              ? "translate-x-1 border-blue-300/40 bg-blue-300/15"
                              : "border-white/10 bg-white/[0.07] hover:bg-white/[0.11]"
                          }`}
                        >
                          <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                            {item.type}
                          </p>

                          <p className="mt-1 text-[11px] font-bold">
                            {item.title}
                          </p>
                        </Link>
                      );
                    })}

                  {learning.slice(0, 1).map((item) => {
                    const activeNode =
                      hoveredRelation === item.title;

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onMouseEnter={() =>
                          setHoveredRelation(item.title)
                        }
                        onMouseLeave={() =>
                          setHoveredRelation(null)
                        }
                        className={`block rounded-[14px] border p-3 transition-all duration-200 ${
                          activeNode
                            ? "translate-x-1 border-blue-300/40 bg-blue-300/20"
                            : "border-blue-300/20 bg-blue-300/10"
                        }`}
                      >
                        <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                          KNOWLEDGE
                        </p>

                        <p className="mt-1 text-[11px] font-bold">
                          {item.title}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                {[
                  ["THEME", "Vertical Forest"],
                  ["TOPIC", "Urban Biodiversity"],
                  ["TYPE", "Residential"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[12px] bg-white/[0.06] p-3 transition hover:-translate-y-[1px] hover:bg-white/[0.10]"
                  >
                    <p className="text-[7px] font-bold uppercase text-blue-200">
                      {label}
                    </p>

                    <p className="mt-1 text-[10px] font-bold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    WANT TO SEE MORE?
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Explore more projects
                  </h3>
                </div>

                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-1 text-[10px] font-bold text-blue-700"
                >
                  All projects
                  <ArrowIcon />
                </Link>
              </div>

              <div className="mt-3 grid h-[calc(100%-48px)] grid-cols-3 gap-3">
                {moreProjects.map((item, index) => (
                  <Link
                    key={item.slug}
                    href={`/projects/${item.slug}`}
                    className="group flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-[#f8fafc] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(15,23,42,.10)]"
                  >
                    <div
                      className={`flex min-h-0 flex-1 flex-col justify-between p-4 ${
                        index === 0
                          ? "bg-[#0b2949] text-white"
                          : index === 1
                          ? "bg-[#e8eef5]"
                          : "bg-[#dbeafe]"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-[7px] font-bold uppercase tracking-[0.14em] ${
                            index === 0
                              ? "text-blue-200"
                              : "text-blue-700"
                          }`}
                        >
                          {item.project?.category ?? "PROJECT"}
                        </p>

                        <p className="mt-2 text-[13px] font-bold leading-5">
                          {item.title}
                        </p>
                      </div>

                      <div className="mt-4 flex h-12 items-end gap-1 opacity-35 transition-transform duration-300 group-hover:scale-110">
                        <div className="h-5 w-4 bg-current" />
                        <div className="h-9 w-5 bg-current" />
                        <div className="h-7 w-4 bg-current" />
                        <div className="h-11 w-5 bg-current" />
                      </div>
                    </div>

                    <div className="shrink-0 bg-white p-3">
                      <p className="text-[10px] text-slate-500">
                        {item.geography}
                      </p>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[9px] font-semibold text-slate-500">
                          {item.trust ?? "Project"}
                        </span>

                        <span className="text-blue-700 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        ) : null}

        {/* ==================================================
            DEEP — LOCKED PREVIEW
        ================================================== */}

        {active === "deep" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.08fr_.92fr]">

            <article className="relative overflow-hidden rounded-[22px] bg-[#071b31] p-6 text-white shadow-[0_10px_30px_rgba(7,27,49,.14)]">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-200">
                    <LockIcon />

                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]">
                      ARKNOZ PRO · DEEP
                    </p>
                  </div>

                  <h3 className="mt-4 text-3xl font-bold">
                    Arknoz Data Intelligence, Analysis & Review.
                  </h3>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-300">
                    Original Arknoz work developed through structured data, contextual analysis, review and connected Built World knowledge.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Data Intelligence",
                    "Project Analysis",
                    "Arknoz Review",
                    "Advanced Connections",
                    "Project Comparison",
                    "Professional Insights",
                  ].map((item) => (
                    <div
                      key={item}
                      title="Planned for Arknoz Pro"
                      aria-disabled="true"
                      className="cursor-not-allowed rounded-[13px] border border-white/10 bg-white/[0.06] px-3 py-3 opacity-80 transition hover:bg-white/[0.09]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold">
                          {item}
                        </p>

                        <LockIcon />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="flex min-h-0 flex-col gap-3">
              <div className="flex-1 rounded-[22px] border border-slate-200 bg-[#f6f8fb] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  ARKNOZ PRO PREVIEW
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Preview of planned Arknoz Pro intelligence.
                </h3>

                <div className="mt-4 space-y-2">
                  {[
                    "Structured data intelligence",
                    "Arknoz project analysis",
                    "Contextual review and interpretation",
                    "Connected Built World comparisons and insights",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-[13px] bg-white px-3 py-2.5 ring-1 ring-slate-200 transition hover:ring-slate-300"
                    >
                      <span className="text-[9px] font-bold text-blue-700">
                        0{index + 1}
                      </span>

                      <span className="text-[11px] font-semibold">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    ARKNOZ PRO
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Public project information stays free. Arknoz Deep is planned for Arknoz Pro.
                  </p>
                </div>

                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#0b2949] px-4 py-2 text-[11px] font-bold text-white">
                  <LockIcon />
                  Locked
                </span>
              </div>
            </article>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes arkTabIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ark-tab-enter {
          animation: arkTabIn 220ms ease-out both;
        }
      `}</style>
    </div>
  );
}

