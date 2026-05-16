import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { apiClientCore } from "../services/api/client";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [section, setSection] = useState("overview");
  const [memberSearch, setMemberSearch] = useState("");

  // Real data
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Modals
  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    apiClientCore.request("/api/v1/admin/users/stats", { method: "GET" })
      .then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    if (section === "members" && members.length === 0) {
      setLoadingMembers(true);
      apiClientCore.request("/api/v1/admin/users", { method: "GET" })
        .then(setMembers).catch(() => {}).finally(() => setLoadingMembers(false));
    }
    if (section === "content" && posts.length === 0) {
      setLoadingPosts(true);
      apiClientCore.request("/api/v1/posts/?skip=0&limit=50", { method: "GET" }, false, null, false, false)
        .then((data) => setPosts(Array.isArray(data) ? data : [])).catch(() => {}).finally(() => setLoadingPosts(false));
    }
  }, [section]);

  const handleBan = async (userId) => {
    await apiClientCore.request(`/api/v1/admin/users/${userId}/ban`, { method: "PUT" }).catch(() => {});
    setMembers((prev) => prev.map((m) => m.id === userId ? { ...m, is_active: false } : m));
    setBanModal(null);
    showToast("User banned", "success");
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Delete this post?")) return;
    await apiClientCore.request(`/api/v1/posts/${postId}`, { method: "DELETE" }).catch(() => {});
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast("Post deleted", "success");
  };

  const filteredMembers = members.filter((m) =>
    m.username?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const navItems = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "members", label: "Members", icon: "👥" },
    { key: "content", label: "All Posts", icon: "📝" },
    { key: "preferences", label: "User Preferences", icon: "🎯" },
  ];

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Badge tone="warning">Admin Panel</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#1a1814]">Admin Dashboard</h1>
          <p className="text-sm text-[#6b6358] mt-1">Manage users, content, and platform settings.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <aside className="surface h-fit p-3 rounded-2xl">
            <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-[#a09880] mb-1">Admin</p>
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""}`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </button>
            ))}
          </aside>

          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 min-w-0">

              {/* OVERVIEW */}
              {section === "overview" && (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Total users", value: stats?.total_users ?? "—", icon: "👥", color: "text-blue-600 bg-blue-50" },
                    { label: "Total posts", value: stats?.total_posts ?? "—", icon: "📝", color: "text-emerald-600 bg-emerald-50" },
                    { label: "Total comments", value: stats?.total_comments ?? "—", icon: "💬", color: "text-purple-600 bg-purple-50" },
                    { label: "Communities", value: stats?.total_communities ?? "—", icon: "🌐", color: "text-amber-600 bg-amber-50" },
                  ].map((s) => (
                    <div key={s.label} className="surface rounded-2xl p-4">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg mb-3 ${s.color}`}>{s.icon}</div>
                      <p className="font-display text-2xl font-bold text-[#1a1814]">{s.value}</p>
                      <p className="text-xs text-[#6b6358] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* MEMBERS */}
              {section === "members" && (
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h2 className="font-display text-xl font-bold text-[#1a1814]">All Members</h2>
                    <input className="input-field w-56 text-sm" placeholder="Search members..."
                      value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} />
                  </div>
                  {loadingMembers ? <p className="text-sm text-[#a09880]">Loading…</p> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[560px]">
                        <thead>
                          <tr className="border-b border-[rgba(90,80,60,0.1)]">
                            {["User", "Role", "Status", "Posts", "Comments", "Joined", "Actions"].map((h) => (
                              <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#a09880]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((m) => (
                            <tr key={m.id} className="border-b border-[rgba(90,80,60,0.05)] hover:bg-[rgba(90,80,60,0.02)]">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="avatar h-7 w-7 text-xs">{(m.username || "U")[0].toUpperCase()}</div>
                                  <div>
                                    <Link to={`/u/${m.username}`} className="font-semibold text-[#1a1814] hover:text-[#e85d26]">@{m.username}</Link>
                                    <p className="text-xs text-[#a09880]">{m.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <Badge tone={m.role === "super_admin" ? "danger" : m.role === "admin" ? "warning" : "neutral"}>{m.role}</Badge>
                              </td>
                              <td className="py-3 px-3">
                                <Badge tone={m.is_active ? "success" : "danger"} dot>{m.is_active ? "active" : "banned"}</Badge>
                              </td>
                              <td className="py-3 px-3 text-[#6b6358]">{m.stats?.post_count ?? 0}</td>
                              <td className="py-3 px-3 text-[#6b6358]">{m.stats?.comment_count ?? 0}</td>
                              <td className="py-3 px-3 text-xs text-[#a09880]">{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</td>
                              <td className="py-3 px-3">
                                {m.is_active && m.role !== "super_admin" && (
                                  <Button size="sm" variant="ghost" className="text-xs px-2 text-red-600"
                                    onClick={() => setBanModal(m)}>Ban</Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ALL POSTS */}
              {section === "content" && (
                <div className="surface rounded-2xl p-5">
                  <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">All Posts</h2>
                  {loadingPosts ? <p className="text-sm text-[#a09880]">Loading…</p> : (
                    <div className="space-y-3">
                      {posts.map((p) => (
                        <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl border border-[rgba(90,80,60,0.08)] hover:border-[rgba(232,93,38,0.2)] transition-all">
                          <div className="flex-1 min-w-0">
                            <Link to={`/blog/${p.slug || p.id}`} className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] line-clamp-1">{p.title}</Link>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[#a09880]">
                              <span>@{p.author_name || "unknown"}</span>
                              <span>▲ {p.like_count || 0}</span>
                              <span>💬 {p.comment_count || 0}</span>
                              <span>👁️ {p.view_count || 0}</span>
                              <span>{timeAgo(p.created_at)}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs text-red-600 shrink-0"
                            onClick={() => handleDeletePost(p.id)}>Delete</Button>
                        </div>
                      ))}
                      {posts.length === 0 && <p className="text-sm text-[#a09880]">No posts found.</p>}
                    </div>
                  )}
                </div>
              )}

              {/* USER PREFERENCES */}
              {section === "preferences" && (
                <UserPreferencesSection />
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </PageContainer>

      {banModal && (
        <div className="modal-overlay" onClick={() => setBanModal(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="surface rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-1">Ban @{banModal.username}</h3>
            <p className="text-sm text-[#6b6358] mb-4">This deactivates the user's account immediately.</p>
            <textarea value={banReason} onChange={(e) => setBanReason(e.target.value)}
              className="input-field min-h-20 resize-none w-full" placeholder="Reason for ban..." />
            <div className="flex gap-3 mt-4">
              <Button variant="danger" className="flex-1" onClick={() => handleBan(banModal.id)}>Confirm ban</Button>
              <Button variant="secondary" onClick={() => setBanModal(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function UserPreferencesSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClientCore.request("/api/v1/admin/users/preferences", { method: "GET" })
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((u) =>
    u.user.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold text-[#1a1814]">User Preferences & Interests</h2>
        <input className="input-field w-56 text-sm" placeholder="Search users..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? <p className="text-sm text-[#a09880]">Loading…</p> : (
        <div className="space-y-4">
          {filtered.map((u) => (
            <div key={u.user.id} className="rounded-xl border border-[rgba(90,80,60,0.08)] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="avatar h-8 w-8 text-xs">{(u.user.username || "U")[0].toUpperCase()}</div>
                <div>
                  <p className="text-sm font-bold text-[#1a1814]">@{u.user.username}</p>
                  <p className="text-xs text-[#a09880]">{u.user.email}</p>
                </div>
                <div className="ml-auto flex gap-2 text-xs text-[#a09880]">
                  <span>{u.summary.topic_count} topics</span>
                  <span>{u.summary.interest_count} interests</span>
                </div>
              </div>
              {u.selected_topics.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-[#a09880] mb-1">Topics</p>
                  <div className="flex flex-wrap gap-1">
                    {u.selected_topics.map((t) => <span key={t.id} className="tag-pill text-xs">{t.name}</span>)}
                  </div>
                </div>
              )}
              {u.interests.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#a09880] mb-1">Interests (by score)</p>
                  <div className="flex flex-wrap gap-1">
                    {u.interests.map((i) => (
                      <span key={i.name} className="inline-flex items-center gap-1 tag-pill text-xs">
                        {i.name} <span className="text-[#e85d26] font-bold">{i.score}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-[#a09880]">No users found.</p>}
        </div>
      )}
    </div>
  );
}
