export type LearningFact = {
  label: string;
  value: string;
};

export type LearningOutcome = {
  title: string;
  description: string;
};

export type LearningResource = {
  title: string;
  description?: string;
};

export type LearningSource = {
  label: string;
  organisation: string;
  href: string;
};

export type LearningDetailData = {
  id: string;
  title: string;

  section?: string;
  learningType?: string;

  strapline?: string;
  summary?: string;

  provider?: string;
  department?: string;
  instructor?: string;

  level?: string;
  status?: string;
  format?: string;
  taught?: string;

  location?: string;

  officialUrl?: string;

  facts?: LearningFact[];
  outcomes?: LearningOutcome[];
  resources?: LearningResource[];
  topics?: string[];
  sources?: LearningSource[];

  notice?: string;
};

const LEARNING_DETAILS: Record<
  string,
  LearningDetailData
> = {
  "introduction-to-building-technology": {
    id: "introduction-to-building-technology",

    title:
      "Introduction to Building Technology",

    section: "Courses & Learning",
    learningType: "Open Course",

    strapline:
      "Understand how building physics, climate and technology come together in architecture.",

    summary:
      "MIT OpenCourseWare's Introduction to Building Technology introduces the physical processes behind buildings and examines how building systems, environmental conditions and technology interact in architectural design.",

    provider: "MIT OpenCourseWare",
    department: "MIT Architecture",
    instructor: "Prof. Marilyne Andersen",

    level: "Undergraduate",
    status: "Open course materials",
    format: "MIT OpenCourseWare",
    taught: "Spring 2006",

    location:
      "Cambridge, Massachusetts, USA",

    officialUrl:
      "https://ocw.mit.edu/courses/4-401-introduction-to-building-technology-spring-2006/",

    facts: [
      {
        label: "Provider",
        value: "MIT OpenCourseWare",
      },
      {
        label: "Department",
        value: "Architecture",
      },
      {
        label: "Level",
        value: "Undergraduate",
      },
      {
        label: "As taught",
        value: "Spring 2006",
      },
      {
        label: "Format",
        value: "OpenCourseWare",
      },
      {
        label: "Instructor",
        value: "Marilyne Andersen",
      },
    ],

    outcomes: [
      {
        title: "Building physics",
        description:
          "Develop a fundamental understanding of physical processes affecting buildings and occupants.",
      },
      {
        title: "Climate response",
        description:
          "Understand environmental response including climate, heat and air flow and thermal comfort.",
      },
      {
        title: "Building systems",
        description:
          "Examine building components, constraints and systems individually and in relation to one another.",
      },
      {
        title: "Technology integration",
        description:
          "Understand how technology can be integrated appropriately into architectural design.",
      },
    ],

    resources: [
      {
        title: "Lecture Notes",
        description:
          "Course lecture materials available through MIT OpenCourseWare.",
      },
      {
        title: "Problem Sets",
        description:
          "Assignments applying building-technology concepts.",
      },
      {
        title: "Exams",
        description:
          "Assessment material from the original course.",
      },
      {
        title: "Projects",
        description:
          "Project-based learning material from the course.",
      },
    ],

    topics: [
      "Building Physics",
      "Climate Response",
      "Structural Engineering",
      "Environmental Design",
    ],

    sources: [
      {
        label:
          "Introduction to Building Technology",
        organisation: "MIT OpenCourseWare",
        href:
          "https://ocw.mit.edu/courses/4-401-introduction-to-building-technology-spring-2006/",
      },
      {
        label:
          "Introduction to Building Technology — Syllabus",
        organisation: "MIT OpenCourseWare",
        href:
          "https://ocw.mit.edu/courses/4-401-introduction-to-building-technology-spring-2006/pages/syllabus/",
      },
    ],

    notice:
      "This is an open educational resource record. Arknoz does not imply a current enrolment offer, qualification, certification or accreditation.",
  },
};

export function getLearningDetail(
  id: string
): LearningDetailData | undefined {
  return LEARNING_DETAILS[id];
}
