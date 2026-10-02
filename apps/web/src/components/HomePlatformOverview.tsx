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
  image: string;
  links: OverviewLink[];
};

const groups: OverviewGroup[] = [
  {
    number: "01",
    eyebrow: "Discover",
    title: "Find what exists.",
    description: "Projects, products, knowledge and learning.",
    image: "/visuals/portal/project.png",
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
    eyebrow: "Network",
    title: "Meet who shapes it.",
    description: "People and institutions across the Built World.",
    image: "/visuals/portal/people.png",
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
    eyebrow: "Participate",
    title: "Find what comes next.",
    description: "Professional and participation opportunities.",
    image: "/visuals/portal/opportunity.png",
    links: [
      {
        label: "All Opportunities",
        href: "/opportunities",
      },
      {
        label: "Jobs & Careers",
        href: "/opportunities?type=jobs-careers",
      },
      {
        label: "Competitions",
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
    eyebrow: "Place",
    title: "Explore the world.",
    description: "Move from continents into countries, regions and cities.",
    image: "/visuals/portal/place.png",
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
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
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
      className="border-b border-slate-200 bg-[#f5f7fb] px-5 py-8 sm:px-8 lg:px-8 lg:py-10"
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
                Arknoz at a glance
              </p>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <p className="text-[10px] font-semibold text-slate-400">
                Built World gateway
              </p>
            </div>

            <h2 className="mt-2 text-[30px] font-semibold leading-[1] tracking-[-0.045em] text-[#0a2230] sm:text-[36px]">
              Explore the Built World.
            </h2>
          </div>

          <p className="max-w-[560px] text-[12px] leading-5 text-slate-500 lg:text-right">
            Discover what exists, connect with who shapes it, find where to
            participate and explore places globally.
          </p>
        </div>


        {/* FOUR VISUAL GATEWAYS */}
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <article
              key={group.eyebrow}
              className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_18px_42px_rgba(15,23,42,0.10)]"
            >
              {/* IMAGE */}
              <div className="relative h-[170px] overflow-hidden bg-[#0a2230]">
                <img
                  src={group.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#04131d]/95 via-[#061722]/35 to-black/10" />

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                  <p className="text-[9px] font-bold tracking-[0.08em] text-white/80">
                    {group.eyebrow}
                  </p>

                  <span className="text-[9px] font-semibold text-white/45">
                    {group.number}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="max-w-[14ch] text-[24px] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
                    {group.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-white/60">
                    {group.description}
                  </p>
                </div>
              </div>


              {/* COMPACT LINKS */}
              <div className="grid grid-cols-2 border-t border-slate-100">
                {group.links.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      group/link
                      flex
                      min-h-[52px]
                      items-center
                      justify-between
                      gap-2
                      border-slate-100
                      px-4
                      py-3
                      text-[#0a2230]
                      transition
                      hover:bg-slate-50
                      hover:text-[#a61f46]
                      ${index % 2 === 0 ? "border-r" : ""}
                      ${index >= 2 ? "border-t" : ""}
                    `}
                  >
                    <span className="text-[11px] font-semibold leading-4">
                      {item.label}
                    </span>

                    <Arrow />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>


        {/* COMPACT ACTION BAR */}
        <div className="mt-4 overflow-hidden rounded-[8px] bg-[#081f2d] text-white">
          <div className="grid md:grid-cols-3">

            <Link
              href="/explore"
              className="group flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4 transition hover:bg-white/[0.06] md:border-b-0 md:border-r"
            >
              <div>
                <p className="text-[9px] font-semibold tracking-[0.08em] text-white/40">
                  Explore
                </p>

                <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em]">
                  Find and navigate.
                </p>
              </div>

              <Arrow />
            </Link>

            <Link
              href="/search"
              className="group flex items-center justify-between gap-5 border-b border-white/10 px-5 py-4 transition hover:bg-white/[0.06] md:border-b-0 md:border-r"
            >
              <div>
                <p className="text-[9px] font-semibold tracking-[0.08em] text-white/40">
                  Search Arknoz
                </p>

                <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em]">
                  Search everything.
                </p>
              </div>

              <Arrow />
            </Link>

            <Link
              href="/intelligence"
              className="group flex items-center justify-between gap-5 px-5 py-4 transition hover:bg-white/[0.06]"
            >
              <div>
                <p className="text-[9px] font-semibold tracking-[0.08em] text-white/40">
                  Arknoz Pro
                </p>

                <p className="mt-1 text-[15px] font-semibold tracking-[-0.02em]">
                  Work professionally.
                </p>
              </div>

              <Arrow />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}