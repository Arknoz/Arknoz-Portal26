"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";


export type ArknozGeographyBrowseItem = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  context?: string;
  href: string;
  image: string;
};


export default function ArknozGeographyBrowser({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: ArknozGeographyBrowseItem[];
}) {

  const [query, setQuery] =
    useState("");

  const [activeType, setActiveType] =
    useState("all");

  const [order, setOrder] =
    useState<"az" | "za">("az");

  const [visibleCount, setVisibleCount] =
    useState(12);


  const types =
    useMemo(
      () => [
        "all",
        ...Array.from(
          new Set(
            items.map(
              (item) =>
                item.type
            )
          )
        ),
      ],
      [items]
    );


  const filtered =
    useMemo(
      () => {

        const needle =
          query
            .trim()
            .toLowerCase();


        const result =
          items.filter(
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


        return result.sort(
          (a, b) =>
            order === "az"
              ? a.title.localeCompare(
                  b.title
                )
              : b.title.localeCompare(
                  a.title
                )
        );
      },
      [
        items,
        query,
        activeType,
        order,
      ]
    );


  const visible =
    filtered.slice(
      0,
      visibleCount
    );


  return (
    <section
      id="geography-browser"
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
                text-[9px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#0b7180]
              "
            >
              {eyebrow}
            </p>


            <h2
              className="
                mt-2
                text-3xl
                font-semibold
                tracking-[-0.045em]
                text-slate-950
                sm:text-4xl
              "
            >
              {title}
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
            Search, filter and continue deeper through the
            connected Arknoz geography system.
          </p>

        </div>


        <div
          className="
            mt-6
            flex
            flex-col
            gap-3
            rounded-[20px]
            border
            border-slate-200
            bg-[#f7f9fa]
            p-3
            lg:flex-row
            lg:items-center
          "
        >

          <input
            type="search"
            value={query}
            onChange={
              (event) => {
                setQuery(
                  event.target.value
                );

                setVisibleCount(12);
              }
            }
            placeholder="Search country, region, city or place..."
            className="
              h-11
              w-full
              rounded-full
              border
              border-slate-200
              bg-white
              px-5
              text-sm
              text-slate-900
              outline-none
              placeholder:text-slate-400
              focus:border-[#0b7180]
              lg:max-w-[460px]
            "
          />


          <div
            className="
              flex
              min-w-0
              flex-1
              gap-2
              overflow-x-auto
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            {types.map(
              (type) => (

                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveType(type);
                    setVisibleCount(12);
                  }}
                  className={`
                    shrink-0
                    rounded-full
                    border
                    px-4
                    py-2
                    text-[10px]
                    font-semibold
                    capitalize
                    transition
                    ${
                      activeType === type
                        ? "border-[#0a263d] bg-[#0a263d] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
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


          <div
            className="
              flex
              shrink-0
              rounded-full
              border
              border-slate-200
              bg-white
              p-1
            "
          >

            <button
              type="button"
              onClick={() =>
                setOrder("az")
              }
              className={`
                rounded-full
                px-3
                py-1.5
                text-[10px]
                font-semibold
                ${
                  order === "az"
                    ? "bg-[#0a263d] text-white"
                    : "text-slate-500"
                }
              `}
            >
              A–Z
            </button>


            <button
              type="button"
              onClick={() =>
                setOrder("za")
              }
              className={`
                rounded-full
                px-3
                py-1.5
                text-[10px]
                font-semibold
                ${
                  order === "za"
                    ? "bg-[#0a263d] text-white"
                    : "text-slate-500"
                }
              `}
            >
              Z–A
            </button>

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
                lg:grid-cols-4
              "
            >

              {visible.map(
                (item) => (

                  <Link
                    key={item.id}
                    href={item.href}
                    className="
                      group
                      relative
                      min-h-[250px]
                      overflow-hidden
                      rounded-[18px]
                      bg-[#16364a]
                      outline-none
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      focus-visible:ring-2
                      focus-visible:ring-[#0b7180]
                      focus-visible:ring-offset-2
                    "
                  >

                    <img
                      src={item.image}
                      alt=""
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-[1.045]
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
                          tracking-[0.17em]
                          text-cyan-100/70
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
                            text-[10px]
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
                        Explore →
                      </p>

                    </div>

                  </Link>

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
              rounded-[20px]
              border
              border-dashed
              border-slate-300
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
              No matching geography found.
            </p>
          </div>

        )}

      </div>

    </section>
  );
}