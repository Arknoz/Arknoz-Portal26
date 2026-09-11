import Link from "next/link";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

const discover = [
  ["Show me inspiring projects", "/projects"],
  ["Take me somewhere in the world", "/global"],
  ["Teach me something useful", "/knowledge"],
  ["Show current opportunities", "/opportunities"],
  ["Find people and organisations", "/people"],
  ["Explore universities", "/universities"],
] as const;

export default function M01CommunityDiscoverRow() {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-[.88fr_1.12fr] lg:px-10">
        <div className="relative overflow-hidden rounded-[30px] bg-[#0b2949] p-7 text-white">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[#0b2949]/88" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
              ARKNOZ COMMUNITY
            </p>
            <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
              Knowledge grows when people contribute.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              Community is where participation, collaboration and useful contribution become part of the Built World.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {["Members", "Collaboration", "Contribution", "News & Development", "Competitions & Jobs", "Chapters"].map((item) => (
                <Link
                  key={item}
                  href="/community"
                  className="group flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.1]"
                >
                  <span>{item}</span>
                  <span className="text-blue-200"><ArrowRight /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[30px] bg-[#f4f7fb] p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
            DISCOVER NOW
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Start with what you want to do.
          </h2>
          <p className="mt-2 text-slate-600">
            Arknoz should feel useful before a visitor understands its entire structure.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {discover.map(([label, href], index) => (
              <Link
                key={label}
                href={href}
                className={`group flex min-h-[82px] items-center justify-between gap-4 rounded-[20px] px-5 py-4 font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  index === 0 ? "bg-[#0f55c8] text-white" : "bg-white text-slate-950"
                }`}
              >
                <span>{label}</span>
                <span className={index === 0 ? "text-white" : "text-blue-700"}>
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>

          <Link href="/explore" className="group mt-5 inline-flex items-center gap-1.5 font-semibold text-blue-700">
            Open full Explore
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
