import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { chatApi } from "../services/api/chatApi";

const STARTERS = [
  "How do I create a post?",
  "What are communities?",
  "Is BlogByte free?",
  "How does the For You feed work?",
];

export default function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await chatApi.send(message, history);
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[200]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="mb-3 flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-[rgba(90,80,60,0.1)] bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2.5 border-b border-[rgba(90,80,60,0.08)] bg-gradient-to-r from-[#e85d26] to-[#2563eb] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">B</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">BlogByte Assistant</p>
                <p className="text-xs text-white/75">Ask me anything about the site</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg leading-none px-1">✕</button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm text-[#6b6358] mb-3">👋 Hi! I can help you find your way around BlogByte. Try asking:</p>
                  <div className="space-y-1.5">
                    {STARTERS.map((s) => (
                      <button key={s} onClick={() => send(s)}
                        className="block w-full rounded-xl border border-[rgba(90,80,60,0.12)] px-3 py-2 text-left text-xs text-[#1a1814] hover:border-[#e85d26] hover:bg-[#fdf0ea] transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-[#e85d26] text-white" : "bg-[#f5f4f0] text-[#1a1814]"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[#f5f4f0] px-3.5 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#a09880] animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[rgba(90,80,60,0.08)] p-3">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  className="input-field flex-1 text-sm"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e85d26] text-white disabled:opacity-40 hover:bg-[#c44718] transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#e85d26] to-[#2563eb] text-white shadow-[0_8px_24px_rgba(232,93,38,0.4)] hover:scale-105 transition-transform"
        aria-label="Open site assistant"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        )}
      </button>
    </div>
  );
}
