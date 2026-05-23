export function StatusBadge({ status, className = "", inverse = false }) {
  const isIn = status === "in_stock";
  // Monochrome: subtle dot + text, white chip
  const dotColor = isIn ? "bg-[#16A34A]" : "bg-[#B45309]";
  const base = inverse
    ? "bg-white/10 text-white border-white/15"
    : "bg-white text-[#111111] border-[#E7E7E7]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${base} ${className}`}
      data-testid="product-status-badge"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {isIn ? "В наявності" : "Під замовлення"}
    </span>
  );
}

export default StatusBadge;
