import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="People"
      description="Architects, engineers, researchers, educators and Built World professionals."
      geoSlug={geo}
    />
  );
}
