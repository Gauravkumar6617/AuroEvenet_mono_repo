import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { apiClientCore } from "../services/api/client";
import { adminQuestionsApi } from "../services/api/adminQuestionsApi";
import { userApi } from "../services/api/userApi";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function SuperAdminDashboard() {
  const [section, setSection] = useState("overview");
  const [maintenance, setMaintenance] = useState(false);
  const [banModal, setBanModal] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementColor, setAnnouncementColor] = useState("#e85d26");
  const [banner, setBanner] = useState(null);
  const [hardDeleteText, setHardDeleteText] = useState("");

  // Real data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Onboarding
  const [onboardingCategories, setOnboardingCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionPage, setNewQuestionPage] = useState(2);

  // Topic interests
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    apiClientCore.request("/api/v1/admin/users/stats", { method: "GET" })
      .then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    if (section === "users" && users.length === 0) {
      setLoadingUsers(true);
      apiClientCore.request("/api/v1/admin/users", { method: "GET" })
        .then(setUsers).catch(() => {}).finally(() => setLoadingUsers(false));
    }
    if (section === "onboarding") {
      apiClientCore.request("/api/v1/onboarding", { method: "GET" })
        .then(d => setOnboardingCategories(d?.categories || [])).catch(() => {});
    }
    if (section === "interests") {
      userApi.getMyInterests().then(setInterests).catch(() => {});
    }
  }, [section]);

  const loadQuestions = (topicId) => {
    adminQuestionsApi.getQuestionsByTopic(topicId).then(setTopicQuestions).catch(() => {});
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    loadQuestions(topic.id);
  };

  const handleCreateQuestion = async () => {
    if (!selectedTopic || !newQuestionText) return;
    await adminQuestionsApi.createQuestion({ topic_id: selectedTopic.id, question: newQuestionText, page: parseInt(newQuestionPage) || 2 });
    setNewQuestionText("");
    loadQuestions(selectedTopic.id);
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm("Delete this question?")) return;
    await adminQuestionsApi.deleteQuestion(qId);
    loadQuestions(selectedTopic.id);
  };

  const handleRoleSave = async () => {
    if (!roleModal || !selectedRole) return;
    await apiClientCore.request(`/api/v1/admin/users/${roleModal.id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role: selectedRole }),
    }).catch(() => {});
    setUsers(prev => prev.map(u => u.id === roleModal.id ? { ...u, role: selectedRole } : u));
    setRoleModal(null);
  };

  const handleBan = async (userId, reason) => {
    await apiClientCore.request(`/api/v1/admin/users/${userId}/ban`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }).catch(() => {});
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: false } : u));
    setBanModal(null);
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const navItems = [
    { key: "overview", label: "Platform Overview", icon: "📊" },
    { key: "users", label: "All Users", icon: "👥" },
    { key: "onboarding", label: "Onboarding Config", icon: "🚀" },
    { key: "config", label: "Site Config", icon: "⚙️" },
    { key: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="py-8">
      {banner && (
        <div style={{ background: announcementColor }} className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-6 py-2.5 text-white text-sm font-medium shadow-lg">
          <span>{banner}</span>
          <button onClick={() => setBanner(null)} className="text-white/70 hover:text-white ml-4">✕</button>
        </div>
      )}
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge tone="danger">Super Admin</Badge>
              <Badge tone="brand">Platform-wide access</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-[#1a1814]">Super Admin Console</h1>
          </div>
          {maintenance && <Badge tone="warning" dot>🔧 Maintenance Mode ON</Badge>}
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <aside className="surface h-fit p-3 rounded-2xl">
            <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-[#a09880] mb-1">Super Admin</p>
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""} ${item.key === "danger" ? "text-red-600 hover:bg-red-50" : ""}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </aside>

          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 min-w-0">

              {/* OVERVIEW */}
              {section === "overview" && (
                <>
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
                </>
              )}

              {/* ALL USERS */}
              {section === "users" && (
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h2 className="font-display text-xl font-bold text-[#1a1814]">All Users</h2>
                    <input className="input-field w-56 text-sm" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  </div>
                  {loadingUsers ? (
                    <p className="text-sm text-[#a09880]">Loading…</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead>
                          <tr className="border-b border-[rgba(90,80,60,0.1)]">
                            {["User", "Role", "Status", "Posts", "Comments", "Joined", "Actions"].map((h) => (
                              <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#a09880]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="border-b border-[rgba(90,80,60,0.05)] hover:bg-[rgba(90,80,60,0.02)] transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="avatar h-7 w-7 text-xs">{(u.username || "U")[0].toUpperCase()}</div>
                                  <div>
                                    <p className="font-semibold text-[#1a1814]">@{u.username}</p>
                                    <p className="text-xs text-[#a09880]">{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <Badge tone={u.role === "super_admin" ? "danger" : u.role === "admin" ? "warning" : "neutral"}>{u.role}</Badge>
                              </td>
                              <td className="py-3 px-3">
                                <Badge tone={u.is_active ? "success" : "danger"} dot>{u.is_active ? "active" : "banned"}</Badge>
                              </td>
                              <td className="py-3 px-3 text-[#6b6358]">{u.stats?.post_count ?? 0}</td>
                              <td className="py-3 px-3 text-[#6b6358]">{u.stats?.comment_count ?? 0}</td>
                              <td className="py-3 px-3 text-xs text-[#a09880]">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                              <td className="py-3 px-3">
                                <div className="flex gap-1 flex-wrap">
                                  <Button size="sm" variant="ghost" className="text-xs px-2" onClick={() => { setRoleModal(u); setSelectedRole(u.role); }}>Role</Button>
                                  {u.is_active && <Button size="sm" variant="ghost" className="text-xs px-2 text-red-600" onClick={() => setBanModal(u)}>Ban</Button>}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ONBOARDING CONFIG */}
              {section === "onboarding" && (
                <div className="surface rounded-2xl p-5">
                  <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">Onboarding Configuration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      <h3 className="font-semibold text-sm text-[#1a1814]">1. Select a Topic</h3>
                      {onboardingCategories.map(cat => (
                        <div key={cat.id} className="mb-4">
                          <h4 className="text-xs font-bold text-[#a09880] uppercase tracking-wider mb-2">{cat.name}</h4>
                          <div className="space-y-1">
                            {cat.topics.map(topic => (
                              <button key={topic.id} onClick={() => handleSelectTopic(topic)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTopic?.id === topic.id ? "bg-[#e85d26] text-white" : "hover:bg-[rgba(90,80,60,0.05)] text-[#1a1814]"}`}>
                                {topic.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="surface bg-[#faf9f7] rounded-xl p-4 border border-[rgba(90,80,60,0.08)]">
                      <h3 className="font-semibold text-sm text-[#1a1814] mb-3">
                        {selectedTopic ? `2. Questions for "${selectedTopic.name}"` : "2. Select a topic to manage questions"}
                      </h3>
                      {selectedTopic && (
                        <>
                          <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto">
                            {topicQuestions.length === 0 ? (
                              <p className="text-sm text-[#a09880] italic">No questions added yet.</p>
                            ) : topicQuestions.map(q => (
                              <div key={q.id} className="bg-white p-3 rounded-lg shadow-sm text-sm flex justify-between gap-3 border border-[rgba(90,80,60,0.08)]">
                                <div className="min-w-0">
                                  <p className="text-[#1a1814] mb-1 leading-snug">{q.question}</p>
                                  <p className="text-xs text-[#a09880]">Page {q.page || 2}</p>
                                </div>
                                <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:text-red-700 text-xs shrink-0 self-start">Delete</button>
                              </div>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-[rgba(90,80,60,0.08)]">
                            <h4 className="text-xs font-semibold text-[#1a1814] mb-2">Add New Question</h4>
                            <div className="space-y-2">
                              <textarea className="input-field min-h-[60px] text-sm" placeholder="e.g. What is your primary language?" value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)} />
                              <div className="flex gap-2">
                                <input type="number" className="input-field w-20 text-sm" placeholder="Page" min="2" max="4" value={newQuestionPage} onChange={e => setNewQuestionPage(e.target.value)} />
                                <Button onClick={handleCreateQuestion} disabled={!newQuestionText} className="flex-1">Add Question</Button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SITE CONFIG */}
              {section === "config" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Announcement Banner</h3>
                    <div className="space-y-3">
                      <input className="input-field" placeholder="Banner message..." value={announcementText} onChange={e => setAnnouncementText(e.target.value)} />
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-[#6b6358]">Color:</label>
                        {["#e85d26", "#2563eb", "#16a34a", "#d97706"].map(c => (
                          <button key={c} onClick={() => setAnnouncementColor(c)}
                            style={{ background: c }} className={`h-6 w-6 rounded-full border-2 transition-all ${announcementColor === c ? "border-[#1a1814] scale-110" : "border-transparent"}`} />
                        ))}
                      </div>
                      <Button variant="secondary" onClick={() => setBanner(announcementText)} disabled={!announcementText}>Publish banner</Button>
                    </div>
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Maintenance Mode</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#1a1814]">Restrict access to non-admin users</p>
                        <p className="text-xs text-[#a09880]">Shows maintenance page to regular users</p>
                      </div>
                      <Button variant={maintenance ? "danger" : "secondary"} size="sm" onClick={() => setMaintenance(!maintenance)}>
                        {maintenance ? "Disable" : "Enable"} maintenance
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* DANGER ZONE */}
              {section === "danger" && (
                <div className="surface rounded-2xl border-2 border-red-200 p-5">
                  <h2 className="font-display text-xl font-bold text-red-700 mb-4">⚠️ Danger Zone</h2>
                  <p className="text-sm text-[#6b6358] mb-5">All actions here are irreversible. Proceed with extreme caution.</p>
                  <div className="space-y-3">
                    {[
                      { action: "Flush Cache", desc: "Clears all cached data — may cause brief slowdowns", icon: "🗑️" },
                      { action: "Reset All Sessions", desc: "Force logout all users platform-wide", icon: "🔓" },
                      { action: "Run DB Cleanup", desc: "Remove soft-deleted content and orphaned records", icon: "🧹" },
                    ].map((item) => (
                      <div key={item.action} className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/30 p-4">
                        <div>
                          <p className="font-semibold text-sm text-[#1a1814]">{item.icon} {item.action}</p>
                          <p className="text-xs text-[#a09880]">{item.desc}</p>
                        </div>
                        <Button variant="danger" size="sm">{item.action}</Button>
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
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-1">Ban @{banModal.username}</h3>
            <p className="text-sm text-[#6b6358] mb-4">This deactivates the user's account immediately.</p>
            <textarea id="ban-reason" className="input-field min-h-20 resize-none w-full" placeholder="Reason for ban..." />
            <div className="flex gap-3 mt-4">
              <Button variant="danger" className="flex-1" onClick={() => handleBan(banModal.id, document.getElementById("ban-reason").value)}>Confirm ban</Button>
              <Button variant="secondary" onClick={() => setBanModal(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Role modal */}
      {roleModal && (
        <div className="modal-overlay" onClick={() => setRoleModal(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="surface rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-4">Change role: @{roleModal?.username}</h3>
            <div className="space-y-2">
              {["user", "admin", "super_admin"].map((r) => (
                <button key={r} onClick={() => setSelectedRole(r)}
                  className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] p-3 text-left transition-all ${selectedRole === r ? "border-[#e85d26] bg-[#fdf0ea]" : "border-[rgba(90,80,60,0.12)] hover:border-[rgba(232,93,38,0.3)]"}`}>
                  <div className={`h-4 w-4 rounded-full border-2 ${selectedRole === r ? "border-[#e85d26] bg-[#e85d26]" : "border-[rgba(90,80,60,0.25)]"}`} />
                  <span className="text-sm font-medium capitalize text-[#1a1814]">{r.replace("_", " ")}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1" onClick={handleRoleSave}>Save role</Button>
              <Button variant="secondary" onClick={() => setRoleModal(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
