export default function Input({ label, id, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <input id={id} className={`input-field ${className}`} {...props} />
    </label>
  );
}
