export default function SectionHeader({ eyebrow, title, description, action, align = "left", className = "" }) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start";
  return (
    <div className={`mb-8 flex flex-col gap-2 ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e85d26]">{eyebrow}</p>
      )}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-subtitle">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
