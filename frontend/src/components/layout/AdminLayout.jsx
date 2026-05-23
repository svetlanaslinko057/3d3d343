import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Settings, Inbox, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { to: "/admin/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { to: "/admin/products", label: "Товари", icon: Package },
  { to: "/admin/leads", label: "Заявки", icon: Inbox },
  { to: "/admin/settings", label: "Налаштування", icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F8FA]" data-testid="admin-layout">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E7E7E7]">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden h-10 w-10 rounded-[12px] border border-[#E7E7E7] bg-white grid place-items-center"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
              data-testid="admin-sidebar-toggle"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-[14px] bg-[#111111] text-white grid place-items-center font-heading font-bold">П</span>
              <span className="font-heading font-semibold text-[#111111]">Адмінпанель</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 h-10 rounded-[12px] text-sm text-[#111111] hover:bg-slate-50 border border-[#E7E7E7]"
              data-testid="admin-view-site-link"
            >
              <ExternalLink className="h-4 w-4" /> Відкрити сайт
            </Link>
            <span className="hidden md:inline text-sm text-[#666666]">{admin?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 h-10 rounded-[12px] text-sm text-white bg-[#101828] hover:bg-black"
              data-testid="admin-logout-button"
            >
              <LogOut className="h-4 w-4" /> Вийти
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[#E7E7E7] bg-white min-h-[calc(100vh-4rem)]">
          <nav className="p-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 h-11 rounded-[12px] text-sm font-medium transition-colors ${
                    isActive ? "bg-[#111111] text-white" : "text-[#666666] hover:bg-slate-50"
                  }`
                }
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Sidebar (mobile) */}
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <aside className="absolute top-16 bottom-0 left-0 w-72 bg-white border-r border-[#E7E7E7] p-4" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-3 h-11 rounded-[12px] text-sm font-medium ${
                        isActive ? "bg-[#111111] text-white" : "text-[#666666] hover:bg-slate-50"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-4 w-4" /> {item.label}
                  </NavLink>
                ))}
              </nav>
            </aside>
          </div>
        ) : null}

        <main className="flex-1 min-w-0">
          <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
