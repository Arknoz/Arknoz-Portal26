import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  robots: {
    index: false,
    follow: false,
  },
};
import WorldIndexRoute from "@/components/WorldIndexRoute";
import { requireDashboardUser } from "@/lib/dashboard/access";
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
  await requireDashboardUser("/community");

  const params = await searchParams;

  const activeSubsection =
    resolveArknozSubsectionFromQuery(
      "community",
      params
    );

  return (
    <WorldIndexRoute
      sectionKey="community"
      geoSlug={params.geo}
      activeSubsection={activeSubsection}
    />
  );
}
