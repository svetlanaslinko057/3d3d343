import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "production", num: "01", label: "Виробництво" },
  { id: "pain", num: "02", label: "Проблема і рішення" },
  { id: "categories", num: "03", label: "Категорії" },
  { id: "featured", num: "04", label: "Популярні" },
  { id: "use-cases", num: "05", label: "Для кого" },
  { id: "why-us", num: "06", label: "Чому ми" },
  { id: "cases", num: "07", label: "Кейси" },
  { id: "testimonials", num: "08", label: "Відгуки" },
  { id: "process", num: "09", label: "Процес" },
  { id: "faq", num: "10", label: "FAQ" },
  { id: "contact", num: "11", label: "Контакти" },
];

export default function SectionNav() {
  const [active, setActive] = useState("production");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          const id = visible[0].target.id;
          if (id) setActive(id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleClick = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Навігація по секціях"
      className="hidden xl:block fixed right-5 2xl:right-8 top-1/2 -translate-y-1/2 z-30"
      data-testid="section-nav"
    >
      <ol className="flex flex-col gap-1">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="relative group">
              <a
                href={`#${s.id}`}
                onClick={handleClick(s.id)}
                className="flex items-center gap-3 py-1.5 pr-2"
                aria-current={isActive ? "location" : undefined}
                data-testid={`section-nav-${s.id}`}
              >
                {/* Dot / line */}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-[3px] w-6 bg-[#111111]"
                      : "h-[3px] w-3 bg-[#B8B8B6] group-hover:w-5 group-hover:bg-[#555555]"
                  }`}
                />
                {/* Label (shows on hover only) */}
                <span
                  className="text-[11px] font-semibold tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-200 text-[#111111] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white border border-[#E7E7E7] rounded-full px-3 py-1 shadow-sm"
                >
                  <span className="font-heading text-[#999999] mr-1.5">{s.num}</span>
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
