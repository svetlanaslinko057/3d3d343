import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Search } from "lucide-react";
import { api } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/constants";
import { imageUrl } from "@/lib/utils";

export default function AdminProductsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/admin/products")
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Не вдалося завантажити товари"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const togglePublished = async (p) => {
    try {
      await api.put(`/admin/products/${p.id}`, { isPublished: !p.isPublished });
      toast.success(p.isPublished ? "Товар приховано" : "Товар опубліковано");
      load();
    } catch (e) {
      toast.error("Помилка");
    }
  };

  const toggleFeatured = async (p) => {
    try {
      await api.put(`/admin/products/${p.id}`, { featured: !p.featured });
      toast.success("Оновлено");
      load();
    } catch (e) {
      toast.error("Помилка");
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Видалити товар "${p.title}"?`)) return;
    try {
      await api.delete(`/admin/products/${p.id}`);
      toast.success("Товар видалено");
      load();
    } catch (e) {
      toast.error("Помилка");
    }
  };

  const filtered = q
    ? items.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.slug.toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <div data-testid="admin-products-list-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#111111]">Товари</h1>
          <p className="text-sm text-[#666666] mt-1">Управляйте асортиментом, видимістю та порядком відображення.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 h-11 px-4 rounded-[14px] bg-[#111111] text-white font-medium hover:bg-[#2A2A2A]"
          data-testid="admin-products-new-button"
        >
          <Plus className="h-4 w-4" /> Новий товар
        </Link>
      </div>

      <div className="mt-6 surface-card overflow-hidden">
        <div className="p-4 border-b border-[#E7E7E7] flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Пошук за назвою або slug"
              className="w-full h-10 pl-9 pr-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
              data-testid="admin-products-search-input"
            />
          </div>
          <div className="text-sm text-[#666666]">Всього: {filtered.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-[#666666] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Фото</th>
                <th className="px-4 py-3">Назва</th>
                <th className="px-4 py-3">Категорія</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Порядок</th>
                <th className="px-4 py-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[#666666]">Завантаження…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[#666666]">Товарів не знайдено</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-[#E7E7E7] hover:bg-slate-50" data-testid={`admin-product-row-${p.slug}`}>
                    <td className="px-4 py-3">
                      <img src={imageUrl(p.image)} alt="" className="h-12 w-12 rounded-[10px] object-cover border border-[#E7E7E7]" />
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/products/${p.id}`} className="font-medium text-[#111111] hover:text-[#111111]">{p.title}</Link>
                      <div className="text-xs text-[#666666]">/{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{CATEGORY_LABELS[p.category] || p.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${p.status === "in_stock" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                          {p.status === "in_stock" ? "В наявн." : "Під зам."}
                        </span>
                        {p.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">Опублік.</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200">Прихов.</span>
                        )}
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#F1F1EF] text-[#111111] border border-[#E7E7E7]">Featured</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#666666]">{p.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => togglePublished(p)}
                          className="h-9 w-9 grid place-items-center rounded-[10px] hover:bg-slate-100 text-[#111111]"
                          title={p.isPublished ? "Приховати" : "Опублікувати"}
                          data-testid={`admin-product-toggle-publish-${p.slug}`}
                        >
                          {p.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(p)}
                          className="h-9 w-9 grid place-items-center rounded-[10px] hover:bg-slate-100 text-[#111111]"
                          title={p.featured ? "Зняти featured" : "Featured"}
                          data-testid={`admin-product-toggle-featured-${p.slug}`}
                        >
                          {p.featured ? <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> : <StarOff className="h-4 w-4" />}
                        </button>
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="h-9 w-9 grid place-items-center rounded-[10px] hover:bg-slate-100 text-[#111111]"
                          title="Редагувати"
                          data-testid={`admin-product-edit-${p.slug}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(p)}
                          className="h-9 w-9 grid place-items-center rounded-[10px] hover:bg-[#F1F1EF] text-[#111111]"
                          title="Видалити"
                          data-testid={`admin-product-delete-${p.slug}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
