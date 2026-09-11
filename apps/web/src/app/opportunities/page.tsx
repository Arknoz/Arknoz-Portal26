import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Opportunities"
      description="Jobs, internships, competitions, scholarships, grants, fellowships, events and more."
      geoSlug={geo}
    />
  );
}
