import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Factory,
  Wrench,
  Check,
  ArrowDown,
  Boxes,
  Truck,
  Sparkles,
  Cog,
  Gauge,
  Layers,
  Briefcase,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl } from "@/lib/cta";
import { imageUrl } from "@/lib/utils";
import { api } from "@/lib/api";
import { SlideShell, SlideHeader, SlideBody } from "./FullPage";
import { SlideProductCard } from "./SlideCards";
import { ease, container, item, scaleUp } from "./slideMotion";

// ==================================================================
// SLIDE 1 — HERO (factory-first / B2B positioning)
// ==================================================================
const HERO_AUDIENCE = [
  { icon: Briefcase, label: "Опт" },
  { icon: Cog, label: "OEM" },
  { icon: Wrench, label: "СТО / автомагазин" },
  { icon: Tag, label: "Роздріб від виробника" },
];

const HERO_STATS = [
  { value: "20", label: "років виробництва" },
  { value: "UA", label: "власне виробництво" },
  { value: "OEM", label: "партії під марку" },
];

export function SlideProduction({ active, goTo }) {
  const { settings } = useSettings();
  return (
    <SlideShell>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="s1"
            variants={container(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-h-0 grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-12 xl:gap-16 items-stretch"
          >
            {/* LEFT — editorial copy */}
            <div className="min-w-0 flex flex-col h-full">
              <motion.div variants={item} className="inline-flex self-start items-center gap-2 rounded-[10px] px-3 py-1.5 bg-[#111111] text-white text-[11.5px] sm:text-[12px] font-semibold tracking-[0.02em]">
                <Factory className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span>Виробництво пневмопідвіски · Україна · 20 років</span>
              </motion.div>

              <motion.h1
                variants={item}
                className="display-heading mt-3 sm:mt-4 text-[32px] leading-[1.02] sm:text-[44px] md:text-[50px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] [text-wrap:balance]"
                data-testid="hero-title"
              >
                Виробництво{" "}
                <span className="text-[#5C5C5C]">пневмоподушок</span>{" "}
                в Україні
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-3 sm:mt-4 text-[14px] sm:text-[15.5px] lg:text-[16.5px] text-[#333333] max-w-xl leading-[1.55]"
              >
                20 років виробляємо пневмоподушки на власному виробництві. Працюємо з оптовими покупцями, OEM-замовниками, СТО та автомагазинами. Роздрібним клієнтам — пряма ціна від виробника без посередників.
              </motion.p>

              {/* Audience pills */}
              <motion.ul variants={item} className="mt-4 lg:mt-5 flex flex-wrap gap-1.5 lg:gap-2">
                {HERO_AUDIENCE.map((a) => (
                  <li
                    key={a.label}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-white border border-[#E7E7E7] px-2.5 py-1.5 text-[11.5px] lg:text-[12px] font-semibold text-[#111111] micro-lift"
                  >
                    <a.icon className="h-3.5 w-3.5 text-[#111111]" strokeWidth={2} />
                    {a.label}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={item} className="mt-auto pt-6 lg:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={telegramUrl(settings)}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 h-14 lg:h-[60px] px-6 sm:px-7 rounded-[10px] text-[14px] sm:text-[15px] font-semibold bg-[#111111] text-white hover:bg-[#000000] transition-colors cta-lift w-full sm:w-auto"
                  data-testid="hero-primary-cta"
                >
                  <span>Отримати прайс від виробника</span>
                  <span className="h-7 w-7 rounded-[10px] bg-white text-[#111111] grid place-items-center transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => goTo(2)}
                  className="inline-flex items-center justify-center gap-2 h-14 lg:h-[60px] px-6 rounded-[10px] text-[13.5px] sm:text-[14.5px] font-medium bg-transparent text-[#111111] border border-[#111111]/20 hover:bg-[#111111] hover:text-white transition-colors micro-lift"
                  data-testid="hero-secondary-cta"
                >
                  Переглянути продукцію
                </button>
              </motion.div>

              <motion.div variants={item} className="mt-6 lg:mt-7 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:gap-6">
                {HERO_STATS.map((s, idx) => (
                  <div key={s.label} className="flex flex-row items-baseline gap-3 min-w-0 lg:gap-2">
                    <span className="font-heading font-semibold text-[#111111] text-[26px] lg:text-[22px] leading-none tracking-tight whitespace-nowrap shrink-0">
                      {s.value}
                    </span>
                    <span className="text-[11px] lg:text-[11px] text-[#666666] uppercase tracking-[0.1em] lg:tracking-[0.1em] leading-tight whitespace-nowrap font-semibold">
                      {s.label}
                    </span>
                    {idx < HERO_STATS.length - 1 ? (
                      <span className="hidden lg:inline-block h-4 w-px bg-[#E7E7E7] ml-4" />
                    ) : null}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — editorial hero composition */}
            <motion.div
              variants={scaleUp}
              className="relative hidden lg:flex h-full min-h-0 flex-col gap-3 lg:gap-3.5"
            >
              <div className="relative flex-[1.9] min-h-0 rounded-[24px] xl:rounded-[28px] overflow-hidden bg-[#111111] border border-[#E7E7E7] shadow-[0_20px_60px_-20px_rgba(17,17,17,0.35)]">
                <img
                  src={imageUrl("/api/photos/IMG_7339.JPG")}
                  alt="Пневмоподушка власного виробництва"
                  className="absolute inset-0 w-full h-full object-cover img-neutral"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20" />

                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
                  Серія · власне виробництво
                </span>

                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                  Опт · OEM · Роздріб
                </span>

                <div className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-10 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.14em] text-white/75 font-semibold">
                        Пневмоподушка · RP-2010
                      </div>
                      <div className="font-heading font-semibold text-[16px] xl:text-[19px] tracking-tight leading-tight mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        Серійна модель — ціна від виробника
                      </div>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#111111]">
                      <Check className="h-3 w-3 text-[#16A34A]" strokeWidth={3} />
                      На складі
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex-[1] min-h-0 grid grid-cols-[1.5fr_1fr] gap-3 lg:gap-3.5">
                <div className="relative rounded-[20px] overflow-hidden bg-[#111111] border border-[#E7E7E7]">
                  <img
                    src={imageUrl("/api/photos/IMG_7347.JPG")}
                    alt="Цех виробництва"
                    className="absolute inset-0 w-full h-full object-cover img-neutral"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#111111]">
                    Цех · Київ
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-heading font-semibold text-[13px] xl:text-[14.5px] tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                      Своє виробництво · повний цикл
                    </div>
                  </div>
                </div>

                <div className="relative rounded-[20px] overflow-hidden border border-[#111111] bg-[#111111] text-white flex flex-col">
                  <div className="flex-1 min-h-0 p-4 flex flex-col justify-between">
                    <div className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/60">
                      <Factory className="h-3 w-3" strokeWidth={2} />
                      Виробництво
                    </div>
                    <div>
                      <div className="font-heading font-semibold text-[44px] xl:text-[52px] leading-none tracking-tight">
                        20
                      </div>
                      <div className="mt-1 text-[10.5px] xl:text-[11px] text-white/65 uppercase tracking-[0.12em] font-semibold">
                        років в Україні
                      </div>
                    </div>
                  </div>
                  <div className="h-[3px] w-full bg-gradient-to-r from-[#22c55e] via-white/50 to-transparent" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SlideShell>
  );
}

// ==================================================================
// SLIDE 2 — MANUFACTURING (merged: full-cycle production + 20 років власного
// виробництва). Combines former Slide 2 (capabilities/QC) and Slide 4
// ("Чому виробництво, а не продавець") into one comprehensive editorial slide
// with photo composition on the right.
// ==================================================================
const CAPABILITIES = [
  {
    icon: Factory,
    title: "Власний цех у Києві",
    desc: "Повний цикл: вулканізація, збирання, тестування, відвантаження.",
  },
  {
    icon: Layers,
    title: "Європейська сировина",
    desc: "Гумовий корд, фітинги, компоненти — тільки перевірені матеріали.",
  },
  {
    icon: Gauge,
    title: "QC на кожному виробі",
    desc: "Опресовка до 16 бар, ресурсні випробування, протоколи партії.",
  },
  {
    icon: Cog,
    title: "Серія + OEM під ТЗ",
    desc: "Стандартні типорозміри та індивідуальне виготовлення під замовника.",
  },
];

const PRODUCTION_STATS = [
  { value: "20", label: "років в Україні" },
  { value: "30+", label: "типорозмірів" },
  { value: "OEM", label: "партії під марку" },
];

const PROD_PILLS = [
  { icon: Factory, title: "Свій цех" },
  { icon: Cog, title: "Повний цикл" },
  { icon: ShieldCheck, title: "Надійна робота" },
];

export function SlideProblem({ active, goTo }) {
  const { settings } = useSettings();
  return (
    <SlideShell dark>
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-white/5 blur-3xl" />

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="s2-merged"
            variants={container(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-h-0 grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10 xl:gap-14 items-stretch relative"
          >
            {/* LEFT: editorial copy + capabilities + stats + CTAs */}
            <div className="flex flex-col h-full min-w-0">
              <motion.div
                variants={item}
                className="inline-flex self-start items-center gap-2 rounded-[10px] bg-white/10 border border-white/15 text-white text-[11px] font-bold tracking-[0.16em] uppercase px-3 py-2"
              >
                <span className="font-heading text-white/60">02</span>
                <Factory className="h-3.5 w-3.5" strokeWidth={2.4} />
                Виробництво · 20 років
              </motion.div>

              <motion.h2
                variants={item}
                className="mt-4 font-heading font-semibold text-white text-[28px] sm:text-[40px] lg:text-[50px] xl:text-[58px] leading-[1.02] tracking-tight [text-wrap:balance]"
                data-testid="slide-manufacturing-title"
              >
                Виробництво <span className="text-white/55">повного циклу</span>
                <span className="block mt-1 text-[18px] sm:text-[22px] lg:text-[26px] xl:text-[30px] font-medium text-white/70 tracking-tight">
                  <span className="text-white">20 років</span> власного виробництва в Україні
                </span>
              </motion.h2>

              <motion.p
                variants={item}
                className="mt-4 lg:mt-5 text-[13.5px] lg:text-[15px] text-[#C7C7C7] max-w-xl leading-[1.55]"
              >
                Свій цех, власні інженери, європейська сировина та контроль якості на кожному етапі. Серійне виготовлення для опту та дилерів, індивідуальна робота під OEM — пряма робота з виробником без посередників.
              </motion.p>

              {/* Capability cards — compact 2×2 */}
              <motion.ul variants={item} className="mt-5 lg:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 max-w-xl">
                {CAPABILITIES.map((c, idx) => (
                  <motion.li
                    key={c.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18 + idx * 0.06, ease }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 shrink-0 h-9 w-9 lg:h-8 lg:w-8 rounded-[10px] bg-white/10 border border-white/15 grid place-items-center">
                      <c.icon className="h-4 w-4 text-white" strokeWidth={1.9} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-heading font-semibold text-white text-[14px] lg:text-[14px] tracking-tight leading-tight">
                        {c.title}
                      </div>
                      <div className="text-[12.5px] lg:text-[12px] text-[#A8A8A8] mt-1 leading-snug">
                        {c.desc}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Stats strip — same 20 / 30+ / OEM */}
              <motion.div
                variants={item}
                className="mt-5 lg:mt-5 grid grid-cols-3 gap-px rounded-[18px] overflow-hidden border border-white/10 bg-white/5 max-w-xl"
                data-testid="slide-manufacturing-stats"
              >
                {PRODUCTION_STATS.map((s) => (
                  <div key={s.label} className="bg-[#0B0B0B] px-4 py-4 lg:px-4 lg:py-3 flex flex-col">
                    <div className="font-heading font-semibold text-white text-[24px] lg:text-[24px] leading-none tracking-tight">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[10.5px] lg:text-[10.5px] text-[#A0A0A0] uppercase tracking-[0.1em] font-semibold leading-snug">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Quick trust pills */}
              <motion.ul variants={item} className="mt-4 lg:mt-4 flex flex-wrap gap-2 lg:gap-2">
                {PROD_PILLS.map((r) => (
                  <li
                    key={r.title}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-white/8 border border-white/15 px-3 py-1.5 text-[12px] lg:text-[12px] font-semibold text-white"
                  >
                    <r.icon className="h-3.5 w-3.5 text-[#22c55e]" strokeWidth={2.2} />
                    {r.title}
                  </li>
                ))}
              </motion.ul>

              {/* CTAs */}
              <motion.div variants={item} className="mt-auto pt-6 lg:pt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={telegramUrl(settings)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-14 lg:h-[58px] px-6 rounded-[12px] text-[14px] font-semibold bg-white text-[#111111] hover:bg-[#F1F1EF] transition-colors cta-lift"
                  data-testid="slide-manufacturing-cta"
                >
                  Отримати прайс від виробника <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => goTo(2)}
                  className="inline-flex items-center justify-center gap-2 h-14 lg:h-[58px] px-6 rounded-[12px] text-[13px] font-medium bg-white/8 text-white border border-white/15 hover:bg-white/15 transition-colors micro-lift"
                >
                  Продукція <ArrowDown className="h-4 w-4" />
                </button>
              </motion.div>
            </div>

            {/* RIGHT: photo composition — 1 hero + 2 small (cell · product · QC) */}
            <motion.div
              variants={scaleUp}
              className="relative hidden lg:grid grid-cols-3 grid-rows-2 gap-2.5 lg:gap-3 h-full min-h-0"
              data-testid="slide-manufacturing-photos"
            >
              {/* Big hero photo — workshop / Київ */}
              <div className="relative col-span-2 row-span-2 rounded-[22px] overflow-hidden bg-[#0B0B0B] border border-white/8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                <img
                  src={imageUrl("/api/photos/IMG_7347.JPG")}
                  alt="Цех виробництва пневмоподушок у Києві"
                  className="absolute inset-0 w-full h-full object-cover img-neutral"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />

                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
                  Цех · Київ
                </span>

                <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  <Factory className="h-3 w-3 text-white" strokeWidth={2.4} />
                  Повний цикл
                </span>

                <div className="absolute inset-x-0 bottom-0 px-4 lg:px-5 pb-3.5 lg:pb-4 pt-10 text-white">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-white/70 font-semibold">Виробництво</div>
                  <div className="font-heading font-semibold text-[17px] xl:text-[20px] tracking-tight leading-tight mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                    Повний цикл під одним дахом
                  </div>
                </div>
              </div>

              {/* Small: product closeup */}
              <div className="relative rounded-[16px] overflow-hidden bg-[#111111] border border-white/8">
                <img
                  src={imageUrl("/api/photos/IMG_7339.JPG")}
                  alt="Пневмоподушка серії RP — продукція власного виробництва"
                  className="absolute inset-0 w-full h-full object-cover img-neutral"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#111111]">
                  <Check className="h-2.5 w-2.5 text-[#16A34A]" strokeWidth={3} />
                  Продукція
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="font-heading font-semibold text-[12px] xl:text-[13.5px] tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                    Серійна модель RP-2010
                  </div>
                </div>
              </div>

              {/* Small: QC / install */}
              <div className="relative rounded-[16px] overflow-hidden bg-[#111111] border border-white/8">
                <img
                  src={imageUrl("/api/photos/IMG_7337.JPG")}
                  alt="Контроль якості та збирання у цеху"
                  className="absolute inset-0 w-full h-full object-cover img-neutral"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#111111]">
                  <Gauge className="h-2.5 w-2.5 text-[#111111]" strokeWidth={2.4} />
                  QC · 16 бар
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="font-heading font-semibold text-[12px] xl:text-[13.5px] tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                    Контроль якості партії
                  </div>
                </div>
              </div>
            </motion.div>

            {/* MOBILE photo strip — shown only on small screens since the
                desktop grid is lg:grid (hidden under lg). */}
            <motion.div
              variants={scaleUp}
              className="lg:hidden grid grid-cols-3 gap-2"
              data-testid="slide-manufacturing-photos-mobile"
            >
              {[
                { src: "/api/photos/IMG_7347.JPG", label: "Цех · Київ" },
                { src: "/api/photos/IMG_7339.JPG", label: "Продукція" },
                { src: "/api/photos/IMG_7337.JPG", label: "QC" },
              ].map((p) => (
                <div key={p.src} className="relative rounded-[12px] overflow-hidden bg-[#111111] border border-white/8 aspect-square">
                  <img src={imageUrl(p.src)} alt={p.label} className="absolute inset-0 w-full h-full object-cover img-neutral" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-1.5 left-1.5 inline-flex items-center rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#111111]">
                    {p.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SlideShell>
  );
}

// ==================================================================
// SLIDE 3 — PRODUCTS + CASES (merged: factory catalog + где работает)
// Top: categories + featured products · Bottom: real-world uses strip
// ==================================================================
const CASE_TAGS = [
  { tag: "Sprinter", desc: "Серійна модель RP-2010", img: "/api/photos/IMG_7327.JPG" },
  { tag: "Crafter", desc: "Комплект під замовлення", img: "/api/photos/IMG_7334.JPG" },
  { tag: "Transit", desc: "Балонна серія в пружину", img: "/api/photos/IMG_7330.JPG" },
  { tag: "Вантажні", desc: "Посилена пара ×2×3000 кг", img: "/api/photos/IMG_7352.JPG" },
  { tag: "Причепи", desc: "OEM-партії для виробників", img: "/api/photos/IMG_7356.JPG" },
];

const OTHER_USES_PILLS = [
  "СТО · підйомники",
  "Пневмопреси",
  "Конвеєри",
  "Кемпери",
  "Меблеве вир-во",
  "Віброізоляція",
];

export function SlideProductsAndCases({ active }) {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/categories").then((r) => r.data).catch(() => []),
      api.get("/products", { params: { featured: true } }).then((r) => r.data).catch(() => []),
    ]).then(([cats, prods]) => {
      if (cancelled) return;
      setCategories(cats);
      setFeatured(prods.slice(0, 3));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SlideShell>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div key="s3" variants={container(0.05)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 flex flex-col">
            <SlideHeader>
              <motion.div variants={item} className="flex items-end justify-between flex-wrap gap-3">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E7E7E7] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#111111]">
                    <span className="font-heading text-[#999999]">03</span>
                    Продукція виробництва · Де працює
                  </span>
                  <h2 className="mt-3 font-heading font-semibold text-[22px] sm:text-[28px] lg:text-[36px] xl:text-[42px] leading-[1.04] tracking-tight text-[#111111] [text-wrap:balance]">
                    Серійна лінійка, <span className="text-[#5C5C5C]">OEM-партії та реальні застосування</span>
                  </h2>
                  <p className="mt-2 text-[13px] sm:text-[13px] lg:text-[13.5px] text-[#555555] max-w-2xl">
                    Стандартні типорозміри в наявності, виготовлення під технічне завдання та приклади де працює наша продукція.
                  </p>
                </div>
              </motion.div>
            </SlideHeader>

            <SlideBody className="mt-4 lg:mt-3.5">
              <motion.div variants={item} className="flex-1 min-h-0 flex flex-col gap-3 lg:gap-3">
                {/* TOP: categories + featured products */}
                <div className="flex-[1.55] min-h-0 grid lg:grid-cols-[0.8fr_1.4fr] gap-3 lg:gap-3" data-testid="slide-products-layout">
                  {/* Categories list */}
                  <div className="rounded-[18px] lg:rounded-[18px] bg-white border border-[#E7E7E7] p-4 lg:p-3 flex flex-col min-h-0">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#F1F1EF]">
                      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#111111]">
                        <Boxes className="h-3.5 w-3.5" strokeWidth={2.2} />
                        Категорії
                      </div>
                      <span className="text-[10px] text-[#888888] font-semibold">
                        {loading ? "…" : `${categories.length} груп`}
                      </span>
                    </div>
                    <ul className="flex-1 min-h-0 overflow-hidden mt-2 flex flex-col gap-1 lg:gap-1.5">
                      {(loading ? Array.from({ length: 5 }) : categories.slice(0, 5)).map((c, i) =>
                        loading ? (
                          <li key={i} className="h-9 rounded-[8px] bg-[#F7F7F5] animate-pulse" />
                        ) : (
                          <li key={c.slug} className="min-w-0">
                            <div className="group flex items-center gap-2 h-9 lg:h-[40px] px-2 lg:px-2.5 rounded-[8px] lg:rounded-[10px] bg-[#FAFAF9] hover:bg-[#111111] hover:text-white transition-colors cursor-default micro-lift" data-testid={`slide-category-${c.slug}`}>
                              <span className="shrink-0 h-7 w-7 lg:h-8 lg:w-8 rounded-[6px] overflow-hidden bg-[#F1F1EF] relative">
                                {c.image ? (
                                  <img src={imageUrl(c.image)} alt="" className="absolute inset-0 w-full h-full object-cover img-neutral" loading="lazy" />
                                ) : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-heading font-semibold text-[12px] lg:text-[12.5px] tracking-tight truncate">
                                  {c.title}
                                </span>
                                <span className="block text-[9.5px] lg:text-[10px] text-[#777777] group-hover:text-[#C7C7C7] truncate uppercase tracking-[0.08em]">
                                  {typeof c.productCount === "number" ? `${c.productCount} шт` : "—"}
                                </span>
                              </span>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Featured products */}
                  <div className="min-h-0 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-3" data-testid="featured-products-grid">
                    {loading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="rounded-[16px] bg-white border border-[#E7E7E7] animate-pulse" />
                        ))
                      : featured.map((p) => <SlideProductCard key={p.slug} product={p} />)}
                  </div>
                </div>

                {/* BOTTOM: real-world cases strip + other uses */}
                <div className="flex-[1] min-h-0 grid lg:grid-cols-[1.6fr_1fr] gap-3 lg:gap-3" data-testid="slide-cases-strip">
                  {/* 5 case cards — desktop grid / mobile horizontal swipe */}
                  <div
                    className="min-h-0 grid grid-cols-2 gap-2.5 lg:grid lg:grid-cols-5 lg:gap-2.5"
                  >
                    {CASE_TAGS.map((c, i) => (
                      <article
                        key={c.tag}
                        className="group relative rounded-[16px] lg:rounded-[16px] overflow-hidden border border-[#E7E7E7] bg-white block aspect-[3/4] lg:aspect-auto micro-lift"
                        data-testid={`slide-case-${c.tag}`}
                      >
                        <div className="absolute inset-0 overflow-hidden bg-[#F1F1EF]">
                          <img
                            src={imageUrl(c.img)}
                            alt={c.tag}
                            loading={i < 3 ? "eager" : "lazy"}
                            className="w-full h-full object-cover img-neutral transition-transform duration-[900ms] group-hover:scale-[1.07]"
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/92 via-black/65 to-transparent" />

                        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 border border-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#111111]">
                          <Truck className="h-3 w-3" strokeWidth={2.2} />
                          {c.tag}
                        </span>

                        <div className="absolute inset-x-0 bottom-0 p-2.5 lg:p-2.5">
                          <div className="text-[11px] lg:text-[11px] text-white font-medium leading-[1.25]" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.95)' }}>
                            {c.desc}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Other uses card */}
                  <div className="rounded-[16px] lg:rounded-[16px] bg-[#111111] text-white border border-[#111111] p-4 lg:p-3.5 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 shrink-0">
                      <Sparkles className="h-4 w-4 text-[#F59E0B]" strokeWidth={2.2} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                        Не тільки авто
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] lg:text-[11.5px] text-white/65 leading-snug shrink-0">
                      Промислові застосування пневмоподушок:
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5 lg:gap-1.5 flex-1 content-start">
                      {OTHER_USES_PILLS.map((u) => (
                        <li
                          key={u}
                          className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[11px] lg:text-[11px] font-semibold text-white"
                        >
                          {u}
                        </li>
                      ))}
                    </ul>
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
