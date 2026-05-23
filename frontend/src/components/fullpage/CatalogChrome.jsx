import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Phone, MessageCircle, Send, ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, telUrl, whatsappUrl } from "@/lib/cta";
import Logo from "@/components/shared/Logo";

const HEADER_H = 56;
const EASE = [0.22, 1, 0.36, 1];

/**
 * Catalog Chrome — all home-only UI around the horizontal pager:
 * - Thin top bar (brand + current page title + CTA)
 * - Right vertical numeric rail 01..10
 * - Edge click zones (left/right) for prev/next on desktop
 * - Floating Contacts CTA bottom-right
 * - Mobile pages sheet
 */
export default function CatalogChrome({ index, total, labels, goTo }) {
  const { settings } = useSettings();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const current = labels?.[index] || `Сторінка ${index + 1}`;
  const brand = settings?.company_name || "ПНЕВМО";
  const isFirst = index === 0;
  const isLast = index === total - 1;
  // Dark slides — page index (0-based) for the current 5-slide funnel:
  //   01 Hero (light), 02 Manufacturing (DARK), 03 Products (light),
  //   04 Partners (light), 05 Final (DARK).
  const DARK_SLIDES = [1, 4];
  const isDark = DARK_SLIDES.includes(index);

  return (
    <>
      {/* ============================= TOP BAR ============================= */}
      <header
        data-testid="catalog-top-bar"
        style={{ height: HEADER_H }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          isDark
            ? "bg-[#111111]/80 backdrop-blur-md border-b border-white/10"
            : "bg-white/88 backdrop-blur-md border-b border-[#E7E7E7]"
        }`}
      >
        <div className="h-full pl-4 sm:pl-6 pr-3 sm:pr-5 flex items-center justify-between gap-3">
          {/* LEFT: Logo — clicking always returns to slide 1 (Hero) */}
          <button
            type="button"
            onClick={() => {
              goTo(0);
              // Also sync hash for deep linking
              try {
                if (window.location.hash !== "#slide-1") {
                  window.history.replaceState(null, "", "/#slide-1");
                }
              } catch (_) { /* noop */ }
            }}
            className="shrink-0 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#111111]/30 rounded-md"
            aria-label={`${brand} — на головну`}
            data-testid="header-logo-link"
          >
            <Logo variant={isDark ? "light" : "dark"} height="h-4 sm:h-4 lg:h-5" />
          </button>

          {/* CENTER: current slide label + page-index pips (desktop) */}
          <div
            className="hidden md:flex items-center gap-3 flex-1 justify-center min-w-0"
            data-testid="catalog-top-progress"
          >
            <span className={`text-[11px] tracking-[0.18em] uppercase font-semibold [font-variant-numeric:tabular-nums] transition-colors duration-500 ${
              isDark ? "text-white" : "text-[#111111]"
            }`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div
              className={`flex items-center gap-[5px] rounded-full px-1.5 py-1 border transition-colors duration-500 ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-[#F1F1EF] border-[#E7E7E7]"
              }`}
              role="tablist"
              aria-label="Сторінки каталогу"
            >
              {Array.from({ length: total }).map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => goTo(i)}
                    aria-label={`Сторінка ${String(i + 1).padStart(2, "0")}${
                      labels?.[i] ? ": " + labels[i] : ""
                    }`}
                    data-testid={`top-progress-pip-${String(i + 1).padStart(2, "0")}`}
                    className={`h-[6px] rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      active
                        ? (isDark ? "w-8 bg-white focus:ring-white focus:ring-offset-[#111]" : "w-8 bg-[#111111] focus:ring-[#111] focus:ring-offset-white")
                        : (isDark ? "w-[14px] bg-white/35 hover:bg-white/70 hover:w-4" : "w-[14px] bg-[#B8B8B6] hover:bg-[#555555] hover:w-4")
                    }`}
                  />
                );
              })}
            </div>
            <span className={`text-[11px] tracking-[0.16em] uppercase font-bold truncate max-w-[220px] transition-colors duration-500 ${
              isDark ? "text-white" : "text-[#111111]"
            }`}>
              {current}
            </span>
          </div>

          {/* RIGHT: desktop phone + contact CTA; mobile burger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {settings?.phone ? (
              <a
                href={telUrl(settings)}
                className={`hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-[12.5px] font-medium transition-colors [font-variant-numeric:tabular-nums] ${
                  isDark ? "text-white hover:bg-white/10" : "text-[#1A1A1A] hover:bg-[#F1F1EF]"
                }`}
                data-testid="header-phone-link"
              >
                <Phone className="h-3.5 w-3.5" />
                {settings.phone}
              </a>
            ) : null}
            <a
              href={telegramUrl(settings)}
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[12.5px] font-semibold transition-colors ${
                isDark
                  ? "bg-white text-[#111111] hover:bg-[#F1F1EF]"
                  : "bg-[#111111] text-white hover:bg-[#2A2A2A]"
              }`}
              data-testid="header-contacts-cta-button"
            >
              <Send className="h-3.5 w-3.5" />
              Залишити заявку
            </a>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className={`sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors ${
                isDark
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-[#E7E7E7] bg-white text-[#111111]"
              }`}
              aria-label="Відкрити індекс сторінок"
              data-testid="header-mobile-menu-button"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================= RIGHT RAIL (DESKTOP) ============================= */}
      <nav
        aria-label="Catalog pages"
        data-testid="slide-rail"
        className={`hidden md:flex fixed right-3 xl:right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-0.5 rounded-full backdrop-blur-md border px-1.5 py-2 transition-colors duration-500 ${
          isDark
            ? "bg-white/10 border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            : "bg-white/85 border-[#E7E7E7] shadow-[0_8px_24px_rgba(17,17,17,0.06)]"
        }`}
      >
        {/* track line behind numbers (decorative) */}
        <span className={`pointer-events-none absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-px transition-colors duration-500 ${
          isDark ? "bg-white/10" : "bg-[#EEEEEC]"
        }`} />
        {Array.from({ length: total }).map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-current={active ? "step" : undefined}
              aria-label={`Сторінка ${String(i + 1).padStart(2, "0")}: ${
                labels?.[i] || ""
              }`}
              data-testid={`slide-rail-item-${String(i + 1).padStart(2, "0")}`}
              className={`group relative w-9 h-7 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 ${
                active
                  ? (isDark ? "bg-white text-[#111111] focus:ring-white/40" : "bg-[#111111] text-white focus:ring-[#111]/40")
                  : (isDark ? "text-white/60 hover:text-white focus:ring-white/40" : "text-[#888888] hover:text-[#111111] focus:ring-[#111]/40")
              }`}
            >
              <span className="text-[10.5px] font-semibold tracking-[0.08em] [font-variant-numeric:tabular-nums]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Label tooltip on hover */}
              {labels?.[i] ? (
                <span
                  className={`pointer-events-none absolute right-full mr-2.5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10.5px] font-semibold tracking-[0.14em] uppercase rounded-full px-3 py-1 shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-200 ${
                    isDark ? "bg-white text-[#111111]" : "bg-[#111111] text-white"
                  } ${
                    active
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                >
                  {labels[i]}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* ============================= EDGE CLICK ZONES (DESKTOP) ============================= */}
      <EdgeZone
        side="left"
        disabled={isFirst}
        onClick={() => goTo(index - 1)}
      />
      <EdgeZone
        side="right"
        disabled={isLast}
        onClick={() => goTo(index + 1)}
      />

      {/* ============================= FLOATING CONTACTS CTA ============================= */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50" data-testid="floating-contacts-cta">
        <div className="relative flex flex-col items-end gap-2">
          {/* Expanded list */}
          {ctaOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex flex-col gap-2 items-stretch w-[240px]"
            >
              <a
                href={telegramUrl(settings)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-[14px] bg-white border border-[#E7E7E7] px-3 py-2.5 text-[13px] font-semibold text-[#111111] hover:bg-[#F1F1EF] transition-colors shadow-[0_6px_20px_rgba(17,17,17,0.06)]"
              >
                <span className="h-8 w-8 rounded-[10px] bg-[#111111] text-white grid place-items-center shrink-0">
                  <Send className="h-3.5 w-3.5" strokeWidth={2.1} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[9.5px] uppercase tracking-[0.14em] text-[#888888] font-semibold">Чат у Telegram</span>
                  <span className="block truncate">@{(settings?.telegram_username || "RPUA_Support").replace(/^@/, "")}</span>
                </span>
              </a>
              <a
                href={whatsappUrl(settings)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-[14px] bg-white border border-[#E7E7E7] px-3 py-2.5 text-[13px] font-semibold text-[#111111] hover:bg-[#F1F1EF] transition-colors shadow-[0_6px_20px_rgba(17,17,17,0.06)]"
              >
                <span className="h-8 w-8 rounded-[10px] bg-[#111111] text-white grid place-items-center shrink-0">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.1} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[9.5px] uppercase tracking-[0.14em] text-[#888888] font-semibold">Чат у WhatsApp</span>
                  <span className="block truncate [font-variant-numeric:tabular-nums]">+{(settings?.whatsapp_number || "").replace(/\D/g, "") || "380\u2026"}</span>
                </span>
              </a>
              {settings?.phone ? (
                <a
                  href={telUrl(settings)}
                  className="flex items-center gap-3 rounded-[14px] bg-[#111111] text-white px-3 py-2.5 text-[13px] font-semibold hover:bg-[#1F1F1F] transition-colors shadow-[0_6px_20px_rgba(17,17,17,0.18)]"
                >
                  <span className="h-8 w-8 rounded-[10px] bg-white text-[#111111] grid place-items-center shrink-0">
                    <Phone className="h-3.5 w-3.5" strokeWidth={2.1} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[9.5px] uppercase tracking-[0.14em] text-white/55 font-semibold">Прямий дзвінок</span>
                    <span className="block truncate [font-variant-numeric:tabular-nums]">{settings.phone}</span>
                  </span>
                </a>
              ) : null}
            </motion.div>
          ) : null}
          <button
            type="button"
            onClick={() => setCtaOpen((v) => !v)}
            aria-expanded={ctaOpen}
            aria-label="Зв'язатися"
            className={`inline-flex items-center gap-2 rounded-full px-5 h-12 text-[13px] font-semibold shadow-[0_10px_30px_rgba(17,17,17,0.22),_0_2px_4px_rgba(17,17,17,0.08)] transition-all duration-300 ${
              ctaOpen
                ? "bg-white border border-[#E7E7E7] text-[#111111]"
                : (isDark ? "bg-white text-[#111111] hover:bg-[#F1F1EF]" : "bg-[#111111] text-white hover:bg-[#000000]")
            }`}
            data-testid="floating-contacts-cta-button"
          >
            {ctaOpen ? (
              <>
                <X className="h-4 w-4" />
                <span>Закрити</span>
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                <span>Зв'язатися</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================= MOBILE PAGES SHEET ============================= */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[88%] sm:w-[400px] p-0 bg-[#F7F7F5] border-l border-[#E7E7E7]" data-testid="mobile-pages-sheet">
          <SheetHeader className="px-5 pt-6 pb-2 text-left">
            <SheetTitle className="font-heading text-2xl tracking-tight text-[#111111]">
              Сторінки каталогу
            </SheetTitle>
          </SheetHeader>
          <ol className="px-3 pt-2 pb-4 flex flex-col">
            {Array.from({ length: total }).map((_, i) => {
              const active = i === index;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      goTo(i);
                      setSheetOpen(false);
                    }}
                    data-testid={`mobile-pages-item-${String(i + 1).padStart(2, "0")}`}
                    className={`w-full flex items-center justify-between gap-4 px-3 py-3.5 rounded-[14px] transition-colors ${
                      active
                        ? "bg-[#111111] text-white"
                        : "hover:bg-white text-[#111111]"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`text-[12px] font-bold tracking-[0.1em] [font-variant-numeric:tabular-nums] ${
                          active ? "text-white/70" : "text-[#999999]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading text-[17px] tracking-tight font-semibold">
                        {labels?.[i] || `Сторінка ${i + 1}`}
                      </span>
                    </span>
                    <ArrowRight className={`h-4 w-4 ${active ? "text-white" : "text-[#999999]"}`} />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="px-5 py-4 border-t border-[#E7E7E7] bg-white">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={telegramUrl(settings)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-[12px] text-[13px] font-semibold bg-[#111111] text-white"
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
              {settings?.phone ? (
                <a
                  href={telUrl(settings)}
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-[12px] text-[13px] font-semibold bg-white border border-[#E7E7E7] text-[#111111]"
                >
                  <Phone className="h-4 w-4" /> Дзвінок
                </a>
              ) : null}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#666666]">
              <Link to="/" onClick={() => setSheetOpen(false)} className="hover:text-[#111111]">На головну</Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function EdgeZone({ side, disabled, onClick }) {
  const isLeft = side === "left";
  const Icon = isLeft ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Попередня сторінка" : "Наступна сторінка"}
      data-testid={`edge-${side}`}
      className={`group hidden lg:flex fixed ${
        isLeft ? "left-0" : "right-[72px]"
      } top-[56px] bottom-0 w-[7vw] z-30 items-center ${
        isLeft ? "justify-start pl-3" : "justify-end pr-3"
      } ${disabled ? "pointer-events-none opacity-0" : ""} transition-opacity`}
    >
      <span
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/90 backdrop-blur border border-[#E7E7E7] text-[#111111] shadow-[0_8px_24px_rgba(17,17,17,0.1)]`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
    </button>
  );
}
