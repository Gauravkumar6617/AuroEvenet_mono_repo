import { useState, useEffect } from "react";

const INITIAL = [
  { user: "anita_dev", event: "posted question", channel: "web-performance", time: "2s ago" },
  { user: "karthik_ai", event: "answered thread", channel: "machine-learning", time: "8s ago" },
  { user: "sara_ops", event: "shared article", channel: "cloud-architecture", time: "12s ago" },
  { user: "ravi_design", event: "upvoted answer", channel: "product-design", time: "18s ago" },
];
const EVENTS = ["posted question", "answered thread", "shared article", "upvoted answer", "bookmarked post", "joined community"];
const USERS = ["dev_patel", "priya_arch", "alex_swe", "gaurav_dev", "sara_new", "karthik_ml"];
const CHANNELS = ["engineering", "frontend", "ai-ml", "devops", "startup", "career"];

export default function TerminalActivity() {
  const [activities, setActivities] = useState(INITIAL);

  useEffect(() => {
    const timer = setInterval(() => {
      const newItem = {
        user: USERS[Math.floor(Math.random() * USERS.length)],
        event: EVENTS[Math.floor(Math.random() * EVENTS.length)],
        channel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
        time: "just now",
      };
      setActivities(prev => [newItem, ...prev.slice(0, 4)]);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1117] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-amber-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-mono text-emerald-400/70 ml-1">platform-live-feed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400/70">LIVE</span>
        </div>
      </div>
      <div className="space-y-0">
        {activities.map((item, index) => (
          <div key={`${item.user}-${index}`}
            className="terminal-row"
            style={{ opacity: 1 - index * 0.18 }}>
            <span>
              <span className="text-emerald-200 font-semibold">{item.user}</span>
              <span className="text-emerald-400/60 mx-1.5">{item.event} in</span>
              <span className="text-cyan-300">#{item.channel}</span>
            </span>
            <span className="text-emerald-400/50 text-xs ml-3 shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-emerald-500/10 flex items-center gap-2">
        <span className="text-emerald-400/40 text-xs font-mono">$</span>
        <span className="text-emerald-300/50 text-xs font-mono animate-pulse">_</span>
      </div>
    </div>
  );
}
