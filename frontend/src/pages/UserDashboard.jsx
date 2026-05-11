import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";

const KPIS = [
  { label: "Total views", value: "12.4K", trend: "+18%", icon: "👁️", color: "text-blue-600 bg-blue-50" },
  { label: "Karma points", value: "1,840", trend: "+124", icon: "⚡", color: "text-amber-600 bg-amber-50" },
  { label: "Posts published", value: "34", trend: "+3", icon: "📝", color: "text-emerald-600 bg-emerald-50" },
  { label: "Followers", value: "312", trend: "+22", icon: "👥", color: "text-purple-600 bg-purple-50" },
];

const MY_POSTS = [
  { id: 1, title: "How to structure FastAPI for scale", votes: 82, comments: 19, views: 1240, status: "published", time: "2d ago", type: "article" },
  { id: 2, title: "React Query patterns I use daily", votes: 45, comments: 8, views: 780, status: "published", time: "5d ago", type: "discussion" },
  { id: 3, title: "Draft: Kubernetes security checklist", votes: 0, comments: 0, views: 0, status: "draft", time: "1h ago", type: "article" },
];

const SAVED_POSTS = [
  { id: 4, title: "Scaling from 10 to 10K users — lessons learned", author: "ravi_founder", votes: 203, time: "2d ago" },
  { id: 5, title: "Auth strategy for multi-tenant SaaS", author: "sara_prod", votes: 128, time: "3d ago" },
];

const NOTIFS = [
  { id: 1, type: "like", icon: "❤️", text: "priya_arch liked your post", sub: "How to structure FastAPI...", time: "5m ago", unread: true },
  { id: 2, type: "comment", icon: "💬", text: "alex_swe commented on your post", sub: "Great write-up! One thing to add...", time: "1h ago", unread: true },
  { id: 3, type: "follow", icon: "👤", text: "karthik_ai followed you", sub: null, time: "3h ago", unread: false },
  { id: 4, type: "mention", icon: "📣", text: "You were mentioned by dev_patel", sub: "...as @gaurav_dev mentioned in #fastapi...", time: "1d ago", unread: false },
];

const TOPICS = ["Engineering", "AI & ML", "Product Design", "DevOps", "Open Source", "Career", "Startup", "Data Science", "Frontend", "Backend"];

const MY_COMMUNITIES = [
  { name: "Engineering", slug: "engineering", icon: "🛠️", members: 4200, role: "member" },
  { name: "Frontend", slug: "frontend", icon: "🖥️", members: 3900, role: "member" },
  { name: "FastAPI", slug: "fastapi", icon: "⚡", members: 1800, role: "admin" },
];

