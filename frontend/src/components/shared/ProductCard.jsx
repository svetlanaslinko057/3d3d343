import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Factory } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl } from "@/lib/cta";
import { CATEGORY_LABELS } from "@/lib/constants";
import { imageUrl } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

const SLUG_BENEFITS = {
  "air-springs-sprinter": "Серійна модель · власне виробництво",
  "air-suspension-kit-crafter": "Комплект під замовлення, термін 5–10 днів",
  "air-springs-transit": "Балонна серія · власна вулканізація",
  "air-suspension-kit-truck": "Партії для вантажівок · до 7.5 т",
  "air-suspension-kit-trailer": "OEM-партії для виробників причепів",
  "compressor-12v-3l": "Стандартний компонент серії",
  "fittings-lines-kit": "Серійний монтажний набір",
  "dual-manometer": "Електронний контрольний компонент",
  "installation-kyiv": "Послуга в Києві (опціонально)",
  "custom-solution-special": "Виготовлення під технічне завдання",
  "air-springs-passenger": "Балонна серія, без зварювання",
  "control-valve-block": "Електропневмо блок керування серії",
  "air-suspension-rv": "OEM-серія для кемперів і автодомів",
};

function pickBenefit(product) {
  const slugBenefit = SLUG_BENEFITS[product.slug];
  if (slugBenefit) return slugBenefit;
  const cat = product.category;
  if (cat === "air-springs") return "Серійна продукція власного виробництва";
  if (cat === "air-suspension") return "Комплект з виробництва";
  if (cat === "components") return "Стандартний компонент";
  if (cat === "installation") return "Послуга при замовленні";
  if (cat === "custom-solutions") return "Виготовлення під ТЗ";
  if (cat === "by-vehicle") return "Серія під авто";
  return "Виробник · Україна";
}

export function ProductCard({ product }) {
  const { settings } = useSettings();
  if (!product) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group surface-card overflow-hidden flex flex-col soft-lift"
      data-testid="product-card"
    >
      <Link to={`/catalog/${product.slug}`} className="block relative overflow-hidden bg-[#F1F1EF] aspect-[4/3]">
        <img
          src={imageUrl(product.image)}
          alt={product.title}
          className="w-full h-full object-cover img-neutral transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 max-w-[calc(100%-24px)]">
          <StatusBadge status={product.status} />
          {product.badge ? (
            <span className="inline-flex items-center rounded-full bg-[#111111] text-white px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.02em]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-[#111111]">
          <Factory className="h-3 w-3" strokeWidth={2} />
          <span className="hidden sm:inline">Власне виробництво</span>
          <span className="sm:hidden">Виробництво</span>
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#666666] uppercase tracking-[0.1em] font-semibold">
          <span className="truncate">{CATEGORY_LABELS[product.category] || product.category}</span>
        </div>

        <h3
          className="font-heading font-semibold text-[#111111] text-[17px] sm:text-[19px] leading-snug mt-2 sm:mt-2.5 line-clamp-2 tracking-tight group-hover:text-[#000000]"
          data-testid="product-card-title"
        >
          <Link to={`/catalog/${product.slug}`}>
            {product.title}
          </Link>
        </h3>

        <div className="mt-2.5 sm:mt-3 inline-flex items-start gap-2 text-[12.5px] sm:text-[13px] text-[#111111] font-medium">
          <Check className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.2} />
          <span>{pickBenefit(product)}</span>
        </div>

        {product.vehicleTypes && product.vehicleTypes.length > 0 ? (
          <div className="mt-3 sm:mt-4 rounded-[12px] sm:rounded-[14px] bg-[#F1F1EF] border border-[#E7E7E7] p-2.5 sm:p-3">
            <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#666666]">Сумісність</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {product.vehicleTypes.slice(0, 3).map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center rounded-md bg-white border border-[#E7E7E7] px-2 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-[#111111]"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto pt-4 sm:pt-5 flex items-center gap-2">
          <a
            href={telegramUrl(settings, product.title)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 h-11 sm:h-12 px-3 rounded-[12px] sm:rounded-[14px] text-[12.5px] sm:text-sm font-semibold bg-[#111111] text-white hover:bg-[#000000] transition-colors whitespace-nowrap"
            data-testid="product-card-telegram-button"
          >
            <span className="truncate">Отримати прайс</span> <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          </a>
          <Link
            to={`/catalog/${product.slug}`}
            className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-[12px] sm:rounded-[14px] bg-white border border-[#E7E7E7] grid place-items-center text-[#111111] hover:bg-[#F1F1EF] transition-colors"
            data-testid="product-card-details-link"
            aria-label="Детальніше"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
