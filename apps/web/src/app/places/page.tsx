import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places",
  description:
    "Explore cities, regions and places through their projects, products, people, organisations, universities and Built World knowledge.",
};
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