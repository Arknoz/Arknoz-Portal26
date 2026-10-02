import Link from "next/link";
import { resolvePortalImage } from "@/lib/portal-image";

export type UniversalRailItem = {
  eyebrow?: string;
  title: string;
  context?: string;
  href: string;
  image?: string | null;
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  items: UniversalRailItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  direction?: "forward" | "reverse";
  dataName?: string;
};

export default function UniversalRunningRail({
  eyebrow,
  title,
  description,
  items,
  viewAllHref,
  viewAllLabel = "Explore more",
  direction = "forward",
  dataName = "running",
}: Props) {

  if (!items.length) {
    return null;
  }

  return (
    <section
      data-arknoz-running={dataName}
      className="bg-white px-4 py-5 lg:px-7"
    >
      <style>{`
        @keyframes arknozRailForward {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        @keyframes arknozRailReverse {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .arknozRailForward {
          animation: arknozRailForward 44s linear infinite;
        }

        .arknozRailReverse {
          animation: arknozRailReverse 44s linear infinite;
        }

        .arknozRailTrack:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .arknozRailTrack {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1780px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

        <div className="flex items-end justify-between gap-8 px-7 py-6 lg:px-10">

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 md:text-3xl">
              {title}
            </h2>
          </div>

          {description ? (
            <p className="hidden max-w-md text-right text-xs leading-5 text-slate-400 md:block">
              {description}
            </p>
          ) : null}

        </div>


        <div className="relative overflow-hidden border-y border-slate-200 py-5">

          <div
            className={`arknozRailTrack flex w-max gap-4 ${
              direction === "reverse"
                ? "arknozRailReverse"
                : "arknozRailForward"
            }`}
          >

            {[...items, ...items].map((item, index) => {

              const duplicate =
                index >= items.length;

              return (
                <Link
                  key={`${item.href}-${index}`}
                  href={item.href}
                  aria-hidden={duplicate ? true : undefined}
                  tabIndex={duplicate ? -1 : undefined}
                  className="group relative h-[255px] w-[270px] shrink-0 overflow-hidden rounded-[22px] bg-[#16374b]"
                >

                  <img
                    src={resolvePortalImage({
                      src: item.image,
                      kind: item.eyebrow || eyebrow,
                    })}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />


                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">

                    {item.eyebrow ? (
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                        {item.eyebrow}
                      </p>
                    ) : null}

                    <h3 className="mt-2 line-clamp-3 text-xl font-semibold leading-[1.08] tracking-[-0.03em]">
                      {item.title}
                    </h3>

                    {item.context ? (
                      <p className="mt-3 text-[11px] text-white/65">
                        {item.context}
                      </p>
                    ) : null}

                  </div>

                </Link>
              );
            })}

          </div>
        </div>


        {viewAllHref ? (
          <div className="flex min-h-[64px] items-center justify-end px-7 lg:px-10">

            <Link
              href={viewAllHref}
              className="text-sm font-semibold text-teal-800"
            >
              {viewAllLabel} →
            </Link>

          </div>
        ) : null}

      </div>
    </section>
  );
}