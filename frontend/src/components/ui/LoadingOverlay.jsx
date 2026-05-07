import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

export default function LoadingOverlay({ show, message = "Loading..." }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white shadow-2xl border border-[rgba(90,80,60,0.1)]">
            <LoadingSpinner size="lg" className="text-[#e85d26]" />
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[#1a1814]">{message}</p>
              <p className="text-sm text-[#a09880] mt-1 italic">Building your knowledge universe...</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
