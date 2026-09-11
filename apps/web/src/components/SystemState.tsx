import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function SystemState({
  eyebrow = "Arknoz",
  title,
  description,
  primaryLabel = "Go to Global Home",
  primaryHref = "/",
  secondaryLabel = "Explore the Built World",
  secondaryHref = "/explore",
}: Props) {
  return (
    <section className="flex min-h-[65vh] items-center bg-white">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-20 text-center lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          {description}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href={primaryHref}
            className="rounded-full bg-[#17315c] px-6 py-3 font-semibold text-white"
          >
            {primaryLabel}
          </Link>

          <Link
            href={secondaryHref}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
