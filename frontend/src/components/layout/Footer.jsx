import { Link } from "react-router-dom";
import { Send, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl, mailtoUrl } from "@/lib/cta";
import Logo from "@/components/shared/Logo";

export function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const brand = settings?.company_name || "ПНЕВМО";

  return (
    <footer className="mt-16 sm:mt-20 lg:mt-24 border-t border-[#E7E7E7] bg-[#111111] text-white pb-[env(safe-area-inset-bottom,0px)]" data-testid="site-footer">
      <div className="container-page py-12 sm:py-14 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-10">
        <div className="lg:col-span-1">
          <Link to="/" className="inline-flex items-center mb-4 sm:mb-5" aria-label={brand}>
            <Logo variant="light" height="h-10 sm:h-11" />
          </Link>
          <p className="text-[13px] sm:text-sm text-[#A1A1A1] leading-relaxed max-w-xs">
            {settings?.tagline || "Пневмоподушки та комплекти пневмопідвіски для комерційного транспорту."}
          </p>
        </div>

        <div>
          <h4 className="font-heading text-[11px] uppercase tracking-[0.12em] text-[#666666] mb-3 sm:mb-4">Компанія</h4>
          <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-sm text-[#E7E7E7]">
            <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/">На головну</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-[11px] uppercase tracking-[0.12em] text-[#666666] mb-3 sm:mb-4">Зв'язок</h4>
          <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-sm text-[#E7E7E7]">
            <li>
              <a className="inline-flex items-center gap-2 py-1 hover:text-white transition-colors min-h-[32px]" href={telegramUrl(settings)} target="_blank" rel="noreferrer" data-testid="footer-telegram-link">
                <Send className="h-4 w-4" /> Telegram
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 py-1 hover:text-white transition-colors min-h-[32px]" href={whatsappUrl(settings)} target="_blank" rel="noreferrer" data-testid="footer-whatsapp-link">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            {settings?.phone ? (
              <li>
                <a className="inline-flex items-center gap-2 py-1 hover:text-white transition-colors min-h-[32px]" href={telUrl(settings)} data-testid="footer-phone-link">
                  <Phone className="h-4 w-4" /> <span className="truncate">{settings.phone}</span>
                </a>
              </li>
            ) : null}
            {settings?.email ? (
              <li>
                <a className="inline-flex items-center gap-2 py-1 hover:text-white transition-colors min-h-[32px]" href={mailtoUrl(settings)}>
                  <Mail className="h-4 w-4" /> <span className="truncate">{settings.email}</span>
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-[11px] uppercase tracking-[0.12em] text-[#666666] mb-3 sm:mb-4">Адреса</h4>
          <p className="text-[14px] sm:text-sm text-[#E7E7E7] inline-flex items-start gap-2 leading-relaxed">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{settings?.address || "Україна, доставка по всій країні"}</span>
          </p>
          {settings?.working_hours ? (
            <p className="mt-2.5 sm:mt-3 text-[13px] sm:text-sm text-[#A1A1A1]">{settings.working_hours}</p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[#2A2A2A]">
        <div className="container-page py-5 sm:py-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-[11px] sm:text-xs text-[#666666]">
          <span>© {year} {brand}. Усі права захищено.</span>
          <Link to="/admin" className="hover:text-white transition-colors" data-testid="footer-admin-link">Адмін</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
