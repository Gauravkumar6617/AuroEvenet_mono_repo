import { useState, useEffect } from "react";

const BASE_ACTIVITIES = [
  { user: "anita_dev", event: "posted question", channel: "web-performance", time: "2s ago" },
  { user: "karthik_ai", event: "answered thread", channel: "machine-learning", time: "8s ago" },
  { user: "sara_ops", event: "shared article", channel: "cloud-architecture", time: "12s ago" },
  { user: "ravi_design", event: "upvoted answer", channel: "product-design", time: "18s ago" },
  { user: "dev_patel", event: "started discussion", channel: "system-design", time: "25s ago" },
];

export default function TerminalActivity() {
  const [activities, setActivities] = useState(BASE_ACTIVITIES);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink(b => !b), 600);
    const feedInterval = setInterval(() => {
      const newItem = BASE_ACTIVITIES[Math.floor(Math.random() * BASE_ACTIVITIES.length)];
      setActivities(prev => [{ ...newItem, time: "just now" }, ...prev.slice(0, 4)]);
    }, 3000);
    return () => { clearInterval(blinkInterval); clearInterval(feedInterval); };
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1117] p-5 shadow-2xl font-mono">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-amber-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-emerald-400/70 ml-1">nexos ~ live-feed</span>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
          ● LIVE
        </span>
      </div>
      <div className="space-y-0">
        {activities.map((item, index) => (
          <div key={index} className="terminal-row" style={{ opacity: 1 - index * 0.15 }}>
            <span>
              <span className="text-emerald-200 font-semibold">{item.user}</span>
              <span className="text-emerald-400/60"> {item.event} in </span>
              <span className="text-cyan-300">#{item.channel}</span>
            </span>
            <span className="text-emerald-400/50 text-xs shrink-0 ml-3">{item.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-emerald-400/40">
        <span>nexos@live:~$</span>
        <span className="text-emerald-300 ml-1">_</span>
        {blink && <span className="inline-block h-3 w-1.5 bg-emerald-400/60 ml-0.5 -mb-0.5" />}
      </div>
    </div>
  );
}
