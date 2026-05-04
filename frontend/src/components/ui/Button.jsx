export default function Button({ children, variant = "primary", className = "", type = "button", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none";
  const sizes = { sm: "rounded-lg px-3 py-1.5 text-xs", md: "rounded-xl px-4 py-2.5 text-sm", lg: "rounded-xl px-6 py-3 text-base" };
  const variants = {
    primary: "bg-[#e85d26] text-white shadow-[0_2px_8px_rgba(232,93,38,0.3)] hover:bg-[#c44718] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(232,93,38,0.35)]",
    secondary: "border-[1.5px] border-[rgba(90,80,60,0.15)] bg-white text-[#1a1814] hover:bg-[#fdf0ea] hover:border-[#e85d26] hover:text-[#e85d26] hover:-translate-y-0.5",
    ghost: "text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] hover:text-[#1a1814]",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(220,38,38,0.25)]",
    outline: "border-[1.5px] border-[#e85d26] text-[#e85d26] hover:bg-[#fdf0ea] hover:-translate-y-0.5",
  };
  return (
    <button type={type} className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
