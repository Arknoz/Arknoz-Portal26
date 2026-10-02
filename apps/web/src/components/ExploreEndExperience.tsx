import Link from "next/link";


type PartnerNetworkItem = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

const partnerNetworkRows: PartnerNetworkItem[][] = [
  [
    {
      title: "Technology",
      subtitle: "Digital · Systems · Innovation",
      href: "/products",
      image: "/visuals/portal/product.png",
    },
    {
      title: "University & Academic",
      subtitle: "Education · Research · People",
      href: "/universities",
      image: "/visuals/portal/education.png",
    },
    {
      title: "Industry",
      subtitle: "Companies · Delivery · Expertise",
      href: "/organisations",
      image: "/visuals/portal/organisation.png",
    },
    {
      title: "Knowledge & Research",
      subtitle: "Ideas · Evidence · References",
      href: "/knowledge",
      image: "/visuals/portal/knowledge.png",
    },
    {
      title: "Institutional",
      subtitle: "Institutions · Networks",
      href: "/organisations",
      image: "/visuals/portal/organisation.png",
    },
    {
      title: "Professional Bodies",
      subtitle: "Standards · Professions",
      href: "/organisations",
      image: "/visuals/portal/people.png",
    },
  ],

  [
    {
      title: "Design Studios",
      subtitle: "Architecture · Design",
      href: "/organisations",
      image: "/visuals/portal/project.png",
    },
    {
      title: "Manufacturers",
      subtitle: "Materials · Products · Systems",
      href: "/products",
      image: "/visuals/portal/product.png",
    },
    {
      title: "Research Institutions",
      subtitle: "Research · Innovation",
      href: "/knowledge",
      image: "/visuals/portal/knowledge.png",
    },
    {
      title: "Education",
      subtitle: "Learning · Programmes",
      href: "/learning",
      image: "/visuals/portal/education.png",
    },
    {
      title: "Innovation Networks",
      subtitle: "Community · Collaboration",
      href: "/community",
      image: "/visuals/portal/opportunity.png",
    },
    {
      title: "Strategic & Global",
      subtitle: "Regions · Global Connections",
      href: "/global",
      image: "/visuals/portal/place.png",
    },
  ],
];


