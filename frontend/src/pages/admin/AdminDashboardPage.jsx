import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle2, Star, Inbox, FolderTree, Plus, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { imageUrl } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard-stats").then((res) => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Всього товарів", value: stats.totalProducts, icon: Package, color: "text-[#111111]" },
        { label: "Опубліковано", value: stats.publishedProducts, icon: CheckCircle2, color: "text-[#16A34A]" },
        { label: "В наявності", value: stats.inStockProducts, icon: Package, color: "text-[#16A34A]" },
        { label: "Обрані (featured)", value: stats.featuredProducts, icon: Star, color: "text-[#F59E0B]" },
        { label: "Заявки", value: stats.totalLeads, icon: Inbox, color: "text-[#111111]" },
        { label: "Нові заявки", value: stats.newLeads, icon: Inbox, color: "text-[#111111]" },
        { label: "Категорії", value: stats.totalCategories, icon: FolderTree, color: "text-[#111111]" },
      ]
    : [];

  return (
    <div data-testid="admin-dashboard-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#111111]">Дашборд</h1>
          <p className="text-sm text-[#666666] mt-1">Статистика сайту та швидкий доступ до управління.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 h-11 px-4 rounded-[14px] bg-[#111111] text-white font-medium hover:bg-[#2A2A2A]"
          data-testid="admin-dashboard-new-product-button"
        >
          <Plus className="h-4 w-4" /> Додати товар
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="surface-card h-28 animate-pulse" />
            ))
          : cards.map((c) => (
              <div key={c.label} className="surface-card p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#666666]">{c.label}</div>
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </div>
                <div className="mt-2 font-heading font-semibold text-2xl text-[#111111]">{c.value}</div>
              </div>
            ))}
      </div>

      {stats?.recentProducts && stats.recentProducts.length > 0 ? (
        <div className="mt-8 surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-lg">Останні оновлення</h3>
            <Link to="/admin/products" className="text-sm text-[#111111] inline-flex items-center gap-1 hover:underline">
              Усі товари <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-[#E4E7EC]">
            {stats.recentProducts.map((p) => (
              <Link
                key={p.id}
                to={`/admin/products/${p.id}`}
                className="flex items-center gap-4 py-3 hover:bg-slate-50 rounded-[12px] px-2 -mx-2 transition-colors"
              >
                <img src={imageUrl(p.image)} alt={p.title} className="h-12 w-12 rounded-[10px] object-cover border border-[#E7E7E7]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#111111] truncate">{p.title}</div>
                  <div className="text-xs text-[#666666]">{p.category}</div>
                </div>
                <div className="text-xs text-[#666666]">{p.isPublished ? "Опубліковано" : "Чернетка"}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
