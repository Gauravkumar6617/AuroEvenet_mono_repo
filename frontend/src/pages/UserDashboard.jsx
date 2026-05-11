import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { postsApi } from "../services/api/postsApi";
import { communitiesApi } from "../services/api/communitiesApi";
import { readingHistoryApi } from "../services/api/readingHistoryApi";
import { userApi } from "../services/api/userApi";

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [notifPrefs, setNotifPrefs] = useState({ likes: true, comments: true, replies: true, mentions: true, follows: true });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [history, setHistory] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      postsApi.getMyPosts().catch(() => []),
      communitiesApi.getMyCommunities().catch(() => []),
      readingHistoryApi.getHistory().catch(() => []),
      userApi.getMyInterests().catch(() => []),
    ]).then(([p, c, h, i]) => {
      setPosts(p);
      setCommunities(c);
      setHistory(h);
      setInterests(i);
      setLoading(false);
    });
  }, []);

  const removeHistory = useCallback((postId) => {
    readingHistoryApi.removeFromHistory(postId).catch(() => {});
    setHistory((prev) => prev.filter((h) => h.post_id !== postId));
  }, []);

  const totalViews = posts.reduce((s, p) => s + (p.view_count || 0), 0);
  const totalKarma = posts.reduce((s, p) => s + (p.like_count || 0), 0);

  const kpis = [
    { label: "Total views", value: fmt(totalViews), icon: "👁️", color: "text-blue-600 bg-blue-50" },
    { label: "Karma points", value: fmt(totalKarma), icon: "⚡", color: "text-amber-600 bg-amber-50" },
    { label: "Posts published", value: String(posts.length), icon: "📝", color: "text-emerald-600 bg-emerald-50" },
    { label: "Communities", value: String(communities.length), icon: "🌐", color: "text-purple-600 bg-purple-50" },
  ];

  const sidebarItems = [
    { key: "overview", label: "Overview", icon: "⚡" },
    { key: "posts", label: "My Posts", icon: "📝" },
    { key: "history", label: "Reading History", icon: "📚" },
    { key: "communities", label: "My Communities", icon: "🌐" },
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
              <div className="avatar h-10 w-10 text-sm">{(user?.full_name?.[0] || user?.username?.[0] || "U").toUpperCase()}</div>
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
                    {kpis.map((k) => (
                      <Card key={k.label}>
                        <div className={`mb-2 inline-flex rounded-lg p-2 ${k.color}`}>{k.icon}</div>
                        <p className="text-2xl font-bold text-[#1a1814] font-display">{loading ? "—" : k.value}</p>
                        <p className="text-xs text-[#a09880]">{k.label}</p>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Recent posts</p>
                    {loading ? (
                      <p className="text-sm text-[#a09880]">Loading…</p>
                    ) : posts.length === 0 ? (
                      <p className="text-sm text-[#a09880]">No posts yet. <Link to="/create-post" className="text-[#e85d26] hover:underline">Write your first post →</Link></p>
                    ) : (
                      <div className="space-y-3">
                        {posts.slice(0, 3).map((p) => (
                          <div key={p.id} className="flex items-center gap-3 py-2 border-b border-[rgba(90,80,60,0.07)] last:border-0">
                            <div className="flex-1 min-w-0">
                              <Link to={`/blog/${p.slug}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] truncate block">{p.title}</Link>
                              <p className="text-xs text-[#a09880] mt-0.5">▲ {p.like_count} · 💬 {p.comment_count} · {timeAgo(p.created_at)}</p>
                            </div>
                            <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700">published</span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    {loading ? (
                      <p className="text-sm text-[#a09880]">Loading…</p>
                    ) : posts.length === 0 ? (
                      <p className="text-sm text-[#a09880]">No posts yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {posts.map((p) => (
                          <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)] hover:border-[rgba(232,93,38,0.2)] transition-all">
                            <div className="flex-1 min-w-0">
                              <Link to={`/blog/${p.slug}`} className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] leading-snug block">{p.title}</Link>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-[#a09880]">
                                <span>▲ {p.like_count}</span>
                                <span>💬 {p.comment_count}</span>
                                <span>👁️ {p.view_count}</span>
                                <span>{timeAgo(p.created_at)}</span>
                              </div>
                            </div>
                            <span className="shrink-0 text-xs font-semibold rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700">published</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* ── Reading History ── */}
              {section === "history" && (
                <motion.div key="history" {...fadeProps}>
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Reading History</p>
                      {history.length > 0 && (
                        <button onClick={() => {
                          history.forEach((h) => readingHistoryApi.removeFromHistory(h.post_id).catch(() => {}));
                          setHistory([]);
                        }} className="text-xs text-red-500 hover:underline">Clear all</button>
                      )}
                    </div>
                    {loading ? (
                      <p className="text-sm text-[#a09880]">Loading…</p>
                    ) : history.length === 0 ? (
                      <p className="text-sm text-[#a09880]">No reading history yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {history.map((h, i) => (
                          <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)]">
                            <div className="h-8 w-8 rounded-lg bg-[rgba(90,80,60,0.06)] flex items-center justify-center text-sm font-bold text-[#a09880] shrink-0">{i + 1}</div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/blog/${h.post_slug || h.post_id}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors line-clamp-1">
                                {h.post_title || `Post #${h.post_id}`}
                              </Link>
                              <p className="text-xs text-[#a09880] mt-0.5">
                                {h.author_name ? `@${h.author_name} · ` : ""}
                                {h.duration_seconds ? `${Math.round(h.duration_seconds / 60)} min read · ` : ""}
                                {timeAgo(h.created_at)}
                              </p>
                            </div>
                            <button onClick={() => removeHistory(h.post_id)} className="text-[#a09880] hover:text-red-500 transition-colors p-1 shrink-0">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                    {loading ? (
                      <p className="text-sm text-[#a09880]">Loading…</p>
                    ) : communities.length === 0 ? (
                      <p className="text-sm text-[#a09880]">You haven't joined any communities yet. <Link to="/communities" className="text-[#e85d26] hover:underline">Browse communities →</Link></p>
                    ) : (
                      <div className="space-y-2">
                        {communities.map((c) => (
                          <Link key={c.slug} to={`/communities/${c.slug}`} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)] hover:border-[rgba(232,93,38,0.2)] transition-all group">
                            {c.icon_url
                              ? <img src={c.icon_url} className="h-8 w-8 rounded-lg object-cover" alt={c.name} />
                              : <div className="h-8 w-8 rounded-lg bg-[rgba(90,80,60,0.08)] flex items-center justify-center text-base">🌐</div>
                            }
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1a1814] group-hover:text-[#e85d26] transition-colors">{c.name}</p>
                              <p className="text-xs text-[#a09880]">{c.members_count?.toLocaleString()} members</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* ── Topic Interests ── */}
              {section === "interests" && (
                <motion.div key="interests" {...fadeProps}>
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Topic Interests</p>
                    <p className="text-xs text-[#a09880] mb-4">Tags you've interacted with, ranked by interest score.</p>
                    {loading ? (
                      <p className="text-sm text-[#a09880]">Loading…</p>
                    ) : interests.length === 0 ? (
                      <p className="text-sm text-[#a09880]">No interests tracked yet. Read and like posts to build your profile.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {interests.map((t) => (
                          <span key={t} className="tag-pill active">{t}</span>
                        ))}
                      </div>
                    )}
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
                  <Card>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-4">Data & Tracking</p>
                    <div className="mt-2 flex gap-3 flex-wrap">
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
