import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import CatalogChrome from "./CatalogChrome";
import { SlideModeContext, useSlideMode } from "./SlideMode";

const EASE = [0.22, 1, 0.36, 1];
const DURATION = 0.65;
const COOLDOWN_MS = 720;
const TOUCH_THRESHOLD = 50;

/**
 * Horizontal Catalog Pager.
 * Pages are laid out side-by-side; transform X translates the track.
 * NO vertical scroll. NO vertical transitions. Pure "turn page" feel.
 */
export default function FullPage({ slides, labels }) {
  const [index, setIndex] = useState(0);
  const locked = useRef(false);
  const lastWheelAt = useRef(0);
  const gestureTriggered = useRef(false);
  const touchStart = useRef(null);
  const last = slides.length - 1;

  const go = useCallback(
    (next) => {
      const safe = Math.max(0, Math.min(next, last));
      if (safe === index) return;
      if (locked.current) return;
      locked.current = true;
      setIndex(safe);
      window.setTimeout(() => {
        locked.current = false;
      }, COOLDOWN_MS);
    },
    [index, last]
  );

  // Keyboard: ArrowLeft/Right (catalog paging metaphor, NOT up/down).
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (["ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(last);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, last]);

  // Wheel: one gesture = one page. Uses both deltaX (natural for trackpad horizontal)
  // AND deltaY (so vertical scroll wheels still advance pages to the right).
  useEffect(() => {
    const STRONG_DELTA = 6;
    const GESTURE_GAP_MS = 220;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      const gap = now - lastWheelAt.current;
      lastWheelAt.current = now;
      if (gap > GESTURE_GAP_MS) gestureTriggered.current = false;
      if (gestureTriggered.current) return;
      if (locked.current) return;
      const dx = e.deltaX;
      const dy = e.deltaY;
      const dom = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(dom) < STRONG_DELTA) return;
      gestureTriggered.current = true;
      if (dom > 0) go(index + 1);
      else go(index - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel, { passive: false });
  }, [go, index]);

  // Touch: horizontal swipe primary; vertical swipe as fallback.
  useEffect(() => {
    const onStart = (e) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };
    const onEnd = (e) => {
      if (!touchStart.current) return;
      const dx = touchStart.current.x - e.changedTouches[0].clientX;
      const dy = touchStart.current.y - e.changedTouches[0].clientY;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (ax >= ay && ax >= TOUCH_THRESHOLD) {
        if (dx > 0) go(index + 1);
        else go(index - 1);
      } else if (ay > ax && ay >= TOUCH_THRESHOLD) {
        if (dy > 0) go(index + 1);
        else go(index - 1);
      }
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [go, index]);

  // Hash sync (linkability)
  useEffect(() => {
    const hashTarget = `#slide-${index + 1}`;
    if (window.location.hash !== hashTarget) {
      window.history.replaceState(null, "", hashTarget);
    }
  }, [index]);

  // Initial hash
  useEffect(() => {
    const m = (window.location.hash || "").match(/^#slide-(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!Number.isNaN(n)) {
        const target = Math.max(0, Math.min(n - 1, last));
        if (target !== 0) setIndex(target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hashchange listener (header nav)
  useEffect(() => {
    const onHashChange = () => {
      const m = (window.location.hash || "").match(/^#slide-(\d+)$/);
      if (!m) return;
      const n = parseInt(m[1], 10);
      if (Number.isNaN(n)) return;
      const target = Math.max(0, Math.min(n - 1, last));
      go(target);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [go, last]);

  return (
    <SlideModeContext.Provider value="desktop">
    <div
      className="relative w-full h-[100dvh] overflow-hidden bg-[#F7F7F5] select-none"
      data-testid="fullpage-root"
      role="region"
      aria-roledescription="carousel"
      aria-label="Home catalog slider"
    >
      {/* Horizontal track: 10 slides side-by-side, one screen wide each */}
      <motion.div
        className="flex h-full w-max will-change-transform"
        animate={{ x: `-${index * 100}vw` }}
        transition={{ duration: DURATION, ease: EASE }}
      >
        {slides.map((Slide, i) => (
          <div
            key={i}
            className="w-screen h-[100dvh] shrink-0 relative"
            data-slide={i + 1}
            aria-hidden={i === index ? "false" : "true"}
          >
            <Slide index={i} active={i === index} total={slides.length} goTo={go} />
          </div>
        ))}
      </motion.div>

      {/* Catalog chrome: top bar + right rail + edge zones + floating CTA + mobile sheet */}
      <CatalogChrome
        index={index}
        total={slides.length}
        labels={labels}
        goTo={go}
      />
    </div>
    </SlideModeContext.Provider>
  );
}

// Shared Slide shell — strict 100dvh container with safe top offset for the
// 56px CatalogChrome top bar + right padding so the numeric rail never covers
// content. Inner content is capped to viewport height via flex layout.
//
// Usage pattern inside a slide:
//   <SlideShell>
//     <SlideHeader>...title/badge...</SlideHeader>
//     <SlideBody>...grid that will fill remaining space...</SlideBody>
//   </SlideShell>
// This way SlideHeader takes natural height and SlideBody uses flex-1 min-h-0
// so the content grid distributes the remaining vertical space.
export function SlideShell({ children, dark = false, padded = true, className = "" }) {
  const mode = useSlideMode();
  const isMobile = mode === "mobile";
  return (
    <div
      className={`w-full relative ${
        isMobile
          ? "overflow-x-hidden"
          : "h-full overflow-hidden"
      } ${dark ? "bg-[#111111] text-white" : "bg-[#F7F7F5] text-[#111111]"} ${className}`}
      data-slide-shell={isMobile ? "mobile" : "desktop"}
    >
      <div
        className={`w-full flex flex-col items-stretch ${
          isMobile ? "" : "h-full"
        } ${
          padded
            ? isMobile
              ? "px-5 py-7 sm:py-9"
              : "pl-3 sm:pl-5 lg:pl-8 xl:pl-10 pr-3 sm:pr-5 md:pr-[70px] lg:pr-[82px] xl:pr-[92px] pt-[60px] sm:pt-[64px] lg:pt-[68px] pb-3 sm:pb-4 lg:pb-5"
            : ""
        }`}
      >
        <div
          className={`mx-auto w-full max-w-6xl 2xl:max-w-[1320px] flex flex-col ${
            isMobile ? "" : "flex-1 min-h-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// Header area for a slide — takes natural height, content sits at top.
export function SlideHeader({ children, className = "" }) {
  return <div className={`shrink-0 ${className}`}>{children}</div>;
}

// Body area for a slide — fills remaining space on desktop (flex-1 min-h-0)
// or grows naturally on mobile (no height constraint).
export function SlideBody({ children, className = "" }) {
  const mode = useSlideMode();
  const isMobile = mode === "mobile";
  return (
    <div className={`flex flex-col ${isMobile ? "" : "flex-1 min-h-0"} ${className}`}>
      {children}
    </div>
  );
}

export const slideEase = EASE;
export const slideDuration = DURATION;
