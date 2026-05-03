import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GlobalStyle from "./home/GlobalStyle";
import { T } from "./home/tokens";

/* ── mock data ── */
const kpis = [
  { label: "Events attended", value: "14", delta: "+2 this month", icon: "🎫", accent: T.violet, bg: T.violetLight },
  { label: "Saved events", value: "27", delta: "3 new", icon: "🔖", accent: T.amber, bg: T.amberLight },
  { label: "Active tickets", value: "3", delta: "Next: Jun 12", icon: "✉️", accent: T.cyan, bg: T.cyanLight },
  { label: "Hosts you follow", value: "12", delta: "+4 this quarter", icon: "👥", accent: T.emerald, bg: T.emeraldLight },
];

const SAVED = [
  { id: 1, title: "AI Research Forum 2026", organizer: "Nexos Labs", cat: "Virtual · May 09" },
  { id: 2, title: "Indie Maker Meetup Lucknow", organizer: "BuildLU", cat: "In-person · Jun 03" },
  { id: 3, title: "Platform Engineering Salon", organizer: "Cloud Guild", cat: "Hybrid · Jul 18" },
];

const REGISTERED_EVENTS = [
  { id: 5, title: "Morning Yoga in the Park", date: "May 10", loc: "Lucknow, IN", status: "Upcoming", color: T.emerald, bg: T.emeraldLight },
  { id: 1, title: "Tech Frontier Summit", date: "Jun 12–14", loc: "San Francisco, CA", status: "Registered", color: T.violet, bg: T.violetLight },
  { id: 8, title: "AI Research Forum 2026", date: "Oct 15", loc: "Online", status: "Registered", color: T.cyan, bg: T.cyanLight },
];

const ACTIVITY = [
  { text: "You registered for Morning Yoga in the Park", time: "2h ago", icon: "🎫" },
  { text: "Reminder: Tech Frontier Summit starts in 48h", time: "5h ago", icon: "⏰" },
  { text: "BuildLU published a new workshop near you", time: "Yesterday", icon: "📣" },
  { text: "You saved Platform Engineering Salon", time: "2 days ago", icon: "🔖" },
  { text: "Your RSVP for Indie Maker Meetup was confirmed", time: "3 days ago", icon: "✓" },
];

const NAV = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "myevents", label: "My Events", icon: "🎫" },
  { key: "saved", label: "Saved", icon: "🔖" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

/* ── shared components ── */
function Sidebar({ active, onChange, user }) {
  return (
    <aside style={{ background: T.surface, borderRadius: 24, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "24px 16px", position: "sticky", top: 96 }}>
      {/* avatar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 8px 24px", borderBottom: `1px solid ${T.border}`, marginBottom: 12 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${T.violet}, ${T.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", fontWeight: 800, marginBottom: 10 }}>
          {(user?.username || "U")[0].toUpperCase()}
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: T.text }}>{user?.username || "User"}</div>
        <div style={{ fontSize: 11, color: T.text4, marginTop: 2 }}>{user?.email || "user@example.com"}</div>
        <div style={{ marginTop: 8, background: T.emeraldLight, color: T.emerald, borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Member</div>
      </div>
      {/* nav */}
      <div style={{ fontSize: 13, color: T.text4, padding: "4px 12px 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Workspace</div>
      {NAV.map(n => (
        <button key={n.key} onClick={() => onChange(n.key)} style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%",
          padding: "11px 14px", borderRadius: 14, border: "none", cursor: "pointer",
          background: active === n.key ? T.violetLight : "transparent",
          color: active === n.key ? T.violet : T.text2,
          fontWeight: active === n.key ? 800 : 500, fontSize: 14, transition: "all 0.15s", textAlign: "left",
        }}>
          <span style={{ fontSize: 16 }}>{n.icon}</span>{n.label}
        </button>
      ))}
    </aside>
  );
}

function Card({ children, style }) {
  return <div style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "28px 32px", ...style }}>{children}</div>;
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: T.text4, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>{children}</div>;
}

