export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="h-[72px] border-b border-slate-200 bg-white" />

      <section className="mx-auto max-w-[1720px] px-6 py-16 lg:px-10">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-5 h-12 max-w-2xl rounded bg-slate-200" />
          <div className="mt-5 h-6 max-w-xl rounded bg-slate-100" />
          <div className="mt-10 h-20 rounded-[30px] bg-slate-100" />
        </div>
      </section>
    </main>
  );
}
