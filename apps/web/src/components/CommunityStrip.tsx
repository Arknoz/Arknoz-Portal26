import Link from "next/link";

const communityItems = [
  ["Members", "Discover the Arknoz network"],
  ["Collaboration", "Find people and work together"],
  ["Contribution", "Share knowledge and corrections"],
  ["News & Development", "Arknoz updates"],
  ["Competitions & Jobs", "Professional opportunities"],
  ["Chapters", "Regional groups"],
];

export default function CommunityStrip() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="overflow-hidden rounded-3xl bg-[#0c2746] text-white">
          <div className="grid gap-8 p-8 lg:grid-cols-[320px_1fr] lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                Community
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                Community on Arknoz
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Learn. Share. Contribute. Discover the people and ideas
                shaping the Built World.
              </p>

              <Link
                href="/community"
                className="mt-7 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-[#17315c]"
              >
                Explore Community →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {communityItems.map(([title, text]) => (
                <Link
                  key={title}
                  href="/community"
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{text}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
