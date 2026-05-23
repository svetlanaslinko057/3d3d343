import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail, Phone, MessageSquare, CheckCircle2, Package } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminLeadsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/leads")
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Помилка завантаження"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const remove = async (lead) => {
    if (!window.confirm("Видалити заявку?")) return;
    try {
      await api.delete(`/admin/leads/${lead.id}`);
      toast.success("Видалено");
      load();
    } catch (e) {
      toast.error("Помилка");
    }
  };

  const markRead = async (lead) => {
    if (lead.isRead) return;
    try {
      await api.post(`/admin/leads/${lead.id}/read`);
      load();
    } catch (e) {}
  };

  const fmtDate = (d) => {
    try {
      return new Date(d).toLocaleString("uk-UA", { dateStyle: "medium", timeStyle: "short" });
    } catch { return d; }
  };

  return (
    <div data-testid="admin-leads-page">
      <div className="mb-6">
        <h1 className="font-heading font-semibold text-2xl text-[#111111]">Заявки</h1>
        <p className="text-sm text-[#666666] mt-1">Всі заявки з форм зв'язку на сайті.</p>
      </div>

      {loading ? (
        <div className="surface-card h-64 animate-pulse" />
      ) : items.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <h3 className="font-heading font-semibold text-lg">Заявок ще немає</h3>
          <p className="mt-2 text-sm text-[#666666]">Коли користувач заповнить форму на сайті, вона з'явиться тут.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((l) => (
            <div
              key={l.id}
              className={`surface-card p-5 flex flex-col sm:flex-row sm:items-start gap-4 ${l.isRead ? "" : "border-[#111111] ring-1 ring-[#111111]/20"}`}
              onClick={() => markRead(l)}
              data-testid={`admin-lead-item-${l.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-semibold text-[#111111]">{l.name}</span>
                  {!l.isRead ? <span className="text-xs bg-[#F1F1EF] text-[#111111] border border-[#E7E7E7] px-2 py-0.5 rounded-full">Нова</span> : null}
                  <span className="text-xs text-[#666666]">{fmtDate(l.createdAt)}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1.5 text-[#111111] hover:text-[#111111]">
                    <Phone className="h-4 w-4" /> {l.phone}
                  </a>
                  {l.product_title ? (
                    <span className="inline-flex items-center gap-1.5 text-[#666666]">
                      <Package className="h-4 w-4" /> {l.product_title}
                    </span>
                  ) : null}
                </div>
                {l.message ? (
                  <div className="mt-3 flex items-start gap-2 text-sm text-[#666666]">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-[#666666]" />
                    <p className="whitespace-pre-wrap">{l.message}</p>
                  </div>
                ) : null}
              </div>
              <div className="flex sm:flex-col gap-2">
                <a
                  href={`tel:${l.phone}`}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#111111]"
                  title="Зателефонувати"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(l); }}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-[10px] text-[#111111] hover:bg-[#F1F1EF]"
                  title="Видалити"
                  data-testid={`admin-lead-delete-${l.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
