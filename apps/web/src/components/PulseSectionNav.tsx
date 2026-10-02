"use client";

import { useEffect, useRef, useState } from "react";

const items = [
  ["Latest", "latest"],
  ["Architecture", "architecture"],
  ["Construction", "construction"],
  ["Infrastructure", "infrastructure"],
  ["Cities", "cities"],
  ["Materials", "materials"],
  ["Sustainability", "sustainability"],
  ["Technology", "technology"],
  ["Business", "business"],
  ["Research", "research"],
  ["Education", "education"],
  ["World", "world"],
  ["Magazine", "magazine"],
  ["Books", "books"],
] as const;

export default function PulseSectionNav() {
  const [active, setActive] = useState("latest");
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ids = items.map(([, id]) => id);

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top)
          );

        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(
      `[data-pulse-id="${active}"]`
    );

    if (activeLink instanceof HTMLElement) {
      activeLink.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

  function goToSection(id: string) {
    const target = document.getElementById(id);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  }

  return (
    <nav
      ref={navRef}
      aria-label="Pulse sections"
      className="flex items-end gap-5 overflow-x-auto whitespace-nowrap text-[12px] font-semibold text-slate-600 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map(([label, id]) => {
        const isActive = active === id;

        return (
          <button
            key={id}
            type="button"
            data-pulse-id={id}
            onClick={() => goToSection(id)}
            className={
              isActive
                ? "shrink-0 border-b-2 border-red-500 pb-2 text-slate-950"
                : "shrink-0 border-b-2 border-transparent pb-2 transition hover:border-slate-300 hover:text-slate-950"
            }
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
