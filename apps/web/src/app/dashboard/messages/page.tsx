import type { Metadata } from "next";
import Link from "next/link";

import GlobalFooter from "@/components/GlobalFooter";
import GlobalHeader from "@/components/GlobalHeader";
import MemberMessagesInbox from "@/components/MemberMessagesInbox";
import { requireProUser } from "@/lib/dashboard/access";

export const metadata: Metadata = {
  title: "Messages | My Arknoz",
};

export default async function MessagesPage() {
  await requireProUser(
    "/dashboard/messages"
  );

  return (
    <>
      <GlobalHeader />

      <main className="min-h-screen bg-[#f7f9fc]">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1512px] px-5 py-8 sm:px-8 lg:px-10">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-blue-700"
            >
              &larr; My Arknoz
            </Link>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              PRIVATE COMMUNICATION
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#17315c] sm:text-4xl">
              Messages
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Manage genuine professional conversations created through Arknoz
              connections and contact flows.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1512px] px-5 py-8 sm:px-8 lg:px-10">
          <MemberMessagesInbox />
        </section>
      </main>

      <GlobalFooter />
    </>
  );
}
