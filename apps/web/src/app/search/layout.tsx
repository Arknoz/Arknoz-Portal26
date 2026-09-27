import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search projects, products, knowledge, people, organisations, universities, opportunities and places across Arknoz.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}