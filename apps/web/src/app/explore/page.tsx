import {
  arknozSections,
  buildArknozSectionHref,
  isPaidArknozSection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";
import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import GlobalFooter from "@/components/GlobalFooter";

const explorePresentation: Partial<
  Record<
    ArknozSectionKey,
    {
      image: string;
      example:
        | readonly [
            string,
            string,
            string
          ]
        | null;
    }
  >
> = {
  projects: {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Bosco Verticale",
      "Milan, Italy",
      "/projects/bosco-verticale",
    ],
  },

  products: {
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Mass Timber System",
      "System",
      "/products/mass-timber-system",
    ],
  },

  knowledge: {
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Urban Biodiversity",
      "Global",
      "/knowledge/urban-biodiversity",
    ],
  },

  learning: {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=82",
    example: null,
  },

  opportunities: {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Research Fellowship",
      "Global",
      "/opportunities/research-fellowship",
    ],
  },

  people: {
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Stefano Boeri",
      "Architect",
      "/people/stefano-boeri",
    ],
  },

  organisations: {
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=82",
    example: [
      "White Arkitekter",
      "Sweden",
      "/organisations/white-arkitekter",
    ],
  },

  universities: {
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Politecnico di Milano",
      "Milan, Italy",
      "/universities/politecnico-di-milano",
    ],
  },

  places: {
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=82",
    example: [
      "Mumbai",
      "India",
      "/global/mumbai",
    ],
  },

  community: {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=82",
    example: null,
  },

  connect: {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=82",
    example: null,
  },

  intelligence: {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=82",
    example: null,
  },
};

const worlds = arknozSections.map(
  (section) => {
    const presentation =
      explorePresentation[
        section.key
      ];

    return {
      key: section.key,

      name:
        isPaidArknozSection(section.key)
          ? `Arknoz ${section.title} · PRO`
          : `Arknoz ${section.title}`,

      short:
        section.short,

      href:
        section.href,

      image:
        presentation?.image ??
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=82",

      description:
        section.description,

      subsections:
        section.subsections.map(
          (subsection) =>
            [
              subsection.label,
              buildArknozSectionHref(
                section.key,
                {
                  subsection:
                    subsection.slug,
                }
              ),
            ] as const
        ),

      example:
        presentation?.example ??
        null,

      phase:
        isPaidArknozSection(section.key)
          ? "ARKNOZ PRO · LOCKED"
          : "Current",

      paid:
        isPaidArknozSection(
          section.key
        ),
    };
  }
);

const intents = [
  ["Find inspiring projects", "Discover exemplary projects across regions and disciplines.", "/projects"],
  ["Learn something useful", "Open research, standards, methods and practical knowledge.", "/knowledge"],
  ["Explore a place", "Move from world to continent, country, region and city.", "/global"],
  ["Find an opportunity", "Jobs, competitions, grants, fellowships and more.", "/opportunities"],
  ["Discover people", "Professionals, experts, researchers and educators.", "/people"],
  ["Find institutions", "Organisations and universities shaping the Built World.", "/organisations"],
] as const;

const places = [
  ["India", "/global/india"],
  ["Kenya", "/global/kenya"],
  ["Singapore", "/global/singapore"],
  ["UAE", "/global/uae"],
  ["Japan", "/global/japan"],
  ["Mumbai", "/global/mumbai"],
  ["Nairobi", "/global/nairobi"],
] as const;

