"use client";

import Link from "next/link";
import {
  useLayoutEffect,
  useRef,
} from "react";


type RibbonItem = {
  label: string;
  href: string;
};


const RIBBON_DURATION_MS =
  110_000;

const RIBBON_PHASE_KEY =
  "arknoz.discoveryRibbon.phase";


const ribbonItems: RibbonItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Products", href: "/products" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Education", href: "/learning" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Community", href: "/community" },
  { label: "People", href: "/people" },
  { label: "Organisations", href: "/organisations" },
  { label: "Universities", href: "/universities" },
  { label: "Places", href: "/places" },

  { label: "Asia", href: "/global/asia" },
  { label: "Africa", href: "/global/africa" },
  { label: "Europe", href: "/global/europe" },
  { label: "North America", href: "/global/north-america" },
  { label: "South America", href: "/global/south-america" },
  { label: "Oceania", href: "/global/oceania" },

  { label: "Competitions", href: "/opportunities?type=competitions-awards" },
  { label: "Jobs", href: "/opportunities?type=jobs-careers" },
  { label: "Events", href: "/opportunities?type=events-conferences-exhibitions" },
  { label: "Funding", href: "/opportunities?type=grants-funding-fellowships" },

  { label: "For Business", href: "/business" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "Access", href: "/pricing" },
  { label: "About Arknoz", href: "/about" },
];


function getCurrentRibbonPhase(
  track: HTMLDivElement
) {
  const halfWidth =
    track.scrollWidth / 2;

  if (
    !Number.isFinite(halfWidth) ||
    halfWidth <= 0
  ) {
    return 0;
  }

  const transform =
    window
      .getComputedStyle(track)
      .transform;

  if (
    !transform ||
    transform === "none"
  ) {
    return 0;
  }

  try {
    const matrix =
      new DOMMatrixReadOnly(
        transform
      );

    let distance =
      -matrix.m41;

    distance =
      ((distance % halfWidth) +
        halfWidth) %
      halfWidth;

    return (
      distance /
      halfWidth
    ) * RIBBON_DURATION_MS;
  } catch {
    return 0;
  }
}


export default function ArknozDiscoveryRibbon() {

  const trackRef =
    useRef<HTMLDivElement>(
      null
    );


  const repeatedItems = [
    ...ribbonItems,
    ...ribbonItems,
  ];


  useLayoutEffect(() => {

    const track =
      trackRef.current;

    if (!track) {
      return;
    }


    const saved =
      window.sessionStorage.getItem(
        RIBBON_PHASE_KEY
      );


    if (saved === null) {
      return;
    }


    const phase =
      Number(saved);


    if (
      !Number.isFinite(phase) ||
      phase < 0
    ) {
      return;
    }


    track.style.animationDelay =
      `-${phase % RIBBON_DURATION_MS}ms`;

  }, []);


  function rememberPosition() {

    const track =
      trackRef.current;

    if (!track) {
      return;
    }


    const phase =
      getCurrentRibbonPhase(
        track
      );


    window.sessionStorage.setItem(
      RIBBON_PHASE_KEY,
      String(phase)
    );
  }


  return (
    <div
      data-arknoz-discovery-ribbon="true"
      className="
        relative
        z-[70]
        isolate
        overflow-hidden
        border-y
        border-white/10
        bg-[#081b27]/96
        text-white
      "
    >

      <style>{`

        @keyframes arknozRibbonScroll {

          from {
            transform:
              translateX(0);
          }

          to {
            transform:
              translateX(-50%);
          }

        }


        .arknoz-discovery-ribbon-track {

          animation:
            arknozRibbonScroll
            110s
            linear
            infinite;

        }


        .arknoz-discovery-ribbon-track:hover,
        .arknoz-discovery-ribbon-track:focus-within {

          animation-play-state:
            paused;

        }


        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .arknoz-discovery-ribbon-track {
            animation: none;
          }

        }

      `}</style>


      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-20
          w-16
          bg-gradient-to-r
          from-[#081b27]
          to-transparent
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
          w-16
          bg-gradient-to-l
          from-[#081b27]
          to-transparent
        "
      />


      <div
        ref={trackRef}
        className="
          arknoz-discovery-ribbon-track
          relative
          z-30
          flex
          w-max
          items-center
          py-2.5
        "
      >

        {repeatedItems.map(
          (item, index) => {

            const duplicate =
              index >=
              ribbonItems.length;


            return (
              <Link
                key={`${item.label}-${index}`}

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

                onPointerDown={
                  rememberPosition
                }

                onClick={
                  rememberPosition
                }

                className="
                  group
                  relative
                  z-40
                  inline-flex
                  shrink-0
                  cursor-pointer
                  items-center
                  px-5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white/78
                  transition
                  hover:text-white
                "
              >

                {item.label}


                <span
                  aria-hidden="true"
                  className="
                    ml-5
                    text-cyan-300/45
                  "
                >
                  •
                </span>

              </Link>
            );
          }
        )}

      </div>

    </div>
  );
}