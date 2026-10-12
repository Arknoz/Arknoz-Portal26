"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";


type RecordSectionKey =
  | "record"
  | "connections"
  | "lens"
  | "intelligence";


function LockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect
        x="5.5"
        y="8.5"
        width="9"
        height="7"
        rx="1.7"
      />

      <path d="M7.5 8.5V6.5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}


export default function UniversalRecordWorkspace({
  record,
  connections,
  lens,
  intelligence,
  middleMode = "connections",
  stickyTabs = false,
  project26Mode = false,
}: {
  record: ReactNode;
  connections: ReactNode;
  lens?: ReactNode;
  intelligence: ReactNode;
  middleMode?: "connections" | "lens";
  stickyTabs?: boolean;
  project26Mode?: boolean;
}) {

  const [active, setActive] =
    useState<RecordSectionKey>(
      "record"
    );


  useEffect(() => {

    const syncFromHash = () => {

      const hash =
        window.location.hash.replace(
          "#",
          ""
        );

      if (
        project26Mode &&
        middleMode === "lens"
      ) {
        if (
          hash === "record" ||
          hash === "lens"
        ) {
          setActive(hash);
        }

        return;
      }

      if (
        hash === "record" ||
        hash === "intelligence" ||
        (
          middleMode === "connections" &&
          hash === "connections"
        ) ||
        (
          middleMode === "lens" &&
          hash === "lens"
        )
      ) {
        setActive(hash);
      }
    };


    syncFromHash();


    window.addEventListener(
      "hashchange",
      syncFromHash
    );


    return () =>
      window.removeEventListener(
        "hashchange",
        syncFromHash
      );

  }, [middleMode, project26Mode]);


  const openSection = (
    section: RecordSectionKey
  ) => {

    setActive(section);


    window.history.replaceState(
      null,
      "",
      `#${section}`
    );



  };


  const recordTab = {
    id: "record" as const,
    number: "01",
    label: "Record",
    subtitle: "Know",
    pro: false,
  };


  const middleTab =
    middleMode === "lens"
      ? {
          id: "lens" as const,
          number: "02",
          label: "Arknoz Lens",
          subtitle: project26Mode
            ? "Understand · Test · Apply"
            : "Interpret",
          pro: project26Mode,
        }
      : {
          id: "connections" as const,
          number: "02",
          label: "Connections",
          subtitle: "Explore relationships",
          pro: false,
        };


  const tabs =
    project26Mode &&
    middleMode === "lens"
      ? [
          recordTab,
          middleTab,
        ]
      : [
          recordTab,
          middleTab,
          {
            id: "intelligence" as const,
            number: "03",
            label: "Intelligence",
            subtitle: "Analyse",
            pro: true,
          },
        ];


  return (
    <div
      id="arknoz-record-workspace"
      className="scroll-mt-[106px]"
      data-universal-record-framework
    >

      {/* ==================================================
          PERMANENT 3 HEADS
      ================================================== */}

      <div
        className={`border-y border-slate-200 bg-white/95 py-1 backdrop-blur ${
          stickyTabs
            ? "sticky top-[106px] z-40"
            : ""
        }`}
      >

        <div className={`grid ${tabs.length === 2 ? "grid-cols-2" : "grid-cols-3"} gap-1 rounded-[10px] bg-[#f1f4f8] p-[3px]`}>

          {tabs.map((tab) => {

            const selected =
              active === tab.id;


            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  openSection(
                    tab.id
                  )
                }
                className={`group flex min-h-[38px] cursor-pointer flex-col items-center justify-center rounded-[7px] px-2 py-1 text-center outline-none transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/50 ${
  selected
    ? tab.id === "record"
      ? "bg-[#0b2949] text-white shadow-[0_1px_3px_rgba(15,23,42,0.16)]"
      : tab.pro
        ? "bg-[#8a3f69] text-white shadow-[0_1px_3px_rgba(125,49,95,0.16)]"
        : "bg-[#6489ad] text-white shadow-[0_1px_3px_rgba(72,107,140,0.16)]"
    : tab.id === "record"
      ? "bg-[#e8eef5] text-[#0b2949] hover:bg-[#dbe6f0]"
      : tab.pro
        ? "bg-[#f5ebf1] text-[#7d315f] hover:bg-[#ead8e4]"
        : "bg-[#eaf1f7] text-[#496b8c] hover:bg-[#dce8f2]"
}`}
              >

                <div className="flex items-center justify-center gap-1.5">

                  <span className="text-[7.5px] font-bold opacity-60">
                    {tab.number}
                  </span>

                  <span className="text-[11px] font-bold leading-none">
                    {tab.label}
                  </span>


                  {tab.pro ? (
                    <>
                      <span className="hidden rounded-full bg-white/15 px-1.5 py-[2px] text-[6px] font-bold uppercase leading-none tracking-[0.08em] sm:inline">
                        Pro
                      </span>

                      <LockIcon />
                    </>
                  ) : null}

                </div>


                <span
                  className={`mt-[2px] text-[7px] font-medium leading-none ${
                    selected
                      ? "text-white/62"
                      : tab.pro
                        ? "text-[#7d315f]/60"
                        : "text-slate-400"
                  }`}
                >
                  {tab.subtitle}
                </span>

              </button>
            );
          })}

        </div>

      </div>


      {/* ==================================================
          ONE SELECTED WORKSPACE
      ================================================== */}

      <section className="min-h-[calc(100svh-155px)] py-3">

        {active === "record"
          ? record
          : null}

        {active === "lens"
          ? lens
          : null}

        {active === "connections"
          ? connections
          : null}

        {!project26Mode &&
        active === "intelligence"
          ? intelligence
          : null}

      </section>

    </div>
  );
}
