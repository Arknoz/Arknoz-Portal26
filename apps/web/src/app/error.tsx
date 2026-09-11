"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Something went wrong
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
          Arknoz could not complete this request.
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Your previous page and account data have not been intentionally changed.
          You can try the request again or return to a safe Arknoz destination.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[#17315c] px-6 py-3 font-semibold text-white"
          >
            Try again
          </button>

          <Link
            href="/"
            className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-800"
          >
            Global Home
          </Link>

          <Link
            href="/explore"
            className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-800"
          >
            Explore
          </Link>
        </div>
      </div>
    </main>
  );
}
