import { notFound } from "next/navigation";

import ProfileDetailPage from "@/components/ProfileDetailPage";

import {
  getEntity,
} from "@/lib/entities";

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const entity =
    getEntity(
      "organisation",
      slug
    );

  if (!entity) {
    notFound();
  }

  return (
    <ProfileDetailPage
      entity={entity}
    />
  );
}
