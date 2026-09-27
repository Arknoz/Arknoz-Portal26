import Link from "next/link";

import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";
import GlobalGeographyTabs from "@/components/GlobalGeographyTabs";

import {
  buildGeographyHref,
  getChildren,
  getGeographyDescendants,
  type GeographyItem,
} from "@/lib/geography";

export type GlobalGeographyCollectionKind =
  | "continents"
  | "countries"
  | "regions"
  | "cities"
  | "places";

const collectionConfig: Record<
  GlobalGeographyCollectionKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    singularType:
      | "continent"
      | "country"
      | "region"
      | "city"
      | "place";
  }
> = {
  continents: {
    eyebrow: "GLOBAL · CONTINENTS",
    title: "Explore the Built World by continent.",
    description:
      "Move across continental contexts while keeping every Arknoz record connected to one canonical identity.",
    searchPlaceholder:
      "Search continents, countries, cities, projects or topics...",
    singularType: "continent",
  },

  countries: {
    eyebrow: "GLOBAL · COUNTRIES",
    title: "Explore countries.",
    description:
      "Discover country-level Built World context, projects, knowledge, organisations, people and opportunities.",
    searchPlaceholder:
      "Search countries, projects, organisations or topics...",
    singularType: "country",
  },

  regions: {
    eyebrow: "GLOBAL · REGIONS & STATES",
    title: "Explore regions and states.",
    description:
      "Move deeper into the administrative and regional contexts that shape Built World relevance and practice.",
    searchPlaceholder:
      "Search regions, states, countries, cities or topics...",
    singularType: "region",
  },

  cities: {
    eyebrow: "GLOBAL · CITIES",
    title: "Explore cities.",
    description:
      "Discover local Built World activity through city context while retaining connections to country and global knowledge.",
    searchPlaceholder:
      "Search cities, projects, organisations or topics...",
    singularType: "city",
  },

  places: {
    eyebrow: "GLOBAL · PLACES",
    title: "Explore places.",
    description:
      "Move into the most contextual geographic layer of Arknoz, connected back through city, country, continent and Global.",
    searchPlaceholder:
      "Search places, cities, projects or topics...",
    singularType: "place",
  },
};

function getCollectionItems(
  kind: GlobalGeographyCollectionKind
) {
  const config =
    collectionConfig[kind];

  if (kind === "continents") {
    return getChildren("global").filter(
      (item) =>
        item.type === "continent"
    );
  }

  return getGeographyDescendants(
    "global"
  ).filter(
    (item) =>
      item.type ===
      config.singularType
  );
}

function GeographyCollectionGrid({
  title,
  items,
}: {
  title: string;
  items: GeographyItem[];
}) {
  return (
    <section className="bg-[#f6f8fb] py-14">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
          GLOBAL GEOGRAPHY
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h2>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={buildGeographyHref(
                  item.slug
                )}
                className="group rounded-[22px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  {item.type}
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.subtitle}
                </p>

                <p className="mt-5 text-sm font-bold text-blue-700">
                  Explore →
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[22px] border border-slate-200 bg-white p-8 text-slate-600">
            Genuine connected geography will appear here as it becomes available.
          </div>
        )}
      </div>
    </section>
  );
}

export default function GlobalGeographyCollectionPage({
  kind,
}: {
  kind: GlobalGeographyCollectionKind;
}) {
  const config =
    collectionConfig[kind];

  const items =
    getCollectionItems(kind);

  const popular =
    items
      .slice(0, 6)
      .map((item) => ({
        label: item.name,
        href: buildGeographyHref(
          item.slug
        ),
      }));

  const contextNav = [
    {
      label: "Global Home",
      href: "/global",
    },
    {
      label: "Continents",
      href: "/global/continents",
    },
    {
      label: "Countries",
      href: "/global/countries",
    },
    {
      label: "Regions & States",
      href: "/global/regions",
    },
    {
      label: "Cities",
      href: "/global/cities",
    },
    {
      label: "Places",
      href: "/global/places",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <UniversalPublicFirstScreen
        eyebrow={config.eyebrow}
        title={config.title}
        description={
          config.description
        }
        searchPlaceholder={
          config.searchPlaceholder
        }
        popular={popular}
        contextNav={contextNav}
        featured={[]}
        ticker={[
          {
            text:
              "Global → continent → country → region → city → place",
            href: "/global",
          },
          {
            text:
              `Explore ${kind} across the connected Built World`,
            href: "#collection",
          },
          {
            text:
              "One canonical identity across every geography",
            href: "/global",
          },
        ]}
      />

      <div id="collection">
        {kind === "continents" ? (
          <GlobalGeographyTabs />
        ) : (
          <GeographyCollectionGrid
            title={
              kind === "countries"
                ? "Countries already connected in Arknoz."
                : kind === "regions"
                  ? "Regions and states already connected in Arknoz."
                  : kind === "cities"
                    ? "Cities already connected in Arknoz."
                    : "Places already connected in Arknoz."
            }
            items={items}
          />
        )}
      </div>

      <UniversalPublicLastScreen />
    </main>
  );
}