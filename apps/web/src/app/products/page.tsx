import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Products"
      description="Materials, components, systems, equipment and Built World solutions."
      geoSlug={geo}
    />
  );
}
