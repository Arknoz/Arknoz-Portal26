import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Universities"
      description="Programmes, research, faculty, laboratories and student work."
      geoSlug={geo}
    />
  );
}
