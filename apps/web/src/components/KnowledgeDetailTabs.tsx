"use client";

import { useState } from "react";
import Link from "next/link";

import {
  entities,
  type EntityRecord,
} from "@/lib/entities";

import type {
  KnowledgeDetailData,
} from "@/lib/knowledge-details";

type TabKey =
  | "overview"
  | "knowledge"
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
      <rect
        x="5.5"
        y="8.5"
        width="9"
        height="7"
        rx="1.7"
      />
      <path d="M7.5 8.5V6.5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

function Arrow() {
  return (
    <span className="transition-transform duration-200 group-hover:translate-x-1">
      →
    </span>
  );
}

function KnowledgeSignal({
  detail,
  focus = 0,
}: {
  detail?: KnowledgeDetailData;
  focus?: number;
}) {
  const themes = detail?.themes ?? [];
  const theme = themes[focus] ?? themes[0];

  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0b2949] via-[#123c66] to-[#071b31] p-5 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.45) 1px,transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
            KNOWLEDGE SIGNAL
          </p>

          <p className="mt-2 text-[18px] font-bold">
            {theme?.title ??
              detail?.recordType ??
              "Built World knowledge"}
          </p>

          {theme?.description ? (
            <p className="mt-2 line-clamp-3 text-[10px] leading-5 text-slate-300">
              {theme.description}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex h-20 items-end gap-2 opacity-45">
            <div className="h-7 w-8 rounded-t bg-white" />
            <div className="h-12 w-8 rounded-t bg-white" />
            <div className="h-9 w-8 rounded-t bg-white" />
            <div className="h-16 w-8 rounded-t bg-white" />
            <div className="h-11 w-8 rounded-t bg-white" />
          </div>

          <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-blue-200">
            {detail?.geography ?? "Knowledge"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeDetailTabs({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: KnowledgeDetailData;
}) {
  const [active, setActive] =
    useState<TabKey>("overview");

  const [themeFocus, setThemeFocus] =
    useState(0);

  const facts = detail?.facts ?? [];
  const themes = detail?.themes ?? [];
  const topics = detail?.topics ?? [];
  const sources = detail?.sources ?? [];

  const moreKnowledge = entities
    .filter(
      (item) =>
        item.type === "knowledge" &&
        item.slug !== entity.slug
    )
    .slice(0, 3);

  const tabs: {
    id: TabKey;
    label: string;
    locked?: boolean;
  }[] = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "knowledge",
      label: "Knowledge",
    },
    {
      id: "connected",
      label: "Connected",
    },
    {
      id: "deep",
      label: "Deep",
      locked: true,
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* TAB RAIL */}

      <div className="shrink-0 rounded-[18px] bg-[#f2f5f9] p-1.5 ring-1 ring-slate-200/60">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const selected =
              active === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  setActive(tab.id)
                }
                className={`flex items-center justify-center gap-2 rounded-[13px] px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                  selected
                    ? "bg-[#0b2949] text-white shadow-[0_5px_16px_rgba(11,41,73,.18)]"
                    : "text-slate-600 hover:-translate-y-[1px] hover:bg-white hover:text-[#0b2949] hover:shadow-sm"
                }`}
              >
                {tab.label}

                {tab.locked ? (
                  <LockIcon />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={active}
        className="ark-knowledge-tab mt-4 min-h-0 flex-1 overflow-hidden"
      >

        {/* ================================================
            OVERVIEW
        ================================================= */}

        {active === "overview" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1fr_.72fr_.62fr]">

            <article className="flex min-h-0 flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    ABOUT THIS RECORD
                  </p>

                  <span className="text-[9px] text-slate-400">
                    Public knowledge
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-slate-700">
                  {detail?.abstract ??
                    entity.summary}
                </p>
              </div>

              {themes.length > 0 ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    EXPLORE KEY THEMES
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {themes
                      .slice(0, 4)
                      .map(
                        (
                          theme,
                          index
                        ) => {
                          const selected =
                            themeFocus ===
                            index;

                          return (
                            <button
                              key={
                                theme.title
                              }
                              type="button"
                              onMouseEnter={() =>
                                setThemeFocus(
                                  index
                                )
                              }
                              onFocus={() =>
                                setThemeFocus(
                                  index
                                )
                              }
                              onClick={() =>
                                setThemeFocus(
                                  index
                                )
                              }
                              className={`rounded-[12px] px-3 py-2.5 text-left transition-all duration-200 ${
                                selected
                                  ? "bg-[#0b2949] text-white shadow-sm"
                                  : "bg-[#f5f7fa] text-slate-900 hover:-translate-y-[1px] hover:bg-[#eef3f8]"
                              }`}
                            >
                              <p className="text-[10px] font-bold leading-4">
                                {
                                  theme.title
                                }
                              </p>
                            </button>
                          );
                        }
                      )}
                  </div>
                </div>
              ) : null}
            </article>

            <article className="min-h-0 rounded-[22px] bg-[#f5f7fa] p-5 ring-1 ring-slate-200/60">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  PUBLICATION DETAILS
                </p>

                <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-400">
                  Source-backed
                </span>
              </div>

              <div className="mt-2 divide-y divide-slate-200">
                {facts
                  .slice(0, 8)
                  .map((fact) => (
                    <div
                      key={fact.label}
                      className="grid grid-cols-[92px_1fr] gap-3 py-[7px] text-[12px] transition hover:pl-1"
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

            <div className="grid min-h-0 grid-rows-[1.15fr_.85fr] gap-3">

              <KnowledgeSignal
                detail={detail}
                focus={themeFocus}
              />

              <article className="grid grid-cols-2 gap-3 rounded-[22px] border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    PUBLISHER
                  </p>

                  <h3 className="mt-2 text-[14px] font-bold">
                    {detail?.publisher ??
                      "Not established"}
                  </h3>

                  <p className="mt-2 text-[9px] leading-4 text-slate-500">
                    {detail?.access}
                  </p>
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

        {/* ================================================
            KNOWLEDGE
        ================================================= */}

        {active === "knowledge" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[1.16fr_.74fr]">

            {/* THEMES */}
            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-4 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    KEY THEMES
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    Understand the knowledge
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] text-slate-300">
                  {themes.length} themes
                </span>
              </div>

              <div className="mt-3 grid h-[calc(100%-45px)] min-h-0 grid-cols-2 grid-rows-2 gap-2.5">
                {themes
                  .slice(0, 4)
                  .map(
                    (
                      theme,
                      index
                    ) => {
                      const selected =
                        themeFocus ===
                        index;

                      return (
                        <button
                          key={
                            theme.title
                          }
                          type="button"
                          onMouseEnter={() =>
                            setThemeFocus(
                              index
                            )
                          }
                          onFocus={() =>
                            setThemeFocus(
                              index
                            )
                          }
                          onClick={() =>
                            setThemeFocus(
                              index
                            )
                          }
                          className={`min-h-0 overflow-hidden rounded-[14px] border p-3.5 text-left transition-all duration-200 ${
                            selected
                              ? "border-blue-300/35 bg-white/[0.13] shadow-[0_8px_22px_rgba(0,0,0,.10)]"
                              : "border-white/10 bg-white/[0.06] hover:-translate-y-[1px] hover:bg-white/[0.10]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-300/15 text-[9px] font-bold text-blue-100">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <div className="min-w-0">
                              <h4 className="text-[12px] font-bold leading-4">
                                {
                                  theme.title
                                }
                              </h4>

                              <p className="mt-1.5 text-[10px] leading-[1.45] text-slate-300">
                                {
                                  theme.description
                                }
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
              </div>
            </article>

            {/* CLASSIFICATION */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  KNOWLEDGE CLASSIFICATION
                </p>

                <h3 className="mt-1 text-[15px] font-bold">
                  Built World context
                </h3>
              </div>

              <div className="mt-4 space-y-2">
                <div className="rounded-[13px] bg-[#0b2949] p-3 text-white">
                  <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                    BUILT WORLD KNOWLEDGE
                  </p>

                  <p className="mt-1 text-[11px] font-bold">
                    {detail?.section ??
                      "Knowledge"}
                  </p>
                </div>

                {topics
                  .slice(0, 4)
                  .map(
                    (
                      topic,
                      index
                    ) => (
                      <div
                        key={topic}
                        className="ml-[calc(var(--level)*10px)] rounded-[12px] bg-[#f5f7fa] px-3 py-2.5 transition hover:translate-x-1"
                        style={
                          {
                            "--level":
                              Math.min(
                                index,
                                2
                              ),
                          } as React.CSSProperties
                        }
                      >
                        <p className="text-[10px] font-semibold text-slate-700">
                          ↳ {topic}
                        </p>
                      </div>
                    )
                  )}
              </div>
            </article>

            {/* WHY IT MATTERS */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                ARKNOZ CONTEXT
              </p>

              <h3 className="mt-2 text-[16px] font-bold">
                Why this record matters
              </h3>

              <p className="mt-3 max-w-2xl text-[11px] leading-5 text-slate-600">
                This record connects urban climate risk, resilience, planning and the wider Built World. Arknoz keeps the public record concise while preserving the originating source and rights context.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {topics
                  .slice(0, 4)
                  .map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-slate-700 ring-1 ring-slate-200"
                    >
                      {topic}
                    </span>
                  ))}
              </div>
            </article>

            {/* SOURCE + RIGHTS */}
            <article className="grid min-h-0 grid-cols-[1.2fr_.8fr] gap-3 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  SOURCE & PROVENANCE
                </p>

                <div className="mt-3 space-y-2">
                  {sources
                    .slice(0, 3)
                    .map((source) => (
                      <div
                        key={source.label}
                        className="rounded-[12px] bg-[#f5f7fa] px-3 py-2.5 transition hover:-translate-y-[1px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                      >
                        <p className="text-[10px] font-bold">
                          {source.label}
                        </p>

                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-[9px] text-slate-500">
                            {
                              source.organisation
                            }
                          </p>

                          <span className="text-[8px] font-semibold text-blue-700">
                            {
                              source.status
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-col justify-between rounded-[16px] bg-[#0b2949] p-4 text-white">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                    RIGHTS AWARE
                  </p>

                  <p className="mt-2 text-[12px] font-bold">
                    Public access ≠ reuse rights
                  </p>

                  <p className="mt-2 text-[9px] leading-4 text-slate-300">
                    {detail?.rights}
                  </p>
                </div>

                <p className="mt-3 text-[8px] uppercase tracking-[0.14em] text-blue-200">
                  Originating source preserved
                </p>
              </div>
            </article>
          </div>
        ) : null}

        {/* ================================================
            CONNECTED
        ================================================= */}

        {active === "connected" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[.86fr_1.14fr]">

            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-5 text-white">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                CONNECTED BUILT WORLD
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Knowledge relationships
              </h3>

              <div className="relative mt-6 grid grid-cols-[.85fr_1.15fr_.95fr] items-center gap-3">
                <div className="absolute left-[16%] right-[16%] top-1/2 h-px bg-white/10" />

                <div className="relative z-10">
                  <div className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3 transition hover:-translate-x-1 hover:bg-white/[0.12]">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                      ORGANISATION
                    </p>

                    <p className="mt-1 text-[12px] font-bold">
                      {detail?.publisher}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 rounded-[18px] bg-white p-4 text-center text-slate-950 shadow-lg transition hover:scale-[1.025]">
                  <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    KNOWLEDGE
                  </p>

                  <p className="mt-2 text-[14px] font-bold leading-5">
                    {entity.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {detail?.recordType}
                  </p>
                </div>

                <div className="relative z-10 space-y-2">
                  {topics
                    .slice(0, 3)
                    .map(
                      (
                        topic,
                        index
                      ) => (
                        <div
                          key={topic}
                          className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3 transition hover:translate-x-1 hover:bg-blue-300/10"
                        >
                          <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                            {index === 0
                              ? "THEME"
                              : index ===
                                1
                              ? "TOPIC"
                              : "CONTEXT"}
                          </p>

                          <p className="mt-1 text-[11px] font-bold">
                            {topic}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                  CONNECTION RULE
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Provenance and factual relationships remain separate from discovery recommendations.
                </p>
              </div>
            </article>

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    DISCOVER
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Explore more knowledge
                  </h3>
                </div>

                <Link
                  href="/knowledge"
                  className="group inline-flex items-center gap-1 text-[10px] font-bold text-blue-700"
                >
                  All knowledge
                  <Arrow />
                </Link>
              </div>

              {moreKnowledge.length ===
              1 ? (
                <div className="mt-3 grid h-[calc(100%-48px)] min-h-0 gap-3 lg:grid-cols-[.72fr_1.28fr]">
                  <Link
                    href={`/knowledge/${moreKnowledge[0].slug}`}
                    className="group flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex min-h-0 flex-1 flex-col justify-between bg-[#0b2949] p-4 text-white">
                      <div>
                        <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                          KNOWLEDGE
                        </p>

                        <p className="mt-2 text-[14px] font-bold">
                          {
                            moreKnowledge[0]
                              .title
                          }
                        </p>

                        <p className="mt-2 line-clamp-4 text-[9px] leading-4 text-slate-300">
                          {
                            moreKnowledge[0]
                              .summary
                          }
                        </p>
                      </div>

                      <div className="mt-5 flex h-12 items-end gap-1 opacity-35">
                        <div className="h-5 w-5 bg-current" />
                        <div className="h-9 w-5 bg-current" />
                        <div className="h-7 w-5 bg-current" />
                        <div className="h-11 w-5 bg-current" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3">
                      <span className="text-[9px] font-semibold text-slate-500">
                        Open record
                      </span>

                      <span className="text-blue-700 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>

                  <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#eef4fa] to-[#dce9f6] p-5">
                    <div
                      className="absolute inset-0 opacity-[0.28]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(11,41,73,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.12) 1px,transparent 1px)",
                        backgroundSize:
                          "32px 32px",
                      }}
                    />

                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                          DISCOVERY LENS
                        </p>

                        <h4 className="mt-2 text-[19px] font-bold text-[#0b2949]">
                          Follow the knowledge
                        </h4>

                        <p className="mt-2 max-w-md text-[10px] leading-5 text-slate-600">
                          Discover connected topics, projects, products and places as genuine Arknoz relationships become available.
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {topics
                          .slice(0, 3)
                          .map(
                            (
                              topic,
                              index
                            ) => (
                              <div
                                key={
                                  topic
                                }
                                className="rounded-[12px] bg-white/75 p-3 ring-1 ring-white"
                              >
                                <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-blue-700">
                                  {index ===
                                  0
                                    ? "THEME"
                                    : index ===
                                      1
                                    ? "TOPIC"
                                    : "CONTEXT"}
                                </p>

                                <p className="mt-1 text-[10px] font-bold">
                                  {
                                    topic
                                  }
                                </p>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : moreKnowledge.length >
                1 ? (
                <div
                  className={`mt-3 grid h-[calc(100%-48px)] gap-3 ${
                    moreKnowledge.length ===
                    2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {moreKnowledge
                    .slice(0, 3)
                    .map(
                      (
                        item,
                        index
                      ) => (
                        <Link
                          key={
                            item.slug
                          }
                          href={`/knowledge/${item.slug}`}
                          className="group flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div
                            className={`flex flex-1 flex-col justify-between p-4 ${
                              index ===
                              0
                                ? "bg-[#0b2949] text-white"
                                : "bg-[#eef3f8]"
                            }`}
                          >
                            <div>
                              <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-600">
                                KNOWLEDGE
                              </p>

                              <p className="mt-2 text-[13px] font-bold">
                                {
                                  item.title
                                }
                              </p>

                              <p className="mt-2 line-clamp-4 text-[9px] leading-4 opacity-70">
                                {
                                  item.summary
                                }
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-white p-3">
                            <span className="text-[9px] text-slate-500">
                              Open
                            </span>

                            <span className="text-blue-700">
                              →
                            </span>
                          </div>
                        </Link>
                      )
                    )}
                </div>
              ) : (
                <div className="mt-3 flex h-[calc(100%-48px)] items-center justify-center rounded-[18px] bg-[#f6f8fb] p-6 text-center">
                  <div>
                    <p className="text-sm font-bold">
                      Related knowledge will appear as genuine Arknoz records are connected.
                    </p>

                    <p className="mt-2 text-[10px] text-slate-500">
                      Unsupported relationships are never fabricated.
                    </p>
                  </div>
                </div>
              )}
            </article>
          </div>
        ) : null}

        {/* ================================================
            DEEP — ARKNOZ PRO PREVIEW
        ================================================= */}

        {active === "deep" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.08fr_.92fr]">

            <article className="relative overflow-hidden rounded-[22px] bg-[#071b31] p-6 text-white">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                  backgroundSize:
                    "34px 34px",
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

                  <h3 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">
                    Arknoz Data Intelligence,
                    Analysis & Review.
                  </h3>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-300">
                    Original Arknoz work developed through structured data, contextual analysis, review and connected Built World knowledge.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Data Intelligence",
                    "Knowledge Analysis",
                    "Arknoz Review",
                    "Advanced Connections",
                    "Comparative Context",
                    "Professional Insights",
                  ].map((item) => (
                    <div
                      key={item}
                      aria-disabled="true"
                      className="cursor-not-allowed rounded-[13px] border border-white/10 bg-white/[0.06] px-3 py-3 opacity-85"
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
                    "Arknoz knowledge analysis",
                    "Contextual review and interpretation",
                    "Connected Built World comparisons and insights",
                  ].map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-[13px] bg-white px-3 py-2.5 ring-1 ring-slate-200"
                      >
                        <span className="text-[9px] font-bold text-blue-700">
                          0{index + 1}
                        </span>

                        <span className="text-[11px] font-semibold">
                          {item}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    ARKNOZ PRO
                  </p>

                  <p className="mt-1 max-w-sm text-[10px] leading-4 text-slate-500">
                    Public knowledge information stays free. Arknoz Deep is planned for Arknoz Pro.
                  </p>
                </div>

                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#0b2949] px-4 py-2 text-[11px] font-bold text-white">
                  <LockIcon />
                  Planned
                </span>
              </div>
            </article>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes arkKnowledgeTabIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ark-knowledge-tab {
          animation: arkKnowledgeTabIn
            220ms ease-out both;
        }
      `}</style>
    </div>
  );
}

