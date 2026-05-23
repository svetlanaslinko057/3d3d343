import { createContext, useContext } from "react";

// SlideModeContext broadcasts the current presentation mode to slides so
// that shared primitives (SlideShell, SlideBody) can adapt their height
// and padding strategy without prop-drilling.
// Values:
//   - "desktop" -> horizontal full-page pager (fixed-height panels)
//   - "mobile"  -> vertical scroll (sections grow with content; native scroll)
export const SlideModeContext = createContext("desktop");

export function useSlideMode() {
  return useContext(SlideModeContext);
}
