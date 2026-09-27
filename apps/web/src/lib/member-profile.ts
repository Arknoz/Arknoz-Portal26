export type MemberStage =
  | "student"
  | "graduate"
  | "professional"
  | "specialist"
  | "academic"
  | "educator"
  | "independent";

export type MemberMembership =
  | "FREE"
  | "PRO";

export type VerificationState =
  | "self-declared"
  | "connected-record"
  | "project-backed"
  | "organisation-confirmed"
  | "credential-verified"
  | "professional-body-verified"
  | "source-verified";

export type MemberProject = {
  title: string;
  href?: string;
  image?: string;
  location?: string;
  year?: string;
  role?: string;
  sector?: string;
  organisation?: string;
  verification?: VerificationState;
};

export type MemberExperience = {
  role: string;
  organisation: string;
  location?: string;
  start?: string;
  end?: string;
  current?: boolean;
  description?: string;
  projectCount?: number;
};

export type MemberCredential = {
  title: string;
  issuer?: string;
  reference?: string;
  verification?: VerificationState;
};

export type MemberService = {
  id: string;
  title: string;
  category: string;
  summary: string;
  remote?: boolean;
  location?: string;
  indicativePrice?: string;
  turnaround?: string;
  coverImage?: string;
  relatedProjects?: string[];
  active?: boolean;
};

export type MemberProfileData = {
  arknozId?: string;
  membership: MemberMembership;
  stage: MemberStage;

  headline: string;
  organisation?: string;
  location: string;
  about: string;

  disciplines: string[];
  sectors: string[];
  skills: string[];
  languages?: string[];

  yearsExperience?: number;
  countries?: string[];

  availability?: string[];

  featuredProjects?: MemberProject[];
  experience?: MemberExperience[];
  credentials?: MemberCredential[];
  workedWith?: string[];
  services?: MemberService[];

  website?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;

  arknozCvEnabled?: boolean;
  visualPortfolioEnabled?: boolean;
};

const MEMBER_PROFILES: Record<string, MemberProfileData> = {};

export function getMemberProfile(
  slug: string
): MemberProfileData | undefined {
  if (slug === "__arknoz-pro-preview") {
    return MEMBER_PROFILE_PREVIEW;
  }

  return MEMBER_PROFILES[slug];
}

export const MEMBER_PROFILE_PREVIEW_SLUG = "__arknoz-pro-preview";

export const MEMBER_PROFILE_PREVIEW: MemberProfileData = {
  membership: "PRO",
  stage: "professional",

  headline: "Architect · Sustainable Design · Project Strategy",
  organisation: "Independent Practice",
  location: "New Delhi, India",
  about:
    "Development preview for the Arknoz Pro professional identity system. This record exists only to review profile, portfolio, Arknoz CV and Services presentation before live member data is connected.",

  disciplines: [
    "Architecture",
    "Urban Design",
    "Project Strategy",
  ],

  sectors: [
    "Residential",
    "Hospitality",
    "Healthcare",
  ],

  skills: [
    "Architecture",
    "Sustainable Design",
    "Project Strategy",
    "BIM",
    "Design Review",
    "Research",
  ],

  languages: [
    "English",
    "Hindi",
  ],

  yearsExperience: 18,

  countries: [
    "India",
    "UAE",
    "United Kingdom",
  ],

  availability: [
    "Available for consulting",
    "Available remotely",
    "Open to collaboration",
  ],

  featuredProjects: [
    {
      title: "Healthcare Campus",
      location: "Dubai, UAE",
      year: "2025",
      role: "Design Lead",
      sector: "Healthcare",
      verification: "project-backed",
    },
    {
      title: "Urban Living Development",
      location: "New Delhi, India",
      year: "2024",
      role: "Architect",
      sector: "Residential",
      verification: "connected-record",
    },
    {
      title: "Hospitality Prototype",
      location: "London, UK",
      year: "2023",
      role: "Design Strategist",
      sector: "Hospitality",
      verification: "organisation-confirmed",
    },
  ],

  experience: [
    {
      role: "Principal Architect",
      organisation: "Independent Practice",
      location: "New Delhi, India",
      start: "2021",
      current: true,
      description:
        "Architecture, strategy and multidisciplinary Built World advisory.",
      projectCount: 12,
    },
    {
      role: "Design Director",
      organisation: "International Design Practice",
      location: "Dubai, UAE",
      start: "2015",
      end: "2021",
      projectCount: 18,
    },
  ],

  credentials: [
    {
      title: "Professional Architecture Registration",
      issuer: "Professional body",
      verification: "credential-verified",
    },
    {
      title: "Sustainable Design Certification",
      issuer: "Certification body",
      verification: "source-verified",
    },
  ],

  workedWith: [
    "Architecture Practice",
    "Engineering Consultancy",
    "Project Management Consultancy",
    "Developer",
  ],

  services: [
    {
      id: "preview-design-review",
      title: "Architectural Design Review",
      category: "Design",
      summary:
        "Independent review of planning, design coordination, usability and key project risks.",
      remote: true,
      location: "India · Global remote",
      indicativePrice: "Price on request",
      turnaround: "5–7 days",
      active: true,
    },
    {
      id: "preview-project-strategy",
      title: "Project Strategy Consultation",
      category: "Advisory",
      summary:
        "Early-stage project, design and delivery strategy for Built World projects.",
      remote: true,
      location: "Global",
      turnaround: "By agreement",
      active: true,
    },
    {
      id: "preview-bim-review",
      title: "BIM & Drawing Coordination Review",
      category: "Project Delivery",
      summary:
        "Review of coordinated drawing packages, BIM information and multidisciplinary conflicts.",
      remote: true,
      location: "Remote",
      turnaround: "3–5 days",
      active: true,
    },
  ],

  arknozCvEnabled: true,
  visualPortfolioEnabled: true,
};