const curated = [
  ["PROJECT", "Bosco Verticale", "Milan, Italy", "/projects/bosco-verticale", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"],
  ["KNOWLEDGE", "Urban Biodiversity", "Global", "/knowledge/urban-biodiversity", "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80"],
  ["UNIVERSITY", "Politecnico di Milano", "Milan, Italy", "/universities/politecnico-di-milano", "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=80"],
  ["ORGANISATION", "White Arkitekter", "Sweden", "/organisations/white-arkitekter", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80"],
] as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <UniversalTopicHero
        eyebrow="EXPLORE"
        title="Explore the Built World."
        description="Search everything, enter a Built World section, or start with what you want to do."
        searchPlaceholder="Search projects, products, knowledge, people, places..."
        popular={["sustainable buildings", "mass timber", "urban biodiversity", "universities", "jobs", "India"]}
        featured={[
          {
            type: "PROJECT",
            title: "Bosco Verticale",
            meta: "Milan, Italy",
            href: "/projects/bosco-verticale",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1100&q=82",
          },
          {
            type: "KNOWLEDGE",
            title: "Urban Biodiversity",
            meta: "Global",
            href: "/knowledge/urban-biodiversity",
            image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=82",
          },
          {
            type: "UNIVERSITY",
            title: "Politecnico di Milano",
            meta: "Milan, Italy",
            href: "/universities/politecnico-di-milano",
            image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=900&q=82",
          },
        ]}
        ticker={[
          { text: "Explore the connected Built World", href: "#arknoz-worlds" },
          { text: "Search by project, product, topic, person or place", href: "/search" },
          { text: "Discover genuine records across Arknoz", href: "/featured" },
          { text: "Explore by country, city and local context", href: "/global" },
        ]}
      />

      <section id="arknoz-worlds" className="scroll-mt-24 bg-[#f6f8fb] py-12">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              THE NINE ARKNOZ WORLDS
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              One horizontal path through the whole Built World.
            </h2>
            <p className="mt-2 text-slate-600">
              Each row explains one Arknoz world, exposes its main subsections and provides a direct path into the final section or record.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {worlds.map((world, index) => (
              <article
                key={world.name}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="grid lg:grid-cols-[300px_1fr_250px]">
                  <Link
                    href={world.href}
                    className="group relative min-h-[220px] overflow-hidden bg-slate-900 lg:min-h-full"
                  >
                    <img
                      src={world.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-100">
                        WORLD {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-2xl font-bold">{world.name}</h3>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                        Open world
                        <ArrowRight />
                      </span>
                    </div>
                  </Link>

                  <div className="p-6">
                    <p className="max-w-3xl text-sm leading-6 text-slate-600">
                      {world.description}
                    </p>

                    <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {world.subsections.map(([label, href]) => (
                        <Link
                          key={`${world.short}-${label}`}
                          href={href}
                          className="group flex items-center justify-between gap-3 rounded-[16px] border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          <span>{label}</span>
                          <span className="shrink-0 text-blue-700">
                            <ArrowRight />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 bg-[#f8fafc] p-5 lg:border-l lg:border-t-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      EXAMPLE
                    </p>

                    {world.example ? (
                      <Link
                        href={world.example[2]}
                        className="group mt-3 block rounded-[18px] border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50/60"
                      >
                        <p className="font-bold text-slate-950">{world.example[0]}</p>
                        <p className="mt-1 text-xs text-slate-500">{world.example[1]}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                          Open record
                          <ArrowRight />
                        </span>
                      </Link>
                    ) : (
                      <div className="mt-3 rounded-[18px] border border-dashed border-slate-300 bg-white p-4">
                        <p className="text-sm leading-5 text-slate-500">
                          Genuine published records will appear here as this world grows.
                        </p>
                      </div>
                    )}

                    <Link
                      href={world.href}
                      className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
                    >
                      View all {world.short}
                      <ArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-[.88fr_1.12fr] lg:px-10">
          <div className="rounded-[30px] bg-[#0b2949] p-7 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
              START WITH INTENT
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              What do you want to do?
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              You do not need to understand Arknoz before using it.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {intents.map(([title, text, href]) => (
                <Link
                  key={title}
                  href={href}
                  className="group rounded-[20px] border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/[0.1]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="mt-1.5 text-sm leading-5 text-slate-300">{text}</p>
                    </div>
                    <span className="mt-1 shrink-0 text-blue-200">
                      <ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white">
            <div className="relative min-h-[260px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=82"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#081c34]/94 via-[#0b2949]/74 to-transparent" />

              <div className="relative p-7 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  EXPLORE BY PLACE
                </p>
                <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                  From the world to the city.
                </h2>
                <p className="mt-3 max-w-lg text-slate-200">
                  Geography changes relevance and local context, not canonical truth.
                </p>
              </div>
            </div>

            <div className="p-7">
              <div className="flex flex-wrap gap-2">
                {places.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <Link
                href="/global"
                className="group mt-5 inline-flex items-center gap-1.5 font-semibold text-blue-700"
              >
                Open global explorer
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fb] py-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                ACROSS ARKNOZ
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Follow discovery across worlds.
              </h2>
              <p className="mt-2 text-slate-600">
                A project can lead to a person, organisation, place, product or piece of knowledge.
              </p>
            </div>

            <Link
              href="/search"
              className="group hidden items-center gap-1.5 font-semibold text-blue-700 sm:inline-flex"
            >
              Search everything
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {curated.map(([type, title, meta, href, image]) => (
              <Link
                key={href}
                href={href}
                className="group overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[1.4/1] overflow-hidden bg-slate-100">
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    {type}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold text-slate-950">{title}</h3>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
                    <span>{meta}</span>
                    <span className="text-blue-700">
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <Link
            href="/featured"
            className="group relative block min-h-[320px] overflow-hidden rounded-[30px] bg-[#0b2949] text-white"
          >
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=82"
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071b31]/96 via-[#0b2949]/80 to-[#0b2949]/36" />

            <div className="relative flex min-h-[320px] max-w-3xl flex-col justify-center p-8 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                ARKNOZ FEATURED
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                Buildings worth discovering.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-200">
                A dedicated editorial view for genuine published buildings and projects selected across Arknoz.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                Open Arknoz Featured
                <ArrowRight />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <UniversalFooterStrip />
      <GlobalFooter />
    </main>
  );
}
