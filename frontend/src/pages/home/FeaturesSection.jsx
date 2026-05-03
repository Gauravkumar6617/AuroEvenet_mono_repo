import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Compass, Zap, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { T } from "./tokens";

const features = [
  {
    id: "discover",
    icon: Compass,
    color: T.violet,
    title: "Smart Discovery",
    desc: "Personalized recommendations based on your location, interests, and attendance history.",
    mockup: (
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 11, color: T.text4, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
          Recommended for you
        </p>
        {[
          { t: "Morning Yoga Session", d: "0.8km away · Free", color: T.emerald },
          { t: "Tech Startup Mixer", d: "2.1km away · ₹299", color: T.violet },
          { t: "Jazz Under the Stars", d: "4km away · ₹799", color: T.rose },
        ].map((r) => (
          <div
            key={r.t}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{r.t}</p>
              <p style={{ fontSize: 11, color: T.text3 }}>{r.d}</p>
            </div>
            <ChevronRight size={14} color={T.text4} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "ticketing",
    icon: Zap,
    color: T.rose,
    title: "Instant Ticketing",
    desc: "One-tap checkout, QR code tickets, and group bookings — secured with cryptographic verification.",
    mockup: (
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: T.surfaceEl, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, background: T.text, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 3, padding: 8 }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 1, background: Math.random() > 0.4 ? "#fff" : "transparent" }} />
              ))}
            </div>
          </div>
          <p style={{ fontSize: 18 }}>Tech Frontier Summit</p>
          <p style={{ fontSize: 12, color: T.text3, marginTop: 4 }}>General Admission · Jun 12</p>
        </div>
        {[
          { label: "Name", val: "Aryan Sharma" },
          { label: "Order", val: "#AE-48291" },
          { label: "Seat", val: "Hall B, Row 4" },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 12, color: T.text3 }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{r.val}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "analytics",
    icon: TrendingUp,
    color: T.amber,
    title: "Host Analytics",
    desc: "Real-time dashboards, geographic breakdowns, and post-event reports for hosts.",
    mockup: (
      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 11, color: T.text4, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
          Event Performance
        </p>
        {[
          { s: "Views", v: 14800, pct: 100 },
          { s: "RSVPs", v: 3420, pct: 23 },
          { s: "Purchased", v: 1840, pct: 12 },
        ].map((s, i) => (
          <div key={s.s} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>{s.s}</span>
              <span style={{ fontSize: 12, color: T.text3 }}>{s.v.toLocaleString()}</span>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: T.surfaceEl, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${T.amber}, ${T.amber}66)` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function FeaturesSection() {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setActive(Math.min(features.length - 1, Math.floor(v * features.length)));
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      style={{ minHeight: `${features.length * 75}vh`, position: "relative", marginTop: 80 }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center" }}>
        <div
          className="features-grid home-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left: feature list */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={14} color={T.violet} />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.violet, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Platform
              </span>
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", lineHeight: 1.1, marginBottom: 44 }}
            >
              Everything to discover
              <br />
              <em>and host events.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {features.map((f, i) => {
                const Icon = f.icon;
                const isA = active === i;
                return (
                  <motion.button
                    key={f.id}
                    onClick={() => setActive(i)}
                    animate={{
                      background: isA ? f.color + "10" : "transparent",
                      borderColor: isA ? f.color + "44" : "transparent",
                    }}
                    style={{
                      padding: "18px 22px",
                      borderRadius: 14,
                      border: "1px solid transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 11,
                        background: isA ? f.color + "18" : T.surfaceEl,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.3s",
                      }}
                    >
                      <Icon size={17} color={isA ? f.color : T.text3} />
                    </div>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 700, color: isA ? T.text : T.text3, marginBottom: isA ? 4 : 0, transition: "color 0.3s" }}>
                        {f.title}
                      </p>
                      {isA && (
                        <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6 }}>{f.desc}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: mockup preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.38 }}
              className="features-mockup"
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background: T.surface,
                boxShadow: T.shadowHover,
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.surfaceEl,
                }}
              >
                {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                ))}
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    color: T.text3,
                    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  }}
                >
                  aura.events / {features[active].id}
                </span>
              </div>
              {features[active].mockup}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
