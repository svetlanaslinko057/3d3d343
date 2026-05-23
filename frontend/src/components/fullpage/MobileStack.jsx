import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, Send, Phone, MessageCircle, X, ArrowRight, Mail } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl, mailtoUrl } from "@/lib/cta";
import Logo from "@/components/shared/Logo";
import { SlideModeContext } from "./SlideMode";

/**
 * MobileStack — vertical-scroll layout for the home page on small screens.
 * Replaces the horizontal FullPage pager when viewport < md (768px).
 *
 * Each slide is rendered inside its own <section id="slide-N"> with at least
 * one viewport height. Native vertical scroll, hash-based deep links, sticky
 * top bar and sticky bottom CTA.
 */
export default function MobileStack({ slides, labels }) {
  const total = slides.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Programmatic navigation — used by slides (e.g. "Переглянути продукцію") and
  // by the mobile sheet menu.
  const goTo = useCallback((idx) => {
    const safe = Math.max(0, Math.min(idx, total - 1));
    const el = document.getElementById(`slide-${safe + 1}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    try {
      window.history.replaceState(null, "", `/#slide-${safe + 1}`);
    } catch (_) { /* noop */ }
    setSheetOpen(false);
  }, [total]);

  // Deep-link on mount: if URL hash points to a slide, jump there.
  useEffect(() => {
    const m = (window.location.hash || "").match(/^#slide-(\d+)$/);
    if (!m) return;
    const n = parseInt(m[1], 10);
    if (Number.isNaN(n)) return;
    // Give layout a tick to settle before scrolling
    const t = setTimeout(() => goTo(n - 1), 60);
    return () => clearTimeout(t);
  }, [goTo]);

  // Hashchange listener (e.g., user clicks header logo or sheet item).
  useEffect(() => {
    const onHashChange = () => {
      const m = (window.location.hash || "").match(/^#slide-(\d+)$/);
      if (!m) return;
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) goTo(n - 1);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [goTo]);

  // Track which section is in view so chrome can highlight current page.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("[data-mobile-slide-section]")
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Update immediately for the most-visible intersecting entry. Using
        // many fine thresholds + a tighter rootMargin makes the indicator
        // feel responsive even during fast swipe scrolling.
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio > 0.15)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = parseInt(visible[0].target.getAttribute("data-mobile-slide-section"), 10);
          if (!Number.isNaN(idx)) setActiveIdx(idx);
        }
      },
      {
        // Fine-grained thresholds so the observer fires throughout the scroll
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65, 0.8],
        // Tight rootMargin biases activation toward the centre of the viewport
        rootMargin: "-30% 0px -45% 0px",
      }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [total]);

  return (
    <SlideModeContext.Provider value="mobile">
      <MobileTopBar
        index={activeIdx}
        total={total}
        labels={labels}
        goTo={goTo}
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
      />

      <main
        className="w-full bg-[#F7F7F5]"
        data-testid="mobile-stack-root"
        style={{
          paddingTop: "calc(58px + env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(var(--sticky-cta-h, 78px) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {slides.map((Slide, i) => (
          <motion.section
            id={`slide-${i + 1}`}
            key={i}
            data-mobile-slide-section={i}
            data-slide={i + 1}
            className="relative w-full"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i === 0 ? 0 : 0.05 }}
          >
            <Slide index={i} active={true} total={total} goTo={goTo} />
          </motion.section>
        ))}
      </main>

      <MobileBottomCTA />
    </SlideModeContext.Provider>
  );
}

// =====================================================================
//  Mobile top bar — logo (-> slide 1) + page indicator + burger menu
// =====================================================================
function MobileTopBar({ index, total, labels, goTo, sheetOpen, setSheetOpen }) {
  const { settings } = useSettings();
  const brand = settings?.company_name || "ПНЕВМО";
  // Slide 02 (Problem) is dark on desktop; on mobile we keep the bar light
  // since the page is scrolling and the bar floats over many backgrounds.
  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 h-[58px] bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-[#E7E7E7]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        data-testid="mobile-top-bar"
      >
        <div className="h-full px-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goTo(0)}
            className="flex items-center min-h-12 -ml-1 px-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111111]/30"
            aria-label={`${brand} — на головну`}
            data-testid="mobile-logo-button"
          >
            <Logo variant="dark" height="h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#111111] text-white text-[12.5px] font-semibold"
            aria-label="Відкрити меню"
            data-testid="mobile-menu-button"
          >
            <Menu className="h-4 w-4" />
            Меню
          </button>
        </div>
      </header>

      <MobileSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        labels={labels}
        index={index}
        goTo={goTo}
      />
    </>
  );
}

