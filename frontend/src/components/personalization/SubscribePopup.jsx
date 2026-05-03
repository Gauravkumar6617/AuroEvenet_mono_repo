import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import usePersonalizationStore from "../../store/usePersonalizationStore";

export default function SubscribePopup({ open, onDismiss }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const acknowledgeSubscribe = usePersonalizationStore((s) => s.acknowledgeSubscribe);
  const suppressSubscribe = usePersonalizationStore((s) => s.suppressSubscribe);
  const [email, setEmail] = useState("");

  function handleDismissLater() {
    suppressSubscribe(10);
    onDismiss();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const raw = email.trim() || user?.email || "";
    if (!raw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
      showToast("Enter a valid email to subscribe", "warning");
      return;
    }
    acknowledgeSubscribe(raw);
    showToast("You’re subscribed to Aura picks", "success");
    onDismiss();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 right-4 z-[180] w-[min(calc(100vw-2rem),22rem)] sm:bottom-6 sm:right-6"
        >
          <div
            role="dialog"
            aria-labelledby="subscribe-title"
            className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-violet-600">
                <Sparkles className="h-5 w-5 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Powered ranking
                </span>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={handleDismissLater}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h2 id="subscribe-title" className="font-display mt-2 text-xl font-black text-slate-900">
              Get the Aura digest
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              One weekly roundup of personalised events plus host tips. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none ring-violet-100 focus:ring-2"
                placeholder={user?.email || "you@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
              >
                Subscribe
              </button>
            </form>
            <button type="button" onClick={handleDismissLater} className="mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600">
              Not now · remind me later
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
