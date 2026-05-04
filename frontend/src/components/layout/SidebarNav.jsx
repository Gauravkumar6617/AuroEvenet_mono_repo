export default function SidebarNav({ title, items, active, onChange }) {
  return (
    <aside className="surface h-fit p-3">
      {title && <p className="mb-2 px-2 text-xs font-bold uppercase tracking-widest text-[#a09880]">{title}</p>}
      <div className="space-y-0.5">
        {items.map((item) => (
          <button key={item.key} type="button" onClick={() => onChange(item.key)}
            className={`sidebar-item ${item.key === active ? "active" : ""}`}>
            {item.icon && <span className="text-base leading-none">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.count !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.key === active ? "bg-[rgba(232,93,38,0.15)] text-[#e85d26]" : "bg-[rgba(90,80,60,0.08)] text-[#6b6358]"}`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
