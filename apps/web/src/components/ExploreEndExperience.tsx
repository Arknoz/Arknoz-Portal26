import Link from "next/link";


const partnerRows = [
  [
    "University & Academic",
    "Industry",
    "Knowledge & Research",
    "Technology",
    "Institutional",
    "Strategic & Global",
  ],
  [
    "Design Studios",
    "Manufacturers",
    "Research Institutions",
    "Professional Bodies",
    "Education",
    "Innovation Networks",
  ],
  [
    "Regional Network",
    "Materials & Systems",
    "City & Public Sector",
    "Learning",
    "Industry Network",
    "Global Collaboration",
  ],
] as const;


export function ArknozPartnersExperience() {
  return (
    <section
      data-explore-sequence="partners"
      className="bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
    >
      <div className="mx-auto max-w-[1640px] overflow-hidden rounded-[34px] bg-[#0b3446] text-white">

        <div className="flex flex-col gap-5 px-7 pb-7 pt-8 sm:px-9 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-8 lg:pt-10">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/65">
              ARKNOZ PARTNERS
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Partner ecosystem across the Built World.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/50 lg:text-right">
            Genuine partner identities will appear only after the
            relationship and publication rights are verified.
          </p>

        </div>


        <div className="overflow-hidden border-y border-white/10 py-5">

          {partnerRows.map((row, rowIndex) => (

            <div
              key={rowIndex}
              className="arknoz-partner-row overflow-hidden py-2"
            >
              <div
                className={
                  rowIndex % 2 === 0
                    ? "arknoz-partner-track arknoz-partner-forward"
                    : "arknoz-partner-track arknoz-partner-reverse"
                }
              >

                {[...row, ...row].map((label, index) => (

                  <div
                    key={index}
                    className="inline-flex min-h-[60px] min-w-[220px] cursor-default items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.055] px-6 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65"
                  >
                    {label}
                  </div>

                ))}

              </div>
            </div>

          ))}

        </div>


        <div className="flex min-h-[62px] items-center px-7 text-[9px] uppercase tracking-[0.14em] text-white/35 sm:px-9 lg:px-10">
          Partner categories shown here. Verified partner profiles will appear when approved.
        </div>

      </div>


      <style>{`
        .arknoz-partner-track {
          display: flex;
          width: max-content;
          gap: 12px;
          will-change: transform;
        }

        .arknoz-partner-forward {
          animation: arknozPartnerForward 34s linear infinite;
        }

        .arknoz-partner-reverse {
          animation: arknozPartnerReverse 38s linear infinite;
        }

        @keyframes arknozPartnerForward {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes arknozPartnerReverse {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        .arknoz-partner-row:hover .arknoz-partner-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .arknoz-partner-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}


export function YourArknozExperience() {
  return (
    <section
      data-explore-sequence="your-arknoz"
      className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-16"
    >
      <div className="mx-auto grid max-w-[1640px] gap-10 overflow-hidden rounded-[34px] bg-[#0a3041] p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/65">
            YOUR ARKNOZ
          </p>

          <h2 className="mt-5 max-w-[19ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
            Discover freely. Continue when it matters to you.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
            Save what matters, return to subjects, follow useful
            context and participate in the Arknoz network.
          </p>

        </div>


        <div className="flex flex-wrap gap-3 lg:justify-end">

          <Link
            href="/join"
            className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
          >
            Create Arknoz ID
          </Link>

          <Link
            href="/explore"
            className="rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            Keep Exploring
          </Link>

        </div>

      </div>
    </section>
  );
}