import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, MessageCircle, Phone, X, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl } from "@/lib/cta";

/**
 * Floating contact bubble. On mobile, auto-lifts above StickyMobileCTA
 * when it becomes visible (scrollY > 500). iOS safe-area-inset aware.
 */
export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const { settings } = useSettings();
  const location = useLocation();

  const isProductDetail = /^\/catalog\/[^/]+$/.test(location.pathname);
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin || isProductDetail) {
      setStickyVisible(false);
      return;
    }
    const onScroll = () => setStickyVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin, isProductDetail, location.pathname]);

  // On mobile, lift floating button above sticky-mobile-cta when visible
  const mobileBottom = stickyVisible ? "bottom-[96px]" : "bottom-5";

  return (
    <div
      className={`fixed right-4 sm:right-5 ${mobileBottom} sm:bottom-5 z-50 flex flex-col items-end gap-3 transition-[bottom] duration-300`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-testid="floating-contact-root"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex flex-col gap-2 items-end"
          >
            <a
              href={telegramUrl(settings)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white text-[#111111] border border-[#E7E7E7] text-sm font-medium shadow-[0_10px_30px_rgba(17,17,17,0.12)] hover:bg-[#F1F1EF]"
              aria-label="Написати в Telegram"
              data-testid="floating-contact-telegram"
            >
              <Send className="h-4 w-4" /> Telegram
            </a>
            <a
              href={whatsappUrl(settings)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white text-[#111111] border border-[#E7E7E7] text-sm font-medium shadow-[0_10px_30px_rgba(17,17,17,0.12)] hover:bg-[#F1F1EF]"
              aria-label="Написати в WhatsApp"
              data-testid="floating-contact-whatsapp"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            {settings?.phone ? (
              <a
                href={telUrl(settings)}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white text-[#111111] border border-[#E7E7E7] text-sm font-medium shadow-[0_10px_30px_rgba(17,17,17,0.12)] hover:bg-[#F1F1EF]"
                aria-label="Зателефонувати"
                data-testid="floating-contact-call"
              >
                <Phone className="h-4 w-4" /> Дзвінок
              </a>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрити контакти" : "Відкрити контакти"}
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#111111] text-white grid place-items-center shadow-[0_12px_30px_rgba(17,17,17,0.25)] hover:bg-[#2A2A2A] transition-colors"
        data-testid="floating-contact-toggle"
      >
        {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />}
      </button>
    </div>
  );
}

export default FloatingContact;
