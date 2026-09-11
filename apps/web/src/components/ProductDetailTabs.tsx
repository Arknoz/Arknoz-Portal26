"use client";

import { useState } from "react";
import Link from "next/link";

import {
  entities,
  type EntityRecord,
} from "@/lib/entities";

import type {
  ProductDetailData,
} from "@/lib/product-details";

type TabKey =
  | "overview"
  | "product"
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

function ProductSignal({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: ProductDetailData;
}) {
  const media = detail?.media?.[0];

  if (media) {
    return (
      <div className="group relative h-full min-h-0 overflow-hidden rounded-[20px] bg-[#0b2949]">
        <img
          src={media.src}
          alt={media.alt ?? entity.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071b31]/95 via-[#071b31]/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
            PRODUCT FEATURE
          </p>

          <p className="mt-1 text-lg font-bold">
            {entity.title}
          </p>
        </div>
      </div>
    );
  }

  const carbon =
    detail?.facts?.find((fact) =>
      fact.label.toLowerCase().includes("carbon")
    );

  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0b2949] via-[#0b355e] to-[#071b31] p-5 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.45) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
            PRODUCT SIGNAL
          </p>

          <p className="mt-2 max-w-[250px] text-[18px] font-bold leading-6">
            {detail?.subCategory ??
              detail?.category ??
              "Built World product"}
          </p>
        </div>

        <div>
          {carbon ? (
            <>
              <p className="text-3xl font-bold tracking-tight">
                ≥30%
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-300">
                Manufacturer-reported lower CO₂ threshold
              </p>
            </>
          ) : (
            <p className="text-xl font-bold">
              {entity.title}
            </p>
          )}

          <div className="mt-4 flex items-end gap-1.5 opacity-40">
            <div className="h-6 w-8 rounded-t bg-white" />
            <div className="h-10 w-8 rounded-t bg-white" />
            <div className="h-14 w-8 rounded-t bg-white" />
            <div className="h-9 w-8 rounded-t bg-white" />
            <div className="h-12 w-8 rounded-t bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailTabs({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: ProductDetailData;
}) {
  const [active, setActive] =
    useState<TabKey>("overview");

  const [propertyFocus, setPropertyFocus] =
    useState(0);

  const [applicationFocus, setApplicationFocus] =
    useState(0);

  const facts = detail?.facts ?? [];
  const properties = detail?.properties ?? [];
  const applications =
    detail?.applications ?? [];
  const sustainability =
    detail?.sustainability ?? [];
  const sources = detail?.sources ?? [];
  const topics = detail?.topics ?? [];

  const focusedProperty =
    properties[propertyFocus] ??
    properties[0];

  const focusedApplication =
    applications[applicationFocus] ??
    applications[0];

  const moreProducts = entities
    .filter(
      (item) =>
        item.type === "product" &&
        item.slug !== entity.slug
    )
    .slice(0, 3);

  const tabs: {
    id: TabKey;
    label: string;
    locked?: boolean;
  }[] = [
    { id: "overview", label: "Overview" },
    { id: "product", label: "Product" },
    { id: "connected", label: "Connected" },
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
                className={`group flex items-center justify-center gap-2 rounded-[13px] px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
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
        className="ark-product-tab mt-4 min-h-0 flex-1 overflow-hidden"
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
                    ABOUT THIS PRODUCT
                  </p>

                  <span className="text-[9px] text-slate-400">
                    Public information
                  </span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-slate-700">
                  {detail?.overview ??
                    entity.summary}
                </p>
              </div>

              {properties.length > 0 ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    EXPLORE PRODUCT SIGNALS
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {properties
                      .slice(0, 4)
                      .map((item, index) => {
                        const selected =
                          propertyFocus === index;

                        return (
                          <button
                            key={item.title}
                            type="button"
                            onMouseEnter={() =>
                              setPropertyFocus(index)
                            }
                            onFocus={() =>
                              setPropertyFocus(index)
                            }
                            onClick={() =>
                              setPropertyFocus(index)
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
              ) : null}
            </article>

            <article className="min-h-0 rounded-[22px] bg-[#f5f7fa] p-5 ring-1 ring-slate-200/60">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  KEY DETAILS
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
              <div className="relative min-h-0">
                <ProductSignal
                  entity={entity}
                  detail={detail}
                />

                {focusedProperty ? (
                  <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[13px] border border-white/10 bg-[#071b31]/80 p-3 text-white backdrop-blur-sm">
                    <p className="text-[9px] font-bold">
                      {focusedProperty.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-slate-300">
                      {focusedProperty.description}
                    </p>
                  </div>
                ) : null}
              </div>

              <article className="grid grid-cols-2 gap-3 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,.03)]">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    MANUFACTURER
                  </p>

                  <h3 className="mt-2 text-[15px] font-bold">
                    {detail?.manufacturer ??
                      "Not established"}
                  </h3>

                  {detail?.manufacturerHref ? (
                    <a
                      href={
                        detail.manufacturerHref
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700"
                    >
                      Official site
                      <Arrow />
                    </a>
                  ) : null}
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
            PRODUCT
        ================================================== */}

        {active === "product" ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.05fr_.95fr] lg:grid-rows-[1fr_.82fr]">

            {/* PROPERTIES */}
            <article className="min-h-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b2949] to-[#071b31] p-4 text-white shadow-[0_10px_30px_rgba(7,27,49,.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    PRODUCT PROPERTIES
                  </p>

                  <h3 className="mt-1 text-[16px] font-bold">
                    What defines the product
                  </h3>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] text-slate-300">
                  {properties.length} signals
                </span>
              </div>

              <div className="mt-3 grid h-[calc(100%-45px)] min-h-0 grid-cols-2 grid-rows-2 gap-2.5">
                {properties
                  .slice(0, 4)
                  .map((item, index) => {
                    const selected =
                      propertyFocus === index;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onMouseEnter={() =>
                          setPropertyFocus(index)
                        }
                        onFocus={() =>
                          setPropertyFocus(index)
                        }
                        onClick={() =>
                          setPropertyFocus(index)
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
                            <h4 className="text-[12px] font-bold leading-4 text-white">
                              {item.title}
                            </h4>

                            <p className="mt-1.5 text-[10px] leading-[1.45] text-slate-300">
                              {
                                item.description
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </article>

            {/* APPLICATIONS */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    APPLICATIONS
                  </p>

                  <h3 className="mt-1 text-[15px] font-bold">
                    Where it can be used
                  </h3>
                </div>

                <span className="text-[9px] text-slate-400">
                  Manufacturer context
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {applications
                  .slice(0, 4)
                  .map((item, index) => {
                    const selected =
                      applicationFocus === index;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onMouseEnter={() =>
                          setApplicationFocus(
                            index
                          )
                        }
                        onFocus={() =>
                          setApplicationFocus(
                            index
                          )
                        }
                        onClick={() =>
                          setApplicationFocus(
                            index
                          )
                        }
                        className={`group rounded-[13px] p-3 text-left transition-all duration-200 ${
                          selected
                            ? "bg-[#0b2949] text-white shadow-md"
                            : "bg-[#f5f7fa] hover:-translate-y-[2px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                        }`}
                      >
                        <p
                          className={`text-[8px] font-bold uppercase tracking-[0.13em] ${
                            selected
                              ? "text-blue-200"
                              : "text-blue-700"
                          }`}
                        >
                          APPLICATION
                        </p>

                        <p className="mt-1 text-[11px] font-bold">
                          {item.title}
                        </p>

                        {item.description ? (
                          <p
                            className={`mt-1 line-clamp-2 text-[9px] leading-4 ${
                              selected
                                ? "text-slate-300"
                                : "text-slate-500"
                            }`}
                          >
                            {
                              item.description
                            }
                          </p>
                        ) : null}
                      </button>
                    );
                  })}
              </div>

              {focusedApplication ? (
                <div className="mt-3 rounded-[13px] border border-slate-200 bg-[#fafbfc] p-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    ACTIVE APPLICATION
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-slate-700">
                    {
                      focusedApplication.title
                    }
                  </p>
                </div>
              ) : null}
            </article>

            {/* SUSTAINABILITY */}
            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f9fc] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  SUSTAINABILITY & CONTEXT
                </p>

                <span className="text-[9px] text-slate-400">
                  Source-backed claims
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {sustainability
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[13px] bg-white p-3 ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:shadow-sm"
                    >
                      <div className="mb-2 h-1 w-7 rounded-full bg-blue-700" />

                      <p className="text-[10px] font-bold">
                        {item.title}
                      </p>

                      <p className="mt-1 line-clamp-3 text-[9px] leading-4 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  ))}
              </div>
            </article>

            {/* EVIDENCE */}
            <article className="grid min-h-0 grid-cols-[1.25fr_.75fr] gap-3 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  EVIDENCE & SOURCES
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
                        className="group flex items-center justify-between gap-3 rounded-[12px] bg-[#f5f7fa] px-3 py-2.5 transition-all duration-200 hover:-translate-y-[1px] hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold text-slate-900">
                            {source.label}
                          </p>

                          <p className="text-[9px] text-slate-500">
                            {
                              source.organisation
                            }
                          </p>
                        </div>

                        <span className="shrink-0 text-blue-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </a>
                    ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-col justify-between rounded-[16px] bg-[#0b2949] p-4 text-white">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                    OFFICIAL SOURCE
                  </p>

                  <p className="mt-2 text-[13px] font-bold">
                    {detail?.manufacturer ??
                      "Manufacturer"}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-300">
                    Verify current product information with the originating source.
                  </p>
                </div>

                {detail?.officialUrl ? (
                  <a
                    href={detail.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-200"
                  >
                    Open source
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
                Product relationships
              </h3>

              <div className="relative mt-6 grid grid-cols-[.85fr_1.15fr_.95fr] items-center gap-3">
                <div className="absolute left-[16%] right-[16%] top-1/2 h-px bg-white/10" />

                <div className="relative z-10">
                  {detail?.manufacturer ? (
                    <a
                      href={
                        detail.manufacturerHref ??
                        "#"
                      }
                      target={
                        detail.manufacturerHref
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        detail.manufacturerHref
                          ? "noreferrer"
                          : undefined
                      }
                      className="block rounded-[14px] border border-white/10 bg-white/[0.07] p-3 transition hover:-translate-x-1 hover:bg-white/[0.12]"
                    >
                      <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                        MANUFACTURER
                      </p>

                      <p className="mt-1 text-[12px] font-bold">
                        {detail.manufacturer}
                      </p>
                    </a>
                  ) : null}
                </div>

                <div className="relative z-10 rounded-[18px] bg-white p-4 text-center text-slate-950 shadow-lg transition hover:scale-[1.025]">
                  <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    PRODUCT
                  </p>

                  <p className="mt-2 text-[16px] font-bold">
                    {entity.title}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    {detail?.subCategory ??
                      detail?.category ??
                      "Product"}
                  </p>
                </div>

                <div className="relative z-10 space-y-2">
                  {topics
                    .slice(0, 3)
                    .map((topic, index) => (
                      <div
                        key={topic}
                        className="rounded-[14px] border border-white/10 bg-white/[0.07] p-3 transition hover:translate-x-1 hover:bg-blue-300/10"
                      >
                        <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                          {index === 0
                            ? "MATERIAL"
                            : index === 1
                            ? "TOPIC"
                            : "CONTEXT"}
                        </p>

                        <p className="mt-1 text-[11px] font-bold">
                          {topic}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200">
                  ARKNOZ CONNECTION RULE
                </p>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Factual product relationships remain separate from discovery and future promoted visibility.
                </p>
              </div>
            </article>

            <article className="min-h-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_5px_22px_rgba(15,23,42,.035)]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    DISCOVER
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Explore more products
                  </h3>
                </div>

                <Link
                  href="/products"
                  className="group inline-flex items-center gap-1 text-[10px] font-bold text-blue-700"
                >
                  All products
                  <Arrow />
                </Link>
              </div>

              {moreProducts.length === 1 ? (
  <div className="mt-3 grid h-[calc(100%-48px)] min-h-0 gap-3 lg:grid-cols-[.72fr_1.28fr]">

    {/* ONE GENUINE RELATED PRODUCT */}
    <Link
      href={`/products/${moreProducts[0].slug}`}
      className="group flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-[#f8fafc] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(15,23,42,.10)]"
    >
      <div className="flex min-h-0 flex-1 flex-col justify-between bg-[#0b2949] p-4 text-white">
        <div>
          <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
            PRODUCT
          </p>

          <p className="mt-2 text-[14px] font-bold leading-5">
            {moreProducts[0].title}
          </p>

          <p className="mt-2 line-clamp-4 text-[9px] leading-4 text-slate-300">
            {moreProducts[0].summary}
          </p>
        </div>

        <div className="mt-5 flex h-12 items-end gap-1 opacity-35 transition-transform duration-300 group-hover:scale-105">
          <div className="h-5 w-5 bg-current" />
          <div className="h-9 w-5 bg-current" />
          <div className="h-7 w-5 bg-current" />
          <div className="h-11 w-5 bg-current" />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between bg-white p-3">
        <span className="text-[9px] font-semibold text-slate-500">
          View product
        </span>

        <span className="text-blue-700 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>

    {/* DISCOVERY LENS — NOT A FAKE PRODUCT */}
    <div className="grid min-h-0 grid-rows-[1fr_auto] gap-3">

      <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#eef4fa] to-[#dce9f6] p-5">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(11,41,73,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.12) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
              DISCOVERY LENS
            </p>

            <h4 className="mt-2 text-[19px] font-bold text-[#0b2949]">
              Explore the product context
            </h4>

            <p className="mt-2 max-w-md text-[10px] leading-5 text-slate-600">
              Discover connected materials, applications and Built World topics as genuine Arknoz records become available.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {topics.slice(0, 3).map((topic, index) => (
              <div
                key={topic}
                className="rounded-[12px] bg-white/75 p-3 ring-1 ring-white transition hover:-translate-y-[1px] hover:bg-white"
              >
                <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-blue-700">
                  {index === 0
                    ? "MATERIAL"
                    : index === 1
                    ? "TOPIC"
                    : "CONTEXT"}
                </p>

                <p className="mt-1 text-[10px] font-bold text-slate-900">
                  {topic}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[15px] border border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-blue-700">
            ARKNOZ RULE
          </p>

          <p className="mt-1 text-[9px] text-slate-500">
            Only genuine related products are displayed.
          </p>
        </div>

        <Link
          href="/products"
          className="text-[10px] font-bold text-blue-700"
        >
          Browse all →
        </Link>
      </div>
    </div>
  </div>
) : moreProducts.length > 1 ? (
  <div
    className={`mt-3 grid h-[calc(100%-48px)] gap-3 ${
      moreProducts.length === 2
        ? "grid-cols-2"
        : "grid-cols-3"
    }`}
  >
    {moreProducts.slice(0, 3).map((item, index) => (
      <Link
        key={item.slug}
        href={`/products/${item.slug}`}
        className="group flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-slate-200 bg-[#f8fafc] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(15,23,42,.10)]"
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
              PRODUCT
            </p>

            <p className="mt-2 text-[13px] font-bold leading-5">
              {item.title}
            </p>

            <p
              className={`mt-2 line-clamp-3 text-[9px] leading-4 ${
                index === 0
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              {item.summary}
            </p>
          </div>

          <div className="mt-4 flex h-10 items-end gap-1 opacity-35 transition-transform group-hover:scale-105">
            <div className="h-5 w-5 bg-current" />
            <div className="h-8 w-5 bg-current" />
            <div className="h-6 w-5 bg-current" />
            <div className="h-10 w-5 bg-current" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-3">
          <span className="text-[9px] font-semibold text-slate-500">
            View product
          </span>

          <span className="text-blue-700 transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    ))}
  </div>
) : (
  <div className="mt-3 flex h-[calc(100%-48px)] items-center justify-center rounded-[18px] bg-[#f6f8fb] p-6 text-center">
    <div>
      <p className="text-sm font-bold text-slate-900">
        More products will appear here as genuine Arknoz records are connected.
      </p>

      <p className="mt-2 text-[10px] text-slate-500">
        Arknoz does not fabricate related products to fill the interface.
      </p>
    </div>
  </div>
)}
            </article>
          </div>
        ) : null}

        {/* ==================================================
            DEEP — SUBSCRIBER PREVIEW ONLY
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
                    Original Arknoz work developed through structured data, contextual analysis, review and connected Built World knowledge.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Data Intelligence",
                    "Product Analysis",
                    "Arknoz Review",
                    "Advanced Connections",
                    "Product Comparison",
                    "Professional Insights",
                  ].map((item) => (
                    <div
                      key={item}
                      title="Available to Arknoz Pro subscribers"
                      aria-disabled="true"
                      className="cursor-not-allowed rounded-[13px] border border-white/10 bg-white/[0.06] px-3 py-3 opacity-85 transition hover:bg-white/[0.09]"
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
                    "Structured data intelligence",
                    "Arknoz product analysis",
                    "Contextual review and interpretation",
                    "Connected Built World comparisons and insights",
                  ].map(
                    (item, index) => (
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
                    Public product information stays free. Arknoz Deep is available to Pro subscribers.
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
        @keyframes arkProductTabIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ark-product-tab {
          animation: arkProductTabIn
            220ms ease-out both;
        }
      `}</style>
    </div>
  );
}

