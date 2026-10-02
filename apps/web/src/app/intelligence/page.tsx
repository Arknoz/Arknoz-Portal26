import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arknoz Pro",
  description:
    "Explore Arknoz Pro, the future professional operating and intelligence layer for workspaces, messaging, tools, analytics and deeper Built World intelligence. Activation is coming later.",
};
import IntelligencePortal from "@/components/IntelligencePortal";

export default function Page() {
  return <IntelligencePortal />;
}