import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Knowledge"
      description="Research, standards, publications, case studies, methods and evidence."
      geoSlug={geo}
    />
  );
}
