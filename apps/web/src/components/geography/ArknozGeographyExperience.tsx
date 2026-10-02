import Link from "next/link";

import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

import ArknozGeographyBrowser, {
  type ArknozGeographyBrowseItem,
} from "@/components/geography/ArknozGeographyBrowser";

import {
  entities,
  type EntityRecord,
} from "@/lib/entities";

import {
  geography,
  type GeographyItem,
  buildGeographyHref,
  getChildren,
  getGeographyDescendants,
  getGeographyPath,
} from "@/lib/geography";

import {
  entityMatchesGeography,
} from "@/lib/entity-geography";

import {
  getEntityHref,
} from "@/components/EntityCard";

import {
  getProductionEntities,
} from "@/lib/data/production-entities";


export type GeographyCollectionKind =
  | "continents"
  | "countries"
  | "regions"
  | "cities"
  | "places";


const collectionType:
  Record<
    GeographyCollectionKind,
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


function levelLabel(
  type: GeographyItem["type"]
) {

  switch (type) {

    case "global":
      return "Global";

    case "continent":
      return "Continent";

    case "country":
      return "Country";

    case "region":
      return "Region / State";

    case "city":
      return "City";

    case "place":
      return "Place";
  }
}


function nextLabel(
  type: GeographyItem["type"]
) {

  switch (type) {

    case "global":
      return "Continents";

    case "continent":
      return "Countries";

    case "country":
      return "Regions, States & Cities";

    case "region":
      return "Cities & Places";

    case "city":
      return "Districts & Places";

    case "place":
      return "Connected Places";
  }
}


function pageTitle(
  context: GeographyItem,
  collectionKind?: GeographyCollectionKind
) {

  if (collectionKind) {

    switch (collectionKind) {

      case "continents":
        return "Explore continents.";

      case "countries":
        return "Explore countries.";

      case "regions":
        return "Explore regions and states.";

      case "cities":
        return "Explore cities.";

      case "places":
        return "Explore places.";
    }
  }


  if (
    context.type === "global"
  ) {
    return "Explore the Built World by place.";
  }


  return `Explore ${context.name}.`;
}


function entityImage(
  entity?: EntityRecord
) {

  if (
    entity?.type === "project"
  ) {

    return (
      entity.project
        ?.media
        ?.[0]
        ?.src
    );
  }


  return undefined;
}


function mergeEntities(
  production:
    EntityRecord[]
) {

  const map =
    new Map<
      string,
      EntityRecord
    >();


  for (
    const entity
    of entities
  ) {

    map.set(
      `${entity.type}:${entity.slug}`,
      entity
    );
  }


  for (
    const entity
    of production
  ) {

    map.set(
      `${entity.type}:${entity.slug}`,
      entity
    );
  }


  return [
    ...map.values(),
  ];
}


