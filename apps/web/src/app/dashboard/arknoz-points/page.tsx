import type { Metadata } from "next";

import DashboardModuleFrame from "@/components/DashboardModuleFrame";
import { requireDashboardUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Arknoz Points | My Arknoz",
};

export default async function ArknozPointsPage() {
  const user = await requireDashboardUser(
    "/dashboard/arknoz-points"
  );

  const rawPoints =
    user.app_metadata?.arknoz_points;

  const points =
    typeof rawPoints === "number" &&
    Number.isFinite(rawPoints)
      ? rawPoints
      : 0;

  return (
    <DashboardModuleFrame
      eyebrow="MEMBER VALUE"
      title="Arknoz Points"
      description="View your server-controlled Arknoz Points balance and future reward status."
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[24px] border border-slate-200 bg-white p-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            VERIFIED BALANCE
          </p>

          <p className="mt-4 text-5xl font-bold tracking-tight text-[#17315c]">
            {points.toLocaleString()}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Points are controlled by Arknoz and
            cannot be edited through your member
            profile.
          </p>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-bold text-[#17315c]">
            Points programme
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Arknoz will award points only through
            defined eligible activity. No points
            are fabricated from profile completion,
            popularity or unverified activity.
          </p>

          <div className="mt-5 rounded-[16px] border border-blue-100 bg-blue-50/60 px-4 py-4">
            <p className="text-xs font-bold text-[#17315c]">
              Reward rules are not active yet
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Future reward rules can be introduced
              without changing Free or Pro
              membership status.
            </p>
          </div>
        </section>
      </div>
    </DashboardModuleFrame>
  );
}