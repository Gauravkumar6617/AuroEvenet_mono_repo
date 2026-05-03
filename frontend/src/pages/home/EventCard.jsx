import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Star, Heart } from "lucide-react";
import { T, catMeta, badgeColors } from "./tokens";

export default function EventCard({ event }) {
  const [hov, setHov] = useState(false);
  const [saved, setSaved] = useState(false);
  const cm = catMeta[event.cat] || { color: T.violet, bg: T.violetLight };

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: T.surface,
        border: `1px solid ${hov ? cm.color + "44" : T.border}`,
        boxShadow: hov ? T.shadowHover : T.shadow,
        cursor: "pointer",
        transition: "border-color 0.3s",
        height: "100%",
      }}
    >
      {/* Image */}
      <div style={{ height: 196, overflow: "hidden", position: "relative" }}>
        <motion.img
          src={event.img}
          alt={event.title}
          animate={{ scale: hov ? 1.08 : 1 }}
          transition={{ duration: 0.55 }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: T.surface,
              border: `1px solid ${T.border}`,
              fontSize: 11,
              fontWeight: 700,
              color: cm.color,
              backdropFilter: "blur(8px)",
            }}
          >
            {event.cat}
          </span>
          {event.badge && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                background: badgeColors[event.badge]?.bg || T.violetLight,
                fontSize: 11,
                fontWeight: 700,
                color: badgeColors[event.badge]?.color || T.violet,
              }}
            >
              {event.badge}
            </span>
          )}
        </div>
        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 0.85 }}
          animate={{ opacity: hov || saved ? 1 : 0 }}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.surface,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Heart size={14} fill={saved ? T.rose : "none"} color={saved ? T.rose : T.text3} />
        </motion.button>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 18px" }}>
        <h4
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 18,
            lineHeight: 1.25,
            marginBottom: 8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </h4>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: T.text3, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={11} /> {event.date}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={11} /> {event.loc}
          </span>
        </div>

        <AnimatePresence>
          {hov && event.speakers.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden", marginBottom: 12 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: T.text4 }}>Speakers</span>
                  <div style={{ display: "flex" }}>
                    {event.speakers.map((s, i) => (
                      <img
                        key={i}
                        src={s}
                        alt=""
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: `2px solid ${T.surface}`,
                          marginLeft: i > 0 ? -7 : 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={11} fill={T.amber} color={T.amber} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{event.rating}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 22,
                color: event.price === "Free" ? T.emerald : T.text,
              }}
            >
              {event.price}
            </span>
            {event.price !== "Free" && (
              <span style={{ fontSize: 11, color: T.text4, marginLeft: 4 }}>per ticket</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 4px 20px ${cm.color}44` }}
            whileTap={{ scale: 0.94 }}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              background: cm.color,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Get Tickets
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
