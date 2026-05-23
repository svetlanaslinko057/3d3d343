import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

/**
 * Resolve a photo URL. Supports:
 * - Absolute http(s) URL   -> returned as-is
 * - data: URL (base64)     -> returned as-is
 * - /api/photos/xxx.jpg    -> prefixed with BACKEND_URL
 * - Any other relative path -> returned as-is
 */
export function imageUrl(src) {
  if (!src) return "";
  if (typeof src !== "string") return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("/api/")) return `${BACKEND_URL}${src}`;
  return src;
}
