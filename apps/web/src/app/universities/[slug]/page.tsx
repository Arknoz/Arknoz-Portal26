import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProfileDetailPage from "@/components/ProfileDetailPage";

import {
  getEntity,
} from "@/lib/entities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const entity =
    getEntity(
      "university",
      slug
    );

  if (!entity) {
    return {
      title: "University",
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

  const entity =
    getEntity(
      "university",
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
