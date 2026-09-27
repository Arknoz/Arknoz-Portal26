import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organisations",
  description:
    "Explore architecture practices, companies, institutions and other organisations across the Built World.",
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
      "organisations",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="organisations"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}