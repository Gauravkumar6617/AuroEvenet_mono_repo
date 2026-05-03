import { Zap } from "lucide-react";
import { T } from "./tokens";

export default function HomeFooter() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: "36px 24px",
        textAlign: "center",
        background: T.surface,
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 9, marginBottom: 10, cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 22, height: 22, borderRadius: 6, background: T.violet,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Zap size={12} color="#fff" fill="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: T.text }}>
          AuraEvents
        </span>
      </div>
      <p style={{ fontSize: 12, color: T.text4 }}>
        © 2026 AuraEvents Inc. · The Global Event Discovery Platform
      </p>
    </footer>
  );
}
