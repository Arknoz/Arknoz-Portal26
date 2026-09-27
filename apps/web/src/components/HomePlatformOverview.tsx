import Link from "next/link";

type OverviewLink = {
  label: string;
  href: string;
  detail?: string;
};

type OverviewGroup = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  links: OverviewLink[];
};

const groups: OverviewGroup[] = [
  {
    number: "01",
    eyebrow: "DISCOVER",
    title: "Find what exists.",
    description:
      "Move directly into the core information worlds that make up Arknoz.",
    links: [
      {
        label: "Projects",
        href: "/projects",
        detail: "Buildings · Infrastructure · Development",
      },
      {
        label: "Products",
        href: "/products",
        detail: "Materials · Systems · Equipment",
      },
      {
        label: "Knowledge",
        href: "/knowledge",
        detail: "Research · Cases · References",
      },
      {
        label: "Education",
        href: "/learning",
        detail: "Learning · Programmes · Skills",
      },
    ],
  },

  {
    number: "02",
    eyebrow: "NETWORK",
    title: "Understand who shapes it.",
    description:
      "Discover the people and institutions behind the Built World.",
    links: [
      {
        label: "People",
        href: "/people",
        detail: "Professionals · Contributors",
      },
      {
        label: "Organisations",
        href: "/organisations",
        detail: "Practices · Companies · Institutions",
      },
      {
        label: "Universities",
        href: "/universities",
        detail: "Education · Research · People",
      },
      {
        label: "Community",
        href: "/community",
        detail: "Members · Participation",
      },
    ],
  },

  {
    number: "03",
    eyebrow: "PARTICIPATE",
    title: "Find where you can act.",
    description:
      "Move from information into professional and participation opportunities.",
    links: [
      {
        label: "All Opportunities",
        href: "/opportunities",
        detail: "Explore everything",
      },
      {
        label: "Jobs & Careers",
        href: "/opportunities?type=jobs-careers",
      },
      {
        label: "Competitions & Awards",
        href: "/opportunities?type=competitions-awards",
      },
      {
        label: "Events",
        href: "/opportunities?type=events-conferences-exhibitions",
      },
      {
        label: "Funding",
        href: "/opportunities?type=grants-funding-fellowships",
      },
    ],
  },

  {
    number: "04",
    eyebrow: "PLACE",
    title: "Explore the world.",
    description:
      "Start with a continent, then move into countries, regions, cities and places.",
    links: [
      {
        label: "Asia",
        href: "/global/asia",
      },
      {
        label: "Africa",
        href: "/global/africa",
      },
      {
        label: "Europe",
        href: "/global/europe",
      },
      {
        label: "North America",
        href: "/global/north-america",
      },
      {
        label: "South America",
        href: "/global/south-america",
      },
      {
        label: "Oceania",
        href: "/global/oceania",
      },
    ],
  },
];

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M3 10h13" />
      <path d="m12 6 4 4-4 4" />
    </svg>
  );
}

export default function HomePlatformOverview() {
  return (
    <section
      data-home-master="platform-overview"
      className="relative overflow-hidden bg-[#f4f7f9] px-5 py-16 sm:px-8 lg:px-12 lg:py-20 xl:px-16"
    >
      <div className="mx-auto w-full max-w-[1680px]">

        <div className="grid gap-7 border-b border-slate-200 pb-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-teal-700">
              ARKNOZ AT A GLANCE
            </p>

            <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
              The Built World on Arknoz.
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-base leading-7 text-slate-600">
              Start with what you want to discover, who or what shapes it,
              where you can participate, or where in the world you want to explore.
            </p>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Discover · Network · Participate · Place
            </p>
          </div>
        </div>


        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <article
              key={group.eyebrow}
              className="flex min-h-[520px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)]"
            >
              <div className="border-b border-slate-200 px-6 pb-6 pt-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
                    {group.eyebrow}
                  </p>

                  <span className="text-xs font-semibold text-slate-300">
                    {group.number}
                  </span>
                </div>

                <h3 className="mt-5 max-w-[12ch] text-3xl font-semibold leading-[1] tracking-[-0.045em] text-slate-950">
                  {group.title}
                </h3>

                <p className="mt-5 text-sm leading-6 text-slate-500">
                  {group.description}
                </p>
              </div>

              <div className="flex flex-1 flex-col divide-y divide-slate-100 px-6">
                {group.links.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex min-h-[66px] items-center justify-between gap-4 py-4 text-slate-900 transition hover:text-teal-800"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {item.label}
                      </p>

                      {item.detail ? (
                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                          {item.detail}
                        </p>
                      ) : null}
                    </div>

                    <Arrow />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>


        <div className="mt-8 overflow-hidden rounded-[28px] bg-[#081b27] text-white">
          <div className="grid md:grid-cols-3">

            <Link
              href="/explore"
              className="group border-b border-white/10 p-7 transition hover:bg-white/[0.05] md:border-b-0 md:border-r"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/65">
                EXPLORE
              </p>

              <div className="mt-4 flex items-end justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.035em]">
                    Find and navigate.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Discover what Arknoz knows.
                  </p>
                </div>

                <Arrow />
              </div>
            </Link>


            <Link
              href="/search"
              className="group border-b border-white/10 p-7 transition hover:bg-white/[0.05] md:border-b-0 md:border-r"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/65">
                SEARCH ARKNOZ
              </p>

              <div className="mt-4 flex items-end justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.035em]">
                    Search everything.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Projects, products, knowledge, people and places.
                  </p>
                </div>

                <Arrow />
              </div>
            </Link>


            <Link
              href="/intelligence"
              className="group p-7 transition hover:bg-white/[0.05]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/65">
                ARKNOZ PRO
              </p>

              <div className="mt-4 flex items-end justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.035em]">
                    Work professionally.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Advanced tools for connected Built World data.
                  </p>
                </div>

                <Arrow />
              </div>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}