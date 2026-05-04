export default function Tabs({ items = [], active, onChange, variant = "pill" }) {
  if (variant === "underline") {
    return (
      <div className="flex gap-0 border-b border-[rgba(90,80,60,0.12)]">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all ${active === item ? "border-[#e85d26] text-[#e85d26]" : "border-transparent text-[#6b6358] hover:text-[#1a1814]"}`}>
            {item}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="inline-flex rounded-xl border border-[rgba(90,80,60,0.12)] bg-white p-1 gap-0.5">
      {items.map((item) => (
        <button key={item} type="button" onClick={() => onChange(item)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${active === item ? "bg-[#e85d26] text-white shadow-sm" : "text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)]"}`}>
          {item}
        </button>
      ))}
    </div>
  );
}
