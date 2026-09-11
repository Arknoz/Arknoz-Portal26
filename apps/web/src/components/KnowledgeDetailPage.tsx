import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import KnowledgeDetailTabs from "@/components/KnowledgeDetailTabs";

import type {
  EntityRecord,
} from "@/lib/entities";

import {
  getKnowledgeDetail,
  type KnowledgeDetailData,
} from "@/lib/knowledge-details";

function KnowledgeHeroVisual({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: KnowledgeDetailData;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#dcebf8] via-[#eef5fa] to-[#0b2949]">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,41,73,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.18) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ORIGINAL ARKNOZ DOCUMENT VISUAL */}
      <div className="absolute left-[10%] top-[10%] h-[70%] w-[55%] rounded-[20px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(7,27,49,.14)] backdrop-blur-sm">
        <p className="text-[8px] font-bold uppercase tracking-[0.19em] text-blue-700">
          {detail?.recordType ??
            "KNOWLEDGE"}
        </p>

        <p className="mt-6 text-[28px] font-bold leading-8 tracking-tight text-[#071b31]">
          WORLD
          <br />
          CITIES
          <br />
          REPORT
          <br />
          2024
        </p>

        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-[10px] font-bold text-[#0b2949]">
            Cities and Climate Action
          </p>

          <p className="mt-1 text-[8px] text-slate-500">
            UN-Habitat
          </p>
        </div>
      </div>

      {/* ABSTRACT CITY SIGNAL */}
      <div className="absolute bottom-[18%] right-[7%] flex h-[38%] items-end gap-2 opacity-70">
        <div className="h-[40%] w-8 bg-white/45" />
        <div className="h-[65%] w-9 bg-white/45" />
        <div className="h-[48%] w-8 bg-white/45" />
        <div className="h-[90%] w-10 bg-white/45" />
        <div className="h-[58%] w-9 bg-white/45" />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31]/95 to-transparent p-7 pt-20 text-white">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
          KNOWLEDGE
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {entity.title}
        </h2>

        <p className="mt-1 text-[11px] text-slate-300">
          Source-aware knowledge record
        </p>
      </div>
    </div>
  );
}

export default function KnowledgeDetailPage({
  entity,
}: {
  entity: EntityRecord;
}) {
  const detail =
    getKnowledgeDetail(entity.slug);

  const facts = detail?.facts ?? [];

  const headlineFacts =
    facts.slice(0, 4);

  const glanceFacts =
    facts.slice(3, 6);

  const section =
    detail?.section ?? "Knowledge";

  return (
    <>
      <GlobalHeader />

      <main>

        {/* ==================================================
            SCREEN 1 — KNOWLEDGE IDENTITY
        ================================================== */}

        <section className="bg-[#f6f8fb] lg:h-[calc(100svh-88px)]">
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-8">

            <nav className="mb-4 flex shrink-0 flex-wrap items-center gap-2 text-[11px] font-semibold">
              <Link
                href="/knowledge"
                className="text-blue-700"
              >
                Knowledge
              </Link>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-600">
                {section}
              </span>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-950">
                {entity.title}
              </span>
            </nav>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[.84fr_1.05fr_190px]">

              {/* IDENTITY */}
              <article className="flex min-h-0 flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_6px_24px_rgba(15,23,42,.035)]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-blue-700">
                      {detail?.recordType ??
                        "KNOWLEDGE"}
                    </span>

                    <span className="rounded-full bg-[#f3f6f9] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600">
                      {section}
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(34px,3.6vw,58px)] font-bold leading-[1] tracking-[-.04em] text-slate-950">
                    {entity.title}
                  </h1>

                  {detail?.strapline ? (
                    <h2 className="mt-4 max-w-[580px] text-[20px] font-bold leading-7 text-slate-950">
                      {detail.strapline}
                    </h2>
                  ) : null}

                  <p className="mt-4 max-w-[570px] text-[13px] leading-6 text-slate-600">
                    {entity.summary}
                  </p>

                  {headlineFacts.length >
                  0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-x-6">
                      {headlineFacts.map(
                        (fact) => (
                          <div
                            key={fact.label}
                            className="border-t border-slate-200 py-3"
                          >
                            <span className="text-[10px] text-slate-500">
                              {fact.label}
                            </span>

                            <strong className="ml-2 text-[11px] text-slate-950">
                              {fact.value}
                            </strong>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-3 pt-4">
                  <span className="rounded-full bg-[#0b2949] px-5 py-3 text-[10px] font-bold text-white">
                    Official source identified
                  </span>

                  <a
                    href="#knowledge-intelligence"
                    className="text-[11px] font-bold text-blue-700"
                  >
                    Knowledge intelligence ↓
                  </a>
                </div>
              </article>

              {/* VISUAL */}
              <KnowledgeHeroVisual
                entity={entity}
                detail={detail}
              />

              {/* RIGHT RAIL */}
              <div className="grid min-h-0 grid-rows-[1.05fr_.95fr] gap-3">

                <article className="flex flex-col justify-between rounded-[24px] bg-[#0b2949] p-5 text-white">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      VERIFIED
                    </p>

                    <h3 className="mt-3 text-[15px] font-bold">
                      Knowledge source
                    </h3>
                  </div>

                  <p className="text-[10px] leading-5 text-slate-300">
                    Source-backed identity, publication metadata and provenance.
                  </p>
                </article>

                <article className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    AT A GLANCE
                  </p>

                  <div className="mt-4 space-y-4">
                    {glanceFacts.map(
                      (fact) => (
                        <div
                          key={fact.label}
                        >
                          <p className="text-[9px] text-slate-400">
                            {fact.label}
                          </p>

                          <p className="mt-1 text-[12px] font-bold leading-4">
                            {fact.value}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SCREEN 2
        ================================================== */}

        <section
          id="knowledge-intelligence"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex shrink-0 items-end justify-between gap-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  KNOWLEDGE INTELLIGENCE
                </p>

                <h2 className="mt-1 text-[26px] font-bold tracking-tight">
                  Understand the knowledge
                </h2>
              </div>

              <p className="hidden max-w-xl text-right text-[11px] leading-5 text-slate-500 lg:block">
                Context, themes, provenance, rights and connected Built World knowledge in one workspace.
              </p>
            </div>

            <div className="min-h-0 flex-1">
              <KnowledgeDetailTabs
                entity={entity}
                detail={detail}
              />
            </div>

            <div className="mt-3 flex shrink-0 items-center gap-8 border-t border-slate-200 pt-3 text-[10px] font-bold">
              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/knowledge">
                Knowledge →
              </Link>

              <Link href="/projects">
                Projects →
              </Link>

              <Link href="/products">
                Products →
              </Link>

              <Link href="/global">
                Global →
              </Link>
            </div>
          </div>
        </section>

        <UniversalFooterStrip />
        <GlobalFooter />
      </main>
    </>
  );
}
