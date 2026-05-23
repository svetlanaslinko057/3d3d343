export function SectionHeading({ eyebrow, title, subtitle, align = "left", className = "", actions = null, invert = false }) {
  const isCenter = align === "center";
  const titleColor = invert ? "text-white" : "text-[#111111]";
  const subtitleColor = invert ? "text-[#A1A1A1]" : "text-[#666666]";
  return (
    <div className={`${isCenter ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      {eyebrow ? (
        <div className={invert ? "eyebrow-dark" : "eyebrow"}>
          <span className={`h-1 w-1 rounded-full ${invert ? "bg-white" : "bg-[#111111]"}`} />
          {eyebrow}
        </div>
      ) : null}
      <h2 className={`font-heading font-semibold text-[26px] sm:text-3xl lg:text-[42px] mt-3 sm:mt-4 leading-[1.08] sm:leading-[1.05] tracking-tight ${titleColor}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-3 sm:mt-4 text-[14.5px] sm:text-base lg:text-lg leading-relaxed ${subtitleColor}`}>{subtitle}</p>
      ) : null}
      {actions ? <div className="mt-6">{actions}</div> : null}
    </div>
  );
}

export default SectionHeading;
