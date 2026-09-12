import WorldIndexPage from "@/components/WorldIndexPage";

import {
  getArknozSection,
  type ArknozSectionKey,
} from "@/lib/arknoz-sections";

export default function WorldIndexRoute({
  sectionKey,
  geoSlug,
  activeSubsection,
}: {
  sectionKey: ArknozSectionKey;
  geoSlug?: string;
  activeSubsection?: string;
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
    />
  );
}