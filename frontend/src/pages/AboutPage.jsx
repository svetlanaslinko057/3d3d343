import { Factory, ShieldCheck, Users, Truck } from "lucide-react";
import ContactButtons from "@/components/shared/ContactButtons";
import SectionHeading from "@/components/shared/SectionHeading";
import { imageUrl } from "@/lib/utils";

const STATS = [
  { k: "5+", v: "років у ніші" },
  { k: "1000+", v: "встановлених комплектів" },
  { k: "24 г", v: "середня відповідь" },
  { k: "100%", v: "покриття України" },
];

const VALUES = [
  { icon: Factory, title: "Власне виробництво", desc: "Пневмоподушки та комплекти виготовляємо в Україні — якісний контроль на кожному етапі." },
  { icon: ShieldCheck, title: "Гарантія та сервіс", desc: "Гарантія до 24 місяців на власну продукцію. Завжди на зв'язку після встановлення." },
  { icon: Users, title: "Підхід до клієнта", desc: "Проконсультуємо, підберемо рішення, підкажемо сумісні запчастини." },
  { icon: Truck, title: "Швидка доставка", desc: "Відправляємо в день замовлення по всій Україні зручним перевізником." },
];

export default function AboutPage() {
  return (
    <div className="container-page section-y" data-testid="about-page">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="eyebrow"><span className="h-1 w-1 rounded-full bg-[#111111]" /> Про компанію</div>
          <h1 className="mt-4 font-heading font-semibold text-[#111111] text-4xl sm:text-5xl lg:text-[60px] leading-[1.02] tracking-tight">
            Виробник пневмоподушок та комплектів пневмопідвіски
          </h1>
          <p className="mt-6 text-[#666666] text-base sm:text-lg leading-relaxed">
            П'ять+ років спеціалізуємося виключно на пневмопідвісці для комерційного транспорту.
            Виготовляємо подушки, збираємо комплекти під конкретні моделі та підбираємо компоненти від перевірених виробників.
          </p>
          <p className="mt-4 text-[#666666] text-base sm:text-lg leading-relaxed">
            Команда інженерів, техніків та консультантів — на всіх етапах: від підбору до встановлення та обслуговування.
          </p>

          <div className="mt-8">
            <ContactButtons />
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="aspect-[4/3] bg-[#F1F1EF]">
            <img
              src={imageUrl("/api/photos/IMG_7340.JPG")}
              alt="Наше виробництво"
              className="w-full h-full object-cover img-neutral"
            />
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.v} className="rounded-[18px] bg-[#F7F7F5] border border-[#E7E7E7] p-5 text-center">
                <div className="font-heading text-2xl font-semibold text-[#111111] tracking-tight">{s.k}</div>
                <div className="text-[11px] text-[#666666] mt-1 uppercase tracking-[0.08em]">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24">
        <SectionHeading eyebrow="Цінності" title="Що для нас важливо" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <div key={v.title} className="surface-card p-7 soft-lift">
              <div className="h-12 w-12 rounded-[14px] bg-[#111111] text-white grid place-items-center">
                <v.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-heading font-semibold text-[19px] tracking-tight">{v.title}</h3>
              <p className="mt-2 text-sm text-[#666666] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
