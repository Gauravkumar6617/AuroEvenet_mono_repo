import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Zap, Clock, Eye, Globe, Flame,
  Music, Cpu, Utensils, Dumbbell, Camera, Palette,
} from "lucide-react";
import { T } from "./tokens";

function Sparkline({ data, color, h = 36 }) {
  const w = 100, mx = Math.max(...data), mn = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / (mx - mn || 1)) * h}`)
    .join(" ");
  const id = `sg${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
    </svg>
  );
}

export default function BentoDashboard() {
  const [liveCount, setLiveCount] = useState(3842);
  const [ticketData] = useState(() => Array.from({ length: 12 }, () => 30 + Math.random() * 70));
  const [viewData] = useState(() => Array.from({ length: 12 }, () => 20 + Math.random() * 80));

  useEffect(() => {
    const id = setInterval(
      () => setLiveCount((n) => n + Math.floor(Math.random() * 6) - 2),
      1800
    );
    return () => clearInterval(id);
  }, []);

  const stats = [
    {
      label: "Tickets Sold Today",
      val: "12,480",
      delta: "+8.2% this week",
      color: T.violet,
      bg: T.violetLight,
      data: ticketData,
      icon: <Zap size={16} color={T.violet} />,
    },
    {
      label: "People Browsing",
      val: liveCount.toLocaleString(),
      delta: "live right now",
      color: T.emerald,
      bg: T.emeraldLight,
      data: viewData,
      icon: <Eye size={16} color={T.emerald} />,
      live: true,
    },
    {
      label: "Events Starting Soon",
      val: "24",
      delta: "next 2 hours",
      color: T.orange,
      bg: T.orangeLight,
      data: Array.from({ length: 12 }, () => 10 + Math.random() * 90),
      icon: <Clock size={16} color={T.orange} />,
    },
  ];

  const categories = [
    { cat: "AI & Tech", growth: "+42%", color: T.violet, bg: T.violetLight, icon: <Cpu size={14} color={T.violet} /> },
    { cat: "Live Music", growth: "+38%", color: T.rose, bg: T.roseLight, icon: <Music size={14} color={T.rose} /> },
    { cat: "Food & Drink", growth: "+29%", color: T.amber, bg: T.amberLight, icon: <Utensils size={14} color={T.amber} /> },
    { cat: "Wellness", growth: "+24%", color: T.emerald, bg: T.emeraldLight, icon: <Dumbbell size={14} color={T.emerald} /> },
    { cat: "Photography", growth: "+18%", color: T.cyan, bg: T.cyanLight, icon: <Camera size={14} color={T.cyan} /> },
    { cat: "Art & Design", growth: "+15%", color: T.orange, bg: T.orangeLight, icon: <Palette size={14} color={T.orange} /> },
  ];

  return (
    <section className="home-section">
      <div className="home-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <TrendingUp size={15} color={T.violet} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.violet, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Live Snapshot
            </span>
          </div>
          <h2 className="section-title" style={{ fontSize: "clamp(1.9rem,3.5vw,2.8rem)", lineHeight: 1.15, marginBottom: 8 }}>
            What's happening <em>right now</em>
          </h2>
          <p style={{ color: T.text3, fontSize: 16, marginBottom: 48 }}>
            Real-time pulse of the AuraEvents universe.
          </p>
        </motion.div>

        {/* Stats row */}
        <div
          className="bento-stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: T.shadowHover }}
                transition={{ duration: 0.2 }}
                style={{
                  background: T.surface,
                  borderRadius: 20,
                  padding: "22px 22px 18px",
                  border: `1px solid ${T.border}`,
                  boxShadow: T.shadow,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, color: T.text3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                      {s.label}
                    </p>
                    <motion.p
                      key={s.val}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: 34, fontWeight: 600, lineHeight: 1, marginBottom: 4 }}
                    >
                      {s.val}
                    </motion.p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {s.live && (
                        <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: T.emerald, display: "inline-block" }} />
                      )}
                      <span style={{ fontSize: 12, color: s.live ? T.emerald : T.text3 }}>{s.delta}</span>
                    </div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.icon}
                  </div>
                </div>
                <Sparkline data={s.data} color={s.color} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="bento-bottom-grid"
          style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 14, marginTop: 14 }}
        >
          {/* Hottest Cities */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <motion.div
              whileHover={{ y: -4, boxShadow: T.shadowHover }}
              transition={{ duration: 0.2 }}
              style={{ background: T.surface, borderRadius: 20, padding: 22, border: `1px solid ${T.border}`, boxShadow: T.shadow, minHeight: 240 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Globe size={14} color={T.text3} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.08em" }}>Hottest Cities</span>
              </div>
              {[
                { city: "New York", events: 142, pct: 90 },
                { city: "London", events: 98, pct: 70 },
                { city: "Tokyo", events: 87, pct: 62 },
                { city: "Berlin", events: 74, pct: 53 },
                { city: "Mumbai", events: 61, pct: 44 },
              ].map((c, i) => (
                <div key={c.city} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.city}</span>
                    <span style={{ fontSize: 12, color: T.text3 }}>{c.events} events</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 5, background: T.surfaceEl, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: i * 0.1, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${T.violet}, ${T.violet}66)` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Trending Categories */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
            <motion.div
              whileHover={{ y: -4, boxShadow: T.shadowHover }}
              transition={{ duration: 0.2 }}
              style={{ background: T.surface, borderRadius: 20, padding: 22, border: `1px solid ${T.border}`, boxShadow: T.shadow, minHeight: 240 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Flame size={14} color={T.rose} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.08em" }}>Trending Categories</span>
              </div>
              <div
                className="trending-cats-grid"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
              >
                {categories.map((c) => (
                  <motion.div
                    key={c.cat}
                    whileHover={{ scale: 1.02 }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: c.bg, border: `1px solid ${c.color}22` }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                      {c.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>{c.cat}</p>
                      <p style={{ fontSize: 11, color: c.color, fontWeight: 600 }}>{c.growth} this week</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
