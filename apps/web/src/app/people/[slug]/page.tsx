import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MemberProfilePage from "@/components/MemberProfilePage";
import ProfileDetailPage from "@/components/ProfileDetailPage";

import { getEntity } from "@/lib/entities";
import { getProductionEntity } from "@/lib/data/production-entities";
import { getProductionMemberProfile } from "@/lib/data/production-member-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const productionEntity =
    await getProductionEntity(
      "person",
      slug
    );

  const entity =
    productionEntity ??
    getEntity("person", slug);

  if (!entity) {
    return {
      title: "Person",
    };
  }

  return {
    title: entity.title,
    description: entity.summary,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const productionEntity =
    await getProductionEntity(
      "person",
      slug
    );

  const entity =
    productionEntity ??
    getEntity("person", slug);

  if (!entity) {
    notFound();
  }

  const member =
    productionEntity
      ? await getProductionMemberProfile(slug)
      : undefined;

  if (member) {
    return (
      <MemberProfilePage
        entity={entity}
        memberData={member}
      />
    );
  }

  return (
    <ProfileDetailPage
      entity={entity}
    />
  );
}