const activities = [
  { user: "anita_dev", event: "posted question", channel: "web-performance", time: "2s ago" },
  { user: "karthik_ai", event: "answered thread", channel: "machine-learning", time: "8s ago" },
  { user: "sara_ops", event: "shared article", channel: "cloud-architecture", time: "12s ago" },
  { user: "ravi_design", event: "upvoted answer", channel: "product-design", time: "18s ago" },
];

export default function TerminalActivity() {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-4 shadow-glass">
      <div className="mb-3 flex items-center justify-between text-xs font-mono text-emerald-300">
        <span>platform-live-feed</span>
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5">LIVE</span>
      </div>
      {activities.map((item, index) => (
        <div key={`${item.user}-${index}`} className="terminal-row">
          <span>
            <span className="text-emerald-200">{item.user}</span> {item.event} in{" "}
            <span className="text-cyan-300">#{item.channel}</span>
          </span>
          <span className="text-emerald-400/80">{item.time}</span>
        </div>
      ))}
    </div>
  );
}
