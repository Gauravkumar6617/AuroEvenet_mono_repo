import { useState } from "react";
import GlobalStyle from "./home/GlobalStyle";
import { T } from "./home/tokens";

/* ── mock data ── */
const METRICS = [
  { label: "Total Users", value: "8,471", delta: "+142 this week", icon: "👥", accent: T.violet, bg: T.violetLight },
  { label: "Listed Events", value: "4,120", delta: "+89 today", icon: "🎫", accent: T.cyan, bg: T.cyanLight },
  { label: "Open Reports", value: "23", delta: "6 critical", icon: "🚨", accent: T.rose, bg: T.roseLight },
  { label: "Active Admins", value: "5", delta: "2 online now", icon: "🛡️", accent: T.amber, bg: T.amberLight },
  { label: "Events Live", value: "38", delta: "+5 this month", icon: "🎫", accent: T.emerald, bg: T.emeraldLight },
  { label: "Revenue (MTD)", value: "$12.4K", delta: "+18% vs last month", icon: "💰", accent: T.orange, bg: T.orangeLight },
];

const USERS = [
  { id: 1, name: "Gaurav Kumar", email: "gaurav@example.com", role: "Admin", status: "Active", joined: "Jan 2025", hosted: 84 },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", role: "Moderator", status: "Active", joined: "Feb 2025", hosted: 42 },
  { id: 3, name: "Alex Rivera", email: "alex@example.com", role: "User", status: "Active", joined: "Mar 2025", hosted: 17 },
  { id: 4, name: "Sarah Chen", email: "sarah@example.com", role: "User", status: "Suspended", joined: "Apr 2025", hosted: 3 },
  { id: 5, name: "Mike Torres", email: "mike@example.com", role: "User", status: "Active", joined: "Apr 2025", hosted: 29 },
];

const REPORTS = [
  { id: 1, title: "Spam event promotion", reporter: "alex@example.com", count: 8, severity: "High", date: "May 02" },
  { id: 2, title: "Harassment in event chat", reporter: "priya@example.com", count: 3, severity: "Medium", date: "May 01" },
  { id: 3, title: "Misleading event info", reporter: "mike@example.com", count: 5, severity: "High", date: "Apr 30" },
  { id: 4, title: "Duplicate event listings", reporter: "sarah@example.com", count: 2, severity: "Low", date: "Apr 29" },
];

const AUDIT_LOG = [
  { action: "User sarah@example.com suspended", admin: "Gaurav K.", time: "2h ago", type: "danger" },
  { action: "Maintenance mode disabled", admin: "Priya S.", time: "5h ago", type: "warn" },
  { action: "Cache flushed (CDN)", admin: "Gaurav K.", time: "Yesterday", type: "info" },
  { action: "New admin role granted to Priya S.", admin: "Gaurav K.", time: "2 days ago", type: "info" },
  { action: "Report #3 resolved — listing unpublished", admin: "Priya S.", time: "3 days ago", type: "warn" },
];

const ROLES = [
  { name: "Super Admin", count: 1, perms: ["All permissions"], color: T.rose, bg: T.roseLight },
  { name: "Admin", count: 2, perms: ["Moderate content", "Manage users", "View analytics"], color: T.violet, bg: T.violetLight },
  { name: "Moderator", count: 2, perms: ["Moderate content", "Resolve reports"], color: T.cyan, bg: T.cyanLight },
  { name: "User", count: 8420, perms: ["Create listings", "Register for events"], color: T.emerald, bg: T.emeraldLight },
];

const NAV = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "users", label: "User Management", icon: "👥" },
  { key: "reports", label: "Report Queue", icon: "🚨", badge: 23 },
  { key: "roles", label: "Role Access", icon: "🔐" },
  { key: "platform", label: "Platform Settings", icon: "⚙️" },
  { key: "audit", label: "Audit Log", icon: "📋" },
  { key: "danger", label: "Danger Zone", icon: "⚠️" },
];

