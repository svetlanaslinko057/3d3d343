import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";
import { AuthProvider, RequireAdmin } from "@/lib/auth-context";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import HomePage from "@/pages/HomePage";
// NOTE: Legacy public pages (Catalog, ProductDetail, Category, About, Contacts, FAQ)
// are intentionally kept in the codebase but their routes are hidden — all legacy
// URLs redirect to "/". To bring them back, simply re-enable the original <Route>
// elements below.
// import CatalogPage from "@/pages/CatalogPage";
// import ProductDetailPage from "@/pages/ProductDetailPage";
// import CategoryPage from "@/pages/CategoryPage";
// import AboutPage from "@/pages/AboutPage";
// import ContactsPage from "@/pages/ContactsPage";
// import FAQPage from "@/pages/FAQPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProductsListPage from "@/pages/admin/AdminProductsListPage";
import AdminProductFormPage from "@/pages/admin/AdminProductFormPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminLeadsPage from "@/pages/admin/AdminLeadsPage";

function App() {
  return (
    <div className="App">
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes — only home is active. Legacy catalog pages redirect. */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                {/* Hidden legacy routes — redirect to home */}
                <Route path="/catalog" element={<Navigate to="/" replace />} />
                <Route path="/catalog/:slug" element={<Navigate to="/" replace />} />
                <Route path="/categories/:slug" element={<Navigate to="/" replace />} />
                <Route path="/about" element={<Navigate to="/" replace />} />
                <Route path="/contacts" element={<Navigate to="/" replace />} />
                <Route path="/faq" element={<Navigate to="/" replace />} />
              </Route>

              {/* Admin login */}
              <Route path="/admin" element={<AdminLoginPage />} />

              {/* Admin protected */}
              <Route
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsListPage />} />
                <Route path="/admin/products/new" element={<AdminProductFormPage />} />
                <Route path="/admin/products/:id" element={<AdminProductFormPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/leads" element={<AdminLeadsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
