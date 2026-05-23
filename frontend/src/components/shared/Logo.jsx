/**
 * Brand Logo — uses the official "PNEVMO" wordmark PNG (tightly cropped,
 * aspect-ratio ~7.6, dark on transparent).
 *
 * The same source file is used for both light and dark backgrounds:
 * on dark bg we CSS-invert it to white. Single source of truth.
 *
 * Props:
 *  - variant: "dark" (default) | "light" (white wordmark on dark bg)
 *  - height: tailwind height class; defaults are sized so the wordmark
 *            sits prominently in the header (matches the height of the
 *            right-side CTA button visually).
 *  - className: extra classes
 */
export default function Logo({
  variant = "dark",
  height = "h-7 sm:h-8 md:h-9 lg:h-10",
  className = "",
  alt = "PNEVMO",
  "data-testid": testId = "brand-logo",
}) {
  const src = `${process.env.PUBLIC_URL || ""}/logo-full.png`;

  // Dark artwork inverted to white when used on a dark background.
  // brightness(2) ensures any semi-grey anti-aliased pixels become pure white.
  const filterStyle =
    variant === "light"
      ? { filter: "invert(1) brightness(2)" }
      : undefined;

  return (
    <img
      src={src}
      alt={alt}
      className={`${height} w-auto block select-none ${className}`}
      style={filterStyle}
      draggable={false}
      data-testid={testId}
    />
  );
}
