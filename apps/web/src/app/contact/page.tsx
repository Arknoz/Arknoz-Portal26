import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find the right Arknoz contact path for business, partnerships, Community, contributions, Arknoz Pro and general enquiries.",
};
import Link from "next/link";

import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

const contactAreas = [
  {
    title: "Business",
    description:
      "For practices, companies, manufacturers, developers, employers and other Built World organisations.",
    href: "/business",
    action: "For Business",
  },
  {
    title: "Partnerships",
    description:
      "For universities, institutions, research organisations and strategic collaboration.",
    href: "/partnerships",
    action: "Partnerships",
  },
  {
    title: "Community",
    description:
      "For participation, professional collaboration, contribution and Arknoz member activity.",
    href: "/community",
    action: "Arknoz Community",
  },
  {
    title: "Contributions",
    description:
      "For contributing projects, knowledge, research and other verified Built World material.",
    href: "/contribute",
    action: "Contribute",
  },
  {
    title: "Arknoz Pro",
    description:
      "For future professional workspaces, tools and intelligence. Arknoz Pro is coming later.",
    href: "/intelligence",
    action: "Arknoz Pro · Coming Later",
  },
  {
    title: "General Enquiries",
    description:
      "Direct contact channels will be activated as part of the Arknoz domain and communication launch.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <UniversalPublicFirstScreen
        eyebrow="CONTACT"
        breadcrumb={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Contact",
          },
        ]}
        title="Contact Arknoz."
        description="Find the right route for business, partnerships, community, contributions and professional access across the Arknoz Built World network."
        searchPlaceholder="Search Arknoz..."
        popular={[
          {
            label: "Explore",
            href: "/explore",
          },
          {
            label: "Projects",
            href: "/projects",
          },
          {
            label: "Knowledge",
            href: "/knowledge",
          },
          {
            label: "People",
            href: "/people",
          },
        ]}
        featured={[]}
        ticker={[]}
      />

      <section className="bg-[#f6f8fb] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1600px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
            CONTACT ARKNOZ
          </p>

          <h2 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Start with the area that matches what you need.
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Arknoz routes enquiries through the relevant part of the platform.
            Direct communication channels will be added when the Arknoz domain
            and communication system are activated.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contactAreas.map((area) => {
              const content = (
                <>
                  <h3 className="text-xl font-semibold tracking-[-0.025em]">
                    {area.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {area.description}
                  </p>

                  {area.href ? (
                    <p className="mt-6 text-sm font-semibold text-blue-700">
                      {area.action} &rarr;
                    </p>
                  ) : (
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Contact channel coming with launch
                    </p>
                  )}
                </>
              );

              return area.href ? (
                <Link
                  key={area.title}
                  href={area.href}
                  className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={area.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-6"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <UniversalPublicLastScreen />
    </main>
  );
}
