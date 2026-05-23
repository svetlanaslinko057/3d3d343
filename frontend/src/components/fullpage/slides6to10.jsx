import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  Factory,
  MessageSquare,
  Search,
  Boxes,
  CheckCircle2,
  Send,
  Phone,
  MessageCircle,
  Mail,
  Check,
  MapPin,
  Briefcase,
  Cog,
  Tag,
  Truck,
  Wrench,
} from "lucide-react";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl, whatsappUrl, telUrl, mailtoUrl } from "@/lib/cta";
import { imageUrl } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import { SlideShell, SlideHeader, SlideBody } from "./FullPage";
import { useSlideMode } from "./SlideMode";
import { ease, container, item, scaleUp } from "./slideMotion";

// ==================================================================
// SLIDE 6 — PARTNERS / B2B AUDIENCE (замінює Testimonials)
// ==================================================================
const AUDIENCES = [
  {
    icon: Briefcase,
    title: "Опт",
    desc: "Прямі поставки магазинам, базам та торговим мережам по Україні.",
    bullets: [
      "Прайс від першої партії",
      "Відвантаження зі складу",
      "Стабільний асортимент серії",
    ],
    accent: "#111111",
  },
  {
    icon: Cog,
    title: "OEM-партії",
    desc: "Виготовлення під торгову марку замовника за технічним завданням.",
    bullets: [
      "Партія від 50 шт",
      "Маркування під клієнта",
      "Технічна специфікація під ТЗ",
    ],
    accent: "#111111",
  },
  {
    icon: Wrench,
    title: "СТО, флоти та виробники",
    desc: "Сервіси, парки авто, виробники причепів та спецтехніки.",
    bullets: [
      "Підбір під парк авто",
      "Накопичувальні знижки",
      "Технічна підтримка від виробника",
    ],
    accent: "#111111",
  },
  {
    icon: Tag,
    title: "Роздріб від виробника",
    desc: "Пряма ціна виробника. Тільки виріб — без додаткових послуг.",
    bullets: [
      "Ціна від виробника без націнок",
      "Відправка НП по Україні",
      "Доставка 1–3 дні",
    ],
    accent: "#111111",
  },
];

// Quick trust facts shown as a stripe below the 4 audience cards.
const PARTNER_FACTS = [
  { icon: Boxes, value: "Опт", label: "від першої партії" },
  { icon: Cog, value: "OEM", label: "від 50 шт · під ТЗ" },
  { icon: Factory, value: "5–10", label: "днів виробництво" },
  { icon: Truck, value: "UA + EU", label: "відвантаження · експорт" },
];

