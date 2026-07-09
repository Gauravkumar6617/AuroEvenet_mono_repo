import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const DISMISS_KEY_PREFIX = "blogbyte_announcement_dismissed_";

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () =>
      fetch(`${API_URL}/system/announcement`)
        .then((res) => res.json())
        .then((data) => setAnnouncement(data))
        .catch(() => {});

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const visible = announcement?.active && !!announcement.message;
  const dismissKey = DISMISS_KEY_PREFIX + (announcement?.message || "");
  const alreadyDismissed = dismissed || sessionStorage.getItem(dismissKey) === "1";

  return (
    <AnimatePresence>
      {visible && !alreadyDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden relative z-[150]"
        >
          <div
            style={{
              background: `linear-gradient(90deg, ${announcement.color || "#e85d26"}, ${announcement.color || "#e85d26"}dd)`,
            }}
            className="relative flex items-center justify-center gap-3 px-6 py-2.5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
          >
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(-45deg, #fff 0, #fff 10px, transparent 10px, transparent 20px)",
              }}
            />
            <span className="relative min-w-0 text-sm font-semibold text-white leading-snug">
              {announcement.message}
            </span>
            <button
              onClick={() => {
                sessionStorage.setItem(dismissKey, "1");
                setDismissed(true);
              }}
              className="relative shrink-0 text-white/75 hover:text-white transition-colors"
              aria-label="Dismiss announcement"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
