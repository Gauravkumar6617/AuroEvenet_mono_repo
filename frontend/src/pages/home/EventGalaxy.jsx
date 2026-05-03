import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Flame, SlidersHorizontal, Sparkles, Music, Cpu,
  Utensils, Dumbbell, Leaf, Palette, Camera, BookOpen, Users,
} from "lucide-react";
import { T, events } from "./tokens";
import EventCard from "./EventCard";

const CATS = [
  { label: "All", icon: Sparkles, color: T.violet, bg: T.violetLight },
  { label: "Music", icon: Music, color: T.rose, bg: T.roseLight },
  { label: "Technology", icon: Cpu, color: T.violet, bg: T.violetLight },
  { label: "Food & Drink", icon: Utensils, color: T.amber, bg: T.amberLight },
  { label: "Wellness", icon: Dumbbell, color: T.emerald, bg: T.emeraldLight },
  { label: "Art & Design", icon: Palette, color: T.orange, bg: T.orangeLight },
  { label: "Sustainability", icon: Leaf, color: T.emerald, bg: T.emeraldLight },
  { label: "Photography", icon: Camera, color: T.cyan, bg: T.cyanLight },
  { label: "Education", icon: BookOpen, color: T.amber, bg: T.amberLight },
  { label: "Networking", icon: Users, color: T.violet, bg: T.violetLight },
];

function MagneticPill({ label, active, color, bg, icon: Icon, onClick }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18 });
  const sy = useSpring(y, { stiffness: 280, damping: 18 });
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.22);
    y.set((e.clientY - r.top - r.height / 2) * 0.22);
  };
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{
        x: sx, y: sy,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 100,
        border: `1.5px solid ${active ? color : T.border}`,
        background: active ? bg : T.surface,
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontWeight: 600,
        fontSize: 13,
        color: active ? color : T.text2,
        boxShadow: active ? `0 4px 16px ${color}28` : T.shadow,
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={14} />
      {label}
    </motion.button>
  );
}

export default function EventGalaxy() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? events : events.filter((e) => e.cat === filter);

  return (
    <section className="home-section">
      <div className="home-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Flame size={14} color={T.rose} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.rose, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Trending Events
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.15 }}
            >
              Find your next <em>experience</em>
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                background: T.surface,
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={13} color={T.text3} />
              <span style={{ fontSize: 13, color: T.text3, fontWeight: 600 }}>Filters</span>
            </div>
          </div>
        </motion.div>

        <div
          className="no-scrollbar"
          style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 28, marginBottom: 32 }}
        >
          {CATS.map((c) => (
            <MagneticPill
              key={c.label}
              label={c.label}
              active={filter === c.label}
              color={c.color}
              bg={c.bg}
              icon={c.icon}
              onClick={() => setFilter(c.label)}
            />
          ))}
        </div>

        <motion.div
          layout
          className="events-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          <AnimatePresence>
            {visible.map((e, i) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <EventCard event={e} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
