import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import OpportunityDetailTabs from "@/components/OpportunityDetailTabs";

import type { EntityRecord } from "@/lib/entities";

import {
  getOpportunityDetail,
} from "@/lib/opportunity-details";

export default function OpportunityDetailPage({
  entity,
}: {
  entity: EntityRecord;
}) {
  const detail =
    getOpportunityDetail(entity.slug);

  if (!detail) {
    return null;
  }

  const headlineFacts =
    detail.facts.slice(0, 4);

  const glanceFacts =
    detail.facts.slice(3, 6);

  return (
    <>
      <GlobalHeader />

      <main>

        {/* SCREEN 1 */}
        <section className="bg-[#f6f8fb] lg:h-[calc(100svh-88px)]">

          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-8">

            <nav className="mb-4 flex gap-2 text-[11px] font-semibold">

              <Link
                href="/opportunities"
                className="text-blue-700"
              >
                Opportunities
              </Link>

              <span>›</span>

              <span>
                {detail.category}
              </span>

              <span>›</span>

              <strong>
                {entity.title}
              </strong>
            </nav>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[.84fr_1.05fr_190px]">

              {/* IDENTITY */}
              <article className="flex min-h-0 flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-7">

                <div>

                  <div className="flex gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-emerald-700">
                      OPEN
                    </span>

                    <span className="rounded-full bg-[#f3f6f9] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600">
                      {detail.opportunityType}
                    </span>
                  </div>

                  <h1 className="mt-6 text-[clamp(35px,3.7vw,60px)] font-bold leading-[.98] tracking-[-.045em]">
                    {entity.title}
                  </h1>

                  <h2 className="mt-5 text-[20px] font-bold leading-7">
                    {detail.strapline}
                  </h2>

                  <p className="mt-4 text-[13px] leading-6 text-slate-600">
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

                          <strong className="ml-2 text-[11px]">
                            {fact.value}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">

                  <a
                    href={detail.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#0b2949] px-5 py-3 text-[10px] font-bold text-white"
                  >
                    Apply on official site ↗
                  </a>

                  <a
                    href="#opportunity-intelligence"
                    className="text-[11px] font-bold text-blue-700"
                  >
                    Opportunity details ↓
                  </a>
                </div>
              </article>

              {/* VISUAL */}
              <article className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#dcebf8] via-[#edf5fb] to-[#0b2949]">

                <div
                  className="absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(11,41,73,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(11,41,73,.18) 1px,transparent 1px)",
                    backgroundSize:
                      "40px 40px",
                  }}
                />

                <div className="absolute bottom-[18%] left-[10%] right-[10%] flex h-[52%] items-end justify-center gap-2">

                  {[30, 46, 64, 88, 68, 50, 38].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="w-[10%] border border-[#0b2949]/15 bg-white/35"
                        style={{
                          height:
                            `${height}%`,
                        }}
                      />
                    )
                  )}
                </div>

                <div className="absolute left-[7%] top-[10%]">

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    VANCOUVER
                  </p>

                  <p className="mt-2 text-[29px] font-bold leading-8 text-[#071b31]">
                    Tall
                    <br />
                    Urban
                    <br />
                    Futures
                  </p>
                </div>

                <div className="absolute right-[6%] top-[12%] rounded-[18px] bg-white p-4 shadow-xl">

                  <p className="text-[8px] font-bold uppercase text-blue-700">
                    REGISTRATION
                  </p>

                  <p className="mt-2 text-[18px] font-bold text-[#0b2949]">
                    29 Oct 2026
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    Official deadline
                  </p>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31]/95 to-transparent p-7 pt-20 text-white">

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    OPPORTUNITY
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {entity.title}
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-300">
                    Current source-backed record
                  </p>
                </div>
              </article>

              {/* RIGHT RAIL */}
              <div className="grid grid-rows-[1.05fr_.95fr] gap-3">

                <article className="flex flex-col justify-between rounded-[24px] bg-[#0b2949] p-5 text-white">

                  <div>
                    <p className="text-[8px] font-bold uppercase text-blue-200">
                      CURRENT
                    </p>

                    <h3 className="mt-3 text-[15px] font-bold">
                      {detail.status}
                    </h3>
                  </div>

                  <div>
                    <p className="text-[9px] text-slate-300">
                      Last checked
                    </p>

                    <p className="mt-1 text-[11px] font-bold">
                      {detail.lastChecked}
                    </p>
                  </div>
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

                          <p className="mt-1 text-[12px] font-bold">
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

        {/* SCREEN 2 */}
        <section
          id="opportunity-intelligence"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >

          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex items-end justify-between">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  OPPORTUNITY
                </p>

                <h2 className="mt-1 text-[26px] font-bold">
                  Understand the opportunity
                </h2>
              </div>

              <p className="hidden text-[11px] text-slate-500 lg:block">
                Eligibility, timeline, application path and connected Built World context.
              </p>
            </div>

            <div className="min-h-0 flex-1">

              <OpportunityDetailTabs
                entity={entity}
                detail={detail}
              />
            </div>

            <div className="mt-3 flex items-center gap-8 border-t border-slate-200 pt-3 text-[10px] font-bold">

              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/opportunities">
                Opportunities →
              </Link>

              <Link href="/projects">
                Projects →
              </Link>

              <Link href="/knowledge">
                Knowledge →
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
