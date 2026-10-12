"use client";

import { useEffect, useRef, useState } from "react";

import type { EntityRecord } from "@/lib/entities";
import type {
  ArknozAccessMode,
} from "@/lib/entitlements/arknoz-audience";
import UniversalRecordWorkspace from "@/components/UniversalRecordWorkspace";
import { getArknozRecordFramework } from "@/lib/records/arknoz-record-framework";


function isPublicRecordStatus(
  value?: string
) {
  const normalized = value
    ?.trim()
    .toLowerCase();

  if (!normalized) {
    return false;
  }

  return ![
    "test",
    "test-only",
    "test only",
    "test_only",
    "internal",
    "internal-only",
    "internal only",
    "placeholder",
  ].includes(normalized);
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="4.5"
        y="8.5"
        width="11"
        height="8"
        rx="2"
      />
      <path d="M7 8.5V6.4a3 3 0 0 1 6 0v2.1" />
    </svg>
  );
}


export default function ProjectDetailTabs({
  entity,
  candidatePreview = false,
  recordAccessMode = "sign_in",
  lensAccessMode = "preview",
  publicProjectBrief = "",
  publicProjectProfile = [],
  publicRecordSourceCount = 0,
  publicRecordMediaCount = 0,
}: {
  entity: EntityRecord;
  candidatePreview?: boolean;
  recordAccessMode?: ArknozAccessMode;
  lensAccessMode?: ArknozAccessMode;
  publicProjectBrief?: string;

  publicProjectProfile?:
    NonNullable<
      EntityRecord["project"]
    >["publicProfile"];
  publicRecordSourceCount?: number;
  publicRecordMediaCount?: number;
}) {

  const p = entity.project;

  const structuredRecord =
    p?.structuredRecord;

  const facts =
    p?.facts ?? [];

  /*
   * Canonical Project media rule:
   *
   * Prefer media carried directly by ProjectRecordData.
   * Fall back to EntityRecord.media because production loaders
   * may expose validated detail media at the entity layer.
   *
   * Overview, Record, Lens and Intelligence must therefore see
   * the same canonical media collection.
   */
  const media =
    p?.media?.length
      ? p.media
      : entity.media ?? [];

  const documents =
    p?.documents ?? [];

  const [recordMediaPreview, setRecordMediaPreview] =
    useState<number | null>(null);

  const [recordLibraryOpen, setRecordLibraryOpen] =
    useState(false);

  const [
    recordMediaReturnToLibrary,
    setRecordMediaReturnToLibrary,
  ] = useState(false);

  const recordLibraryTriggerRef =
    useRef<HTMLButtonElement | null>(null);

  const recordMediaTriggerRef =
    useRef<HTMLButtonElement | null>(null);

  const recordLibraryDialogRef =
    useRef<HTMLDivElement | null>(null);

  const recordMediaDialogRef =
    useRef<HTMLDivElement | null>(null);

  const closeRecordLibrary = () => {
    setRecordLibraryOpen(false);

    requestAnimationFrame(() => {
      recordLibraryTriggerRef.current?.focus();
    });
  };

  const closeRecordMediaPreview = () => {
    const returnToLibrary =
      recordMediaReturnToLibrary;

    setRecordMediaPreview(null);

    if (returnToLibrary) {
      setRecordLibraryOpen(true);
      setRecordMediaReturnToLibrary(false);
      return;
    }

    requestAnimationFrame(() => {
      recordMediaTriggerRef.current?.focus();
    });
  };

  useEffect(() => {
    if (
      !recordLibraryOpen &&
      recordMediaPreview === null
    ) {
      return;
    }

    const handleModalTabKey = (
      event: KeyboardEvent
    ) => {
      if (event.key !== "Tab") {
        return;
      }

      const activeDialog =
        recordMediaPreview !== null
          ? recordMediaDialogRef.current
          : recordLibraryOpen
            ? recordLibraryDialogRef.current
            : null;

      if (!activeDialog) {
        return;
      }

      const focusableElements =
        Array.from(
          activeDialog.querySelectorAll<HTMLElement>(
            [
              'a[href]',
              'button:not([disabled])',
              'input:not([disabled])',
              'select:not([disabled])',
              'textarea:not([disabled])',
              '[tabindex]:not([tabindex="-1"])',
              '[contenteditable="true"]',
            ].join(",")
          )
        ).filter(
          (element) =>
            element.getAttribute("aria-hidden") !==
            "true"
        );

      if (focusableElements.length === 0) {
        event.preventDefault();
        activeDialog.focus();
        return;
      }

      const first =
        focusableElements[0];

      const last =
        focusableElements[
          focusableElements.length - 1
        ];

      const activeElement =
        document.activeElement;

      const focusIsInside =
        activeElement instanceof Node &&
        activeDialog.contains(
          activeElement
        );

      if (!focusIsInside) {
        event.preventDefault();

        if (event.shiftKey) {
          last.focus();
        } else {
          first.focus();
        }

        return;
      }

      if (
        event.shiftKey &&
        activeElement === first
      ) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (
        !event.shiftKey &&
        activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleModalTabKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleModalTabKey
      );
    };
  }, [
    recordLibraryOpen,
    recordMediaPreview,
  ]);
  useEffect(() => {
    if (
      !recordLibraryOpen &&
      recordMediaPreview === null
    ) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleLibraryEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        recordLibraryOpen
      ) {
        event.preventDefault();
        closeRecordLibrary();
      }
    };

    window.addEventListener(
      "keydown",
      handleLibraryEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleLibraryEscape
      );
    };
  }, [
    recordLibraryOpen,
    recordMediaPreview,
  ]);
  useEffect(() => {
    if (recordMediaPreview === null) {
      return;
    }

    const handleMediaViewerKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRecordMediaPreview();
        return;
      }

      if (
        event.key === "ArrowLeft" &&
        media.length > 1
      ) {
        event.preventDefault();

        setRecordMediaPreview(
          (current) =>
            current === null
              ? null
              : (
                  current -
                  1 +
                  media.length
                ) %
                media.length
        );

        return;
      }

      if (
        event.key === "ArrowRight" &&
        media.length > 1
      ) {
        event.preventDefault();

        setRecordMediaPreview(
          (current) =>
            current === null
              ? null
              : (
                  current +
                  1
                ) %
                media.length
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleMediaViewerKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleMediaViewerKeyDown
      );
    };
  }, [
    media.length,
    recordMediaPreview,
    recordMediaReturnToLibrary,
  ]);

  const anatomy =
    p?.anatomy ?? [];

  const people =
    p?.people ?? [];

  const timeline =
    p?.timeline ?? [];

  const sources =
    p?.sources ?? [];

  const connections =
    p?.connections ?? [];

  const learning =
    p?.learning ?? [];

  const topics =
    p?.topics ?? [];


  const framework =
    getArknozRecordFramework(
      "project"
    );


  const moduleLabel = (
    key: string,
    fallback: string
  ) =>
    framework.record.modules.find(
      (module) =>
        module.key === key
    )?.label ?? fallback;


  // =========================================================
  // ARKNOZ LENS
  // =========================================================

  const rawUnderstanding =
    p?.understanding?.trim() ??
    "";

  const publicUnderstanding =
    /^gold master research candidate/i.test(
      rawUnderstanding
    )
      ? ""
      : rawUnderstanding;

  const lensSource =
    publicUnderstanding ||
    p?.visualStatement?.trim() ||
    p?.strapline?.trim() ||
    entity.summary;

  const lensWords =
    lensSource
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  // =========================================================
  // RECORD MODULE CLASSIFICATION
  // Classification uses existing labels/text only.
  // Nothing is invented.
  // =========================================================

  const containsAny = (
    value: string,
    words: string[]
  ) => {
    const normalized =
      value.toLowerCase();

    return words.some(
      (word) =>
        normalized.includes(word)
    );
  };


  const designWords = [
    "design",
    "programme",
    "program",
    "project type",
    "use",
    "area",
    "floor",
    "height",
    "unit",
    "architect",
    "typology",
  ];

  const systemWords = [
    "structure",
    "structural",
    "material",
    "facade",
    "façade",
    "system",
    "construction",
    "engineer",
    "concrete",
    "steel",
    "timber",
    "glass",
  ];

  const performanceWords = [
    "performance",
    "sustain",
    "carbon",
    "energy",
    "environment",
    "climate",
    "certif",
    "biodivers",
    "efficien",
    "water",
    "thermal",
  ];

  const timelineWords = [
    "started",
    "opened",
    "completed",
    "completion",
    "date",
    "year",
    "inscription",
    "competition",
    "award",
  ];


  const designFacts =
    facts.filter(
      (fact) =>
        containsAny(
          fact.label,
          designWords
        )
    );

  const systemFacts =
    facts.filter(
      (fact) =>
        containsAny(
          fact.label,
          systemWords
        ) &&
        !containsAny(
          fact.label,
          timelineWords
        )
    );

  const performanceFacts =
    facts.filter(
      (fact) =>
        containsAny(
          fact.label,
          performanceWords
        )
    );


  const designAnatomy =
    anatomy.filter(
      (item) =>
        !containsAny(
          `${item.title} ${item.description}`,
          [
            ...systemWords,
            ...performanceWords,
          ]
        )
    );

  const systemAnatomy =
    anatomy.filter(
      (item) =>
        containsAny(
          `${item.title} ${item.description}`,
          systemWords
        )
    );

  const performanceAnatomy =
    anatomy.filter(
      (item) =>
        containsAny(
          `${item.title} ${item.description}`,
          performanceWords
        )
    );


  const designItems = [
    ...designAnatomy.map(
      (item) => ({
        title: item.title,
        text: item.description,
      })
    ),

    ...designFacts.map(
      (fact) => ({
        title: fact.label,
        text: fact.value,
      })
    ),
  ].slice(0, 4);


  const systemItems = [
    ...systemAnatomy.map(
      (item) => ({
        title: item.title,
        text: item.description,
      })
    ),

    ...systemFacts.map(
      (fact) => ({
        title: fact.label,
        text: fact.value,
      })
    ),
  ].slice(0, 4);


  const performanceItems = [
    ...performanceAnatomy.map(
      (item) => ({
        title: item.title,
        text: item.description,
      })
    ),

    ...performanceFacts.map(
      (fact) => ({
        title: fact.label,
        text: fact.value,
      })
    ),
  ].slice(0, 3);


  // If the record does not yet contain classified design data,
  // show genuine general project facts instead of inventing content.
  const projectTypeValue =
    facts.find(
      (fact) =>
        fact.label
          .trim()
          .toLowerCase() ===
        "project type"
    )?.value?.trim() ||
    p?.category?.trim() ||
    "";


  const designContextItems = [
    ...(p?.visualStatement?.trim()
      ? [
          {
            title: "Project idea",
            text: p.visualStatement.trim(),
          },
        ]
      : []),

    ...(projectTypeValue
      ? [
          {
            title: "Project type",
            text: projectTypeValue,
          },
        ]
      : []),

    ...designItems,
  ]
    .filter(
      (item, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.title
              .trim()
              .toLowerCase() ===
            item.title
              .trim()
              .toLowerCase()
        ) === index
    )
    .slice(0, 4);

  const designDisplayItems =
    designContextItems.length > 0
      ? designContextItems
      : facts
          .slice(0, 4)
          .map(
            (fact) => ({
              title: fact.label,
              text: fact.value,
            })
          );


  const hasPerformanceEvidence =
    performanceItems.length > 0;


  // =========================================================
  // PROJECT RECORD V2
  // Rich project information without inventing data.
  // =========================================================

  const projectEssentialItems = [
    ...people.map(
      (person) => ({
        label:
          person.role ||
          "Project team",

        value:
          person.name,
      })
    ),

    ...facts
      .filter(
        (fact) =>
          containsAny(
            fact.label,
            [
              "client",
              "developer",
              "architect",
              "engineer",
              "contractor",
              "consultant",
              "photographer",
              "area",
              "location",
              "status",
              "year",
              "opened",
              "completed",
            ]
          )
      )
      .map(
        (fact) => ({
          label:
            fact.label,

          value:
            fact.value,
        })
      ),
  ]
    .filter(
      (item, index, all) =>
        item.label &&
        item.value &&
        all.findIndex(
          (candidate) =>
            candidate.label
              .trim()
              .toLowerCase() ===
              item.label
                .trim()
                .toLowerCase() &&
            candidate.value
              .trim()
              .toLowerCase() ===
              item.value
                .trim()
                .toLowerCase()
        ) === index
    )
    .slice(
      0,
      6
    );


  const mediaTypes =
    Array.from(
      new Set(
        media.map(
          (item) =>
            item.role?.trim() ||
            "Media"
        )
      )
    );


  const mediaSummaryItems = [
    {
      label:
        "Media",

      value:
        String(
          media.length
        ),
    },

    ...(mediaTypes.length
      ? [
          {
            label:
              "Types",

            value:
              mediaTypes
                .slice(0, 4)
                .join(", "),
          },
        ]
      : []),

    ...(media[0]?.alt
      ? [
          {
            label:
              "Current view",

            value:
              media[0].alt,
          },
        ]
      : []),
  ];


  /*
   * Canonical Project timeline rule:
   *
   * Every verified timeline event belongs to the Project Record.
   * The UI must not silently discard valid project history.
   */
  const compactTimeline =
    timeline;


  const additionalReferences =
    learning.filter(
      (item) =>
        !sources.some(
          (source) =>
            source.href ===
            item.href
        )
    );


  const validSources =
    sources
      .filter(
        (source) =>
          Boolean(
            source.href
          )
      );

  const visibleSources =
    validSources
      .slice(
        0,
        5
      );


  const adaptiveGridClass = (
    count: number
  ) => {

    if (
      count <= 1
    ) {
      return "grid-cols-1";
    }

    if (
      count === 2
    ) {
      return "grid-cols-2";
    }

    if (
      count === 3
    ) {
      return "grid-cols-3";
    }

    return "grid-cols-2";
  };

  // =========================================================
  // 01 RECORD
  // =========================================================

  const recordFactPool =
    p?.facts ?? [];

  const recordPriorityLabels = [
    "Project type",
    "Location",
    "Architect",
    "Design architect — completion",
    "Consulting engineers",
    "Construction started",
    "Opened",
    "World Heritage inscription",
  ];

  const recordEssentialItems =
    recordPriorityLabels.flatMap(
      (wantedLabel) => {

        const item =
          recordFactPool.find(
            (fact) =>
              fact.label
                .trim()
                .toLowerCase() ===
              wantedLabel.toLowerCase()
          );

        return item
          ? [item]
          : [];
      }
    );

  const structuredProjectDataItems =
    (structuredRecord?.projectData ?? [])
      .map((item) => ({
        label: item.label,
        value: item.value,
      }))
      .filter(
        (item) =>
          Boolean(
            item.label.trim() &&
            item.value.trim()
          )
      );

  const recordEssentialDisplayItems =
    structuredProjectDataItems.length > 0
      ? structuredProjectDataItems
      : recordEssentialItems.length > 0
        ? recordEssentialItems
        : projectEssentialItems;


  /*
   * PROFESSIONAL RECORD HEADER
   *
   * The top orientation strip may combine factual Project Data
   * with key Team information. This does not move Architect into
   * Project Data; it only creates a concise cross-record summary.
   */
  const recordHeaderPriority = (
    label: string
  ) => {

    const key =
      label
        .trim()
        .toLowerCase();


    if (
      /^(project )?type$|typology/.test(
        key
      )
    ) {
      return 0;
    }


    if (
      /^location$|project location|city|country/.test(
        key
      )
    ) {
      return 1;
    }


    if (
      /^(architect|lead architect|design architect|lead designer)$/.test(
        key
      )
    ) {
      return 2;
    }


    if (
      /original building architect|original architect/.test(
        key
      )
    ) {
      return 7;
    }


    if (
      /completion|completed|opening year|opened|year completed|completion year/.test(
        key
      )
    ) {
      return 3;
    }


    if (
      /^status$|project status/.test(
        key
      )
    ) {
      return 4;
    }


    if (
      /area|gross floor|gfa|built.?up/.test(
        key
      )
    ) {
      return 5;
    }


    if (
      /former use|previous use|original use/.test(
        key
      )
    ) {
      return 6;
    }


    return 20;
  };


  const recordHeaderItems =
    [
      ...recordEssentialDisplayItems,

      ...(structuredRecord?.team?.length
        ? structuredRecord.team.map(
            (item) => ({
              label: item.role,
              value: item.name,
            })
          )
        : people.map(
            (item) => ({
              label:
                item.role ||
                "Project team",
              value: item.name,
            })
          )),
    ]
      .filter(
        (
          item,
          index,
          array
        ) =>
          Boolean(
            item.label?.trim() &&
            item.value?.trim()
          ) &&
          array.findIndex(
            (candidate) =>
              candidate.label
                .trim()
                .toLowerCase() ===
                item.label
                  .trim()
                  .toLowerCase()
          ) === index
      )
      .map(
        (
          item,
          index
        ) => ({
          item,
          index,
        })
      )
      .sort(
        (
          a,
          b
        ) => {

          const priorityDifference =
            recordHeaderPriority(
              a.item.label
            ) -
            recordHeaderPriority(
              b.item.label
            );


          return priorityDifference !== 0
            ? priorityDifference
            : a.index - b.index;
        }
      )
      .slice(
        0,
        4
      )
      .map(
        ({ item }) =>
          item
      );





  const structuredDesignRecordItems =
    (structuredRecord?.design ?? [])
      .map((item) => ({
        title: item.label,
        text:
          item.description?.trim()
            ? `${item.value} — ${item.description}`
            : item.value,
      }));

  const designRecordItems =
    structuredDesignRecordItems.length > 0
      ? structuredDesignRecordItems
      : designDisplayItems
          .filter(
            (item) =>
              ![
                "project idea",
                "project type",
                "architect",
              ].includes(
                item.title
                  .trim()
                  .toLowerCase()
              )
          )
          .slice(0, 4);


  const systemRecordItems =
    systemItems
      .filter(
        (item) =>
          item.title
            .trim()
            .toLowerCase() !==
          "consulting engineers"
      )
      .slice(0, 6);

  type RecordChapter =
    | "project"
    | "site"
    | "team"
    | "programme"
    | "design"
    | "structure"
    | "systems"
    | "materials"
    | "products"
    | "performance"
    | "delivery"
    | "approvals"
    | "media"
    | "sources"
    | "documents"
    | "timeline";


  type RecordDisplayItem = {
    title: string;
    text: string;
    href?: string;
    sourceUrl?: string;
    provenanceStatus?: string;
  };


  const mapStructuredFields = (
    items:
      | NonNullable<
          NonNullable<
            typeof structuredRecord
          >["projectData"]
        >
      | undefined
  ): RecordDisplayItem[] =>
    (items ?? []).map(
      (item) => ({
        title: item.label,

        text:
          item.description?.trim()
            ? `${item.value} — ${item.description}`
            : item.value,

        href:
          item.href,

        sourceUrl:
          item.sourceUrl,

        provenanceStatus:
          item.provenanceStatus,
      })
    );


  const dedupeRecordItems = (
    items: RecordDisplayItem[]
  ) =>
    items.filter(
      (
        item,
        index,
        all
      ) =>
        item.title.trim() &&
        item.text.trim() &&
        all.findIndex(
          (candidate) =>
            `${candidate.title}|${candidate.text}`
              .trim()
              .toLowerCase() ===
            `${item.title}|${item.text}`
              .trim()
              .toLowerCase()
        ) === index
    );


  /* =========================================================
     PROJECT DATA
  ========================================================= */

  const projectRecordItems: RecordDisplayItem[] =
    mapStructuredFields(
      structuredRecord?.projectData ?? []
    );


  /* =========================================================
     TEAM
  ========================================================= */

  const structuredTeamRecordItems: RecordDisplayItem[] =
    (structuredRecord?.team ?? []).map(
      (item) => ({
        title: item.role,

        text: [
          item.name,
          item.discipline,
          item.organisation,
        ]
          .filter(Boolean)
          .join(" · "),

        href:
          item.href ??
          item.organisationHref,

        sourceUrl:
          item.sourceUrl,

        provenanceStatus:
          item.provenanceStatus,
      })
    );

  const teamRecordItems =
    dedupeRecordItems(
      structuredTeamRecordItems
    );


  /* =========================================================
     PROGRAMME
  ========================================================= */

  const structuredProgrammeDisplayItems =
    mapStructuredFields(
      structuredRecord?.programme ?? []
    );

  const programmeDisplayItems =
    dedupeRecordItems(
      structuredProgrammeDisplayItems
    );


  /* =========================================================
     DESIGN
  ========================================================= */

  const designDisplayRecordItems =
    dedupeRecordItems(
      mapStructuredFields(
        structuredRecord?.design ?? []
      )
    );


  /* =========================================================
     MATERIALS
  ========================================================= */

  const structuredMaterialDisplayItems =
    mapStructuredFields(
      structuredRecord?.materials ?? []
    );

  const materialDisplayItems =
    dedupeRecordItems(
      structuredMaterialDisplayItems
    );


  /* =========================================================
     STRUCTURE
  ========================================================= */

  const structuredStructureDisplayItems =
    mapStructuredFields(
      structuredRecord?.structure ?? []
    );

  const structureDisplayItems =
    dedupeRecordItems(
      structuredStructureDisplayItems
    );


  /* =========================================================
     BUILDING SYSTEMS
  ========================================================= */

  const structuredSystemDisplayItems =
    mapStructuredFields(
      structuredRecord?.systems ?? []
    );

  const buildingSystemDisplayItems =
    dedupeRecordItems(
      structuredSystemDisplayItems
    );


  /* =========================================================
     PRODUCTS / MANUFACTURERS
  ========================================================= */

  const productRecordItems: RecordDisplayItem[] =
    dedupeRecordItems(
      (structuredRecord?.products ?? []).map(
        (item) => ({
          title: item.name,

          text: [
            item.manufacturer,
            item.category,
            item.application,
          ]
            .filter(Boolean)
            .join(" · ") ||
            "Recorded project product",

          href:
            item.href ??
            item.manufacturerHref,

          sourceUrl:
            item.sourceUrl,

          provenanceStatus:
            item.provenanceStatus,
        })
      )
    );


  /* =========================================================
     PERFORMANCE
  ========================================================= */

  const performanceDisplayItems =
    dedupeRecordItems(
      mapStructuredFields(
        structuredRecord?.performance ?? []
      )
    );


  /* =========================================================
     DELIVERY
  ========================================================= */

  const structuredDeliveryDisplayItems =
    mapStructuredFields(
      structuredRecord?.delivery ?? []
    );

  const deliveryDisplayItems =
    dedupeRecordItems(
      structuredDeliveryDisplayItems
    );


  /* =========================================================
     APPROVALS / CERTIFICATION
  ========================================================= */

  const structuredHistoryDisplayItems =
    dedupeRecordItems([
      ...mapStructuredFields(
        structuredRecord?.history ?? []
      ),

      ...mapStructuredFields(
        structuredRecord?.approvals ?? []
      ),
    ]);

  const approvalDisplayItems =
    dedupeRecordItems(
      structuredHistoryDisplayItems
    );

  const structuredSiteContextItems =
    mapStructuredFields(
      structuredRecord?.site ?? []
    );

  const siteContextItems =
    dedupeRecordItems(
      structuredSiteContextItems
    );

  const materialsAndProductsItems =
    dedupeRecordItems([
      ...materialDisplayItems,
      ...productRecordItems,
    ]);


  /* =========================================================
     RECORD NAVIGATION
  ========================================================= */

  // =========================================================
  // PROJECT 26 RECORD MERGE
  //
  // Existing canonical project data stays unchanged.
  // The public Record is reorganised into six user-facing
  // indexes by combining the existing factual data groups.
  // =========================================================

  const mergeRecordDisplayItems = (
    ...groups: RecordDisplayItem[][]
  ): RecordDisplayItem[] => {
    const seen =
      new Set<string>();

    return groups
      .flat()
      .filter((item) => {
        const key =
          `${item.title}|||${item.text}`
            .trim()
            .toLowerCase();

        if (!key || seen.has(key)) {
          return false;
        }

        seen.add(key);

        return true;
      });
  };


  const recordScalePattern =
    /\b(area|site area|built.?up|floor area|gfa|gross|height|floor|storey|story|capacity|dimension|length|width|volume|unit|room|seat|bed|plot|footprint|scale)\b/i;


  const identityStatusItems =
    mergeRecordDisplayItems(
      projectRecordItems.filter(
        (item) =>
          !recordScalePattern.test(
            `${item.title} ${item.text}`
          )
      ),
      teamRecordItems
    );


  const programmeScaleItems =
    mergeRecordDisplayItems(
      programmeDisplayItems,
      projectRecordItems.filter(
        (item) =>
          recordScalePattern.test(
            `${item.title} ${item.text}`
          )
      ),
      siteContextItems.filter(
        (item) =>
          recordScalePattern.test(
            `${item.title} ${item.text}`
          )
      )
    );


  const spatialDesignItems =
    mergeRecordDisplayItems(
      siteContextItems.filter(
        (item) =>
          !recordScalePattern.test(
            `${item.title} ${item.text}`
          )
      ),
      designDisplayRecordItems
    );


  const technicalMaterialItems =
    mergeRecordDisplayItems(
      structureDisplayItems,
      buildingSystemDisplayItems,
      materialsAndProductsItems,
      productRecordItems,
      performanceDisplayItems
    );

  /*
   * DESIGN & SYSTEMS — SIGNED-IN RECORD
   *
   * Universal factual grouping for Record 02.
   * Uses existing canonical RecordDisplayItem collections.
   * Groups collapse when no information is recorded.
   */

  const designSystemItemKey = (
    item: RecordDisplayItem
  ) =>
    `${item.title.trim().toLowerCase()}::${item.text
      .trim()
      .toLowerCase()}`;


  const designSystemUsedKeys =
    new Set<string>();


  const takeUniqueDesignSystemItems = (
    items: RecordDisplayItem[]
  ) =>
    dedupeRecordItems(items).filter(
      (item) => {
        const key =
          designSystemItemKey(item);

        if (
          designSystemUsedKeys.has(key)
        ) {
          return false;
        }

        designSystemUsedKeys.add(key);

        return true;
      }
    );


  const designEnvelopePattern =
    /envelope|façade|facade|roof|glazing|external wall|curtain wall|cladding/i;


  const designEnvelopeSystemItems =
    buildingSystemDisplayItems.filter(
      (item) =>
        designEnvelopePattern.test(
          `${item.title} ${item.text}`
        )
    );


  const designNonEnvelopeSystemItems =
    buildingSystemDisplayItems.filter(
      (item) =>
        !designEnvelopePattern.test(
          `${item.title} ${item.text}`
        )
    );


  const designSpatialRecordItems =
    takeUniqueDesignSystemItems(
      designDisplayRecordItems
    );


  const designSiteRecordItems =
    takeUniqueDesignSystemItems(
      siteContextItems
    );


  const designStructureEnvelopeRecordItems =
    takeUniqueDesignSystemItems(
      mergeRecordDisplayItems(
        structureDisplayItems,
        designEnvelopeSystemItems
      )
    );


  const designMaterialRecordItems =
    takeUniqueDesignSystemItems(
      materialsAndProductsItems
    );


  const designBuildingSystemRecordItems =
    takeUniqueDesignSystemItems(
      mergeRecordDisplayItems(
        designNonEnvelopeSystemItems,
        performanceDisplayItems
      )
    );


  const designSystemGroups = [
    {
      id: "spatial",
      index: "02.1",
      label: "Spatial Organisation",
      caption:
        "Planning · circulation · spatial organisation",
      items:
        designSpatialRecordItems,
    },
    {
      id: "site",
      index: "02.2",
      label: "Design & Site Relationship",
      caption:
        "Site response · orientation · landscape relationship",
      items:
        designSiteRecordItems,
    },
    {
      id: "structure",
      index: "02.3",
      label: "Structure & Envelope",
      caption:
        "Structure · envelope · construction",
      items:
        designStructureEnvelopeRecordItems,
    },
    {
      id: "materials",
      index: "02.4",
      label: "Materials",
      caption:
        "Material palette · products · applications",
      items:
        designMaterialRecordItems,
    },
    {
      id: "systems",
      index: "02.5",
      label: "Building Systems",
      caption:
        "Services · environmental systems · performance",
      items:
        designBuildingSystemRecordItems,
    },
  ].filter(
    (group) =>
      group.items.length > 0
  );


  /*
   * PROJECT 26 — THREE RECORD GROUPS
   *
   * 01 Identity, Programme & Status
   * 02 Spatial, Design & Technical
   * 03 Delivery, Evidence & Documentation
   */

  const identityProgrammeStatusItems =
    mergeRecordDisplayItems(
      identityStatusItems,
      programmeScaleItems,
      deliveryDisplayItems,
      approvalDisplayItems
    );


  const spatialDesignTechnicalItems =
    mergeRecordDisplayItems(
      spatialDesignItems,
      technicalMaterialItems
    );

  const recordSectionItems:
    Record<
      RecordChapter,
      RecordDisplayItem[]
    > = {
      project:
        identityProgrammeStatusItems,

      site:
        siteContextItems,

      team:
        teamRecordItems,

      programme:
        programmeScaleItems,

      design:
        spatialDesignTechnicalItems,

      structure:
        structureDisplayItems,

      systems:
        buildingSystemDisplayItems,

      materials:
        technicalMaterialItems,

      products:
        productRecordItems,

      performance:
        performanceDisplayItems,

      delivery:
        deliveryDisplayItems,

      approvals:
        approvalDisplayItems,

      media:
        [],

      sources:
        [],

      documents:
        [],

      timeline:
        deliveryDisplayItems,
    };


  const recordChapterOptions: {
    id: RecordChapter;
    label: string;
    summary: string;
    available: boolean;
  }[] = [
    {
      id: "project",
      label: "Project Profile",
      summary: "Identity · Programme · Status · Timeline",
      available: true,
    },
    {
      id: "design",
      label: "Design & Systems",
      summary: "Spatial · Technical · Material",
      available: true,
    },
    {
      id: "media",
      label: "Delivery, Evidence & Documentation",
      summary: "Delivery · Sources · Media · Drawings · Documents",
      available: true,
    },
  ];

  const recordSectionDescriptions:
    Record<RecordChapter, string> = {
      project:
        "Verified project identity, location, status, dates, ownership and principal project participants.",

      site:
        "Factual site, location, orientation, access, climatic and physical context information.",

      team:
        "Client, designers, consultants, engineers, contractors and recorded project participants.",

      programme:
        "Verified programme, uses, capacities, site and measurable project scale information.",

      design:
        "Verified site context, planning logic, spatial organisation, circulation, massing and significant design elements.",

      structure:
        "Recorded structural systems, construction methods, foundations, framing and technical construction information.",

      systems:
        "Recorded building services, environmental systems, lighting, water and passive environmental strategies.",

      materials:
        "Verified structure, construction, systems, materials, products, environmental strategies and recorded performance information.",

      products:
        "Named products and manufacturers recorded for the project.",

      performance:
        "Recorded sustainability, environmental, energy and operational performance information.",

      delivery:
        "Construction dates, procurement, contractors, project cost, phasing and delivery information.",

      approvals:
        "Planning, statutory, heritage, certification and approval information.",

      media:
        "Sources, photographs, drawings, documents, provenance and supporting evidence for the factual Project Record.",

      sources:
        "Source references supporting the factual Project Record.",

      documents:
        "Reusable drawings and evidence documents linked to the Project Record.",

      timeline:
        "Verified delivery information, construction chronology, milestones, approvals, alterations and significant project changes.",
    };


  const [
    recordChapter,
    setRecordChapter,
  ] =
    useState<RecordChapter>(
      "project"
    );


  const [
    expandedRecordFact,
    setExpandedRecordFact,
  ] =
    useState<string | null>(
      null
    );


  const activeRecordItems =
    recordSectionItems[
      recordChapter
    ];


  const activeRecordLabel =
    recordChapterOptions.find(
      (chapter) =>
        chapter.id ===
        recordChapter
    )?.label ??
    "Project Data";


  const activeRecordDescription =
    recordChapter === "project"
      ? "Project identity, programme, scale, authorship, location, status, delivery and key recorded dates."
      : recordChapter === "design"
        ? "Spatial organisation, design resolution, structure, materials, envelope, systems and technical information."
        : recordChapter === "media"
          ? "Sources, photographs, drawings, documents and provenance supporting the factual Project Record."
          : recordSectionDescriptions[
              recordChapter
            ];


  const activeRecordCount =
    recordChapter === "media"
      ? media.length +
        documents.length +
        validSources.length
      : activeRecordItems.length;


  const activeRecordCountLabel =
    recordChapter === "media"
      ? "items"
      : "recorded";




  // =========================================================
  // 02 CONNECTIONS
  // =========================================================

  const resolveConnectionHref = (
    href: string | undefined,
    title: string
  ) => {

    const value =
      (href ?? "").trim();

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (
      value &&
      ![
        "/global",
        "/knowledge",
        "/places",
        "/people",
        "/organisations",
        "/products",
        "/projects",
      ].includes(value)
    ) {
      return value;
    }

    return `/search?q=${encodeURIComponent(
      title
    )}`;
  };


  const participantConnections =
    people.map(
      (person) => ({
        type:
          person.role ||
          "Person",

        title:
          person.name,

        href:
          person.href,

        description:
          "Recorded project participant",
      })
    );


  const hasRecordedPlaceConnection =
    connections.some(
      (item) =>
        item.type
          .trim()
          .toLowerCase() ===
        "place"
    );

  const placeConnection =
    p?.placeHref &&
    !hasRecordedPlaceConnection
      ? [
          {
            type: "Place",
            title: entity.geography,
            href: p.placeHref,
            description:
              "Recorded project location",
          },
        ]
      : [];


  const verifiedConnections = [
    ...participantConnections,
    ...connections,
    ...placeConnection,
  ].filter(
    (item, index, all) =>
      all.findIndex(
        (candidate) =>
          candidate.title
            .trim()
            .toLowerCase() ===
          item.title
            .trim()
            .toLowerCase()
      ) === index
  );





  const connectionsView = (
    <div className="grid h-full min-h-0 gap-2.5 lg:grid-cols-[.9fr_1.1fr]">

      {/* CONNECTION MAP */}

      <article className="relative min-h-0 overflow-hidden rounded-[18px] bg-[#0b2949] p-5 text-white">

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.55) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.55) 1px,transparent 1px)",
            backgroundSize:
              "34px 34px",
          }}
        />

        <div className="relative flex h-full min-h-0 flex-col">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
              CONNECTED BUILT WORLD
            </p>

            <h3 className="mt-1 text-[24px] font-bold tracking-tight">
              How this project connects
            </h3>

            <p className="mt-2 max-w-xl text-[12px] leading-5 text-white/60">
              Arknoz separates genuine project relationships from broader discovery context.
            </p>

          </div>
          <div className="relative my-auto py-6">

            <div className="absolute left-[10%] right-[10%] top-[42%] h-px bg-white/10" />


            <div className="grid items-center gap-3 lg:grid-cols-[1fr_1.08fr_1fr]">

              {/* LEFT VERIFIED RELATIONSHIPS */}

              <div className="relative z-10 space-y-2.5">

                {verifiedConnections
                  .slice(0, 3)
                  .map(
                    (
                      item,
                      index
                    ) => (

                      <a
                        key={`map-left-${item.type}-${item.title}-${index}`}
                        href={resolveConnectionHref(
                          item.href,
                          item.title
                        )}
                        className="group cursor-pointer block rounded-[18px] border border-white/12 bg-white/[0.08] p-3 transition hover:bg-white/[0.12]"
                      >

                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200">
                          {item.type}
                        </p>

                        <p className="mt-1.5 text-[12px] font-bold leading-4">
                          {item.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-[13px] leading-4.5 text-white/45">
                          {item.description ??
                            "Recorded project relationship"}
                        </p>

                      </a>

                    )
                  )}

              </div>


              {/* PROJECT */}

              <div className="relative z-10 rounded-[18px] bg-white p-5 text-center text-[#0b2949] shadow-xl">

                <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-blue-700">
                  Project
                </p>

                <p className="mt-2 text-[18px] font-bold leading-5">
                  {entity.title}
                </p>

                <p className="mt-2 text-[10px] text-slate-400">
                  Canonical Arknoz record
                </p>

                <div className="mt-3 border-t border-slate-200 pt-2">

                  <p className="text-[13px] font-bold text-slate-600">
                    {verifiedConnections.length} recorded relationship{
                      verifiedConnections.length === 1
                        ? ""
                        : "s"
                    }
                  </p>

                </div>

              </div>


              {/* RIGHT VERIFIED RELATIONSHIPS */}

              <div className="relative z-10 space-y-2.5">

                {verifiedConnections
                  .slice(3, 6)
                  .map(
                    (
                      item,
                      index
                    ) => (

                      <a
                        key={`map-right-${item.type}-${item.title}-${index}`}
                        href={resolveConnectionHref(
                          item.href,
                          item.title
                        )}
                        className="group cursor-pointer block rounded-[18px] border border-white/12 bg-white/[0.08] p-3 transition hover:bg-white/[0.12]"
                      >

                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200">
                          {item.type}
                        </p>

                        <p className="mt-1.5 text-[12px] font-bold leading-4">
                          {item.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-[13px] leading-4.5 text-white/45">
                          {item.description ??
                            "Recorded project relationship"}
                        </p>

                      </a>

                    )
                  )}

              </div>

            </div>


            {/* CONTEXT IS NOT A DIRECT CONNECTION */}

            {topics.length > 0 ? (

              <div className="mt-5 border-t border-white/10 pt-4">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-[8.5px] font-bold uppercase tracking-[0.15em] text-blue-200">
                    Discovery context
                  </p>

                  <p className="text-[10px] text-white/35">
                    Not direct relationships
                  </p>

                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">

                  {topics
                    .slice(0, 6)
                    .map(
                      (topic) => (

                        <span
                          key={topic}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[13px] font-semibold text-white/70"
                        >
                          {topic}
                        </span>

                      )
                    )}

                </div>

              </div>

            ) : null}

          </div>



          <div className="border-t border-white/10 pt-4">

            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-blue-200">
              ARKNOZ CONNECTION RULE
            </p>

            <p className="mt-1.5 max-w-xl text-[13px] leading-4 text-white/52">
              A factual connection appears only when it is supported by the project record or linked Arknoz evidence.
            </p>

          </div>

        </div>

      </article>


      {/* CONNECTION DATA */}

      <div className="grid min-h-0 grid-rows-[1fr_auto] gap-2.5">

        <article className="min-h-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                VERIFIED CONNECTIONS
              </p>

              <h3 className="mt-1 text-[18px] font-bold">
                Direct relationships
              </h3>
            </div>

            <span className="text-[10px] text-slate-400">
              {verifiedConnections.length} recorded
            </span>

          </div>


          {verifiedConnections.length > 0 ? (

            <div className="mt-3 grid grid-cols-2 gap-2">

              {verifiedConnections
                .slice(0, 8)
                .map(
                  (
                    item,
                    index
                  ) => (

                    <a
                      key={`${item.type}-${item.title}-${index}`}
                      href={resolveConnectionHref(
                        item.href,
                        item.title
                      )}
                      className="cursor-pointer group rounded-[12px] bg-[#f4f7fa] p-3 ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:bg-white hover:shadow-sm"
                    >

                      <div className="flex items-center justify-between gap-2">

                        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-blue-700">
                          {item.type}
                        </p>

                        <span className="text-blue-700">
                          →
                        </span>

                      </div>

                      <p className="mt-1.5 text-[12px] font-bold">
                        {item.title}
                      </p>

                      {item.description ? (
                        <p className="mt-1 text-[11.5px] leading-4 text-slate-500">
                          {item.description}
                        </p>
                      ) : null}

                    </a>

                  )
                )}

            </div>

          ) : (

            <div className="mt-3 rounded-[12px] bg-[#f4f7fa] p-4">

              <p className="text-[13px] text-slate-500">
                No verified direct relationships are recorded yet.
              </p>

            </div>

          )}

        </article>
        {/* CURRENT RECORD SCOPE */}

        <article className="rounded-[18px] border border-slate-200 bg-[#f7f9fc] p-4">

          <div className="flex items-center justify-between gap-5">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                CURRENT RECORD SCOPE
              </p>

              <h3 className="mt-1 text-[17.5px] font-bold text-slate-950">
                {verifiedConnections.length} verified direct relationship{
                  verifiedConnections.length === 1
                    ? ""
                    : "s"
                }
              </h3>

              <p className="mt-1.5 max-w-xl text-[10px] leading-4 text-slate-500">
                This view ends at verified direct relationships supported by the record or linked Arknoz evidence.
              </p>

            </div>


            <div className="shrink-0 rounded-full bg-white px-3 py-2 text-[13px] font-bold uppercase tracking-[0.12em] text-slate-500 ring-1 ring-slate-200">
              Record boundary
            </div>

          </div>

        </article>

      </div>

    </div>
  );


  // =========================================================
  // 03 INTELLIGENCE · PRO
  // =========================================================

  // =========================================================
  // 02 ARKNOZ LENS
  // Interpretation layer — separate from factual Record.
  // =========================================================

  /*
   * ARKNOZ PROJECT LENS STANDARD
   *
   * These four headings are permanent across every Project.
   * Project records supply the analysis.
   * Project records DO NOT define Lens headings.
   */

  const lensSections = [
    {
      kicker: "01",
      title: "Context & Intent",
      question:
        "What conditions shaped the project, and what architectural position does it take in response?",
      summary:
        p?.lens?.projectStrategy?.trim() ||
        "",
      deep:
        p?.lens?.deepReview
          ?.projectStrategy,
    },
    {
      kicker: "02",
      title: "Form, Space & Use",
      question:
        "How do plan, section, movement, hierarchy and use produce the project's spatial character?",
      summary:
        p?.lens?.organisingLogic?.trim() ||
        "",
      deep:
        p?.lens?.deepReview
          ?.organisingLogic,
    },
    {
      kicker: "03",
      title:
        "Material & Technical Resolution",
      question:
        "How do structure, envelope, materials and systems make the architectural idea possible?",
      summary:
        p?.lens
          ?.designTechnicalResolution
          ?.trim() ||
        "",
      deep:
        p?.lens?.deepReview
          ?.designTechnicalResolution,
    },
    {
      kicker: "04",
      title: "Performance & Impact",
      question:
        "How does the project perform in use and over time, and what consequences follow from its design decisions?",
      summary:
        p?.lens
          ?.professionalLesson
          ?.trim() ||
        "",
      deep:
        p?.lens?.deepReview
          ?.professionalLesson,
    },
  ] as const;


  const lensThesis =
    p?.lens?.thesis?.trim() ||
    "";


  const lensImageCaption =
    p?.lens?.imageCaption?.trim() ||
    p?.strapline?.trim() ||
    entity.title;


  const lensDeepReview =
    p?.lens?.deepReview;


  const lensEditorial =
    lensDeepReview?.editorial;


  const lensReviewBasis =
    lensDeepReview?.reviewBasis;


  const lensReviewers =
    lensReviewBasis?.reviewers ??
    [];


  const lensReviewLabel =
    lensReviewBasis?.level ===
      "expert_reviewed" &&
    lensReviewers.length > 0
      ? "Expert Reviewed"
      : lensReviewBasis?.level ===
            "peer_reviewed" &&
          lensReviewers.length > 0
        ? "Peer Reviewed"
        : lensReviewBasis?.level ===
            "arknoz_research_review"
          ? "Arknoz Research Review"
          : "Arknoz Analytical Review";


  const lensReviewerLine =
    lensReviewers
      .map(
        (reviewer) =>
          [
            reviewer.name,
            reviewer.discipline,
            reviewer.institution,
            reviewer.country,
          ]
            .filter(Boolean)
            .join(" · ")
      )
      .join(" / ");


  const lensSynthesis =
    lensDeepReview?.synthesis;


  const lensSynthesisGroups = [
    {
      title:
        "What the project gets right",
      items:
        lensSynthesis?.getsRight ??
        [],
    },
    {
      title:
        "Where it is vulnerable",
      items:
        lensSynthesis
          ?.vulnerabilities ??
        [],
    },
    {
      title:
        "Transferable principles",
      items:
        lensSynthesis
          ?.transferablePrinciples ??
        [],
    },
    {
      title:
        "Questions for further study",
      items:
        lensSynthesis?.furtherStudy ??
        [],
    },
  ] as const;


  // =========================================================
  // PROJECT 26 ARKNOZ LENS
  //
  // Overview shows the project.
  // Record documents the project.
  // Arknoz Lens helps the user understand, test and use it.
  //
  // No horizontal scroller.
  // No internal content scrollbar.
  // Left index + right hero / intelligence workspace.
  // =========================================================

  type LensActiveView =
    | "anatomy"
    | "forensics"
    | "systems"
    | "connected"
    | "adaptation"
    | "benchmark";


  type AdaptationTool =
    | "location"
    | "climate"
    | "site"
    | "cost"
    | "material"
    | "scenario";


  const [
    lensActiveView,
    setLensActiveView,
  ] =
    useState<LensActiveView>(
      "anatomy"
    );


  const [
    adaptationTool,
    setAdaptationTool,
  ] =
    useState<AdaptationTool>(
      "location"
    );


  const lensNavigation = [
    {
      id: "anatomy",
      kicker: "01",
      title: "Project Anatomy",
      question:
        "How is this project assembled, and how do its major spatial and technical systems relate?",
    },
    {
      id: "forensics",
      kicker: "02",
      title: "Design Forensics",
      question:
        "What drove the important decisions, and what consequences and trade-offs followed?",
    },
    {
      id: "systems",
      kicker: "03",
      title:
        "Systems, Performance & Risk",
      question:
        "How do the project's systems perform, depend on one another and create exposure over time?",
    },
    {
      id: "connected",
      kicker: "04",
      title:
        "Connected Intelligence",
      question:
        "How does this project connect to people, organisations, places, knowledge and other Built World records?",
    },
    {
      id: "adaptation",
      kicker: "05",
      title: "Adaptation Lab",
      question:
        "Can the project's underlying design logic work under a different location, site, budget or material context?",
    },
    {
      id: "benchmark",
      kicker: "06",
      title:
        "Benchmark & Decision Intelligence",
      question:
        "What becomes visible when this project is evaluated against valid evidence and comparable alternatives?",
    },
  ] as const;


  const activeLensMeta =
    lensNavigation.find(
      (item) =>
        item.id === lensActiveView
    ) ??
    lensNavigation[0];


  const notDocumented =
    "Not sufficiently documented in reviewed project evidence.";


  const anatomyReadings = [
    {
      label:
        "Context & intent",
      signal:
        "CONTEXT",
      text:
        lensSections[0]
          ?.deep
          ?.expertReview
          ?.trim() ||
        lensSections[0]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Spatial organisation",
      signal:
        "SPACE",
      text:
        lensSections[1]
          ?.deep
          ?.expertReview
          ?.trim() ||
        lensSections[1]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Structure & material",
      signal:
        "ASSEMBLY",
      text:
        lensSections[2]
          ?.deep
          ?.expertReview
          ?.trim() ||
        lensSections[2]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "System dependency",
      signal:
        "SYSTEM",
      text:
        lensSections[2]
          ?.deep
          ?.whyItMatters
          ?.trim() ||
        lensSections[2]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Performance & impact",
      signal:
        "IMPACT",
      text:
        lensSections[3]
          ?.deep
          ?.expertReview
          ?.trim() ||
        lensSections[3]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Transferable principle",
      signal:
        "TRANSFER",
      text:
        lensSynthesis
          ?.transferablePrinciples
          ?.[0]
          ?.trim() ||
        lensSections[3]
          ?.deep
          ?.whyItMatters
          ?.trim() ||
        notDocumented,
    },
  ];

  const forensicReadings = [
    {
      label:
        "Driver / constraint",
      text:
        lensSections[0]
          ?.deep
          ?.evidenceReading
          ?.trim() ||
        lensSections[0]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Design response",
      text:
        lensSections[0]
          ?.deep
          ?.expertReview
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Consequence / trade-off",
      text:
        lensSections[0]
          ?.deep
          ?.tradeoffsConsequences
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Why it matters",
      text:
        lensSections[0]
          ?.deep
          ?.whyItMatters
          ?.trim() ||
        notDocumented,
    },
  ];


  const systemReadings = [
    {
      label:
        "Performance reading",
      text:
        lensSections[3]
          ?.deep
          ?.expertReview
          ?.trim() ||
        lensSections[3]
          ?.summary
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Risk / vulnerability",
      text:
        lensSections[3]
          ?.deep
          ?.criticalAssessment
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Trade-off",
      text:
        lensSections[3]
          ?.deep
          ?.tradeoffsConsequences
          ?.trim() ||
        notDocumented,
    },
    {
      label:
        "Professional consequence",
      text:
        lensSections[3]
          ?.deep
          ?.whyItMatters
          ?.trim() ||
        notDocumented,
    },
  ];


  const adaptationTools: {
    id: AdaptationTool;
    label: string;
    question: string;
    input: string;
  }[] = [
    {
      id: "location",
      label: "Location Fit",
      question:
        "What transfers to another location and what must change?",
      input:
        "Target city / region required",
    },
    {
      id: "climate",
      label: "Climate Fit",
      question:
        "How does the project logic respond to a different climate?",
      input:
        "Target climate or location required",
    },
    {
      id: "site",
      label: "Site Fit",
      question:
        "Can the project logic work on a different plot, frontage or orientation?",
      input:
        "Site dimensions and orientation required",
    },
    {
      id: "cost",
      label: "Cost Adapt",
      question:
        "What can change to reduce cost without destroying the project's critical design logic?",
      input:
        "Target budget or reduction required",
    },
    {
      id: "material",
      label: "Material Adapt",
      question:
        "Which systems or materials could be substituted while retaining design and performance intent?",
      input:
        "Target market / material context required",
    },
    {
      id: "scenario",
      label: "Scenario Test",
      question:
        "What changes when multiple project conditions are adjusted together?",
      input:
        "Location, site, budget or material scenario required",
    },
  ];


  const activeAdaptationTool =
    adaptationTools.find(
      (tool) =>
        tool.id === adaptationTool
    ) ??
    adaptationTools[0];


  const arknozLens = (

    <div
      className={
        lensActiveView === "anatomy"
          ? "pb-0 lg:h-[calc(100svh-218px)] lg:min-h-0"
          : "pb-5"
      }
    >

      <article
        className={`grid rounded-[22px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] lg:grid-cols-[285px_minmax(0,1fr)] ${
          lensActiveView === "anatomy"
            ? "items-stretch overflow-hidden lg:h-full lg:min-h-0"
            : "items-start overflow-visible"
        }`}
      >

        {/* ==================================================
            LEFT · PROJECT 26 LENS INDEX
        ================================================== */}

        <aside
          className={`border-b border-slate-200 bg-[#f7f9fc] lg:border-b-0 lg:border-r ${
            lensActiveView === "anatomy"
              ? "lg:h-full lg:min-h-0 lg:overflow-hidden"
              : "lg:sticky lg:top-[160px]"
          }`}
        >

          <div className="border-b border-slate-200 px-5 py-5">

            <div className="flex items-center justify-between gap-3">

              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8a3f69]">
                Arknoz Lens
              </p>

              <span className="inline-flex items-center gap-1 rounded-full border border-[#dfc7d4] bg-white px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-[#8a3f69]">
                <LockIcon />
                Pro
              </span>

            </div>

            <h3 className="mt-2 text-[19px] font-bold tracking-[-0.035em] text-slate-950">
              Arknoz Lens
            </h3>

            <p className="mt-1.5 text-[10px] leading-[1.55] text-slate-500">
              Understand it. Test it. Use it.
            </p>

          </div>


          <nav
            aria-label="Project 26 Arknoz Lens index"
            className="grid gap-1.5 p-3"
          >

            {lensNavigation.map(
              (item) => {

                const active =
                  item.id ===
                  lensActiveView;

                return (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setLensActiveView(
                        item.id
                      )
                    }
                    aria-pressed={active}
                    className={`group grid cursor-pointer grid-cols-[28px_minmax(0,1fr)] gap-3 rounded-[12px] px-3 py-3 text-left transition ${
                      active
                        ? "bg-[#0b2949] text-white shadow-sm"
                        : "bg-transparent text-slate-700 hover:bg-white"
                    }`}
                  >

                    <span
                      className={`pt-[2px] text-[8px] font-bold ${
                        active
                          ? "text-blue-200"
                          : "text-slate-400"
                      }`}
                    >
                      {item.kicker}
                    </span>

                    <span className="text-[10.5px] font-semibold leading-[1.3]">
                      {item.title}
                    </span>

                  </button>

                );
              }
            )}

          </nav>


          <div className="border-t border-slate-200 px-5 py-4">

            <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Lens thesis
            </p>

            <p className="mt-1.5 text-[9px] leading-[1.5] text-slate-600">
              {lensThesis ||
                "Project intelligence is derived from the verified Record and reviewed evidence."}
            </p>

          </div>

        </aside>


        {/* ==================================================
            RIGHT · HERO + ACTIVE INTELLIGENCE
        ================================================== */}

        <main className="min-w-0">

          {/* HERO */}

          <header className="relative min-h-[270px] overflow-hidden bg-[#0b2949]">

            {media[0]?.src ? (

              <img
                src={media[0].src}
                alt={entity.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

            ) : null}

            <div className="absolute inset-0 bg-gradient-to-r from-[#071a2d]/95 via-[#071a2d]/72 to-[#071a2d]/30" />


            <div
              className={`relative flex max-w-[900px] flex-col justify-end px-7 lg:px-10 ${
                lensActiveView === "anatomy"
                  ? "min-h-[130px] py-4"
                  : "min-h-[270px] py-7"
              }`}
            >

              <div className="flex items-center gap-2">

                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  {activeLensMeta.kicker}
                </span>

                <span className="text-white/30">
                  /
                </span>

                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/55">
                  Arknoz Lens
                </span>

              </div>

              <h2 className="mt-2 text-[31px] font-bold tracking-[-0.045em] text-white lg:text-[38px]">
                {activeLensMeta.title}
              </h2>

              <p className="mt-2 max-w-[720px] text-[11px] leading-[1.6] text-white/68">
                {activeLensMeta.question}
              </p>

              <p className="mt-4 text-[10px] font-semibold text-white/90">
                {entity.title}
              </p>

            </div>

          </header>


          {/* TRANSPARENCY STRIP */}

          <div className="grid border-b border-slate-200 bg-[#fbfcfd] sm:grid-cols-2 xl:grid-cols-5">

            {[
              {
                label: "Data Inputs",
                value:
                  `${media.length} media + Record`,
              },
              {
                label: "Evidence",
                value:
                  `${sources.length} source${sources.length === 1 ? "" : "s"}`,
              },
              {
                label: "Confidence",
                value:
                  "Not numerically scored",
              },
              {
                label: "Method",
                value:
                  "Evidence-led",
              },
              {
                label: "Review",
                value:
                  lensReviewLabel,
              },
            ].map(
              (item) => (

                <div
                  key={item.label}
                  className="border-r border-t border-slate-200 px-4 py-3 first:border-t-0 sm:first:border-t"
                >

                  <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-1 text-[9px] font-semibold text-slate-700">
                    {item.value}
                  </p>

                </div>

              )
            )}

          </div>


          <section
            className={
              lensActiveView === "anatomy"
                ? "px-6 py-3 lg:px-7"
                : "px-6 py-6 lg:px-9"
            }
          >

            {/* 01 · PROJECT ANATOMY */}

            {lensActiveView ===
            "anatomy" ? (

              <div className="min-h-0">

                <div className="flex items-end justify-between gap-5">

                  <div className="min-w-0 max-w-[760px]">

                    <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-blue-700">
                      PROJECT X-RAY
                    </p>

                    <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">

                      <h3 className="text-[19px] font-bold tracking-[-0.035em] text-slate-950">
                        How the project is put together
                      </h3>

                      <span className="text-[8px] font-semibold text-slate-400">
                        Record → Evidence → Lens interpretation
                      </span>

                    </div>

                    <p className="mt-1 max-w-[760px] text-[9px] leading-[1.45] text-slate-500">
                      Six coordinated readings expose context, spatial logic, technical assembly, dependencies, performance implications and transferable intelligence.
                    </p>

                  </div>


                  <div className="hidden shrink-0 items-center gap-1.5 xl:flex">

                    {[
                      {
                        value:
                          validSources.length,
                        label:
                          "sources",
                      },
                      {
                        value:
                          media.length,
                        label:
                          "media",
                      },
                      {
                        value:
                          documents.length,
                        label:
                          "documents",
                      },
                    ].map(
                      (item) => (

                        <div
                          key={item.label}
                          className="min-w-[62px] rounded-[9px] border border-slate-200 bg-[#f8fafc] px-2 py-1.5 text-center"
                        >

                          <p className="text-[12px] font-bold tabular-nums text-slate-950">
                            {item.value}
                          </p>

                          <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            {item.label}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>


                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">

                  {anatomyReadings.map(
                    (
                      item,
                      index
                    ) => {

                      const documented =
                        item.text !==
                        notDocumented;

                      return (

                        <article
                          key={item.label}
                          className="group flex min-h-[108px] min-w-0 flex-col rounded-[12px] border border-slate-200 bg-white px-3.5 py-3 transition hover:border-blue-200 hover:shadow-[0_6px_18px_rgba(15,23,42,.05)]"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-2">

                              <span className="text-[7px] font-bold tabular-nums text-blue-600">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <span className="truncate text-[6px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                {item.signal}
                              </span>

                            </div>


                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                documented
                                  ? "bg-emerald-500"
                                  : "border border-slate-300 bg-white"
                              }`}
                              title={
                                documented
                                  ? "Documented Lens reading"
                                  : "Not sufficiently documented"
                              }
                            />

                          </div>


                          <h4 className="mt-1.5 text-[11px] font-bold leading-[1.2] text-slate-900">
                            {item.label}
                          </h4>


                          <p
                            title={item.text}
                            className="mt-1.5 max-h-[50px] overflow-hidden text-[8.5px] leading-[1.45] text-slate-600"
                          >
                            {item.text}
                          </p>


                          <div className="mt-auto pt-2">

                            <span className="text-[6px] font-bold uppercase tracking-[0.12em] text-blue-600 opacity-70 transition group-hover:opacity-100">
                              Lens interpretation
                            </span>

                          </div>

                        </article>

                      );
                    }
                  )}

                </div>


                <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200 pt-2">

                  <p className="text-[7px] leading-[1.4] text-slate-400">
                    Lens interpretation remains distinct from the verified factual Record.
                  </p>

                  <span className="shrink-0 text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Evidence-led · No synthetic score
                  </span>

                </div>

              </div>

            ) : null}


            {lensActiveView ===
            "forensics" ? (

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  CAUSAL READING
                </p>

                <h3 className="mt-1.5 text-[22px] font-bold tracking-[-0.035em] text-slate-950">
                  Driver → decision → consequence
                </h3>


                <div className="mt-5 grid gap-2">

                  {forensicReadings.map(
                    (item, index) => (

                      <article
                        key={item.label}
                        className="grid gap-3 rounded-[15px] border border-slate-200 bg-white px-4 py-4 md:grid-cols-[50px_180px_minmax(0,1fr)]"
                      >

                        <span className="text-[9px] font-bold text-blue-600">
                          0{index + 1}
                        </span>

                        <h4 className="text-[11px] font-bold text-slate-900">
                          {item.label}
                        </h4>

                        <p className="text-[10px] leading-[1.6] text-slate-600">
                          {item.text}
                        </p>

                      </article>

                    )
                  )}

                </div>

              </div>

            ) : null}


            {/* 03 · SYSTEMS / PERFORMANCE / RISK */}

            {lensActiveView ===
            "systems" ? (

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  SYSTEM DIAGNOSIS
                </p>

                <h3 className="mt-1.5 text-[22px] font-bold tracking-[-0.035em] text-slate-950">
                  Performance, dependency and exposure
                </h3>


                <div className="mt-5 grid gap-3 lg:grid-cols-2">

                  {systemReadings.map(
                    (item) => (

                      <article
                        key={item.label}
                        className="rounded-[16px] border border-slate-200 bg-[#fbfcfd] p-4"
                      >

                        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          {item.label}
                        </p>

                        <p className="mt-2 text-[10.5px] leading-[1.65] text-slate-700">
                          {item.text}
                        </p>

                      </article>

                    )
                  )}

                </div>

              </div>

            ) : null}


            {/* 04 · CONNECTED INTELLIGENCE */}

            {lensActiveView ===
            "connected" ? (

              <div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                      KNOWLEDGE GRAPH
                    </p>

                    <h3 className="mt-1.5 text-[22px] font-bold tracking-[-0.035em] text-slate-950">
                      Connected Built World
                    </h3>

                  </div>

                  <span className="text-[9px] font-semibold text-slate-400">
                    {verifiedConnections.length} verified direct relationship{verifiedConnections.length === 1 ? "" : "s"}
                  </span>

                </div>


                {verifiedConnections.length >
                0 ? (

                  <div className="mt-5 grid gap-3 md:grid-cols-2">

                    {verifiedConnections
                      .slice(0, 8)
                      .map(
                        (
                          item,
                          index
                        ) => (

                          <article
                            key={`${item.title}-${index}`}
                            className="rounded-[16px] border border-slate-200 bg-white p-4"
                          >

                            <div className="flex items-start gap-3">

                              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[8px] font-bold text-blue-700">
                                0{index + 1}
                              </span>

                              <div>

                                <h4 className="text-[12px] font-bold text-slate-900">
                                  {item.title}
                                </h4>

                                <p className="mt-1.5 text-[9.5px] leading-[1.55] text-slate-500">
                                  {item.description ||
                                    "Recorded project relationship"}
                                </p>

                              </div>

                            </div>

                          </article>

                        )
                      )}

                  </div>

                ) : (

                  <div className="mt-5 rounded-[16px] border border-dashed border-slate-300 bg-slate-50 p-5">

                    <p className="text-[10px] font-semibold text-slate-700">
                      No verified direct relationships are recorded yet.
                    </p>

                    <p className="mt-1 text-[9px] leading-[1.5] text-slate-500">
                      Arknoz will not manufacture connections merely to make the graph appear fuller.
                    </p>

                  </div>

                )}

              </div>

            ) : null}


            {/* 05 · ADAPTATION LAB */}

            {lensActiveView ===
            "adaptation" ? (

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8a3f69]">
                  INTERACTIVE PROJECT TOOL
                </p>

                <h3 className="mt-1.5 text-[22px] font-bold tracking-[-0.035em] text-slate-950">
                  Can this project logic work for me?
                </h3>

                <p className="mt-2 max-w-[780px] text-[10px] leading-[1.6] text-slate-500">
                  Adaptation Lab tests design logic rather than encouraging direct copying. No compatibility score is shown until sufficient project and user inputs exist.
                </p>


                <div className="mt-5 grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">

                  <div className="grid gap-1.5">

                    {adaptationTools.map(
                      (tool) => {

                        const active =
                          adaptationTool ===
                          tool.id;

                        return (

                          <button
                            key={tool.id}
                            type="button"
                            onClick={() =>
                              setAdaptationTool(
                                tool.id
                              )
                            }
                            className={`cursor-pointer rounded-[11px] px-3 py-2.5 text-left text-[9.5px] font-semibold transition ${
                              active
                                ? "bg-[#8a3f69] text-white"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {tool.label}
                          </button>

                        );
                      }
                    )}

                  </div>


                  <article className="rounded-[18px] border border-[#e5d8df] bg-[linear-gradient(135deg,#fff_0%,#fcf6f9_100%)] p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#8a3f69]">
                          {activeAdaptationTool.label}
                        </p>

                        <h4 className="mt-1.5 text-[18px] font-bold tracking-[-0.025em] text-slate-950">
                          Input required
                        </h4>

                      </div>

                      <span className="rounded-full bg-white px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.13em] text-slate-500 ring-1 ring-slate-200">
                        No fake score
                      </span>

                    </div>

                    <p className="mt-4 max-w-[660px] text-[11px] font-semibold leading-[1.55] text-slate-800">
                      {activeAdaptationTool.question}
                    </p>

                    <div className="mt-4 rounded-[12px] border border-dashed border-[#d9bdcc] bg-white/70 p-4">

                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Required next input
                      </p>

                      <p className="mt-1.5 text-[10px] text-slate-600">
                        {activeAdaptationTool.input}
                      </p>

                    </div>

                  </article>

                </div>

              </div>

            ) : null}


            {/* 06 · BENCHMARK + DECISION INTELLIGENCE */}

            {lensActiveView ===
            "benchmark" ? (

              <div>

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  COMPARISON → DECISION
                </p>

                <h3 className="mt-1.5 text-[22px] font-bold tracking-[-0.035em] text-slate-950">
                  Benchmark & Decision Intelligence
                </h3>

                <p className="mt-2 max-w-[780px] text-[10px] leading-[1.6] text-slate-500">
                  Numerical ranking is not manufactured. A benchmark requires an explicit and defensible comparison cohort.
                </p>


                <div className="mt-5 rounded-[14px] border border-amber-200 bg-amber-50/50 px-4 py-3">

                  <div className="flex items-center justify-between gap-4">

                    <p className="text-[9px] font-bold text-amber-900">
                      Cohort status
                    </p>

                    <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                      Not yet computed
                    </span>

                  </div>

                </div>


                <div className="mt-4 grid gap-3 md:grid-cols-2">

                  {lensSynthesisGroups.map(
                    (group) => (

                      <article
                        key={group.title}
                        className="rounded-[16px] border border-slate-200 bg-white p-4"
                      >

                        <h4 className="text-[11px] font-bold text-slate-900">
                          {group.title}
                        </h4>

                        {group.items.length >
                        0 ? (

                          <div className="mt-3 grid gap-2">

                            {group.items.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  key={`${group.title}-${index}`}
                                  className="grid grid-cols-[22px_minmax(0,1fr)] gap-2"
                                >

                                  <span className="text-[8px] font-bold text-blue-500">
                                    0{index + 1}
                                  </span>

                                  <p className="text-[9.5px] leading-[1.5] text-slate-600">
                                    {item}
                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        ) : (

                          <p className="mt-2 text-[9px] text-slate-400">
                            {notDocumented}
                          </p>

                        )}

                      </article>

                    )
                  )}

                </div>


                {lensReviewBasis?.note ? (

                  <div className="mt-4 border-t border-slate-200 pt-4">

                    <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-slate-400">
                      Evidence limitation
                    </p>

                    <p className="mt-1.5 text-[9.5px] leading-[1.55] text-slate-500">
                      {lensReviewBasis.note}
                    </p>

                  </div>

                ) : null}

              </div>

            ) : null}

          </section>

        </main>

      </article>

    </div>

  );

  const intelligenceModuleTitles = [
    "Connected Context",
    "Benchmark",
    "Compare",
    "Strategic Read",
  ] as const;


  type IntelligenceModuleTitle =
    (typeof intelligenceModuleTitles)[number];


  const intelligenceCopy: Record<
    IntelligenceModuleTitle,
    {
      number: string;
      question: string;
      text: string;
      signal: string;
    }
  > = {

    "Connected Context": {
      number: "01",

      question:
        "What is this project connected to?",

      text:
        "Maps meaningful relationships across projects, people, organisations, places, knowledge, heritage and technical systems.",

      signal:
        "Relationship graph",
    },


    Benchmark: {
      number: "02",

      question:
        "Where does this project sit relative to a valid cohort?",

      text:
        "Positions the project across Arknoz universal intelligence dimensions using comparable structured project data.",

      signal:
        "Cohort position",
    },


    Compare: {
      number: "03",

      question:
        "How does this project differ from selected peers?",

      text:
        "Compares the project against up to three valid peers to reveal similarities, differences and consequential trade-offs.",

      signal:
        "Peer comparison",
    },


    "Strategic Read": {
      number: "04",

      question:
        "What does the combined intelligence mean?",

      text:
        "Synthesises patterns, advantages, exposures and implications from the Record, Lens, connections and comparative evidence.",

      signal:
        "Decision intelligence",
    },
  };


  const intelligenceModules =
    intelligenceModuleTitles.map(
      (title) => ({
        title,

        ...intelligenceCopy[
          title
        ],
      })
    );


  const intelligence = (

    <section className="overflow-hidden rounded-[22px] border border-[#e8dfe5] bg-white lg:h-[calc(100svh-238px)] lg:min-h-[540px]">

      <div className="flex h-full min-h-0 flex-col">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="shrink-0 border-b border-[#eadfe5] bg-[linear-gradient(90deg,#fff_0%,#fcf7f9_100%)] px-7 py-3 lg:px-9">

          <div className="flex items-end justify-between gap-8">

            <div>

              <div className="flex items-center gap-3">

                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8c3c6b]">
                  Arknoz Pro
                </p>

                <span className="text-[8px] text-slate-300">
                  /
                </span>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Project Intelligence
                </p>

              </div>


              <h2 className="mt-1 text-[27px] font-bold tracking-[-0.04em] text-slate-950">
                {entity.title}
              </h2>

            </div>


            <div className="flex items-center gap-2">

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfc7d4] px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-[#8c3c6b]">
                <LockIcon />
                Available with Pro
              </span>

              <span className="rounded-full bg-[#f8eaf1] px-3 py-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-[#9b4f77]">
                Coming Soon
              </span>

            </div>

          </div>

        </header>


        {/* ==================================================
            BODY
        ================================================== */}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[330px_minmax(0,1fr)]">

          {/* ==================================================
              LEFT · INTELLIGENCE PIPELINE
          ================================================== */}

          <aside className="flex min-h-0 flex-col border-r border-[#eadfe5] bg-[#6f214e] px-5 py-4 text-white">

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/55">
              Intelligence Model
            </p>


            <h3 className="mt-1.5 max-w-[14ch] text-[24px] font-bold leading-[1.02] tracking-[-0.04em]">
              Evidence becomes decision intelligence.
            </h3>


            <p className="mt-3 max-w-[36ch] text-[9px] leading-[1.6] text-white/70">
              Arknoz Pro extends the verified project Record and Arknoz Lens with relationships, comparative data and structured project intelligence.
            </p>


            <div className="mt-3.5">

              {[
                {
                  number: "01",
                  title: "Record",
                  note: "Verified project evidence",
                },
                {
                  number: "02",
                  title: "Lens",
                  note: "Critical interpretation",
                },
                {
                  number: "03",
                  title: "Data Layer",
                  note: "Entity graph + comparison corpus",
                },
                {
                  number: "04",
                  title: "Intelligence",
                  note: "Connect + compare + evaluate",
                },
              ].map(
                (
                  step,
                  index
                ) => (

                  <div
                    key={step.title}
                    className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3 border-t border-white/15 py-2 first:border-t-0"
                  >

                    <span className="text-[8px] font-bold text-white/45">
                      {step.number}
                    </span>


                    <div>

                      <p className="text-[10px] font-semibold">
                        {step.title}
                      </p>

                      <p className="mt-0.5 text-[7.5px] leading-[1.4] text-white/50">
                        {step.note}
                      </p>

                    </div>


                    {index < 3 ? (

                      <span className="absolute bottom-[-6px] left-[7px] z-10 text-[10px] text-white/25">
                        ↓
                      </span>

                    ) : null}

                  </div>

                )
              )}

            </div>


            <div className="mt-auto border-t border-white/15 pt-2.5">

              <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-white/45">
                Core Rule
              </p>

              <p className="mt-1 text-[8px] leading-[1.4] text-white/65">
                Intelligence is derived from verified evidence, explicit relationships and calculated comparisons. Unsupported findings are not presented as established.
              </p>

            </div>

          </aside>


          {/* ==================================================
              RIGHT · UNIVERSAL INTELLIGENCE FRAMEWORK
          ================================================== */}

          <main className="flex min-h-0 flex-col px-6 py-4 lg:px-8">

            <div className="flex shrink-0 items-end justify-between gap-8">

              <div>

                <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#8c3c6b]">
                  Advanced Project Intelligence
                </p>

                <h3 className="mt-1 text-[21px] font-bold tracking-[-0.035em] text-slate-950">
                  A deeper intelligence layer
                </h3>

              </div>


              <p className="hidden max-w-[520px] text-right text-[8.5px] leading-[1.45] text-slate-400 xl:block">
                Connected context, benchmarking, peer comparison and strategic insight for deeper project understanding and decision-making.
              </p>

            </div>


            {/* FOUR MODULES */}

            <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2.5">

              {intelligenceModules.map(
                (module) => (

                  <article
                    key={module.title}
                    className="group flex min-h-0 flex-col rounded-[16px] border border-slate-200 bg-white px-4 py-3 transition hover:border-[#d8b7c8] hover:shadow-[0_8px_24px_rgba(64,24,49,0.05)]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <span className="text-[8px] font-bold tracking-[0.17em] text-[#9c4e76]">
                        {module.number}
                      </span>

                      <span className="rounded-full bg-[#f7fbf9] px-2 py-1 text-[6.5px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                        Coming Soon
                      </span>

                    </div>


                    <h4 className="mt-2 text-[17px] font-bold tracking-[-0.025em] text-slate-950">
                      {module.title}
                    </h4>


                    <p className="mt-1 text-[9.5px] font-semibold leading-[1.4] text-slate-700">
                      {module.question}
                    </p>


                    <p className="mt-1.5 max-w-[48ch] text-[8px] leading-[1.55] text-slate-500">
                      {module.text}
                    </p>


                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">

                      <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        {module.signal}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.12em] text-[#9c4e76]">
                        <LockIcon />
                        Available with Pro
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>


            {/* ==================================================
                INTELLIGENCE BASIS
            ================================================== */}

            <footer className="mt-2 shrink-0 rounded-[13px] border border-slate-200 bg-slate-50/65 px-4 py-2">

              <div className="grid items-center gap-4 lg:grid-cols-[150px_repeat(4,minmax(0,1fr))]">

                <div>

                  <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#8c3c6b]">
                    Intelligence Basis
                  </p>

                  <p className="mt-0.5 text-[7.5px] text-slate-400">
                    Transparency layer
                  </p>

                </div>


                {[
                  {
                    label: "Evidence",
                    value: "Claim-linked",
                  },
                  {
                    label: "Confidence",
                    value: "4 levels",
                  },
                  {
                    label: "Benchmark",
                    value: "Explicit cohort",
                  },
                  {
                    label: "Method",
                    value: "Evidence-led",
                  },
                ].map(
                  (item) => (

                    <div
                      key={item.label}
                      className="border-l border-slate-200 pl-4"
                    >

                      <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-slate-400">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[9px] font-semibold text-slate-700">
                        {item.value}
                      </p>

                    </div>

                  )
                )}

              </div>

            </footer>

          </main>

        </div>

      </div>

    </section>

  );

  // =========================================================
  // PROJECT 26 ACCESS GATES
  //
  // Representative UI only.
  // Protected content has already been removed server-side.
  // =========================================================

  /*
   * =========================================================
   * PROJECT 26 — PUBLIC PROJECT PROFILE GROUPS
   *
   * Uses only the canonical publication-safe publicProfile.
   *
   * No Overview facts.
   * No label guessing.
   * No protected structuredRecord.
   * =========================================================
   */

  const publicProfileCommissionPurposeItems =
    publicProjectProfile.filter(
      (item) =>
        item.role === "commission" ||
        item.role === "purpose" ||
        item.role === "team"
    );


  const publicProfileProgrammeScaleItems =
    publicProjectProfile.filter(
      (item) =>
        item.role === "programme" ||
        item.role === "scale"
    );


  const publicProfileDevelopmentItems =
    publicProjectProfile.filter(
      (item) =>
        item.role === "development"
    );


  const publicProfileStatusRecognitionItems =
    publicProjectProfile.filter(
      (item) =>
        item.role === "status" ||
        item.role === "recognition"
    );


  const publicProfileOtherItems =
    publicProjectProfile.filter(
      (item) =>
        item.role === "other"
    );


  const publicProjectProfileGroups =
    [
      {
        label:
          "Commission & Purpose",
        caption:
          "Client · Architect · Project team · Original programme",
        items:
          publicProfileCommissionPurposeItems,
      },
      {
        label:
          "Programme & Scale",
        caption:
          "Use · Capacity · Area · Measurable profile",
        items:
          publicProfileProgrammeScaleItems,
      },
      {
        label:
          "Development",
        caption:
          "Design · Construction · Major project stages",
        items:
          publicProfileDevelopmentItems,
      },
      {
        label:
          "Status & Recognition",
        caption:
          "Current status · Heritage · Designation",
        items:
          publicProfileStatusRecognitionItems,
      },
      {
        label:
          "Additional Record",
        caption:
          "Other publication-relevant project information",
        items:
          publicProfileOtherItems,
      },
    ].filter(
      (group) =>
        group.items.length > 0
    );

  type PublicLockedRecordChapter =
    | "design"
    | "media";


  const [
    publicRecordGateChapter,
    setPublicRecordGateChapter,
  ] =
    useState<
      PublicLockedRecordChapter | null
    >(null);

  const publicRecordGateSections: {
    id: PublicLockedRecordChapter;
    number: string;
    label: string;
    subtitle: string;
    description: string;
    benefits: string[];
  }[] = [
    {
      id: "design",
      number: "02",
      label: "Design & Systems",
      subtitle: "Spatial · Technical · Material",
      description:
        "Open the project's spatial organisation, design resolution, structure, materials, envelope and building systems.",
      benefits: [
        "Planning and spatial organisation",
        "Design and site relationship",
        "Structure, materials and envelope",
        "Building systems and technical record",
      ],
    },
    {
      id: "media",
      number: "03",
      label: "Delivery, Evidence & Documentation",
      subtitle: "Sources · Media · Drawings · Documents",
      description:
        "Open the evidence base supporting this Project Record — sources, photographs, drawings, documents and provenance.",
      benefits: [
        "Sources and references",
        "Photographs and visual evidence",
        "Drawings and project files",
        "Documentation and provenance",
      ],
    },
  ];

  const selectedPublicRecordGate =
    publicRecordGateSections.find(
      (section) =>
        section.id ===
        publicRecordGateChapter
    ) ??
    null;


  const recordAccessGate = (

    <div className="space-y-2 pb-3">




      {/* ==================================================
          RECORD WORKSPACE
      ================================================== */}

      <section>

        <article className="grid min-h-[540px] rounded-[18px] border border-slate-200/90 bg-white shadow-[0_14px_38px_rgba(15,23,42,.08)] ring-1 ring-slate-950/[0.02] lg:h-[calc(100svh-235px)] lg:min-h-0 lg:grid-cols-[305px_minmax(0,1fr)]">

          {/* ================================================
              LEFT RECORD INDEX
          ================================================ */}

          <aside className="flex flex-col border-b border-slate-200 bg-gradient-to-b from-[#f4f8fc] via-[#f8fafc] to-white lg:border-b-0 lg:border-r">

            <figure className="relative h-[150px] overflow-hidden border-b border-slate-200 bg-slate-200">

              {media[0]?.src ? (

                <img
                  src={media[0].src}
                  alt={entity.title}
                  className="h-full w-full object-cover"
                />

              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071a2d]/75 via-[#071a2d]/20 to-transparent" />

              <div className="absolute inset-x-3 bottom-3">

                <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-white/70">
                  PROJECT RECORD
                </p>

                <h3 className="mt-0.5 text-[13px] font-bold text-white">
                  Record Sections
                </h3>

              </div>

            </figure>


            <nav
              aria-label="Project Record sections"
              className="grid content-start gap-1.5 p-2.5"
            >

              {/* 01 — PUBLIC */}

              <button
                type="button"
                onClick={() =>
                  setPublicRecordGateChapter(
                    null
                  )
                }
                className={`group flex cursor-pointer items-center justify-between gap-3 rounded-[11px] border px-3.5 py-2.5 text-left outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                  !selectedPublicRecordGate
                    ? "border-[#0b2949] bg-[#0b2949] text-white shadow-[0_6px_16px_rgba(11,41,73,.22)] ring-1 ring-[#0b2949]/10"
                    : "border-transparent text-slate-600 hover:-translate-y-[1px] hover:border-blue-100 hover:bg-white hover:text-[#0b2949] hover:shadow-sm"
                }`}
              >

                <span className="flex min-w-0 items-center gap-2">

                  <span
                    className={`text-[7px] font-bold tabular-nums ${
                      !selectedPublicRecordGate
                        ? "text-blue-200"
                        : "text-slate-300"
                    }`}
                  >
                    01
                  </span>

                  <span className="min-w-0">

                    <span className="block text-[11px] font-bold leading-[1.2]">
                      Project Profile
                    </span>

                    <span
                      className={`mt-1 block text-[9px] leading-[1.45] ${
                        !selectedPublicRecordGate
                          ? "text-blue-100/75"
                          : "text-slate-400"
                      }`}
                    >
                      Identity · Programme · Status · Timeline
                    </span>

                  </span>

                </span>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.07em] ${
                    !selectedPublicRecordGate
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  Open
                </span>

              </button>


              {/* 02–03 — ARKNOZ ID */}

              {publicRecordGateSections.map(
                (section) => {

                  const active =
                    selectedPublicRecordGate
                      ?.id === section.id;

                  return (

                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        setPublicRecordGateChapter(
                          section.id
                        )
                      }
                      aria-pressed={active}
                      className={`group flex cursor-pointer items-center justify-between gap-3 rounded-[11px] border px-3.5 py-2.5 text-left outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/30 ${
                        active
                          ? "border-blue-200 bg-blue-50 text-[#0b2949] shadow-[0_5px_14px_rgba(15,23,42,.05)]"
                          : "border-transparent text-slate-600 hover:-translate-y-[1px] hover:border-blue-100 hover:bg-white hover:text-[#0b2949] hover:shadow-sm"
                      }`}
                    >

                      <span className="flex min-w-0 items-center gap-2">

                        <span
                          className={`text-[7px] font-bold tabular-nums ${
                            active
                              ? "text-blue-600"
                              : "text-slate-300"
                          }`}
                        >
                          {section.number}
                        </span>

                        <span className="min-w-0">

                          <span className="block text-[11px] font-bold leading-[1.2]">
                            {section.label}
                          </span>

                          <span
                            className={`mt-1 block text-[9px] leading-[1.45] ${
                              active
                                ? "text-blue-700/65"
                                : "text-slate-400"
                            }`}
                          >
                            {section.subtitle}
                          </span>

                        </span>

                      </span>

                      <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.07em] ${
                            recordAccessMode === "full"
                              ? active
                                ? "border-emerald-200 bg-white text-emerald-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : active
                                ? "border-blue-200 bg-white text-blue-700"
                                : "border-slate-200 bg-white text-slate-400"
                          }`}
                        >
                          {recordAccessMode === "full" ? (
                            <>Open</>
                          ) : (
                            <>
                              <LockIcon />
                              ID
                            </>
                          )}
                        </span>

                    </button>

                  );
                }
              )}

            </nav>


            <div className="mt-auto border-t border-slate-200 px-3 py-2">

              {recordAccessMode === "full" ? (

                <>
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                    Arknoz ID
                  </p>

                  <p className="mt-1.5 text-[9.5px] leading-[1.5] text-slate-600">
                    Project Record access active.
                  </p>
                </>

              ) : (

                <>
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                    Arknoz ID is free
                  </p>

                  <p className="mt-1.5 text-[9.5px] leading-[1.5] text-slate-600">
                    Sections 02–03 unlock after free Arknoz ID sign-in.
                  </p>
                </>

              )}

            </div>

          </aside>


          {/* ================================================
              RIGHT PAGE
          ================================================ */}

          {selectedPublicRecordGate ? (

            /*
             * ARKNOZ ID — UNIFIED RECORD CONTENT
             *
             * Same Record shell for every audience.
             * Access changes content availability only.
             */

            recordAccessMode === "full" ? (

              selectedPublicRecordGate.id === "design" ? (

                /* ============================================
                    02 — DESIGN & SYSTEMS
                ============================================ */

                <section className="min-w-0 bg-white pb-2">

                  {/* ============================================
                      02 · DESIGN & SYSTEMS
                  ============================================ */}

                  <header className="border-b border-slate-200 bg-white px-6 py-2 lg:px-7">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2.5">

                          <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-blue-700">
                            02 · Design &amp; Systems
                          </p>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-emerald-700">

                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            />

                            Arknoz ID

                          </span>

                        </div>


                        <h3 className="mt-2 font-serif text-[29px] font-bold leading-none tracking-[-0.035em] text-slate-950 lg:text-[32px]">
                          Design &amp; Systems
                        </h3>

                        <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                          Spatial · Technical · Material
                        </p>

                      </div>


                      <div className="shrink-0 lg:text-right">

                        <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Project
                        </p>

                        <p className="mt-1 font-serif text-[15px] font-bold text-slate-950">
                          {entity.title}
                        </p>


                        <button
                          type="button"
                          onClick={() =>
                            setPublicRecordGateChapter(
                              "media"
                            )
                          }
                          className="group mt-2 inline-flex cursor-pointer items-center gap-2 border-t border-slate-300 pt-2 text-[7.5px] font-bold uppercase tracking-[0.12em] text-blue-700 transition hover:text-[#0b2949]"
                        >
                          Sources &amp; Evidence

                          <span
                            aria-hidden="true"
                            className="text-[11px] transition group-hover:translate-x-0.5"
                          >
                            →
                          </span>

                        </button>

                      </div>

                    </div>

                  </header>


                  <div className="px-6 py-1.5 lg:px-7">


                    {/* ============================================
                        EDITORIAL LEAD
                    ============================================ */}

                    <div className="mb-2 grid border-y border-slate-200 bg-[linear-gradient(120deg,#f5f8fc_0%,#ffffff_64%,#f8fafc_100%)] lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]">

                      <div className="px-5 py-1.5 lg:px-6">

                        <p className="text-[6.5px] font-bold uppercase tracking-[0.18em] text-blue-700">
                          DESIGN NARRATIVE
                        </p>

                        <p className="mt-1 max-w-[800px] font-serif text-[14px] leading-[1.28] tracking-[-0.01em] text-slate-800 lg:text-[15px]">
                          {selectedPublicRecordGate.description}
                        </p>

                      </div>


                      <div className="border-t border-slate-200 px-5 py-1.5 lg:border-l lg:border-t-0 lg:px-6">

                        <p className="text-[6.5px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          PROJECT SIGNAL
                        </p>

                        <p className="mt-1 font-serif text-[11.5px] italic leading-[1.3] text-slate-700">
                          {designSystemGroups[0]?.items[0]?.text ??
                            selectedPublicRecordGate.description}
                        </p>

                      </div>

                    </div>


                    {/* ============================================
                        ONE-SCREEN DESIGN RECORD
                    ============================================ */}

                    {designSystemGroups.length > 0 ? (

                      <div className="grid gap-x-5 gap-y-1.5 xl:grid-cols-3">

                        {designSystemGroups
                          .filter(
                            (group) =>
                              group.id === "spatial" ||
                              group.id === "site" ||
                              group.id === "structure" ||
                              group.id === "materials" || group.id === "systems"
                          )
                          .map(
                            (
                              group
                            ) => (

                              <section
                                key={group.id}
                                className="border-t border-slate-900 pt-1"
                              >

                                <div className="flex items-start justify-between gap-4">

                                  <div className="min-w-0">

                                    <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-blue-700">
                                      {group.index}
                                    </p>

                                    <h4 className="mt-0.5 font-serif text-[16px] font-bold leading-none tracking-[-0.018em] text-slate-950">
                                      {group.label}
                                    </h4>

                                    <p className="mt-0.5 text-[6px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                      {group.caption}
                                    </p>

                                  </div>


                                  <span className="shrink-0 pt-0.5 text-[6.5px] font-semibold text-slate-400">
                                    {group.items.length} recorded
                                  </span>

                                </div>


                                <div className="mt-1 divide-y divide-slate-200 border-y border-slate-300">

                                  {group.items.map(
                                    (
                                      item,
                                      index
                                    ) => (

                                      <article
                                        key={`${group.id}-${item.title}-${item.text}-${index}`}
                                        className="grid grid-cols-[20px_105px_minmax(0,1fr)] items-start gap-x-2 py-0.5"
                                      >

                                        <span className="mt-0.5 inline-flex h-[17px] w-[17px] items-center justify-center rounded-full bg-blue-50 text-[5.5px] font-bold tabular-nums text-blue-700">
                                          {String(
                                            index + 1
                                          ).padStart(
                                            2,
                                            "0"
                                          )}
                                        </span>


                                        <div className="min-w-0">

                                          {item.href ? (

                                            <a
                                              href={item.href}
                                              className="cursor-pointer text-[7px] font-bold uppercase tracking-[0.05em] leading-[1.25] text-blue-700 transition hover:text-[#0b2949]"
                                            >
                                              {item.title}
                                            </a>

                                          ) : (

                                            <p className="text-[7px] font-bold uppercase tracking-[0.05em] leading-[1.25] text-slate-600">
                                              {item.title}
                                            </p>

                                          )}

                                        </div>


                                        <p className="min-w-0 text-[8.5px] leading-[1.22] text-slate-800">
                                          {item.text}
                                        </p>

                                      </article>

                                    )
                                  )}

                                </div>

                              </section>

                            )
                          )}

                      </div>

                    ) : (

                      <div className="border-y border-slate-200 py-6">

                        <p className="font-serif text-[16px] font-bold text-slate-900">
                          Design &amp; Systems information is not yet recorded.
                        </p>

                      </div>

                    )}



                  </div>

</section>

              ) : (

                /* ============================================
                    03 — EVIDENCE & DOCUMENTATION
                    Initial unified-shell view.
                ============================================ */

                <section className="min-w-0 bg-white pb-2 lg:pb-2">

                  <header className="border-b border-slate-200 bg-white px-6 py-2 lg:px-7">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-2.5">

                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                            03 · Delivery, Evidence &amp; Documentation
                          </p>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            />
                            Arknoz ID
                          </span>

                        </div>

                        <h3 className="mt-2 text-[27px] font-bold leading-none tracking-[-0.04em] text-slate-950 lg:text-[31px]">
                          Delivery, Evidence &amp; Documentation
                        </h3>

                        <p className="mt-1.5 text-[8.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          Delivery · Sources · Media · Drawings · Documents
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={(event) => {
                          recordLibraryTriggerRef.current =
                            event.currentTarget;

                          setRecordLibraryOpen(
                            true
                          );
                        }}
                        className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[9px] bg-[#0b2949] px-3.5 py-2 text-[8px] font-bold text-white transition hover:-translate-y-[1px] hover:bg-[#123a66]"
                      >
                        Open project library
                      </button>

                    </div>

                  </header>

                  {/* ==================================================
                      PROJECT26 RECORD 03 DELIVERY
                      Canonical structured delivery evidence.
                      Hidden automatically when no delivery data exists.
                  ================================================== */}

                  {deliveryDisplayItems.length > 0 ? (

                    <section className="border-b border-slate-200 bg-[#f8fafc] px-6 py-2.5 lg:px-7">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                            Delivery Record
                          </p>

                          <h4 className="mt-1 text-[16px] font-bold text-slate-950">
                            Project delivery
                          </h4>

                          <p className="mt-1 text-[9px] text-slate-500">
                            Procurement, construction and delivery information
                          </p>

                        </div>

                        <span className="text-[9px] font-semibold text-slate-400">
                          {deliveryDisplayItems.length} recorded
                        </span>

                      </div>

                      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">

                        {deliveryDisplayItems.map(
                          (item, index) => (

                            <article
                              key={`record03-delivery-${item.title}-${index}`}
                              className="rounded-[11px] border border-slate-200 bg-white px-3 py-2"
                            >

                              <p className="text-[9px] font-bold text-slate-900">
                                {item.title}
                              </p>

                              <p className="mt-1 text-[9px] leading-[1.5] text-slate-600">
                                {item.text}
                              </p>

                            </article>

                          )
                        )}

                      </div>

                    </section>

                  ) : null}



                  {/* ==================================================
                      PUBLIC RECORD 03 DIALOG BUNDLE
                      Reuses canonical media viewer + project library.
                  ================================================== */}

{recordMediaPreview !== null &&
            media[recordMediaPreview] ? (

              <div
                ref={recordMediaDialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Project media preview"
                tabIndex={-1}
                onClick={closeRecordMediaPreview}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-[3px] sm:p-5"
              >

                <div
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  className="relative w-full max-w-[1320px] overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-2xl"
                >

                  {/* CLOSE */}

                  <button
                    type="button"
                    onClick={closeRecordMediaPreview}
                    autoFocus
                    aria-label="Close image"
                    className="cursor-pointer absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-[20px] font-semibold leading-none text-white shadow-lg ring-1 ring-white/15 backdrop-blur transition hover:bg-slate-950/90"
                  >
                    ×
                  </button>


                  {/* IMAGE */}

                  <div className="relative flex min-h-[420px] max-h-[80vh] items-center justify-center bg-[#0b1118] p-4 sm:p-6">

                    <img
                      src={
                        media[
                          recordMediaPreview
                        ].src
                      }
                      alt={
                        media[
                          recordMediaPreview
                        ].alt ??
                        entity.title
                      }
                      className="max-h-[74vh] max-w-full object-contain"
                    />


                    {/* PREVIOUS */}

                    {media.length > 1 ? (

                      <button
                        type="button"
                        onClick={() =>
                          setRecordMediaPreview(
                            (
                              recordMediaPreview -
                              1 +
                              media.length
                            ) %
                              media.length
                          )
                        }
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/65 text-[25px] font-medium text-white shadow-lg ring-1 ring-white/15 backdrop-blur transition hover:bg-slate-950/90"
                      >
                        ‹
                      </button>

                    ) : null}


                    {/* NEXT */}

                    {media.length > 1 ? (

                      <button
                        type="button"
                        onClick={() =>
                          setRecordMediaPreview(
                            (
                              recordMediaPreview +
                              1
                            ) %
                              media.length
                          )
                        }
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/65 text-[25px] font-medium text-white shadow-lg ring-1 ring-white/15 backdrop-blur transition hover:bg-slate-950/90"
                      >
                        ›
                      </button>

                    ) : null}

                  </div>


                  {/* CAPTION */}

                  <div className="flex items-center justify-between gap-6 border-t border-slate-200 bg-white px-5 py-3.5 sm:px-6">

                    <div className="min-w-0">

                      <p className="truncate text-[12px] font-bold text-slate-950">
                        {media[
                          recordMediaPreview
                        ].alt ??
                          entity.title}
                      </p>

                      {media[
                        recordMediaPreview
                      ].role ? (

                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-slate-400">
                          {media[recordMediaPreview].role === "hero"
                            ? "Featured"
                            : media[recordMediaPreview].role === "interior"
                              ? "Interior"
                              : media[recordMediaPreview].role === "detail"
                                ? "Detail"
                                : media[recordMediaPreview].role}
                        </p>

                      ) : null}

                      {media[recordMediaPreview].attribution ||
                      media[recordMediaPreview].sourceUrl ||
                      media[recordMediaPreview].license ||
                      isPublicRecordStatus(media[recordMediaPreview].provenanceStatus) ||
                      isPublicRecordStatus(media[recordMediaPreview].rightsStatus) ? (

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[8.5px] leading-4 text-slate-400">

                          {media[recordMediaPreview].attribution ? (

                            <span>
                              {media[recordMediaPreview].attribution}
                            </span>

                          ) : null}

                          {isPublicRecordStatus(media[recordMediaPreview].provenanceStatus) ? (

                            <span className="font-semibold uppercase tracking-[0.05em] text-slate-500">
                              {media[recordMediaPreview].provenanceStatus}
                            </span>

                          ) : null}

                          {media[recordMediaPreview].license ? (

                            <span className="font-semibold uppercase tracking-[0.05em] text-slate-500">
                              {media[recordMediaPreview].license}
                            </span>

                          ) : null}

                          {isPublicRecordStatus(media[recordMediaPreview].rightsStatus) ? (

                            <span className="font-semibold uppercase tracking-[0.05em] text-slate-500">
                              {media[recordMediaPreview].rightsStatus}
                            </span>

                          ) : null}

                          {media[recordMediaPreview].sourceUrl ? (

                            <a
                              href={media[recordMediaPreview].sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="group cursor-pointer font-semibold text-blue-700 transition hover:text-blue-800"
                            >
                              <span className="inline-flex items-center gap-1.5">
  <span>Source</span>
  <span
    aria-hidden="true"
    className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-blue-50 text-[9px] font-bold text-blue-700 ring-1 ring-blue-100 transition group-hover:translate-x-0.5 group-hover:bg-blue-100"
  >
    ↗
  </span>
</span>
                            </a>

                          ) : null}

                        </div>

                      ) : null}

                    </div>


                    <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                      {recordMediaPreview + 1}
                      {" / "}
                      {media.length}
                    </span>

                  </div>

                </div>

              </div>

            ) : null}
            {/* ==================================================
                PROJECT LIBRARY POPUP
            ================================================== */}

            {recordLibraryOpen ? (

              <div
                ref={recordLibraryDialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={`${entity.title} project library`}
                tabIndex={-1}
                onClick={closeRecordLibrary}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-[2px]"
              >

                <div
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="flex max-h-[88vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[18px] bg-white shadow-2xl"
                >

                  {/* HEADER */}

                  <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">

                    <div className="min-w-0">

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        PROJECT LIBRARY
                      </p>

                      <h2 className="mt-0.5 truncate text-[18px] font-bold text-slate-950">
                        {entity.title}
                      </h2>

                      {recordHeaderItems.length > 0 ? (

                        <div className="mt-2 grid max-w-[820px] grid-cols-2 gap-y-2 sm:grid-cols-4">

                          {recordHeaderItems.map(
                            (item) => (

                              <div
                                key={`library-header-${item.label}`}
                                className="min-w-0 border-l border-slate-200 px-3 first:border-l-0 first:pl-0"
                              >

                                <p className="text-[7.5px] font-bold uppercase tracking-[0.11em] text-slate-400">
                                  {item.label}
                                </p>

                                <p className="mt-0.5 truncate text-[9.5px] font-semibold leading-4 text-slate-700">
                                  {item.value}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      ) : null}

                      <p className="mt-1 text-[8.5px] font-medium text-slate-400">
                        {validSources.length} {validSources.length === 1 ? "source" : "sources"} ·{" "}
                        {media.length} {media.length === 1 ? "photo" : "photos"}
                        {documents.length > 0
                          ? ` · ${documents.length} ${
                              documents.length === 1
                                ? "document"
                                : "documents"
                            }`
                          : ""}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={closeRecordLibrary}
                      autoFocus
                      aria-label="Close project library"
                      className="cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f7fa] text-[21px] font-bold text-slate-900 transition hover:bg-slate-200"
                    >
                      ×
                    </button>

                  </div>


                  {/* LIBRARY CONTENT */}

                  <div className="min-h-0 overflow-y-auto p-5">

                    {validSources.length > 0 ? (

                      <section id="project-library-sources">

                        <div className="flex items-center justify-between gap-4">

                          <div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-700">
                              SOURCES &amp; REFERENCES
                            </p>

                            <h3 className="mt-0.5 text-[14px] font-bold text-slate-950">
                              Authoritative project sources
                            </h3>

                          </div>

                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700">
                            {validSources.length}
                          </span>

                        </div>


                        <div className="mt-2 grid gap-2 sm:grid-cols-2">

                          {validSources.map(
                            (
                              source,
                              index
                            ) => (

                              <a
                                key={`library-popup-source-${source.href}-${index}`}
                                href={source.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-slate-200 bg-[#f8fafc] p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
                              >

                                <div className="min-w-0">

                                  <p className="text-[7.5px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                    Source {String(index + 1).padStart(2, "0")}
                                  </p>

                                  <p className="mt-1 truncate text-[10px] font-bold text-slate-800">
                                    {source.label}
                                  </p>

                                </div>

                                <span
                                  aria-hidden="true"
                                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-blue-700 shadow-sm ring-1 ring-blue-100 transition group-hover:translate-x-0.5 group-hover:bg-blue-100"
                                >
                                  ↗
                                </span>

                              </a>

                            )
                          )}

                        </div>

                      </section>

                    ) : null}


                    {media.length > 0 ? (

                      <section id="project-library-media" className={`${validSources.length > 0 ? "mt-5 border-t border-slate-200 pt-4" : ""}`}>

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-700">
                              PHOTOS
                            </p>

                            <h3 className="mt-0.5 text-[14px] font-bold text-slate-950">
                              Project media
                            </h3>

                          </div>

                          <span className="text-[9px] font-semibold text-slate-400">
                            {media.length}
                          </span>

                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 lg:auto-rows-[145px] lg:grid-cols-3">

                          {media.map(
                            (
                              item,
                              index
                            ) => (

                              <button
                                key={`library-popup-media-${item.src}-${index}`}
                                type="button"
                                onClick={() => {
                                  setRecordMediaReturnToLibrary(
                                    true
                                  );
                                  setRecordLibraryOpen(
                                    false
                                  );
                                  setRecordMediaPreview(
                                    index
                                  );
                                }}
                                className={`group relative min-w-0 overflow-hidden rounded-[12px] bg-slate-100 text-left ${
                                  index === 0
                                    ? "col-span-2 lg:row-span-2"
                                    : ""
                                }`}
                              >

                                <div className="relative h-full overflow-hidden bg-slate-100">

                                  <img
                                    src={item.src}
                                    alt={
                                      item.alt ??
                                      entity.title
                                    }
                                    loading="lazy"
                                    className={`w-full object-cover transition duration-300 group-hover:scale-[1.025] ${
                                      index === 0
                                        ? "h-[318px] lg:h-full"
                                        : "h-[150px] lg:h-full"
                                    }`}
                                  />

                                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent px-3 pb-3 pt-10">

                                    <p
                                      className={`line-clamp-2 font-bold text-white ${
                                        index === 0
                                          ? "text-[13px]"
                                          : "text-[10px]"
                                      }`}
                                    >
                                      {item.alt ??
                                        item.role ??
                                        `Photo ${index + 1}`}
                                    </p>

                                    {item.role ? (

                                      <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.08em] text-white/70">
                                        {item.role === "hero"
                                          ? "Featured"
                                          : item.role === "interior"
                                            ? "Interior"
                                            : item.role === "detail"
                                              ? "Detail"
                                              : item.role}
                                      </p>

                                    ) : null}

                                  </div>

                                </div>

                              </button>

                            )
                          )}

                        </div>

                      </section>

                    ) : null}


                    {documents.length > 0 ? (

                      <section id="project-library-documents" className={`${validSources.length > 0 || media.length > 0 ? "mt-5 border-t border-slate-200 pt-4" : ""}`}>

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-700">
                              FILES & REFERENCES
                            </p>

                            <h3 className="mt-0.5 text-[14px] font-bold text-slate-950">
                              Documents, drawings and references
                            </h3>

                          </div>

                          <span className="text-[9px] font-semibold text-slate-400">
                            {documents.length}
                          </span>

                        </div>


                        <div className="mt-2 grid gap-2 sm:grid-cols-2">

                          {documents.map(
                            (
                              item,
                              index
                            ) => (

                              <a
                                key={`library-popup-file-${item.src}-${index}`}
                                href={item.src}
                                target="_blank"
                                rel="noreferrer"
                                className="group cursor-pointer flex min-w-0 items-start justify-between gap-3 rounded-[10px] border border-slate-200 bg-[#f8fafc] p-3 transition hover:border-blue-200 hover:bg-white"
                              >

                                <div className="min-w-0">

                                  <div className="flex flex-wrap items-center gap-1.5">

                                    <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-blue-700">
                                      {item.type ??
                                        "Document"}
                                    </span>

                                    {isPublicRecordStatus(item.provenanceStatus) ? (

                                      <span className="rounded-full bg-white px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.06em] text-slate-500">
                                        {item.provenanceStatus}
                                      </span>

                                    ) : null}

                                  </div>

                                  <p className="mt-1 line-clamp-2 text-[10px] font-bold text-slate-900">
                                    {item.title}
                                  </p>

                                  {item.credit ||
                                  item.source ? (

                                    <p className="mt-1 truncate text-[8px] text-slate-400">
                                      {item.credit ??
                                        item.source}
                                    </p>

                                  ) : null}

                                </div>

                                <span
  aria-hidden="true"
  className="inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700 shadow-sm ring-1 ring-blue-100 transition group-hover:translate-x-0.5 group-hover:bg-blue-100 group-hover:text-[#0b2949]"
>
  ↗
</span>

                              </a>

                            )
                          )}

                        </div>

                      </section>

                    ) : null}

                  </div>

                </div>

              </div>

            ) : null}



                  <div className="px-6 py-2 lg:px-7">

                    <div className="grid border-y border-slate-200 sm:grid-cols-3">

                      {[
                        {
                          label: "Sources",
                          value: validSources.length,
                          note: "Recorded references",
                        },
                        {
                          label: "Media",
                          value: media.length,
                          note: "Visual evidence",
                        },
                        {
                          label: "Documents",
                          value: documents.length,
                          note: "Project files",
                        },
                      ].map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={item.label}
                            className={`py-2 ${
                              index > 0
                                ? "border-t border-slate-200 sm:border-l sm:border-t-0 sm:pl-5"
                                : ""
                            }`}
                          >

                            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              {item.label}
                            </p>

                            <p className="mt-0.5 text-[18px] font-bold tracking-[-0.025em] text-slate-950">
                              {item.value}
                            </p>

                            <p className="mt-0.5 text-[8px] text-slate-500">
                              {item.note}
                            </p>

                          </div>

                        )
                      )}

                    </div>


                    {media.length > 0 ? (

                      <section className="mt-2 border-t border-slate-900 pt-1.5">

                        <div className="flex items-end justify-between gap-4">

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
                              Visual Evidence
                            </p>

                            <h4 className="mt-0.5 text-[14px] font-bold text-slate-950">
                              Recorded project media
                            </h4>

                          </div>

                          <span className="text-[8px] font-semibold text-slate-400">
                            {media.length} recorded
                          </span>

                        </div>


                        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">

                          {media
                            .slice(0, 6)
                            .map(
                              (
                                item,
                                index
                              ) => (

                                <button
                                  key={`${item.src}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    setRecordMediaPreview(
                                      index
                                    )
                                  }
                                  className="group cursor-pointer overflow-hidden rounded-[9px] border border-slate-200 bg-slate-100 text-left transition hover:border-blue-300"
                                >

                                  <img
                                    src={item.src}
                                    alt={
                                      item.alt ??
                                      entity.title
                                    }
                                    className="aspect-[16/9] w-full object-cover transition duration-200 group-hover:scale-[1.015]"
                                  />

                                </button>

                              )
                            )}

                        </div>

                      </section>

                    ) : null}

                  </div>

                </section>

              )

            ) : (


            /* ==============================================
                LOCKED SECTION → SIGN IN / JOIN PAGE
            ============================================== */

            <section className="relative min-w-0 overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_55%,#f8fafc_100%)]">

              <div className="absolute right-0 top-0 h-[320px] w-[420px] rounded-full bg-blue-100/30 blur-3xl" />

              <div className="relative flex min-h-[500px] items-center px-7 py-9 lg:px-12">

                <div className="w-full max-w-[820px]">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b2949] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white">
                      <LockIcon />
                      {selectedPublicRecordGate.number}
                    </span>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                      Arknoz ID is free
                    </span>

                  </div>


                  <p className="mt-5 text-[8px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    PROJECT RECORD
                  </p>

                  <h3 className="mt-1.5 text-[30px] font-bold tracking-[-0.045em] text-slate-950">
                    Unlock {selectedPublicRecordGate.label}
                  </h3>

                  <p className="mt-3 max-w-[680px] text-[11px] leading-[1.7] text-slate-600">
                    {selectedPublicRecordGate.description}
                  </p>


                  <div className="mt-6">

                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Available in this section
                    </p>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">

                      {selectedPublicRecordGate.benefits.map(
                        (item) => (

                          <div
                            key={item}
                            className="flex items-center gap-2 rounded-[11px] border border-slate-200 bg-white px-3 py-3 shadow-[0_4px_14px_rgba(15,23,42,.025)]"
                          >

                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                            />

                            <span className="text-[9.5px] font-semibold text-slate-700">
                              {item}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  <div className="mt-7 rounded-[16px] border border-blue-100 bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,.045)]">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-[10px] font-bold text-slate-950">
                            Continue with Arknoz ID
                          </span>

                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                            Free
                          </span>

                        </div>

                        <p className="mt-1.5 max-w-[520px] text-[9px] leading-[1.55] text-slate-500">
                          Sign in if you already have an Arknoz ID, or create one free to open the complete Project Record.
                        </p>

                      </div>


                      <div className="flex flex-wrap gap-2">

                        <a
                          href={`/join?returnTo=${encodeURIComponent(
                            `/projects/${entity.slug}#record`
                          )}`}
                          className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-[#0b2949] px-4 py-2.5 text-[9px] font-bold text-white shadow-[0_8px_18px_rgba(11,41,73,.16)] transition hover:-translate-y-[1px] hover:bg-[#123b65]"
                        >
                          Join free
                        </a>

                        <a
                          href={`/sign-in?returnTo=${encodeURIComponent(
                            `/projects/${entity.slug}#record`
                          )}`}
                          className="inline-flex cursor-pointer items-center justify-center px-2 py-2.5 text-[9px] font-bold text-blue-700 transition hover:text-[#0b2949]"
                        >
                          Sign in
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            setPublicRecordGateChapter(
                              null
                            )
                          }
                          className="inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white px-4 py-2.5 text-[9px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0b2949]"
                        >
                          Back to 01
                        </button>

                      </div>

                    </div>

                  </div>


                  <p className="mt-3 text-[8px] leading-[1.5] text-slate-400">
                    Arknoz Pro is not required for the Project Record. Pro applies to Arknoz Lens intelligence tools.
                  </p>

                </div>

              </div>

            </section>

          )

          ) : (                        /* ==============================================
                01 — PUBLIC PROJECT PROFILE
            ============================================== */

            <section className="grid min-w-0 bg-white pb-2 lg:h-full lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)] lg:pb-2">

              {/* ============================================
                  EDITORIAL HEADER
              ============================================ */}

              <header className="border-b border-slate-200 bg-white px-6 py-1.5 lg:px-7">

                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2.5">

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        01 · Project Profile
                      </p>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.08em] text-emerald-700">

                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        />

                        Public

                      </span>

                    </div>


                    <h3 className="mt-2 truncate text-[28px] font-bold leading-none tracking-[-0.045em] text-slate-950 lg:text-[32px]">
                      {entity.title}
                    </h3>

                  </div>
                  {recordAccessMode === "sign_in" ? (

                    <aside className="w-full lg:max-w-[480px]">

                      <div className="rounded-[13px] border border-[#eadde5] bg-[linear-gradient(135deg,#fffefe_0%,#fcf8fa_58%,#f8fbff_100%)] px-4 py-2 shadow-[0_6px_18px_rgba(15,23,42,.035)]">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-5">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                              <span className="text-[7.5px] font-bold uppercase tracking-[0.15em] text-[#9b2f63]">
                                Free Arknoz ID
                              </span>

                              <span
                                aria-hidden="true"
                                className="hidden text-slate-300 sm:inline"
                              >
                                ·
                              </span>

                              <span className="text-[13px] font-bold tracking-[-0.02em] text-slate-950 lg:text-[14px]">
                                For more records, join Arknoz ID free
                              </span>

                            </div>

                            <p className="mt-0.5 text-[9px] leading-[1.4] text-slate-500">
                              Unlock Design &amp; Systems and Evidence &amp; Documentation.
                            </p>

                          </div>


                          <div className="flex shrink-0 items-center gap-3">

                            <a
                              href={`/join?returnTo=${encodeURIComponent(
                                `/projects/${entity.slug}#record`
                              )}`}
                              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[9px] bg-[#9b2f63] px-3.5 py-2 text-[9px] font-bold text-white shadow-[0_6px_14px_rgba(155,47,99,.14)] transition hover:-translate-y-[1px] hover:bg-[#81234f]"
                            >
                              Join free
                              <span aria-hidden="true">→</span>
                            </a>

                            <a
                              href={`/sign-in?returnTo=${encodeURIComponent(
                                `/projects/${entity.slug}#record`
                              )}`}
                              className="cursor-pointer whitespace-nowrap text-[8.5px] font-bold text-[#9b2f63] transition hover:text-[#702042]"
                            >
                              Sign in
                            </a>

                          </div>

                        </div>

                      </div>

                    </aside>

                  ) : null}




                </div>

              </header>


              {/* ============================================
                  MAGAZINE DOSSIER
              ============================================ */}

              <div className="grid min-h-0 lg:h-full lg:grid-cols-[minmax(310px,.58fr)_minmax(0,1.82fr)]">


                {/* ==========================================
                    PROJECT BRIEF
                ========================================== */}

                <article className="relative flex min-h-0 flex-col border-b border-slate-200 bg-[#f5f1e9] px-5 py-3 lg:border-b-0 lg:border-r lg:px-6 lg:py-3">

                  <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-slate-900/[0.05]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute -right-7 -top-10 h-36 w-36 rounded-full border border-slate-900/[0.06]"
                  />


                  <div className="relative">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-blue-700">
                          Project Brief
                        </p>



                      </div>


                      <span className="font-serif text-[24px] leading-none text-slate-300">
                        01
                      </span>

                    </div>


                    <div className="mt-2 h-[2px] w-12 bg-slate-900" />


                    {publicProjectBrief ? (

                      <p className="mt-2 max-w-[640px] font-serif text-[14px] leading-[1.38] tracking-[-0.008em] text-slate-900 sm:text-[14.5px] lg:text-[15.5px] lg:leading-[1.38]">
                        {publicProjectBrief}
                      </p>

                    ) : (

                      <div className="mt-6 max-w-[520px]">

                        <p className="font-serif text-[18px] leading-[1.55] text-slate-500">
                          Project brief not available.
                        </p>

                      </div>

                    )}

                  </div>




                </article>


                {/* ==========================================
                    STRUCTURED PROJECT PROFILE
                ========================================== */}

                <section className="min-w-0 bg-white px-5 py-2 lg:px-6 lg:py-2.5">

                  <div className="flex items-end justify-between gap-5 border-b border-slate-200 pb-1.5">

                    <div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        Project Profile
                      </p>

                      <h4 className="mt-0.5 text-[18px] font-bold tracking-[-0.025em] text-slate-950">
                        The factual public record
                      </h4>

                    </div>




                  </div>


                  {publicProjectProfileGroups.length > 0 ? (

                    <div className="mt-1.5 grid gap-x-4 gap-y-0.5 xl:grid-cols-3">

                      {publicProjectProfileGroups.map(
                        (
                          group,
                          groupIndex
                        ) => (

                          <section
                            key={`${group.label}-${groupIndex}`}
                            className="min-w-0 border-t border-slate-900 pt-1.5"
                          >

                            <div className="mb-1">

                              <p className="text-[11px] font-bold tracking-[-0.01em] text-slate-950">
                                {group.label}
                              </p>

                              <p className="mt-0.5 text-[7.5px] font-medium uppercase tracking-[0.065em] text-slate-500">
                                {group.caption}
                              </p>

                            </div>


                            <div className="divide-y divide-slate-100">

                              {group.items.map(
                                (
                                  item,
                                  itemIndex
                                ) => (

                                  <div
                                    key={`${group.label}-${item.label}-${itemIndex}`}
                                    className="grid grid-cols-[80px_minmax(0,1fr)] gap-2 py-0.5"
                                  >

                                    <p className="text-[8.5px] font-bold leading-[1.35] text-slate-600">
                                      {item.label}
                                    </p>


                                    <div className="min-w-0">

                                      <p className="text-[10.5px] font-semibold leading-[1.35] tracking-[-0.005em] text-slate-950">
                                        {item.value}
                                      </p>


                                      {item.description ? (

                                        <p className="mt-0.5 text-[8.5px] leading-[1.4] text-slate-500">
                                          {item.description}
                                        </p>

                                      ) : null}

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          </section>

                        )
                      )}

                    </div>

                  ) : (

                    <div className="flex min-h-[250px] items-center justify-center">

                      <div className="max-w-[460px] text-center">

                        <div className="mx-auto h-px w-12 bg-slate-300" />

                        <p className="mt-5 font-serif text-[18px] leading-[1.5] text-slate-600">
                          No additional project details are available.
                        </p>

                      </div>

                    </div>

                  )}

                </section>

              </div>

            </section>)}

        </article>

      </section>

    </div>

  );


  const lensAccessGate = (

    <section className="overflow-hidden rounded-[22px] border border-[#e6d9e1] bg-white shadow-[0_14px_38px_rgba(70,30,55,.06)]">

      <div className="grid min-h-[470px] lg:grid-cols-[285px_minmax(0,1fr)]">

        <aside className="border-b border-[#e6d9e1] bg-[#faf6f8] p-6 lg:border-b-0 lg:border-r">

          <div className="flex items-center justify-between gap-3">

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8a3f69]">
              Arknoz Lens
            </p>

            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-[#8a3f69] ring-1 ring-[#dfc7d4]">
              <LockIcon />
              Pro
            </span>

          </div>

          <h3 className="mt-2 text-[20px] font-bold tracking-[-0.035em] text-slate-950">
            Arknoz Lens
          </h3>

          <p className="mt-1.5 text-[10px] leading-[1.6] text-slate-500">
            Understand it. Test it. Use it.
          </p>


          <div className="mt-5 grid gap-2">

            {[
              "Project Anatomy",
              "Design Forensics",
              "Systems, Performance & Risk",
              "Connected Intelligence",
              "Adaptation Lab",
              "Benchmark & Decision Intelligence",
            ].map(
              (item, index) => (

                <div
                  key={item}
                  className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 rounded-[10px] border border-[#eadfe5] bg-white/70 px-3 py-2.5 opacity-75"
                >

                  <span className="text-[8px] font-bold text-[#a26787]">
                    0{index + 1}
                  </span>

                  <span className="text-[9.5px] font-semibold leading-[1.35] text-slate-600">
                    {item}
                  </span>

                  <span
                    className="text-[#a26787]"
                    aria-hidden="true"
                  >
                    <LockIcon />
                  </span>

                </div>

              )
            )}

          </div>

        </aside>


        <main className="relative overflow-hidden bg-[#0b2949] px-7 py-10 text-white lg:px-12">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(138,63,105,.35),transparent_42%)]" />

          <div className="relative flex min-h-[380px] max-w-[680px] flex-col justify-center">

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white/85">
              <LockIcon />
              Arknoz Pro
            </span>

            <h2 className="mt-4 text-[32px] font-bold tracking-[-0.045em] text-white">
              Use the project, not just read it.
            </h2>

            <p className="mt-3 max-w-[620px] text-[11px] leading-[1.7] text-white/68">
              Arknoz Lens turns verified project evidence into anatomy, causal design reading, performance and risk insight, connected intelligence, adaptation testing and decision support.
            </p>

            <p className="mt-4 max-w-[600px] text-[9.5px] leading-[1.6] text-white/48">
              This preview contains no protected project analysis. Full Lens intelligence is supplied only after Arknoz Pro entitlement is verified.
            </p>

            <div
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[9px] font-semibold tracking-[0.01em] text-white/70"
              role="status"
            >
              <LockIcon />
              Subscriptions coming soon
            </div>

          </div>

        </main>

      </div>

    </section>

  );



  return (
    <UniversalRecordWorkspace
      record={recordAccessGate}
      connections={connectionsView}
      lens={lensAccessMode === "full" ? arknozLens : lensAccessGate}
      middleMode="lens"
      stickyTabs
      project26Mode
      intelligence={intelligence}
    />
  );
}
