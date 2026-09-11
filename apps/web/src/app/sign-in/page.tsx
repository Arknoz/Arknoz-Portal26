import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string;
    action?: string;
  }>;
}) {
  const { returnTo = "/", action } = await searchParams;

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
          Your Arknoz ID will keep your saved entities, follows,
          collections and preferences together.
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

        <div className="mt-8 rounded-2xl border border-slate-200 p-7">
          <p className="font-semibold">
            Authentication integration is the next production step.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We will connect this screen to Supabase Auth rather than
            creating fake local authentication.
          </p>
        </div>

        <div className="mt-7 flex gap-5">
          <Link
            href={returnTo}
            className="font-semibold text-blue-700"
          >
            ← Return
          </Link>

          <Link
            href="/join"
            className="font-semibold text-blue-700"
          >
            Create Arknoz ID →
          </Link>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}
