import Image from "next/image";
import Link from "next/link";

import ArknozLivePlatformPanel from "@/components/ArknozLivePlatformPanel";
import LanguageControl from "@/components/LanguageControl";
import ArknozPageContextBar from "@/components/ArknozPageContextBar";

const discoverLinks = [
  ["Global", "/global", "Explore by geography"],
  ["Search", "/search", "Search across Arknoz"],
  ["Featured", "/featured", "Selected records"],
  ["Projects", "/projects", "Built work worldwide"],
  ["Products", "/products", "Materials and systems"],
  ["Knowledge", "/knowledge", "Research and references"],
] as const;

const participateLinks = [
  ["Community", "/community", "Members and chapters"],
  ["People", "/people", "Built World professionals"],
  ["Organisations", "/organisations", "Practices, companies and institutions"],
  ["Universities", "/universities", "Education and research institutions"],
  ["Opportunities", "/opportunities", "Jobs, competitions, funding and events"],
  ["Join Arknoz", "/join", "Create your Arknoz ID"],
] as const;

const worldLinks = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Education", "/learning"],
  ["Opportunities", "/opportunities"],
  ["Community", "/community"],
] as const;

const principles = [
  "Connected records",
  "Global geography",
  "Source-aware",
  "Rights-aware",
] as const;

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function UniversalArknozLastScreen() {
  return (
    <footer
      id="arknoz-last-screen"
      className="relative isolate overflow-hidden border-t border-white/10 bg-[#06192e] text-white lg:-mt-6"
    >
      <ArknozPageContextBar />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto flex min-h-0 max-w-[1720px] flex-col px-5 pb-3 pt-0 lg:px-8 lg:pt-0">

        {/* LIVE */}
        <div className="shrink-0">
          <ArknozLivePlatformPanel />
        </div>


        {/* MAIN */}
        <div className="grid min-h-0 flex-1 gap-3 py-3 lg:grid-cols-[1.08fr_.96fr_.96fr]">

          {/* ==================================================
              ARKNOZ IDENTITY
          ================================================== */}

          <section className="relative flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#091f36] p-5">

            <div
              className="pointer-events-none absolute -bottom-20 -right-20 h-[330px] w-[330px] rounded-full border border-blue-300/10"
            />

            <div
              className="pointer-events-none absolute -bottom-8 -right-5 h-[220px] w-[220px] rounded-full border border-blue-300/10"
            />

            <div className="relative z-10">

              <div className="inline-flex rounded-[11px] bg-white px-3 py-2">
                <Image
                  src="/brand/arknoz-logo.png"
                  alt="Arknoz - The Digital Built World"
                  width={174}
                  height={44}
                  className="h-auto w-[168px] object-contain"
                />
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                The Digital Built World
              </p>

              <h2 className="mt-2 max-w-[540px] text-[31px] font-semibold leading-[1] tracking-[-0.045em] xl:text-[37px]">
                One connected place for the Built World
              </h2>

              <p className="mt-3 max-w-[500px] text-[11px] leading-5 text-slate-400">
                Discover projects, products, knowledge, education,
                opportunities, people, organisations and places through
                one connected Arknoz platform.
              </p>

              <Link
                href="/explore"
                className="mt-4 inline-flex items-center gap-5 rounded-full border border-white/25 px-4 py-2 text-[11px] font-semibold hover:bg-white/[0.06]"
              >
                Explore Arknoz
                <Arrow />
              </Link>

            </div>


            {/* PLATFORM PRINCIPLES */}
            <div className="relative z-10 mt-auto">

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Platform principles
              </p>

              <div className="grid grid-cols-2 gap-2">
                {principles.map((item) => (
                  <div
                    key={item}
                    className="rounded-[10px] border border-white/8 bg-white/[0.035] px-3 py-2.5"
                  >
                    <span className="text-[11px] font-medium text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>


              <div className="mt-3 grid grid-cols-5 gap-1.5 border-t border-white/10 pt-3">
                {worldLinks.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-[9px] border border-white/8 bg-white/[0.03] px-1 py-2 text-center text-[10px] text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>

            </div>

          </section>


          {/* ==================================================
              DISCOVER
          ================================================== */}

          <section className="flex min-h-0 flex-col rounded-[18px] border border-white/10 bg-white/[0.035] p-5">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">
                Discover
              </p>

              <h3 className="mt-1.5 text-[19px] font-semibold">
                Explore the Built World
              </h3>

              <p className="mt-1.5 text-[11px] text-slate-500">
                Move through Arknoz by content, search or geography.
              </p>
            </div>


            <div className="mt-4 grid grid-cols-2 gap-2">

              {discoverLinks.map(
                ([label, href, description]) => (
                  <Link
                    key={label}
                    href={href}
                    className="group flex min-h-[76px] flex-col justify-between rounded-[12px] border border-white/10 bg-white/[0.025] p-3 transition hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[12px] font-semibold text-white">
                        {label}
                      </span>

                      <Arrow />
                    </div>

                    <span className="text-[10px] leading-4 text-slate-500">
                      {description}
                    </span>
                  </Link>
                )
              )}

            </div>


            <Link
              href="/featured"
              className="mt-auto rounded-[13px] border border-blue-400/20 bg-[#0b3154] p-3.5 hover:border-blue-300/40"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200">
                Arknoz Featured
              </p>

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <h4 className="text-[14px] font-semibold">
                    Selected across Arknoz
                  </h4>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Genuine featured and editorial selections.
                  </p>
                </div>

                <Arrow />
              </div>
            </Link>

          </section>


          {/* ==================================================
              PARTICIPATE
          ================================================== */}

          <section className="flex min-h-0 flex-col rounded-[18px] border border-white/10 bg-white/[0.035] p-5">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Participate
              </p>

              <h3 className="mt-1.5 text-[19px] font-semibold">
                Be part of Arknoz
              </h3>

              <p className="mt-1.5 text-[11px] text-slate-500">
                People, organisations, universities, community and opportunities across the Built World.
              </p>
            </div>


            <div className="mt-4 grid grid-cols-2 gap-2">

              {participateLinks.map(
                ([label, href, description]) => (
                  <Link
                    key={label}
                    href={href}
                    className="group flex min-h-[76px] flex-col justify-between rounded-[12px] border border-white/10 bg-white/[0.025] p-3 transition hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[12px] font-semibold text-white">
                        {label}
                      </span>

                      <Arrow />
                    </div>

                    <span className="text-[10px] leading-4 text-slate-500">
                      {description}
                    </span>
                  </Link>
                )
              )}

              <Link
                href="/about"
                className="group flex min-h-[76px] flex-col justify-between rounded-[12px] border border-white/10 bg-white/[0.025] p-3 transition hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[12px] font-semibold text-white">
                    About Arknoz
                  </span>

                  <Arrow />
                </div>

                <span className="text-[10px] leading-4 text-slate-500">
                  Mission and platform
                </span>
              </Link>

            </div>


            <Link
              href="/global"
              className="mt-auto rounded-[13px] border border-white/10 bg-white/[0.04] p-3.5 hover:bg-white/[0.07]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Global
              </p>

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <h4 className="text-[14px] font-semibold">
                    Explore by place
                  </h4>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Continent → Country → Region → City
                  </p>
                </div>

                <Arrow />
              </div>
            </Link>

          </section>

        </div>


                {/* ==================================================
            ARKNOZ CLOSING SIGNATURE
        ================================================== */}




{/* ==================================================
            UTILITY BAR
        ================================================== */}

        <div className="shrink-0 border-t border-white/10 py-2">

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">

            <div className="flex items-center gap-2 lg:justify-self-start">
              <LanguageControl dark />

              <Link
                href="/global"
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[12px] leading-4 lg:text-[12px]"
              >
                Global
              </Link>
            </div>


            <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] leading-5 text-slate-300 lg:justify-self-center xl:gap-x-5 xl:text-[12px]">
              <Link
                href="/about"
                className="transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="/opportunities"
                className="transition hover:text-white"
              >
                Careers
              </Link>

              <Link
                href="/business"
                className="transition hover:text-white"
              >
                For Business
              </Link>

              <Link
                href="/partnerships"
                className="transition hover:text-white"
              >
                Partnerships
              </Link>

              <Link
                href="/pricing"
                className="transition hover:text-white"
              >
                Access
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/accessibility"
                className="transition hover:text-white"
              >
                Accessibility
              </Link>
            </div>


            <div className="text-left text-[11px] leading-4 text-slate-400 lg:mr-36 lg:justify-self-end lg:whitespace-nowrap lg:text-right lg:text-[12px] xl:mr-40">
              <p>© 2026 Arknoz Private Limited.</p>
              <p>Knowledge today. A better built tomorrow.</p>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
