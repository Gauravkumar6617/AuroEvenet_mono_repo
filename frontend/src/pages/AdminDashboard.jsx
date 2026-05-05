import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";

const REPORTS = [
  { id: 1, title: "Spam promotion thread — 'Buy followers fast'", content: "Click here to buy 10,000 followers for $5...", author: "spam_user123", count: 12, type: "post", time: "30m ago" },
  { id: 2, title: "Personal attack on @priya_arch", content: "You're an idiot and your code is garbage...", author: "toxic_user", count: 5, type: "comment", time: "2h ago" },
  { id: 3, title: "Off-topic self-promotion in #engineering", content: "Check out my YouTube channel for more content...", author: "promo_bot", count: 3, type: "post", time: "4h ago" },
];

const MEMBERS = [
  { id: 1, name: "gaurav_dev", email: "gaurav@example.com", posts: 34, joined: "Jan 2026", status: "active", role: "member" },
  { id: 2, name: "priya_arch", email: "priya@example.com", posts: 89, joined: "Dec 2025", status: "active", role: "member" },
  { id: 3, name: "spam_user123", email: "spam@example.com", posts: 2, joined: "May 2026", status: "flagged", role: "member" },
  { id: 4, name: "alex_ops", email: "alex@example.com", posts: 45, joined: "Feb 2026", status: "active", role: "moderator" },
];

const PENDING_POSTS = [
  { id: 1, title: "New to React — where should I start?", author: "newbie_dev", time: "1h ago" },
  { id: 2, title: "Interesting take on TypeScript vs JavaScript", author: "ts_fan", time: "2h ago" },
];

