import { useToast } from "../../contexts/ToastContext";
import { AnimatePresence, motion } from "framer-motion";

const toneStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-900/5",
  error: "border-rose-200 bg-rose-50 text-rose-800 shadow-rose-900/5",
  info: "border-blue-200 bg-blue-50 text-blue-800 shadow-blue-900/5",
  warning: "border-amber-200 bg-amber-50 text-amber-800 shadow-amber-900/5",
};
const toneIcons = { success: "✨", error: "🚨", info: "ℹ️", warning: "⚠️" };

export default function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts?.map((toast) => (
          <motion.div key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl text-sm font-semibold glass-card ${toneStyles[toast.variant] || toneStyles.info}`}>
            <span className="text-lg">{toneIcons[toast.variant] || "ℹ️"}</span>
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
