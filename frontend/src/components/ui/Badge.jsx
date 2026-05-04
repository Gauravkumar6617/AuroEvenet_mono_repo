export default function Badge({ children, tone = "neutral", dot = false }) {
  const tones = {
    neutral: "bg-[rgba(90,80,60,0.08)] text-[#6b6358] border-[rgba(90,80,60,0.12)]",
    brand: "bg-[#fdf0ea] text-[#e85d26] border-[rgba(232,93,38,0.2)]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    danger: "bg-red-50 text-red-700 border-red-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone] ?? tones.neutral}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}
