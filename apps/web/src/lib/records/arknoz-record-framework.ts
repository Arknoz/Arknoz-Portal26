export type ArknozRecordFramework = {
  key: string;

  overview: {
    typeLabel: string;
    whyItMattersLabel: string;
    essentialFactsMax: number;
    mediaMaxFeatured: number;
  };

  record: {
    lensLabel: string;
    lensWordTarget: {
      min: number;
      max: number;
    };

    modules: ArknozRecordModule[];
  };

  connections: {
    families: string[];
  };

  intelligence: {
    families: string[];
  };
};

export type ArknozRecordModule = {
  key: string;
  label: string;
  family:
    | "identity"
    | "content"
    | "criteria"
    | "participation"
    | "performance"
    | "evidence"
    | "context";
};


/*
 * ============================================================
 * UNIVERSAL ARKNOZ RECORD RULE
 *
 * OVERVIEW
 *   identity + gallery + summary + essential facts
 *   + WHY IT MATTERS + official/source actions
 *
 * 01 RECORD
 *   ARKNOZ LENS
 *   + type-specific factual modules
 *   + documents/evidence
 *
 * 02 CONNECTIONS
 *   relationships across canonical Arknoz records
 *
 * 03 INTELLIGENCE · PRO
 *   interpretation + comparison + suitability
 *   + benchmarking + professional action
 *
 * UNIVERSAL LAST SCREEN
 *   Partner Ecosystem
 *
 * Same framework for current and future record types.
 * ============================================================
 */


const generic: ArknozRecordFramework = {
  key: "generic",

  overview: {
    typeLabel: "Record",
    whyItMattersLabel:
      "Why it matters",
    essentialFactsMax: 6,
    mediaMaxFeatured: 12,
  },

  record: {
    lensLabel:
      "Arknoz Lens",

    lensWordTarget: {
        min: 250,
        max: 300,
      },

    modules: [
      {
        key: "primary",
        label: "Key information",
        family: "content",
      },
      {
        key: "context",
        label: "Context",
        family: "context",
      },
      {
        key: "evidence",
        label: "Documents & Evidence",
        family: "evidence",
      },
    ],
  },

  connections: {
    families: [
      "People",
      "Organisations",
      "Projects",
      "Products",
      "Knowledge",
      "Places",
    ],
  },

  intelligence: {
    families: [
      "Assess",
      "Compare",
      "Interpret",
      "Apply",
    ],
  },
};


export const arknozRecordFrameworks: Record<
  string,
  ArknozRecordFramework
