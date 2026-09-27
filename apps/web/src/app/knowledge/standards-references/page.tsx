import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standards & References",
  description:
    "Explore standards, technical references, guidance and source-backed resources for Built World practice and research.",
};
import WorldIndexRoute from "@/components/WorldIndexRoute";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    geo?: string;
  }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexRoute
      sectionKey="knowledge"
      geoSlug={geo}
      activeSubsection="standards-references"
    />
  );
}