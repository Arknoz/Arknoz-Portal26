import type { Metadata } from "next";
import Link from "next/link";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import { requireProUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Professional Tools | My Arknoz",
};

const TOOLS = [
  {
    title: "Arknoz CV",
    description:
      "Live structured professional record.",
    href: "/dashboard/arknoz-cv",
  },
  {
    title: "Services",
    description:
      "Prepare and manage professional service records.",
    href: "/dashboard/services",
  },
  {
    title: "Messages",
    description:
      "Exclusive Pro-to-Pro professional messaging.",
    href: "/dashboard/messages",
  },
  {
    title: "Advanced Analytics",
    description:
      "Analyse your genuine Arknoz account records.",
    href: "/dashboard/advanced-analytics",
  },
  {
    title: "Contributions",
    description:
      "Access structured Arknoz contribution workflows.",
    href: "/dashboard/contributions",
  },
];

export default async function ProfessionalToolsPage() {
  await requireProUser(
    "/dashboard/professional-tools"
  );

  return (
    <DashboardModuleFrame
      eyebrow="ARKNOZ PRO"
      title="Professional Tools"
      description="One Pro workspace for higher-value professional capabilities across Arknoz."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-sm"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
              PRO TOOL
            </p>

            <h2 className="mt-2 text-lg font-bold text-[#17315c]">
              {tool.title}
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {tool.description}
            </p>

            <p className="mt-5 text-xs font-bold text-blue-700">
              Open
            </p>
          </Link>
        ))}
      </div>
    </DashboardModuleFrame>
  );
}