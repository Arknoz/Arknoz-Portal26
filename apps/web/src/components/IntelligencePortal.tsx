import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import ProNowHomePanel from "@/components/ProNowHomePanel";
import ProInteractiveJourney from "@/components/ProInteractiveJourney";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";


const accessLayers = [
  {
    title: "Arknoz",
    mode: "Free Public Access",
    text: "Discover the Built World through projects, products, knowledge, people, organisations and opportunities.",
  },
  {
    title: "Arknoz ID",
    mode: "Free Member Identity",
    text: "Build your professional identity, join Community, save what matters, contribute and carry your context across Arknoz.",
  },
  {
    title: "Arknoz Pro",
    mode: "Coming Later",
    text: "Future professional operating layer for role-aware workspaces, messaging, analytics, tools and deeper intelligence.",
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

            <section
        data-arknoz-pro-screen="hero"
        className="
          bg-[#f4f6f8]
          px-5
          py-5
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-[1600px]
            overflow-hidden
            rounded-[10px]
            border
            border-slate-200
            bg-white
            shadow-[0_22px_65px_rgba(15,23,42,0.07)]
            lg:min-h-[calc(100svh-168px)]
            lg:grid-cols-[.9fr_1.1fr]
          "
        >
          {/* =====================================================
              LEFT · PREMIUM BRAND / POSITIONING
             ===================================================== */}
          <div
            className="
              relative
              flex
              flex-col
              justify-between
              overflow-hidden
              bg-[linear-gradient(135deg,#ffffff_0%,#fdfbfc_58%,#f8f3f6_100%)]
              p-7
              sm:p-9
              lg:p-10
              xl:p-12
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                -left-16
                bottom-[-110px]
                h-[260px]
                w-[260px]
                rounded-full
                bg-[#a61f46]/[0.035]
                blur-3xl
              "
            />

            <div className="relative z-10">
              {/* ARKNOZ BRAND LOCKUP */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div
                  className="
                    text-[56px]
                    font-black
                    leading-none
                    tracking-[-0.06em]
                    sm:text-[64px]
                    xl:text-[70px]
                  "
                >
                  <span className="text-[#172b4d]">
                    Ark
                  </span>
                  <span className="text-[#a61f46]">
                    noz
                  </span>
                </div>

                <div
                  className="
                    hidden
                    h-14
                    w-px
                    bg-slate-300
                    sm:block
                  "
                />

                                <p
                  className="
                    text-[26px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    leading-none
                    text-[#0a2230]
                    sm:text-[30px]
                  "
                >
                  Pro
                </p>
              </div>

              {/* BRAND ACCENT */}
              <div className="mt-5 flex items-center">
                <span className="h-px w-10 bg-[#a61f46]" />
                <span className="h-px w-28 bg-slate-200" />
              </div>

              {/* PRO POSITIONING */}
                            <div className="mt-8">
                <p
                  className="
                    text-[14px]
                    font-semibold
                    leading-none
                    tracking-[0.01em]
                    text-slate-500
                    sm:text-[16px]
                  "
                >
                  Professional operating + intelligence layer
                </p>

                <h1
                  className="
                    mt-4
                    max-w-[650px]
                    text-[34px]
                    font-semibold
                    leading-[1.02]
                    tracking-[-0.045em]
                    text-[#0a2230]
                    sm:text-[39px]
                    xl:text-[43px]
                  "
                >
                  Professional tools and intelligence for the Built World.
                </h1>

                <p
                  className="
                    mt-5
                    max-w-[650px]
                    text-[14px]
                    leading-7
                    text-slate-600
                  "
                >
                  Explore the Built World freely. Arknoz Pro will add the
                  professional tools to operate within it — connecting
                  people, organisations, knowledge, projects, products
                  and opportunities through one professional intelligence layer. Activation is coming later.
                </p>
              </div>

              {/* CAPABILITY INDEX */}
              <div
                className="
                  mt-7
                  grid
                  grid-cols-2
                  border-y
                  border-slate-200
                  sm:grid-cols-4
                "
              >
                {[
                  ["01", "Explore", "Discover context"],
                  ["02", "Operate", "Work professionally"],
                  ["03", "Grow", "Build connections"],
                  ["04", "Measure", "Track outcomes"],
                ].map(([number, title, description], index) => (
                  <div
                    key={title}
                    className={`
                      py-4
                      ${index > 0 ? "sm:border-l sm:border-slate-200 sm:pl-5" : ""}
                    `}
                  >
                    <p
                      className="
                        text-[8px]
                        font-bold
                        tracking-[0.16em]
                        text-[#a61f46]
                      "
                    >
                      {number}
                    </p>

                    <p
                      className="
                        mt-2
                        text-[11px]
                        font-semibold
                        text-[#0a2230]
                      "
                    >
                      {title}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        leading-4
                        text-slate-400
                      "
                    >
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="
                relative
                z-10
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >
              <Link
                href="/explore"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-[6px]
                  bg-[#0a2230]
                  px-5
                  py-3
                  text-[12px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#153e57]
                "
              >
                Start in Explore
                <Arrow />
              </Link>

              <Link
                href="/sign-in"
                className="
                  inline-flex
                  items-center
                  rounded-[6px]
                  border
                  border-slate-200
                  bg-white/80
                  px-5
                  py-3
                  text-[12px]
                  font-semibold
                  text-[#0a2230]
                  transition
                  hover:border-slate-300
                  hover:bg-white
                "
              >
                Sign in
              </Link>
            </div>
          </div>


          {/* =====================================================
              RIGHT · PROFESSIONAL OPERATING LAYER
             ===================================================== */}
          <div
            className="
              relative
              overflow-hidden
              bg-[#071e2c]
              p-7
              text-white
              sm:p-9
              lg:p-10
              xl:p-12
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                bg-cover
                bg-center
                opacity-[0.105]
              "
              style={{
                backgroundImage:
                  'url("/visuals/portal/knowledge.png")',
              }}
            />

            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                bg-[linear-gradient(135deg,rgba(4,23,34,0.76)_0%,rgba(7,30,44,0.94)_52%,rgba(7,30,44,1)_100%)]
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                left-0
                top-0
                h-px
                w-full
                bg-gradient-to-r
                from-[#a61f46]/80
                via-white/20
                to-transparent
              "
            />

            <div className="relative z-10">
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-8
                  border-b
                  border-white/15
                  pb-6
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.19em]
                      text-red-300
                    "
                  >
                    Arknoz Pro
                  </p>

                  <h2
                    className="
                      mt-2
                      text-[27px]
                      font-semibold
                      leading-[1.05]
                      tracking-[-0.04em]
                    "
                  >
                    Explore. Operate. Grow. Measure.
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-lg
                      text-[11px]
                      leading-5
                      text-white/45
                    "
                  >
                    One connected operating layer for the professional Built World.
                  </p>
                </div>

                <span
                  className="
                    border
                    border-white/15
                    px-2.5
                    py-1.5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-white/45
                  "
                >
                  Pro
                </span>
              </div>

              <div className="mt-2">
                {[
                  [
                    "01",
                    "Define",
                    "Tell Arknoz what you are trying to achieve.",
                  ],
                  [
                    "02",
                    "Build context",
                    "Combine purpose, subject, place, constraints and relevant evidence.",
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
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="
                      grid
                      grid-cols-[42px_1fr]
                      gap-4
                      border-b
                      border-white/10
                      py-5
                      last:border-0
                    "
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        border
                        border-white/15
                        text-[8px]
                        font-semibold
                        text-white/40
                      "
                    >
                      {number}
                    </span>

                    <div>
                      <p
                        className="
                          text-[13px]
                          font-semibold
                          text-white
                        "
                      >
                        {title}
                      </p>

                      <p
                        className="
                          mt-1
                          max-w-xl
                          text-[11px]
                          leading-5
                          text-white/45
                        "
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="
                  mt-5
                  border-t
                  border-white/15
                  pt-5
                "
              >
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-white/35
                  "
                >
                  Built for
                </p>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-[10px]
                    leading-5
                    text-white/45
                  "
                >
                  Professionals · Students · Universities · Employers ·
                  Practices · Manufacturers · Researchers · Institutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          02 · SAME ARKNOZ NOW SYSTEM
          ========================================================= */}

      <ProNowHomePanel />
                  {/* =========================================================
          03 - ARKNOZ PRO NAVIGATOR
          ========================================================= */}

      <div id="arknoz-pro-navigator"><ProInteractiveJourney /></div>

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
                Free now. Pro capability later.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-500 lg:justify-self-end">
              Arknoz public access and Arknoz ID are free. Arknoz ID carries identity
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
