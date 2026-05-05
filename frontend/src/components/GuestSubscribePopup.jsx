import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Button";

export default function GuestSubscribePopup() {
  const { isAuthenticated } = useAuth();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isAuthenticated || dismissed) return;
    const views = parseInt(sessionStorage.getItem("post_views") || "0");
    if (views >= 2) {
      const timeout = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, dismissed]);

  if (isAuthenticated || dismissed) return null;

  const dismiss = () => { setShow(false); setDismissed(true); };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-5 right-5 z-[150] w-80 glass-card p-5 shadow-2xl"
        >
          <button onClick={dismiss} className="absolute top-3 right-3 text-[#a09880] hover:text-[#6b6358] text-sm">✕</button>
          <div className="text-2xl mb-2">💡</div>
          <h3 className="font-display text-lg font-bold text-[#1a1814] mb-1">Enjoying the content?</h3>
          <p className="text-xs text-[#6b6358] mb-4 leading-relaxed">Join to save posts, post answers, get AI features, and a personalized feed.</p>
          <div className="flex flex-col gap-2">
            <Link to="/signup" onClick={dismiss}><Button className="w-full">Create free account →</Button></Link>
            <Link to="/login" onClick={dismiss} className="text-center text-xs text-[#a09880] hover:text-[#e85d26] transition-colors">Already have an account? Sign in</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
