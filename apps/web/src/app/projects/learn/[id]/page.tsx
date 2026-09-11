import { notFound } from "next/navigation";

import LearningDetailPage from "@/components/LearningDetailPage";

import {
  getLearningDetail,
} from "@/lib/learning-details";

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
