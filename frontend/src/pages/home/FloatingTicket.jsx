import { motion } from "framer-motion";
import { T } from "./tokens";

export default function FloatingTicket({ title, date, price, color, bg, style }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: style.rotate
          ? [style.rotate, style.rotate - 1.5, style.rotate]
          : [0, -1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        borderRadius: 16,
        padding: "14px 18px",
        minWidth: 190,
        background: T.surface,
        boxShadow: T.shadowHover,
        border: `1px solid ${T.border}`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: T.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: T.text3 }}>{date}</span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 400,
            color,
            fontStyle: "italic",
          }}
        >
          {price}
        </span>
      </div>
      <div
        style={{
          marginTop: 8,
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${color}, ${color}44)`,
          width: "65%",
        }}
      />
    </motion.div>
  );
}
