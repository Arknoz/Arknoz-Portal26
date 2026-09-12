import {
  getArknozSection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";

export type ArknozRouteSearchParams = {
  geo?: string;
  type?: string;
  view?: string;
};

export function resolveArknozSubsectionFromQuery(
  sectionKey: ArknozSectionKey,
  params: ArknozRouteSearchParams
) {
  const section = getArknozSection(sectionKey);

  if (!section) {
    return undefined;
  }

  return section.subsections.find((subsection) => {
    const route = subsection.route;

    if (route.kind !== "query") {
      return false;
    }

    return params[route.key] === route.value;
  })?.slug;
}