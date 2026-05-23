import { Send, MessageCircle, Phone } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl } from "@/lib/cta";

export function ContactButtons({ productTitle, size = "md", variant = "full", className = "" }) {
  const { settings } = useSettings();
  const h = size === "lg" ? "h-12" : "h-11";
  const text = size === "lg" ? "text-base" : "text-sm";

  const tgBtn = (
    <a
      href={telegramUrl(settings, productTitle)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 ${h} px-5 rounded-[14px] ${text} font-medium bg-[#111111] text-white hover:bg-[#2A2A2A] transition-colors`}
      data-testid="contact-buttons-telegram"
    >
      <Send className="h-4 w-4" /> Telegram
    </a>
  );
  const waBtn = (
    <a
      href={whatsappUrl(settings, productTitle)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 ${h} px-5 rounded-[14px] ${text} font-medium bg-white text-[#111111] border border-[#E7E7E7] hover:bg-[#F1F1EF] transition-colors`}
      data-testid="contact-buttons-whatsapp"
    >
      <MessageCircle className="h-4 w-4" /> WhatsApp
    </a>
  );
  const callBtn = settings?.phone ? (
    <a
      href={telUrl(settings)}
      className={`inline-flex items-center justify-center gap-2 ${h} px-5 rounded-[14px] ${text} font-medium bg-white text-[#111111] border border-[#E7E7E7] hover:bg-[#F1F1EF] transition-colors`}
      data-testid="contact-buttons-call"
    >
      <Phone className="h-4 w-4" /> Дзвінок
    </a>
  ) : null;

  if (variant === "messengers") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tgBtn}
        {waBtn}
      </div>
    );
  }
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tgBtn}
      {waBtn}
      {callBtn}
    </div>
  );
}

export default ContactButtons;
