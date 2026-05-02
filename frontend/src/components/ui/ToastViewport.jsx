import { useToast } from "../../contexts/ToastContext";

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();

  const variants = {
    info: "border-brand-200 bg-brand-50 text-brand-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-soft ${variants[toast.variant] || variants.info}`}
          role="status"
        >
          <div className="flex items-center justify-between gap-3">
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
