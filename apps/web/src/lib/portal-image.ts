export type PortalVisualKind =
  | "project"
  | "product"
  | "knowledge"
  | "education"
  | "person"
  | "people"
  | "organisation"
  | "organization"
  | "opportunity"
  | "place"
  | "geography"
  | "city"
  | "country"
  | "region"
  | "continent"
  | string;

const PORTAL_FALLBACKS = {
  project: "/visuals/portal/project.png",
  product: "/visuals/portal/product.png",
  knowledge: "/visuals/portal/knowledge.png",
  education: "/visuals/portal/education.png",
  people: "/visuals/portal/people.png",
  organisation: "/visuals/portal/organisation.png",
  opportunity: "/visuals/portal/opportunity.png",
  place: "/visuals/portal/place.png",
} as const;

const GENERIC_IMAGES = [
  "/visuals/arknoz-neutral.svg",
  "/visuals/arknoz-built-world-watermark.jpg",
];

function normalizePortalVisualKind(
  kind?: PortalVisualKind | null
) {
  const value =
    String(kind ?? "")
      .trim()
      .toLowerCase();

  if (
    value === "person" ||
    value === "people" ||
    value === "member" ||
    value === "professional"
  ) {
    return "people";
  }

  if (
    value === "organisation" ||
    value === "organization" ||
    value === "company" ||
    value === "practice"
  ) {
    return "organisation";
  }

  if (
    value === "education" ||
    value === "university" ||
    value === "learning" ||
    value === "school"
  ) {
    return "education";
  }

  if (
    value === "opportunity" ||
    value === "opportunities" ||
    value === "job" ||
    value === "jobs" ||
    value === "competition" ||
    value === "event" ||
    value === "funding"
  ) {
    return "opportunity";
  }

  if (
    value === "place" ||
    value === "places" ||
    value === "geography" ||
    value === "city" ||
    value === "country" ||
    value === "region" ||
    value === "continent" ||
    value === "world"
  ) {
    return "place";
  }

  if (
    value === "product" ||
    value === "products" ||
    value === "material" ||
    value === "materials" ||
    value === "system" ||
    value === "equipment"
  ) {
    return "product";
  }

  if (
    value === "knowledge" ||
    value === "research" ||
    value === "article" ||
    value === "publication"
  ) {
    return "knowledge";
  }

  return "project";
}

export function getPortalFallbackImage(
  kind?: PortalVisualKind | null
) {
  const normalized =
    normalizePortalVisualKind(kind);

  return PORTAL_FALLBACKS[
    normalized as keyof typeof PORTAL_FALLBACKS
  ];
}

export function isGenericPortalImage(
  src?: string | null
) {
  if (!src) {
    return true;
  }

  return GENERIC_IMAGES.some(
    (generic) =>
      src.includes(generic)
  );
}

export function resolvePortalImage({
  src,
  kind,
}: {
  src?: string | null;
  kind?: PortalVisualKind | null;
}) {
  if (
    src &&
    !isGenericPortalImage(src)
  ) {
    return src;
  }

  return getPortalFallbackImage(kind);
}