/* ── shared components ── */
function Sidebar({ active, onChange }) {
  return (
    <aside style={{ background: T.surface, borderRadius: 24, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "24px 16px", position: "sticky", top: 96 }}>
      <div style={{ padding: "8px 12px 16px", borderBottom: `1px solid ${T.border}`, marginBottom: 12 }}>
        <div style={{ fontSize: 17, color: T.text }}>Super Admin</div>
        <div style={{ fontSize: 11, color: T.text4, marginTop: 2 }}>AuraEvents Console</div>
      </div>
      {NAV.map(n => (
        <button key={n.key} onClick={() => onChange(n.key)} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
          padding: "11px 14px", borderRadius: 14, border: "none", cursor: "pointer",
          background: active === n.key ? (n.key === "danger" ? "#fff1f2" : T.violetLight) : "transparent",
          color: active === n.key ? (n.key === "danger" ? T.rose : T.violet) : T.text2,
          fontWeight: active === n.key ? 800 : 500, fontSize: 14, transition: "all 0.15s", textAlign: "left",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>{n.label}
          </span>
          {n.badge ? <span style={{ background: T.rose, color: "#fff", borderRadius: 999, padding: "2px 7px", fontSize: 10, fontWeight: 800 }}>{n.badge}</span> : null}
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

function RoleBadge({ role }) {
  const map = { "Super Admin": [T.rose, T.roseLight], Admin: [T.violet, T.violetLight], Moderator: [T.cyan, T.cyanLight], User: [T.emerald, T.emeraldLight] };
  const [c, bg] = map[role] || [T.text3, T.surfaceEl];
  return <span style={{ background: bg, color: c, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>{role}</span>;
}

function SeverityBadge({ level }) {
  const map = { High: [T.rose, T.roseLight], Medium: [T.amber, T.amberLight], Low: [T.text3, T.surfaceEl] };
  const [c, bg] = map[level] || [T.text3, T.surfaceEl];
  return <span style={{ background: bg, color: c, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>{level}</span>;
}

/* ── page ── */
export default function SuperAdminDashboard() {
  const [section, setSection] = useState("overview");
  const [maintenance, setMaintenance] = useState(false);
  const [regOpen, setRegOpen] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [resolvedReports, setResolvedReports] = useState([]);

  const filteredUsers = USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <>
      <GlobalStyle />
      <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* ── TOP BAR ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <div style={{ display: "inline-flex", background: "#fff1f2", color: T.rose, borderRadius: 999, padding: "5px 14px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Super Admin</div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: T.text, lineHeight: 1.1 }}>
                Admin Console
              </h1>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ background: maintenance ? T.amberLight : T.emeraldLight, color: maintenance ? T.amber : T.emerald, borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 800 }}>
                {maintenance ? "⚠️ Maintenance ON" : "● Platform Live"}
              </div>
            </div>
          </div>

          {/* ── LAYOUT ── */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28 }}>
            <Sidebar active={section} onChange={setSection} />

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* ════ OVERVIEW ════ */}
              {section === "overview" && (<>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {METRICS.map((m) => (
                    <div key={m.label} style={{ background: m.bg, borderRadius: 20, padding: "24px 22px" }}>
                      <div style={{ fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
                      <div style={{ fontSize: 34, color: m.accent, lineHeight: 1 }}>{m.value}</div>
                      <div style={{ fontSize: 12, color: m.accent, fontWeight: 700, marginTop: 6, opacity: 0.75 }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: m.accent, fontWeight: 600, marginTop: 4, opacity: 0.5 }}>{m.delta}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* recent reports */}
                  <Card>
                    <SectionLabel>🚨 Critical Reports</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {REPORTS.filter(r => r.severity === "High").map(r => (
                        <div key={r.id} style={{ background: T.roseLight, borderRadius: 14, padding: "14px 16px" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{r.title}</div>
                          <div style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>{r.count} reports · {r.date}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSection("reports")} style={{ marginTop: 16, background: "transparent", color: T.violet, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>View all reports →</button>
                  </Card>

                  {/* audit snapshot */}
                  <Card>
                    <SectionLabel>📋 Recent Admin Actions</SectionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {AUDIT_LOG.slice(0, 4).map((log, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.type === "danger" ? T.rose : log.type === "warn" ? T.amber : T.cyan, marginTop: 5, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 13, color: T.text2 }}>{log.action}</div>
                            <div style={{ fontSize: 11, color: T.text4, marginTop: 1 }}>{log.admin} · {log.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>)}

              {/* ════ USER MANAGEMENT ════ */}
              {section === "users" && (
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 24, color: T.text }}>User Management</h2>
                    <button style={{ background: T.violet, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>+ Invite User</button>
                  </div>
                  <input
                    value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    style={{ width: "100%", background: T.surfaceEl, border: `1px solid ${T.border}`, borderRadius: 14, padding: "12px 18px", fontSize: 14, color: T.text, outline: "none",  marginBottom: 20, boxSizing: "border-box" }}
                  />
                  {/* table header */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 100px 90px 80px 100px", gap: 12, padding: "8px 14px", fontSize: 11, fontWeight: 800, color: T.text4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    <span>User</span><span>Email</span><span>Role</span><span>Status</span><span>Hosted</span><span>Actions</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filteredUsers.map(u => (
                      <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 100px 90px 80px 100px", gap: 12, alignItems: "center", background: T.surfaceEl, borderRadius: 14, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.violetLight, color: T.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{u.name[0]}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: T.text4 }}>since {u.joined}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: T.text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                        <RoleBadge role={u.role} />
                        <span style={{ background: u.status === "Active" ? T.emeraldLight : T.roseLight, color: u.status === "Active" ? T.emerald : T.rose, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>{u.status}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.text2 }}>{u.hosted}</span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer", color: T.text3 }}>Edit</button>
                          <button style={{ background: T.roseLight, border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer", color: T.rose, fontWeight: 700 }}>Ban</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ════ REPORTS ════ */}
              {section === "reports" && (
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 24, color: T.text }}>Report Queue</h2>
                    <span style={{ background: T.roseLight, color: T.rose, borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 800 }}>{REPORTS.length - resolvedReports.length} open</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {REPORTS.map(r => {
                      const resolved = resolvedReports.includes(r.id);
                      return (
                        <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: resolved ? T.surfaceEl : T.surface, borderRadius: 18, padding: "18px 22px", border: `1px solid ${resolved ? T.border : (r.severity === "High" ? T.roseLight : T.border)}`, opacity: resolved ? 0.5 : 1 }}>
                          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                            <SeverityBadge level={r.severity} />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: 15, color: T.text, textDecoration: resolved ? "line-through" : "none" }}>{r.title}</div>
                              <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>Reported by {r.reporter} · {r.count} reports · {r.date}</div>
                            </div>
                          </div>
                          {!resolved ? (
                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                              <button style={{ background: T.surface, color: T.text2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Review</button>
                              <button onClick={() => setResolvedReports(v => [...v, r.id])} style={{ background: T.emeraldLight, color: T.emerald, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Resolve</button>
                              <button style={{ background: T.rose, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Remove</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: T.emerald, fontWeight: 700 }}>✓ Resolved</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* ════ ROLES ════ */}
              {section === "roles" && (<>
                <Card>
                  <h2 style={{ fontSize: 24, color: T.text, marginBottom: 24 }}>Role Assignments</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {ROLES.map(r => (
                      <div key={r.name} style={{ background: r.bg, borderRadius: 20, padding: "22px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div style={{ fontWeight: 800, fontSize: 16, color: r.color }}>{r.name}</div>
                          <div style={{ fontSize: 24, color: r.color }}>{r.count.toLocaleString()}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {r.perms.map(p => (
                            <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: r.color, opacity: 0.8 }}>
                              <span>✓</span>{p}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <SectionLabel>Promote / Demote User</SectionLabel>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input placeholder="Enter user email…" style={{ flex: 1, background: T.surfaceEl, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: T.text, outline: "none" }} />
                    <select style={{ background: T.surfaceEl, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: T.text, outline: "none",  cursor: "pointer" }}>
                      <option>User</option><option>Moderator</option><option>Admin</option>
                    </select>
                    <button style={{ background: T.violet, color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>Apply</button>
                  </div>
                </Card>
              </>)}

              {/* ════ PLATFORM ════ */}
              {section === "platform" && (<>
                <Card>
                  <h2 style={{ fontSize: 24, color: T.text, marginBottom: 24 }}>Platform Controls</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      ["Maintenance Mode", "Restrict all non-admin access to the platform", maintenance, () => setMaintenance(v => !v), T.amber],
                      ["User Registrations", "Allow new users to sign up", regOpen, () => setRegOpen(v => !v), T.emerald],
                      ["Event Creation", "Allow hosts to create new events", true, () => {}, T.violet],
                    ].map(([label, desc, on, toggle, color]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surfaceEl, borderRadius: 16, padding: "18px 22px" }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{label}</div>
                          <div style={{ fontSize: 12, color: T.text4, marginTop: 2 }}>{desc}</div>
                        </div>
                        <div onClick={toggle} style={{ width: 48, height: 26, borderRadius: 999, background: on ? color : T.border, position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                          <div style={{ position: "absolute", top: 3, left: on ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", transition: "left 0.2s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionLabel>System Stats</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                    {[["API Uptime", "99.98%", T.emerald, T.emeraldLight], ["Avg Response", "142ms", T.cyan, T.cyanLight], ["Error Rate", "0.02%", T.amber, T.amberLight]].map(([label, val, color, bg]) => (
                      <div key={label} style={{ background: bg, borderRadius: 16, padding: "20px" }}>
                        <div style={{ fontSize: 28, color }}>{val}</div>
                        <div style={{ fontSize: 12, color, fontWeight: 700, marginTop: 4, opacity: 0.75 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>)}

              {/* ════ AUDIT LOG ════ */}
              {section === "audit" && (
                <Card>
                  <h2 style={{ fontSize: 24, color: T.text, marginBottom: 24 }}>Audit Log</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {AUDIT_LOG.map((log, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: T.surfaceEl, borderRadius: 14, padding: "14px 18px" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: log.type === "danger" ? T.rose : log.type === "warn" ? T.amber : T.cyan, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{log.action}</div>
                          <div style={{ fontSize: 12, color: T.text4, marginTop: 2 }}>by {log.admin}</div>
                        </div>
                        <span style={{ fontSize: 12, color: T.text4, flexShrink: 0 }}>{log.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ════ DANGER ════ */}
              {section === "danger" && (<>
                <div style={{ background: T.roseLight, borderRadius: 16, padding: "16px 22px", border: `1px solid ${T.rose}33`, fontSize: 14, color: T.rose, fontWeight: 600 }}>
                  ⚠️ These actions are irreversible and affect all users. Proceed with extreme caution.
                </div>
                <Card style={{ border: `1px solid ${T.roseLight}` }}>
                  <h2 style={{ fontSize: 22, color: T.rose, marginBottom: 20 }}>Danger Zone</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      ["Flush CDN Cache", "Force-refresh all cached assets globally. Users may see a flash of unstyled content."],
                      ["Reset All Sessions", "Log out every user immediately. Cannot be undone."],
                      ["Wipe Test Data", "Remove all seeded test events and users from staging."],
                    ].map(([label, desc]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: T.surfaceEl, borderRadius: 16, padding: "18px 22px" }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{label}</div>
                          <div style={{ fontSize: 12, color: T.text4, marginTop: 2, maxWidth: 460 }}>{desc}</div>
                        </div>
                        <button style={{ background: T.rose, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>{label.split(" ")[0]}</button>
                      </div>
                    ))}
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