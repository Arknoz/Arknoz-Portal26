import Link from "next/link";

export default function JoinBand() {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div
          className="relative overflow-hidden rounded-3xl bg-[#0b2a49] text-white"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(5,25,48,.97),rgba(7,44,77,.82)),url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid gap-7 px-7 py-8 md:grid-cols-[1fr_auto] md:items-center lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                Your Built World
              </p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Be part of a more connected Built World.
              </h2>
              <p className="mt-3 max-w-3xl text-slate-200">
                Save what matters, follow topics and places, organise
                collections and receive relevant updates.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
                <span>☆ Save & follow</span>
                <span>◎ Build collections</span>
                <span>↗ Follow opportunities</span>
                <span>✦ Personalise discovery</span>
              </div>
            </div>

            <Link
              href="/join"
              className="inline-flex min-w-[190px] items-center justify-between rounded-full bg-white px-6 py-4 font-bold text-[#0b2a49] shadow-xl transition hover:-translate-y-0.5"
            >
              Join Now <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
