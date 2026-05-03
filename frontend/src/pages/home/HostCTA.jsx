import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { T } from "./tokens";

export default function HostCTA() {
  return (
    <section className="home-section" style={{ paddingBottom: 100 }}>
      <div className="home-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="host-cta-inner"
          style={{
            borderRadius: 28,
            padding: "64px 72px",
            position: "relative",
            overflow: "hidden",
            background: T.violet,
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute", right: -40, top: -40,
              width: 320, height: 320, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute", left: "55%", bottom: -60,
              width: 260, height: 260, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)", pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", maxWidth: 560 }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "5px 13px", borderRadius: 8,
                background: "rgba(255,255,255,0.15)",
                fontSize: 11, fontWeight: 700, color: "#fff",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 22,
              }}
            >
              <Sparkles size={11} /> For Creators
            </span>

            <h2
              className="section-title"
              style={{
                fontSize: "clamp(1.8rem,4vw,3.2rem)",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 18,
              }}
            >
              Plan your next big
              <br />
              <em>thing with Aura.</em>
            </h2>

            <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 36 }}>
              From intimate workshops to 50,000-seat arenas — AuraEvents gives you the tools to create unforgettable experiences.
            </p>

            <div className="host-cta-buttons" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.04, background: "#fff", color: T.violet }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "13px 30px", borderRadius: 12,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                Host an Event <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "13px 30px", borderRadius: 12,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Play size={14} /> Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
