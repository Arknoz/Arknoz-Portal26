import Link from "next/link";

import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";


type DestinationCard = {
  title: string;
  description: string;
  href?: string;
};


type Props = {
  title: string;
  description: string;
  cards: DestinationCard[];
};


export default function PublicDestinationPage({
  title,
  description,
  cards,
}: Props) {

  return (
    <main className="min-h-screen bg-white text-slate-950">

      <UniversalPublicFirstScreen
        eyebrow={title.toUpperCase()}
        breadcrumb={[
          {
            label: "Explore",
            href: "/explore",
          },
          {
            label: title,
          },
        ]}
        title={`Explore ${title}.`}
        description={description}
        searchPlaceholder={`Search Arknoz ${title.toLowerCase()}...`}
        popular={[
          {
            label: "Projects",
            href: "/projects",
          },
          {
            label: "Products",
            href: "/products",
          },
          {
            label: "Knowledge",
            href: "/knowledge",
          },
          {
            label: "Opportunities",
            href: "/opportunities",
          },
          {
            label: "People",
            href: "/people",
          },
          {
            label: "Organisations",
            href: "/organisations",
          },
        ]}
        featured={[]}
        ticker={[]}
      />


      <section className="bg-[#f6f8fb] px-5 py-14 sm:px-6 lg:px-8 lg:py-18">

        <div className="mx-auto max-w-[1720px]">

          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
            {title}
          </p>

          <h2 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Connected through the Arknoz Built World system.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {cards.map((card) => {

              const content = (
                <>
                  <h3 className="text-xl font-semibold tracking-[-0.025em]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>

                  {card.href ? (
                    <p className="mt-5 text-sm font-semibold text-blue-700">
                      Explore →
                    </p>
                  ) : null}
                </>
              );

              return card.href ? (
                <Link
                  key={card.title}
                  href={card.href}
                  className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={card.title}
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
