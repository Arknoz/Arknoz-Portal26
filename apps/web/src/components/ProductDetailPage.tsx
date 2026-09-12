import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import UniversalFooterStrip from "@/components/UniversalFooterStrip";
import ProductDetailTabs from "@/components/ProductDetailTabs";

import type {
  EntityRecord,
} from "@/lib/entities";

import type {
  ProductDetailData,
} from "@/lib/product-details";

function ProductHeroVisual({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: ProductDetailData;
}) {
  const media = detail?.media?.[0];

  if (media) {
    return (
      <div className="group relative h-full overflow-hidden rounded-[26px] bg-[#0b2949]">
        <img
          src={media.src}
          alt={media.alt ?? entity.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#071b31]/95 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-7 text-white">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
            PRODUCT
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {entity.title}
          </h2>

          <p className="mt-1 text-[11px] text-slate-300">
            Source-backed product record
          </p>
        </div>
      </div>
    );
  }

  const carbon =
    detail?.facts?.find((fact) =>
      fact.label
        .toLowerCase()
        .includes("carbon")
    );

  return (
    <div className="group relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#8db7e9] via-[#d7e8f8] to-[#0b2949]">
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.9) 1px,transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="absolute left-[10%] top-[14%] h-[62%] w-[64%] rounded-[28px] border border-white/35 bg-white/20 backdrop-blur-[2px] transition duration-500 group-hover:-translate-y-1">
        <div className="absolute inset-x-[9%] top-[14%] h-3 rounded-full bg-[#0b2949]/15" />
        <div className="absolute inset-x-[9%] top-[24%] h-3 rounded-full bg-[#0b2949]/10" />
        <div className="absolute inset-x-[9%] top-[34%] h-3 rounded-full bg-[#0b2949]/10" />

        <div className="absolute bottom-[12%] left-[9%]">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#0b2949]/65">
            MATERIAL / PRODUCT
          </p>

          <p className="mt-2 max-w-[330px] text-3xl font-bold tracking-tight text-[#071b31]">
            {detail?.subCategory ??
              detail?.category ??
              entity.title}
          </p>
        </div>
      </div>

      {carbon ? (
        <div className="absolute right-[5%] top-[15%] rounded-[18px] bg-white p-4 shadow-[0_14px_35px_rgba(7,27,49,.15)]">
          <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-blue-700">
            PRODUCT SIGNAL
          </p>

          <p className="mt-2 text-3xl font-bold text-[#0b2949]">
            ≥30%
          </p>

          <p className="mt-1 max-w-[125px] text-[9px] leading-4 text-slate-500">
            Manufacturer-reported CO₂ reduction threshold
          </p>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b31]/95 to-transparent p-7 pt-20 text-white">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
          PRODUCT
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {entity.title}
        </h2>

        <p className="mt-1 text-[11px] text-slate-300">
          Source-backed product record
        </p>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  entity,
  detail,
}: {
  entity: EntityRecord;
  detail?: ProductDetailData;
}) {

  const facts = detail?.facts ?? [];

  const headlineFacts = facts.slice(
    0,
    4
  );

  const glanceFacts =
    facts.slice(3, 6);

  const category =
    detail?.category ?? "Products";

  const subCategory =
    detail?.subCategory;

  return (
    <>
      <GlobalHeader />

      <main>

        {/* ==================================================
            SCREEN 1 — PRODUCT IDENTITY
        ================================================== */}

        <section className="bg-[#f6f8fb] lg:h-[calc(100svh-88px)]">
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-5 lg:px-8">

            <nav className="mb-4 flex shrink-0 flex-wrap items-center gap-2 text-[11px] font-semibold">
              <Link
                href="/products"
                className="text-blue-700 hover:text-blue-900"
              >
                Products
              </Link>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-600">
                {category}
              </span>

              {subCategory ? (
                <>
                  <span className="text-slate-400">
                    ›
                  </span>

                  <span className="text-slate-600">
                    {subCategory}
                  </span>
                </>
              ) : null}

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-950">
                {entity.title}
              </span>
            </nav>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[.84fr_1.05fr_190px]">

              {/* IDENTITY */}
              <article className="flex min-h-0 flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_6px_24px_rgba(15,23,42,.035)]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-blue-700">
                      PRODUCT
                    </span>

                    {subCategory ? (
                      <span className="rounded-full bg-[#f3f6f9] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-slate-600">
                        {subCategory}
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-6 text-[clamp(38px,4vw,64px)] font-bold leading-[.98] tracking-[-.045em] text-slate-950">
                    {entity.title}
                  </h1>

                  {detail?.strapline ? (
                    <h2 className="mt-5 max-w-[580px] text-[20px] font-bold leading-7 text-slate-950">
                      {detail.strapline}
                    </h2>
                  ) : null}

                  <p className="mt-4 max-w-[570px] text-[14px] leading-6 text-slate-600">
                    {entity.summary}
                  </p>

                  {headlineFacts.length >
                  0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-x-6">
                      {headlineFacts.map(
                        (fact) => (
                          <div
                            key={fact.label}
                            className="border-t border-slate-200 py-3"
                          >
                            <span className="text-[10px] text-slate-500">
                              {
                                fact.label
                              }
                            </span>

                            <strong className="ml-2 text-[11px] text-slate-950">
                              {
                                fact.value
                              }
                            </strong>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-3 pt-4">
                  <div className="flex items-center gap-2">
                    {detail?.officialUrl ? (
                      <a
                        href={
                          detail.officialUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#0b2949] px-5 py-3 text-[11px] font-bold text-white transition hover:-translate-y-[1px] hover:shadow-md"
                      >
                        Official source ↗
                      </a>
                    ) : null}
                  </div>

                  <a
                    href="#product-intelligence"
                    className="text-[11px] font-bold text-blue-700"
                  >
                    Product intelligence ↓
                  </a>
                </div>
              </article>

              {/* VISUAL */}
              <ProductHeroVisual
                entity={entity}
                detail={detail}
              />

              {/* RIGHT RAIL */}
              <div className="grid min-h-0 grid-rows-[1.05fr_.95fr] gap-3">
                <article className="flex flex-col justify-between rounded-[24px] bg-[#0b2949] p-5 text-white">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                      VERIFIED
                    </p>

                    <h3 className="mt-3 text-[15px] font-bold">
                      Product data
                    </h3>
                  </div>

                  <p className="text-[10px] leading-5 text-slate-300">
                    Source-backed identity, manufacturer context and product claims.
                  </p>
                </article>

                <article className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    AT A GLANCE
                  </p>

                  <div className="mt-4 space-y-4">
                    {glanceFacts.map(
                      (fact) => (
                        <div
                          key={fact.label}
                        >
                          <p className="text-[9px] text-slate-400">
                            {
                              fact.label
                            }
                          </p>

                          <p className="mt-1 text-[13px] font-bold leading-4 text-slate-950">
                            {
                              fact.value
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SCREEN 2 — PRODUCT INTELLIGENCE
        ================================================== */}

        <section
          id="product-intelligence"
          className="border-t border-slate-200 bg-white lg:h-[calc(100svh-88px)]"
        >
          <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-4 lg:px-8">

            <div className="mb-3 flex shrink-0 items-end justify-between gap-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-700">
                  PRODUCT INTELLIGENCE
                </p>

                <h2 className="mt-1 text-[26px] font-bold tracking-tight">
                  Understand the product
                </h2>
              </div>

              <p className="hidden max-w-xl text-right text-[11px] leading-5 text-slate-500 lg:block">
                Product context, properties, applications, evidence and connected Arknoz records in one workspace.
              </p>
            </div>

            <div className="min-h-0 flex-1">
              <ProductDetailTabs
                entity={entity}
                detail={detail}
              />
            </div>

            <div className="mt-3 flex shrink-0 items-center gap-8 border-t border-slate-200 pt-3 text-[10px] font-bold">
              <span className="uppercase tracking-[0.18em] text-blue-700">
                CONTINUE
              </span>

              <Link href="/products">
                Products →
              </Link>

              <Link href="/projects">
                Projects →
              </Link>

              <Link href="/knowledge">
                Knowledge →
              </Link>

              <Link href="/global">
                Global →
              </Link>
            </div>
          </div>
        </section>

        <UniversalFooterStrip />
        <GlobalFooter />
      </main>
    </>
  );
}
