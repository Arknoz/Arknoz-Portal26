import Link from "next/link";

import type {
  ArknozWorldPublicKey,
} from "@/components/ArknozWorldPublicHero";

type PopularItem =
  | string
  | {
      label: string;
      href: string;
    };

const config: Record<
  ArknozWorldPublicKey,
  {
    title: string;
    image: string;
    description: string;
  }
> = {
  knowledge: {
    title: "Knowledge",
    image: "/visuals/portal/knowledge.png",
    description:
      "Research, publications, standards, methods and ideas moving through Arknoz.",
  },

  learning: {
    title: "Education",
    image: "/visuals/portal/education.png",
    description:
      "Courses, programmes, skills and professional learning moving through Arknoz.",
  },

  opportunities: {
    title: "Opportunities",
    image: "/visuals/portal/opportunity.png",
    description:
      "Jobs, competitions, tenders, funding, events and open calls moving through Arknoz.",
  },

  people: {
    title: "People",
    image: "/visuals/portal/people.png",
    description:
      "Professionals, experts, researchers, educators and emerging talent across Arknoz.",
  },

  organisations: {
    title: "Organisations",
    image: "/visuals/portal/organisation.png",
    description:
      "Firms, manufacturers, contractors, institutions and public bodies across Arknoz.",
  },

  universities: {
    title: "Universities",
    image: "/visuals/portal/education.png",
    description:
      "Programmes, research, faculty, labs and partnerships across Arknoz.",
  },

  places: {
    title: "Places",
    image: "/visuals/portal/place.png",
    description:
      "Geography, cities, regions, sites and local context across Arknoz.",
  },

  community: {
    title: "Community",
    image: "/visuals/portal/people.png",
    description:
      "Members, collaboration, contribution and Arknoz chapters in motion.",
  },
};

export default function ArknozWorldNowPanel({
  worldKey,
  popular,
}: {
  worldKey: ArknozWorldPublicKey;
  popular: PopularItem[];
}) {
  const world =
    config[worldKey];

  const items =
    popular
      .slice(0, 7)
      .map((item) =>
        typeof item === "string"
          ? {
              label: item,
              href: `/search?q=${encodeURIComponent(
                item
              )}`,
            }
          : item
      );

  return (
    <section
      data-arknoz-world-now={worldKey}
      className="bg-[#f5f7fb] px-5 py-5 sm:px-6 lg:px-8"
    >
      <style>{`
        @keyframes arknozWorldNowRail {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0%);
          }
        }

        .arknoz-world-now-track {
          animation:
            arknozWorldNowRail
            46s
            linear
            infinite;
        }

        .arknoz-world-now-track:hover {
          animation-play-state: paused;
        }

        .arknoz-world-now-track a {
          transition: transform 400ms ease;
        }

        .arknoz-world-now-track img {
          transition:
            transform 800ms ease,
            filter 500ms ease;
        }

        .arknoz-world-now-track a:hover {
          transform: translateY(-3px);
        }

        .arknoz-world-now-track a:hover img {
          transform: scale(1.035);
          filter:
            saturate(1.08)
            contrast(1.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .arknoz-world-now-track {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1720px] overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200 px-7 pb-4 pt-5 sm:px-9 lg:px-10">
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
              {world.title} Now
            </p>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Live
            </span>
          </div>

          <h2 className="mt-2 text-[29px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#0a2230] sm:text-[34px]">
            Moving through {world.title}.
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-slate-500">
            {world.description}
          </p>
        </div>

        <div className="relative overflow-hidden border-y border-slate-200 bg-[#fbfcfe] py-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-white to-transparent sm:w-28"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-white to-transparent sm:w-28"
          />

          <div className="arknoz-world-now-track flex w-max gap-4">
            {[...items, ...items].map(
              (item, index) => {
                const duplicate =
                  index >= items.length;

                return (
                  <Link
                    key={`${item.href}-${index}`}
                    href={item.href}
                    aria-hidden={
                      duplicate
                        ? true
                        : undefined
                    }
                    tabIndex={
                      duplicate
                        ? -1
                        : undefined
                    }
                    className="group relative h-[220px] w-[260px] shrink-0 overflow-hidden border border-slate-200 bg-[#0a2230] sm:w-[280px] 2xl:h-[230px] 2xl:w-[300px]"
                  >
                    <img
                      src={world.image}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover ${
                        index % 3 === 0
                          ? "object-center"
                          : index % 3 === 1
                            ? "object-left"
                            : "object-right"
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#03121c]/95 via-[#03121c]/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/70">
                        {world.title}
                      </p>

                      <h3 className="mt-2 line-clamp-3 text-xl font-semibold leading-[1.05] tracking-[-0.035em]">
                        {item.label}
                      </h3>

                      <p className="mt-3 text-[9px] font-medium text-white/60">
                        Arknoz
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        <div className="flex min-h-[58px] items-center justify-end px-7 sm:px-9 lg:px-10">
          <Link
            href={items[0]?.href ?? "/explore"}
            className="text-[11px] font-bold text-[#0a2230] transition hover:text-[#a61f46]"
          >
            Explore {world.title.toLowerCase()} →
          </Link>
        </div>
      </div>
    </section>
  );
}