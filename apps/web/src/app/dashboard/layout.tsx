import type { ReactNode } from "react";

import { requireDashboardUser } from "@/lib/dashboard/access";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDashboardUser(
    "/dashboard"
  );

  return children;
}
