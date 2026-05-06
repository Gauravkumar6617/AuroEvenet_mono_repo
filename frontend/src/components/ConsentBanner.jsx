import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CONSENT_KEY = "nexos_consent_v1";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true,       // always on
    reading_history: true,
    personalization: true,
    analytics: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Delay so it doesn't clash with onboarding modal
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (accepted) => {
    const final = accepted
      ? { essential: true, reading_history: true, personalization: true, analytics: true, accepted_at: Date.now() }
      : { ...prefs, accepted_at: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(final));
    setVisible(false);
  };

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="fixed bottom-4 left-4 right-4 z-[300] max-w-2xl mx-auto"
        >
          <div className="glass-card overflow-hidden border border-[rgba(90,80,60,0.12)] shadow-2xl">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 flex items-start gap-3">
              <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] flex items-center justify-center text-white text-base">
                🍪
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1a1814]">We track some data to make Nexos better for you</p>
                <p className="text-xs text-[#6b6358] mt-0.5 leading-relaxed">
                  We use reading history and personalisation data to power your smart feed.
                  No ads. No selling to third parties.{" "}
                  <Link to="/privacy" className="text-[#e85d26] hover:underline">Privacy policy →</Link>
                </p>
              </div>
            </div>

            {/* Expanded preferences */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 space-y-2 border-t border-[rgba(90,80,60,0.08)] pt-4">
                    {[
                      { key: "essential", label: "Essential", desc: "Auth, sessions, security. Always on.", locked: true },
                      { key: "reading_history", label: "Reading history", desc: "Tracks which posts you've read to avoid repeats." },
                      { key: "personalization", label: "Feed personalisation", desc: "Uses your topic interests to rank your feed." },
                      { key: "analytics", label: "Anonymous analytics", desc: "Aggregate usage stats to improve the product." },
                    ].map(({ key, label, desc, locked }) => (
                      <div key={key} className="flex items-center gap-3 py-1.5">
                        <button
                          disabled={locked}
                          onClick={() => !locked && toggle(key)}
                          className={`relative h-5 w-9 rounded-full transition-colors shrink-0 ${
                            prefs[key] ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.18)]"
                          } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                        </button>
                        <div>
                          <p className="text-xs font-semibold text-[#1a1814]">{label}{locked && " (required)"}</p>
                          <p className="text-xs text-[#a09880]">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="px-5 pb-5 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => save(true)}
                className="btn-primary text-xs px-4 py-2 rounded-lg"
              >
                Accept all
              </button>
              {expanded ? (
                <button
                  onClick={() => save(false)}
                  className="btn-secondary text-xs px-4 py-2 rounded-lg"
                >
                  Save my choices
                </button>
              ) : (
                <button
                  onClick={() => save(false)}
                  className="btn-secondary text-xs px-4 py-2 rounded-lg"
                >
                  Essential only
                </button>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-[#a09880] hover:text-[#6b6358] transition-colors ml-auto"
              >
                {expanded ? "Hide options ↑" : "Manage preferences ↓"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
