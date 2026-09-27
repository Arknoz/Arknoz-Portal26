import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import HomeNowOnArknozLoop from "@/components/HomeNowOnArknozLoop";
import ProInteractiveJourney from "@/components/ProInteractiveJourney";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";


const accessLayers = [
  {
    title: "Arknoz",
    mode: "Explore + Participate",
    text: "Discover the Built World through projects, products, knowledge, people, organisations and opportunities.",
  },
  {
    title: "Arknoz ID",
    mode: "Free Member Identity",
    text: "Build your professional identity, join Community, save what matters, contribute and carry your context across Arknoz.",
  },
  {
    title: "Arknoz Pro",
    mode: "Paid Professional Layer",
    text: "Use role-aware workspaces, professional collaboration, messaging, analytics, tools and deeper intelligence.",
  },
] as const;


function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}


export default function IntelligencePortal() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <GlobalHeader />


      {/* =========================================================
          01 · ARKNOZ PRO HERO
          ========================================================= */}

      <section className="relative min-h-[calc(88svh-80px)] overflow-hidden bg-[#071b31] text-white">

        {/* SAME BUILT WORLD IMAGE LANGUAGE AS HOME / EXPLORE */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("/visuals/arknoz-built-world-watermark.jpg")',
          }}
        />

        {/* HOME / EXPLORE STYLE DARKENING */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#06192e]/78"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#031522]/95 via-[#061d30]/82 to-[#0b2949]/60"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#031522]/80 via-transparent to-black/10"
        />

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            min-h-[calc(88svh-80px)]
            max-w-[1640px]
            gap-14
            px-6
            pt-8 pb-14
            lg:grid-cols-[1.04fr_.96fr]
            lg:items-start
            lg:px-12
            lg:pt-8 lg:pb-16
          "
        >
          <div className="self-start">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200/75">
                Arknoz Pro
              </p>

              <span className="rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                Pro
              </span>
            </div>

            <h1 className="mt-7 max-w-[12ch] text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Professional tools and intelligence for the Built World.
            </h1>

            <p className="mt-7 max-w-[720px] text-base leading-8 text-white/65">
              Explore the Built World freely. Arknoz Pro gives you the tools to operate within it:
              connect talent, organisations, knowledge, projects, products and
              opportunities through one professional intelligence layer.
            </p>

            <p className="mt-3 max-w-[720px] text-sm leading-7 text-white/40">
              One connected professional layer for students, professionals,
              universities, employers, practices, researchers, manufacturers,
              clients, institutions and the wider Built World.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                Start in Explore
                <Arrow />
              </Link>

              <Link
                href="/sign-in"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                Sign in
              </Link>
            </div>
          </div>


          <div className="self-start rounded-[30px] border border-white/15 bg-[#0b2949]/72 p-7 shadow-2xl backdrop-blur-md sm:p-9">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-200/55">
                  Arknoz Pro
                </p>

                <p className="mt-2 text-lg font-semibold">
                  Explore. Operate. Grow. Measure.
                </p>
              </div>

              <span className="rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">
                Pro
              </span>
            </div>

            <div className="mt-7 space-y-4">
              {[
                [
                  "01",
                  "Define",
                  "Tell Arknoz what you are trying to achieve.",
                ],
                [
                  "02",
                  "Build context",
                  "Combine your purpose, subject, place, constraints and relevant evidence.",
                ],
                [
                  "03",
                  "Research",
                  "Connect and refine the most relevant Built World information.",
                ],
                [
                  "04",
                  "Apply",
                  "Use research, connections, comparison and analysis for your situation.",
                ],
                [
                  "05",
                  "Continue",
                  "Track meaningful change and keep the outcome current.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="grid grid-cols-[38px_1fr] gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-[9px] text-white/50">
                    {number}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          02 · SAME ARKNOZ NOW SYSTEM
          ========================================================= */}

      <div className="relative z-20 -mt-8 lg:-mt-10">
        <HomeNowOnArknozLoop />
      </div>
                  {/* =========================================================
          03 - ARKNOZ PRO NAVIGATOR
          ========================================================= */}

      <ProInteractiveJourney />

      {/* =========================================================
          04 - ACCESS MODEL
          ========================================================= */}

      <section className="bg-white px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1640px]">

          <div className="grid gap-6 border-b border-slate-200 pb-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
                Access model
              </p>

              <h2 className="mt-3 max-w-[13ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                Free gives access. Pro gives capability.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-500 lg:justify-self-end">
              Arknoz remains useful before payment. Arknoz ID carries identity
              and continuity. Pro activates professional workflow, intelligence,
              tools, intelligence, management and measurement when they are needed.
            </p>
          </div>


          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {accessLayers.map((item) => (
              <article
                key={item.title}
                className="rounded-[22px] border border-slate-200 bg-[#f8fafb] p-6"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-teal-700">
                  {item.mode}
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {item.text}
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>

<UniversalPublicLastScreen />
    </main>
  );
}
