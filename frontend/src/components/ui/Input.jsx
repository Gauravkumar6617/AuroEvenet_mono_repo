export default function Input({ label, id, hint, error, className = "", icon, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-semibold text-[#1a1814]">{label}</span>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09880] text-sm">{icon}</span>}
        <input
          id={id}
          className={`input-field ${icon ? "pl-9" : ""} ${error ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]" : ""} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-[#a09880]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}
