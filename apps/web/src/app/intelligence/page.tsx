import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arknoz Pro",
  description:
    "Explore Arknoz Pro, the professional operating layer for workspaces, collaboration, messaging, tools, analytics and deeper Built World intelligence.",
};
import IntelligencePortal from "@/components/IntelligencePortal";

export default function Page() {
  return <IntelligencePortal />;
}