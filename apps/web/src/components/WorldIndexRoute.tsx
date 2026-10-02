import WorldIndexPage from "@/components/WorldIndexPage";

import {
  getArknozSection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";

export default function WorldIndexRoute({
  sectionKey,
  geoSlug,
  activeSubsection,
  page,
  sort,
}: {
  sectionKey: ArknozSectionKey;
  geoSlug?: string;
  activeSubsection?: string;
  page?: number;
  sort?: "az" | "za";
}) {
  const section =
    getArknozSection(sectionKey);

  if (!section) {
    throw new Error(
      `Unknown Arknoz section: ${sectionKey}`
    );
  }

  return (
    <WorldIndexPage
      sectionKey={section.key}
      title={section.title}
      description={section.description}
      geoSlug={geoSlug}
      activeSubsection={activeSubsection}
      page={page}
      sort={sort}
    />
  );
}