"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export type UniversalOverviewFact = {
  label: string;
  value: string;
};

export type UniversalOverviewMedia = {
  src: string;
  alt?: string;
  attribution?: string;
  license?: string;
  sourceUrl?: string;
  rightsStatus?: string;
  provenanceStatus?: string;
};

export default function UniversalRecordOverview({
  typeLabel,
  title,
  arknozEntityId,
  strapline,
  summary,
  facts = [],
  media = [],
  visualLabel,
  contextLabel,
  contextHref,
  mediaLabel = "Media",
  recordDescriptor = "Factual orientation",
  provenanceLabel = "Factual record",
  mediaFit = "cover",
  sourceCount = 0,
  officialUrl,
  sourceLinkLabel = "Official source",

  continueHref,

  continueLabel = "Explore record",
}: {
  typeLabel: string;
  title: string;
  arknozEntityId?: string;
  strapline?: string;
  summary?: string;
  facts?: UniversalOverviewFact[];
  media?: UniversalOverviewMedia[];
  visualLabel?: string;
  contextLabel?: string;
  contextHref?: string;
  mediaLabel?: string;
  recordDescriptor?: string;
  provenanceLabel?: string;
  mediaFit?: "cover" | "contain";
  sourceCount?: number;
  officialUrl?: string;
  sourceLinkLabel?: string;

  continueHref?: string;

  continueLabel?: string;
}) {
  const [mediaIndex, setMediaIndex] =
    useState(0);

  const [mediaFocused, setMediaFocused] =
    useState(false);

  const touchStart =
    useRef<number | null>(
      null
    );

  const activeMedia =
    media[mediaIndex];

  const hasMedia =
    media.length > 0;

  const hasGallery =
    media.length > 1;


  const mediaIdentity =
    media[0]?.src ?? "";


  useEffect(() => {
    setMediaIndex(0);
    setMediaFocused(false);
  }, [
    mediaIdentity,
    media.length,
  ]);


  const previousMedia = () => {

    if (!hasGallery) {
      return;
    }

    setMediaIndex(
      (current) =>
        current === 0
          ? media.length - 1
          : current - 1
    );
  };


  const nextMedia = () => {

    if (!hasGallery) {
      return;
    }

    setMediaIndex(
      (current) =>
        current ===
        media.length - 1
          ? 0
          : current + 1
    );
  };


  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (!hasGallery) {
        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previousMedia();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        nextMedia();
      }

      if (
        event.key ===
        "Escape"
      ) {
        setMediaFocused(false);
      }
    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

  }, [
    hasGallery,
    media.length,
  ]);


  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      data-arknoz-record-overview
    >

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.04fr_.96fr]">

        {/* ==================================================
            UNIVERSAL INTERACTIVE MEDIA GALLERY
        ================================================== */}

        <div
          className="group relative min-h-[390px] overflow-hidden rounded-[22px] bg-[#0b2949] shadow-[0_8px_28px_rgba(7,27,49,.06)]"
          onTouchStart={(event) => {
            touchStart.current =
              event.touches[0]
                ?.clientX ??
              null;
          }}
          onTouchEnd={(event) => {

            if (
              touchStart.current ===
              null
            ) {
              return;
            }

            const end =
              event.changedTouches[0]
                ?.clientX ??
              touchStart.current;

            const delta =
              end -
              touchStart.current;

            if (
              Math.abs(delta) >
              45
            ) {

              if (delta > 0) {
                previousMedia();
              }
              else {
                nextMedia();
              }
            }

            touchStart.current =
              null;
          }}
        >

          {/* CARD STACK BEHIND */}

          {hasGallery ? (
            <>
              <div className="pointer-events-none absolute inset-[14px] translate-x-3 translate-y-2 rounded-[20px] border border-white/10 bg-[#163b62]/35" />

              <div className="pointer-events-none absolute inset-[7px] translate-x-1.5 translate-y-1 rounded-[20px] border border-white/10 bg-[#315a83]/20" />
            </>
          ) : null}


          {/* ACTIVE MEDIA */}

          <button
            type="button"
            onClick={() => {
              if (hasMedia) {
                setMediaFocused(
                  true
                );
              }
            }}
            className="absolute inset-0 z-10 block h-full w-full cursor-default text-left"
            aria-label={
              hasMedia
                ? "Open media"
                : undefined
            }
          >

            {activeMedia ? (
              <>
                <img
                  key={
                    activeMedia.src
                  }
                  src={
                    activeMedia.src
                  }
                  alt={
                    activeMedia.alt ??
                    title
                  }
                  className={`absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.012] ${
                    mediaFit === "contain"
                      ? "object-contain p-8"
                      : "object-cover"
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071b31]/94 via-transparent to-[#071b31]/5" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#b6d4f2] via-[#eef5fb] to-[#0b2949]" />

                <div
                  className="absolute inset-0 opacity-[0.16]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.9) 1px,transparent 1px)",
                    backgroundSize:
                      "38px 38px",
                  }}
                />

                <div className="absolute left-[12%] top-[13%] h-[56%] w-[68%] rounded-[26px] border border-white/30 bg-white/10 backdrop-blur-[1px]" />

              </>
            )}

          </button>


          {/* TOP MEDIA LABEL */}

          <div className="pointer-events-none absolute left-4 top-4 z-30 flex items-center gap-2">

            <span className="rounded-full border border-white/15 bg-[#071b31]/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
              {mediaLabel}
            </span>

            {hasGallery ? (
              <span className="rounded-full border border-white/15 bg-[#071b31]/60 px-3 py-1.5 text-[9px] font-bold text-white backdrop-blur">
                {mediaIndex + 1} / {media.length}
              </span>
            ) : null}

          </div>


          {/* LEFT / RIGHT ARROWS */}

          {hasGallery ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousMedia();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#071b31]/65 text-[19px] font-bold text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#071b31]"
              >
                ←
              </button>


              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextMedia();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#071b31]/65 text-[19px] font-bold text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-[#071b31]"
              >
                →
              </button>
            </>
          ) : null}


          {/* PROGRESS / MINI CARDS */}

          {hasGallery ? (
            <div
              className={
                typeLabel === "Project"
                  ? "absolute right-4 top-4 z-40 flex max-w-[60%] items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-[#071b31]/60 px-3 py-2 shadow-lg backdrop-blur sm:right-5 sm:top-5 sm:max-w-[72%]"
                  : "absolute bottom-[82px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-[#071b31]/45 px-3 py-2 backdrop-blur"
              }
            >

              {media.map(
                (
                  item,
                  index
                ) => (

                  <button
                    key={`${item.src}-${index}`}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    onClick={() =>
                      setMediaIndex(
                        index
                      )
                    }
                    className={`relative shrink-0 overflow-hidden rounded-md transition-all ${
                      index ===
                      mediaIndex
                        ? "h-7 w-11 ring-2 ring-white"
                        : "h-6 w-8 opacity-55 hover:opacity-90"
                    }`}
                  >

                    <img
                      src={
                        item.src
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />

                  </button>
                )
              )}

            </div>
          ) : null}


          {/* BOTTOM IDENTITY */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-6 text-white">

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200">
              {typeLabel}
            </p>

            <p className="mt-1.5 text-[26px] font-bold tracking-tight">
              {title}
            </p>

              {/* MEDIA ATTRIBUTION / LICENCE */}
              {activeMedia?.attribution ||
              activeMedia?.license ||
              activeMedia?.sourceUrl ? (

                <details className="group/photo pointer-events-auto relative mt-2 w-fit">

                  <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/45 px-2.5 py-1 text-[8px] font-semibold text-white/85 shadow-sm backdrop-blur transition hover:bg-slate-950/65 hover:text-white">
                    <span>Photo</span>
                    <span
                      aria-hidden="true"
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold"
                    >
                      i
                    </span>
                  </summary>

                  <div className="absolute bottom-7 left-0 z-50 w-[250px] rounded-[10px] border border-white/15 bg-slate-950/90 p-3 text-left shadow-xl backdrop-blur">

                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-blue-200">
                      Media credit
                    </p>

                    <p className="mt-1.5 text-[9px] font-semibold leading-4 text-white">
                      {activeMedia.attribution ?? "Media source"}
                    </p>

                    {activeMedia.license ? (
                      <p className="mt-1 text-[8px] leading-3.5 text-white/65">
                        Licence: {activeMedia.license}
                      </p>
                    ) : null}

                    {activeMedia.sourceUrl ? (
                      <a
                        href={activeMedia.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[8px] font-bold text-blue-200 transition hover:text-white"
                      >
                        View original source
                        <span
                          aria-hidden="true"
                          className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10"
                        >
                          ↗
                        </span>
                      </a>
                    ) : null}

                  </div>

                </details>

              ) : null}



          </div>

        </div>


        {/* ==================================================
            UNIVERSAL FACTUAL OVERVIEW

            PAGE 1 RULE:
            factual orientation only.
            Interpretation belongs to Arknoz Lens.
            Analysis belongs to Intelligence.
        ================================================== */}

        <article className="grid h-fit overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,.035)] lg:grid-rows-[auto_auto_auto_auto]">

          {/* ================================================
              01 — IDENTITY
          ================================================ */}

          <header className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_62%,#f5f8fc_100%)] px-5 py-3">

            <div className="flex flex-wrap items-start justify-between gap-3">

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  ARKNOZ {typeLabel.toUpperCase()} OVERVIEW
                </p>

                <p className="mt-1 text-[9px] font-medium text-slate-400">
                  {recordDescriptor}
                </p>

              </div>


              <div className="flex flex-wrap items-center justify-end gap-1.5">

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-700">
                  {typeLabel}
                </span>

                {visualLabel ? (
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-500">
                    {visualLabel}
                  </span>
                ) : null}


                {contextLabel ? (
                  contextHref ? (
                    <a
                      href={contextHref}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {contextLabel}
                    </a>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[8px] font-semibold text-slate-500">
                      {contextLabel}
                    </span>
                  )
                ) : null}

              </div>

            </div>


            <h1 className="mt-2.5 text-[clamp(32px,3.4vw,48px)] font-bold leading-[.98] tracking-[-.045em] text-slate-950">
              {title}
            </h1>



              {arknozEntityId ? (

                <div className="mt-1.5 flex items-center gap-2">

                  <span className="text-[7.5px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    ARKNOZ PROJECT ID
                  </span>

                  <span
                    className="font-mono text-[9px] font-semibold tracking-[0.05em] text-slate-700"
                    title="Permanent Arknoz Project ID"
                  >
                    {arknozEntityId}
                  </span>

                </div>

              ) : null}

{strapline ? (
              <h2 className="mt-2 max-w-2xl border-l-[3px] border-blue-600 pl-3 text-[15.5px] font-bold leading-5 text-slate-900">
                {strapline}
              </h2>
            ) : null}


            {summary ? (
              <p className="mt-1.5 max-w-[72ch] text-[11px] leading-[1.55] text-slate-600">
                {summary}
              </p>
            ) : null}

          </header>


          {/* ================================================
              02 — AT A GLANCE
          ================================================ */}

          <section className="border-b border-slate-200 bg-white px-5 py-1.5">

            <div className="flex items-end justify-between gap-4">

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  AT A GLANCE
                </p>

                <p className="mt-0.5 text-[9px] text-slate-500">
                  Essential factual information
                </p>

              </div>

              <span className="text-[8px] font-medium text-slate-400">
                {facts
                  .filter(
                    (fact) =>
                      !/(fee|fees|cost|costs|price|pricing|budget|investment|contract value|project value|construction value)/i.test(
                        fact.label.trim()
                      )
                  )
                  .slice(0, 6).length} key facts
              </span>

            </div>


            <div className="mt-1 grid grid-cols-2 gap-1.5 lg:grid-cols-3">

              {facts
                .filter(
                  (fact) =>
                    !/(fee|fees|cost|costs|price|pricing|budget|investment|contract value|project value|construction value)/i.test(
                      fact.label.trim()
                    )
                )
                .slice(0, 6)
                .map(
                (fact) => (
                  <div
                    key={`${fact.label}-${fact.value}`}
                    className="group rounded-[11px] border border-slate-200 bg-[#f8fafc] px-3 py-1.5 transition duration-200 hover:-translate-y-[1px] hover:border-blue-200 hover:bg-white hover:shadow-[0_8px_20px_rgba(15,23,42,.06)]"
                  >

                    <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-blue-600/70 transition group-hover:text-blue-700">
                      {fact.label}
                    </p>

                    <p className="mt-1 text-[11px] font-bold leading-[1.3] text-slate-950">
                      {fact.value}
                    </p>

                  </div>
                )
              )}

            </div>

          </section>


          {/* ================================================
              03 — RECORD BASIS
          ================================================ */}

          <section className="min-h-0 bg-[linear-gradient(180deg,#f8fafc_0%,#f3f6fa_100%)] px-5 py-1.5">

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                RECORD BASIS
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                What this factual Overview is based on
              </p>

            </div>


            <div className="mt-1 grid grid-cols-3 overflow-hidden rounded-[13px] border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,.035)]">

              <div className="border-r border-slate-200 px-3 py-1.5 transition hover:bg-blue-50/40">

                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  STATUS
                </p>

                <p className="mt-1 text-[10px] font-bold text-slate-900">
                  {provenanceLabel}
                </p>

              </div>


              <div className="border-r border-slate-200 px-3 py-1.5 transition hover:bg-blue-50/40">

                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  SOURCES
                </p>

                <p className="mt-1 text-[10px] font-bold text-slate-900">
                  {sourceCount > 0
                    ? `${sourceCount} ${sourceCount === 1 ? "source" : "sources"}`
                    : "Count pending"}
                </p>

              </div>


              <div className="px-3 py-1.5 transition hover:bg-blue-50/40">

                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  PRIMARY SOURCE
                </p>

                <p className="mt-1 text-[10px] font-bold text-slate-900">
                  {officialUrl
                    ? "Available"
                    : "Not linked"}
                </p>

              </div>

            </div>


            <p className="mt-1 max-w-[70ch] border-l-2 border-slate-300 pl-2.5 text-[8px] leading-[1.35] text-slate-500">
              This Overview presents identity and essential recorded facts. Detailed factual information, credits, systems, relationships, documentation and evidence continue in the full Record.
            </p>

          </section>


          {/* ================================================
              04 — ACTIONS
          ================================================ */}

          <footer className="flex flex-wrap items-center justify-start gap-2 border-t border-slate-200 bg-white px-5 py-1.5">

  {continueHref ? (
    <a
      href={continueHref}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#0b2949] px-4 py-1.5 text-[9px] font-bold text-white shadow-[0_7px_18px_rgba(11,41,73,.16)] transition duration-200 hover:-translate-y-[1px] hover:bg-[#123b65] hover:shadow-[0_10px_22px_rgba(11,41,73,.22)]"
    >
      {continueLabel}
      <span aria-hidden="true">→</span>
    </a>
  ) : null}


  {officialUrl ? (
    <a
      href={officialUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-bold text-slate-600 transition duration-200 hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
    >
      {sourceLinkLabel}
      <span aria-hidden="true">↗</span>
    </a>
  ) : null}

</footer>

        </article>

      </div>


      {/* ==================================================
          FULLSCREEN MEDIA VIEW
      ================================================== */}

      {mediaFocused &&
      activeMedia ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020b14]/95 p-5">

          <button
            type="button"
            onClick={() =>
              setMediaFocused(
                false
              )
            }
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl text-white"
            aria-label="Close media"
          >
            ×
          </button>


          {hasGallery ? (
            <button
              type="button"
              onClick={
                previousMedia
              }
              className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl text-white"
            >
              ←
            </button>
          ) : null}


          <img
            src={
              activeMedia.src
            }
            alt={
              activeMedia.alt ??
              title
            }
            className="max-h-[88vh] max-w-[90vw] rounded-[14px] object-contain shadow-2xl"
          />


          {hasGallery ? (
            <button
              type="button"
              onClick={
                nextMedia
              }
              className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl text-white"
            >
              →
            </button>
          ) : null}


          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-4 py-2 text-[10px] font-bold text-white">
            {mediaIndex + 1} / {media.length}
          </div>

        </div>
      ) : null}</div>
  );
}
