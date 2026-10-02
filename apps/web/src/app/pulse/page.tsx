import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import PulseSectionNav from "@/components/PulseSectionNav";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

export const metadata: Metadata = {
  title: "Pulse",
  description:
    "Live news, current affairs and developments from across the global Built World.",
};

const latest = [
  {
    category: "Infrastructure",
    title: "A new international transport hub enters operation",
    time: "38 min ago",
    position: "center 30%",
  },
  {
    category: "Architecture",
    title: "Tall timber development moves into its next phase",
    time: "1 hr ago",
    position: "center 45%",
  },
  {
    category: "Cities",
    title: "Climate-resilient district plan reshapes urban growth",
    time: "2 hrs ago",
    position: "center 55%",
  },
  {
    category: "Materials",
    title: "New façade technology moves toward commercial rollout",
    time: "3 hrs ago",
    position: "center 65%",
  },
  {
    category: "Sustainability",
    title: "Building standards accelerate the shift toward net zero",
    time: "4 hrs ago",
    position: "center 75%",
  },
];

const featured = [
  ["Education", "New centre advances Built World learning and research"],
  ["Construction", "Major construction programme enters delivery phase"],
  ["Products", "Modular building system launches for commercial use"],
  ["Business", "Built World companies expand across new global markets"],
  ["Technology", "Robotics milestone signals another shift in construction"],
];

const PULSE_IMAGES = [
  "/visuals/latest/magazine.png",
  "/visuals/latest/books.png",
  "/visuals/latest/video.png",
  "/visuals/latest/research.png",
  "/visuals/latest/education.png",
  "/visuals/latest/world.png",
] as const;

function pulseImage(index: number) {
  return (
    PULSE_IMAGES[
      index % PULSE_IMAGES.length
    ] ?? "/visuals/latest/world.png"
  );
}

