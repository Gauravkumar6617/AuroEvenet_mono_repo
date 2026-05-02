export default function Tabs({ items = [], active, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
