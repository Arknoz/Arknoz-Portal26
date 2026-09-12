import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import ArknozEmailOtpForm from "@/components/auth/ArknozEmailOtpForm";
import { sanitizeReturnTo } from "@/lib/auth/return-to";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string;
    action?: string;
  }>;
}) {
  const { returnTo, action } = await searchParams;
  const safeReturnTo = sanitizeReturnTo(returnTo);

  const signInParams = new URLSearchParams();

  if (safeReturnTo !== "/") {
    signInParams.set("returnTo", safeReturnTo);
  }

  if (action) {
    signInParams.set("action", action);
  }

  const signInQuery = signInParams.toString();
  const signInHref = signInQuery
    ? `/sign-in?${signInQuery}`
    : "/sign-in";

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Join Arknoz
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          Build your own Built World.
        </h1>

        <p className="mt-5 text-xl leading-8 text-slate-600">
          Create your free Arknoz ID to save, follow, organise,
          contribute and participate across the Built World.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            "Save projects and knowledge",
            "Follow people and organisations",
            "Build collections",
            "Personalise your interests",
            "Track opportunities",
            "Participate in Community",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 p-5 font-medium"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-7">
          <strong>Arknoz ID is free.</strong>
          <p className="mt-2 text-slate-600">
            One account connects your activity across Arknoz.
          </p>
        </div>

        <ArknozEmailOtpForm
          mode="join"
          returnTo={safeReturnTo}
          action={action}
        />

        <Link
          href={signInHref}
          className="mt-8 inline-block font-semibold text-blue-700"
        >
          Already have an Arknoz ID? Sign in →
        </Link>
      </section>

      <GlobalFooter />
    </main>
  );
}