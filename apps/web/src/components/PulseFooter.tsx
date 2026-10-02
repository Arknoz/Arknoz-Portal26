import Link from "next/link";

export default function PulseFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#06192e] text-slate-300">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-5 px-5 py-5 text-[12px] lg:flex-row lg:items-center lg:justify-between lg:px-8">

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-white">
            English
          </span>

          <Link
            href="/global"
            className="rounded-full border border-white/15 px-3 py-1.5 text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Global
          </Link>
        </div>

        <nav
          aria-label="Pulse footer navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <Link
            href="/about"
            className="transition hover:text-white"
          >
            About
          </Link>

          <Link
            href="/featured"
            className="transition hover:text-white"
          >
            Featured
          </Link>

          <Link
            href="/community"
            className="transition hover:text-white"
          >
            Community
          </Link>

          <Link
            href="/contribute"
            className="transition hover:text-white"
          >
            Contribution
          </Link>

          <Link
            href="/about"
            className="transition hover:text-white"
          >
            Privacy
          </Link>

          <Link
            href="/about"
            className="transition hover:text-white"
          >
            Terms
          </Link>

          <Link
            href="/about"
            className="transition hover:text-white"
          >
            Accessibility
          </Link>
        </nav>

        <div className="text-left leading-5 text-slate-400 lg:text-right">
          <p>© 2026 Arknoz Private Limited.</p>
          <p>Knowledge today. A better built tomorrow.</p>
        </div>
      </div>
    </footer>
  );
}
