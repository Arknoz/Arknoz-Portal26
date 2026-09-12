import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import ArknozEmailOtpForm from "@/components/auth/ArknozEmailOtpForm";
import { sanitizeReturnTo } from "@/lib/auth/return-to";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string;
    action?: string;
  }>;
}) {
  const { returnTo, action } = await searchParams;
  const safeReturnTo = sanitizeReturnTo(returnTo);

  const joinParams = new URLSearchParams();

  if (safeReturnTo !== "/") {
    joinParams.set("returnTo", safeReturnTo);
  }

  if (action) {
    joinParams.set("action", action);
  }

  const joinQuery = joinParams.toString();
  const joinHref = joinQuery ? `/join?${joinQuery}` : "/join";

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="mx-auto max-w-xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Arknoz ID
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Sign in to Arknoz
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Access your saved entities, follows, collections and member
          activity with your free Arknoz ID.
        </p>

        {action && (
          <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <strong>Your action is preserved.</strong>
            <p className="mt-1 text-sm text-slate-600">
              After authentication, Arknoz will return you to your
              original destination.
            </p>
          </div>
        )}

        <ArknozEmailOtpForm
          mode="sign-in"
          returnTo={safeReturnTo}
          action={action}
        />

        <div className="mt-7 flex flex-wrap gap-5">
          <Link
            href={safeReturnTo}
            className="font-semibold text-blue-700"
          >
            ← Return
          </Link>

          <Link
            href={joinHref}
            className="font-semibold text-blue-700"
          >
            Create free Arknoz ID →
          </Link>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}