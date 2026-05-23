import { useState } from "react";
import { toast } from "sonner";
import { Send, MessageCircle, Phone, Mail, Clock, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl, mailtoUrl } from "@/lib/cta";
import SectionHeading from "@/components/shared/SectionHeading";

export default function ContactsPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Вкажіть ім'я та телефон");
      return;
    }
    setLoading(true);
    try {
      await api.post("/leads", form);
      toast.success("Заявку відправлено. Ми зв'яжемося найближчим часом.");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Не вдалося відправити. Спробуйте знову.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page section-y" data-testid="contacts-page">
      <SectionHeading
        eyebrow="Контакти"
        title="Напишіть або зателефонуйте"
        subtitle="Відповідаємо протягом години в робочий час."
      />

      <div className="mt-8 sm:mt-12 grid lg:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-3 sm:space-y-4">
          <a
            href={telegramUrl(settings)}
            target="_blank"
            rel="noreferrer"
            className="surface-card p-5 sm:p-6 flex items-center gap-4 sm:gap-5 soft-lift"
            data-testid="contacts-telegram-card"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-[12px] sm:rounded-[14px] bg-[#111111] text-white grid place-items-center shrink-0">
              <Send className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-[#666666] font-semibold">Telegram</div>
              <div className="font-heading font-semibold text-[#111111] text-base sm:text-lg tracking-tight truncate">@{(settings?.telegram_username || "").replace(/^@/, "")}</div>
            </div>
          </a>

          <a
            href={whatsappUrl(settings)}
            target="_blank"
            rel="noreferrer"
            className="surface-card p-5 sm:p-6 flex items-center gap-4 sm:gap-5 soft-lift"
            data-testid="contacts-whatsapp-card"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-[12px] sm:rounded-[14px] bg-white border border-[#E7E7E7] text-[#111111] grid place-items-center shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-[#666666] font-semibold">WhatsApp</div>
              <div className="font-heading font-semibold text-[#111111] text-base sm:text-lg tracking-tight truncate">+{(settings?.whatsapp_number || "").replace(/\D/g, "")}</div>
            </div>
          </a>

          {settings?.phone ? (
            <a
              href={telUrl(settings)}
              className="surface-card p-6 flex items-center gap-5 soft-lift"
              data-testid="contacts-phone-card"
            >
              <div className="h-14 w-14 rounded-[14px] bg-white border border-[#E7E7E7] grid place-items-center text-[#111111] shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-[#666666] font-semibold">Телефон</div>
                <div className="font-heading font-semibold text-[#111111] text-lg tracking-tight">{settings.phone}</div>
              </div>
            </a>
          ) : null}

          {settings?.email ? (
            <a
              href={mailtoUrl(settings)}
              className="surface-card p-6 flex items-center gap-5 soft-lift"
              data-testid="contacts-email-card"
            >
              <div className="h-14 w-14 rounded-[14px] bg-white border border-[#E7E7E7] grid place-items-center text-[#111111] shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-[#666666] font-semibold">Email</div>
                <div className="font-heading font-semibold text-[#111111] text-lg tracking-tight">{settings.email}</div>
              </div>
            </a>
          ) : null}

          <div className="surface-card p-6">
            <div className="flex items-center gap-3 text-[#111111] font-medium">
              <Clock className="h-5 w-5" /> {settings?.working_hours || "Пн-Пт 09:00-19:00"}
            </div>
            <div className="mt-3 flex items-start gap-3 text-[#666666] text-sm">
              <MapPin className="h-5 w-5 mt-0.5" /> {settings?.address || "Україна, доставка по всій країні"}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="surface-card p-7 sm:p-8" data-testid="contacts-form">
          <h3 className="font-heading font-semibold text-2xl text-[#111111] tracking-tight">Форма зворотнього зв'язку</h3>
          <p className="text-sm text-[#666666] mt-2">Напишіть коротко задачу — ми зв'яжемося.</p>
          <div className="mt-6 flex flex-col gap-3">
            <input
              required
              placeholder="Ваше ім'я"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="h-12 px-4 rounded-[14px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
              data-testid="contacts-form-name-input"
            />
            <input
              required
              type="tel"
              placeholder="Телефон (+380...)"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="h-12 px-4 rounded-[14px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
              data-testid="contacts-form-phone-input"
            />
            <textarea
              rows={4}
              placeholder="Марка і модель авто / задача"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="p-4 rounded-[14px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] resize-none"
              data-testid="contacts-form-message-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-[14px] bg-[#111111] text-white font-medium hover:bg-[#2A2A2A] transition-colors disabled:opacity-60"
              data-testid="contacts-form-submit-button"
            >
              {loading ? "Відправлення…" : "Відправити"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
