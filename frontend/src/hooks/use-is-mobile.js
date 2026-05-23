import { useEffect, useState } from "react";

/**
 * useIsMobile — responsive matchMedia hook.
 * Returns true when viewport width is below `breakpoint` (default 768 = Tailwind md).
 * SSR-safe: returns false on server, hydrates on mount.
 */
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    // Safari < 14 still uses addListener
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, [query]);

  return isMobile;
}

export default useIsMobile;