export default function PulsePage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-950">
      <GlobalHeader showDiscoveryRibbon={false} />

      <main>
        {/* PULSE MASTHEAD */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1600px] px-5 py-5 lg:px-8">
            <div className="flex items-end gap-4">
              <h1 className="text-[46px] font-black leading-none tracking-[-0.045em] md:text-[54px]">
                PULSE
              </h1>

              <div className="mb-1 hidden h-9 w-px bg-slate-300 sm:block" />

              <p className="mb-1 text-sm font-medium text-slate-500 md:text-base">
                The Built World. Now.
              </p>
            </div>
          </div>
        </section>

        {/* STICKY PULSE SECTION BAR */}
        <section className="sticky top-[72px] z-40 border-b border-slate-200 bg-white/95 shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur">
          <div className="mx-auto flex max-w-[1600px] items-center gap-5 px-5 pt-2 lg:px-8">
            <div className="hidden shrink-0 items-center gap-2 pb-2 lg:flex">
              <span className="h-2 w-2 rounded-full bg-red-500" />

              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-950">
                Pulse
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <PulseSectionNav />
            </div>
          </div>
        </section>
        {/* LIVE STRIP */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1600px] items-center gap-5 overflow-hidden px-5 py-3 lg:px-8">
            <span className="shrink-0 rounded bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-white">
              Live
            </span>

            <div className="flex min-w-0 items-center gap-8 overflow-hidden text-xs font-semibold text-slate-700">
              <span className="whitespace-nowrap">
                Global infrastructure investment accelerates
              </span>
              <span className="text-slate-300">•</span>
              <span className="whitespace-nowrap">
                New material systems reach commercial deployment
              </span>
              <span className="text-slate-300">•</span>
              <span className="whitespace-nowrap">
                Major Built World projects move forward
              </span>
            </div>
          </div>
        </section>

        {/* HERO */}
        <section className="mx-auto max-w-[1600px] px-5 py-5 lg:px-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.72fr)_minmax(300px,0.72fr)]">
            <article className="group relative min-h-[470px] overflow-hidden rounded-xl bg-slate-900 text-white">
              <Image
                src="/visuals/latest/world.png"
                alt=""
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 55vw"
                className="object-cover transition duration-700 group-hover:scale-[1.015]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />

              <div className="relative flex min-h-[470px] flex-col justify-between p-6 md:p-8">
                <span className="w-fit rounded bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]">
                  Breaking
                </span>

                <div className="max-w-[760px]">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/75">
                    Architecture
                  </p>

                  <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.04em] md:text-5xl">
                    A new landmark signals the next chapter of the Built World
                  </h2>

                  <p className="mt-4 max-w-[700px] text-sm leading-6 text-white/80 md:text-base">
                    Architecture, technology and public life converge in one of
                    the most significant developments making headlines today.
                  </p>

                  <p className="mt-5 text-xs font-medium text-white/65">
                    World · 24 min ago · 4 min read
                  </p>
                </div>
              </div>
            </article>

            <div className="grid gap-4">
              {[
                ["Cities", "New sustainable urban district moves forward"],
                ["Materials", "Low-carbon material reaches commercial scale"],
                ["Technology", "AI-powered robotics reshape project delivery"],
              ].map(([category, title], index) => (
                <article
                  key={title}
                  className="group relative min-h-[146px] overflow-hidden rounded-xl bg-slate-900 text-white"
                >
                  <Image
                    src={pulseImage(index + 0)}
                    alt=""
                    fill
                    sizes="340px"
                    className="object-cover transition duration-700 group-hover:scale-[1.025]"
                    style={{
                      objectPosition: `center ${25 + index * 25}%`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />

                  <div className="relative flex min-h-[146px] flex-col justify-end p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/65">
                      {category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold leading-tight">
                      {title}
                    </h3>

                    <p className="mt-2 text-[11px] text-white/55">
                      {2 + index * 2} hrs ago · 3 min read
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="relative min-h-[245px] overflow-hidden rounded-xl bg-[#06192e] p-6 text-white">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Featured
                </p>

                <div className="mt-12">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/50">
                    Partner Feature
                  </p>

                  <h2 className="mt-3 max-w-[250px] text-3xl font-semibold leading-[1.05]">
                    Built World brands belong here.
                  </h2>

                  <p className="mt-4 max-w-[250px] text-sm leading-6 text-white/60">
                    Ideas, systems and solutions shaping the Built World.
                  </p>

                  <span className="mt-6 inline-flex rounded-lg border border-white/30 px-4 py-2 text-xs font-bold">
                    Discover solutions →
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-[0.03em]">
                    Trending Now
                  </h2>

                  <span className="text-[10px] font-bold uppercase text-red-500">
                    Live
                  </span>
                </div>

                <ol className="mt-3 divide-y divide-slate-100">
                  {[
                    "Major infrastructure programme announced",
                    "Tall timber project reaches new milestone",
                    "Updated building-energy rules released",
                    "Global transport hub begins operation",
                    "Net-zero standards expand worldwide",
                  ].map((item, index) => (
                    <li
                      key={item}
                      className="grid grid-cols-[25px_1fr_auto] gap-2 py-2.5"
                    >
                      <span className="text-[11px] font-black text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-[12px] font-semibold leading-4">
                        {item}
                      </span>

                      <span className="whitespace-nowrap text-[9px] text-slate-400">
                        {12 + index * 16}m
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>

        {/* LATEST */}
        <section id="latest" className="scroll-mt-32 mx-auto max-w-[1600px] px-5 pb-6 lg:px-8">
          <div className="flex items-center justify-between border-t border-slate-200 pt-5">
            <h2 className="text-lg font-black tracking-[-0.02em]">
              Latest News
            </h2>

            <span className="text-xs font-semibold text-slate-500">
              Updated continuously
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {latest.map((story) => (
              <article
                key={story.title}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <Image
                    src="/visuals/latest/research.png"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 20vw"
                    className="object-cover"
                    style={{ objectPosition: story.position }}
                  />
                </div>

                <div className="p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                    {story.category}
                  </p>

                  <h3 className="mt-1.5 text-sm font-bold leading-5">
                    {story.title}
                  </h3>

                  <p className="mt-2 text-[10px] text-slate-400">
                    {story.time} · 3 min read
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* HORIZONTAL AD */}
        <section className="mx-auto max-w-[1600px] px-5 pb-6 lg:px-8">
          <div className="flex min-h-[92px] items-center justify-between overflow-hidden rounded-xl bg-[#08182a] px-6 text-white md:px-10">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                Featured
              </p>

              <p className="mt-2 text-xl font-semibold md:text-2xl">
                Featured from across the Built World
              </p>
            </div>

            <span className="hidden rounded-lg border border-white/30 px-4 py-2 text-xs font-bold md:inline-flex">
              Learn more →
            </span>
          </div>
        </section>

        {/* FEATURED */}
        <section className="mx-auto max-w-[1600px] px-5 pb-7 lg:px-8">
          <div className="flex items-center justify-between border-t border-slate-200 pt-5">
            <h2 className="text-lg font-black tracking-[-0.02em]">
              Featured This Week
            </h2>

            <Link
              href="/pulse"
              className="text-xs font-bold text-slate-500 hover:text-slate-950"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {featured.map(([category, title], index) => (
              <article
                key={title}
                className="overflow-hidden rounded-lg border border-slate-200"
              >
                <div className="relative aspect-[16/8] bg-slate-100">
                  <Image
                    src={pulseImage(index + 1)}
                    alt=""
                    fill
                    sizes="20vw"
                    className="object-cover"
                    style={{
                      objectPosition: `center ${20 + index * 15}%`,
                    }}
                  />
                </div>

                <div className="p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-blue-700">
                    {category}
                  </p>

                  <h3 className="mt-1.5 text-sm font-bold leading-5">
                    {title}
                  </h3>

                  <p className="mt-2 text-[10px] text-slate-400">
                    {3 + index} hrs ago · 3 min read
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* ARCHITECTURE */}
        <section
          id="architecture"
          className="scroll-mt-32 mx-auto max-w-[1600px] px-5 py-7 lg:px-8"
        >
          <div className="flex items-end justify-between border-t border-slate-200 pt-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Pulse Stream
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.035em]">
                Architecture
              </h2>
            </div>

            <span className="text-xs font-bold text-slate-500">
              View all →
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">

            {/* LEAD STORY */}
            <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
                <Image
                  src="/visuals/latest/research.png"
                  alt=""
                  fill
                  sizes="58vw"
                  className="object-cover transition duration-700 hover:scale-[1.02]"
                  style={{ objectPosition: "center 30%" }}
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                  Architecture
                </p>

                <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.025em]">
                  New cultural and civic projects reshape the global design conversation
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Major practices, institutions and cities continue to redefine
                  public architecture across the Built World.
                </p>

                <p className="mt-auto pt-5 text-xs text-slate-400">
                  42 min ago · 5 min read
                </p>
              </div>
            </article>

            {/* STACKED STORIES */}
            <div className="grid gap-4 lg:grid-rows-2">
              {[
                [
                  "Adaptive Reuse",
                  "Adaptive reuse project brings new life to an industrial landmark",
                  "Existing structures are being reconsidered as valuable urban and cultural assets.",
                  "2 hrs ago · 3 min read",
                  "center 46%",
                ],
                [
                  "Global Practice",
                  "Global practice reveals next-generation mixed-use complex",
                  "Architecture, public space and new programme models converge in a major development.",
                  "3 hrs ago · 3 min read",
                  "center 68%",
                ],
              ].map(([category, title, summary, time, position]) => (
                <article
                  key={title}
                  className="grid h-full overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-[210px_1fr] lg:grid-cols-[0.9fr_1.1fr]"
                >
                  <div className="relative min-h-[190px] bg-slate-100 lg:min-h-0">
                    <Image
                      src="/visuals/latest/research.png"
                      alt=""
                      fill
                      sizes="28vw"
                      className="object-cover"
                      style={{ objectPosition: position }}
                    />
                  </div>

                  <div className="flex min-w-0 flex-col p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                      {category}
                    </p>

                    <h3 className="mt-2 text-base font-bold leading-6">
                      {title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {summary}
                    </p>

                    <p className="mt-auto pt-3 text-[10px] text-slate-400">
                      {time}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* CONSTRUCTION */}
        <section id="construction" className="scroll-mt-32 border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Pulse Stream
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.035em]">
                  Construction
                </h2>
              </div>

              <Link
                href="/pulse?section=construction"
                className="text-xs font-bold text-slate-500 hover:text-slate-950"
              >
                View all →
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Major transport project moves into construction",
                "Off-site manufacturing expands across large projects",
                "Digital site management tools enter wider use",
                "New delivery methods reduce programme risk",
              ].map((title, index) => (
                <article
                  key={title}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <Image
                      src={pulseImage(index + 2)}
                      alt=""
                      fill
                      sizes="25vw"
                      className="object-cover"
                      style={{
                        objectPosition: `center ${25 + index * 18}%`,
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
                      Construction
                    </p>

                    <h3 className="mt-2 text-sm font-bold leading-5">
                      {title}
                    </h3>

                    <p className="mt-3 text-[10px] text-slate-400">
                      {1 + index} hrs ago
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MID-PAGE EDITORIAL + RIGHT RAIL */}
        <section className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

            {/* MAIN EDITORIAL */}
            <div className="min-w-0">
              <div className="flex items-end justify-between border-t border-slate-200 pt-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Built World Briefing
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-[-0.035em]">
                    In Focus
                  </h2>
                </div>

                <span className="text-xs font-bold text-slate-400">
                  Updated continuously
                </span>
              </div>

              <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="relative aspect-[16/8] overflow-hidden bg-slate-100">
                    <Image
                      src="/visuals/latest/books.png"
                      alt=""
                      fill
                      sizes="55vw"
                      className="object-cover"
                      style={{ objectPosition: "center 42%" }}
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                      Infrastructure
                    </p>

                    <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.025em]">
                      Major projects reshape mobility, cities and regional growth
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Transport, infrastructure and urban investment continue to
                      change how regions connect, develop and compete.
                    </p>

                    <p className="mt-4 text-xs text-slate-400">
                      38 min ago · 4 min read
                    </p>
                  </div>
                </article>

                <div className="divide-y divide-slate-200 border-y border-slate-200">
                  {[
                    [
                      "Architecture",
                      "New design approaches respond to changing urban priorities",
                    ],
                    [
                      "Construction",
                      "Delivery teams adopt new methods across complex projects",
                    ],
                    [
                      "Cities",
                      "Public realm investment becomes central to regeneration",
                    ],
                    [
                      "Technology",
                      "Digital tools move further into everyday project delivery",
                    ],
                  ].map(([category, title], index) => (
                    <article
                      key={title}
                      className="grid grid-cols-[88px_1fr] gap-3 py-3"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={pulseImage(index + 3)}
                          alt=""
                          fill
                          sizes="88px"
                          className="object-cover"
                          style={{
                            objectPosition: `center ${28 + index * 17}%`,
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          {category}
                        </p>

                        <h3 className="mt-1 text-sm font-bold leading-5">
                          {title}
                        </h3>

                        <p className="mt-2 text-[10px] text-slate-400">
                          {1 + index}h ago
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <aside className="h-fit self-start space-y-4">

              {/* PREMIUM / SPONSORED */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src="/visuals/latest/world.png"
                    alt=""
                    fill
                    sizes="340px"
                    className="object-cover opacity-65"
                    style={{ objectPosition: "center 60%" }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/50">
                      Sponsored
                    </p>

                    <h3 className="mt-2 text-xl font-black leading-6">
                      Systems, materials and technologies shaping tomorrow’s projects
                    </h3>

                    <p className="mt-3 text-xs leading-5 text-white/55">
                      Partner stories and launches presented within Arknoz Pulse.
                    </p>

                    <span className="mt-4 inline-flex rounded-full border border-white/25 px-4 py-2 text-[10px] font-bold">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>

              {/* MOST READ */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-[0.08em]">
                    Most Read
                  </h3>

                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Today
                  </span>
                </div>

                <div className="mt-3 divide-y divide-slate-200">
                  {[
                    "Major global infrastructure programmes move forward",
                    "AI changes how design teams coordinate projects",
                    "New materials target lower embodied carbon",
                  ].map((title, index) => (
                    <article
                      key={title}
                      className="grid grid-cols-[28px_1fr] gap-3 py-3"
                    >
                      <span className="text-lg font-black leading-none text-slate-200">
                        {index + 1}
                      </span>

                      <h4 className="text-xs font-bold leading-5">
                        {title}
                      </h4>
                    </article>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
        {/* CITIES + INFRASTRUCTURE */}
        <section id="cities-infrastructure" className="scroll-mt-32 mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          <div className="grid gap-7 xl:grid-cols-2">
            <div>
              <div className="flex items-end justify-between">
                <h2 id="cities" className="scroll-mt-32 text-2xl font-black tracking-[-0.035em]">
                  Cities
                </h2>

                <Link
                  href="/pulse?section=cities"
                  className="text-xs font-bold text-slate-500 hover:text-slate-950"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  "Urban regeneration programme transforms a former industrial district",
                  "New mobility plan prioritises public transport and walkability",
                  "Climate adaptation moves into mainstream city planning",
                ].map((title, index) => (
                  <article
                    key={title}
                    className="grid grid-cols-[120px_1fr] gap-4 border-t border-slate-200 pt-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={pulseImage(index + 4)}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                        style={{
                          objectPosition: `center ${35 + index * 20}%`,
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                        Cities
                      </p>

                      <h3 className="mt-1 text-sm font-bold leading-5">
                        {title}
                      </h3>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {2 + index} hrs ago
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between">
                <h2 id="infrastructure" className="scroll-mt-32 text-2xl font-black tracking-[-0.035em]">
                  Infrastructure
                </h2>

                <Link
                  href="/pulse?section=infrastructure"
                  className="text-xs font-bold text-slate-500 hover:text-slate-950"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  "New airport terminal enters final delivery phase",
                  "Rail investment reshapes regional connectivity",
                  "Large-scale water infrastructure programme moves ahead",
                ].map((title, index) => (
                  <article
                    key={title}
                    className="grid grid-cols-[120px_1fr] gap-4 border-t border-slate-200 pt-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={pulseImage(index + 5)}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                        style={{
                          objectPosition: `center ${55 + index * 12}%`,
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                        Infrastructure
                      </p>

                      <h3 className="mt-1 text-sm font-bold leading-5">
                        {title}
                      </h3>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {3 + index} hrs ago
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS + MATERIALS */}
        <section id="materials" className="scroll-mt-32 border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  New + Notable
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.035em]">
                  Products & Materials
                </h2>
              </div>

              <Link
                href="/pulse?section=materials"
                className="text-xs font-bold text-slate-500 hover:text-slate-950"
              >
                View all →
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                "New façade system targets lower embodied carbon",
                "Modular structural solution enters commercial use",
                "Building envelope technology improves thermal performance",
                "Circular material platform expands globally",
                "Next-generation lighting system launches",
              ].map((title, index) => (
                <article
                  key={title}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <div className="relative aspect-square bg-slate-100">
                    <Image
                      src={pulseImage(index + 1)}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover"
                      style={{
                        objectPosition: `center ${20 + index * 15}%`,
                      }}
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                      {index % 2 === 0 ? "Product" : "Material"}
                    </p>

                    <h3 className="mt-1.5 text-sm font-bold leading-5">
                      {title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* LONG FEATURE STRIP */}
        <section className="border-y border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
            <article className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] lg:grid-cols-[1.55fr_0.85fr]">

              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[390px]">
                <Image
                  src="/visuals/latest/video.png"
                  alt=""
                  fill
                  sizes="70vw"
                  className="object-cover opacity-75"
                  style={{ objectPosition: "center 50%" }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-black/30" />

                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm">
                  Featured
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 md:p-9">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                    Sponsored · Built World Feature
                  </p>

                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-4xl">
                    A closer look at the systems shaping the next generation of projects
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/55">
                    A premium space for major launches, technologies, materials,
                    companies and ideas relevant to the global Built World.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Partner Feature
                  </span>

                  <span className="rounded-full border border-white/25 px-4 py-2 text-[10px] font-bold">
                    Explore story →
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
        {/* TECHNOLOGY + AI */}
        <section id="technology" className="scroll-mt-32 border-t border-slate-200 bg-[#071a2d] text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                  Digital Built World
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] md:text-3xl">
                  Technology & AI
                </h2>
              </div>

              <Link
                href="/pulse?section=technology"
                className="text-xs font-bold text-white/55 hover:text-white"
              >
                View all →
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
              <article className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]">
                <div className="relative aspect-[16/8] overflow-hidden bg-white/5">
                  <Image
                    src="/visuals/latest/video.png"
                    alt=""
                    fill
                    sizes="45vw"
                    className="object-cover opacity-80"
                    style={{ objectPosition: "center 38%" }}
                  />
                </div>

                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                    AI + Built Environment
                  </p>

                  <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-0.025em]">
                    AI moves deeper into design, delivery and building operations
                  </h3>

                  <p className="mt-3 max-w-[680px] text-sm leading-6 text-white/55">
                    New tools are changing how projects are designed, coordinated,
                    constructed and managed across the Built World.
                  </p>

                  <p className="mt-4 text-xs text-white/35">
                    1 hr ago · 5 min read
                  </p>
                </div>
              </article>

              {[
                [
                  "Construction Tech",
                  "Robotics and autonomous systems move from pilots to active sites",
                ],
                [
                  "Digital Twins",
                  "Connected building data becomes part of mainstream asset operations",
                ],
              ].map(([category, title], index) => (
                <article
                  key={title}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                    <Image
                      src={pulseImage(index + 2)}
                      alt=""
                      fill
                      sizes="28vw"
                      className="object-cover opacity-75"
                      style={{
                        objectPosition: `center ${48 + index * 22}%`,
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/40">
                      {category}
                    </p>

                    <h3 className="mt-2 text-base font-bold leading-6">
                      {title}
                    </h3>

                    <p className="mt-3 text-[10px] text-white/30">
                      {2 + index} hrs ago
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SUSTAINABILITY + BUSINESS */}
        <section id="sustainability-business" className="scroll-mt-32 mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
          <div className="grid gap-10 xl:grid-cols-2">

            {/* SUSTAINABILITY */}
            <div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Climate + Resilience
                  </p>

                  <h2 id="sustainability" className="scroll-mt-32 mt-1 text-2xl font-black tracking-[-0.035em]">
                    Sustainability
                  </h2>
                </div>

                <Link
                  href="/pulse?section=sustainability"
                  className="text-xs font-bold text-slate-500 hover:text-slate-950"
                >
                  View all →
                </Link>
              </div>

              <article className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-[16/7] bg-slate-100">
                  <Image
                    src="/visuals/latest/books.png"
                    alt=""
                    fill
                    sizes="45vw"
                    className="object-cover"
                    style={{ objectPosition: "center 62%" }}
                  />
                </div>

                <div className="p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                    Sustainability
                  </p>

                  <h3 className="mt-2 text-xl font-black leading-7">
                    Carbon, resilience and circularity move into core project decisions
                  </h3>
                </div>
              </article>

              <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                {[
                  "Cities accelerate climate adaptation programmes",
                  "Low-carbon materials gain wider specification across major projects",
                  "Reuse and circular construction reshape development strategies",
                ].map((title, index) => (
                  <article
                    key={title}
                    className="grid grid-cols-[28px_1fr_auto] items-start gap-3 py-3"
                  >
                    <span className="text-sm font-black text-slate-300">
                      0{index + 1}
                    </span>

                    <h3 className="text-sm font-bold leading-5">
                      {title}
                    </h3>

                    <span className="text-[10px] text-slate-400">
                      {2 + index}h
                    </span>
                  </article>
                ))}
              </div>
            </div>

            {/* BUSINESS */}
            <div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Markets + Companies
                  </p>

                  <h2 id="business" className="scroll-mt-32 mt-1 text-2xl font-black tracking-[-0.035em]">
                    Business
                  </h2>
                </div>

                <Link
                  href="/pulse?section=business"
                  className="text-xs font-bold text-slate-500 hover:text-slate-950"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  [
                    "Investment",
                    "Built World investment shifts toward infrastructure, technology and resilience",
                  ],
                  [
                    "Companies",
                    "Global engineering and design groups expand into new markets",
                  ],
                  [
                    "Real Estate",
                    "Developers rethink mixed-use strategy as urban demand changes",
                  ],
                  [
                    "Industry",
                    "Construction supply chains enter another phase of consolidation",
                  ],
                  [
                    "Markets",
                    "Major project pipelines strengthen across multiple regions",
                  ],
                ].map(([category, title], index) => (
                  <article
                    key={title}
                    className="grid grid-cols-[92px_1fr] gap-4 border-t border-slate-200 pt-3"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={pulseImage(index + 3)}
                        alt=""
                        fill
                        sizes="92px"
                        className="object-cover"
                        style={{
                          objectPosition: `center ${25 + index * 14}%`,
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                        {category}
                      </p>

                      <h3 className="mt-1 text-sm font-bold leading-5">
                        {title}
                      </h3>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {1 + index} hrs ago
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* SECOND EDITORIAL + RIGHT RAIL */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

              {/* PULSE BRIEFING */}
              <div className="min-w-0">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Pulse Briefing
                    </p>

                    <h2 className="mt-1 text-2xl font-black tracking-[-0.035em]">
                      What Matters Now
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    Latest
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    [
                      "Business",
                      "Investment continues to move toward infrastructure, technology and resilient cities",
                    ],
                    [
                      "Sustainability",
                      "Carbon performance becomes a mainstream project and asset decision",
                    ],
                    [
                      "Technology",
                      "AI workflows expand across design, engineering and construction",
                    ],
                    [
                      "Practice",
                      "Built World firms rethink skills, delivery models and global growth",
                    ],
                  ].map(([category, title], index) => (
                    <article
                      key={title}
                      className="grid grid-cols-[130px_1fr] gap-4 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={pulseImage(index + 4)}
                          alt=""
                          fill
                          sizes="130px"
                          className="object-cover"
                          style={{
                            objectPosition: `center ${25 + index * 18}%`,
                          }}
                        />
                      </div>

                      <div className="py-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                          {category}
                        </p>

                        <h3 className="mt-1 text-sm font-bold leading-5">
                          {title}
                        </h3>

                        <p className="mt-2 text-[10px] text-slate-400">
                          {1 + index} hrs ago
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 lg:grid-cols-3">
                  {[
                    "New project announcements across major global cities",
                    "Construction supply chains respond to changing demand",
                    "Design and engineering firms expand specialist capabilities",
                  ].map((title, index) => (
                    <article key={title} className="border-l border-slate-200 pl-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                        Quick Read
                      </p>

                      <h3 className="mt-1 text-sm font-bold leading-5">
                        {title}
                      </h3>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {5 + index}h ago
                      </p>
                    </article>
                  ))}
                </div>

                {/* PULSE SPOTLIGHT FILL PANEL */}
                <article className="mt-5 grid overflow-hidden rounded-2xl bg-[#071a2d] text-white md:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative min-h-[240px] overflow-hidden">
                    <Image
                      src="/visuals/latest/research.png"
                      alt=""
                      fill
                      sizes="45vw"
                      className="object-cover opacity-75"
                      style={{ objectPosition: "center 58%" }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#071a2d]/30" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-slate-900">
                      Sponsored
                    </span>
                  </div>

                  <div className="flex flex-col justify-between p-6 md:p-7">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                        Pulse Spotlight
                      </p>

                      <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em]">
                        Where Built World brands, ideas and major developments get noticed
                      </h3>

                      <p className="mt-3 max-w-[540px] text-sm leading-6 text-white/55">
                        A premium editorial-format space for launches, materials,
                        technology, projects and industry stories relevant to the
                        global Built World.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-white/35">
                        Partner Feature
                      </span>

                      <span className="rounded-full border border-white/25 px-4 py-2 text-[10px] font-bold">
                        Explore →
                      </span>
                    </div>
                  </div>
                </article>
              </div>

              {/* SECOND RIGHT RAIL */}
              <aside className="h-fit self-start space-y-4">

                {/* COMPACT PREMIUM AD */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="relative aspect-[16/7] bg-slate-100">
                    <Image
                      src="/visuals/latest/education.png"
                      alt=""
                      fill
                      sizes="340px"
                      className="object-cover"
                      style={{ objectPosition: "center 30%" }}
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.15em] text-slate-600">
                      Sponsored
                    </span>
                  </div>

                  <div className="p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                      Partner Spotlight
                    </p>

                    <h3 className="mt-2 text-base font-black leading-5">
                      A premium place for Built World brands, launches and ideas
                    </h3>

                    <p className="mt-2 text-[11px] leading-4 text-slate-500">
                      Integrated into the Pulse editorial environment without
                      interrupting the reading experience.
                    </p>

                    <span className="mt-4 inline-flex text-[10px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                      Discover →
                    </span>
                  </div>
                </div>

                {/* LIVE UPDATES */}
                <div className="rounded-xl bg-[#071a2d] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/40">
                        Live
                      </p>

                      <h3 className="mt-1 text-lg font-black">
                        Updates
                      </h3>
                    </div>

                    <span className="h-2 w-2 rounded-full bg-red-500" />
                  </div>

                  <div className="mt-4 divide-y divide-white/10">
                    {[
                      ["12 min", "Major project announcement moves across the global Built World"],
                      ["26 min", "New material system launches for commercial projects"],
                      ["41 min", "Architecture practice reveals international development"],
                    ].map(([time, title]) => (
                      <article key={title} className="py-3">
                        <div className="grid grid-cols-[48px_1fr] gap-3">
                          <span className="text-[9px] font-bold text-white/35">
                            {time}
                          </span>

                          <h4 className="text-xs font-bold leading-5 text-white/85">
                            {title}
                          </h4>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                      View all live updates →
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
        {/* RESEARCH + EDUCATION */}
        <section id="research-education" className="scroll-mt-32 border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
            <div className="grid items-start gap-8 xl:grid-cols-2">

              {/* RESEARCH */}
              <div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Evidence + Discovery
                    </p>

                    <h2 id="research" className="scroll-mt-32 mt-1 text-2xl font-black tracking-[-0.035em]">
                      Research
                    </h2>
                  </div>

                  <Link
                    href="/pulse?section=research"
                    className="text-xs font-bold text-slate-500 hover:text-slate-950"
                  >
                    View all →
                  </Link>
                </div>

                <article className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="relative aspect-[16/7] bg-slate-100">
                    <Image
                      src="/visuals/latest/education.png"
                      alt=""
                      fill
                      sizes="45vw"
                      className="object-cover"
                      style={{ objectPosition: "center 35%" }}
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#17315c]">
                      Research
                    </p>

                    <h3 className="mt-2 text-xl font-black leading-7">
                      New studies examine how cities, buildings and infrastructure are changing
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Research from universities, institutes and industry is reshaping
                      how the Built World understands performance, climate and technology.
                    </p>
                  </div>
                </article>

                <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                  {[
                    "Study maps emerging approaches to low-carbon construction",
                    "Researchers test new methods for healthier indoor environments",
                    "Urban research explores changing patterns of density and mobility",
                  ].map((title, index) => (
                    <article
                      key={title}
                      className="grid grid-cols-[30px_1fr_auto] gap-3 py-3"
                    >
                      <span className="text-sm font-black text-slate-300">
                        0{index + 1}
                      </span>

                      <h3 className="text-sm font-bold leading-5">
                        {title}
                      </h3>

                      <span className="text-[10px] text-slate-400">
                        {3 + index}h
                      </span>
                    </article>
                  ))}
                </div>
              </div>

              {/* EDUCATION */}
              <div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Schools + Learning
                    </p>

                    <h2 id="education" className="scroll-mt-32 mt-1 text-2xl font-black tracking-[-0.035em]">
                      Education
                    </h2>
                  </div>

                  <Link
                    href="/pulse?section=education"
                    className="text-xs font-bold text-slate-500 hover:text-slate-950"
                  >
                    View all →
                  </Link>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    [
                      "Architecture Schools",
                      "Studios rethink how future architects learn design and technology",
                    ],
                    [
                      "Engineering Education",
                      "Universities expand interdisciplinary Built World programmes",
                    ],
                    [
                      "Skills",
                      "Digital construction skills become central to professional training",
                    ],
                    [
                      "Students",
                      "Global student competitions surface new ideas for cities and climate",
                    ],
                    [
                      "Professional Learning",
                      "Short-form specialist education grows across the construction sector",
                    ],
                  ].map(([category, title], index) => (
                    <article
                      key={title}
                      className="grid grid-cols-[96px_1fr] gap-4 border-t border-slate-200 pt-3"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={pulseImage(index + 5)}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                          style={{
                            objectPosition: `center ${30 + index * 13}%`,
                          }}
                        />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          {category}
                        </p>

                        <h3 className="mt-1 text-sm font-bold leading-5">
                          {title}
                        </h3>

                        <p className="mt-2 text-[10px] text-slate-400">
                          {1 + index} hrs ago
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORLD PULSE */}
        <section id="world" className="scroll-mt-32 mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Across the Built World
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] md:text-3xl">
                World Pulse
              </h2>
            </div>

            <Link
              href="/pulse?section=world"
              className="text-xs font-bold text-slate-500 hover:text-slate-950"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [
                "Asia",
                "Major urban and infrastructure programmes continue across fast-growing cities",
              ],
              [
                "Europe",
                "Adaptive reuse, decarbonisation and housing remain central to development",
              ],
              [
                "Middle East",
                "Large-scale city, tourism and infrastructure projects advance",
              ],
              [
                "Africa",
                "Transport, housing and resilient infrastructure investment expands",
              ],
              [
                "Americas",
                "Cities focus on regeneration, housing, mobility and climate resilience",
              ],
            ].map(([region, title], index) => (
              <article
                key={region}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={pulseImage(index + 0)}
                    alt=""
                    fill
                    sizes="20vw"
                    className="object-cover"
                    style={{
                      objectPosition: `center ${20 + index * 16}%`,
                    }}
                  />
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#17315c]">
                    {region}
                  </p>

                  <h3 className="mt-2 text-sm font-bold leading-5">
                    {title}
                  </h3>

                  <p className="mt-3 text-[10px] text-slate-400">
                    Updated {1 + index}h ago
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* WATCH */}
        <section className="bg-[#0b1118] text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-9 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                  Arknoz Video
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.035em] md:text-3xl">
                  Watch
                </h2>
              </div>

              <Link
                href="/pulse?section=video"
                className="text-xs font-bold text-white/50 hover:text-white"
              >
                View all →
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                <div className="relative aspect-[16/8] overflow-hidden bg-white/5">
                  <Image
                    src="/visuals/latest/world.png"
                    alt=""
                    fill
                    sizes="60vw"
                    className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.02]"
                    style={{ objectPosition: "center 40%" }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                  <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-black text-slate-950">
                    ▶
                  </div>

                  <div className="absolute bottom-5 left-20 right-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/55">
                      Featured Video
                    </p>

                    <h3 className="mt-1 max-w-[700px] text-xl font-black leading-7 md:text-2xl">
                      Inside the projects, technologies and people shaping the Built World
                    </h3>
                  </div>
                </div>
              </article>

              <div className="grid gap-3">
                {[
                  [
                    "Architecture",
                    "Inside a new generation of civic architecture",
                    "06:24",
                  ],
                  [
                    "Construction",
                    "How digital delivery is changing major project sites",
                    "04:48",
                  ],
                  [
                    "Technology",
                    "AI, robotics and the next construction workflow",
                    "08:12",
                  ],
                ].map(([category, title, duration], index) => (
                  <article
                    key={title}
                    className="grid grid-cols-[135px_1fr] gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-2"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={pulseImage(index + 2)}
                        alt=""
                        fill
                        sizes="135px"
                        className="object-cover opacity-75"
                        style={{
                          objectPosition: `center ${30 + index * 22}%`,
                        }}
                      />

                      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold">
                        {duration}
                      </span>
                    </div>

                    <div className="py-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                        {category}
                      </p>

                      <h3 className="mt-1 text-sm font-bold leading-5">
                        {title}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MAGAZINE + BOOKS */}
        <section id="magazine-books" className="scroll-mt-32 mx-auto max-w-[1600px] px-5 py-9 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[1.35fr_1fr]">

            {/* MAGAZINE */}
            <div id="magazine" className="scroll-mt-32 overflow-hidden rounded-2xl border border-slate-200 bg-[#f2efe8]">
              <div className="grid min-h-[390px] md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative min-h-[300px] overflow-hidden bg-slate-200">
                  <Image
                    src="/visuals/latest/magazine.png"
                    alt=""
                    fill
                    sizes="40vw"
                    className="object-cover"
                    style={{ objectPosition: "center 28%" }}
                  />

                  <div className="absolute inset-0 bg-black/15" />

                  <div className="absolute left-5 top-5 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      ARKNOZ
                    </p>

                    <p className="mt-1 text-3xl font-black tracking-[-0.05em]">
                      PULSE
                    </p>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/65">
                      Monthly · Issue 01
                    </p>

                    <h3 className="mt-2 text-2xl font-black leading-tight">
                      The Built World Now
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-7 md:p-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                      Arknoz Magazine
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                      A monthly view of the Built World.
                    </h2>

                    <p className="mt-4 max-w-[520px] text-sm leading-6 text-slate-600">
                      Projects, ideas, materials, cities, technology, research and
                      people brought together as a curated monthly edition.
                    </p>
                  </div>

                  <Link
                    href="/pulse?section=magazine"
                    className="mt-7 w-fit rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Explore Magazine →
                  </Link>
                </div>
              </div>
            </div>

            {/* BOOKS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Reading
                  </p>

                  <h2 id="books" className="scroll-mt-32 mt-1 text-2xl font-black tracking-[-0.035em]">
                    Books
                  </h2>
                </div>

                <Link
                  href="/pulse?section=books"
                  className="text-xs font-bold text-slate-500 hover:text-slate-950"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["Cities", "Thinking about the future of urban life"],
                  ["Architecture", "Ideas shaping contemporary practice"],
                  ["Climate", "Designing for a changing planet"],
                ].map(([category, title], index) => (
                  <article key={title}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={pulseImage(index + 0)}
                        alt=""
                        fill
                        sizes="15vw"
                        className="object-cover"
                        style={{
                          objectPosition: `center ${25 + index * 25}%`,
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-[8px] font-black uppercase tracking-[0.13em] text-white/60">
                          {category}
                        </p>

                        <p className="mt-1 text-xs font-bold leading-4">
                          Arknoz Books
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-2 text-xs font-bold leading-4">
                      {title}
                    </h3>
                  </article>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-xs leading-5 text-slate-500">
                  Selected books, publications and long-form ideas for professionals,
                  students, researchers and everyone interested in the Built World.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* PARTNER FEATURE */}
        <section className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#071a2d] px-7 py-8 text-white md:px-10 md:py-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
              Partner Feature
            </p>

            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-[760px] text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
                  Ideas, systems and solutions shaping the Built World.
                </h2>

                <p className="mt-4 max-w-[700px] text-sm leading-6 text-white/60">
                  Selected partner stories, launches and industry developments
                  presented within the Arknoz Pulse editorial environment.
                </p>
              </div>

              <span className="w-fit rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold">
                Explore feature →
              </span>
            </div>
          </div>
        </section>
      </main>

      <UniversalPublicLastScreen />
    </div>
  );
}