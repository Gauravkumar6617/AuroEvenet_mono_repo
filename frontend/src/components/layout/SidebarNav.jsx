export default function SidebarNav({ title, items, active, onChange }) {
  return (
    <aside className="surface h-fit p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{title}</p>
      <div className="space-y-1.5">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                isActive ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20" : "bg-slate-200 text-slate-700"}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
