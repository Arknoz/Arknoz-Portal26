import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import { getEntity } from "@/lib/entities";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const entity =
    getEntity(
      "opportunity",
      slug
    );

  if (!entity) {
    notFound();
  }

  permanentRedirect(
    `/opportunities/opportunity/${slug}`
  );
}