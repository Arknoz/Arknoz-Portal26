"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";


export type GeographyExplorerItem = {
  type: string;
  title: string;
  subtitle?: string;
  context?: string;
  href: string;
  image: string;
};


type Props = {
  contextName: string;

  locations: GeographyExplorerItem[];

  records: GeographyExplorerItem[];
};


function Card({
  item,
}: {
  item: GeographyExplorerItem;
}) {

  return (
    <Link
      href={item.href}
      className="
        group
        relative
        min-h-[280px]
        overflow-hidden
        rounded-[24px]
        bg-[#17384a]
        outline-none
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        focus-visible:ring-2
        focus-visible:ring-blue-600
        focus-visible:ring-offset-2
      "
    >

      <img
        src={
          item.image ||
          "/visuals/portal/place.png"
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
          via-[#03121c]/25
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
            text-[8px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-cyan-100/75
          "
        >
          {item.type}
        </p>


        <h3
          className="
            mt-2
            text-xl
            font-semibold
            leading-[1.05]
            tracking-[-0.035em]
          "
        >
          {item.title}
        </h3>


        {item.subtitle ? (
          <p
            className="
              mt-2
              line-clamp-2
              text-[11px]
              leading-5
              text-white/65
            "
          >
            {item.subtitle}
          </p>
        ) : null}


        {item.context ? (
          <p
            className="
              mt-3
              text-[9px]
              font-medium
              text-white/55
            "
          >
            {item.context}
          </p>
        ) : null}


        <p
          className="
            mt-4
            text-[10px]
            font-semibold
          "
        >
          Open →
        </p>

      </div>

    </Link>
  );
}


export default function GeographyInteractiveExplorer({
  contextName,
  locations,
  records,
}: Props) {

  const [
    mode,
    setMode,
  ] =
    useState<
      "locations" |
      "records"
    >(
      locations.length > 0
        ? "locations"
        : "records"
    );


  const [
    query,
    setQuery,
  ] =
    useState("");


  const [
    activeType,
    setActiveType,
  ] =
    useState("all");


  const [
    visibleCount,
    setVisibleCount,
  ] =
    useState(12);


  const source =
    mode === "locations"
      ? locations
      : records;


  const types =
    useMemo(
      () =>
        [
          "all",
          ...Array.from(
            new Set(
              source.map(
                (item) =>
                  item.type
              )
            )
          ),
        ],
      [source]
    );


  const filtered =
    useMemo(
      () => {

        const needle =
          query
            .trim()
            .toLowerCase();


        return source.filter(
          (item) => {

            if (
              activeType !== "all" &&
              item.type !== activeType
            ) {
              return false;
            }


            if (!needle) {
              return true;
            }


            return [
              item.title,
              item.subtitle,
              item.context,
              item.type,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(needle);
          }
        );
      },
      [
        source,
        query,
        activeType,
      ]
    );


  const visible =
    filtered.slice(
      0,
      visibleCount
    );


  function changeMode(
    next:
      "locations" |
      "records"
  ) {

    setMode(next);
    setActiveType("all");
    setVisibleCount(12);
  }


  return (
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

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-teal-700
              "
            >
              EXPLORE {contextName.toUpperCase()}
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
              Find the place or Built World record you need.
            </h2>

          </div>


          <div
            className="
              flex
              rounded-full
              border
              border-slate-200
              bg-white
              p-1
            "
          >

            {locations.length > 0 ? (
              <button
                type="button"
                onClick={() =>
                  changeMode(
                    "locations"
                  )
                }
                className={`
                  rounded-full
                  px-4
                  py-2
                  text-[11px]
                  font-semibold
                  transition
                  ${
                    mode === "locations"
                      ? "bg-slate-950 text-white"
                      : "text-slate-600"
                  }
                `}
              >
                Places
              </button>
            ) : null}


            <button
              type="button"
              onClick={() =>
                changeMode(
                  "records"
                )
              }
              className={`
                rounded-full
                px-4
                py-2
                text-[11px]
                font-semibold
                transition
                ${
                  mode === "records"
                    ? "bg-slate-950 text-white"
                    : "text-slate-600"
                }
              `}
            >
              Built World
            </button>

          </div>

        </div>


        <div
          className="
            mt-7
            rounded-[26px]
            border
            border-slate-200
            bg-white
            p-4
            sm:p-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
            "
          >

            <input
              value={query}
              onChange={
                (event) => {
                  setQuery(
                    event.target.value
                  );

                  setVisibleCount(12);
                }
              }
              placeholder={`Search ${contextName}...`}
              className="
                min-h-[46px]
                w-full
                rounded-full
                border
                border-slate-200
                bg-[#f8fafb]
                px-5
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                lg:max-w-[430px]
              "
            />


            <div
              className="
                flex
                min-w-0
                flex-1
                gap-2
                overflow-x-auto
              "
            >

              {types.map(
                (type) => (

                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActiveType(
                        type
                      );

                      setVisibleCount(12);
                    }}
                    className={`
                      shrink-0
                      rounded-full
                      border
                      px-3.5
                      py-2
                      text-[10px]
                      font-semibold
                      capitalize
                      transition
                      ${
                        activeType === type
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }
                    `}
                  >
                    {type === "all"
                      ? "All"
                      : type}
                  </button>

                )
              )}

            </div>

          </div>

        </div>


        {visible.length > 0 ? (

          <>
            <div
              className="
                mt-5
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {visible.map(
                (item) => (

                  <Card
                    key={`${item.type}-${item.href}`}
                    item={item}
                  />

                )
              )}

            </div>


            {visibleCount <
            filtered.length ? (

              <div
                className="
                  mt-7
                  flex
                  justify-center
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (value) =>
                        value + 12
                    )
                  }
                  className="
                    rounded-full
                    border
                    border-slate-300
                    bg-white
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-slate-800
                    transition
                    hover:bg-slate-50
                  "
                >
                  Show more
                </button>

              </div>

            ) : null}

          </>

        ) : (

          <div
            className="
              mt-5
              rounded-[24px]
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              py-12
              text-center
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-slate-900
              "
            >
              No matching records.
            </p>

            <p
              className="
                mt-2
                text-xs
                text-slate-500
              "
            >
              Try another search or filter.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}