const MOD_LOG = [
  { id: 1, action: "Removed post", target: "spam_user123", detail: "Spam promotion", admin: "you", time: "1h ago" },
  { id: 2, action: "Banned user", target: "toxic_user", detail: "Personal attacks", admin: "you", time: "3h ago" },
  { id: 3, action: "Pinned post", target: "'Best FastAPI patterns'", detail: "High quality content", admin: "co-mod", time: "1d ago" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState("moderation");
  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("7days");
  const [aiToggles, setAiToggles] = useState({ toxicity: true, spam: true });
  const [lockedPosts, setLockedPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);

  const navItems = [
    { key: "moderation", label: "Report Queue", icon: "🚩", count: REPORTS.length },
    { key: "approval", label: "Post Approval", icon: "✅", count: PENDING_POSTS.length },
    { key: "members", label: "Members", icon: "👥" },
    { key: "community", label: "Community Settings", icon: "⚙️" },
    { key: "analytics", label: "Analytics", icon: "📊" },
    { key: "log", label: "Mod Action Log", icon: "📋" },
  ];

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Badge tone="warning">Admin Panel</Badge>
            <Badge tone="info">Community: #engineering-hub</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#1a1814]">Admin Dashboard</h1>
          <p className="text-sm text-[#6b6358] mt-1">Moderate content, manage members, and configure your community.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="surface h-fit p-3 rounded-2xl">
            <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-[#a09880] mb-1">Admin</p>
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""}`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className={`rounded-full text-xs px-1.5 py-0.5 font-bold ${section === item.key ? "bg-[rgba(232,93,38,0.2)] text-[#e85d26]" : "bg-[rgba(90,80,60,0.1)] text-[#6b6358]"}`}>{item.count}</span>
                )}
              </button>
            ))}
          </aside>

          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 min-w-0">

              {/* REPORT QUEUE */}
              {section === "moderation" && (
                <>
                  {/* AI toggles */}
                  <div className="surface rounded-2xl p-4 flex items-center gap-6 flex-wrap">
                    <div className="text-sm font-semibold text-[#1a1814]">🤖 AI Moderation</div>
                    {[{ key: "toxicity", label: "Toxicity Scanner" }, { key: "spam", label: "Spam Detector" }].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                        <button onClick={() => setAiToggles(p => ({ ...p, [item.key]: !p[item.key] }))}
                          className={`relative h-5 w-9 rounded-full transition-colors ${aiToggles[item.key] ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.15)]"}`}>
                          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${aiToggles[item.key] ? "translate-x-4" : "translate-x-0.5"}`} />
                        </button>
                        <span className="text-xs font-medium text-[#6b6358]">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="surface rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-xl font-bold text-[#1a1814]">Report Queue</h2>
                      <Badge tone="danger">{REPORTS.length} open</Badge>
                    </div>
                    <div className="space-y-3">
                      {REPORTS.map((r) => (
                        <div key={r.id} className="rounded-xl border-[1.5px] border-[rgba(90,80,60,0.1)] p-4 hover:border-red-200 transition-all">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge tone="danger">{r.type}</Badge>
                                <span className="text-xs text-[#a09880]">{r.count} reports · {r.time}</span>
                              </div>
                              <p className="font-semibold text-sm text-[#1a1814]">{r.title}</p>
                              <p className="text-xs text-[#6b6358] mt-1 line-clamp-1 bg-red-50 rounded p-1.5 border border-red-100 italic">"{r.content}"</p>
                              <p className="text-xs text-[#a09880] mt-1">Posted by @{r.author}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="secondary">👁️ Review</Button>
                            <Button size="sm" variant="danger">🗑️ Remove</Button>
                            <Button size="sm" variant="ghost">✅ Dismiss</Button>
                            <Button size="sm" variant="ghost" onClick={() => setBanModal(r.author)}>🚫 Ban user</Button>
                            <Button size="sm" variant="ghost" onClick={() => setLockedPosts(p => [...p, r.id])}>
                              {lockedPosts.includes(r.id) ? "🔓 Unlock" : "🔒 Lock thread"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* POST APPROVAL */}
              {section === "approval" && (
                <div className="surface rounded-2xl p-5">
                  <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">Post Approval Queue</h2>
                  <p className="text-sm text-[#6b6358] mb-4">All new posts require mod approval before going live.</p>
                  <div className="space-y-3">
                    {PENDING_POSTS.map((post) => (
                      <div key={post.id} className="rounded-xl border border-[rgba(90,80,60,0.1)] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm text-[#1a1814]">{post.title}</p>
                          <span className="text-xs text-[#a09880]">{post.time}</span>
                        </div>
                        <p className="text-xs text-[#a09880] mb-3">By @{post.author}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">✅ Approve</Button>
                          <Button size="sm" variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50">❌ Reject</Button>
                          <Button size="sm" variant="ghost">View full post</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MEMBERS */}
              {section === "members" && (
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-[#1a1814]">Member List</h2>
                    <input className="input-field w-48 text-sm" placeholder="Search members..." />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[rgba(90,80,60,0.1)]">
                          {["User", "Posts", "Joined", "Status", "Actions"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#a09880]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {MEMBERS.map((m) => (
                          <tr key={m.id} className="border-b border-[rgba(90,80,60,0.05)] hover:bg-[rgba(90,80,60,0.02)]">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="avatar h-7 w-7 text-xs">{m.name[0].toUpperCase()}</div>
                                <div>
                                  <p className="font-semibold text-[#1a1814]">@{m.name}</p>
                                  <p className="text-xs text-[#a09880]">{m.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[#6b6358]">{m.posts}</td>
                            <td className="py-3 px-3 text-[#6b6358]">{m.joined}</td>
                            <td className="py-3 px-3">
                              <Badge tone={m.status === "active" ? "success" : m.status === "flagged" ? "danger" : "warning"}>{m.status}</Badge>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1.5">
                                <Button size="sm" variant="ghost" className="text-xs px-2">Warn</Button>
                                <Button size="sm" variant="ghost" className="text-xs px-2 text-red-600" onClick={() => setBanModal(m.name)}>Ban</Button>
                                {m.role === "member" && <Button size="sm" variant="ghost" className="text-xs px-2">Promote mod</Button>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* COMMUNITY SETTINGS */}
              {section === "community" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl p-5">
                    <h2 className="font-display text-xl font-bold text-[#1a1814] mb-5">Community Settings</h2>
                    <div className="space-y-4">
                      <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Community name</label><input className="input-field" defaultValue="Engineering Hub" /></div>
                      <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Description</label><textarea className="input-field min-h-20 resize-none" defaultValue="A community for software engineers..." /></div>
                      <div className="flex items-center justify-between py-3 border-t border-[rgba(90,80,60,0.08)]">
                        <div>
                          <p className="text-sm font-semibold text-[#1a1814]">Require post approval</p>
                          <p className="text-xs text-[#a09880]">All new posts need mod approval before going live</p>
                        </div>
                        <button className="relative h-5 w-9 rounded-full bg-[#e85d26]">
                          <div className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow" />
                        </button>
                      </div>
                    </div>
                    <Button className="mt-4">Save settings</Button>
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Manage Flairs / Tags</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {["question", "discussion", "article", "showcase", "meta"].map((flair) => (
                        <div key={flair} className="flex items-center gap-1.5 rounded-full border border-[rgba(90,80,60,0.12)] bg-white px-3 py-1">
                          <span className="tag-pill py-0 px-0 bg-transparent border-0">{flair}</span>
                          <button className="text-xs text-[#a09880] hover:text-red-500">×</button>
                        </div>
                      ))}
                      <button className="tag-pill border-dashed">+ Add flair</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ANALYTICS */}
              {section === "analytics" && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[{ label: "Members", value: "1,842", trend: "+24 this week" }, { label: "Posts this month", value: "348", trend: "+12%" }, { label: "Active today", value: "127", trend: "Good engagement" }].map((stat) => (
                      <div key={stat.label} className="surface rounded-2xl p-4">
                        <p className="font-display text-2xl font-bold text-[#1a1814]">{stat.value}</p>
                        <p className="text-xs text-[#6b6358]">{stat.label}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">{stat.trend}</p>
                      </div>
                    ))}
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Member growth (last 30 days)</h3>
                    <div className="flex items-end gap-1 h-32">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div key={i} style={{ height: `${Math.random() * 80 + 10}%` }} className="flex-1 rounded-sm bg-[#e85d26]/50 hover:bg-[#e85d26] transition-colors cursor-pointer" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MOD LOG */}
              {section === "log" && (
                <div className="surface rounded-2xl p-5">
                  <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">Moderation Action Log</h2>
                  <div className="space-y-2">
                    {MOD_LOG.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 rounded-xl bg-[rgba(90,80,60,0.03)] border border-[rgba(90,80,60,0.08)] p-3">
                        <div className="h-2 w-2 rounded-full bg-[#e85d26] mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-[#1a1814]"><span className="font-semibold">{log.action}</span> on {log.target}</p>
                          <p className="text-xs text-[#a09880]">Reason: {log.detail} · By {log.admin} · {log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </PageContainer>

      {/* Ban modal */}
      {banModal && (
        <div className="modal-overlay" onClick={() => setBanModal(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="surface rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-1">Ban @{banModal}</h3>
            <p className="text-sm text-[#6b6358] mb-4">A notification will be sent to the user with your reason.</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Reason</label>
                <textarea className="input-field min-h-20 resize-none" placeholder="Explain the reason for the ban..." value={banReason} onChange={e => setBanReason(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Duration</label>
                <select className="input-field" value={banDuration} onChange={e => setBanDuration(e.target.value)}>
                  <option value="1day">1 day</option>
                  <option value="7days">7 days</option>
                  <option value="30days">30 days</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="danger" className="flex-1" disabled={!banReason}>Ban user</Button>
              <Button variant="secondary" onClick={() => setBanModal(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
