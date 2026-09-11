import Link from "next/link";
import type { GeographyItem } from "@/lib/geography";

const items = [
  ["Projects", "/projects"],
  ["Products", "/products"],
  ["Knowledge", "/knowledge"],
  ["Learning & Education", "/learning"],
  ["Opportunities", "/opportunities"],
  ["People", "/people"],
  ["Organisations", "/organisations"],
  ["Universities", "/universities"],
  ["Places", "/places"],
  ["Community", "/community"],
];

export default function GeographyContextBar({
  context,
}: {
  context: GeographyItem;
}) {
  if (context.type === "global") return null;

  return (
    <div className="sticky top-[72px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-6 overflow-x-auto px-6 py-3 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:px-10">
        <Link
          href={`/global/${context.slug}`}
          className="shrink-0 font-bold text-[#17315c]"
        >
          {context.name} Home
        </Link>

        {items.map(([label, href]) => (
          <Link
            key={href}
            href={`${href}?geo=${context.slug}`}
            className="shrink-0 text-slate-600 transition hover:text-[#17315c]"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
