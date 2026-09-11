import Image from "next/image";
import Link from "next/link";
import FooterMetricsPanel, {
  type FooterMetrics,
} from "@/components/FooterMetricsPanel";
import LanguageControl from "@/components/LanguageControl";

const exploreA = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
];

const exploreB = [
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
  ["Community", "/community"],
];

const discover = [
  ["Global", "/global"],
  ["Africa", "/global/africa"],
  ["Asia", "/global/asia"],
  ["Europe", "/global/europe"],
  ["North America", "/global/north-america"],
  ["South America", "/global/south-america"],
  ["Oceania", "/global/oceania"],
];

const arknoz = [
  ["About Arknoz", "/about"],
  ["Our Mission", "/about"],
  ["Contribute", "/community"],
  ["Contact", "/about"],
  ["Help Centre", "/about"],
  ["Privacy", "/about"],
  ["Terms", "/about"],
  ["Accessibility", "/about"],
];

export default function GlobalFooter({
  metrics,
}: {
  metrics?: FooterMetrics;
}) {
  return (
    <footer className="bg-[#06192e] text-slate-300">
      <div className="mx-auto max-w-[1600px] px-6 pt-6 pb-4 lg:px-10">
        <FooterMetricsPanel metrics={metrics} />

        <div className="mt-6 grid gap-7 lg:grid-cols-[1.15fr_.8fr_.85fr_1.15fr]">
          <div>
            <h3 className="text-sm font-bold text-white">Explore Arknoz</h3>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1.5 text-[13px] leading-5">
              <div className="grid content-start gap-1.5">
                {exploreA.map(([label, href]) => (
                  <Link key={label} href={href} className="hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>

              <div className="grid content-start gap-1.5">
                {exploreB.map(([label, href]) => (
                  <Link key={label} href={href} className="hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-5 max-w-md text-[13px] leading-5 text-slate-400">
              One global portal connecting people, places, projects, products,
              knowledge, learning and opportunities across the Built World.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Discover</h3>
            <div className="mt-4 grid gap-1.5 text-[13px] leading-5">
              {discover.map(([label, href]) => (
                <Link key={label} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Arknoz</h3>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1.5 text-[13px] leading-5 lg:grid-cols-1">
              {arknoz.map(([label, href]) => (
                <Link key={label} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <LanguageControl dark />

              <Link
                href="/global"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
              >
                 Global
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">Stay informed</h3>
            <p className="mt-4 max-w-sm text-[13px] leading-5">
              Projects, knowledge, opportunities and Arknoz developments.
            </p>

            <form className="mt-4 flex">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Your email address"
                className="min-w-0 flex-1 rounded-l-lg bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-200">
                Community
              </p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-5">
                <Link href="/community" className="hover:text-white">Members</Link>
                <Link href="/community" className="hover:text-white">Collaboration</Link>
                <Link href="/community" className="hover:text-white">Contribution</Link>
                <Link href="/community" className="hover:text-white">Chapters</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
            <div className="rounded-xl bg-white px-3 py-2.5">
              <Image
                src="/brand/arknoz-logo.png"
                alt="Arknoz - The Digital Built World"
                width={210}
                height={54}
                className="h-auto w-[205px] max-w-full object-contain"
              />
            </div>

            <div className="text-[11px] leading-5 text-slate-400">
              <p>(c) 2026 Arknoz Private Limited. All rights reserved.</p>
              <p className="mt-0.5">English is the Arknoz interface language.</p>
            </div>

            <div className="flex flex-col items-start gap-1 text-[11px] text-slate-400 md:items-end">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link href="/about" className="hover:text-white">Privacy</Link>
                <Link href="/about" className="hover:text-white">Terms</Link>
                <Link href="/about" className="hover:text-white">Accessibility</Link>
              </div>
              <span>Knowledge today. A better built tomorrow.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
