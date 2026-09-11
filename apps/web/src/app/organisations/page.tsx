import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Organisations"
      description="Firms, manufacturers, consultancies, contractors, institutions and professional bodies."
      geoSlug={geo}
    />
  );
}
