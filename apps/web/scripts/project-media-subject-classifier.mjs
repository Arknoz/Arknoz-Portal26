#!/usr/bin/env node

/*
 * Arknoz Project Media Engine
 * Stage 2B — subject classification + desired media mix
 *
 * PURPOSE
 * -------
 * Classify Project media before jurisdiction/rights evaluation.
 *
 * Project media is not exterior-only.
 * Arknoz should actively seek:
 *
 *   - hero / exterior
 *   - additional exterior architecture
 *   - interior architecture
 *   - material / architectural detail
 *   - aerial / urban context
 *   - plans / sections / drawings where rights permit
 *
 * Fail-closed:
 *   artwork-dominant and technical-drawing cases are separated
 *   from ordinary architectural photography.
 */

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function combinedText(candidate) {
  return normalize(
    [
      candidate?.commons_page_title,
      candidate?.description,
      candidate?.credit,
      candidate?.inferred_role,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function classifyProjectMediaSubject(candidate) {
  const text =
    combinedText(candidate);

  /*
   * TECHNICAL DRAWINGS
   */

  if (
    /\b(floor plan|site plan|ground plan|master plan|plan drawing)\b/.test(text)
  ) {
    return {
      subject_class: "PLAN",
      confidence: "HIGH",
      rights_route: "TECHNICAL_DRAWING_REVIEW",
      reason:
        "Architectural plan detected; do not treat as ordinary building photography.",
    };
  }

  if (
    /\b(cross section|crosssection|building section|section drawing|longitudinal section|transverse section)\b/.test(text)
  ) {
    return {
      subject_class: "SECTION",
      confidence: "HIGH",
      rights_route: "TECHNICAL_DRAWING_REVIEW",
      reason:
        "Architectural section detected.",
    };
  }

  if (
    /\b(elevation drawing|architectural elevation|facade drawing|building elevation)\b/.test(text)
  ) {
    return {
      subject_class: "ELEVATION",
      confidence: "HIGH",
      rights_route: "TECHNICAL_DRAWING_REVIEW",
      reason:
        "Architectural elevation detected.",
    };
  }

  if (
    /\b(drawing|diagram|sketch|blueprint|competition entry|competition drawing|architectural scheme)\b/.test(text)
  ) {
    return {
      subject_class: "DRAWING",
      confidence: "MEDIUM",
      rights_route: "TECHNICAL_DRAWING_REVIEW",
      reason:
        "Drawing-like Project visual detected.",
    };
  }

  /*
   * ARTWORK-DOMINANT
   *
   * This comes before interior classification deliberately.
   */

  if (
    /\b(painting|mural|sculpture|installation|artwork|art work|exhibition|exhibit|statue)\b/.test(text)
  ) {
    return {
      subject_class: "ARTWORK_DOMINANT",
      confidence: "MEDIUM",
      rights_route: "SEPARATE_ARTWORK_REVIEW",
      reason:
        "A separate artistic work may be materially depicted.",
    };
  }

  /*
   * INTERIOR ARCHITECTURE
   */

  if (
    /\b(interior|inside|foyer|lobby|atrium|auditorium|concert hall|performance hall|theatre interior|theater interior|gallery interior|staircase|stairwell|concourse|interior ceiling|interior space|interior view|room interior)\b/.test(text)
  ) {
    return {
      subject_class: "INTERIOR_ARCHITECTURE",
      confidence: "HIGH",
      rights_route: "ARCHITECTURAL_PHOTOGRAPH",
      reason:
        "Strong interior architectural signal detected.",
    };
  }

  /*
   * MATERIAL / DETAIL
   */

  if (
    /\b(detail|close up|closeup|tile|tiles|cladding|facade detail|material detail|surface|joint|roof shell|shell detail|structure detail|structural detail)\b/.test(text)
  ) {
    return {
      subject_class: "DETAIL_MATERIAL",
      confidence: "HIGH",
      rights_route: "ARCHITECTURAL_PHOTOGRAPH",
      reason:
        "Architectural material/detail signal detected.",
    };
  }

  /*
   * AERIAL / CONTEXT
   */

  if (
    /\b(aerial|birds eye|birdseye|drone|harbour view|harbor view|cityscape|skyline|urban context|context view)\b/.test(text)
  ) {
    return {
      subject_class: "AERIAL_CONTEXT",
      confidence: "HIGH",
      rights_route: "ARCHITECTURAL_PHOTOGRAPH",
      reason:
        "Aerial or contextual Project view detected.",
    };
  }

  /*
   * EXTERIOR
   */

  if (
    /\b(exterior|facade|front view|side view|rear view|outside|building exterior|night view|dusk|day view)\b/.test(text)
  ) {
    return {
      subject_class: "EXTERIOR_ARCHITECTURE",
      confidence: "HIGH",
      rights_route: "ARCHITECTURAL_PHOTOGRAPH",
      reason:
        "Exterior architectural signal detected.",
    };
  }

  /*
   * UNKNOWN / GENERIC
   */

  return {
    subject_class: "ARCHITECTURE_UNSPECIFIED",
    confidence: "LOW",
    rights_route: "CLASSIFICATION_REVIEW",
    reason:
      "Insufficient deterministic text evidence to distinguish exterior, interior, detail or other media class.",
  };
}


/*
 * Target production media balance.
 *
 * These are targets, not publication requirements.
 * A Project may publish with fewer assets when suitable
 * rights-cleared material does not exist.
 */

export function targetMediaBalance() {
  return {
    HERO_EXTERIOR: 1,
    EXTERIOR_ARCHITECTURE: 2,
    INTERIOR_ARCHITECTURE: 2,
    DETAIL_MATERIAL: 1,
    AERIAL_CONTEXT: 1,
    TECHNICAL_DRAWING: 2,
  };
}


/*
 * Targeted Commons searches.
 *
 * This is important: one generic Project query often returns
 * mostly exterior photography. These queries deliberately seek
 * the full architectural Project.
 */

export function buildProjectMediaQueries(projectName) {
  const project =
    String(projectName || "").trim();

  if (!project) {
    return [];
  }

  return [
    {
      purpose: "GENERAL",
      query: project,
    },
    {
      purpose: "INTERIOR",
      query: `${project} interior`,
    },
    {
      purpose: "INTERIOR_SPACE",
      query: `${project} foyer lobby auditorium interior`,
    },
    {
      purpose: "DETAIL",
      query: `${project} detail architecture`,
    },
    {
      purpose: "AERIAL_CONTEXT",
      query: `${project} aerial`,
    },
    {
      purpose: "PLAN",
      query: `${project} plan`,
    },
    {
      purpose: "SECTION",
      query: `${project} section drawing`,
    },
  ];
}