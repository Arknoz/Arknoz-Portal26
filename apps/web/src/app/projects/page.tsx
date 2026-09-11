import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Projects"
      description="Buildings, infrastructure, landscapes, interiors, cities and real Built World projects."
      geoSlug={geo}
    />
  );
}
