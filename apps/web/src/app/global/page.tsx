import GeographyPage from "@/components/geography/GeographyPage";
import { findGeography } from "@/lib/geography";

export default function GlobalPage() {
  const context = findGeography("global")!;

  return <GeographyPage context={context} />;
}
