import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore architecture, buildings, infrastructure, development and Built World projects across countries, cities and regions.",
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
    page?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const activeSubsection =
    resolveArknozSubsectionFromQuery(
      "projects",
      params
    );

  const parsedPage =
    Number.parseInt(
      params.page ?? "1",
      10
    );

  const page =
    Number.isFinite(parsedPage) &&
    parsedPage > 0
      ? parsedPage
      : 1;

  const sort =
    params.sort === "za"
      ? "za"
      : "az";

  return (
    <WorldIndexRoute
      sectionKey="projects"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
      page={page}
      sort={sort}
    />
  );
}