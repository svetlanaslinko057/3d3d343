import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Filter, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/shared/ProductCard";
import SectionHeading from "@/components/shared/SectionHeading";
import { CATEGORY_LABELS, CATEGORY_LIST } from "@/lib/constants";

const CATS = [{ value: "all", label: "Усі" }, ...CATEGORY_LIST];

const STATUSES = [
  { value: "all", label: "Всі статуси" },
  { value: "in_stock", label: "В наявності" },
  { value: "on_order", label: "Під замовлення" },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const statusF = searchParams.get("status") || "all";
  const q = searchParams.get("q") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "all") params.category = category;
    if (statusF !== "all") params.status = statusF;
    api.get("/products", { params })
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category, statusF]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const low = q.toLowerCase();
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(low) ||
        p.shortDescription.toLowerCase().includes(low) ||
        (CATEGORY_LABELS[p.category] || "").toLowerCase().includes(low)
    );
  }, [items, q]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="container-page section-y" data-testid="catalog-page">
      <SectionHeading
        eyebrow="Каталог"
        title="Усі пневморішення"
        subtitle="Пневмоподушки, комплекти пневмопідвіски, компоненти та індивідуальні рішення."
      />

      <div className="mt-8 sm:mt-10 grid lg:grid-cols-[300px_1fr] gap-5 sm:gap-6">
        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-between gap-2 h-12 px-4 rounded-[14px] border border-[#E7E7E7] bg-white text-[#111111] text-sm font-medium"
          data-testid="catalog-filters-toggle"
        >
          <span className="inline-flex items-center gap-2">
            <Filter className="h-4 w-4" /> Фільтри
            {(category !== "all" || statusF !== "all" || q) ? (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#111111] text-white text-[11px] font-bold">
                {[category !== "all", statusF !== "all", !!q].filter(Boolean).length}
              </span>
            ) : null}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Filters */}
        <aside className={`surface-card p-5 sm:p-6 h-max lg:sticky lg:top-24 ${filtersOpen ? "block" : "hidden"} lg:block`} data-testid="catalog-filters">
          <div className="flex items-center gap-2 text-[#111111] font-heading font-semibold tracking-tight">
            <Filter className="h-4 w-4" /> Фільтри
          </div>

          <div className="mt-5">
            <label className="text-[11px] font-semibold text-[#666666] uppercase tracking-[0.1em]">Пошук</label>
            <div className="relative mt-2">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="search"
                value={q}
                onChange={(e) => setParam("q", e.target.value)}
                placeholder="Назва або авто"
                className="w-full h-11 pl-9 pr-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
                data-testid="catalog-search-input"
              />
              {q ? (
                <button
                  onClick={() => setParam("q", "")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-[#666666] hover:text-[#111111]"
                  aria-label="Очистити"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-[11px] font-semibold text-[#666666] uppercase tracking-[0.1em]">Категорія</label>
            <div className="mt-2.5 flex flex-col gap-1.5">
              {CATS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setParam("category", c.value)}
                  className={`h-10 px-3 rounded-[10px] text-sm font-medium text-left transition-colors ${
                    (category || "all") === c.value
                      ? "bg-[#111111] text-white"
                      : "bg-transparent text-[#666666] hover:bg-[#F1F1EF] hover:text-[#111111]"
                  }`}
                  data-testid={`catalog-filter-category-${c.value}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-[11px] font-semibold text-[#666666] uppercase tracking-[0.1em]">Наявність</label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setParam("status", s.value)}
                  className={`h-9 px-3 rounded-full text-xs font-medium border transition-colors ${
                    (statusF || "all") === s.value
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-[#666666] border-[#E7E7E7] hover:bg-[#F1F1EF]"
                  }`}
                  data-testid={`catalog-filter-status-${s.value}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {(category !== "all" || statusF !== "all" || q) ? (
            <button
              onClick={() => setSearchParams({}, { replace: true })}
              className="mt-6 inline-flex items-center gap-2 text-sm text-[#111111] hover:underline font-medium"
              data-testid="catalog-filters-reset-button"
            >
              <X className="h-4 w-4" /> Скинути фільтри
            </button>
          ) : null}
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="text-sm text-[#666666]">
              Знайдено: <span className="text-[#111111] font-semibold">{filtered.length}</span>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="surface-card h-[460px] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="surface-card p-12 text-center" data-testid="catalog-empty-state">
              <h3 className="font-heading font-semibold text-xl">Нічого не знайдено</h3>
              <p className="mt-2 text-sm text-[#666666]">Спробуйте інший запит або скиньте фільтри.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6" data-testid="catalog-products-grid">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
