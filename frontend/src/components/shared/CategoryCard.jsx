import { Link } from "react-router-dom";
import { ArrowUpRight, Disc3, Layers, Wrench, Settings2, Sparkles, Truck, Package } from "lucide-react";
import { imageUrl } from "@/lib/utils";

const ICONS = { Disc3, Layers, Wrench, Settings2, Sparkles, Truck, Package };

export function CategoryCard({ category, featured = false }) {
  if (!category) return null;
  const Icon = ICONS[category.icon] || Package;
  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`group surface-card overflow-hidden flex flex-col soft-lift ${featured ? "lg:row-span-2" : ""}`}
      data-testid="category-card"
    >
      <div className={`relative overflow-hidden bg-[#F1F1EF] ${featured ? "aspect-[4/3] lg:aspect-[4/5]" : "aspect-[16/10]"}`}>
        {category.image ? (
          <img
            src={imageUrl(category.image)}
            alt={category.title}
            className="w-full h-full object-cover img-neutral transition-transform duration-700 group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 h-10 w-10 rounded-[12px] bg-white text-[#111111] grid place-items-center border border-[#E7E7E7]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        {typeof category.productCount === "number" && category.productCount > 0 ? (
          <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-white text-[#111111] text-[11px] font-semibold px-2.5 py-1 border border-[#E7E7E7]">
            {category.productCount} товарів
          </span>
        ) : null}
      </div>
      <div className="p-6 flex items-start justify-between gap-4 flex-1">
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-[#111111] text-xl tracking-tight leading-tight">{category.title}</h3>
          <p className="mt-2 text-sm text-[#666666] leading-relaxed line-clamp-2">{category.shortDescription}</p>
        </div>
        <span className="h-10 w-10 shrink-0 rounded-full bg-[#F1F1EF] grid place-items-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default CategoryCard;
