import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge",
  description:
    "Explore research, case studies, ideas, methods, standards, references and professional knowledge across the Built World.",
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
      "knowledge",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="knowledge"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}