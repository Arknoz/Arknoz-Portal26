export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-[72px] border-b border-slate-200 bg-white" />

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded bg-slate-200" />

          <div className="mt-5 h-14 max-w-2xl rounded bg-slate-200" />

          <div className="mt-5 h-6 max-w-xl rounded bg-slate-100" />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 rounded-2xl border border-slate-100 bg-slate-100"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
