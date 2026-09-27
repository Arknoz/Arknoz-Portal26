import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LearningDetailPage from "@/components/LearningDetailPage";

import {
  getLearningDetail,
} from "@/lib/learning-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> {
  const { id } = await params;

  const detail =
    getLearningDetail(id);

  if (!detail) {
    return {
      title: "Learning",
    };
  }

  return {
    title: detail.title,
    description:
      detail.summary ??
      detail.strapline ??
      "Explore this Built World learning resource on Arknoz.",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const detail =
    getLearningDetail(id);

  if (!detail) {
    notFound();
  }

  return (
    <LearningDetailPage
      detail={detail}
    />
  );
}
