import type { ReactNode } from "react";

import AdminControlShell from "@/components/AdminControlShell";
import { requirePlatformConsoleUser } from "@/lib/admin/access";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { role } =
    await requirePlatformConsoleUser("/admin");

  return (
    <AdminControlShell role={role}>
      {children}
    </AdminControlShell>
  );
}
