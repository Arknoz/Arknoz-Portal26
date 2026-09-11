import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Places"
      description="Countries, regions, cities and local Built World context."
      geoSlug={geo}
    />
  );
}
