import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { searchArknoz } from "@/lib/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchArknoz(q);

  return (
    <main className="min-h-screen bg-white">
      <GlobalHeader />

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Arknoz Search
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Search the Built World
          </h1>

          <form action="/search" className="mt-8 flex max-w-4xl rounded-full border border-slate-300 bg-white p-1.5">
            <input
              name="q"
              defaultValue={q}
              placeholder="Projects, products, knowledge, people, places..."
              className="min-w-0 flex-1 bg-transparent px-5 py-3 outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-[#17315c] px-7 py-3 font-semibold text-white"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        {q && (
          <p className="text-slate-600">
            Results for <strong className="text-slate-950">“{q}”</strong>
          </p>
        )}

        {q && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-xl font-bold">
              No exact result yet
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Try a broader subject, country, project, organisation or
              professional term.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/explore" className="font-semibold text-blue-700">
                Explore the Built World →
              </Link>

              <Link href="/global" className="font-semibold text-blue-700">
                Explore by geography →
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((result) => (
            <Link
              key={`${result.kind}-${result.href}`}
              href={result.href}
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                {result.subtitle}
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {result.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {result.geography}
              </p>

              <p className="mt-4 leading-6 text-slate-600">
                {result.description}
              </p>

              <p className="mt-5 font-semibold text-blue-700">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}
