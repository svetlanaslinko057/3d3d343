import { useLayoutEffect } from "react";
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
const SLIDES = [
  SlideProduction,
  SlideProblem,
  SlideProductsAndCases,
  SlideTestimonials,
  SlideFinal,
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

  // CRITICAL: Use useLayoutEffect to set body class BEFORE first paint.
  // This avoids any flash of locked-scroll on mobile.
  //
  // On MOBILE (< 768px): body must scroll naturally. We don't need any
  // home-lock class — MobileStack renders content in document flow.
  //
  // On DESKTOP (>= 768px): FullPage uses `fixed inset-0` which removes it
  // from document flow, so body has no content height and naturally
  // doesn't scroll. No home-lock needed for that either.
  //
  // We only ensure ALL legacy lock classes are CLEARED so stale state
  // from a previous page (e.g. user navigated away then back) never
  // leaves the body in a locked state.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    // Remove any legacy lock classes that may have been left over
    html.classList.remove("home-lock");
    body.classList.remove("home-lock");

    if (isMobile) {
      body.classList.add("mobile-home");
    } else {
      body.classList.remove("mobile-home");
    }

    return () => {
      html.classList.remove("home-lock");
      body.classList.remove("home-lock");
      body.classList.remove("mobile-home");
    };
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
