import Link from "next/link";

export type ArknozWorldPublicKey =
  | "knowledge"
  | "learning"
  | "opportunities"
  | "people"
  | "organisations"
  | "universities"
  | "places"
  | "community";

type PopularItem =
  | string
  | {
      label: string;
      href: string;
    };

type FeatureItem = {
  type: string;
  title: string;
  meta: string;
  href: string;
  image: string;
};

const worlds: Record<
  ArknozWorldPublicKey,
  {
    title: string;
    tagline: string;
    fallbackImage: string;
    footer: string;
  }
> = {
  knowledge: {
    title: "Knowledge",
    tagline: "The Built World. Understood.",
    fallbackImage: "/visuals/portal/knowledge.png",
    footer:
      "Research, publications, standards, methods and ideas connected through Arknoz.",
  },

  learning: {
    title: "Education",
    tagline: "Learn the Built World.",
    fallbackImage: "/visuals/portal/education.png",
    footer:
      "Courses, programmes, professional development, skills and credentials connected through Arknoz.",
  },

  opportunities: {
    title: "Opportunities",
    tagline: "The Built World. Open.",
    fallbackImage: "/visuals/portal/opportunity.png",
    footer:
      "Jobs, competitions, tenders, funding, events and open calls connected through Arknoz.",
  },

  people: {
    title: "People",
    tagline: "People shaping the Built World.",
    fallbackImage: "/visuals/portal/people.png",
    footer:
      "Professionals, experts, researchers, educators and emerging talent connected through Arknoz.",
  },

  organisations: {
    title: "Organisations",
    tagline: "The Built World. Organised.",
    fallbackImage: "/visuals/portal/organisation.png",
    footer:
      "Firms, manufacturers, contractors, consultancies, institutions and public bodies connected through Arknoz.",
  },

  universities: {
    title: "Universities",
    tagline: "Where the Built World learns.",
    fallbackImage: "/visuals/portal/education.png",
    footer:
      "Programmes, research, faculty, labs, student work and partnerships connected through Arknoz.",
  },

  places: {
    title: "Places",
    tagline: "The Built World. In Context.",
    fallbackImage: "/visuals/portal/place.png",
    footer:
      "Continents, countries, regions, cities, sites and local context connected through Arknoz.",
  },

  community: {
    title: "Community",
    tagline: "The Built World. Together.",
    fallbackImage: "/visuals/portal/people.png",
    footer:
      "Members, collaboration, contribution, activity, Arknoz development and chapters connected through Arknoz.",
  },
};

