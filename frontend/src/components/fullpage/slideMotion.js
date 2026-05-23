// ============================================================
// Slide motion vocabulary — refined, non-intrusive entrances.
// The whole site uses a single easing curve so all entrances feel
// like one coherent "dropdown / unfold" gesture.
// ============================================================

// Smooth ease-out curve (Apple-style)
export const ease = [0.22, 1, 0.36, 1];

// Stagger container: child items appear one after another with a soft cadence
export const container = (delay = 0, stagger = 0.07) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
      when: "beforeChildren",
    },
  },
});

// Default item: gentle rise + fade. Slightly softer than before so it feels
// "calm" rather than "snappy". Keeps content centred so layout doesn't jump.
export const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

// Pure-fade variant — for backgrounds / images that shouldn't slide
export const itemFade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease } },
};

// Subtle scale-up — for hero images / large media; no horizontal jolt
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.75, ease },
  },
};

// "Drop-in" — like a dropdown menu unfolding. Slightly stronger Y travel,
// softened with a tiny scale. Use for lists, dropdowns, cards revealed
// after a header.
export const dropIn = {
  hidden: { opacity: 0, y: -10, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease },
  },
};

// "Pop-in" — for emphasised CTAs / badges; tiny overshoot, never jarring
export const popIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.4, 0.6, 1] },
  },
};

// Slide-in from the side — used for two-column layouts where each side
// arrives from its own edge
export const slideInLeft = {
  hidden: { opacity: 0, x: -22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

// Faster cadence for dense grids (6+ cards) so total reveal stays under ~700ms
export const denseContainer = (delay = 0) => container(delay, 0.05);
