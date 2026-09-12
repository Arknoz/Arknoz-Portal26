import WorldIndexRoute from "@/components/WorldIndexRoute";
import { resolveArknozSubsectionFromQuery } from "@/lib/arknoz-route-context";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    geo?: string;
    type?: string;
    view?: string;
  }>;
}) {
  const params = await searchParams;

  const activeSubsection =
    resolveArknozSubsectionFromQuery(
      "places",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="places"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}