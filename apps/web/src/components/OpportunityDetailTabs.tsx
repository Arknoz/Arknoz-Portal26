"use client";

import { useState } from "react";
import Link from "next/link";

import type { EntityRecord } from "@/lib/entities";
import type { OpportunityDetailData } from "@/lib/opportunity-details";

type TabKey =
  | "overview"
  | "opportunity"
  | "connected";

export default function OpportunityDetailTabs({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail: OpportunityDetailData;
}) {
  const [active, setActive] =
    useState<TabKey>("overview");

  const tabs: {
    id: TabKey;
    label: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "opportunity",
      label: "Opportunity",
    },
    {
      id: "connected",
      label: "Connected",
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* TAB RAIL */}
      <div className="shrink-0 rounded-[18px] bg-[#f2f5f9] p-1.5 ring-1 ring-slate-200/60">
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const selected =
              active === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActive(tab.id)
                }
                className={`rounded-[13px] px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                  selected
                    ? "bg-[#0b2949] text-white shadow-[0_5px_16px_rgba(11,41,73,.18)]"
                    : "text-slate-600 hover:bg-white hover:text-[#0b2949]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={active}
        className="mt-4 min-h-0 flex-1 overflow-hidden"
      >

        {/* ==================================================
            OVERVIEW
        ================================================== */}

        {active === "overview" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1fr_.72fr_.62fr]">

            <article className="flex min-h-0 flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-5">

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    ABOUT THIS OPPORTUNITY
                  </p>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-bold text-emerald-700">
                    OPEN
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-slate-700">
                  {detail.summary}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">

                {[
                  ["Eligibility", detail.eligibility],
                  ["Prize fund", detail.prize],
                  [
                    "Registration",
                    detail.registrationDeadline,
                  ],
                  [
                    "Submission",
                    detail.submissionDeadline,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[12px] bg-[#f5f7fa] px-3 py-2.5"
                  >
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-700">
                      {label}
                    </p>

                    <p className="mt-1 text-[10px] font-bold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[22px] bg-[#f5f7fa] p-5">

              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  KEY INFORMATION
                </p>

                <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-400">
                  Source-backed
                </span>
              </div>

              <div className="mt-2 divide-y divide-slate-200">
                {detail.facts.map(
                  (fact) => (
                    <div
                      key={fact.label}
                      className="grid grid-cols-[90px_1fr] gap-3 py-[8px] text-[12px]"
                    >
                      <span className="text-slate-500">
                        {fact.label}
                      </span>

                      <strong>
                        {fact.value}
                      </strong>
                    </div>
                  )
                )}
              </div>
            </article>

            <div className="grid min-h-0 grid-rows-[1.15fr_.85fr] gap-3">

              <article className="relative overflow-hidden rounded-[22px] bg-[#0b2949] p-5 text-white">

                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
                    backgroundSize:
                      "30px 30px",
                  }}
                />

                <div className="relative flex h-full flex-col justify-between">

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      OPPORTUNITY STATUS
                    </p>

                    <h3 className="mt-3 text-[22px] font-bold">
                      Registration open
                    </h3>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">
                      29 Oct 2026
                    </p>

                    <p className="mt-1 text-[10px] text-slate-300">
                      Registration deadline
                    </p>
                  </div>
                </div>
              </article>

              <article className="grid grid-cols-2 gap-3 rounded-[22px] border border-slate-200 bg-white p-4">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    ORGANISER
                  </p>

                  <p className="mt-2 text-[14px] font-bold">
                    {detail.organiser}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {detail.geography}
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-4">
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    LAST CHECKED
                  </p>

                  <p className="mt-2 text-[13px] font-bold">
                    {detail.lastChecked}
                  </p>

                  <p className="text-[9px] text-slate-500">
                    source status
                  </p>
                </div>
              </article>
            </div>
          </div>
        ) : null}

        {/* ==================================================
            OPPORTUNITY
        ================================================== */}

        {active === "opportunity" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[1.12fr_.76fr]">

            <article className="rounded-[22px] bg-[#0b2949] p-4 text-white">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                ELIGIBILITY
              </p>

              <h3 className="mt-1 text-[16px] font-bold">
                Who can participate
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2">

                {detail.eligibilityItems.map(
                  (item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3"
                    >
                      <p className="text-[8px] font-bold text-blue-200">
                        0{index + 1}
                      </p>

                      <p className="mt-1 text-[11px] font-bold">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </article>

            <article className="rounded-[22px] border border-slate-200 bg-white p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                HOW TO APPLY
              </p>

              <h3 className="mt-1 text-[15px] font-bold">
                Official application path
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2">

                {detail.requirements.map(
                  (item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[13px] bg-[#f5f7fa] p-3"
                    >
                      <p className="text-[7px] font-bold uppercase text-blue-700">
                        STEP 0{index + 1}
                      </p>

                      <p className="mt-1 text-[11px] font-bold">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </article>

            <article className="rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                TIMELINE
              </p>

              <div className="relative mt-5">

                <div className="absolute left-2 right-2 top-[7px] h-px bg-slate-300" />

                <div className="relative grid grid-cols-4 gap-3">

                  {detail.dates.map(
                    (item) => (
                      <div
                        key={`${item.date}-${item.title}`}
                      >
                        <div className="h-3.5 w-3.5 rounded-full border-[3px] border-white bg-blue-700" />

                        <p className="mt-3 text-[15px] font-bold text-blue-700">
                          {item.date}
                        </p>

                        <p className="mt-1 text-[10px] font-bold">
                          {item.title}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </article>

            <article className="grid grid-cols-[1.2fr_.8fr] gap-3 rounded-[22px] border border-slate-200 bg-white p-4">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  OFFICIAL SOURCES
                </p>

                <div className="mt-3 space-y-2">

                  {detail.sources.map(
                    (source) => (
                      <a
                        key={source.label}
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-[12px] bg-[#f5f7fa] px-3 py-2.5"
                      >
                        <div>
                          <p className="text-[10px] font-bold">
                            {source.label}
                          </p>

                          <p className="text-[9px] text-slate-500">
                            {source.organisation}
                          </p>
                        </div>

                        <span className="text-blue-700">
                          ↗
                        </span>
                      </a>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-[16px] bg-[#0b2949] p-4 text-white">

                <div>
                  <p className="text-[8px] font-bold uppercase text-blue-200">
                    CURRENT STATE
                  </p>

                  <p className="mt-2 text-[13px] font-bold">
                    {detail.status}
                  </p>

                  <p className="mt-2 text-[9px] text-slate-300">
                    Last checked:
                    {" "}
                    {detail.lastChecked}
                  </p>
                </div>

                <a
                  href={detail.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 text-[10px] font-bold text-blue-200"
                >
                  Apply / verify →
                </a>
              </div>
            </article>
          </div>
        ) : null}

        {/* ==================================================
            CONNECTED
        ================================================== */}

        {active === "connected" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[.86fr_1.14fr]">

            <article className="rounded-[22px] bg-[#0b2949] p-5 text-white">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                CONNECTED BUILT WORLD
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Opportunity relationships
              </h3>

              <div className="relative mt-6 grid grid-cols-[.85fr_1.15fr_.95fr] items-center gap-3">

                <div className="absolute left-[16%] right-[16%] top-1/2 h-px bg-white/10" />

                <div className="relative z-10 space-y-2">

                  <div className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3">
                    <p className="text-[7px] font-bold uppercase text-blue-200">
                      ORGANISER
                    </p>

                    <p className="mt-1 text-[11px] font-bold">
                      {detail.organiser}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3">
                    <p className="text-[7px] font-bold uppercase text-blue-200">
                      PLACE
                    </p>

                    <p className="mt-1 text-[11px] font-bold">
                      Vancouver
                    </p>
                  </div>
                </div>

                <div className="relative z-10 rounded-[18px] bg-white p-4 text-center text-slate-950 shadow-lg">

                  <p className="text-[7px] font-bold uppercase text-blue-700">
                    OPPORTUNITY
                  </p>

                  <p className="mt-2 text-[14px] font-bold">
                    {entity.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {detail.opportunityType}
                  </p>
                </div>

                <div className="relative z-10 space-y-2">

                  {detail.topics
                    .slice(0, 3)
                    .map(
                      (
                        topic,
                        index
                      ) => (
                        <div
                          key={topic}
                          className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3"
                        >
                          <p className="text-[7px] font-bold uppercase text-blue-200">
                            {index === 0
                              ? "SUBJECT"
                              : index === 1
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

                <p className="text-[8px] font-bold uppercase text-blue-200">
                  OPPORTUNITY RULE
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Arknoz surfaces genuine opportunities but applications remain with the official organiser.
                </p>
              </div>
            </article>

            <article className="rounded-[22px] border border-slate-200 bg-white p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                CONTINUE YOUR JOURNEY
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Explore the opportunity context
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">

                {[
                  {
                    title:
                      "Explore urban practice",
                    label: "PROJECTS",
                    href: "/projects",
                  },
                  {
                    title:
                      "Understand the topic",
                    label: "KNOWLEDGE",
                    href: "/knowledge",
                  },
                  {
                    title:
                      "Build relevant knowledge",
                    label: "LEARNING",
                    href: "/education",
                  },
                  {
                    title:
                      "Discover more opportunities",
                    label:
                      "MORE OPPORTUNITIES",
                    href: "/opportunities",
                  },
                ].map(
                  (
                    item,
                    index
                  ) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded-[17px] p-4 transition hover:-translate-y-1 hover:shadow-lg ${
                        index === 0
                          ? "bg-[#0b2949] text-white"
                          : "bg-[#eef3f8]"
                      }`}
                    >
                      <p
                        className={`text-[8px] font-bold uppercase tracking-[0.14em] ${
                          index === 0
                            ? "text-blue-200"
                            : "text-blue-700"
                        }`}
                      >
                        {item.label}
                      </p>

                      <p className="mt-2 text-[14px] font-bold">
                        {item.title}
                      </p>

                      <p className="mt-5 text-[10px] font-bold text-blue-600">
                        Explore →
                      </p>
                    </Link>
                  )
                )}
              </div>
            </article>
          </div>
        ) : null}
      </div>
    </div>
  );
}
