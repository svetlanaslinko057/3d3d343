import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, Trash2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { VEHICLE_TYPES, CATEGORY_LIST } from "@/lib/constants";
import { imageUrl } from "@/lib/utils";

const CATEGORIES = CATEGORY_LIST;

const EMPTY = {
  title: "",
  slug: "",
  category: "air-springs",
  shortDescription: "",
  fullDescription: "",
  image: "",
  gallery: [],
  status: "in_stock",
  badge: "",
  vehicleTypes: [],
  featured: false,
  isPublished: true,
  sortOrder: 0,
};

function makeSlug(s) {
  if (!s) return "";
  const map = { "а":"a","б":"b","в":"v","г":"h","ґ":"g","д":"d","е":"e","є":"ie","ж":"zh","з":"z","и":"y","і":"i","ї":"i","й":"i","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ь":"","ю":"iu","я":"ia","ъ":"","ы":"y","э":"e"," ":"-" };
  return s.toLowerCase().split("").map((c) => map[c] ?? c).join("").replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const fileRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    if (!isNew) {
      api.get(`/admin/products/${id}`)
        .then((res) => setForm({ ...EMPTY, ...res.data, badge: res.data.badge || "" }))
        .catch(() => toast.error("Не вдалося завантажити товар"))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const computedSlug = useMemo(() => (slugTouched || !isNew ? form.slug : makeSlug(form.title)), [form.slug, form.title, slugTouched, isNew]);

  const uploadImage = async (file, target) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (target === "main") {
        update("image", res.data.url);
      } else {
        update("gallery", [...(form.gallery || []), res.data.url]);
      }
      toast.success("Зображення завантажено");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Помилка завантаження");
    } finally {
      setUploading(false);
    }
  };

  const removeGallery = (idx) => {
    update("gallery", form.gallery.filter((_, i) => i !== idx));
  };

  const toggleVehicle = (v) => {
    const exists = form.vehicleTypes?.includes(v);
    update("vehicleTypes", exists ? form.vehicleTypes.filter((x) => x !== v) : [...(form.vehicleTypes || []), v]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Вкажіть назву");
    if (!form.image) return toast.error("Додайте головне зображення");
    const payload = {
      ...form,
      slug: computedSlug || makeSlug(form.title),
      sortOrder: Number(form.sortOrder) || 0,
      badge: form.badge?.trim() || null,
    };
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/admin/products", payload);
        toast.success("Товар створено");
      } else {
        await api.put(`/admin/products/${id}`, payload);
        toast.success("Товар оновлено");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="surface-card h-96 animate-pulse" />;
  }

  return (
    <form onSubmit={submit} data-testid="admin-product-form">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-[#666666] hover:text-[#111111]">
            <ArrowLeft className="h-4 w-4" /> До списку
          </Link>
          <h1 className="mt-2 font-heading font-semibold text-2xl text-[#111111]">
            {isNew ? "Новий товар" : "Редагування товару"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-[14px] bg-[#111111] text-white font-medium hover:bg-[#2A2A2A] disabled:opacity-60"
          data-testid="admin-product-save-button"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Зберегти
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className="surface-card p-5">
            <h3 className="font-heading font-semibold text-lg">Основна інформація</h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#666666]">Назва *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  data-testid="admin-product-title-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#666666]">Slug</label>
                <input
                  value={computedSlug}
                  onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }}
                  className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  placeholder="my-product"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#666666]">Категорія</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  data-testid="admin-product-category-select"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#666666]">Короткий опис *</label>
                <input
                  required
                  value={form.shortDescription}
                  onChange={(e) => update("shortDescription", e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
                  data-testid="admin-product-shortdesc-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#666666]">Повний опис</label>
                <textarea
                  rows={6}
                  value={form.fullDescription}
                  onChange={(e) => update("fullDescription", e.target.value)}
                  className="mt-1 w-full p-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] resize-y"
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-heading font-semibold text-lg">Зображення</h3>
            <div className="mt-4">
              <label className="text-xs font-semibold text-[#666666]">Головне фото *</label>
              <div className="mt-2 flex items-start gap-4">
                <div className="h-28 w-28 rounded-[14px] border border-[#E7E7E7] bg-slate-50 overflow-hidden">
                  {form.image ? <img src={imageUrl(form.image)} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <input
                    value={form.image}
                    onChange={(e) => update("image", e.target.value)}
                    placeholder="URL або завантажте файл"
                    className="w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm"
                    data-testid="admin-product-image-input"
                  />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0], "main")} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="mt-2 inline-flex items-center gap-2 h-10 px-4 rounded-[12px] border border-[#E7E7E7] bg-white text-sm hover:bg-slate-50 disabled:opacity-60"
                    data-testid="admin-product-upload-main-button"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Завантажити
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#666666]">Галерея ({(form.gallery || []).length})</label>
                <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0], "gallery")} />
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-[10px] border border-[#E7E7E7] bg-white text-sm hover:bg-slate-50"
                >
                  <Upload className="h-3.5 w-3.5" /> Додати
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {(form.gallery || []).map((g, i) => (
                  <div key={i} className="relative aspect-square rounded-[12px] overflow-hidden border border-[#E7E7E7]">
                    <img src={imageUrl(g)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      className="absolute top-1 right-1 h-7 w-7 grid place-items-center rounded-full bg-white/90 text-[#111111] hover:bg-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-5">
            <h3 className="font-heading font-semibold text-lg">Публікація</h3>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm">Опубліковано</span>
              <button
                type="button"
                onClick={() => update("isPublished", !form.isPublished)}
                className={`h-7 w-12 rounded-full relative transition-colors ${form.isPublished ? "bg-[#16A34A]" : "bg-slate-300"}`}
                data-testid="admin-product-publish-toggle"
              >
                <span className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow transition-all ${form.isPublished ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">Featured</span>
              <button
                type="button"
                onClick={() => update("featured", !form.featured)}
                className={`h-7 w-12 rounded-full relative transition-colors ${form.featured ? "bg-[#111111]" : "bg-slate-300"}`}
                data-testid="admin-product-featured-toggle"
              >
                <span className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow transition-all ${form.featured ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-[#666666]">Порядок</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => update("sortOrder", e.target.value)}
                className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm"
              />
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-heading font-semibold text-lg">Статус</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { v: "in_stock", l: "В наявності" },
                { v: "on_order", l: "Під замовлення" },
              ].map((s) => (
                <button
                  type="button"
                  key={s.v}
                  onClick={() => update("status", s.v)}
                  className={`h-11 rounded-[12px] text-sm font-medium border ${
                    form.status === s.v
                      ? "bg-[#101828] text-white border-[#101828]"
                      : "bg-white border-[#E7E7E7] text-[#666666] hover:bg-slate-50"
                  }`}
                >
                  {s.l}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold text-[#666666]">Бейдж (опціонально)</label>
              <input
                value={form.badge || ""}
                onChange={(e) => update("badge", e.target.value)}
                placeholder="ТОП, Новинка..."
                className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm"
              />
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-heading font-semibold text-lg">Застосування</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {VEHICLE_TYPES.map((v) => {
                const active = form.vehicleTypes?.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => toggleVehicle(v)}
                    className={`h-9 px-3 rounded-full text-xs font-medium border ${
                      active ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-[#666666] border-[#E7E7E7]"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