export default function ArknozWorldPublicHero({
  worldKey,
  description,
  searchPlaceholder,
  popular,
  featured,
  featuredHref,
  subsectionLabel,
}: {
  worldKey: ArknozWorldPublicKey;
  description: string;
  searchPlaceholder: string;
  popular: PopularItem[];
  featured: FeatureItem[];
  featuredHref?: string;
  subsectionLabel?: string;
}) {
  const config = worlds[worldKey];

  const resolvePopular = (
    index: number
  ) => {
    const item = popular[index];

    if (!item) {
      return {
        label: `Explore ${config.title}`,
        href: `/${worldKey}`,
      };
    }

    if (typeof item === "string") {
      return {
        label: item,
        href: `/search?q=${encodeURIComponent(
          item
        )}`,
      };
    }

    return item;
  };

  return (
    <section
      data-arknoz-world-public-hero={worldKey}
      className="
        bg-[#f5f7fb]
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
          shadow-[0_18px_50px_rgba(15,23,42,0.06)]
          lg:min-h-[calc(100svh-168px)]
          lg:grid-cols-[.86fr_1.14fr]
        "
      >
        <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10 xl:p-12">
          <div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <h1
                className="
                  text-[50px]
                  font-semibold
                  leading-none
                  tracking-[-0.06em]
                  text-[#172b4d]
                  sm:text-[60px]
                "
              >
                {config.title}
              </h1>

              <div className="hidden h-14 w-px bg-slate-300 sm:block" />

              <p className="max-w-[300px] text-[18px] leading-tight text-slate-500 sm:text-[20px]">
                {config.tagline}
              </p>
            </div>

            <div className="mt-5 flex items-center">
              <span className="h-px w-10 bg-[#a61f46]" />
              <span className="h-px w-28 bg-slate-200" />
            </div>

            {subsectionLabel ? (
              <div className="mt-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">
                  {config.title} World
                </p>

                <h2 className="mt-2 max-w-[650px] text-[27px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#0a2230] sm:text-[31px]">
                  {subsectionLabel}
                </h2>
              </div>
            ) : null}

            <p className="mt-6 max-w-[670px] text-[14px] leading-7 text-slate-600">
              {description}
            </p>

            <p className="mt-2 max-w-[650px] text-[12px] leading-5 text-slate-500">
              Search directly, enter a category,
              or explore this world by place.
            </p>

            <form
              action="/search"
              className="mt-7 flex overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm"
            >
              <input
                type="hidden"
                name="section"
                value={worldKey}
              />

              <input
                name="q"
                aria-label={`Search ${config.title}`}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[13px] text-[#0a2230] outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="m-1.5 rounded-[6px] bg-[#0a2230] px-5 text-[11px] font-semibold text-white transition hover:bg-[#153e57]"
              >
                Search
              </button>
            </form>

            <div className="mt-7 border-t border-slate-200 pt-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Explore {config.title.toLowerCase()}
              </p>

              <div className="mt-3 grid gap-x-5 gap-y-1 sm:grid-cols-2">
                {popular
                  .slice(0, 7)
                  .map((item) => {
                    const label =
                      typeof item === "string"
                        ? item
                        : item.label;

                    const href =
                      typeof item === "string"
                        ? `/search?q=${encodeURIComponent(
                            item
                          )}`
                        : item.href;

                    return (
                      <Link
                        key={`${label}-${href}`}
                        href={href}
                        className="group flex items-center justify-between border-b border-slate-100 py-2.5 text-[11px] font-semibold text-slate-600 transition hover:text-[#a61f46]"
                      >
                        <span>{label}</span>

                        <span
                          aria-hidden="true"
                          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#a61f46]"
                        >
                          →
                        </span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
            <p className="max-w-sm text-[10px] leading-5 text-slate-400">
              {config.footer}
            </p>

            <Link
              href="/global"
              className="shrink-0 text-[10px] font-bold text-[#0a2230] transition hover:text-[#a61f46]"
            >
              Explore by place →
            </Link>
          </div>
        </div>


        <div className="border-t border-slate-200 bg-[#eef2f5] p-4 lg:border-l lg:border-t-0 lg:p-5">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-red-500">
                {subsectionLabel
                  ? `Featured · ${subsectionLabel}`
                  : `Featured ${config.title}`}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Selected records across the Built
                World.
              </p>
            </div>

            {featuredHref ? (
              <Link
                href={featuredHref}
                className="text-[10px] font-semibold text-[#0a2230] transition hover:text-[#a61f46]"
              >
                View featured →
              </Link>
            ) : null}
          </div>

          <div className="grid min-h-[560px] gap-3 md:grid-cols-[1.35fr_.65fr] lg:h-[calc(100%-58px)] lg:min-h-0">
            <Link
              href={
                featured[0]?.href ??
                resolvePopular(0).href
              }
              className="group relative min-h-[390px] overflow-hidden rounded-[8px] bg-[#0a2230] md:min-h-0"
            >
              <img
                src={
                  featured[0]?.image ??
                  config.fallbackImage
                }
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#03121c]/95 via-[#03121c]/12 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-7">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/65">
                  {featured[0]?.type ??
                    config.title}
                </p>

                <h2 className="mt-2 max-w-xl text-[28px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[32px]">
                  {featured[0]?.title ??
                    resolvePopular(0).label}
                </h2>

                <p className="mt-3 text-[10px] font-medium text-white/60">
                  {featured[0]?.meta ??
                    `Arknoz ${config.title}`}
                </p>
              </div>
            </Link>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              {[1, 2].map((index) => {
                const item =
                  featured[index];

                const fallback =
                  resolvePopular(index);

                return (
                  <Link
                    key={`${worldKey}-feature-${index}`}
                    href={
                      item?.href ??
                      fallback.href
                    }
                    className="group relative min-h-[220px] overflow-hidden rounded-[8px] bg-[#0a2230] md:min-h-0"
                  >
                    <img
                      src={
                        item?.image ??
                        config.fallbackImage
                      }
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#03121c]/95 via-[#03121c]/15 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-white/60">
                        {item?.type ??
                          config.title}
                      </p>

                      <h3 className="mt-2 line-clamp-3 text-[18px] font-semibold leading-[1.05] tracking-[-0.035em]">
                        {item?.title ??
                          fallback.label}
                      </h3>

                      <p className="mt-2 text-[9px] text-white/55">
                        {item?.meta ??
                          `Arknoz ${config.title}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}