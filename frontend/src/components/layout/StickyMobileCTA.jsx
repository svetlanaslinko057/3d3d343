import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl } from "@/lib/cta";

/**
 * Mobile-only sticky CTA that appears after user scrolls past hero.
 * Hidden on product-detail page (which already has its own bottom bar).
 * iOS safe-area-inset-bottom aware.
 */
export default function StickyMobileCTA() {
  const { settings } = useSettings();
  const location = useLocation();
  const [show, setShow] = useState(false);

  // Skip on product-detail page (has own bottom CTA) and admin
  const hidden =
    location.pathname.startsWith("/admin") ||
    /^\/catalog\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, location.pathname]);

  if (hidden) return null;

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      data-testid="mobile-sticky-cta"
      aria-hidden={!show}
    >
      <div className="mx-4 mb-4 rounded-[18px] bg-[#111111] text-white shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#2A2A2A] overflow-hidden">
        <a
          href={telegramUrl(settings)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 px-5 sm:px-5 h-[64px]"
          data-testid="mobile-sticky-cta-link"
        >
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[14px] sm:text-[15px] font-semibold tracking-tight truncate">Прайс з виробництва</span>
            <span className="text-[11px] text-[#A0A0A0] truncate">Опт · OEM · СТО · Роздріб · 20 років</span>
          </div>
          <span className="h-10 w-10 rounded-full bg-white text-[#111111] grid place-items-center shrink-0">
            <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </div>
  );
}