export default async function ArknozGeographyExperience({
  context,
  collectionKind,
}: {
  context: GeographyItem;
  collectionKind?: GeographyCollectionKind;
}) {

  const production =
    await getProductionEntities();


  const allEntities =
    mergeEntities(
      production
    );


  const localEntities =
    allEntities.filter(
      (entity) =>
        entityMatchesGeography(
          entity,
          context
        )
    );


  const localProjects =
    localEntities.filter(
      (entity) =>
        entity.type === "project"
    );


  const globalImage =
    allEntities
      .map(
        (entity) =>
          entityImage(entity)
      )
      .find(Boolean) ||
    "/visuals/portal/place.png";


  const heroImage =
    localProjects
      .map(
        (entity) =>
          entityImage(entity)
      )
      .find(Boolean) ||
    globalImage;


  const children =
    collectionKind
      ? geography.filter(
          (item) =>
            item.type ===
            collectionType[
              collectionKind
            ]
        )
      : getChildren(
          context.slug
        );


  function geographyImage(
    item:
      GeographyItem
  ) {

    const matching =
      allEntities.find(
        (entity) =>
          entity.type ===
            "project" &&
          entityMatchesGeography(
            entity,
            item
          ) &&
          Boolean(
            entityImage(entity)
          )
      );


    return (
      entityImage(
        matching
      ) ||
      heroImage
    );
  }


  const browseItems:
    ArknozGeographyBrowseItem[] =
    children.map(
      (item) => ({

        id:
          `geo-${item.slug}`,

        type:
          levelLabel(
            item.type
          ),

        title:
          item.name,

        subtitle:
          item.subtitle,

        context:
          item.parent
            ? geography.find(
                (candidate) =>
                  candidate.slug ===
                  item.parent
              )?.name
            : "Global",

        href:
          buildGeographyHref(
            item.slug
          ),

        image:
          geographyImage(
            item
          ),
      })
    );


  const path =
    getGeographyPath(
      context.slug
    );


  const descendants =
    getGeographyDescendants(
      context.slug
    );


  const connected =
    localEntities
      .slice(0, 8);


  const scaleCards =
    [
      {
        title:
          "Continents",

        text:
          "Start with continental context.",

        href:
          "/global/continents",

        type:
          "continent",
      },

      {
        title:
          "Countries",

        text:
          "Explore national Built World context.",

        href:
          "/global/countries",

        type:
          "country",
      },

      {
        title:
          "Regions & States",

        text:
          "Move into regional context.",

        href:
          "/global/regions",

        type:
          "region",
      },

      {
        title:
          "Cities",

        text:
          "Explore the urban Built World.",

        href:
          "/global/cities",

        type:
          "city",
      },

      {
        title:
          "Places",

        text:
          "Continue into local context.",

        href:
          "/global/places",

        type:
          "place",
      },
    ];


  const gateways =
    [
      {
        label:
          "Projects",

        description:
          "Built work and projects",

        href:
          context.type === "global"
            ? "/projects"
            : `/projects?geo=${context.slug}`,
      },

      {
        label:
          "Products",

        description:
          "Materials and systems",

        href:
          context.type === "global"
            ? "/products"
            : `/products?geo=${context.slug}`,
      },

      {
        label:
          "Knowledge",

        description:
          "Research and references",

        href:
          context.type === "global"
            ? "/knowledge"
            : `/knowledge?geo=${context.slug}`,
      },

      {
        label:
          "Education",

        description:
          "Learning and programmes",

        href:
          context.type === "global"
            ? "/learning"
            : `/learning?geo=${context.slug}`,
      },

      {
        label:
          "Opportunities",

        description:
          "Jobs and opportunities",

        href:
          context.type === "global"
            ? "/opportunities"
            : `/opportunities?geo=${context.slug}`,
      },

      {
        label:
          "Organisations",

        description:
          "Practices and institutions",

        href:
          context.type === "global"
            ? "/organisations"
            : `/organisations?geo=${context.slug}`,
      },
    ];


  const collectionTitle =
    collectionKind
      ? collectionKind
      : nextLabel(
          context.type
        );


  const geographyPathItems =
    path.filter(
      (item) =>
        item.type !== "global"
    );


  const collectionBreadcrumbLabel =
    collectionKind
      ? collectionKind
          .charAt(0)
          .toUpperCase() +
        collectionKind.slice(1)
      : "Global";


  const geographyBreadcrumb =
    collectionKind
      ? [
          {
            label: "Explore",
            href: "/explore",
          },
          {
            label:
              collectionBreadcrumbLabel,
          },
        ]
      : [
          {
            label: "Explore",
            href: "/explore",
          },

          ...(geographyPathItems.length > 0
            ? geographyPathItems.map(
                (item, index) => ({
                  label: item.name,

                  href:
                    index <
                    geographyPathItems.length -
                      1
                      ? buildGeographyHref(
                          item.slug
                        )
                      : undefined,
                })
              )
            : [
                {
                  label: "Global",
                },
              ]),
        ];


  const geographyPopular =
    children
      .slice(0, 6)
      .map((item) => ({
        label: item.name,
        href: buildGeographyHref(
          item.slug
        ),
      }));


  const geographyFeatured =
    connected
      .slice(0, 3)
      .map((entity) => ({
        type:
          entity.type.toUpperCase(),

        title:
          entity.title,

        meta:
          entity.geography,

        href:
          getEntityHref(entity),

        image:
          entityImage(entity) ||
          heroImage,
      }));


  return (
    <main
      data-geography-master="ARKNOZ_GEOGRAPHY_FINAL"
      data-geography-level={
        collectionKind ||
        context.type
      }
      className="
        min-h-screen
        bg-white
        text-slate-950
      "
    >
      <UniversalPublicFirstScreen
        eyebrow={
          collectionKind
            ? `GLOBAL · ${collectionKind.toUpperCase()}`
            : levelLabel(
                context.type
              ).toUpperCase()
        }

        breadcrumb={
          geographyBreadcrumb
        }

        title={
          pageTitle(
            context,
            collectionKind
          )
        }

        description={
          collectionKind
            ? `Discover ${collectionKind} through one connected Arknoz geography system.`
            : context.subtitle
        }

        searchPlaceholder={
          context.type === "global"
            ? "Search country, region, city or place..."
            : `Search ${context.name}...`
        }

        popular={
          geographyPopular
        }

        featured={
          geographyFeatured
        }

        ticker={[]}

        searchGeo={
          context.type !== "global"
            ? context.slug
            : undefined
        }

        featuredHref={
          context.type !== "global"
            ? `/featured?geo=${encodeURIComponent(
                context.slug
              )}`
            : "/featured"
        }
      />



      {/* ======================================================
          GLOBAL SCALE NAVIGATION
         ====================================================== */}

      {context.type ===
        "global" &&
      !collectionKind ? (

        <section
          className="
            bg-[#071f35]
            px-4
            pb-8
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              mx-auto
              grid
              max-w-[1720px]
              gap-3
              sm:grid-cols-2
              lg:grid-cols-5
            "
          >

            {scaleCards.map(
              (item) => {

                const firstGeo =
                  geography.find(
                    (geo) =>
                      geo.type ===
                      item.type
                  );


                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      group
                      relative
                      min-h-[190px]
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-white/10
                      bg-[#12364f]
                    "
                  >

                    <img
                      src={
                        firstGeo
                          ? geographyImage(
                              firstGeo
                            )
                          : heroImage
                      }
                      alt=""
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.05]
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/25
                        to-transparent
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        p-5
                        text-white
                      "
                    >

                      <h2
                        className="
                          text-lg
                          font-semibold
                        "
                      >
                        {item.title}
                      </h2>


                      <p
                        className="
                          mt-2
                          text-[11px]
                          leading-5
                          text-white/60
                        "
                      >
                        {item.text}
                      </p>

                    </div>

                  </Link>
                );
              }
            )}

          </div>

        </section>

      ) : null}


      {/* ======================================================
          INTERACTIVE GEOGRAPHY
         ====================================================== */}

      {browseItems.length >
      0 ? (

        <ArknozGeographyBrowser
          eyebrow={
            collectionKind
              ? `GLOBAL · ${collectionKind.toUpperCase()}`
              : context.name.toUpperCase()
          }
          title={
            collectionKind
              ? `All ${collectionKind}.`
              : `${nextLabel(context.type)} in ${context.name}.`
          }
          items={
            browseItems
          }
        />

      ) : null}


      {/* ======================================================
          BUILT WORLD GATEWAYS
         ====================================================== */}

      <section
        id="built-world"
        className="
          bg-[#f5f7f8]
          px-4
          py-10
          sm:px-6
          lg:px-8
          lg:py-14
        "
      >

        <div
          className="
            mx-auto
            max-w-[1720px]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#0b7180]
                "
              >
                BUILT WORLD
              </p>


              <h2
                className="
                  mt-2
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                "
              >
                Built World in {context.name}.
              </h2>

            </div>


            <p
              className="
                max-w-md
                text-sm
                leading-6
                text-slate-500
                lg:text-right
              "
            >
              Geography connects directly into the main
              Arknoz worlds.
            </p>

          </div>


          <div
            className="
              mt-6
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-6
            "
          >

            {gateways.map(
              (item) => (

                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    group
                    min-h-[115px]
                    rounded-[18px]
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-md
                  "
                >

                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-slate-950
                    "
                  >
                    {item.label}
                  </h3>


                  <p
                    className="
                      mt-2
                      text-[11px]
                      leading-4
                      text-slate-500
                    "
                  >
                    {item.description}
                  </p>


                  <p
                    className="
                      mt-4
                      text-[11px]
                      font-semibold
                      text-[#0b7180]
                    "
                  >
                    Explore →
                  </p>

                </Link>

              )
            )}

          </div>

        </div>

      </section>


      {/* ======================================================
          CONNECTED RECORDS
         ====================================================== */}

      {connected.length >
      0 ? (

        <section
          className="
            bg-white
            px-4
            py-10
            sm:px-6
            lg:px-8
            lg:py-14
          "
        >

          <div
            className="
              mx-auto
              max-w-[1720px]
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                gap-6
              "
            >

              <div>

                <p
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                    text-[#0b7180]
                  "
                >
                  CONNECTED
                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                  "
                >
                  Connected in {context.name}.
                </h2>

              </div>

            </div>


            <div
              className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {connected.map(
                (entity) => (

                  <Link
                    key={
                      `${entity.type}-${entity.slug}`
                    }
                    href={
                      getEntityHref(
                        entity
                      )
                    }
                    className="
                      group
                      relative
                      min-h-[245px]
                      overflow-hidden
                      rounded-[18px]
                      bg-[#17384a]
                    "
                  >

                    <img
                      src={
                        entityImage(
                          entity
                        ) ||
                        heroImage
                      }
                      alt=""
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.04]
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/25
                        to-transparent
                      "
                    />


                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        p-5
                        text-white
                      "
                    >

                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.17em]
                          text-white/60
                        "
                      >
                        {entity.type}
                      </p>


                      <h3
                        className="
                          mt-2
                          line-clamp-3
                          text-lg
                          font-semibold
                          leading-[1.08]
                        "
                      >
                        {entity.title}
                      </h3>


                      <p
                        className="
                          mt-3
                          text-[11px]
                          text-white/55
                        "
                      >
                        {entity.geography}
                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          </div>

        </section>

      ) : null}


      <UniversalPublicLastScreen />

    </main>
  );
}