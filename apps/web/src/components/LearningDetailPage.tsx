import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import LearningDetailTabs from "@/components/LearningDetailTabs";

import type {
  LearningDetailData,
} from "@/lib/learning-details";

function LearningHeroVisual({
  detail,
}: {
  detail: LearningDetailData;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#d9ebfa] via-[#edf5fb] to-[#0b2949]">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,41,73,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.18) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* BUILDING-TECHNOLOGY DIAGRAM */}
      <div className="absolute left-[10%] top-[12%] h-[63%] w-[64%] rounded-[28px] border border-white/60 bg-white/38 backdrop-blur-[2px]">

        <div className="absolute bottom-[14%] left-[11%] h-[44%] w-[25%] border-2 border-[#0b2949]/20 bg-white/30" />

        <div className="absolute bottom-[14%] left-[39%] h-[62%] w-[18%] border-2 border-[#0b2949]/20 bg-white/30" />

        <div className="absolute bottom-[14%] left-[60%] h-[35%] w-[25%] border-2 border-[#0b2949]/20 bg-white/30" />

        <div className="absolute left-[8%] top-[10%]">
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
            BUILDING TECHNOLOGY
          </p>

          <p className="mt-2 text-[23px] font-bold leading-7 text-[#071b31]">
            Physics
            <br />
            Climate
            <br />
            Systems
          </p>
        </div>
      </div>

      <div className="absolute right-[6%] top-[15%] rounded-[18px] bg-white p-4 shadow-[0_14px_35px_rgba(7,27,49,.14)]">
        <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-blue-700">
          LEVEL
        </p>

        <p className="mt-2 text-[18px] font-bold text-[#0b2949]">
          {detail.level}
        </p>

        <p className="mt-1 text-[9px] text-slate-500">
          MIT OpenCourseWare
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31]/95 to-transparent p-7 pt-20 text-white">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
          LEARNING
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {detail.title}
        </h2>

        <p className="mt-1 text-[11px] text-slate-300">
          Source-aware learning record
        </p>
      </div>
    </div>
  );
}

export default function LearningDetailPage({
  detail,
}: {
  detail: LearningDetailData;
}) {
  const facts = detail.facts ?? [];

  const headlineFacts =
    facts.slice(0, 4);

  const glanceFacts =
    facts.slice(3, 6);

  return (
    <>
      <GlobalHeader />

      <main>

        {/* ==================================================
            SCREEN 1 — LEARNING IDENTITY
        ================================================== */}

        <section className="bg-[#f6f8fb] lg:h-[calc(100svh-88px)]">
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-8">

            <nav className="mb-4 flex shrink-0 flex-wrap items-center gap-2 text-[11px] font-semibold">
              <Link
                href="/learning"
                className="text-blue-700"
              >
                Education
              </Link>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-600">
                {detail.section}
              </span>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-950">
                {detail.title}
              </span>
            </nav>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[.84fr_1.05fr_190px]">

              {/* IDENTITY */}
              <article className="flex min-h-0 flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_6px_24px_rgba(15,23,42,.035)]">
                <div>
                  <div className="flex flex-wrap gap-2">

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-blue-700">
                      {detail.learningType}
                    </span>

                    <span className="rounded-full bg-[#f3f6f9] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600">
                      {detail.level}
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(34px,3.6vw,58px)] font-bold leading-[1] tracking-[-.04em] text-slate-950">
                    {detail.title}
                  </h1>

                  {detail.strapline ? (
                    <h2 className="mt-4 max-w-[590px] text-[19px] font-bold leading-7 text-slate-950">
                      {detail.strapline}
                    </h2>
                  ) : null}

                  <p className="mt-4 max-w-[570px] text-[13px] leading-6 text-slate-600">
                    {detail.summary}
                  </p>

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
                </div>

                <div className="flex items-center justify-between gap-3 pt-4">

                  {detail.officialUrl ? (
                    <a
                      href={
                        detail.officialUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[#0b2949] px-5 py-3 text-[10px] font-bold text-white transition hover:-translate-y-[1px] hover:shadow-md"
                    >
                      Official course ↗
                    </a>
                  ) : null}

                  <a
                    href="#learning-intelligence"
                    className="text-[11px] font-bold text-blue-700"
                  >
                    Learning intelligence ↓
                  </a>
                </div>
              </article>

              {/* VISUAL */}
              <LearningHeroVisual
                detail={detail}
              />

              {/* RIGHT RAIL */}
              <div className="grid min-h-0 grid-rows-[1.05fr_.95fr] gap-3">

                <article className="flex flex-col justify-between rounded-[24px] bg-[#0b2949] p-5 text-white">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      SOURCE-BACKED
                    </p>

                    <h3 className="mt-3 text-[15px] font-bold">
                      Learning record
                    </h3>
                  </div>

                  <p className="text-[10px] leading-5 text-slate-300">
                    Provider, instructor, level, original teaching period and learning resources.
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
            SCREEN 2 — LEARNING INTELLIGENCE
        ================================================== */}

        <section
          id="learning-intelligence"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex shrink-0 items-end justify-between gap-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  LEARNING INTELLIGENCE
                </p>

                <h2 className="mt-1 text-[26px] font-bold tracking-tight">
                  Understand the learning
                </h2>
              </div>

              <p className="hidden max-w-xl text-right text-[11px] leading-5 text-slate-500 lg:block">
                Outcomes, resources, provider context, source state and connected Built World pathways in one workspace.
              </p>
            </div>

            <div className="min-h-0 flex-1">
              <LearningDetailTabs
                detail={detail}
              />
            </div>

            <div className="mt-3 flex shrink-0 items-center gap-8 border-t border-slate-200 pt-3 text-[10px] font-bold">
              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/learning">
                Education →
              </Link>

              <Link href="/knowledge">
                Knowledge →
              </Link>

              <Link href="/projects">
                Projects →
              </Link>

              <Link href="/opportunities">
                Opportunities →
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
