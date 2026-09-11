"use client";

import { useState } from "react";
import Link from "next/link";

import type {
  LearningDetailData,
} from "@/lib/learning-details";

type TabKey =
  | "overview"
  | "learning"
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

function LearningSignal({
  detail,
  focus,
}: {
  detail: LearningDetailData;
  focus: number;
}) {
  const outcome =
    detail.outcomes?.[focus] ??
    detail.outcomes?.[0];

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
            LEARNING SIGNAL
          </p>

          <h3 className="mt-2 text-[18px] font-bold">
            {outcome?.title ??
              detail.learningType}
          </h3>

          {outcome?.description ? (
            <p className="mt-2 text-[10px] leading-5 text-slate-300">
              {outcome.description}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex h-16 items-end gap-2 opacity-40">
            <div className="h-8 w-8 rounded-t bg-white" />
            <div className="h-12 w-8 rounded-t bg-white" />
            <div className="h-9 w-8 rounded-t bg-white" />
            <div className="h-14 w-8 rounded-t bg-white" />
          </div>

          <p className="mt-2 text-[8px] uppercase tracking-[0.15em] text-blue-200">
            {detail.level}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LearningDetailTabs({
  detail,
}: {
  detail: LearningDetailData;
}) {
  const [active, setActive] =
    useState<TabKey>("overview");

  const [outcomeFocus, setOutcomeFocus] =
    useState(0);

  const outcomes = detail.outcomes ?? [];
  const resources = detail.resources ?? [];
  const topics = detail.topics ?? [];
  const sources = detail.sources ?? [];
  const facts = detail.facts ?? [];

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
      id: "learning",
      label: "Learning",
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
        className="ark-learning-tab mt-4 min-h-0 flex-1 overflow-hidden"
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
                    ABOUT THIS LEARNING RESOURCE
                  </p>

                  <span className="text-[9px] text-slate-400">
                    Public information
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-slate-700">
                  {detail.summary}
                </p>
              </div>

              {outcomes.length > 0 ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    EXPLORE LEARNING OUTCOMES
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {outcomes
                      .slice(0, 4)
                      .map(
                        (
                          outcome,
                          index
                        ) => {
                          const selected =
                            outcomeFocus ===
                            index;

                          return (
                            <button
                              key={
                                outcome.title
                              }
                              type="button"
                              onMouseEnter={() =>
                                setOutcomeFocus(
                                  index
                                )
                              }
                              onFocus={() =>
                                setOutcomeFocus(
                                  index
                                )
                              }
                              onClick={() =>
                                setOutcomeFocus(
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
                                  outcome.title
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
                  KEY INFORMATION
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

              <LearningSignal
                detail={detail}
                focus={outcomeFocus}
              />

              <article className="grid grid-cols-2 gap-3 rounded-[22px] border border-slate-200 bg-white p-4">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    PROVIDER
                  </p>

                  <h3 className="mt-2 text-[14px] font-bold">
                    {detail.provider}
                  </h3>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {detail.department}
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
                    official records
                  </p>
                </div>
              </article>
            </div>
          </div>
        ) : null}

        {/* ==================================================
            LEARNING
        ================================================== */}

        {active === "learning" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[1.12fr_.76fr]">

            {/* OUTCOMES */}
            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-4 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    LEARNING OUTCOMES
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    What the learner explores
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] text-slate-300">
                  {outcomes.length} outcomes
                </span>
              </div>

              <div className="mt-3 grid h-[calc(100%-45px)] min-h-0 grid-cols-2 grid-rows-2 gap-2.5">
                {outcomes
                  .slice(0, 4)
                  .map(
                    (
                      outcome,
                      index
                    ) => {
                      const selected =
                        outcomeFocus ===
                        index;

                      return (
                        <button
                          key={
                            outcome.title
                          }
                          type="button"
                          onMouseEnter={() =>
                            setOutcomeFocus(
                              index
                            )
                          }
                          onFocus={() =>
                            setOutcomeFocus(
                              index
                            )
                          }
                          onClick={() =>
                            setOutcomeFocus(
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
                                  outcome.title
                                }
                              </h4>

                              <p className="mt-1.5 text-[10px] leading-[1.45] text-slate-300">
                                {
                                  outcome.description
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

            {/* RESOURCE TYPES */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    LEARNING RESOURCES
                  </p>

                  <h3 className="mt-1 text-[15px] font-bold">
                    Available course material
                  </h3>
                </div>

                <span className="text-[9px] text-slate-400">
                  Official source
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {resources
                  .slice(0, 4)
                  .map(
                    (
                      resource,
                      index
                    ) => (
                      <div
                        key={
                          resource.title
                        }
                        className="group rounded-[13px] bg-[#f5f7fa] p-3 transition-all duration-200 hover:-translate-y-[2px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                      >
                        <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-blue-700">
                          RESOURCE{" "}
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </p>

                        <p className="mt-1 text-[11px] font-bold">
                          {
                            resource.title
                          }
                        </p>

                        {resource.description ? (
                          <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-500">
                            {
                              resource.description
                            }
                          </p>
                        ) : null}
                      </div>
                    )
                  )}
              </div>
            </article>

            {/* TOPICS */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                SKILLS & SUBJECT CONTEXT
              </p>

              <h3 className="mt-2 text-[16px] font-bold">
                Learning connected to practice
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-slate-500">
                Topics describe the learning context. Arknoz does not infer learner proficiency, credential or professional competence from viewing this resource.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-slate-700 ring-1 ring-slate-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </article>

            {/* SOURCE / STATUS */}
            <article className="grid min-h-0 grid-cols-[1.2fr_.8fr] gap-3 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  SOURCE & STATUS
                </p>

                <div className="mt-3 space-y-2">
                  {sources
                    .slice(0, 3)
                    .map((source) => (
                      <a
                        key={source.label}
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-[12px] bg-[#f5f7fa] px-3 py-2.5 transition hover:-translate-y-[1px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold">
                            {
                              source.label
                            }
                          </p>

                          <p className="text-[9px] text-slate-500">
                            {
                              source.organisation
                            }
                          </p>
                        </div>

                        <span className="text-blue-700">
                          ↗
                        </span>
                      </a>
                    ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-col justify-between rounded-[16px] bg-[#0b2949] p-4 text-white">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                    LEARNING STATUS
                  </p>

                  <p className="mt-2 text-[13px] font-bold">
                    {detail.status}
                  </p>

                  <p className="mt-2 text-[9px] leading-4 text-slate-300">
                    {detail.notice}
                  </p>
                </div>

                {detail.officialUrl ? (
                  <a
                    href={
                      detail.officialUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-200"
                  >
                    Official source
                    <Arrow />
                  </a>
                ) : null}
              </div>
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
                Learning relationships
              </h3>

              <div className="relative mt-6 grid grid-cols-[.85fr_1.15fr_.95fr] items-center gap-3">
                <div className="absolute left-[16%] right-[16%] top-1/2 h-px bg-white/10" />

                <div className="relative z-10 space-y-2">
                  <div className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                      PROVIDER
                    </p>

                    <p className="mt-1 text-[11px] font-bold">
                      {detail.provider}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                      DEPARTMENT
                    </p>

                    <p className="mt-1 text-[11px] font-bold">
                      {detail.department}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 rounded-[18px] bg-white p-4 text-center text-slate-950 shadow-lg transition hover:scale-[1.025]">
                  <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    LEARNING
                  </p>

                  <p className="mt-2 text-[14px] font-bold leading-5">
                    {detail.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {detail.level}
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
                            {index ===
                            0
                              ? "SUBJECT"
                              : index ===
                                1
                              ? "TOPIC"
                              : "PRACTICE"}
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
                  LEARNING RULE
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Provider, qualification, accreditation, skill and learner proficiency remain separate facts.
                </p>
              </div>
            </article>

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  CONTINUE YOUR JOURNEY
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  Connect learning to the Built World
                </h3>
              </div>

              <div className="mt-4 grid h-[calc(100%-54px)] grid-cols-2 gap-3">

                <Link
                  href="/knowledge"
                  className="group rounded-[17px] bg-[#0b2949] p-4 text-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-200">
                    KNOWLEDGE
                  </p>

                  <h4 className="mt-2 text-[15px] font-bold">
                    Understand the concepts
                  </h4>

                  <p className="mt-2 text-[9px] leading-4 text-slate-300">
                    Continue into research, methods and Built World knowledge.
                  </p>

                  <p className="mt-5 text-[10px] font-bold text-blue-200">
                    Explore knowledge →
                  </p>
                </Link>

                <Link
                  href="/projects"
                  className="group rounded-[17px] bg-[#e8eef5] p-4 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    PROJECTS
                  </p>

                  <h4 className="mt-2 text-[15px] font-bold">
                    See real-world practice
                  </h4>

                  <p className="mt-2 text-[9px] leading-4 text-slate-500">
                    Explore how Built World concepts appear in actual projects.
                  </p>

                  <p className="mt-5 text-[10px] font-bold text-blue-700">
                    Explore projects →
                  </p>
                </Link>

                <Link
                  href="/products"
                  className="group rounded-[17px] bg-[#f4f7fa] p-4 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    PRODUCTS & SYSTEMS
                  </p>

                  <h4 className="mt-2 text-[15px] font-bold">
                    Understand building systems
                  </h4>

                  <p className="mt-2 text-[9px] leading-4 text-slate-500">
                    Follow concepts into materials, components and systems.
                  </p>

                  <p className="mt-5 text-[10px] font-bold text-blue-700">
                    Explore products →
                  </p>
                </Link>

                <Link
                  href="/opportunities"
                  className="group rounded-[17px] bg-[#dcebf8] p-4 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-700">
                    OPPORTUNITIES
                  </p>

                  <h4 className="mt-2 text-[15px] font-bold">
                    Discover what comes next
                  </h4>

                  <p className="mt-2 text-[9px] leading-4 text-slate-600">
                    Find genuine current learning, professional and research opportunities.
                  </p>

                  <p className="mt-5 text-[10px] font-bold text-blue-700">
                    Explore opportunities →
                  </p>
                </Link>

              </div>
            </article>
          </div>
        ) : null}

        {/* ==================================================
            DEEP — SUBSCRIBER PREVIEW
        ================================================== */}

        {active === "deep" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.08fr_.92fr]">

            <article className="relative overflow-hidden rounded-[22px] bg-[#071b31] p-6 text-white shadow-[0_10px_30px_rgba(7,27,49,.14)]">
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
                    Original Arknoz work connecting learning with subjects, knowledge, practice and the wider Built World.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Learning Intelligence",
                    "Path Analysis",
                    "Arknoz Review",
                    "Advanced Connections",
                    "Programme Comparison",
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
                  SUBSCRIBER PREVIEW
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Original Arknoz intelligence for professional subscribers.
                </h3>

                <div className="mt-4 space-y-2">
                  {[
                    "Structured learning intelligence",
                    "Arknoz learning-path analysis",
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
                    Public learning information stays free. Arknoz Deep is available to Pro subscribers.
                  </p>
                </div>

                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#0b2949] px-4 py-2 text-[11px] font-bold text-white">
                  <LockIcon />
                  Subscriber
                </span>
              </div>
            </article>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes arkLearningTabIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ark-learning-tab {
          animation: arkLearningTabIn
            220ms ease-out both;
        }
      `}</style>
    </div>
  );
}
