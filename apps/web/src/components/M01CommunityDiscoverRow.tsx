import Link from "next/link";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

export default function M01CommunityDiscoverRow() {
  return (
    <section className="bg-white py-5">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-2 lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
            ARKNOZ COMMUNITY
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            People, ideas and participation around the Built World.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Members can discover collaboration, contribute knowledge and follow Arknoz development.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Members", "Collaboration", "Contribution", "News & Development", "Competitions & Jobs", "Chapters"].map((item) => (
              <Link
                key={item}
                href="/community"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
              >
                {item}
              </Link>
            ))}
          </div>

          <Link href="/community" className="group mt-6 inline-flex items-center gap-1.5 font-semibold text-blue-700">
            Go to Community
            <ArrowRight />
          </Link>
        </div>

        <div className="rounded-3xl bg-slate-50 p-7 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
            DISCOVER NOW
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            A broader view of the Built World.
          </h2>
          <p className="mt-3 text-slate-600">
            Hand-picked cross-world discovery for visitors.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["/projects", "Buildings, infrastructure and built-environment projects."],
              ["/knowledge", "Research, standards, publications and evidence."],
              ["/places", "Countries, regions, cities and local context."],
              ["/opportunities", "Jobs, internships, competitions, grants and more."],
            ].map(([href, text]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-5 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
              >
                {text}
              </Link>
            ))}
          </div>

          <Link href="/explore" className="group mt-6 inline-flex items-center gap-1.5 font-semibold text-blue-700">
            Explore more
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
