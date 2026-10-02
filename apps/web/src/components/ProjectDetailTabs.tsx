"use client";

import styles from "./ProjectDetailTabs.module.css";
import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import type { EntityRecord } from "@/lib/entities";
import ArknozPlacementSlot from "@/components/ArknozPlacementSlot";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="5.5" y="8.5" width="9" height="7" rx="1.7" />
      <path d="M7.5 8.5V6.5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

export default function ProjectDetailTabs({
  entity,
  candidatePreview = false,
}: {
  entity: EntityRecord;
  candidatePreview?: boolean;
}) {
  const p = entity.project;

  const facts = p?.facts ?? [];
  const media = p?.media ?? [];
  const anatomy = p?.anatomy ?? [];
  const people = p?.people ?? [];
  const timeline = p?.timeline ?? [];
  const sources = p?.sources ?? [];
  const connections = p?.connections ?? [];
  const learning = p?.learning ?? [];
  const topics = p?.topics ?? [];

  const heroMedia =
    media.find((item) => item.role === "hero") ??
    media[0];

  const headlineFacts = (
    p?.signature?.length
      ? p.signature
      : facts.slice(0, 4)
  ).slice(0, 4);

  // The hero is a summary. Detailed project modules must remain complete.
  // Never suppress genuine project information just because it appears above.
  const detailFacts = facts;
  const detailTimeline = timeline;
  const detailPeople = people;

  // Universal project profile.
  // Core identity comes from the entity/project record and all additional
  // fields remain data-driven. No Sydney-specific assumptions.
  const projectProfileFacts = [
    ...(p?.category
      ? [{ label: "Project type", value: p.category }]
      : []),
    ...(entity.geography
      ? [{ label: "Location", value: entity.geography }]
      : []),
    ...facts,
  ].filter(
    (fact, index, all) =>
      String(fact.value).trim().length > 0 &&
      all.findIndex(
        (candidate) =>
          `${candidate.label}::${candidate.value}`
            .trim()
            .toLowerCase() ===
          `${fact.label}::${fact.value}`
            .trim()
            .toLowerCase()
      ) === index
  );
  const overviewPhotos = media
    .filter(
      (item) =>
        item !== heroMedia &&
        item.src &&
        !["diagram", "drawing", "document"].includes(
          (item.role ?? "").toLowerCase()
        )
    )
    .slice(0, 8);

  const overviewDrawings = media
    .filter(
      (item) =>
        item !== heroMedia &&
        item.src &&
        ["diagram", "drawing", "document"].includes(
          (item.role ?? "").toLowerCase()
        )
    )
    .slice(0, 8);

  const relatedProjects = connections
    .filter((item) =>
      (item.type ?? "")
        .toLowerCase()
        .includes("project")
    )
    .slice(0, 6);

  const otherConnections = connections.filter(
    (item) =>
      !(item.type ?? "")
        .toLowerCase()
        .includes("project")
  );

  // ARKNOZ_PROJECT_INTERACTION_V4
  //
  // Current Arknoz premium access surface.
  // Keep the Arknoz Pro destination centralized here.
  const proAccessHref =
    "/intelligence";

  const connectionHref = (
    item: (typeof otherConnections)[number]
  ) => {
    const href =
      (item.href || "").trim();

    // Preserve genuine external destinations.
    if (/^https?:\/\//i.test(href)) {
      return href;
    }

    // Preserve specific Arknoz entity/detail destinations.
    if (
      href &&
      ![
        "/global",
        "/knowledge",
        "/places",
        "/people",
        "/organisations",
        "/products",
        "/projects",
      ].includes(href)
    ) {
      return href;
    }

    // Generic section links are not precise enough.
    // Send the user to an exact Arknoz search instead.
    return `/search?q=${encodeURIComponent(
      item.title
    )}`;
  };

  const connectionTypeCounts = Array.from(
    otherConnections.reduce(
      (counts, item) => {
        const type =
          (item.type || "Connection").trim() ||
          "Connection";

        counts.set(
          type,
          (counts.get(type) ?? 0) + 1
        );

        return counts;
      },
      new Map<string, number>()
    )
  );

  const rawStory = p?.understanding?.trim() || "";

  // Candidate/admin workflow text is not public editorial content.
  const projectStory =
    /^gold master research candidate/i.test(rawStory)
      ? ""
      : rawStory;

  const projectDetailHref =
    detailFacts.length > 0
      ? "#project-data"
      : anatomy.length > 0
        ? "#systems-materials"
        : detailPeople.length > 0
          ? "#project-team"
          : detailTimeline.length > 0
            ? "#timeline"
            : "#project-data";

  const projectIndex = useMemo<
    {
      label: string;
      href: string;
      locked?: boolean;
    }[]
  >(
    () => [
      {
        label: "Overview",
        href: "#project-overview",
      },
      {
        label: "Media",
        href: "#gallery",
      },
      {
        label: "Details",
        href: projectDetailHref,
      },
      {
        label: "Sources",
        href: "#evidence",
      },
      {
        label: "Arknoz Lens",
        href: "#deep-analysis",
        locked: true,
      },
      {
        label: "Connections",
        href: "#connected-world",
        locked: true,
      },
      {
        label: "Partner Network",
        href: "#partner-network",
      },
    ],
    [projectDetailHref]
  );
  const analysisModules = [
    "Technical Analysis",
    "Performance",
    "Engineering Lessons",
    "Comparison",
    "Risks & Opportunities",
    "Arknoz Review",
  ];


  const [activeSection, setActiveSection] =
    useState(
      projectIndex[0]?.href.replace(
        /^#/,
        ""
      ) || ""
    );

  useEffect(() => {
    const navTarget = (
      label: string
    ) =>
      projectIndex
        .find(
          (item) =>
            item.label === label
        )
        ?.href.replace(/^#/, "") ||
      "";

    const overviewTarget =
      navTarget("Overview");

    const mediaTarget =
      navTarget("Media");

    const detailTarget =
      navTarget("Details");

    const sourcesTarget =
      navTarget("Sources");

    const lensTarget =
      navTarget("Arknoz Lens");

    const connectionsTarget =
      navTarget("Connections");

    const partnerTarget =
      navTarget("Partner Network");

    const sectionMap =
      new Map<string, string>();

    if (overviewTarget) {
      sectionMap.set(
        "project-overview",
        overviewTarget
      );

      sectionMap.set(
        "project-story",
        overviewTarget
      );
    }

    if (mediaTarget) {
      sectionMap.set(
        "gallery",
        mediaTarget
      );

      sectionMap.set(
        "drawings",
        mediaTarget
      );
    }

    const effectiveDetailTarget =
      detailTarget ||
      overviewTarget;

    if (effectiveDetailTarget) {
      [
        "project-data",
        "systems-materials",
        "project-team",
        "timeline",
      ].forEach((id) =>
        sectionMap.set(
          id,
          effectiveDetailTarget
        )
      );
    }

    if (sourcesTarget) {
      sectionMap.set(
        "evidence",
        sourcesTarget
      );
    }

    if (lensTarget) {
      sectionMap.set(
        "deep-analysis",
        lensTarget
      );
    }

    if (connectionsTarget) {
      sectionMap.set(
        "connected-world",
        connectionsTarget
      );

      sectionMap.set(
        "related-projects",
        connectionsTarget
      );
    }

    if (partnerTarget) {
      sectionMap.set(
        "partner-network",
        partnerTarget
      );
    }

    const orderedIds = [
      "project-overview",
      "project-story",
      "gallery",
      "drawings",
      "project-data",
      "systems-materials",
      "project-team",
      "timeline",
      "evidence",
      "deep-analysis",
      "connected-world",
      "related-projects",
      "partner-network",
    ];
    const sections =
      orderedIds
        .map((id) =>
          document.getElementById(id)
        )
        .filter(
          (element): element is HTMLElement =>
            element !== null
        )
        .filter(
          (element) =>
            sectionMap.has(
              element.id
            )
        );

    const updateActive = () => {
      const marker = 175;

      let current:
        | HTMLElement
        | undefined =
          sections[0];

      for (const section of sections) {
        const top =
          section
            .getBoundingClientRect()
            .top;

        if (top <= marker) {
          current = section;
        }
      }

      if (!current) {
        return;
      }

      const next =
        sectionMap.get(
          current.id
        );

      if (next) {
        setActiveSection(next);
      }
    };

    updateActive();

    window.addEventListener(
      "scroll",
      updateActive,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActive
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateActive
      );

      window.removeEventListener(
        "resize",
        updateActive
      );
    };
  }, [projectIndex]);

  return (
    <div className={styles.root}>
      <div
        id="project-overview"
        className="scroll-mt-[92px]"
        aria-hidden="true"
      />

      <nav
        aria-label="Project sections"
        className="hidden"
      >
        <div className="flex min-h-[62px] items-center gap-4">
          <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700 xl:block">
            Project workspace
          </span>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-slate-200 bg-slate-200 sm:grid-cols-4 xl:grid-cols-7">
            {projectIndex.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                data-active={
                  activeSection ===
                  item.href.replace(/^#/, "")
                    ? "true"
                    : "false"
                }
                aria-current={
                  activeSection ===
                  item.href.replace(/^#/, "")
                    ? "location"
                    : undefined
                }
                onClick={() =>
                  setActiveSection(
                    item.href.replace(/^#/, "")
                  )
                }
                className="group flex min-h-[42px] min-w-0 items-center gap-2 bg-white px-3 py-2 transition hover:bg-[#f5f8fb]"
              >
                <span className="shrink-0 text-[11px] font-semibold text-slate-400 transition group-hover:text-blue-700">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-slate-700 transition group-hover:text-slate-950">
                  {item.label}
                </span>

                {item.locked ? (
                  <span
                    className="shrink-0 text-slate-400"
                    aria-label="Arknoz Pro"
                    title="Arknoz Pro"
                  >
                    <LockIcon />
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <div className="space-y-4 py-4">

      {/* ==================================================
          OVERVIEW — SCREEN 02
      ================================================== */}

      {projectStory ? (
        <section
          id="project-story"
          className="scroll-mt-[92px] relative min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white"
        >
          <div className="grid min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] lg:grid-cols-[0.72fr_1.28fr]">

            <div className="relative flex flex-col justify-between overflow-hidden lg:min-h-0 lg:min-h-0 lg:min-h-0 bg-[#071b31] p-7 text-white lg:p-10">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                  backgroundSize: "54px 54px",
                }}
              />

              <div className="relative">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-300">
                  02 / Overview
                </p>

                <h2 className="mt-8 max-w-lg text-[44px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[56px]">
                  Why this project matters
                </h2>
              </div>

              <div className="relative mt-20 border-t border-white/20 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-white/45">
                  Arknoz Project Record
                </p>

                <p className="mt-3 max-w-sm text-[14px] leading-6 text-white/65">
                  A concise understanding of the project before moving into media, technical details, evidence and deeper analysis.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-7 lg:p-10 xl:p-12">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                  Project understanding
                </p>

                <p className="mt-8 max-w-4xl text-[24px] font-medium leading-[1.55] tracking-[-0.02em] text-slate-800 lg:text-[28px]">
                  {projectStory}
                </p>

                {(p?.visualStatement || p?.strapline) ? (
                  <div className="mt-10 max-w-3xl border-l-2 border-blue-700 pl-6">
                    <p className="text-[17px] font-medium leading-8 text-slate-950">
                      {p?.visualStatement ?? p?.strapline}
                    </p>
                  </div>
                ) : null}
              </div>

              {headlineFacts.length > 0 ? (
                <div className="mt-14 border-t border-slate-200 pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                    Project snapshot
                  </p>

                  <div
                    className={`mt-5 grid gap-px overflow-hidden rounded-[14px] border border-slate-200 bg-slate-200 sm:grid-cols-2 ${
                      headlineFacts.length >= 4
                        ? "xl:grid-cols-4"
                        : headlineFacts.length === 3
                          ? "xl:grid-cols-3"
                          : headlineFacts.length === 2
                            ? "xl:grid-cols-2"
                            : "xl:grid-cols-1"
                    }`}
                  >
                    {headlineFacts.map((fact) => (
                      <div
                        key={`${fact.label}-${fact.value}`}
                        className="bg-[#f8fafc] p-5"
                      >
                        <p className="text-[17px] font-semibold leading-6 text-slate-950">
                          {fact.value}
                        </p>

                        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.10em] text-slate-400">
                          {fact.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* ==================================================
          MEDIA — SCREEN 03
      ================================================== */}

      <section
        id="gallery"
        className="scroll-mt-[92px] relative min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] overflow-hidden rounded-[28px] border border-slate-200 bg-[#f7f9fc]"
      >
        <div className="grid min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] lg:grid-cols-[0.72fr_1.28fr]">

          <div className="relative flex flex-col justify-between overflow-hidden lg:min-h-0 lg:min-h-0 lg:min-h-0 bg-[#123d68] p-7 text-white lg:p-10">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div className="relative">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                03 / Media
              </p>

              <h2 className="mt-8 max-w-lg text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[58px]">
                Visual record
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/65">
                Verified project photography, drawings and technical material associated with this record.
              </p>
            </div>

            <ArknozPlacementSlot
              slotKey="project.media.left-middle"
              tone="dark"
              fallback={{
                placementType: "related",
                eyebrow: "Explore further",
                label: "Knowledge",
                title: "Understand the evidence behind the visual record",
                description:
                  "Explore methods, case studies and technical knowledge across the Built World.",
                href: "/knowledge",
                cta: "Explore Knowledge",
              }}
              className="relative my-5"
            />
            <div className="relative mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/15 bg-white/15">
              <div className="bg-[#123d68]/90 p-5">
                <p className="text-[30px] font-semibold leading-none">
                  {String(overviewPhotos.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                  Verified images
                </p>
              </div>

              <div className="bg-[#123d68]/90 p-5">
                <p className="text-[30px] font-semibold leading-none">
                  {String(overviewDrawings.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                  Technical sheets
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 lg:min-h-0 lg:overflow-y-auto lg:p-10 xl:p-12">

            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                    Photography
                  </p>

                  <h3 className="mt-2 text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
                    Project views
                  </h3>
                </div>

                {overviewPhotos.length > 0 ? (
                  <span className="text-[12px] text-slate-400">
                    {overviewPhotos.length} verified images
                  </span>
                ) : null}
              </div>

              {overviewPhotos.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
                  {overviewPhotos.map((item, index) => (
                    <figure
                      key={`${item.src}-${index}`}
                      className="min-w-0"
                    >
                      <a
                        href={`#project-photo-${index}`}
                        className="group relative block overflow-hidden rounded-[16px] bg-slate-100"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={item.src}
                            alt={
                              item.alt ??
                              `${entity.title} project image`
                            }
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                          />
                        </div>

                        <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                          Enlarge
                        </span>
                      </a>

                      {(item.role || item.attribution) ? (
                        <figcaption className="mt-2 text-[11px] leading-4 text-slate-500">
                          <span className="font-medium capitalize text-slate-700">
                            {item.role ?? "Project image"}
                          </span>

                          {item.attribution ? (
                            <span className="ml-2">
                              {item.attribution}
                            </span>
                          ) : null}
                        </figcaption>
                      ) : null}

                      <div
                        id={`project-photo-${index}`}
                        className="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-950/95 p-4 target:flex md:p-8"
                      >
                        <div className="relative flex max-h-full w-full max-w-6xl flex-col items-center">
                          <a
                            href="#gallery"
                            aria-label="Close enlarged image"
                            className="absolute right-0 top-0 z-20 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-slate-950 shadow"
                          >
                            Close
                          </a>

                          <img
                            src={item.src}
                            alt={
                              item.alt ??
                              `${entity.title} project image`
                            }
                            className="max-h-[82vh] max-w-full object-contain"
                          />

                          {(item.role || item.attribution) ? (
                            <p className="mt-3 max-w-4xl text-center text-[12px] text-white/70">
                              {item.role ?? "Project image"}
                              {item.attribution
                                ? ` · ${item.attribution}`
                                : ""}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex min-h-[230px] items-center rounded-[20px] border border-dashed border-slate-300 bg-white p-7">
                  <div>
                    <p className="text-[18px] font-semibold text-slate-950">
                      No verified project photography yet.
                    </p>

                    <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-500">
                      Images will appear only after source, provenance and reuse-rights checks are complete.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div
              id="drawings"
              className="scroll-mt-[92px] mt-12 border-t border-slate-200 pt-9"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                    Technical material
                  </p>

                  <h3 className="mt-2 text-[30px] font-semibold tracking-[-0.035em] text-slate-950">
                    Plans, sections & drawings
                  </h3>
                </div>

                {overviewDrawings.length > 0 ? (
                  <span className="text-[12px] text-slate-400">
                    {overviewDrawings.length} verified sheets
                  </span>
                ) : null}
              </div>

              {overviewDrawings.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
                  {overviewDrawings.map((item, index) => (
                    <figure
                      key={`${item.src}-${index}`}
                      className="min-w-0"
                    >
                      <a
                        href={`#project-drawing-${index}`}
                        className="group relative block overflow-hidden rounded-[16px] border border-slate-200 bg-white"
                      >
                        <div className="aspect-[4/3] p-4">
                          <img
                            src={item.src}
                            alt={
                              item.alt ??
                              `${entity.title} project drawing`
                            }
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.025]"
                          />
                        </div>

                        <span className="absolute bottom-3 right-3 rounded-full bg-[#0b2949]/90 px-3 py-1.5 text-[11px] font-semibold text-white">
                          Enlarge
                        </span>
                      </a>

                      {(item.role || item.attribution) ? (
                        <figcaption className="mt-2 text-[11px] leading-4 text-slate-500">
                          <span className="font-medium capitalize text-slate-800">
                            {item.role ?? "Project drawing"}
                          </span>

                          {item.attribution ? (
                            <span className="ml-2">
                              {item.attribution}
                            </span>
                          ) : null}
                        </figcaption>
                      ) : null}

                      <div
                        id={`project-drawing-${index}`}
                        className="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-950/95 p-4 target:flex md:p-8"
                      >
                        <div className="relative flex max-h-full w-full max-w-7xl flex-col items-center">
                          <a
                            href="#drawings"
                            aria-label="Close enlarged drawing"
                            className="absolute right-0 top-0 z-20 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-slate-950 shadow"
                          >
                            Close
                          </a>

                          <div className="flex max-h-[82vh] max-w-full items-center justify-center rounded-[8px] bg-white p-4">
                            <img
                              src={item.src}
                              alt={
                                item.alt ??
                                `${entity.title} project drawing`
                              }
                              className="max-h-[78vh] max-w-full object-contain"
                            />
                          </div>

                          {(item.role || item.attribution) ? (
                            <p className="mt-3 max-w-4xl text-center text-[12px] text-white/70">
                              {item.role ?? "Project drawing"}
                              {item.attribution
                                ? ` · ${item.attribution}`
                                : ""}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex min-h-[190px] items-center rounded-[20px] border border-dashed border-slate-300 bg-white p-7">
                  <div>
                    <p className="text-[18px] font-semibold text-slate-950">
                      No verified technical drawings yet.
                    </p>

                    <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-500">
                      Technical material will appear only after evidence and reuse-rights checks are cleared.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          DETAILS — SCREEN 04
      ================================================== */}

      <section
        id="project-data"
        className="scroll-mt-[92px] relative min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white"
      >
        <div className="grid min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] lg:grid-cols-[0.72fr_1.28fr]">

          <div className="relative flex flex-col justify-between overflow-hidden lg:min-h-0 lg:min-h-0 lg:min-h-0 bg-[#15261f] p-7 text-white lg:p-10">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div className="relative">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                04 / Details
              </p>

              <h2 className="mt-8 max-w-lg text-[44px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[56px]">
                How the project is put together
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/65">
                Recorded project facts, systems, organisations and development history in one structured view.
              </p>
            </div>

            <ArknozPlacementSlot
              slotKey="project.details.left-middle"
              tone="dark"
              fallback={{
                placementType: "related",
                eyebrow: "Explore further",
                label: "Products & systems",
                title: "Discover materials, systems and technologies",
                description:
                  "Continue into products and systems used across the Built World.",
                href: "/products",
                cta: "Explore Products",
              }}
              className="relative my-5"
            />
            <div className="relative mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/15 bg-white/15">
              <div className="bg-[#15261f]/90 p-5">
                <p className="text-[28px] font-semibold leading-none">
                  {String(projectProfileFacts.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                  Recorded fields
                </p>
              </div>

              <div className="bg-[#15261f]/90 p-5">
                <p className="text-[28px] font-semibold leading-none">
                  {String(anatomy.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                  Systems
                </p>
              </div>

              <div className="bg-[#15261f]/90 p-5">
                <p className="text-[28px] font-semibold leading-none">
                  {String(detailPeople.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                  Team records
                </p>
              </div>

              <div className="bg-[#15261f]/90 p-5">
                <p className="text-[28px] font-semibold leading-none">
                  {String(detailTimeline.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                  Timeline events
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 lg:min-h-0 lg:overflow-y-auto lg:p-10 xl:p-12">

            {projectProfileFacts.length > 0 ? (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-emerald-700">
                      Project essentials
                    </p>

                    <h3 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-slate-950">
                      Project profile
                    </h3>
                  </div>

                  <span className="text-[12px] text-slate-400">
                    {projectProfileFacts.length} recorded fields
                  </span>
                </div>

                <dl className="mt-6 grid gap-px overflow-hidden rounded-[16px] border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
                  {projectProfileFacts.slice(0, 24).map((fact) => (
                    <div
                      key={`${fact.label}-${fact.value}`}
                      className="min-w-0 bg-[#f8fafc] p-5"
                    >
                      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
                        {fact.label}
                      </dt>

                      <dd className="mt-3 break-words text-[16px] font-semibold leading-6 text-slate-950">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="flex min-h-[220px] items-center rounded-[20px] border border-dashed border-slate-300 bg-[#f8fafc] p-7">
                <div>
                  <p className="text-[18px] font-semibold text-slate-950">
                    No verified project profile yet.
                  </p>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-500">
                    Structured project information will appear as verified fields become available.
                  </p>
                </div>
              </div>
            )}

            {anatomy.length > 0 ? (
              <div
                id="systems-materials"
                className="scroll-mt-[92px] mt-12 border-t border-slate-200 pt-9"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-emerald-700">
                  Design & engineering
                </p>

                <h3 className="mt-2 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950">
                  Systems, materials and construction
                </h3>

                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  {anatomy.map((item, index) => (
                    <article
                      key={`${item.title}-${index}`}
                      className="rounded-[18px] border border-slate-200 bg-[#f8fafc] p-5"
                    >
                      <span className="text-[12px] font-semibold text-emerald-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h4 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-slate-950">
                        {item.title}
                      </h4>

                      <p className="mt-3 text-[14px] leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {detailPeople.length > 0 ? (
              <div
                id="project-team"
                className="scroll-mt-[92px] mt-12 border-t border-slate-200 pt-9"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-emerald-700">
                      People & organisations
                    </p>

                    <h3 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-slate-950">
                      Project team
                    </h3>
                  </div>

                  <span className="text-[12px] text-slate-400">
                    {detailPeople.length} recorded
                  </span>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {detailPeople.map((item) => (
                    <article
                      key={`${item.role}-${item.name}`}
                      className="rounded-[16px] border border-slate-200 bg-[#f8fafc] p-5"
                    >
                      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
                        {item.role}
                      </p>

                      <p className="mt-3 text-[16px] font-semibold leading-6 text-slate-950">
                        {item.name}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {detailTimeline.length > 0 ? (
              <div
                id="timeline"
                className="scroll-mt-[92px] mt-12 border-t border-slate-200 pt-9"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-emerald-700">
                  Timeline
                </p>

                <h3 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-slate-950">
                  Project evolution
                </h3>

                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {detailTimeline.map((item) => (
                    <article
                      key={`${item.date}-${item.title}`}
                      className="border-t border-slate-300 pt-5"
                    >
                      <p className="text-[13px] font-semibold text-emerald-700">
                        {item.date}
                      </p>

                      <h4 className="mt-4 text-[19px] font-semibold text-slate-950">
                        {item.title}
                      </h4>

                      {item.description ? (
                        <p className="mt-3 text-[14px] leading-6 text-slate-600">
                          {item.description}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

          </div>
        </div>
      </section>

      {/* ==================================================
          ARTICLES
      ================================================== */}

      {learning.length > 0 ? (
        <section
          id="articles"
          className="scroll-mt-[92px] rounded-[18px] border border-slate-200 bg-white p-4 lg:p-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                Articles & publications
              </p>

              <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.025em] text-slate-950">
                Related reading
              </h2>
            </div>

            <span className="text-[12px] text-slate-400">
              {learning.length} references
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {learning.map((item, index) => (
              <Link
                key={`${item.title}-${item.href}`}
                href={item.href}
                className="group flex min-h-[112px] flex-col justify-between rounded-[12px] border border-slate-200 bg-[#f8fafc] p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-[14px] text-blue-700">
                    ↗
                  </span>
                </div>

                <p className="mt-5 text-[14px] font-semibold leading-5 text-slate-950 transition group-hover:text-blue-700">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ==================================================
          SOURCES — SCREEN 05
      ================================================== */}

      <section
        id="evidence"
        className="scroll-mt-[92px] relative min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white"
      >
        <div className="grid min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] lg:grid-cols-[0.72fr_1.28fr]">

          <div className="relative flex flex-col justify-between overflow-hidden lg:min-h-0 lg:min-h-0 lg:min-h-0 bg-[#2b3440] p-7 text-white lg:p-10">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div className="relative">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                05 / Sources
              </p>

              <h2 className="mt-8 max-w-lg text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[58px]">
                Where this record comes from
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/65">
                Source evidence and provenance used to support the factual project record.
              </p>
            </div>

            <ArknozPlacementSlot
              slotKey="project.sources.left-middle"
              tone="dark"
              fallback={{
                placementType: "related",
                eyebrow: "Evidence",
                label: "Standards & references",
                title: "Go deeper into source-backed knowledge",
                description:
                  "Explore standards, references and methods connected to the Built World.",
                href: "/knowledge/standards-references",
                cta: "Explore references",
              }}
              className="relative my-5"
            />
            <div className="relative mt-20">
              <div className="border-t border-white/20 pt-6">
                <p className="text-[38px] font-semibold leading-none">
                  {String(sources.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Linked sources
                </p>
              </div>

              <div className="mt-7 rounded-[14px] border border-white/15 bg-white/[0.06] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Record status
                </p>

                <p className="mt-3 text-[14px] font-medium leading-6 text-white/80">
                  {entity.trust?.toLowerCase().includes("draft")
                    ? "Source-backed draft"
                    : candidatePreview
                      ? "Candidate record"
                      : "Published record"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-[#fbf7f8] p-7 text-slate-950 lg:min-h-0 lg:overflow-y-auto lg:p-10 xl:p-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                  Evidence trail
                </p>

                <h3 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-slate-950">
                  Provenance
                </h3>
              </div>

              {sources.length > 0 ? (
                <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5 text-[11px] font-medium text-slate-500">
                  {sources.length} linked source{sources.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>

            <p className="mt-5 max-w-3xl text-[14px] leading-7 text-slate-600">
              Arknoz keeps source material separate from its own structured record and editorial synthesis so users can trace information back to its origin.
            </p>

            {sources.length > 0 ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {sources.map((source, index) => (
                  <a
                    key={`${source.label}-${source.href}`}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-[180px] flex-col justify-between rounded-[18px] border border-slate-200 bg-[#f8fafc] p-5 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[12px] font-semibold text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-[15px] text-slate-500 transition group-hover:text-slate-950">
                        ↗
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-[18px] font-semibold leading-6 tracking-[-0.015em] text-slate-950 transition group-hover:text-blue-700">
                        {source.label}
                      </p>

                      {source.organisation ? (
                        <p className="mt-2 text-[12px] leading-5 text-slate-500">
                          {source.organisation}
                        </p>
                      ) : null}

                      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.10em] text-slate-400">
                        View original source
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex min-h-[320px] items-center rounded-[20px] border border-dashed border-slate-300 bg-[#f8fafc] p-7">
                <div>
                  <p className="text-[18px] font-semibold text-slate-950">
                    No verified sources are linked yet.
                  </p>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-500">
                    Source references will appear here only after provenance and verification checks are complete.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ==================================================
          ARKNOZ LENS — SCREEN 06
      ================================================== */}

      <section
        id="deep-analysis"
        className="scroll-mt-[92px] relative min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] overflow-hidden rounded-[28px] border border-[#d7bcc7] bg-[#fbf7f8]"
      >
        <div className="grid min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] lg:grid-cols-[0.72fr_1.28fr]">

          <div className="relative flex flex-col justify-between overflow-hidden lg:min-h-0 lg:min-h-0 lg:min-h-0 bg-[#4b1e31] p-7 text-white lg:p-10">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#efbfd0]">
                  06 / Arknoz Lens
                </p>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.10em] text-white/75">
                  <LockIcon />
                  Pro
                </span>
              </div>

              <h2 className="mt-8 max-w-lg text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[58px]">
                Go beyond the project record
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/65">
                Deeper interpretation, technical understanding, comparison and Arknoz analysis built on top of the verified project record.
              </p>
            </div>

            <ArknozPlacementSlot
              slotKey="project.lens.left-middle"
              tone="dark"
              fallback={{
                placementType: "pro",
                eyebrow: "Arknoz Pro",
                label: "Deeper intelligence",
                title: "Unlock the full Arknoz Lens",
                description:
                  "Access deeper interpretation, comparison and professional intelligence built on verified project data.",
                href: "/join",
                cta: "Explore Arknoz Pro",
              }}
              className="relative my-5"
            />
            <div className="relative mt-20">
              <div className="border-t border-white/20 pt-6">
                <p className="text-[38px] font-semibold leading-none">
                  {String(analysisModules.length).padStart(2, "0")}
                </p>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Pro analysis modules
                </p>
              </div>

              <Link
                href={proAccessHref}
                aria-label="Explore Arknoz Pro"
                className="group mt-7 inline-flex items-center gap-3 rounded-[12px] border border-white/20 bg-white/[0.06] px-4 py-3 text-[12px] font-medium transition hover:border-white/40 hover:bg-white/[0.10]"
              >
                <LockIcon />

                <span>
                  Arknoz Pro · Coming Later
                </span>

                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col bg-[#fbf7f8] p-7 text-slate-950 lg:min-h-0 lg:overflow-y-auto lg:p-10 xl:p-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8a3c5d]">
                Deeper analysis
              </p>

              <h3 className="mt-2 max-w-3xl text-[32px] font-semibold tracking-[-0.035em] text-slate-950">
                Six ways to understand the project further
              </h3>

              <p className="mt-5 max-w-3xl text-[14px] leading-7 text-slate-600">
                Arknoz Lens is separate from the factual record. It provides interpretation and comparative analysis rather than replacing source-backed project information.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {analysisModules.map((title, index) => (
                <Link
                  key={title}
                  href={proAccessHref}
                  aria-label={`Open Arknoz Pro — ${title}`}
                  className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-[18px] border border-[#e4d5db] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#b66d8c] hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] font-semibold text-[#9d5975]" style={{ color: "#9d5975" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[#8a3c5d]" style={{ color: "#8a3c5d" }}>
                      <LockIcon />
                    </span>
                  </div>

                  <div className="mt-8">
                    <p className="text-[19px] font-semibold leading-6 tracking-[-0.02em] text-slate-950" style={{ color: "#0f172a" }}>
                      {title}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.10em] text-[#8a3c5d]">
                      <span>
                        Arknoz Pro
                      </span>

                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          CONNECTIONS — SCREEN 07
      ================================================== */}

      <section
        id="connected-world"
        className="scroll-mt-[92px] relative min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] overflow-hidden rounded-[28px] border border-[#cbd7e3] bg-white"
      >
        <div className="grid min-h-[calc(100svh-88px)] lg:h-[calc(100svh-88px)] lg:min-h-0 lg:max-h-[calc(100svh-88px)] lg:grid-cols-[0.72fr_1.28fr]">

          <div className="relative flex flex-col justify-between overflow-hidden lg:min-h-0 lg:min-h-0 lg:min-h-0 bg-[#0b3154] p-7 text-white lg:p-10">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px)",
                backgroundSize: "54px 54px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                  07 / Connections
                </p>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.10em] text-white/75">
                  <LockIcon />
                  Pro
                </span>
              </div>

              <h2 className="mt-8 max-w-lg text-[46px] font-semibold leading-[0.98] tracking-[-0.045em] lg:text-[58px]">
                See the project as part of a connected world
              </h2>

              <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/65">
                People, organisations, products, knowledge, places and comparable projects connected through Arknoz.
              </p>
            </div>

            <ArknozPlacementSlot
              slotKey="project.connections.left-middle"
              tone="dark"
              fallback={{
                placementType: "related",
                eyebrow: "Connected Built World",
                label: "Explore",
                title: "Continue beyond this project",
                description:
                  "Discover connected people, organisations, products, knowledge, places and opportunities.",
                href: "/explore",
                cta: "Explore Arknoz",
              }}
              className="relative my-5"
            />
            <div className="relative mt-20">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/15 bg-white/15">
                <div className="bg-[#0b3154]/90 p-5">
                  <p className="text-[30px] font-semibold leading-none">
                    {String(otherConnections.length).padStart(2, "0")}
                  </p>

                  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                    Connections
                  </p>
                </div>

                <div className="bg-[#0b3154]/90 p-5">
                  <p className="text-[30px] font-semibold leading-none">
                    {String(connectionTypeCounts.length).padStart(2, "0")}
                  </p>

                  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/55">
                    Connection types
                  </p>
                </div>
              </div>

              <Link
                href={proAccessHref}
                aria-label="Unlock Arknoz Connections"
                className="group mt-7 inline-flex items-center gap-3 rounded-[12px] border border-white/20 bg-white/[0.06] px-4 py-3 text-[12px] font-medium transition hover:border-white/40 hover:bg-white/[0.10]"
              >
                <LockIcon />

                <span>
                  Unlock Connections
                </span>

                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col bg-[#f7f9fc] p-7 text-slate-950 lg:min-h-0 lg:overflow-y-auto lg:p-10 xl:p-12">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                Connected Built World
              </p>

              <h3 className="mt-2 max-w-3xl text-[32px] font-semibold tracking-[-0.035em] text-slate-950">
                Explore relationships around this project
              </h3>

              <p className="mt-5 max-w-3xl text-[14px] leading-7 text-slate-600">
                Arknoz only shows relationships supported by its records and project evidence.
              </p>
            </div>

            {otherConnections.length > 0 ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {otherConnections.map((item, index) => (
                  <Link
                    key={`${item.type}-${item.title}-${item.href}`}
                    href={proAccessHref}
                    aria-label={`Open Arknoz Pro — ${item.title}`}
                    className="group flex min-h-[170px] flex-col justify-between rounded-[18px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[12px] font-semibold text-blue-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-blue-700">
                        <LockIcon />
                      </span>
                    </div>

                    <div className="mt-7">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.10em] text-slate-400">
                        {item.type}
                      </p>

                      <p className="mt-2 text-[18px] font-semibold leading-6 text-slate-950">
                        {item.title}
                      </p>

                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500">
                          {item.description}
                        </p>
                      ) : null}

                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.10em] text-blue-700">
                        Arknoz Pro →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex min-h-[250px] items-center rounded-[20px] border border-dashed border-slate-300 bg-white p-7">
                <div>
                  <p className="text-[18px] font-semibold text-slate-950">
                    No recorded connections yet.
                  </p>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-500">
                    Connections will appear only when supported by Arknoz records and project evidence.
                  </p>
                </div>
              </div>
            )}

            {topics.length > 0 ? (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-slate-400">
                  Related topics
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              id="related-projects"
              className="scroll-mt-[92px] mt-10 border-t border-slate-200 pt-8"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                    Related projects
                  </p>

                  <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-slate-950">
                    Connected & comparable projects
                  </h3>
                </div>

                {relatedProjects.length > 0 ? (
                  <span className="text-[12px] text-slate-400">
                    {relatedProjects.length} recorded
                  </span>
                ) : null}
              </div>

              {relatedProjects.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {relatedProjects.map((item, index) => (
                    <Link
                      key={`${item.title}-${item.href}`}
                      href={proAccessHref}
                      aria-label={`Open Arknoz Pro — ${item.title}`}
                      className="group min-h-[150px] rounded-[16px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[12px] font-semibold text-blue-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="text-blue-700">
                          <LockIcon />
                        </span>
                      </div>

                      <h4 className="mt-6 text-[17px] font-semibold text-slate-950">
                        {item.title}
                      </h4>

                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500">
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-[13px] leading-6 text-slate-500">
                  No comparable projects are currently recorded for this project.
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      </div>
    </div>
  );
}
