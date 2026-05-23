import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings-context";

const FIELDS = [
  { key: "company_name", label: "Назва компанії" },
  { key: "tagline", label: "Слоган" },
  { key: "telegram_username", label: "Telegram username (без @)" },
  { key: "whatsapp_number", label: "WhatsApp номер (без +)" },
  { key: "phone", label: "Телефон" },
  { key: "email", label: "Email" },
  { key: "working_hours", label: "Режим роботи" },
  { key: "address", label: "Адреса" },
  { key: "city", label: "Місто" },
  { key: "country", label: "Країна" },
];

export default function AdminSettingsPage() {
  const { refresh } = useSettings();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings").then((res) => setForm(res.data)).finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/settings", form);
      await refresh();
      toast.success("Налаштування збережено");
    } catch (e) {
      toast.error("Помилка");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="surface-card h-96 animate-pulse" />;

  return (
    <form onSubmit={submit} data-testid="admin-settings-form">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#111111]">Налаштування</h1>
          <p className="text-sm text-[#666666] mt-1">Контактні дані компанії та сайту.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-[14px] bg-[#111111] text-white font-medium hover:bg-[#2A2A2A] disabled:opacity-60"
          data-testid="admin-settings-save-button"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Зберегти
        </button>
      </div>

      <div className="surface-card p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === "tagline" || f.key === "address" ? "sm:col-span-2" : ""}>
            <label className="text-xs font-semibold text-[#666666]">{f.label}</label>
            <input
              value={form[f.key] || ""}
              onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))}
              className="mt-1 w-full h-11 px-3 rounded-[12px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
              data-testid={`admin-settings-${f.key}-input`}
            />
          </div>
        ))}
      </div>
    </form>
  );
}
