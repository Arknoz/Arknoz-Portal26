import Link from "next/link";

const items = [
  {
    type: "ARCHITECTURE",
    title: "Buildings & Architecture",
    meta: "Projects",
    href: "/projects?type=buildings-architecture",
    image: "/visuals/portal/project.png",
  },
  {
    type: "INTERIORS",
    title: "Interiors, Renovation & Adaptive Reuse",
    meta: "Projects",
    href: "/projects?type=interiors-renovation-adaptive-reuse",
    image: "/visuals/portal/project.png",
  },
  {
    type: "LANDSCAPE",
    title: "Landscape & Public Realm",
    meta: "Projects",
    href: "/projects?type=landscape-public-realm",
    image: "/visuals/portal/place.png",
  },
  {
    type: "URBANISM",
    title: "Urbanism, Planning & Development",
    meta: "Projects",
    href: "/projects?type=urbanism-planning-development",
    image: "/visuals/portal/place.png",
  },
  {
    type: "INFRASTRUCTURE",
    title: "Infrastructure & Mobility",
    meta: "Projects",
    href: "/projects?type=infrastructure-mobility",
    image: "/visuals/portal/project.png",
  },
  {
    type: "INDUSTRIAL",
    title: "Industrial, Energy & Utilities",
    meta: "Projects",
    href: "/projects?type=industrial-energy-utilities",
    image: "/visuals/portal/project.png",
  },
] as const;

export default function ProjectsNowHomePanel() {
  return (
    <section
      data-projects-screen="arknoz-now"
      className="
        bg-[#f5f7fb]
        px-5
        py-5
        sm:px-6
        lg:px-8
      "
    >
      <style>{`
        @keyframes projectsNowRail {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0%);
          }
        }

        .projects-now-track {
          animation:
            projectsNowRail
            46s
            linear
            infinite;
        }

        .projects-now-track:hover {
          animation-play-state: paused;
        }

        .projects-now-track a {
          transition:
            transform 400ms ease,
            box-shadow 400ms ease;
        }

        .projects-now-track img {
          transition:
            transform 800ms ease,
            filter 500ms ease;
        }

        .projects-now-track a:hover {
          transform: translateY(-3px);
        }

        .projects-now-track a:hover img {
          transform: scale(1.035);
          filter:
            saturate(1.08)
            contrast(1.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .projects-now-track {
            animation: none;
          }
        }
      `}</style>

      <div
        className="
          mx-auto
          max-w-[1720px]
          overflow-hidden
          rounded-[10px]
          border
          border-slate-200
          bg-white
          shadow-[0_18px_50px_rgba(15,23,42,0.06)]
        "
      >
        {/* HEADER */}
        <div
          className="
            border-b
            border-slate-200
            px-7
            pb-4
            pt-5
            sm:px-9
            lg:px-10
          "
        >
          <div className="flex items-center gap-3">
            <p
              className="
                text-[10px]
                font-bold
                tracking-[0.08em]
                text-red-500
              "
            >
              Projects Now
            </p>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-[10px]
                font-semibold
                text-slate-500
              "
            >
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
            Moving through Projects.
          </h2>

          <p
            className="
              mt-2
              text-[13px]
              leading-5
              text-slate-500
            "
          >
            Architecture, interiors, landscape, urban development,
            infrastructure and industrial projects across Arknoz.
          </p>
        </div>

        {/* MOVING RAIL */}
        <div
          className="
            relative
            overflow-hidden
            border-y
            border-slate-200
            bg-[#fbfcfe]
            py-5
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-20
              bg-gradient-to-r
              from-white
              to-transparent
              sm:w-28
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-20
              bg-gradient-to-l
              from-white
              to-transparent
              sm:w-28
            "
          />

          <div className="projects-now-track flex w-max gap-4">
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
                      transition
                      duration-300
                      sm:w-[280px]
                      2xl:h-[230px]
                      2xl:w-[300px]
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
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#03121c]/95
                        via-[#03121c]/20
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
                          text-white/70
                        "
                      >
                        {item.type}
                      </p>

                      <h3
                        className="
                          mt-2
                          line-clamp-3
                          text-xl
                          font-semibold
                          leading-[1.05]
                          tracking-[-0.035em]
                        "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          text-[9px]
                          font-medium
                          text-white/60
                        "
                      >
                        {item.meta}
                      </p>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* CTA */}
        <div
          className="
            flex
            min-h-[58px]
            items-center
            justify-end
            px-7
            sm:px-9
            lg:px-10
          "
        >
          <Link
            href="#project-category-buildings-architecture"
            className="
              text-[11px]
              font-bold
              text-[#0a2230]
              transition
              hover:text-[#a61f46]
            "
          >
            Explore project worlds →
          </Link>
        </div>
      </div>
    </section>
  );
}