const READING_HISTORY = [
  { id: 1, title: "How to handle distributed tracing in microservices?", author: "alex_swe", time: "2h ago", duration: "4 min read" },
  { id: 2, title: "Scaling React applications with micro-frontends", author: "dev_patel", time: "1d ago", duration: "7 min read" },
  { id: 3, title: "PostgreSQL indexing deep dive", author: "ravi_db", time: "3d ago", duration: "12 min read" },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [notifFilter, setNotifFilter] = useState("All");
  const [notifPrefs, setNotifPrefs] = useState({ likes: true, comments: true, replies: true, mentions: true, follows: true, emailDigest: "weekly" });
  const [selectedTopics, setSelectedTopics] = useState(["Engineering", "Frontend", "AI & ML"]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleTopic = (t) => setSelectedTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const sidebarItems = [
    { key: "overview", label: "Overview", icon: "⚡" },
    { key: "posts", label: "My Posts", icon: "📝" },
    { key: "saved", label: "Saved Posts", icon: "🔖" },
    { key: "history", label: "Reading History", icon: "📚" },
    { key: "communities", label: "My Communities", icon: "🌐" },
    { key: "notifications", label: "Notifications", icon: "🔔", count: NOTIFS.filter((n) => n.unread).length },
    { key: "interests", label: "Topic Interests", icon: "🎯" },
    { key: "settings", label: "Account Settings", icon: "⚙️" },
    { key: "privacy", label: "Privacy", icon: "🔒" },
  ];

  const fadeProps = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#1a1814]">Hey, {user?.username || "there"} 👋</h1>
            <p className="text-sm text-[#6b6358] mt-1">Manage your profile, content, and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/create-post"><Button size="sm">+ New Post</Button></Link>
            <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="surface h-fit p-3 rounded-2xl">
            <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-[rgba(90,80,60,0.08)]">
              <div className="avatar h-10 w-10 text-sm">{(user?.username || "U")[0].toUpperCase()}</div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1a1814] truncate">@{user?.username || "user"}</p>
                <p className="text-xs text-[#a09880] truncate">{user?.email || ""}</p>
              </div>
            </div>
            <Link to={`/u/${user?.username || "user"}`} className="sidebar-item mb-1 text-[#e85d26] bg-[#fdf0ea] hover:bg-[#fdf0ea]">
              <span>🔗</span><span className="flex-1">View public profile</span>
            </Link>
            <Link to="/edit-profile" className="sidebar-item mb-1">
              <span>👤</span><span className="flex-1">Edit Profile</span>
            </Link>
            {sidebarItems.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""}`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && <span className="rounded-full bg-[#e85d26] text-white text-xs px-1.5 py-0.5 font-bold">{item.count}</span>}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="space-y-5 min-w-0">
            <AnimatePresence mode="wait">

              {/* ── Overview ── */}
              {section === "overview" && (
                <motion.div key="overview" {...fadeProps} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {KPIS.map((k) => (
                      <Card key={k.label}>
                        <div className={`mb-2 inline-flex rounded-lg p-2 ${k.color}`}>{k.icon}</div>
                        <p className="text-2xl font-bold text-[#1a1814] font-display">{k.value}</p>
                        <p className="text-xs text-[#a09880]">{k.label}</p>
                        <p className="mt-1 text-xs font-semibold text-emerald-600">{k.trend}</p>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Recent posts</p>
                    <div className="space-y-3">
                      {MY_POSTS.slice(0, 2).map((p) => (
                        <div key={p.id} className="flex items-center gap-3 py-2 border-b border-[rgba(90,80,60,0.07)] last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1a1814] truncate">{p.title}</p>
                            <p className="text-xs text-[#a09880] mt-0.5">▲ {p.votes} · 💬 {p.comments} · {p.time}</p>
                          </div>
                          <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-[rgba(90,80,60,0.07)] text-[#a09880]"}`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── My Posts ── */}
              {section === "posts" && (
                <motion.div key="posts" {...fadeProps}>
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">My Posts</p>
                      <Link to="/create-post" className="btn-primary text-xs px-3 py-1.5 rounded-lg">+ New</Link>
                    </div>
                    <div className="space-y-3">
                      {MY_POSTS.map((p) => (
                        <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)] hover:border-[rgba(232,93,38,0.2)] transition-all">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1a1814] leading-snug">{p.title}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#a09880]">
                              <span>▲ {p.votes}</span><span>💬 {p.comments}</span><span>👁️ {p.views}</span><span>{p.time}</span>
                            </div>
                          </div>
                          <span className={`shrink-0 text-xs font-semibold rounded-full px-2 py-0.5 ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── Saved ── */}
              {section === "saved" && (
                <motion.div key="saved" {...fadeProps}>
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-4">Saved Posts</p>
                    <div className="space-y-3">
                      {SAVED_POSTS.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)]">
                          <div className="flex-1 min-w-0">
                            <Link to={`/blog/${p.id}`} className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors line-clamp-1">{p.title}</Link>
                            <p className="text-xs text-[#a09880] mt-0.5">by @{p.author} · ▲ {p.votes} · {p.time}</p>
                          </div>
                          <button className="text-[#a09880] hover:text-red-500 transition-colors p-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── Reading History ── */}
              {section === "history" && (
                <motion.div key="history" {...fadeProps}>
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Reading History</p>
                      <button className="text-xs text-red-500 hover:underline">Clear all</button>
                    </div>
                    <p className="text-xs text-[#a09880] mb-4 bg-[rgba(90,80,60,0.04)] rounded-lg p-3">
                      Posts you've read for 10+ seconds. Used to personalise your feed and avoid repeats.
                      <Link to="/settings/topics" className="text-[#e85d26] hover:underline ml-1">Manage preferences →</Link>
                    </p>
                    <div className="space-y-2">
                      {READING_HISTORY.map((h, i) => (
                        <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)]">
                          <div className="h-8 w-8 rounded-lg bg-[rgba(90,80,60,0.06)] flex items-center justify-center text-sm font-bold text-[#a09880] shrink-0">{i + 1}</div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/blog/${h.id}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors line-clamp-1">{h.title}</Link>
                            <p className="text-xs text-[#a09880] mt-0.5">@{h.author} · {h.duration} · {h.time}</p>
                          </div>
                          <button className="text-[#a09880] hover:text-red-500 transition-colors p-1 shrink-0">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── Communities ── */}
              {section === "communities" && (
                <motion.div key="communities" {...fadeProps}>
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">My Communities</p>
                      <Link to="/communities" className="text-xs text-[#e85d26] font-semibold hover:underline">Browse all →</Link>
                    </div>
                    <div className="space-y-2">
                      {MY_COMMUNITIES.map((c) => (
                        <Link key={c.slug} to={`/communities/${c.slug}`} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)] hover:border-[rgba(232,93,38,0.2)] transition-all group">
                          <span className="text-2xl">{c.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1a1814] group-hover:text-[#e85d26] transition-colors">{c.name}</p>
                            <p className="text-xs text-[#a09880]">{c.members.toLocaleString()} members</p>
                          </div>
                          {c.role === "admin" && <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2 py-0.5 font-semibold">Admin</span>}
                        </Link>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── Notifications ── */}
              {section === "notifications" && (
                <motion.div key="notifications" {...fadeProps} className="space-y-4">
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Notifications</p>
                      <button className="text-xs text-[#e85d26] font-semibold">Mark all read</button>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {["All", "Unread", "Mentions"].map((f) => (
                        <button key={f} onClick={() => setNotifFilter(f)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${notifFilter === f ? "bg-[#fdf0ea] text-[#e85d26]" : "text-[#a09880] hover:bg-[rgba(90,80,60,0.06)]"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {NOTIFS.filter((n) => notifFilter === "All" || (notifFilter === "Unread" && n.unread) || (notifFilter === "Mentions" && n.type === "mention")).map((n) => (
                        <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-[rgba(90,80,60,0.03)] ${n.unread ? "bg-[rgba(232,93,38,0.03)]" : ""}`}>
                          <span className="text-base mt-0.5">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1a1814]">{n.text}</p>
                            {n.sub && <p className="text-xs text-[#a09880] mt-0.5 truncate">"{n.sub}"</p>}
                            <p className="text-xs text-[#a09880] mt-0.5">{n.time}</p>
                          </div>
                          {n.unread && <div className="h-2 w-2 rounded-full bg-[#e85d26] shrink-0 mt-1.5" />}
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-4">Notification preferences</p>
                    <div className="space-y-3">
                      {[["likes", "Post likes"], ["comments", "New comments"], ["replies", "Replies to you"], ["mentions", "Mentions"], ["follows", "New followers"]].map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-[#1a1814]">{label}</span>
                          <button onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                            className={`relative h-5 w-9 rounded-full transition-colors ${notifPrefs[key] ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.2)]"}`}>
                            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifPrefs[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ── Topic Interests ── */}
              {section === "interests" && (
                <motion.div key="interests" {...fadeProps}>
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Topic Interests</p>
                      <Link to="/settings/topics" className="text-xs text-[#e85d26] font-semibold hover:underline">Advanced weights →</Link>
                    </div>
                    <p className="text-xs text-[#a09880] mb-4">Select topics to personalise your feed. For fine-grained weight control, use the advanced settings.</p>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button key={t} onClick={() => toggleTopic(t)}
                          className={`tag-pill transition-all ${selectedTopics.includes(t) ? "active" : ""}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <button className="mt-5 btn-primary text-xs px-4 py-2 rounded-lg">Save topics</button>
                  </Card>
                </motion.div>
              )}

              {/* ── Account Settings ── */}
              {section === "settings" && (
                <motion.div key="settings" {...fadeProps} className="space-y-4">
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-4">Account</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Username</label>
                        <input defaultValue={user?.username} className="input-field" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Email</label>
                        <input defaultValue={user?.email} className="input-field" />
                      </div>
                      <button className="btn-primary text-sm px-4 py-2 rounded-lg">Update</button>
                    </div>
                  </Card>
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-4">Change password</p>
                    <div className="space-y-3">
                      {["Current password", "New password", "Confirm new password"].map((l) => (
                        <input key={l} type="password" placeholder={l} className="input-field" />
                      ))}
                      <button className="btn-primary text-sm px-4 py-2 rounded-lg">Change password</button>
                    </div>
                  </Card>
                  <Card className="border-red-200 bg-red-50/30">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Danger zone</p>
                    {!showDeleteConfirm ? (
                      <button onClick={() => setShowDeleteConfirm(true)} className="text-sm font-semibold text-red-600 hover:underline">Delete my account</button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-red-700">This is permanent. Type <span className="font-mono font-bold">delete my account</span> to confirm.</p>
                        <input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="Type here..." className="input-field border-red-300" />
                        <div className="flex gap-2">
                          <button disabled={deleteConfirmText !== "delete my account"} className="btn-primary text-sm px-4 py-2 rounded-lg bg-red-600 shadow-[0_2px_8px_rgba(220,38,38,0.3)] hover:bg-red-700 disabled:opacity-40">Confirm delete</button>
                          <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }} className="btn-secondary text-sm px-4 py-2 rounded-lg">Cancel</button>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* ── Privacy ── */}
              {section === "privacy" && (
                <motion.div key="privacy" {...fadeProps} className="space-y-4">
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-4">Data & Tracking</p>
                    <div className="space-y-4">
                      {[
                        { key: "reading_history", label: "Reading history tracking", desc: "Track posts you read to personalise your feed and avoid duplicates." },
                        { key: "personalization", label: "Feed personalisation", desc: "Use your topic weights to rank your feed." },
                        { key: "analytics", label: "Anonymous analytics", desc: "Help improve Nexos by sending anonymised usage data." },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-start gap-3 py-2 border-b border-[rgba(90,80,60,0.08)] last:border-0">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#1a1814]">{label}</p>
                            <p className="text-xs text-[#a09880] mt-0.5">{desc}</p>
                          </div>
                          <button className="relative h-5 w-9 rounded-full bg-[#e85d26] shrink-0 mt-0.5">
                            <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-3 flex-wrap">
                      <button className="btn-secondary text-xs px-4 py-2 rounded-lg">Export my data</button>
                      <Link to="/privacy" className="text-xs text-[#e85d26] font-semibold hover:underline self-center">View full privacy policy →</Link>
                    </div>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
