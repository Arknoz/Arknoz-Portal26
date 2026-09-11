"use client";

import { useState } from "react";
import Link from "next/link";

import type {
  EntityRecord,
} from "@/lib/entities";

import type {
  ProfileDetailData,
} from "@/lib/profile-details";

type TabKey =
  | "overview"
  | "profile"
  | "connected";

function kindLabel(
  kind: ProfileDetailData["kind"]
) {
  if (kind === "person") {
    return "PERSON";
  }

  if (kind === "university") {
    return "INSTITUTION";
  }

  return "ORGANISATION";
}

export default function ProfileDetailTabs({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail: ProfileDetailData;
}) {
  const [active, setActive] =
    useState<TabKey>("overview");

  const [focusIndex, setFocusIndex] =
    useState(0);

  const tabs: {
    id: TabKey;
    label: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "profile",
      label: "Profile",
    },
    {
      id: "connected",
      label: "Connected",
    },
  ];

  const activeFocus =
    detail.focus[focusIndex] ??
    detail.focus[0];

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
                    : "text-slate-600 hover:-translate-y-[1px] hover:bg-white hover:text-[#0b2949]"
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
        className="ark-profile-tab mt-4 min-h-0 flex-1 overflow-hidden"
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
                    ABOUT
                  </p>

                  <span className="text-[9px] text-slate-400">
                    Public professional record
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-slate-700">
                  {detail.overview}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">

                <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  EXPLORE FOCUS
                </p>

                <div className="grid grid-cols-2 gap-2">

                  {detail.focus
                    .slice(0, 4)
                    .map(
                      (
                        item,
                        index
                      ) => {
                        const selected =
                          focusIndex === index;

                        return (
                          <button
                            key={item.title}
                            type="button"
                            onMouseEnter={() =>
                              setFocusIndex(index)
                            }
                            onFocus={() =>
                              setFocusIndex(index)
                            }
                            onClick={() =>
                              setFocusIndex(index)
                            }
                            className={`rounded-[12px] px-3 py-2.5 text-left transition-all duration-200 ${
                              selected
                                ? "bg-[#0b2949] text-white shadow-sm"
                                : "bg-[#f5f7fa] hover:-translate-y-[1px] hover:bg-[#eef3f8]"
                            }`}
                          >
                            <p className="text-[10px] font-bold">
                              {item.title}
                            </p>
                          </button>
                        );
                      }
                    )}
                </div>
              </div>
            </article>


            <article className="rounded-[22px] bg-[#f5f7fa] p-5">

              <div className="flex items-center justify-between">

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  KEY DETAILS
                </p>

                <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-400">
                  Source-backed
                </span>
              </div>

              <div className="mt-2 divide-y divide-slate-200">

                {detail.facts
                  .slice(0, 8)
                  .map((fact) => (
                    <div
                      key={fact.label}
                      className="grid grid-cols-[100px_1fr] gap-3 py-[7px] text-[12px]"
                    >
                      <span className="text-slate-500">
                        {fact.label}
                      </span>

                      <strong>
                        {fact.value}
                      </strong>
                    </div>
                  ))}
              </div>
            </article>


            <div className="grid min-h-0 grid-rows-[1.15fr_.85fr] gap-3">

              <article className="relative overflow-hidden rounded-[22px] bg-[#0b2949] p-5 text-white">

                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.45) 1px,transparent 1px)",
                    backgroundSize:
                      "30px 30px",
                  }}
                />

                <div className="relative flex h-full flex-col justify-between">

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      PROFILE SIGNAL
                    </p>

                    <h3 className="mt-2 text-[19px] font-bold">
                      {activeFocus?.title}
                    </h3>

                    <p className="mt-2 text-[10px] leading-5 text-slate-300">
                      {activeFocus?.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-200">
                      {kindLabel(
                        detail.kind
                      )}
                    </p>

                    <p className="mt-1 text-[13px] font-bold">
                      {detail.location}
                    </p>
                  </div>
                </div>
              </article>


              <article className="grid grid-cols-2 gap-3 rounded-[22px] border border-slate-200 bg-white p-4">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    STATUS
                  </p>

                  <p className="mt-2 text-[12px] font-bold">
                    {detail.statusLabel}
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-4">

                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    SOURCES
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {detail.sources.length}
                  </p>

                  <p className="text-[9px] text-slate-500">
                    official records
                  </p>
                </div>
              </article>
            </div>
          </div>
        ) : null}


        {/* ==================================================
            PROFILE
        ================================================== */}

        {active === "profile" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[1.08fr_.80fr]">

            {/* FOCUS */}
            <article className="rounded-[22px] bg-[#0b2949] p-4 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    FOCUS & EXPERTISE
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    {detail.kind ===
                    "person"
                      ? "Professional focus"
                      : detail.kind ===
                        "university"
                      ? "Academic focus"
                      : "Practice focus"}
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[9px] text-slate-300">
                  {
                    detail.focus
                      .length
                  }{" "}
                  areas
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5">

                {detail.focus
                  .slice(0, 4)
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <button
                        key={item.title}
                        type="button"
                        onMouseEnter={() =>
                          setFocusIndex(
                            index
                          )
                        }
                        onFocus={() =>
                          setFocusIndex(
                            index
                          )
                        }
                        className={`rounded-[14px] border p-3.5 text-left transition-all ${
                          focusIndex ===
                          index
                            ? "border-blue-300/35 bg-white/[0.13]"
                            : "border-white/10 bg-white/[0.06] hover:bg-white/[0.10]"
                        }`}
                      >
                        <p className="text-[8px] font-bold text-blue-200">
                          0
                          {index +
                            1}
                        </p>

                        <p className="mt-1 text-[12px] font-bold">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-300">
                          {
                            item.description
                          }
                        </p>
                      </button>
                    )
                  )}
              </div>
            </article>


            {/* ACTIVITIES */}
            <article className="rounded-[22px] border border-slate-200 bg-white p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                PROFILE ACTIVITY
              </p>

              <h3 className="mt-1 text-[15px] font-bold">
                Work, research & context
              </h3>

              <div className="mt-3 space-y-2">

                {detail.activities
                  .slice(0, 4)
                  .map((item) => {

                    const content = (
                      <>
                        <div>
                          <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-blue-700">
                            {item.label}
                          </p>

                          <p className="mt-1 text-[11px] font-bold">
                            {item.title}
                          </p>

                          {item.description ? (
                            <p className="mt-1 text-[9px] leading-4 text-slate-500">
                              {
                                item.description
                              }
                            </p>
                          ) : null}
                        </div>

                        {item.href ? (
                          <span className="text-blue-700">
                            →
                          </span>
                        ) : null}
                      </>
                    );

                    return item.href ? (
                      <Link
                        key={`${item.label}-${item.title}`}
                        href={item.href}
                        className="flex items-center justify-between gap-3 rounded-[13px] bg-[#f5f7fa] p-3 transition hover:-translate-y-[1px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={`${item.label}-${item.title}`}
                        className="flex items-center justify-between gap-3 rounded-[13px] bg-[#f5f7fa] p-3"
                      >
                        {content}
                      </div>
                    );
                  })}
              </div>
            </article>


            {/* PROFILE PRINCIPLE */}
            <article className="rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                ARKNOZ PROFILE
              </p>

              <h3 className="mt-2 text-[16px] font-bold">
                One canonical identity
              </h3>

              <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-600">
                Arknoz connects professional identity, work, knowledge, institutions and places without creating duplicate identities or inferring unsupported credentials.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {detail.focus.map(
                  (item) => (
                    <span
                      key={item.title}
                      className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold ring-1 ring-slate-200"
                    >
                      {item.title}
                    </span>
                  )
                )}
              </div>
            </article>


            {/* SOURCES */}
            <article className="grid grid-cols-[1.25fr_.75fr] gap-3 rounded-[22px] border border-slate-200 bg-white p-4">

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
                        className="flex items-center justify-between rounded-[12px] bg-[#f5f7fa] px-3 py-2.5 transition hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                      >
                        <div>
                          <p className="text-[10px] font-bold">
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
                    )
                  )}
                </div>
              </div>


              <div className="flex flex-col justify-between rounded-[16px] bg-[#0b2949] p-4 text-white">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-blue-200">
                    PROFILE RULE
                  </p>

                  <p className="mt-2 text-[12px] font-bold">
                    Public facts only
                  </p>

                  <p className="mt-2 text-[9px] leading-4 text-slate-300">
                    Private contact details, sensitive traits and unsupported credentials are never inferred.
                  </p>
                </div>

                {detail.officialUrl ? (
                  <a
                    href={
                      detail.officialUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-[10px] font-bold text-blue-200"
                  >
                    Official source →
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

            <article className="rounded-[22px] bg-[#0b2949] p-5 text-white">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                CONNECTED BUILT WORLD
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Genuine relationships
              </h3>


              {detail.connections.length >
              0 ? (
                <div className="relative mt-6 grid grid-cols-[1fr_1.1fr] gap-3">

                  <div className="rounded-[18px] bg-white p-5 text-center text-slate-950">

                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-700">
                      {kindLabel(
                        detail.kind
                      )}
                    </p>

                    <p className="mt-2 text-[16px] font-bold">
                      {entity.title}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      {detail.location}
                    </p>
                  </div>


                  <div className="space-y-2">

                    {detail.connections
                      .slice(0, 4)
                      .map(
                        (
                          connection
                        ) => (
                          <Link
                            key={`${connection.type}-${connection.title}`}
                            href={
                              connection.href
                            }
                            className="block rounded-[14px] border border-white/10 bg-white/[0.07] p-3 transition hover:translate-x-1 hover:bg-white/[0.11]"
                          >
                            <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                              {
                                connection.type
                              }
                            </p>

                            <p className="mt-1 text-[11px] font-bold">
                              {
                                connection.title
                              }
                            </p>

                            {connection.description ? (
                              <p className="mt-1 text-[9px] leading-4 text-slate-300">
                                {
                                  connection.description
                                }
                              </p>
                            ) : null}
                          </Link>
                        )
                      )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[18px] border border-white/10 bg-white/[0.06] p-5">

                  <p className="text-[12px] font-bold">
                    Connections will appear here when genuine Arknoz relationships are established.
                  </p>

                  <p className="mt-2 text-[9px] leading-4 text-slate-300">
                    Arknoz does not manufacture relationships merely to fill the profile.
                  </p>
                </div>
              )}


              <div className="mt-6 border-t border-white/10 pt-4">

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-200">
                  CONNECTION RULE
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Professional relationships are shown only when supported by genuine public or permissioned information.
                </p>
              </div>
            </article>


            <article className="rounded-[22px] border border-slate-200 bg-white p-5">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                CONTINUE EXPLORING
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Follow the Built World connections
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">

                {[
                  {
                    label: "PROJECTS",
                    title:
                      "Explore projects",
                    href: "/projects",
                    dark: true,
                  },
                  {
                    label: "KNOWLEDGE",
                    title:
                      "Explore knowledge",
                    href: "/knowledge",
                  },
                  {
                    label: "LEARNING",
                    title:
                      "Explore education",
                    href: "/education",
                  },
                  {
                    label:
                      "OPPORTUNITIES",
                    title:
                      "Explore opportunities",
                    href:
                      "/opportunities",
                  },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-[17px] p-4 transition hover:-translate-y-1 hover:shadow-lg ${
                      item.dark
                        ? "bg-[#0b2949] text-white"
                        : "bg-[#eef3f8]"
                    }`}
                  >
                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.14em] ${
                        item.dark
                          ? "text-blue-200"
                          : "text-blue-700"
                      }`}
                    >
                      {item.label}
                    </p>

                    <p className="mt-2 text-[15px] font-bold">
                      {item.title}
                    </p>

                    <p
                      className={`mt-5 text-[10px] font-bold ${
                        item.dark
                          ? "text-blue-200"
                          : "text-blue-700"
                      }`}
                    >
                      Explore →
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </div>


      <style jsx>{`
        @keyframes arkProfileTabIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ark-profile-tab {
          animation:
            arkProfileTabIn
            220ms ease-out both;
        }
      `}</style>
    </div>
  );
}
