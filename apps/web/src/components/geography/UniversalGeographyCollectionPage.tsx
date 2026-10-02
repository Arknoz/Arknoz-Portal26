import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

import GeographyInteractiveExplorer, {
  type GeographyExplorerItem,
} from "@/components/geography/GeographyInteractiveExplorer";

import {
  geography,
  findGeography,
  buildGeographyHref,
  type GeographyItem,
} from "@/lib/geography";

import {
  getGeographyPageData,
} from "@/lib/geography-page-data";


export type GlobalGeographyCollectionKind =
  | "continents"
  | "countries"
  | "regions"
  | "cities"
  | "places";


const typeMap:
  Record<
    GlobalGeographyCollectionKind,
    GeographyItem["type"]
  > = {

    continents:
      "continent",

    countries:
      "country",

    regions:
      "region",

    cities:
      "city",

    places:
      "place",
  };


const titleMap:
  Record<
    GlobalGeographyCollectionKind,
    string
  > = {

    continents:
      "Explore continents.",

    countries:
      "Explore countries.",

    regions:
      "Explore regions and states.",

    cities:
      "Explore cities.",

    places:
      "Explore places.",
  };


export default async function UniversalGeographyCollectionPage({
  kind,
}: {
  kind:
    GlobalGeographyCollectionKind;
}) {

  const global =
    findGeography(
      "global"
    );


  if (!global) {
    throw new Error(
      "Global geography root is missing."
    );
  }


  const data =
    await getGeographyPageData(
      global
    );


  const targetType =
    typeMap[kind];


  const locations =
    geography.filter(
      (item) =>
        item.type === targetType
    );


  const items:
    GeographyExplorerItem[] =
    locations.map(
      (item) => {

        const image =
          data.records.find(
            (record) =>
              record.type ===
                "project" &&
              record.context
                .toLowerCase()
                .includes(
                  item.name
                    .toLowerCase()
                )
          )?.image ||
          data.featured[0]?.image ||
          "/visuals/portal/place.png";


        return {
          type:
            item.type,

          title:
            item.name,

          subtitle:
            item.subtitle,

          context:
            item.parent
              ? geography.find(
                  (parent) =>
                    parent.slug ===
                    item.parent
                )?.name
              : "Global",

          href:
            buildGeographyHref(
              item.slug
            ),

          image,
        };
      }
    );


  const heroFeatured =
    data.featured
      .slice(0, 3)
      .map(
        (record) => ({
          type:
            record.type.toUpperCase(),

          title:
            record.title,

          meta:
            record.context,

          href:
            record.href,

          image:
            record.image,
        })
      );


  return (
    <main
      data-geography-collection={kind}
      className="min-h-screen bg-white"
    >

      <UniversalPublicFirstScreen
        featured={
          heroFeatured
        }
      />


      <section
        className="
          bg-white
          px-4
          py-12
          sm:px-6
          lg:px-8
          lg:py-16
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-[1720px]
            gap-6
            lg:grid-cols-[1fr_.65fr]
            lg:items-end
          "
        >

          <div>

            <p
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-teal-700
              "
            >
              GLOBAL · {kind.toUpperCase()}
            </p>


            <h1
              className="
                mt-3
                text-4xl
                font-semibold
                tracking-[-0.05em]
                text-slate-950
                sm:text-5xl
              "
            >
              {titleMap[kind]}
            </h1>

          </div>


          <p
            className="
              max-w-xl
              text-sm
              leading-7
              text-slate-500
              lg:justify-self-end
            "
          >
            Search, filter and open the geography you need.
            The same interaction system scales as Arknoz adds
            more countries, regions, cities and places.
          </p>

        </div>

      </section>


      <GeographyInteractiveExplorer
        contextName={
          titleMap[kind]
            .replace(
              "Explore ",
              ""
            )
            .replace(
              ".",
              ""
            )
        }
        locations={
          items
        }
        records={[]}
      />


      <UniversalPublicLastScreen />

    </main>
  );
}