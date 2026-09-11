export type OpportunityFact = {
  label: string;
  value: string;
};

export type OpportunityDate = {
  date: string;
  title: string;
  description?: string;
};

export type OpportunityItem = {
  title: string;
  description: string;
};

export type OpportunitySource = {
  label: string;
  organisation: string;
  href: string;
};

export type OpportunityDetailData = {
  category: string;
  opportunityType: string;

  strapline: string;
  summary: string;

  organiser: string;
  geography: string;
  eligibility: string;
  prize: string;

  status: string;

  registrationDeadline: string;
  submissionDeadline: string;

  officialUrl: string;
  lastChecked: string;

  facts: OpportunityFact[];
  dates: OpportunityDate[];
  eligibilityItems: OpportunityItem[];
  requirements: OpportunityItem[];
  topics: string[];
  sources: OpportunitySource[];
};

const OPPORTUNITY_DETAILS: Record<
  string,
  OpportunityDetailData
> = {
  "vancouver-tall-challenge": {
    category: "Competitions",
    opportunityType: "Ideas Competition",

    strapline:
      "Design the future of Vancouver's skyline.",

    summary:
      "An international architecture ideas competition exploring how height and density can contribute to the future of downtown Vancouver while responding to housing, urban growth, mobility, livability and the city's relationship with nature.",

    organiser: "Buildner",
    geography: "Vancouver, Canada",
    eligibility: "Open to all",
    prize: "$15,000 CAD",

    status: "Registration open",

    registrationDeadline: "29 October 2026",
    submissionDeadline: "30 November 2026",

    officialUrl:
      "https://architecturecompetitions.com/VancouverTallChallenge",

    lastChecked: "12 Sep 2026",

    facts: [
      {
        label: "Type",
        value: "Ideas Competition",
      },
      {
        label: "Organiser",
        value: "Buildner",
      },
      {
        label: "Location",
        value: "Vancouver, Canada",
      },
      {
        label: "Eligibility",
        value: "Open to all",
      },
      {
        label: "Prize fund",
        value: "$15,000 CAD",
      },
      {
        label: "Registration",
        value: "29 Oct 2026",
      },
    ],

    dates: [
      {
        date: "29 Oct",
        title: "Registration closes",
      },
      {
        date: "03 Nov",
        title: "Q&A deadline",
      },
      {
        date: "30 Nov",
        title: "Submission closes",
      },
      {
        date: "26 Jan",
        title: "Winners announced",
      },
    ],

    eligibilityItems: [
      {
        title: "Open participation",
        description:
          "The official competition page states that participation is open to all.",
      },
      {
        title: "International",
        description:
          "The competition is presented for international participation.",
      },
      {
        title: "Ideas competition",
        description:
          "The programme is an architectural ideas competition.",
      },
      {
        title: "Registration required",
        description:
          "Participation requires registration through the official competition platform.",
      },
    ],

    requirements: [
      {
        title: "Register",
        description:
          "Register through the official competition platform.",
      },
      {
        title: "Review brief",
        description:
          "Use the current official competition brief.",
      },
      {
        title: "Prepare submission",
        description:
          "Prepare the required competition proposal and material.",
      },
      {
        title: "Submit",
        description:
          "Submit before the official submission deadline.",
      },
    ],

    topics: [
      "Tall Buildings",
      "Urban Density",
      "Housing",
      "Vancouver",
    ],

    sources: [
      {
        label:
          "Vancouver Tall Challenge — official competition page",
        organisation: "Buildner",
        href:
          "https://architecturecompetitions.com/VancouverTallChallenge",
      },
      {
        label:
          "Buildner — Architecture Competitions",
        organisation: "Buildner",
        href:
          "https://architecturecompetitions.com/",
      },
    ],
  },
};

export function getOpportunityDetail(
  slug: string
): OpportunityDetailData | undefined {
  return OPPORTUNITY_DETAILS[slug];
}