export function ArknozPartnersExperience() {
  return (
    <section
      data-explore-sequence="partners"
      className="
        relative
        isolate
        z-30
        border-b
        border-slate-200
        bg-[#f5f7fb]
        px-5
        py-8
        sm:px-8
        lg:px-8
        lg:py-10
      "
      style={{
        backgroundColor: "#f5f7fb",
        backgroundImage: "none",
      }}
    >
      <style>{`
        .arknoz-partner-running-track {
          display: flex;
          width: max-content;
          gap: 12px;
          will-change: transform;
        }

        .arknoz-partner-running-forward {
          animation:
            arknozPartnerRunningForward
            34s
            linear
            infinite;
        }

        .arknoz-partner-running-reverse {
          animation:
            arknozPartnerRunningReverse
            38s
            linear
            infinite;
        }

        @keyframes arknozPartnerRunningForward {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes arknozPartnerRunningReverse {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        .arknoz-partner-running-row:hover
        .arknoz-partner-running-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .arknoz-partner-running-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>


      {/* SOLID SECTION SURFACE */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#f5f7fb]"
        style={{
          backgroundImage: "none",
        }}
      />


      <div className="relative mx-auto max-w-[1720px]">

        {/* HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
                Arknoz Partners
              </p>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <p className="text-[10px] font-semibold text-slate-400">
                Connected network
              </p>

            </div>

            <h2 className="mt-2 text-[30px] font-semibold leading-[1] tracking-[-0.045em] text-[#0a2230] sm:text-[36px]">
              Partner ecosystem across the Built World.
            </h2>
          </div>


          <p className="max-w-[540px] text-[12px] leading-5 text-slate-500 lg:text-right">
            Explore organisations, academia, industry, research and professional
            networks connected across Arknoz.
          </p>

        </div>


        {/* MAIN PARTNER EXPERIENCE */}
        <div className="mt-5 grid gap-3 lg:grid-cols-[0.72fr_1.28fr]">

          {/* CLICKABLE HERO */}
          <Link
            href="/organisations"
            className="
              group
              relative
              min-h-[360px]
              overflow-hidden
              rounded-[8px]
              border
              border-slate-200
              bg-[#081f2d]
              shadow-[0_10px_30px_rgba(15,23,42,0.06)]
              transition-all
              duration-500
              hover:-translate-y-[3px]
              hover:shadow-[0_18px_42px_rgba(15,23,42,0.13)]
            "
          >
            <img
              src="/visuals/portal/organisation.png"
              alt=""
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-[1400ms]
                ease-out
                group-hover:scale-[1.04]
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#03131d]/95 via-[#061722]/46 to-black/10" />


            <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-6 sm:p-7">

              <div className="flex items-center justify-between">

                <p className="text-[10px] font-bold tracking-[0.08em] text-white/75">
                  Partner Network
                </p>

                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/25 text-sm text-white transition group-hover:bg-white group-hover:text-[#0a2230]">
                  →
                </span>

              </div>


              <div>
                <h3 className="max-w-[15ch] text-[30px] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-[34px]">
                  Discover partner organisations.
                </h3>

                <p className="mt-3 max-w-[48ch] text-[11px] leading-5 text-white/65">
                  Explore organisations, institutions, universities and
                  professional networks across the Built World.
                </p>

                <p className="mt-5 text-[10px] font-semibold text-white/75">
                  Explore organisations →
                </p>
              </div>

            </div>
          </Link>


          {/* RUNNING PARTNER NETWORK */}
          <div
            className="
              overflow-hidden
              rounded-[8px]
              border
              border-slate-200
              bg-white
              shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
            style={{
              backgroundColor: "#ffffff",
              backgroundImage: "none",
            }}
          >

            <div className="flex items-center justify-between gap-5 border-b border-slate-200 px-5 py-4 sm:px-6">

              <div>
                <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
                  Explore partner networks
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Select any network to continue exploring Arknoz.
                </p>
              </div>

              <Link
                href="/organisations"
                className="group inline-flex items-center gap-2 text-[10px] font-semibold text-[#0a2230]"
              >
                All organisations
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>


            <div className="overflow-hidden py-3">

              {partnerNetworkRows.map((row, rowIndex) => (

                <div
                  key={rowIndex}
                  className="arknoz-partner-running-row overflow-hidden py-1.5"
                >

                  <div
                    className={`
                      arknoz-partner-running-track
                      ${
                        rowIndex % 2 === 0
                          ? "arknoz-partner-running-forward"
                          : "arknoz-partner-running-reverse"
                      }
                    `}
                  >

                    {[...row, ...row].map((item, index) => (

                      <Link
                        key={`${item.title}-${index}`}
                        href={item.href}
                        aria-hidden={
                          index >= row.length
                            ? true
                            : undefined
                        }
                        tabIndex={
                          index >= row.length
                            ? -1
                            : undefined
                        }
                        className="
                          group
                          relative
                          h-[142px]
                          w-[250px]
                          shrink-0
                          overflow-hidden
                          rounded-[6px]
                          border
                          border-slate-200
                          bg-[#081f2d]
                          transition-all
                          duration-500
                          hover:-translate-y-[2px]
                          hover:shadow-[0_12px_28px_rgba(15,23,42,0.16)]
                        "
                      >

                        <img
                          src={item.image}
                          alt=""
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-[1.05]
                          "
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#03131d]/95 via-[#061722]/42 to-black/10" />


                        <div className="absolute inset-x-0 bottom-0 z-10 p-4">

                          <p className="text-[9px] font-semibold tracking-[0.06em] text-white/55">
                            Partner Network
                          </p>

                          <div className="mt-1 flex items-end justify-between gap-4">

                            <div>
                              <h3 className="text-[17px] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
                                {item.title}
                              </h3>

                              <p className="mt-1 text-[9px] leading-4 text-white/55">
                                {item.subtitle}
                              </p>
                            </div>

                            <span className="text-sm text-white/70 transition-transform group-hover:translate-x-1">
                              →
                            </span>

                          </div>

                        </div>

                      </Link>

                    ))}

                  </div>

                </div>

              ))}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export function YourArknozExperience() {
  return (
    <section
      data-explore-sequence="your-arknoz"
      className="
        relative
        isolate
        border-b
        border-slate-200
        bg-[#f5f7fb]
        px-5
        py-8
        sm:px-8
        lg:px-8
        lg:py-10
      "
      style={{
        backgroundColor: "#f5f7fb",
        backgroundImage: "none",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#f5f7fb]"
      />

      <div
        className="
          mx-auto
          grid
          max-w-[1720px]
          overflow-hidden
          rounded-[10px]
          border
          border-slate-200
          bg-[#081f2d]
          text-white
          shadow-[0_18px_50px_rgba(15,23,42,0.08)]
          lg:grid-cols-[1.25fr_.75fr]
        "
      >
        {/* MESSAGE */}
        <div className="px-7 py-7 sm:px-9 lg:px-10 lg:py-9">

          <div className="flex items-center gap-3">
            <p className="text-[10px] font-bold tracking-[0.08em] text-red-400">
              Your Arknoz
            </p>

            <span className="h-1 w-1 rounded-full bg-white/25" />

            <p className="text-[10px] font-semibold text-white/45">
              Continue when it matters
            </p>
          </div>

          <h2 className="mt-3 max-w-[19ch] text-[30px] font-semibold leading-[1] tracking-[-0.045em] sm:text-[36px]">
            Discover freely. Build your Arknoz when you are ready.
          </h2>

          <p className="mt-3 max-w-[680px] text-[12px] leading-6 text-white/60">
            Save useful work, return to subjects, follow people and
            organisations, and participate across the Built World.
          </p>

        </div>


        {/* ACTIONS */}
        <div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-1 lg:border-l lg:border-t-0">

          <Link
            href="/join"
            className="
              group
              flex
              min-h-[110px]
              items-center
              justify-between
              gap-5
              border-b
              border-white/10
              px-7
              py-5
              transition
              hover:bg-white/[0.07]
              sm:border-b-0
              sm:border-r
              lg:border-b
              lg:border-r-0
            "
          >
            <div>
              <p className="text-[9px] font-semibold tracking-[0.08em] text-white/40">
                Arknoz ID
              </p>

              <p className="mt-1 text-[17px] font-semibold tracking-[-0.025em]">
                Create your Arknoz ID
              </p>

              <p className="mt-1 text-[10px] leading-4 text-white/45">
                Save, follow and participate.
              </p>
            </div>

            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-sm transition group-hover:bg-white group-hover:text-[#081f2d]">
              →
            </span>
          </Link>


          <Link
            href="/explore"
            className="
              group
              flex
              min-h-[110px]
              items-center
              justify-between
              gap-5
              px-7
              py-5
              transition
              hover:bg-white/[0.07]
            "
          >
            <div>
              <p className="text-[9px] font-semibold tracking-[0.08em] text-white/40">
                Explore
              </p>

              <p className="mt-1 text-[17px] font-semibold tracking-[-0.025em]">
                Keep exploring
              </p>

              <p className="mt-1 text-[10px] leading-4 text-white/45">
                Continue without creating an ID.
              </p>
            </div>

            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-sm transition group-hover:bg-white group-hover:text-[#081f2d]">
              →
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}