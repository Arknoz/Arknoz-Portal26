import type { Metadata } from "next";
import { notFound } from "next/navigation";

import WorldIndexPage from "@/components/WorldIndexPage";
import type { EntityRecord } from "@/lib/entities";
import { getArknozSection } from "@/lib/arknoz-sections";

import {
  INDIA_KNOWLEDGE_RECORDS,
} from "@/lib/knowledge/india-pilot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;

  if (country.toLowerCase() !== "india") {
    return {
      title: "Knowledge",
    };
  }

  return {
    title: "India Knowledge",
    description:
      "Explore source-backed Built World knowledge from India across research, standards, practice, policy, case studies and professional references.",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{
    country: string;
  }>;
}) {
  const { country } = await params;

  if (country.toLowerCase() !== "india") {
    notFound();
  }

  const section = getArknozSection("knowledge");

  if (!section) {
    notFound();
  }

  const indiaRecords: EntityRecord[] =
    INDIA_KNOWLEDGE_RECORDS.map((record) => ({
      slug: record.slug,
      type: "knowledge",
      sectionSubsections: {
        knowledge: [record.section],
      },
      title: record.title,
      subtitle: record.domain,
      geography: "India",
      geographySlug: "india",
      summary: record.summary,
      trust: record.trust,
    }));

  return (
    <WorldIndexPage
      sectionKey="knowledge"
      title={section.title}
      description={section.description}
      geoSlug="india"
      recordSourceOverride={indiaRecords}
      compactHero
      hideTopSubsectionStrip
      featuredOverride={INDIA_KNOWLEDGE_RECORDS
        .filter((record) => record.featured)
        .slice(0, 3)
        .map((record) => ({
          type: record.domain.toUpperCase(),
          title: record.title,
          meta: `${record.publisher}${record.year ? ` · ${record.year}` : ""}`,
          href: `/knowledge/${record.slug}`,
          image: "/visuals/portal/knowledge.png",
        }))}
    />
  );
}