import { buildGeographyHref } from "@/lib/geography";
import {
  arknozSections,
  buildArknozSectionHref,
  isPaidArknozSection,
} from "@/lib/arknoz-sections";
import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import UniversalTopicHero from "@/components/UniversalTopicHero";
import GeographyContextBar from "@/components/GeographyContextBar";

import {
  type GeographyItem,
  getChildren,
} from "@/lib/geography";

const regionImages: Record<string, string> = {
  maharashtra:
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=82",
};

const worldLinks =
  arknozSections.map(
    (section) => ({
      key: section.key,
      label: section.title,
      href: section.href,
      paid:
        isPaidArknozSection(
          section.key
        ),
    })
  );

function getPresentation(
  context: GeographyItem,
  children: GeographyItem[]
) {
  if (context.slug === "india") {
    return {
      title: "Explore India.",

      description:
        "Explore regions, cities, projects, products, knowledge, people, organisations and opportunities across India.",

      popular: [
        "Maharashtra",
        "Mumbai",
      ],

      featured: [
        {
          type: "REGION",
          title: "Maharashtra",
          meta: "India",
          href: "/global/maharashtra",
          image:
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=82",
        },

        {
          type: "CITY",
          title: "Mumbai",
          meta: "Maharashtra",
          href: "/global/mumbai",
          image:
            "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=900&q=82",
        },
      ],

      ticker: [
        {
          text:
            "Explore opportunities across India",
          href:
            "/opportunities?geo=india",
        },
        {
          text:
            "Explore regions already connected in India",
          href:
            "#regions",
        },
        {
          text:
            "Discover projects and knowledge across India",
          href:
            "#connected",
        },
        {
          text:
            "Move from India to region to city",
          href:
            "#regions",
        },
      ],
    };
  }

  return {
    title:
      `Explore ${context.name}.`,

    description:
      `Explore regions, cities and connected Built World records across ${context.name}.`,

    popular:
      children
        .slice(0, 6)
        .map(
          (child) =>
            child.name
        ),

    featured: [],

    ticker: [
      {
        text:
          `Explore ${context.name} by geography`,
        href:
          "#regions",
      },
      {
        text:
          `Discover the connected Built World in ${context.name}`,
        href:
          "#connected",
      },
    ],
  };
}

export default function CountryGeographyPage({
  context,
}: {
  context: GeographyItem;
}) {
  const children =
    getChildren(context.slug);

  const presentation =
    getPresentation(
      context,
      children
    );

  return (
    <main className="min-h-screen bg-white">

      <GlobalHeader />

      <GeographyContextBar
        context={context}
      />

      <UniversalTopicHero
        eyebrow={
          context.name.toUpperCase()
        }
        title={
          presentation.title
        }
        description={
          presentation.description
        }
        searchPlaceholder={
          `Search ${context.name} — region, city, project, organisation or topic...`
        }
        popular={
          presentation.popular
        }
        featured={
          presentation.featured
        }
        ticker={
          presentation.ticker
        }
      />

      <section
        id="regions"
        className="bg-[#f6f8fb] py-12"
      >

        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">

          <div className="flex flex-wrap items-end justify-between gap-5">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                REGIONS & PLACES
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Explore within {context.name}.
              </h2>

              <p className="mt-2 max-w-3xl text-slate-600">
                Move from the country view into regions, cities and places to discover connected Arknoz content at each level.
              </p>

            </div>

            <Link
              href={buildGeographyHref(context.parent ?? "global")}
              className="text-sm font-bold text-blue-700"
            >
              Back to Asia →
            </Link>

          </div>

          {children.length > 0 ? (

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {children.map(
                (child) => (

                  <Link
                    key={child.slug}
                    href={buildGeographyHref(child.slug)}
                    className="group overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {regionImages[
                      child.slug
                    ] ? (

                      <div className="aspect-[1.5/1] overflow-hidden bg-slate-100">

                        <img
                          src={
                            regionImages[
                              child.slug
                            ]
                          }
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />

                      </div>

                    ) : (

                      <div className="flex aspect-[1.5/1] items-center justify-center bg-gradient-to-br from-[#dcebf8] to-[#b8cfe2]">

                        <span className="text-4xl font-bold text-[#0b2949]/30">
                          {child.name
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>

                      </div>

                    )}

                    <div className="p-5">

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        {child.type}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-950">
                        {child.name}
                      </h3>

                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                        {child.subtitle}
                      </p>

                      <p className="mt-4 text-sm font-bold text-blue-700">
                        Explore →
                      </p>

                    </div>

                  </Link>
                )
              )}

            </div>

          ) : (

            <div className="mt-7 rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Regional pages will appear when genuine Arknoz geography records are available.
            </div>

          )}

        </div>

      </section>

      <section
        id="connected"
        className="bg-white py-12"
      >

        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            CONNECTED BUILT WORLD
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Explore {context.name} across Arknoz.
          </h2>

          <p className="mt-2 max-w-3xl text-slate-600">
            Discover projects, products, people, organisations and knowledge connected across this part of the Built World.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {worldLinks.map(
              (
                item,
                index
              ) => (
                <Link
                  key={item.key}
                  href={buildArknozSectionHref(
                    item.key,
                    {
                      geo: context.slug,
                    }
                  )}
                  title={
                    item.paid
                      ? `${item.label} - Arknoz Pro`
                      : item.label
                  }
                  className={`rounded-[20px] p-5 transition hover:-translate-y-1 hover:shadow-md ${
                    item.paid
                      ? "bg-slate-100 text-slate-500"
                      : index === 0
                        ? "bg-[#0b2949] text-white"
                        : "bg-[#eef3f8] text-slate-950"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                        item.paid
                          ? "text-slate-500"
                          : index === 0
                            ? "text-blue-200"
                            : "text-blue-700"
                      }`}
                    >
                      {item.label}
                    </p>

                    {item.paid && (
                      <span className="rounded-full border border-slate-300 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        Arknoz Pro &middot; Locked
                      </span>
                    )}
                  </div>

                  <p className="mt-7 font-bold">
                    Explore in {context.name}
                  </p>

                  <p
                    className={`mt-4 text-sm font-bold ${
                      item.paid
                        ? "text-slate-500"
                        : index === 0
                          ? "text-blue-200"
                          : "text-blue-700"
                    }`}
                  >
                    {item.paid
                      ? "Preview Arknoz Pro →"
                      : "Explore →"}
                  </p>
                </Link>
              )
            )}

          </div>

        </div>

      </section>

      <UniversalFooterStrip />
      <GlobalFooter />

    </main>
  );
}
