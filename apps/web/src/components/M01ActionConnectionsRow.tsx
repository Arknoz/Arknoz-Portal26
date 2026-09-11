import Link from "next/link";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function M01ActionConnectionsRow() {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-3xl bg-[#0d2a4a] p-7 text-white shadow-[0_20px_45px_rgba(13,42,74,0.12)] md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200">
            YOUR BUILT WORLD
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Be part of a more connected Built World.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Save what matters, follow topics and places, build collections and continue where you left off.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Save & follow", "Collections", "Opportunities", "Personal discovery"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm transition hover:bg-white/[0.1]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/join"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0d2a4a] transition hover:bg-blue-50"
            >
              Join Arknoz
              <ArrowRight />
            </Link>
            <span className="text-xs text-slate-300">
              Phase 1 membership remains free.
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
            CONNECTED RECORDS
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Follow the Connections
          </h2>
          <p className="mt-2 text-slate-600">
            See how one Built World record leads naturally to another.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold">
            {["Project", "Product / System", "Knowledge", "People / Organisation", "Place"].map((item, index, arr) => (
              <div key={item} className="contents">
                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-blue-300 hover:bg-blue-50">
                  {item}
                </span>
                {index < arr.length - 1 && (
                  <span className="text-blue-700">
                    <ArrowRight />
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
            Factual links show why records are connected when evidence supports the relationship.
          </p>
        </div>
      </div>
    </section>
  );
}
