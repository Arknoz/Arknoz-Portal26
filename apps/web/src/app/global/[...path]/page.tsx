import type { Metadata } from "next";
import {
  notFound,
} from "next/navigation";

import ArknozGeographyExperience, {
  type GeographyCollectionKind,
} from "@/components/geography/ArknozGeographyExperience";

import {
  findGeography,
} from "@/lib/geography";


const collectionKinds =
  new Set<
    GeographyCollectionKind
  >([
    "continents",
    "countries",
    "regions",
    "cities",
    "places",
  ]);


function isCollectionKind(
  value: string
): value is
  GeographyCollectionKind {

  return collectionKinds.has(
    value as
      GeographyCollectionKind
  );
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{
    path: string[];
  }>;
}): Promise<Metadata> {
  const { path } = await params;

  if (!path || path.length === 0) {
    return {
      title: "Global",
    };
  }

  const slug =
    path[path.length - 1];

  if (
    path.length === 1 &&
    isCollectionKind(slug)
  ) {
    const title =
      slug.charAt(0).toUpperCase() +
      slug.slice(1);

    return {
      title,
      description:
        `Explore ${slug} across the Built World on Arknoz.`,
    };
  }

  const context =
    findGeography(slug);

  if (!context) {
    return {
      title: "Global",
    };
  }

  return {
    title: context.name,
    description:
      `${context.subtitle}. Explore projects, products, knowledge, people, organisations, universities and opportunities connected to ${context.name}.`,
  };
}
export default async function Page({
  params,
}: {
  params:
    Promise<{
      path: string[];
    }>;
}) {

  const {
    path,
  } =
    await params;


  if (
    !path ||
    path.length === 0
  ) {
    notFound();
  }


  const slug =
    path[
      path.length - 1
    ];


  if (
    path.length === 1 &&
    isCollectionKind(
      slug
    )
  ) {

    const global =
      findGeography(
        "global"
      );


    if (!global) {
      notFound();
    }


    return (
      <ArknozGeographyExperience
        context={global}
        collectionKind={slug}
      />
    );
  }


  const context =
    findGeography(
      slug
    );


  if (!context) {
    notFound();
  }


  return (
    <ArknozGeographyExperience
      context={context}
    />
  );
}