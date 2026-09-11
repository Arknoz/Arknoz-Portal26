import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Community"
      description="Members, collaboration, contribution, news and development, competitions and jobs, and regional chapters."
      geoSlug={geo}
    />
  );
}
