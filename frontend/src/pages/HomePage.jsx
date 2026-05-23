import { useEffect, useLayoutEffect } from "react";
import FullPage from "@/components/fullpage/FullPage";
import MobileStack from "@/components/fullpage/MobileStack";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  SlideProduction,
  SlideProblem,
  SlideProductsAndCases,
} from "@/components/fullpage/slides1to5";
import {
  SlideTestimonials,
  SlideFinal,
} from "@/components/fullpage/slides6to10";

// 5 slides — production-first / B2B (опт-first) funnel.
// Phase 6.3: merged former slides 02 (Виробництво повного циклу) and 04
// (20 років власного виробництва) into one comprehensive Manufacturing slide.
// Result: Hero → Виробництво (повний цикл · 20 років · photos) →
// Продукція + Кейси → Опт і партнери → Прайс.
const SLIDES = [
  SlideProduction,         // 01 — Hero
  SlideProblem,            // 02 — Виробництво повного циклу · 20 років (merged)
  SlideProductsAndCases,   // 03 — Продукція + Кейси
  SlideTestimonials,       // 04 — Опт і партнери
  SlideFinal,              // 05 — Прайс
];

const LABELS = [
  "Виробництво",
  "Виробництво · 20 років",
  "Продукція та кейси",
  "Опт і партнери",
  "Прайс",
];

export default function HomePage() {
  const isMobile = useIsMobile(768);

  // useLayoutEffect runs BEFORE paint — guarantees that home-lock is never
  // visible to the user on mobile (no FOUC where scroll is briefly locked).
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isMobile) {
      html.classList.remove("home-lock");
      body.classList.remove("home-lock");
      body.classList.add("mobile-home");
    } else {
      body.classList.remove("mobile-home");
      body.classList.add("home-lock");
      html.classList.add("home-lock");
    }
    return () => {
      html.classList.remove("home-lock");
      body.classList.remove("home-lock");
      body.classList.remove("mobile-home");
    };
  }, [isMobile]);

  // Extra safety: also clear stale classes on every render in case some
  // external script (e.g. modal portal, route transition) re-added them.
  useEffect(() => {
    if (!isMobile) return;
    const id = window.setInterval(() => {
      if (document.documentElement.classList.contains("home-lock")) {
        document.documentElement.classList.remove("home-lock");
      }
      if (document.body.classList.contains("home-lock")) {
        document.body.classList.remove("home-lock");
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [isMobile]);

  if (isMobile) {
    return <MobileStack slides={SLIDES} labels={LABELS} />;
  }

  return (
    <div className="fixed inset-0 z-0" data-testid="home-page">
      <FullPage slides={SLIDES} labels={LABELS} />
    </div>
  );
}