export function SlideTestimonials({ active }) {
  const { settings } = useSettings();
  const mode = useSlideMode();
  const isMobile = mode === "mobile";
  return (
    <SlideShell>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="s6"
            variants={container(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0 }}
            className={`${isMobile ? "" : "flex-1 min-h-0"} flex flex-col relative`}
          >
            {!isMobile ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
              >
                <Logo
                  variant="dark"
                  height="h-[140px] xl:h-[180px]"
                  className="opacity-[0.045] blur-[0.5px]"
                  alt=""
                  data-testid="partners-brand-watermark"
                />
              </div>
            ) : null}

            <SlideHeader className="relative z-10">
              <motion.div variants={item} className="flex items-end justify-between flex-wrap gap-3">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E7E7E7] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#111111]">
                    <Briefcase className="h-3.5 w-3.5 text-[#111111]" strokeWidth={2.2} />
                    <span className="font-heading text-[#999999]">04</span>
                    Опт і партнери
                  </span>
                  <h2 className="mt-2 font-heading font-semibold text-[22px] sm:text-[32px] lg:text-[40px] xl:text-[46px] leading-[1.05] tracking-tight text-[#111111] [text-wrap:balance]">
                    Опт від виробника — <span className="text-[#5C5C5C]">від першої партії</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2.5 rounded-[14px] bg-white border border-[#E7E7E7] px-3 py-2">
                  <Factory className="h-4 w-4 text-[#111111]" strokeWidth={2} />
                  <div className="leading-tight">
                    <div className="font-heading font-semibold text-[13.5px] text-[#111111]">Опт · OEM · Роздріб</div>
                    <div className="text-[10px] text-[#666666] uppercase tracking-[0.1em]">пряма робота з виробником</div>
                  </div>
                </div>
              </motion.div>
            </SlideHeader>

            <motion.div variants={item} className="relative z-10 shrink-0 mt-4 lg:mt-5">
              <div className="rounded-[16px] lg:rounded-[18px] bg-white border border-[#E7E7E7] px-4 lg:px-5 py-3 lg:py-3.5 flex items-center justify-between gap-3 flex-wrap soft-lift">
                <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                  <Logo variant="dark" height="h-5 sm:h-6 lg:h-7" className="shrink-0" data-testid="partners-brand-logo" />
                  <span className="hidden sm:inline-block h-6 w-px bg-[#E7E7E7] shrink-0" />
                  <div className="flex items-center gap-1.5 text-[11.5px] lg:text-[12.5px] text-[#555555] min-w-0">
                    <Factory className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-[#111111] shrink-0" strokeWidth={2.2} />
                    <span className="truncate">20 років виробництва в Україні</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 lg:gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-[11.5px] lg:text-[12.5px] text-[#555555]">
                    <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-[#16A34A] shrink-0" strokeWidth={2.6} />
                    <span><strong className="text-[#111111] font-semibold">Працюємо багато</strong> · стабільно та надійно</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <SlideBody className="relative z-10 mt-3 lg:mt-4">
              <motion.div variants={item} className={`${isMobile ? "" : "flex-1 min-h-0"} flex flex-col gap-3 lg:gap-4`}>
                {/* 4 audience cards — compact horizontal layout on desktop, 2x2 on tablet */}
                <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3.5 items-stretch ${isMobile ? "" : "flex-1 min-h-0"}`}>
                  {AUDIENCES.map((a, i) => (
                    <motion.article
                      key={a.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease }}
                      className="group relative h-full rounded-[16px] lg:rounded-[18px] bg-white border border-[#E7E7E7] p-3.5 lg:p-4 flex flex-col soft-lift overflow-hidden transition-all duration-300 hover:border-[#111111] hover:shadow-[0_20px_40px_-20px_rgba(17,17,17,0.25)]"
                      data-testid={`partner-card-${i}`}
                    >
                      {/* Corner number watermark — smaller to free up vertical room */}
                      <div
                        aria-hidden="true"
                        className="absolute top-1 right-2 font-heading font-bold text-[44px] lg:text-[56px] leading-none text-[#F1F1EF] select-none pointer-events-none tabular-nums transition-colors duration-300 group-hover:text-[#E9E9E5]"
                      >
                        0{i + 1}
                      </div>

                      {/* Diagonal accent stripe */}
                      <div
                        aria-hidden="true"
                        className="absolute -top-px -left-px h-1 w-12 bg-[#111111] rounded-br-[6px] transition-all duration-300 group-hover:w-20"
                      />

                      <div className="relative z-10 flex items-start gap-2.5 shrink-0">
                        <span className="shrink-0 h-9 w-9 lg:h-10 lg:w-10 rounded-[10px] bg-[#111111] text-white grid place-items-center transition-transform duration-300 group-hover:scale-[1.04]">
                          <a.icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0 flex-1 pr-8">
                          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#888888]">
                            Напрям 0{i + 1}
                          </div>
                          <h3 className="mt-0.5 font-heading font-semibold text-[#111111] text-[14px] lg:text-[15.5px] leading-tight tracking-tight">
                            {a.title}
                          </h3>
                        </div>
                      </div>

                      <p className="relative z-10 mt-2.5 text-[11.5px] lg:text-[12px] text-[#555555] leading-[1.5] shrink-0">
                        {a.desc}
                      </p>

                      <ul className="relative z-10 mt-2.5 space-y-1 flex-1">
                        {a.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-1.5 text-[11.5px] lg:text-[12px] text-[#1A1A1A] leading-snug">
                            <Check className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.6} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Bottom hover-revealed arrow link */}
                      <div className="relative z-10 mt-2.5 pt-2 border-t border-[#F1F1EF] flex items-center justify-between gap-2 shrink-0">
                        <span className="text-[9.5px] uppercase tracking-[0.1em] font-bold text-[#888888] leading-tight">
                          Пряма робота
                        </span>
                        <a
                          href={telegramUrl(settings)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#F1F1EF] text-[#111111] transition-all duration-300 group-hover:bg-[#111111] group-hover:text-white"
                          aria-label={`Запит — ${a.title}`}
                          data-testid={`partner-card-cta-${i}`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Trust facts strip — compact, fills empty bottom space */}
                <div className="rounded-[14px] lg:rounded-[16px] bg-[#111111] text-white border border-[#111111] overflow-hidden shrink-0" data-testid="partners-trust-strip">
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
                    {PARTNER_FACTS.map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5 px-3 lg:px-3.5 py-2.5 lg:py-3 min-w-0">
                        <span className="shrink-0 h-8 w-8 lg:h-9 lg:w-9 rounded-[8px] bg-white/8 border border-white/15 grid place-items-center">
                          <f.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-white" strokeWidth={2} />
                        </span>
                        <div className="min-w-0">
                          <div className="font-heading font-semibold text-white text-[13.5px] lg:text-[15px] leading-none tracking-tight">
                            {f.value}
                          </div>
                          <div className="mt-1 text-[9.5px] lg:text-[10px] text-white/65 uppercase tracking-[0.08em] font-semibold leading-snug">
                            {f.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </SlideBody>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SlideShell>
  );
}

// ==================================================================
// SLIDE 7 — FINAL CTA (B2B-first, request price/terms)
// ==================================================================
const STEPS = [
  { icon: MessageSquare, title: "Запит", desc: "Опт/роздріб/OEM" },
  { icon: Search, title: "Специфікація", desc: "Авто · типорозмір · партія" },
  { icon: Boxes, title: "Прайс і терміни", desc: "Наявність або виготовлення" },
  { icon: CheckCircle2, title: "Відвантаження", desc: "НП · вантажні · експорт" },
];

const CLIENT_TYPES = [
  { value: "Опт", label: "Опт" },
  { value: "OEM", label: "OEM" },
  { value: "СТО/автомагазин", label: "СТО/автомагазин" },
  { value: "Виробництво", label: "Виробництво" },
  { value: "Експорт", label: "Експорт" },
  { value: "Роздріб", label: "Роздріб" },
];

function buildLeadText({ clientType, spec, contact }) {
  const lines = [
    "🔔 Запит з сайту ПНЕВМО",
    "",
    `🏷️ Тип запиту: ${clientType || "—"}`,
    `📝 Специфікація: ${spec || "—"}`,
    `📞 Контакт: ${contact || "—"}`,
  ];
  return lines.join("\n");
}

function buildLeadTelegram(settings, lead) {
  const user = (settings?.telegram_username || "RPUA_Support").replace(/^@/, "");
  return `https://t.me/${user}?text=${encodeURIComponent(buildLeadText(lead))}`;
}

function buildLeadWhatsapp(settings, lead) {
  const phone = (settings?.whatsapp_number || "").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildLeadText(lead))}`;
}

function buildLeadEmail(settings, lead) {
  const email = settings?.email || "";
  if (!email) return "#";
  const subject = encodeURIComponent("Запит з сайту ПНЕВМО");
  const body = encodeURIComponent(buildLeadText(lead));
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function SlideFinal({ active }) {
  const { settings } = useSettings();
  const [form, setForm] = useState({ clientType: "Опт", spec: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const brand = settings?.company_name || "ПНЕВМО";
  const year = new Date().getFullYear();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.spec.trim() || !form.contact.trim()) {
      toast.error("Вкажіть специфікацію та контакт");
      return;
    }
    const snapshot = {
      clientType: form.clientType.trim(),
      spec: form.spec.trim(),
      contact: form.contact.trim(),
    };
    setLoading(true);
    try {
      await api.post("/leads", {
        name: `${snapshot.clientType} · ${snapshot.spec}`.slice(0, 80),
        phone: snapshot.contact,
        message: `Тип запиту: ${snapshot.clientType}\nСпецифікація: ${snapshot.spec}`,
      });
      try {
        window.open(buildLeadTelegram(settings, snapshot), "_blank", "noopener,noreferrer");
      } catch (_) {
        // popup blocked
      }
      toast.success("Запит прийнято. Перевірте Telegram-чат.");
      setSubmitted(snapshot);
      setForm({ clientType: snapshot.clientType, spec: "", contact: "" });
    } catch (_) {
      toast.error("Помилка. Скористайтеся кнопкою месенджера нижче.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => setSubmitted(null);

  return (
    <SlideShell dark>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div key="s7" variants={container(0.05)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 flex flex-col">
            <SlideHeader>
              <motion.div variants={item} className="flex items-end justify-between flex-wrap gap-3">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-white">
                    <span className="font-heading text-[#999999]">05</span>
                    Прайс · Опт · Умови співпраці
                  </span>
                  <h2 className="mt-3 font-heading font-semibold text-white text-[24px] sm:text-[30px] lg:text-[38px] xl:text-[44px] leading-[1.04] tracking-tight [text-wrap:balance]">
                    Пряма робота з виробником — без{" "}
                    <span className="text-[#888888]">посередників</span>
                  </h2>
                </div>
                <div className="inline-flex items-start gap-2 rounded-full bg-white/10 border border-white/20 text-white text-[11.5px] font-semibold px-3 py-2">
                  <Factory className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>20 років виробництва в Україні</span>
                </div>
              </motion.div>

              <motion.ol variants={item} className="mt-4 lg:mt-5 relative grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-0">
                <div className="hidden lg:block absolute left-[12%] right-[12%] top-[22px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                {STEPS.map((s, i) => (
                  <li key={s.title} className="relative flex lg:flex-col lg:items-center items-start gap-3 rounded-[12px] bg-[#1A1A1A] lg:bg-transparent border border-[#2A2A2A] lg:border-0 p-2.5 lg:p-0">
                    <div className="relative shrink-0">
                      <div className="h-11 w-11 rounded-full bg-white text-[#111111] grid place-items-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        <s.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                      </div>
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#111111] grid place-items-center text-[10px] font-bold font-heading leading-none border border-[#111111]/20">
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0 lg:text-center lg:mt-1.5">
                      <div className="font-heading font-semibold text-white text-[13px] lg:text-[14px] tracking-tight leading-tight">
                        {s.title}
                      </div>
                      <div className="text-[11px] lg:text-[11.5px] text-[#A1A1A1] mt-0.5 leading-snug">
                        {s.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </motion.ol>
            </SlideHeader>

            <SlideBody className="mt-4 lg:mt-5">
              <motion.div variants={item} className="flex-1 min-h-0 grid lg:grid-cols-[1fr_1fr] gap-4 lg:gap-6 items-stretch">
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <div className="text-[12.5px] lg:text-[13.5px] text-[#BDBDBD] leading-relaxed max-w-md">
                      Опишіть специфікацію (авто/проєкт або типорозмір подушки) — надішлемо прайс і терміни виготовлення. Або напишіть одразу в зручний месенджер:
                    </div>
                    <div className="mt-4 lg:mt-4 grid sm:grid-cols-2 gap-2.5 lg:gap-2.5">
                      <a href={telegramUrl(settings)} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-[12px] bg-white/5 border border-white/10 p-3 hover:bg-white/10 hover:border-white/25 transition-all duration-300" data-testid="final-cta-telegram-card">
                        <span className="shrink-0 h-10 w-10 rounded-[10px] bg-white text-[#111111] grid place-items-center transition-transform duration-300 group-hover:scale-[1.06]">
                          <Send className="h-4 w-4" strokeWidth={2.1} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#A0A0A0] font-semibold">Telegram</div>
                          <div className="font-heading font-semibold text-white text-[13.5px] tracking-tight truncate">
                            @{(settings?.telegram_username || "").replace(/^@/, "")}
                          </div>
                        </div>
                      </a>
                      <a href={whatsappUrl(settings)} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-[12px] bg-white/5 border border-white/10 p-3 hover:bg-white/10 hover:border-white/25 transition-all duration-300" data-testid="final-cta-whatsapp-card">
                        <span className="shrink-0 h-10 w-10 rounded-[10px] bg-white text-[#111111] grid place-items-center transition-transform duration-300 group-hover:scale-[1.06]">
                          <MessageCircle className="h-4 w-4" strokeWidth={2.1} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#A0A0A0] font-semibold">WhatsApp</div>
                          <div className="font-heading font-semibold text-white text-[13.5px] tracking-tight truncate">
                            +{(settings?.whatsapp_number || "").replace(/\D/g, "")}
                          </div>
                        </div>
                      </a>
                      {settings?.phone ? (
                        <a href={telUrl(settings)} className="group flex items-center gap-2.5 rounded-[12px] bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 hover:border-white/25 transition-all duration-300" data-testid="final-cta-call-card">
                          <span className="shrink-0 h-9 w-9 rounded-[10px] bg-white text-[#111111] grid place-items-center transition-transform duration-300 group-hover:scale-[1.06]">
                            <Phone className="h-4 w-4" strokeWidth={2.1} />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[9px] uppercase tracking-[0.14em] text-[#A0A0A0] font-semibold">Телефон</div>
                            <div className="font-heading font-semibold text-white text-[13px] tracking-tight truncate">{settings.phone}</div>
                          </div>
                        </a>
                      ) : null}
                      {settings?.email ? (
                        <a href={mailtoUrl(settings)} className="group flex items-center gap-2.5 rounded-[12px] bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 hover:border-white/25 transition-all duration-300" data-testid="final-cta-email-card">
                          <span className="shrink-0 h-9 w-9 rounded-[10px] bg-white text-[#111111] grid place-items-center transition-transform duration-300 group-hover:scale-[1.06]">
                            <Mail className="h-4 w-4" strokeWidth={2.1} />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[9px] uppercase tracking-[0.14em] text-[#A0A0A0] font-semibold">Email</div>
                            <div className="font-heading font-semibold text-white text-[13px] tracking-tight truncate">{settings.email}</div>
                          </div>
                        </a>
                      ) : null}
                    </div>

                    {settings?.address ? (
                      <div className="mt-2.5 flex items-start gap-2 text-[11.5px] text-[#A0A0A0] min-w-0">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span className="truncate min-w-0">
                          {settings.address}
                          {settings?.working_hours ? ` · ${settings.working_hours}` : ""}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#888888]">
                    <div className="flex items-center gap-2.5">
                      <Logo variant="light" height="h-4" />
                      <span>© {year} {brand}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Link to="/admin" className="hover:text-white transition-colors opacity-60" data-testid="footer-admin-link">Адмін</Link>
                    </div>
                  </div>
                </div>

                <motion.div variants={scaleUp} className="rounded-[18px] lg:rounded-[22px] bg-white p-5 lg:p-5 text-[#111111] flex flex-col h-full min-h-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease }}
                        className="flex flex-col flex-1 min-h-0"
                        data-testid="final-cta-success"
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 h-10 w-10 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] grid place-items-center">
                            <Check className="h-5 w-5 text-[#16A34A]" strokeWidth={2.8} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-heading font-semibold text-base lg:text-lg tracking-tight">
                              Запит прийнято
                            </h3>
                            <p className="text-[12.5px] lg:text-[13px] text-[#555555] leading-snug mt-0.5">
                              Ми відкрили Telegram з вашим запитом. Натисніть «Надіслати» — або оберіть інший канал.
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-[12px] bg-[#FAFAF9] border border-[#E7E7E7] p-3 text-[12.5px] leading-relaxed">
                          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#888888]">Ваш запит</div>
                          <div className="mt-1.5 grid gap-0.5">
                            <div><span className="text-[#888888]">Тип:</span> <span className="font-semibold text-[#111111]">{submitted.clientType}</span></div>
                            <div><span className="text-[#888888]">Специфікація:</span> <span className="font-semibold text-[#111111]">{submitted.spec}</span></div>
                            <div><span className="text-[#888888]">Контакт:</span> <span className="font-semibold text-[#111111]">{submitted.contact}</span></div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2">
                          <a href={buildLeadTelegram(settings, submitted)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-2 h-11 px-4 rounded-[12px] bg-[#111111] text-white font-semibold hover:bg-[#1F1F1F] transition-colors text-[13.5px]" data-testid="success-channel-telegram">
                            <span className="inline-flex items-center gap-2"><Send className="h-4 w-4" strokeWidth={2.1} /> Надіслати у Telegram</span>
                            <ArrowRight className="h-4 w-4" />
                          </a>
                          <a href={buildLeadWhatsapp(settings, submitted)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-2 h-11 px-4 rounded-[12px] bg-white border border-[#111111] text-[#111111] font-semibold hover:bg-[#F1F1EF] transition-colors text-[13.5px]" data-testid="success-channel-whatsapp">
                            <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" strokeWidth={2.1} /> Надіслати у WhatsApp</span>
                            <ArrowRight className="h-4 w-4" />
                          </a>
                          {settings?.email ? (
                            <a href={buildLeadEmail(settings, submitted)} className="inline-flex items-center justify-between gap-2 h-11 px-4 rounded-[12px] bg-[#F7F7F5] border border-[#E7E7E7] text-[#111111] font-semibold hover:bg-[#F1F1EF] transition-colors text-[13.5px]" data-testid="success-channel-email">
                              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" strokeWidth={2.1} /> Надіслати на Email</span>
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>

                        <div className="mt-auto pt-3">
                          <button type="button" onClick={resetForm} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#555555] hover:text-[#111111] transition-colors" data-testid="success-reset-button">
                            ← Новий запит
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease }}
                        onSubmit={submit}
                        className="flex flex-col h-full min-h-0"
                        data-testid="final-cta-form"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-heading font-semibold text-base lg:text-lg tracking-tight">Запит прайсу</h3>
                            <p className="text-[12px] lg:text-[12.5px] text-[#666666] mt-0.5">Опт · OEM · виробництво · роздріб. Відповідь протягом робочої доби.</p>
                          </div>
                          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#F1F1EF] text-[#111111] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
                            <Factory className="h-3 w-3 text-[#111111]" strokeWidth={2.6} /> Виробництво
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 flex-1 min-h-0 justify-between">
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold mb-1.5">Тип запиту</label>
                              <div className="flex flex-wrap gap-2">
                                {CLIENT_TYPES.map((c) => (
                                  <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, clientType: c.value }))}
                                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11.5px] font-semibold border transition-colors ${
                                      form.clientType === c.value
                                        ? "bg-[#111111] text-white border-[#111111]"
                                        : "bg-white text-[#111111] border-[#E7E7E7] hover:border-[#111111]"
                                    }`}
                                    data-testid={`final-cta-clienttype-${c.value}`}
                                  >
                                    {c.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold mb-1.5">Специфікація</label>
                              <input
                                required
                                placeholder="Напр. Sprinter 906 / партія балонів RP-2010"
                                value={form.spec}
                                onChange={(e) => setForm((f) => ({ ...f, spec: e.target.value }))}
                                className="h-11 w-full px-3.5 rounded-[10px] border border-[#E7E7E7] bg-white text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                                data-testid="final-cta-spec-input"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold mb-1.5">Контакт (телефон / Telegram / email)</label>
                              <input
                                required
                                inputMode="tel"
                                placeholder="+380 97 123 45 67 або @username"
                                value={form.contact}
                                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                                className="h-11 w-full px-3.5 rounded-[10px] border border-[#E7E7E7] bg-white text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                                data-testid="final-cta-contact-input"
                              />
                            </div>
                          </div>
                          <div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="h-12 w-full rounded-[12px] bg-[#111111] text-white font-semibold hover:bg-[#2A2A2A] transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2 text-[14px]"
                              data-testid="final-cta-submit-button"
                            >
                              {loading ? "Відправлення…" : (<>Отримати прайс <ArrowRight className="h-4 w-4" /></>)}
                            </button>
                            <div className="mt-3 flex items-center justify-center gap-2 text-[11.5px] text-[#555555] font-medium">
                              <Check className="h-3.5 w-3.5 text-[#16A34A] shrink-0" strokeWidth={2.5} />
                              <span>Прямий контракт з виробником · без посередників</span>
                            </div>
                          </div>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </SlideBody>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SlideShell>
  );
}
