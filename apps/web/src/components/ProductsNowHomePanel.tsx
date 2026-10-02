import Link from "next/link";

const items = [
  {
    type: "MATERIALS",
    title: "Materials & Structure",
    href: "/products?type=materials-structure",
  },
  {
    type: "ENVELOPE",
    title: "Envelope & Openings",
    href: "/products?type=envelope-openings",
  },
  {
    type: "INTERIORS",
    title: "Interiors, Finishes & FF&E",
    href: "/products?type=interiors-finishes-ffe",
  },
  {
    type: "MEP",
    title: "Building Services / MEP",
    href: "/products?type=building-services-mep",
  },
  {
    type: "SITE",
    title: "Site, Landscape & Infrastructure",
    href: "/products?type=site-landscape-infrastructure",
  },
  {
    type: "TECHNOLOGY",
    title: "Equipment, Smart Systems & Technology",
    href: "/products?type=equipment-smart-systems-technology",
  },
] as const;

export default function ProductsNowHomePanel() {
  return (
    <section
      data-products-screen="arknoz-now"
      className="
        bg-[#f5f7fb]
        px-5
        py-5
        sm:px-6
        lg:px-8
      "
    >
      <style>{`
        @keyframes productsNowRail {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0%);
          }
        }

        .products-now-track {
          animation:
            productsNowRail
            46s
            linear
            infinite;
        }

        .products-now-track:hover {
          animation-play-state: paused;
        }

        .products-now-track a {
          transition:
            transform 400ms ease,
            box-shadow 400ms ease;
        }

        .products-now-track img {
          transition:
            transform 800ms ease,
            filter 500ms ease;
        }

        .products-now-track a:hover {
          transform: translateY(-3px);
        }

        .products-now-track a:hover img {
          transform: scale(1.035);
          filter:
            saturate(1.08)
            contrast(1.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .products-now-track {
            animation: none;
          }
        }
      `}</style>

      <div
        className="
          mx-auto
          max-w-[1600px]
          overflow-hidden
          rounded-[10px]
          border
          border-slate-200
          bg-white
          shadow-[0_18px_50px_rgba(15,23,42,0.06)]
        "
      >
        <div className="border-b border-slate-200 px-7 pb-4 pt-5 sm:px-9 lg:px-10">
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-bold tracking-[0.08em] text-red-500">
              Products Now
            </p>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Live
            </span>
          </div>

          <h2
            className="
              mt-2
              text-[29px]
              font-semibold
              leading-[1.02]
              tracking-[-0.045em]
              text-[#0a2230]
              sm:text-[34px]
            "
          >
            Moving through Products.
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-slate-500">
            Materials, components, building
            systems, equipment and technologies
            across Arknoz.
          </p>
        </div>

        <div className="relative overflow-hidden border-y border-slate-200 bg-[#fbfcfe] py-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-white to-transparent sm:w-28"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-white to-transparent sm:w-28"
          />

          <div className="products-now-track flex w-max gap-4">
            {[...items, ...items].map(
              (item, index) => {
                const duplicate =
                  index >= items.length;

                return (
                  <Link
                    key={`${item.href}-${index}`}
                    href={item.href}
                    aria-hidden={
                      duplicate
                        ? true
                        : undefined
                    }
                    tabIndex={
                      duplicate
                        ? -1
                        : undefined
                    }
                    className="
                      group
                      relative
                      h-[220px]
                      w-[260px]
                      shrink-0
                      overflow-hidden
                      border
                      border-slate-200
                      bg-[#0a2230]
                      sm:w-[280px]
                      2xl:h-[230px]
                      2xl:w-[300px]
                    "
                  >
                    <img
                      src="/visuals/portal/product.png"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#03121c]/95 via-[#03121c]/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                      <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/70">
                        {item.type}
                      </p>

                      <h3 className="mt-2 line-clamp-3 text-xl font-semibold leading-[1.05] tracking-[-0.035em]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[9px] font-medium text-white/60">
                        Products
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        <div className="flex min-h-[58px] items-center justify-end px-7 sm:px-9 lg:px-10">
          <Link
            href="/products?type=materials-structure"
            className="text-[11px] font-bold text-[#0a2230] transition hover:text-[#a61f46]"
          >
            Explore product worlds →
          </Link>
        </div>
      </div>
    </section>
  );
}