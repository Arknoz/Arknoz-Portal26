import UniversalPublicFirstScreen from "@/components/UniversalPublicFirstScreen";
import UniversalPublicLastScreen from "@/components/UniversalPublicLastScreen";

type PolicySection = {
  title: string;
  body: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  sections: PolicySection[];
};

export default function PublicPolicyPage({
  eyebrow,
  title,
  description,
  sections,
}: Props) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <UniversalPublicFirstScreen
        eyebrow={eyebrow}
        breadcrumb={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: title,
          },
        ]}
        title={title}
        description={description}
        searchPlaceholder="Search Arknoz..."
        popular={[
          {
            label: "Explore",
            href: "/explore",
          },
          {
            label: "About",
            href: "/about",
          },
          {
            label: "Contact",
            href: "/contact",
          },
        ]}
        featured={[]}
        ticker={[]}
      />

      <section className="bg-[#f6f8fb] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
            {eyebrow}
          </p>

          <div className="mt-8 space-y-4">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8"
              >
                <h2 className="text-xl font-semibold tracking-[-0.025em] text-slate-950">
                  {section.title}
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <UniversalPublicLastScreen />
    </main>
  );
}
