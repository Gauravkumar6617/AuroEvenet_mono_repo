import { useState } from "react";
import GlobalStyle from "./home/GlobalStyle";
import { T } from "./home/tokens";

const reports = [
  { id: 1, title: "Spam event listing", count: 8 },
  { id: 2, title: "Misleading venue / capacity info", count: 3 },
];

const NAV = [
  { key: "moderation", label: "Moderation", icon: "🛡️", badge: reports.length },
  { key: "users", label: "Users", icon: "👥" },
  { key: "analytics", label: "Analytics", icon: "📊" },
];

function Sidebar({ active, onChange }) {
  return (
    <aside style={{ background: T.surface, borderRadius: 24, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ padding: "8px 12px 20px", fontSize: 18, color: T.text }}>Admin Panel</div>
      {NAV.map((n) => (
        <button key={n.key} onClick={() => onChange(n.key)} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderRadius: 14, border: "none", cursor: "pointer",
          background: active === n.key ? T.violetLight : "transparent",
          color: active === n.key ? T.violet : T.text2,
          fontWeight: active === n.key ? 800 : 500, fontSize: 14,
          transition: "all 0.15s",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{n.icon}</span>{n.label}
          </span>
          {n.badge ? (
            <span style={{ background: T.rose, color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{n.badge}</span>
          ) : null}
        </button>
      ))}
    </aside>
  );
}

function Card({ children, style }) {
  return <div style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "24px 28px", ...style }}>{children}</div>;
}

export default function AdminDashboard() {
  const [section, setSection] = useState("moderation");

  return (
    <>
      <GlobalStyle />
      <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 80 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-flex", background: T.roseLight, color: T.rose, borderRadius: 999, padding: "5px 14px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Admin</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: T.text }}>Admin Panel</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
            <Sidebar active={section} onChange={setSection} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {section === "moderation" && (
                <Card>
                  <h2 style={{ fontSize: 22, color: T.text, marginBottom: 20 }}>Report Queue</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {reports.map((r) => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surfaceEl, borderRadius: 16, padding: "14px 18px" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: T.text4, marginTop: 2 }}>{r.count} reports</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{ background: T.surface, color: T.text2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Review</button>
                          <button style={{ background: T.rose, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {section === "users" && (
                <Card>
                  <h2 style={{ fontSize: 22, color: T.text, marginBottom: 20 }}>User Management</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["gaurav", "priya", "alex"].map((name) => (
                      <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surfaceEl, borderRadius: 16, padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.violetLight, color: T.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{name[0].toUpperCase()}</div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>@{name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ background: T.emeraldLight, color: T.emerald, borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800 }}>Active</span>
                          <button style={{ background: T.surface, color: T.text2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Suspend</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {section === "analytics" && (
                <Card>
                  <h2 style={{ fontSize: 22, color: T.text, marginBottom: 12 }}>Analytics</h2>
                  <p style={{ fontSize: 15, color: T.text3, lineHeight: 1.7 }}>Add charts for DAU, report volume, and trending events.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }}>
                    {[["Daily Active Users", "—", T.violet, T.violetLight], ["Moderation Volume", "—", T.rose, T.roseLight], ["Event Trends", "—", T.amber, T.amberLight]].map(([label, val, color, bg]) => (
                      <div key={label} style={{ background: bg, borderRadius: 16, padding: "20px" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 28, color }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