function StatusBadge({ status }) {
  const map = {
    Published: [T.emerald, T.emeraldLight],
    Draft: [T.amber, T.amberLight],
    Upcoming: [T.violet, T.violetLight],
    Registered: [T.cyan, T.cyanLight],
  };
  const [color, bg] = map[status] || [T.text3, T.surfaceEl];
  return <span style={{ background: bg, color, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>{status}</span>;
}

/* ── page ── */
export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* ── TOP BAR ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <div style={{ display: "inline-flex", background: T.violetLight, color: T.violet, borderRadius: 999, padding: "5px 14px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Dashboard</div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: T.text, lineHeight: 1.1 }}>
                Welcome back, <em style={{ fontStyle: "italic", color: T.violet }}>{user?.username || "User"}</em>
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* notif bell */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setNotifOpen(v => !v)} style={{ width: 42, height: 42, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>🔔</button>
                <span style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: T.rose, border: `2px solid ${T.bg}`, fontSize: 8, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>3</span>
                {notifOpen && (
                  <div style={{ position: "absolute", right: 0, top: 52, width: 280, background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, boxShadow: T.shadowHover, zIndex: 50, overflow: "hidden" }}>
                    <div style={{ padding: "16px 18px 10px", fontWeight: 800, fontSize: 13, color: T.text, borderBottom: `1px solid ${T.border}` }}>Notifications</div>
                    {ACTIVITY.slice(0,3).map((a, i) => (
                      <div key={i} style={{ padding: "12px 18px", display: "flex", gap: 12, alignItems: "flex-start", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <div>
                          <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.5 }}>{a.text}</div>
                          <div style={{ fontSize: 10, color: T.text4, marginTop: 2 }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={logout} style={{ background: T.surfaceEl, color: T.text2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Logout
              </button>
            </div>
          </div>

          {/* ── LAYOUT ── */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28 }}>
            <Sidebar active={section} onChange={setSection} user={user} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* ════ OVERVIEW ════ */}
              {section === "overview" && (<>
                {/* KPI row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                  {kpis.map((k) => (
                    <div key={k.label} style={{ background: k.bg, borderRadius: 20, padding: "22px 20px" }}>
                      <div style={{ fontSize: 22, marginBottom: 10 }}>{k.icon}</div>
                      <div style={{ fontSize: 32, color: k.accent, lineHeight: 1 }}>{k.value}</div>
                      <div style={{ fontSize: 11, color: k.accent, fontWeight: 700, marginTop: 6, opacity: 0.75 }}>{k.label}</div>
                      <div style={{ fontSize: 11, color: k.accent, fontWeight: 600, marginTop: 4, opacity: 0.55 }}>{k.delta}</div>
                    </div>
                  ))}
                </div>

                {/* two-col: activity + upcoming */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Card>
                    <SectionLabel>Recent Activity</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {ACTIVITY.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 12, background: T.surfaceEl, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                          <div>
                            <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.5 }}>{a.text}</div>
                            <div style={{ fontSize: 11, color: T.text4, marginTop: 2 }}>{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <Card>
                      <SectionLabel>Profile Completion</SectionLabel>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>72% complete</span>
                        <span style={{ fontSize: 12, color: T.text4 }}>3 tasks left</span>
                      </div>
                      <div style={{ height: 8, background: T.surfaceEl, borderRadius: 999 }}>
                        <div style={{ width: "72%", height: "100%", background: `linear-gradient(90deg, ${T.violet}, ${T.cyan})`, borderRadius: 999 }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                        {[["Add profile photo", false], ["Verify email", true], ["Write bio", false]].map(([task, done]) => (
                          <div key={task} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: done ? T.text4 : T.text2 }}>
                            <span style={{ width: 18, height: 18, borderRadius: 6, background: done ? T.emeraldLight : T.surfaceEl, color: done ? T.emerald : T.text4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{done ? "✓" : "○"}</span>
                            <span style={{ textDecoration: done ? "line-through" : "none" }}>{task}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card style={{ background: T.text }}>
                      <div style={{ fontSize: 20, color: "#fff", marginBottom: 8 }}>Discover events</div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 20 }}>3 new happenings near you this week.</p>
                      <Link to="/event" style={{ display: "block", textAlign: "center", background: T.violet, color: "#fff", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>Browse events →</Link>
                    </Card>
                  </div>
                </div>
              </>)}

              {/* ════ MY EVENTS ════ */}
              {section === "myevents" && (<>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 24, color: T.text }}>My Registered Events</h2>
                    <Link to="/event" style={{ background: T.violet, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>+ Find events</Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {REGISTERED_EVENTS.map(ev => (
                      <div key={ev.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: ev.bg, borderRadius: 18, padding: "18px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 16, background: ev.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎫</div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: T.text }}>{ev.title}</div>
                            <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>📅 {ev.date} · 📍 {ev.loc}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <StatusBadge status={ev.status} />
                          <button style={{ background: "white", color: T.text2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>View Ticket</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* past events */}
                <Card>
                  <SectionLabel>Past Events</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Street Photography Walk", "Apr 12", "Lucknow, IN"], ["Indie Food Festival", "Mar 18", "Lucknow, IN"]].map(([title, date, loc]) => (
                      <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surfaceEl, borderRadius: 14, padding: "14px 18px" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: T.text2 }}>{title}</div>
                          <div style={{ fontSize: 12, color: T.text4 }}>📅 {date} · 📍 {loc}</div>
                        </div>
                        <button style={{ background: T.surface, color: T.text3, border: `1px solid ${T.border}`, borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Leave Review</button>
                      </div>
                    ))}
                  </div>
                </Card>
              </>)}

              {/* ════ POSTS ════ */}
              {/* ════ SAVED ════ */}
              {section === "saved" && (
                <Card>
                  <h2 style={{ fontSize: 24, color: T.text, marginBottom: 24 }}>Saved events</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {SAVED.map(s => (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surfaceEl, borderRadius: 16, padding: "16px 20px" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>{s.title}</div>
                          <div style={{ fontSize: 12, color: T.text4, marginTop: 3 }}>{s.organizer} · {s.cat}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Link to="/event" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", color: T.text2, textDecoration: "none" }}>View</Link>
                          <button style={{ background: T.roseLight, border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", color: T.rose }}>Unsave</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ════ SETTINGS ════ */}
              {section === "settings" && (<>
                <Card>
                  <h2 style={{ fontSize: 24, color: T.text, marginBottom: 24 }}>Profile Settings</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {[["Username", user?.username || "gaurav_k"], ["Email", user?.email || "gaurav@example.com"], ["Location", "Lucknow, IN"], ["Bio", ""]].map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: T.text4, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{label}</div>
                        <input defaultValue={val} placeholder={`Enter ${label}`} style={{ width: "100%", background: T.surfaceEl, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    ))}
                  </div>
                  <button style={{ marginTop: 24, background: T.violet, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Save Changes</button>
                </Card>

                <Card>
                  <h2 style={{ fontSize: 20, color: T.text, marginBottom: 20 }}>Notification Preferences</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[["Email updates on new events near you", true], ["Event reminders 24h before", true], ["New followers", false], ["Weekly digest", true]].map(([label, on]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.surfaceEl, borderRadius: 14, padding: "14px 18px" }}>
                        <span style={{ fontSize: 14, color: T.text2, fontWeight: 600 }}>{label}</span>
                        <div style={{ width: 40, height: 22, borderRadius: 999, background: on ? T.violet : T.border, position: "relative", cursor: "pointer" }}>
                          <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card style={{ border: `1px solid ${T.roseLight}` }}>
                  <h2 style={{ fontSize: 20, color: T.rose, marginBottom: 12 }}>Danger Zone</h2>
                  <p style={{ fontSize: 14, color: T.text3, lineHeight: 1.7, marginBottom: 16 }}>These actions are permanent and cannot be undone.</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{ background: T.surfaceEl, color: T.text2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Export My Data</button>
                    <button style={{ background: T.rose, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Delete Account</button>
                  </div>
                </Card>
              </>)}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}