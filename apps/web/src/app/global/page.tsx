import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import GlobalFooter from "@/components/GlobalFooter";
import GlobalGeographyTabs from "@/components/GlobalGeographyTabs";
import GeographyPathTabs from "@/components/GeographyPathTabs";

const continents = [
  ["Africa", "Cities, projects, people and knowledge across African contexts."],
  ["Asia", "Fast-changing urban, infrastructure and building contexts across Asia."],
  ["Europe", "Projects, institutions, standards, research and established practice."],
  ["Middle East", "Rapid development, major projects, systems and regional practice."],
  ["North America", "Projects, technologies, institutions and professional practice."],
  ["Latin America", "Architecture, cities, landscape, infrastructure and local innovation."],
  ["Oceania", "Built-environment practice, climate response and regional knowledge."],
] as const;

const countries = [
  {
    name: "India",
    href: "/global/india",
    region: "Asia",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=82",
  },
  {
    name: "Singapore",
    href: "/global/singapore",
    region: "Asia",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=82",
  },
  {
    name: "United Arab Emirates",
    href: "/global/uae",
    region: "Middle East",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=82",
  },
  {
    name: "Kenya",
    href: "/global/kenya",
    region: "Africa",
    image:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=1200&q=82",
  },
  {
    name: "Japan",
    href: "/global/japan",
    region: "Asia",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=82",
  },
] as const;

const places = [
  {
    name: "Mumbai",
    href: "/global/mumbai",
    meta: "India",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=82",
  },
  {
    name: "Nairobi",
    href: "/global/nairobi",
    meta: "Kenya",
    image:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?auto=format&fit=crop&w=1200&q=82",
  },
] as const;

const geographySteps = [
  ["01", "World", "Start from the whole Built World and discover connected regions and themes."],
  ["02", "Continent", "Use continental context for broad geographic discovery and comparison."],
  ["03", "Country", "Country pages organise local projects, institutions, knowledge and applicability."],
  ["04", "Region / State", "Where useful, Arknoz adds the local administrative layer that matters."],
  ["05", "City / Place", "Move into cities and places for the most contextual Built World view."],
] as const;

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function GlobalPage() {
  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <UniversalTopicHero
        eyebrow="GLOBAL"
        title="Explore the Built World by place."
        description="Move from the world to continents, countries, regions and cities while keeping one connected Arknoz record system."
        searchPlaceholder="Search a country, city, project, organisation or topic..."
        popular={[
          "India",
          "Singapore",
          "UAE",
          "Kenya",
          "Japan",
          "Mumbai",
        ]}
        featured={[
          {
            type: "COUNTRY",
            title: "India",
            meta: "Asia",
            href: "/global/india",
            image:
              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1100&q=82",
          },
          {
            type: "CITY",
            title: "Mumbai",
            meta: "India",
            href: "/global/mumbai",
            image:
              "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=82",
          },
          {
            type: "COUNTRY",
            title: "Singapore",
            meta: "Asia",
            href: "/global/singapore",
            image:
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=82",
          },
        ]}
        ticker={[
          { text: "One global format. Local truth by country.", href: "#geography-path" },
          { text: "Explore countries already connected in Arknoz", href: "#countries" },
          { text: "Move from world to city without duplicating records", href: "#geography-path" },
          { text: "Search the Built World by geography", href: "/search" },
        ]}
      />

      <GeographyPathTabs />

      <GlobalGeographyTabs />

      <section id="countries" className="bg-[#f6f8fb] py-12">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                COUNTRY EXPLORER
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Countries already connected in Arknoz.
              </h2>
              <p className="mt-2 max-w-3xl text-slate-600">
                Country context can change relevance, terminology, regulation, evidence and availability without changing canonical identity.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {countries.map((country) => (
              <Link
                key={country.href}
                href={country.href}
                className="group overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[1.25/1] overflow-hidden bg-slate-100">
                  <img
                    src={country.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    {country.region}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-950">{country.name}</h3>
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

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-10">
          <div className="rounded-[30px] bg-[#0b2949] p-7 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
              LOCAL TRUTH
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              One global format. Local truth by country.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Geography should change what is relevant locally — not create conflicting copies of the same project, person, product or organisation.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Canonical identity", "The same entity remains one Arknoz record globally."],
                ["Local applicability", "Regulation, availability and evidence can vary by jurisdiction."],
                ["Local terminology", "Language and professional terms can adapt to context."],
                ["Geographic relationships", "Projects, people and institutions connect to the places they belong to."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-[20px] border border-white/10 bg-white/[0.06] p-4"
                >
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-5 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-[#f8fafc] p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              CITY / PLACE
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Go deeper into local context.
            </h2>
            <p className="mt-3 text-slate-600">
              City and place pages connect local projects, people, institutions, knowledge and opportunities.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {places.map((place) => (
                <Link
                  key={place.href}
                  href={place.href}
                  className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white"
                >
                  <div className="aspect-[1.6/1] overflow-hidden">
                    <img
                      src={place.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                      {place.meta}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-950">{place.name}</h3>
                      <span className="text-blue-700">
                        <ArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <UniversalFooterStrip />
      <GlobalFooter />
    </main>
  );
}
