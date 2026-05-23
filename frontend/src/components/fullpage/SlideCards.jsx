import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Disc3,
  Layers,
  Wrench,
  Settings2,
  Sparkles,
  Truck,
  Package,
  Factory,
} from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { telegramUrl } from "@/lib/cta";
import { CATEGORY_LABELS } from "@/lib/constants";
import { imageUrl } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

const ICONS = { Disc3, Layers, Wrench, Settings2, Sparkles, Truck, Package };

const SLUG_BENEFITS = {
  "air-springs-sprinter": "Серійна модель з виробництва",
  "air-suspension-kit-crafter": "Комплект під замовлення",
  "air-springs-transit": "Балонна серія",
  "air-suspension-kit-truck": "Партії для вантажівок",
  "air-suspension-kit-trailer": "OEM-партії",
  "compressor-12v-3l": "Стандартний компонент",
  "fittings-lines-kit": "Серійний монтажний набір",
  "dual-manometer": "Електронний контроль",
  "installation-kyiv": "Послуга в Києві",
  "custom-solution-special": "Під технічне завдання",
  "air-springs-passenger": "Балонна серія",
  "control-valve-block": "Електропневмо блок",
  "air-suspension-rv": "OEM-серія для кемперів",
};

function pickBenefit(p) {
  if (SLUG_BENEFITS[p.slug]) return SLUG_BENEFITS[p.slug];
  const cat = p.category;
  if (cat === "air-springs") return "Власне виробництво";
  if (cat === "air-suspension") return "Комплект з виробництва";
  if (cat === "components") return "Стандартний компонент";
  if (cat === "installation") return "Послуга при замовленні";
  if (cat === "custom-solutions") return "Під ТЗ";
  if (cat === "by-vehicle") return "Серія під авто";
  return "Виробництво · Україна";
}

/**
 * Compact CategoryCard for fullpage slide — fills available grid cell height.
 * Image flexes to fill remaining space; meta sits at bottom with fixed height.
 */
export function SlideCategoryCard({ category }) {
  if (!category) return null;
  const Icon = ICONS[category.icon] || Package;
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative rounded-[16px] lg:rounded-[18px] overflow-hidden bg-white border border-[#E7E7E7] soft-lift flex flex-col h-full min-h-0"
      data-testid="slide-category-card"
    >
      <div className="relative flex-1 min-h-0 bg-[#F1F1EF] overflow-hidden">
        {category.image ? (
          <img
            src={imageUrl(category.image)}
            alt={category.title}
            className="absolute inset-0 w-full h-full object-cover img-neutral transition-transform duration-700 group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute top-2.5 left-2.5 h-8 w-8 rounded-[10px] bg-white text-[#111111] grid place-items-center border border-[#E7E7E7] shadow-sm">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        {typeof category.productCount === "number" && category.productCount > 0 ? (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center rounded-full bg-white/95 text-[#111111] text-[10px] font-semibold px-2 py-0.5 border border-[#E7E7E7]">
            {category.productCount}
          </span>
        ) : null}
      </div>
      <div className="shrink-0 p-3 lg:p-3.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading font-semibold text-[#111111] text-[13px] sm:text-[14px] lg:text-[15px] tracking-tight leading-tight truncate">
            {category.title}
          </h3>
          <p className="mt-0.5 text-[11px] sm:text-[11.5px] text-[#666666] leading-snug line-clamp-1">
            {category.shortDescription}
          </p>
        </div>
        <span className="shrink-0 h-7 w-7 rounded-full bg-[#F1F1EF] grid place-items-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Compact ProductCard for fullpage slide — fills grid cell height; image flexes.
 */
export function SlideProductCard({ product }) {
  const { settings } = useSettings();
  if (!product) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[16px] lg:rounded-[20px] overflow-hidden bg-white border border-[#E7E7E7] soft-lift flex flex-col h-full min-h-0"
      data-testid="product-card"
    >
      <div className="block relative flex-1 min-h-0 overflow-hidden bg-[#F1F1EF]">
        <img
          src={imageUrl(product.image)}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover img-neutral transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[calc(100%-20px)]">
          <StatusBadge status={product.status} />
          {product.badge ? (
            <span className="inline-flex items-center rounded-full bg-[#111111] text-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em]">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 border border-white px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[#111111]">
          <Factory className="h-3 w-3" strokeWidth={2} />
          <span>Виробництво</span>
        </div>
      </div>

      <div className="shrink-0 px-3 pt-3 pb-4 lg:p-3.5 flex flex-col gap-1.5">
        <div className="text-[9.5px] sm:text-[10px] text-[#666666] uppercase tracking-[0.1em] font-semibold truncate">
          {CATEGORY_LABELS[product.category] || product.category}
        </div>
        <h3
          className="font-heading font-semibold text-[#111111] text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] leading-tight tracking-tight line-clamp-2"
          data-testid="product-card-title"
        >
          {product.title}
        </h3>
        <div className="flex items-start gap-1.5 text-[11.5px] sm:text-[12px] text-[#1A1A1A] font-medium">
          <Check className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.4} />
          <span className="line-clamp-1">{pickBenefit(product)}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <a
            href={telegramUrl(settings, product.title)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 lg:h-10 px-2.5 rounded-[10px] lg:rounded-[12px] text-[12px] lg:text-[12.5px] font-semibold bg-[#111111] text-white hover:bg-[#000000] transition-colors whitespace-nowrap"
            data-testid="product-card-telegram-button"
          >
            <span className="truncate">Прайс</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
