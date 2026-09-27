import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global",
  description:
    "Explore the Built World geographically across continents, countries, regions, cities and places.",
};
import ArknozGeographyExperience from "@/components/geography/ArknozGeographyExperience";

import {
  findGeography,
} from "@/lib/geography";


export default function GlobalPage() {

  const context =
    findGeography(
      "global"
    );


  if (!context) {

    throw new Error(
      "Arknoz Global geography root is missing."
    );
  }


  return (
    <ArknozGeographyExperience
      context={context}
    />
  );
}