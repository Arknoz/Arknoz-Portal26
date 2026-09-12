import { notFound } from "next/navigation";

import GeographyPage from "@/components/geography/GeographyPage";
import ContinentGeographyPage from "@/components/geography/ContinentGeographyPage";
import CountryGeographyPage from "@/components/geography/CountryGeographyPage";

import {
  findGeography,
} from "@/lib/geography";


export default async function Page({
  params,
}: {
  params: Promise<{
    path: string[];
  }>;
}) {
  const { path } = await params;

  const slug =
    path[path.length - 1];

  const context =
    findGeography(slug);

  if (!context) {
    notFound();
  }

  if (
    context.type ===
    "continent"
  ) {
    return (
      <ContinentGeographyPage
        context={context}
      />
    );
  }

  if (
    context.type ===
    "country"
  ) {
    return (
      <CountryGeographyPage
        context={context}
      />
    );
  }

  return (
    <GeographyPage
      context={context}
    />
  );
}
