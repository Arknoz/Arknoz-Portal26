import Link from "next/link";

import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <GlobalHeader />

      <section className="bg-[#071b31] text-white">
        <div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
            About Arknoz
          </p>

          <h1 className="mt-4 max-w-5xl text-4xl font-bold tracking-tight md:text-6xl">
            One connected knowledge and project platform for the Built World.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Arknoz connects projects, products, knowledge, learning,
            opportunities, people, organisations, universities, places,
            community and professional intelligence in one global system.
          </p>
        </div>
      </section>

      <section
        id="mission"
        className="bg-white py-16"
      >
        <div className="mx-auto grid max-w-[1600px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Our Mission
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Make Built World knowledge easier to discover, connect and use.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Arknoz is designed as a connected global platform rather than
              a collection of disconnected directories.
            </p>

            <p>
              Genuine records, geographic context and relationships are used
              to help people move between projects, products, knowledge,
              institutions, opportunities and places without inventing
              activity or unsupported connections.
            </p>

            <p>
              The platform is being developed progressively, with the free
              knowledge and discovery foundation first and deeper professional
              capabilities introduced in later phases.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fb] py-16">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Arknoz Platform
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Discover", "Projects, products, people, organisations, universities and places."],
              ["Understand", "Knowledge, research, references, learning and connected evidence."],
              ["Participate", "Opportunities, contribution, collaboration and Arknoz Community."],
              ["Connect", "Professional workflows and tools planned as part of Arknoz Pro."],
              ["Intelligence", "Decision-support and Built World intelligence planned for a later phase."],
              ["Global", "A geography-aware structure from global context to continents, countries, regions and cities."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-[24px] border border-slate-200 bg-white p-6"
              >
                <h3 className="text-xl font-bold">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/#roadmap"
            className="mt-8 inline-flex font-semibold text-blue-700"
          >
            View Arknoz roadmap →
          </Link>
        </div>
      </section>

      <section
        id="contact"
        className="bg-white py-16"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Contact & Support
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Arknoz is currently being prepared for its wider launch.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Dedicated contact, help and support channels will be published
            before wider public access.
          </p>
        </div>
      </section>

      <section className="bg-[#f6f8fb] py-16">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Policies
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Privacy, terms and accessibility
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Final privacy, terms of use and accessibility documentation will
            be published before Arknoz enters wider public operation. Arknoz
            will not present unfinished policy text as final legal terms.
          </p>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}