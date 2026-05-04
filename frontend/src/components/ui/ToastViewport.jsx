import { useToast } from "../../contexts/ToastContext";
import { AnimatePresence, motion } from "framer-motion";

const toneStyles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};
const toneIcons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };

export default function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts?.map((toast) => (
          <motion.div key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl text-sm font-medium ${toneStyles[toast.type] || toneStyles.info}`}>
            <span className="font-bold">{toneIcons[toast.type] || "ℹ"}</span>
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