> = {

  /* ========================================================
     PRODUCT / MATERIAL / SYSTEM
  ======================================================== */

  product: {
    key: "product",

    overview: {
      typeLabel: "Product",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 12,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "signals",
          label:
            "Product Signals",
          family: "content",
        },
        {
          key: "applications",
          label:
            "Applications",
          family: "participation",
        },
        {
          key: "performance",
          label:
            "Performance & Compliance",
          family: "performance",
        },
        {
          key: "evidence",
          label:
            "Documents & Evidence",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "Manufacturer",
        "Projects",
        "Materials",
        "Systems",
        "Standards",
        "Knowledge",
        "Places",
      ],
    },

    intelligence: {
      families: [
        "Assess",
        "Compare",
        "Interpret",
        "Alternatives",
        "Project Fit",
        "Apply",
      ],
    },
  },


  /* ========================================================
     PROJECT / BUILDING
  ======================================================== */

  project: {
    key: "project",

    overview: {
      typeLabel: "Project",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 12,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "design",
          label:
            "Design & Programme",
          family: "content",
        },
        {
          key: "systems",
          label:
            "Structure & Materials",
          family: "performance",
        },
        {
          key: "performance",
          label:
            "Performance & Sustainability",
          family: "performance",
        },
        {
          key: "evidence",
          label:
            "Timeline, Evidence & Sources",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "People",
        "Practices",
        "Engineers",
        "Clients",
        "Products",
        "Places",
        "Knowledge",
        "Awards",
      ],
    },

    intelligence: {
      families: [
        "Design Interpretation",
        "Benchmark",
        "Compare",
        "Strategic Read",
        "Lessons",
        "Apply",
      ],
    },
  },


  /* ========================================================
     JOB
  ======================================================== */

  job: {
    key: "job",

    overview: {
      typeLabel: "Job",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 8,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "role",
          label:
            "Role & Responsibilities",
          family: "content",
        },
        {
          key: "requirements",
          label:
            "Requirements & Skills",
          family: "criteria",
        },
        {
          key: "employment",
          label:
            "Employment & Application",
          family: "participation",
        },
        {
          key: "evidence",
          label:
            "Documents & Official Source",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "Employer",
        "People",
        "Place",
        "Sector",
        "Skills",
        "Projects",
        "Related Opportunities",
      ],
    },

    intelligence: {
      families: [
        "Role Fit",
        "Skills Gap",
        "Compare",
        "Employer Context",
        "Career Path",
        "Apply",
      ],
    },
  },


  /* ========================================================
     BOOK / PUBLICATION
  ======================================================== */

  book: {
    key: "book",

    overview: {
      typeLabel: "Publication",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 8,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "themes",
          label:
            "Themes & Arguments",
          family: "content",
        },
        {
          key: "structure",
          label:
            "Contents & Structure",
          family: "content",
        },
        {
          key: "publication",
          label:
            "Author & Publication Context",
          family: "context",
        },
        {
          key: "evidence",
          label:
            "References, Editions & Sources",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "Authors",
        "People",
        "Universities",
        "Projects",
        "Places",
        "Knowledge",
        "Related Publications",
      ],
    },

    intelligence: {
      families: [
        "Interpret",
        "Key Ideas",
        "Compare",
        "Professional Relevance",
        "Application",
      ],
    },
  },


  /* ========================================================
     UNIVERSITY
  ======================================================== */

  university: {
    key: "university",

    overview: {
      typeLabel: "University",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 12,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "programmes",
          label:
            "Programmes & Schools",
          family: "content",
        },
        {
          key: "research",
          label:
            "Research & Faculty",
          family: "content",
        },
        {
          key: "institution",
          label:
            "Accreditation, Campus & Admissions",
          family: "criteria",
        },
        {
          key: "evidence",
          label:
            "Official Documents & Sources",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "People",
        "Alumni",
        "Research",
        "Projects",
        "Employers",
        "Partners",
        "Events",
        "Places",
      ],
    },

    intelligence: {
      families: [
        "Strengths",
        "Programme Comparison",
        "Research Positioning",
        "Suitability",
        "Outcomes",
      ],
    },
  },


  /* ========================================================
     COMPETITION
  ======================================================== */

  competition: {
    key: "competition",

    overview: {
      typeLabel: "Competition",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 10,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "brief",
          label:
            "Brief & Objectives",
          family: "content",
        },
        {
          key: "eligibility",
          label:
            "Eligibility & Submission",
          family: "criteria",
        },
        {
          key: "schedule",
          label:
            "Jury, Prize & Schedule",
          family: "participation",
        },
        {
          key: "evidence",
          label:
            "Rules, Documents & Sources",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "Organiser",
        "Jury",
        "People",
        "Place",
        "Projects",
        "Previous Winners",
        "Themes",
      ],
    },

    intelligence: {
      families: [
        "Eligibility Fit",
        "Brief Interpretation",
        "Deadline Risk",
        "Compare",
        "Participation Strategy",
      ],
    },
  },


  /* ========================================================
     PERSON
  ======================================================== */

  person: {
    key: "person",

    overview: {
      typeLabel: "Person",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 10,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "practice",
          label:
            "Practice & Expertise",
          family: "content",
        },
        {
          key: "work",
          label:
            "Selected Work",
          family: "content",
        },
        {
          key: "background",
          label:
            "Experience & Recognition",
          family: "context",
        },
        {
          key: "evidence",
          label:
            "Publications & Sources",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "Organisations",
        "Projects",
        "Universities",
        "Collaborators",
        "Publications",
        "Events",
        "Places",
      ],
    },

    intelligence: {
      families: [
        "Expertise",
        "Career Pattern",
        "Influence",
        "Compare",
        "Professional Context",
      ],
    },
  },


  /* ========================================================
     EVENT
  ======================================================== */

  event: {
    key: "event",

    overview: {
      typeLabel: "Event",
      whyItMattersLabel:
        "Why it matters",
      essentialFactsMax: 6,
      mediaMaxFeatured: 10,
    },

    record: {
      lensLabel:
        "Arknoz Lens",

      lensWordTarget: {
        min: 250,
        max: 300,
      },

      modules: [
        {
          key: "programme",
          label:
            "Programme & Format",
          family: "content",
        },
        {
          key: "people",
          label:
            "Speakers & Participants",
          family: "participation",
        },
        {
          key: "attendance",
          label:
            "Venue & Attendance",
          family: "criteria",
        },
        {
          key: "evidence",
          label:
            "Registration & Sources",
          family: "evidence",
        },
      ],
    },

    connections: {
      families: [
        "Organiser",
        "Speakers",
        "People",
        "Organisations",
        "Place",
        "Topics",
        "Related Events",
      ],
    },

    intelligence: {
      families: [
        "Relevance",
        "Audience Fit",
        "Programme Analysis",
        "Compare",
        "Professional Value",
      ],
    },
  },
};


export function getArknozRecordFramework(
  key: string | undefined | null
): ArknozRecordFramework {

  if (!key) {
    return generic;
  }

  return (
    arknozRecordFrameworks[
      key.toLowerCase()
    ] ??
    generic
  );
}