// =====================================================================
//  Mobile sheet menu — list of all 7 sections + quick contact links
// =====================================================================
function MobileSheet({ open, onClose, labels, index, goTo }) {
  const { settings } = useSettings();
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent body scroll while sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
      data-testid="mobile-pages-sheet"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-[88vw] max-w-[380px] bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex items-center justify-between px-5 h-[58px] border-b border-[#E7E7E7]">
          <span className="font-heading text-[12px] uppercase tracking-[0.14em] font-semibold text-[#888888]">
            Навігація
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 grid place-items-center rounded-full hover:bg-[#F1F1EF]"
            aria-label="Закрити меню"
            data-testid="mobile-sheet-close"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
          <ul className="flex flex-col gap-1.5">
            {labels.map((label, i) => {
              const isCurrent = i === index;
              return (
                <li key={label + i}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={`group w-full flex items-center justify-between gap-3 min-h-14 px-4 rounded-2xl text-left transition-colors ${
                      isCurrent
                        ? "bg-[#111111] text-white"
                        : "bg-white text-[#111111] hover:bg-[#F1F1EF]"
                    }`}
                    data-testid={`mobile-sheet-nav-${i + 1}`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className={`font-heading text-[12px] font-semibold tabular-nums ${isCurrent ? "text-white/60" : "text-[#999999]"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14px] font-medium truncate">{label}</span>
                    </span>
                    <ArrowRight className={`h-4 w-4 shrink-0 ${isCurrent ? "text-white" : "text-[#999999] group-hover:text-[#111111]"}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 px-4 py-4 border-t border-[#E7E7E7] grid grid-cols-1 gap-2.5" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}>
          <a
            href={telegramUrl(settings)}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 h-14 px-3 rounded-2xl bg-white border border-[#E7E7E7] hover:bg-[#FAFAF9] active:scale-[0.99] transition-all"
            data-testid="mobile-sheet-telegram"
            onClick={onClose}
          >
            <span className="shrink-0 h-10 w-10 rounded-xl bg-[#111111] text-white grid place-items-center">
              <Send className="h-4 w-4" strokeWidth={2.1} />
            </span>
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-[10px] uppercase tracking-[0.14em] font-bold text-[#888888]">Telegram</span>
              <span className="block text-[14px] font-semibold text-[#111111] truncate">@{(settings?.telegram_username || "").replace(/^@/, "")}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#999999] group-hover:text-[#111111] transition-colors" />
          </a>
          <a
            href={whatsappUrl(settings)}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 h-14 px-3 rounded-2xl bg-white border border-[#E7E7E7] hover:bg-[#FAFAF9] active:scale-[0.99] transition-all"
            data-testid="mobile-sheet-whatsapp"
            onClick={onClose}
          >
            <span className="shrink-0 h-10 w-10 rounded-xl bg-[#111111] text-white grid place-items-center">
              <MessageCircle className="h-4 w-4" strokeWidth={2.1} />
            </span>
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-[10px] uppercase tracking-[0.14em] font-bold text-[#888888]">WhatsApp</span>
              <span className="block text-[14px] font-semibold text-[#111111] truncate [font-variant-numeric:tabular-nums]">+{(settings?.whatsapp_number || "").replace(/\D/g, "")}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#999999] group-hover:text-[#111111] transition-colors" />
          </a>
          {settings?.phone ? (
            <a
              href={telUrl(settings)}
              className="group inline-flex items-center gap-3 h-14 px-3 rounded-2xl bg-[#111111] text-white active:scale-[0.99] transition-all"
              data-testid="mobile-sheet-call"
              onClick={onClose}
            >
              <span className="shrink-0 h-10 w-10 rounded-xl bg-white text-[#111111] grid place-items-center">
                <Phone className="h-4 w-4" strokeWidth={2.1} />
              </span>
              <span className="flex-1 min-w-0 text-left">
                <span className="block text-[10px] uppercase tracking-[0.14em] font-bold text-white/55">Прямий дзвінок</span>
                <span className="block text-[14px] font-semibold text-white truncate [font-variant-numeric:tabular-nums]">{settings.phone}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/60 group-hover:text-white transition-colors" />
            </a>
          ) : null}
          {settings?.email ? (
            <a
              href={mailtoUrl(settings)}
              className="group inline-flex items-center gap-3 h-12 px-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E7E7] active:scale-[0.99] transition-all"
              data-testid="mobile-sheet-email"
              onClick={onClose}
            >
              <span className="shrink-0 h-8 w-8 rounded-lg bg-white border border-[#E7E7E7] text-[#111111] grid place-items-center">
                <Mail className="h-3.5 w-3.5" strokeWidth={2.1} />
              </span>
              <span className="flex-1 min-w-0 text-left">
                <span className="block text-[13px] font-medium text-[#111111] truncate">{settings.email}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#999999]" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
//  Sticky bottom CTA — refined monochrome industrial style
//  3 unified dark buttons; channel identity comes from icons + labels,
//  no full-saturation brand colors. Premium / mono / consistent.
// =====================================================================
function MobileBottomCTA() {
  const { settings } = useSettings();
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 bg-white/96 backdrop-blur supports-[backdrop-filter]:bg-white/85 border-t border-[#E7E7E7]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-testid="mobile-sticky-cta"
    >
      <div className="px-4 py-3 grid grid-cols-3 gap-2.5">
        <a
          href={telegramUrl(settings)}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center justify-center gap-2 h-[52px] px-2 rounded-2xl bg-[#111111] text-white font-semibold text-[12.5px] active:scale-[0.97] transition-transform hover:bg-[#1F1F1F]"
          data-testid="mobile-cta-telegram"
          aria-label="Чат у Telegram"
        >
          <Send className="h-4 w-4" strokeWidth={2.1} />
          <span>Telegram</span>
        </a>
        <a
          href={whatsappUrl(settings)}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center justify-center gap-2 h-[52px] px-2 rounded-2xl bg-white border border-[#111111] text-[#111111] font-semibold text-[12.5px] active:scale-[0.97] transition-transform hover:bg-[#F1F1EF]"
          data-testid="mobile-cta-whatsapp"
          aria-label="Чат у WhatsApp"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2.1} />
          <span>WhatsApp</span>
        </a>
        <a
          href={telUrl(settings)}
          className="group inline-flex items-center justify-center gap-2 h-[52px] px-2 rounded-2xl bg-[#111111] text-white font-semibold text-[12.5px] active:scale-[0.97] transition-transform hover:bg-[#1F1F1F]"
          data-testid="mobile-cta-call"
          aria-label="Зателефонувати"
        >
          <Phone className="h-4 w-4" strokeWidth={2.1} />
          <span>Дзвінок</span>
        </a>
      </div>
    </div>
  );
}
