import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Send, Phone, ArrowRight } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, telUrl } from "@/lib/cta";
import Logo from "@/components/shared/Logo";

const NAV = [
  { to: "/#slide-1", label: "Виробництво", slide: 1 },
  { to: "/#slide-2", label: "Виробництво · 20 років", slide: 2 },
  { to: "/#slide-3", label: "Продукція та кейси", slide: 3 },
  { to: "/#slide-4", label: "Опт і партнери", slide: 4 },
  { to: "/#slide-5", label: "Прайс", slide: 5 },
];

export function Header() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Re-fire hashchange when hash link clicked on the same page (React Router may not fire it automatically)
  const onNavClick = (item) => (e) => {
    if (!item.to.includes("#")) return; // not a slide link
    if (isHome) {
      e.preventDefault();
      const hash = item.to.split("#")[1];
      const target = `#${hash}`;
      if (window.location.hash === target) {
        // Force hashchange to re-trigger navigation to that slide
        window.history.replaceState(null, "", "/");
      }
      window.location.hash = hash;
    }
  };

  const brand = settings?.company_name || "ПНЕВМО";

  const headerStyle = isHome
    ? "fixed top-0 inset-x-0 z-50 transition-all duration-200 " +
      (scrolled
        ? "bg-[#F7F7F5]/92 backdrop-blur-md border-b border-[#E7E7E7]"
        : "bg-[#F7F7F5]/75 backdrop-blur-sm border-b border-transparent")
    : "sticky top-0 z-40 transition-all duration-200 " +
      (scrolled
        ? "bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E7E7E7]"
        : "bg-[#F7F7F5]/70 backdrop-blur-sm border-b border-transparent");

  return (
    <header data-testid="site-header" className={headerStyle}>
      <div className="container-page h-16 sm:h-18 lg:h-20 flex items-center justify-between gap-3 lg:gap-4">
        <Link to="/" className="shrink-0 flex items-center" data-testid="site-logo-link" aria-label={brand}>
          <Logo variant="dark" height="h-9 sm:h-10 lg:h-11" />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0" aria-label="Основна навігація">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavClick(item)}
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-2 rounded-[12px] text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive && !item.to.includes("#")
                    ? "text-[#111111] bg-white border border-[#E7E7E7]"
                    : "text-[#666666] hover:text-[#111111] hover:bg-white/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {settings?.phone ? (
            <a
              href={telUrl(settings)}
              className="hidden xl:inline-flex items-center gap-2 px-3 h-11 rounded-[14px] text-sm text-[#111111] hover:bg-white border border-transparent hover:border-[#E7E7E7] transition-colors whitespace-nowrap"
              data-testid="header-phone-link"
            >
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          ) : null}
          <a
            href={telegramUrl(settings)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 xl:px-5 h-11 rounded-[14px] text-[13px] xl:text-sm font-medium bg-[#111111] text-white hover:bg-[#2A2A2A] transition-colors whitespace-nowrap"
            data-testid="header-cta-write-button"
          >
            <span className="hidden xl:inline">Отримати прайс</span>
            <span className="xl:hidden">Прайс</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-[12px] border border-[#E7E7E7] bg-white text-[#111111]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Закрити меню" : "Відкрити меню"}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-[#E7E7E7] bg-[#F7F7F5]" data-testid="mobile-menu-panel">
          <div className="container-page py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavClick(item)}
                className="px-3 py-3 rounded-[12px] text-base text-[#111111] hover:bg-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={telegramUrl(settings)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium bg-[#111111] text-white"
                data-testid="mobile-menu-telegram-cta"
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
              {settings?.phone ? (
                <a
                  href={telUrl(settings)}
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-medium border border-[#E7E7E7] bg-white text-[#111111]"
                  data-testid="mobile-menu-phone-cta"
                >
                  <Phone className="h-4 w-4" /> Дзвінок
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
