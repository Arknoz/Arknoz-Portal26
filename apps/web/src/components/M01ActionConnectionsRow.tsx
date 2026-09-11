import Link from "next/link";

const chain = [
  {
    type: "PROJECT",
    title: "Bosco Verticale",
    meta: "Milan, Italy",
    href: "/projects/bosco-verticale",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
  },
  {
    type: "PERSON",
    title: "Stefano Boeri",
    meta: "Architect",
    href: "/people/stefano-boeri",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
  {
    type: "PLACE",
    title: "Milan",
    meta: "Italy",
    href: "/places/milan",
    image:
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=500&q=80",
  },
  {
    type: "KNOWLEDGE",
    title: "Urban Biodiversity",
    meta: "Global",
    href: "/knowledge/urban-biodiversity",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=500&q=80",
  },
] as const;

const updates = [
  {
    label: "EXPLORE",
    status: "Live now",
    note: "Search and discover the Built World.",
  },
  {
    label: "CONNECT",
    status: "Preview next",
    note: "Collaboration and comparison tools.",
  },
  {
    label: "INTELLIGENCE",
    status: "Planned",
    note: "Evidence-led insight when data is ready.",
  },
] as const;

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M10.5 13.5 13.5 10.5" />
      <path d="M7.5 15.5 5.8 17.2a3 3 0 1 1-4.2-4.2l3.2-3.2a3 3 0 0 1 4.2 0" />
      <path d="m16.5 8.5 1.7-1.7a3 3 0 0 1 4.2 4.2l-3.2 3.2a3 3 0 0 1-4.2 0" />
    </svg>
  );
}

export default function M01ActionConnectionsRow() {
  return (
    <section className="bg-[#f6f8fb] py-9">
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 lg:grid-cols-[.82fr_1.18fr] lg:px-10">
        <div className="relative overflow-hidden rounded-[30px] bg-[#0b2949] p-7 text-white">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=70)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b2949]/96 via-[#0b2949]/90 to-[#0b2949]/75" />

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
              YOUR BUILT WORLD
            </p>

            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Save what matters. Return to it. Follow what changes.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Arknoz becomes more useful when your saved projects, topics, places and opportunities stay connected.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Save", "Follow", "Collections", "Recent", "For You"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/14 bg-white/7 px-4 py-2 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/join"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0b2949]"
              >
                Join Arknoz
                <ArrowRight />
              </Link>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                    ARKNOZ UPDATE
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Where the platform is now.
                  </p>
                </div>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white"
                >
                  View roadmap
                  <ArrowRight />
                </Link>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {updates.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                        {item.label}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-200">
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                FOLLOW THE CONNECTION
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-slate-950">
                One record should lead naturally to the next.
              </h2>

              <p className="mt-2 max-w-2xl text-slate-600">
                Arknoz connects records across projects, people, places and knowledge when the evidence supports it.
              </p>
            </div>

            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 md:flex">
              <LinkIcon />
            </div>
          </div>

          <div className="relative mt-6">
            <div className="absolute left-[31px] top-12 bottom-12 w-px bg-gradient-to-b from-blue-300 via-slate-300 to-blue-300 sm:left-[39px]" />

            <div className="space-y-3">
              {chain.map((item, index) => (
                <div key={item.href} className="relative">
                  <div className="absolute left-[27px] top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow-sm sm:left-[35px]" />

                  <Link
                    href={item.href}
                    className="group grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-[20px] border border-slate-200 bg-[#f8fafc] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/70 sm:grid-cols-[80px_1fr_auto]"
                  >
                    <div className="relative z-20 h-16 w-16 overflow-hidden rounded-[16px] bg-slate-100 sm:h-20 sm:w-20">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                        {item.type}
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-950">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                    </div>

                    <span className="text-blue-700">
                      <ArrowRight />
                    </span>
                  </Link>

                  {index < chain.length - 1 && (
                    <div className="ml-[31px] h-3 sm:ml-[39px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            Relationships appear only when Arknoz has evidence for the connection.
          </p>
        </div>
      </div>
    </section>
  );
}
