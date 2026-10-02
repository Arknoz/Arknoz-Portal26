import Link from "next/link";

import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

import GeographyBrowseClient, {
  type GeographyBrowseItem,
} from "@/components/geography/GeographyBrowseClient";

import {
  entities,
  type EntityRecord,
} from "@/lib/entities";

import {
  geography,
  type GeographyItem,
  buildGeographyHref,
  getChildren,
  getGeographyPath,
} from "@/lib/geography";

import {
  entityMatchesGeography,
} from "@/lib/entity-geography";

import {
  getEntityHref,
} from "@/components/EntityCard";


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
    continents: "continent",
    countries: "country",
    regions: "region",
    cities: "city",
    places: "place",
  };


function geographyTypeLabel(
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


function childHeading(
  type: GeographyItem["type"]
) {

  switch (type) {

    case "global":
      return "Explore continents.";

    case "continent":
      return "Explore countries.";

    case "country":
      return "Explore regions, states and cities.";

    case "region":
      return "Explore cities and places.";

    case "city":
      return "Explore local places.";

    case "place":
      return "Explore connected places.";
  }
}


function projectImage(
  entity?: EntityRecord
) {

  return (
    entity?.type === "project"
      ? entity.project?.media?.[0]?.src
      : undefined
  );
}


function findFallbackImage() {

  for (const entity of entities) {

    const image =
      projectImage(entity);

    if (image) {
      return image;
    }
  }

  return "/visuals/portal/place.png";
}


function imageForGeography(
  item: GeographyItem,
  fallback: string
) {

  const matched =
    entities.find(
      (entity) =>
        entity.type === "project" &&
        entityMatchesGeography(
          entity,
          item
        ) &&
        Boolean(
          projectImage(entity)
        )
    );


  return (
    projectImage(matched) ||
    fallback
  );
}


function imageForRecord(
  entity: EntityRecord,
  fallback: string
) {

  return (
    projectImage(entity) ||
    fallback
  );
}


export default function UniversalGeographyExperience({
  context,
  collectionKind,
}: {
  context: GeographyItem;
  collectionKind?: GeographyCollectionKind;
}) {

  const fallbackImage =
    findFallbackImage();


  const path =
    getGeographyPath(
      context.slug
    );


  const localRecords =
    entities.filter(
      (entity) =>
        entityMatchesGeography(
          entity,
          context
        )
    );


  const projectRecords =
    localRecords.filter(
      (entity) =>
        entity.type === "project"
    );


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


  const browseItems:
    GeographyBrowseItem[] =
    children.map(
      (item) => ({
        id:
          `geo-${item.slug}`,

        type:
          geographyTypeLabel(
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
          imageForGeography(
            item,
            fallbackImage
          ),
      })
    );


  const heroRecords =
    (
      projectRecords.length > 0
        ? projectRecords
        : localRecords
    ).slice(
      0,
      3
    );


  const heroFeatured =
    heroRecords.map(
      (entity) => ({
        type:
          entity.type.toUpperCase(),

        title:
          entity.title,

        meta:
          entity.geography ||
          entity.subtitle,

        href:
          getEntityHref(entity),

        image:
          imageForRecord(
            entity,
            fallbackImage
          ),
      })
    );


  const connectedRecords =
    localRecords
      .slice(0, 8);


  const pageTitle =
    collectionKind
      ? `Explore ${collectionKind}.`
      : context.type === "global"
        ? "Explore the Built World by place."
        : `Explore ${context.name}.`;


  const pageDescription =
    collectionKind
      ? `Search and navigate Arknoz ${collectionKind} through one connected geography system.`
      : context.subtitle;


  const scaleCards =
    context.type === "global" &&
    !collectionKind
      ? [
          {
            number: "01",
            title: "Continents",
            text: "Start with the world's major continental contexts.",
            href: "/global/continents",
          },
          {
            number: "02",
            title: "Countries",
            text: "Move directly into national Built World context.",
            href: "/global/countries",
          },
          {
            number: "03",
            title: "Regions & States",
            text: "Explore sub-national and regional context.",
            href: "/global/regions",
          },
          {
            number: "04",
            title: "Cities",
            text: "Enter the urban Built World.",
            href: "/global/cities",
          },
          {
            number: "05",
            title: "Places",
            text: "Continue to precise local context.",
            href: "/global/places",
          },
        ]
      : [];


  const gateways = [
    {
      label: "Projects",
      text: "Built work and project records",
      href:
        `/projects?geo=${context.slug}`,
    },
    {
      label: "Products",
      text: "Materials, systems and equipment",
      href:
        `/products?geo=${context.slug}`,
    },
    {
      label: "Knowledge",
      text: "Research, cases and references",
      href:
        `/knowledge?geo=${context.slug}`,
    },
    {
      label: "Education",
      text: "Learning and programmes",
      href:
        `/learning?geo=${context.slug}`,
    },
    {
      label: "Opportunities",
      text: "Jobs, competitions and opportunities",
      href:
        `/opportunities?geo=${context.slug}`,
    },
    {
      label: "Organisations",
      text: "Practices, institutions and companies",
      href:
        `/organisations?geo=${context.slug}`,
    },
  ];


  return (
    <main
      data-arknoz-geography-v2={
        collectionKind ||
        context.type
      }
      className="
        min-h-screen
        bg-white
        text-slate-950
      "
    >

      {/* ======================================================
          01 + 02
          USE EXISTING FROZEN HOME / EXPLORE OPENING SYSTEM
         ====================================================== */}

      <UniversalPublicFirstScreen
        eyebrow="ARKNOZ"
        title="One connected Built World."
        description="Explore projects, products, knowledge, education, opportunities and the Arknoz member community through one connected global system."
        searchPlaceholder="Search the Built World..."
        popular={[
          "Projects",
          "Products",
          "Knowledge",
          "Education",
          "Opportunities",
          "Community",
        ]}
        featured={heroFeatured}
        ticker={[
          {
            text:
              "Explore the Built World by place",
            href:
              "/global",
          },
          {
            text:
              "Move from global to local context",
            href:
              "/global/continents",
          },
          {
            text:
              "Explore countries",
            href:
              "/global/countries",
          },
          {
            text:
              "Explore cities",
            href:
              "/global/cities",
          },
        ]}
        searchGeo={
          context.type === "global"
            ? undefined
            : context.slug
        }
        featuredHref="/featured"
      />


      {/* ======================================================
          03 — COMPACT LOCATION IDENTITY / BREADCRUMB
         ====================================================== */}

      <section
        className="
          border-y
          border-slate-200
          bg-white
          px-4
          py-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-[1720px]
            flex-col
            gap-3
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <nav
            aria-label="Geography breadcrumb"
            className="
              flex
              min-w-0
              items-center
              gap-2
              overflow-x-auto
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            {path.map(
              (item, index) => (

                <div
                  key={item.slug}
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                  "
                >

                  {index > 0 ? (
                    <span
                      className="
                        text-slate-300
                      "
                    >
                      /
                    </span>
                  ) : null}


                  <Link
                    href={
                      buildGeographyHref(
                        item.slug
                      )
                    }
                    className="
                      text-[12px]
                      font-semibold
                      text-slate-600
                      transition
                      hover:text-slate-950
                    "
                  >
                    {item.name}
                  </Link>

                </div>

              )
            )}

          </nav>


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                rounded-full
                bg-slate-100
                px-3
                py-1.5
                text-[11px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-slate-500
              "
            >
              {collectionKind
                ? collectionKind
                : geographyTypeLabel(
                    context.type
                  )}
            </span>


            {context.parent ? (

              <Link
                href={
                  buildGeographyHref(
                    context.parent
                  )
                }
                className="
                  text-[12px]
                  font-semibold
                  text-teal-800
                "
              >
                ← Parent
              </Link>

            ) : null}

          </div>

        </div>

      </section>


      {/* ======================================================
          04 — LOCATION IDENTITY
         ====================================================== */}

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
            grid
            max-w-[1720px]
            gap-8
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
              {collectionKind
                ? `GLOBAL · ${collectionKind.toUpperCase()}`
                : geographyTypeLabel(
                    context.type
                  ).toUpperCase()}
            </p>


            <h1
              className="
                mt-3
                max-w-[16ch]
                text-4xl
                font-semibold
                leading-[0.98]
                tracking-[-0.05em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              {pageTitle}
            </h1>

          </div>


          <div
            className="
              lg:justify-self-end
            "
          >

            <p
              className="
                max-w-xl
                text-sm
                leading-7
                text-slate-500
              "
            >
              {pageDescription}
            </p>


            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >

              <span
                className="
                  rounded-full
                  border
                  border-slate-200
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-slate-500
                "
              >
                {children.length}
                {" "}
                {collectionKind
                  ? collectionKind
                  : "connected places"}
              </span>


              <span
                className="
                  rounded-full
                  border
                  border-slate-200
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-slate-500
                "
              >
                {localRecords.length}
                {" "}
                Built World records
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          GLOBAL ONLY — EXPLORE BY SCALE
         ====================================================== */}

      {scaleCards.length > 0 ? (

        <section
          className="
            bg-[#071f35]
            px-4
            py-9
            text-white
            sm:px-6
            lg:px-8
            lg:py-11
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
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-5
              "
            >

              {scaleCards.map(
                (item) => (

                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      group
                      flex
                      min-h-[175px]
                      flex-col
                      rounded-[22px]
                      border
                      border-white/10
                      bg-white/[0.055]
                      p-5
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:bg-white/[0.09]
                    "
                  >

                    <span
                      className="
                        text-[10px]
                        font-bold
                        tracking-[0.18em]
                        text-cyan-100/40
                      "
                    >
                      {item.number}
                    </span>


                    <div
                      className="
                        mt-auto
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
                          text-[12px]
                          leading-5
                          text-white/50
                        "
                      >
                        {item.text}
                      </p>


                      <p
                        className="
                          mt-4
                          text-[11px]
                          font-semibold
                        "
                      >
                        Explore →
                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          </div>

        </section>

      ) : null}


      {/* ======================================================
          05 — INTERACTIVE GEOGRAPHY BROWSE
         ====================================================== */}

      {browseItems.length > 0 ? (

        <GeographyBrowseClient
          eyebrow={
            collectionKind
              ? `ALL ${collectionKind}`
              : context.name
          }
          title={
            collectionKind
              ? `Browse ${collectionKind}.`
              : childHeading(
                  context.type
                )
          }
          items={browseItems}
        />

      ) : null}


      {/* ======================================================
          06 — BUILT WORLD GATEWAYS
          LINKS ONLY — CONTENT PAGE DESIGN COMES NEXT
         ====================================================== */}

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
            max-w-[1720px]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
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
                  text-teal-700
                "
              >
                BUILT WORLD
              </p>


              <h2
                className="
                  mt-3
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  sm:text-4xl
                "
              >
                Built World in {context.name}.
              </h2>

            </div>


            <p
              className="
                max-w-lg
                text-sm
                leading-7
                text-slate-500
                lg:text-right
              "
            >
              Continue from geography into the part of Arknoz
              that matters to you.
            </p>

          </div>


          <div
            className="
              mt-7
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {gateways.map(
              (item, index) => (

                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group
                    relative
                    min-h-[190px]
                    overflow-hidden
                    rounded-[22px]
                    bg-[#17384a]
                  "
                >

                  <img
                    src={
                      projectRecords[
                        index %
                        Math.max(
                          projectRecords.length,
                          1
                        )
                      ]
                        ? imageForRecord(
                            projectRecords[
                              index %
                              projectRecords.length
                            ],
                            fallbackImage
                          )
                        : fallbackImage
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
                      from-[#03121c]/95
                      via-[#03121c]/30
                      to-transparent
                    "
                  />


                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      z-10
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
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </p>


                    <h3
                      className="
                        mt-2
                        text-xl
                        font-semibold
                        tracking-[-0.03em]
                      "
                    >
                      {item.label}
                    </h3>


                    <p
                      className="
                        mt-2
                        text-[12px]
                        text-white/60
                      "
                    >
                      {item.text}
                    </p>


                    <p
                      className="
                        mt-4
                        text-[11px]
                        font-semibold
                      "
                    >
                      Explore →
                    </p>

                  </div>

                </Link>

              )
            )}

          </div>

        </div>

      </section>


      {/* ======================================================
          07 — CONNECTED RECORDS
         ====================================================== */}

      {connectedRecords.length > 0 ? (

        <section
          className="
            bg-[#f4f6f8]
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
              max-w-[1720px]
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
                CONNECTED
              </p>


              <h2
                className="
                  mt-3
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  sm:text-4xl
                "
              >
                Connected to {context.name}.
              </h2>

            </div>


            <div
              className="
                mt-7
                flex
                gap-4
                overflow-x-auto
                pb-3
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >

              {connectedRecords.map(
                (entity) => (

                  <Link
                    key={
                      `${entity.type}-${entity.slug}`
                    }
                    href={
                      getEntityHref(entity)
                    }
                    className="
                      group
                      relative
                      h-[260px]
                      w-[270px]
                      shrink-0
                      overflow-hidden
                      rounded-[22px]
                      bg-[#17384a]
                    "
                  >

                    <img
                      src={
                        imageForRecord(
                          entity,
                          fallbackImage
                        )
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


      {/* ======================================================
          08 + 09 + 10
          EXISTING UNIVERSAL ENDING
         ====================================================== */}

      <UniversalPublicLastScreen />

    </main>
  );
}