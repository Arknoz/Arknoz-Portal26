import Link from "next/link";
import type { ReactNode } from "react";

import type { PlatformRole } from "@/lib/admin/access";

const navigation = [
  ["Overview", "/admin"],
  ["Members", "/admin/members"],
  ["Content & Publishing", "/admin/content"],
  ["Community", "/admin/community"],
  ["Placements", "/admin/placements"],
  ["System", "/admin/system"],
  ["Settings", "/admin/settings"],
] as const;

export default function AdminControlShell({
  role,
  children,
}: {
  role: PlatformRole;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">
              Arknoz
            </div>
            <div className="mt-1 text-xl font-semibold">
              Admin Control Centre
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-slate-300">
            {role}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1800px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 p-5 lg:min-h-[calc(100vh-81px)] lg:border-b-0 lg:border-r">
          <nav className="grid gap-1">
            {navigation.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </section>
      </div>
    </main>
  );
}
