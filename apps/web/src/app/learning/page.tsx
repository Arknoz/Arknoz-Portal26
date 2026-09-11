import WorldIndexPage from "@/components/WorldIndexPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;

  return (
    <WorldIndexPage
      title="Learning & Education"
      description="Courses, programmes, skills and professional development."
      geoSlug={geo}
    />
  );
}
