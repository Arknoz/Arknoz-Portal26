import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methods & Practice",
  description:
    "Explore methods, professional practice, workflows and applied approaches across architecture, construction and the Built World.",
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
      activeSubsection="methods-practice"
    />
  );
}