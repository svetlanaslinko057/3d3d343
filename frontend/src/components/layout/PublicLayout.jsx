import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) {
    // Fullpage catalog mode: HomePage renders CatalogChrome itself; no regular header/footer.
    return (
      <div className="relative bg-[#F7F7F5]" data-testid="public-layout-home">
        <Outlet />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F7F7F5] overflow-x-hidden"
      data-testid="public-layout"
    >
      <Header />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
      <StickyMobileCTA />
    </div>
  );
}
