import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

/**
 * Compact auth layout aligned with Event.jsx (rounded-3xl, violet gradient strip).
 */
export default function AuthShell({ eyebrow, title, description, children }) {
  return (
    <div className="min-h-[calc(100vh-62px)] bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[420px]"
      >
        <div className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-7 text-white">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 100% 0%, #fff 0%, transparent 55%)",
              }}
            />
            <Link
              to="/"
              className="relative inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Zap size={16} className="text-white" fill="currentColor" />
              </span>
              <span className="font-display text-base font-extrabold tracking-tight">
                AuraEvents
              </span>
            </Link>
            {eyebrow && (
              <p className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">
                {eyebrow}
              </p>
            )}
            <h1 className="relative font-display mt-1 text-2xl font-black leading-tight tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="relative mt-2 text-sm text-white/80 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <div className="p-7 sm:p-8">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
