import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const { login, admin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && admin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, loading, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error("Введіть email та пароль");
      return;
    }
    setSubmitting(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      toast.success("Успішний вхід");
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Помилка входу";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] grid place-items-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md surface-card p-8">
        <div className="flex items-center gap-2">
          <span className="h-10 w-10 rounded-[14px] bg-[#111111] text-white grid place-items-center font-heading font-bold text-lg">П</span>
          <span className="font-heading font-semibold text-lg text-[#111111]">Адмінпанель</span>
        </div>
        <h1 className="mt-5 font-heading font-semibold text-2xl text-[#111111]">Вхід в адмінку</h1>
        <p className="text-sm text-[#666666] mt-1">Введіть свій email та пароль, щоб керувати сайтом.</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <div className="relative">
            <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="email"
              required
              autoFocus
              placeholder="admin@pnevmo.ua"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full h-12 pl-9 pr-3 rounded-[16px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
              data-testid="admin-login-email-input"
            />
          </div>
          <div className="relative">
            <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="password"
              required
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full h-12 pl-9 pr-3 rounded-[16px] border border-[#E7E7E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111111]"
              data-testid="admin-login-password-input"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="h-12 rounded-[16px] bg-[#111111] text-white font-medium hover:bg-[#2A2A2A] transition-colors disabled:opacity-60"
            data-testid="admin-login-submit-button"
          >
            {submitting ? "Вхід…" : "Увійти"}
          </button>
        </form>

        <div className="mt-6 text-xs text-[#666666] p-3 rounded-[12px] bg-slate-50 border border-[#E7E7E7]">
          Демо: <code className="text-[#111111]">admin@pnevmo.ua</code> / <code className="text-[#111111]">admin123</code>
        </div>

        <div className="mt-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#666666] hover:text-[#111111]">
            <ArrowLeft className="h-4 w-4" /> До сайту
          </Link>
        </div>
      </div>
    </div>
  );
}
