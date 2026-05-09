import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../services/api";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const ALL_USERS = [
  { id: 1, name: "gaurav_dev", email: "gaurav@example.com", role: "member", status: "active", posts: 34, joined: "Jan 2026", sessions: 2 },
  { id: 2, name: "priya_arch", email: "priya@example.com", role: "admin", status: "active", posts: 89, joined: "Dec 2025", sessions: 1 },
  { id: 3, name: "spam_user123", email: "spam@example.com", role: "member", status: "banned", posts: 2, joined: "May 2026", sessions: 0 },
  { id: 4, name: "alex_ops", email: "alex@example.com", role: "moderator", status: "active", posts: 45, joined: "Feb 2026", sessions: 3 },
  { id: 5, name: "sara_prod", email: "sara@example.com", role: "member", status: "active", posts: 67, joined: "Mar 2026", sessions: 1 },
];

const AUDIT_LOG = [
  { id: 1, action: "Global ban", admin: "super_admin", target: "spam_user123", detail: "Repeated spam violations", time: "2h ago", level: "danger" },
  { id: 2, action: "Role promoted", admin: "super_admin", target: "priya_arch → admin", detail: "Appointed community admin", time: "1d ago", level: "info" },
  { id: 3, action: "Feature flag toggled", admin: "super_admin", target: "ai_summarizer", detail: "Enabled for all users", time: "2d ago", level: "success" },
  { id: 4, action: "Community deleted", admin: "super_admin", target: "#test-community", detail: "Unused community cleanup", time: "3d ago", level: "danger" },
];

const ACTIVE_SESSIONS = [
  { user: "gaurav_dev", device: "Chrome / macOS", ip: "192.168.1.x", time: "Active now" },
  { user: "priya_arch", device: "Firefox / Windows", ip: "10.0.0.x", time: "3m ago" },
  { user: "alex_ops", device: "Safari / iPhone", ip: "172.16.x.x", time: "12m ago" },
];

const FEATURE_FLAGS = [
  { key: "ai_feed", label: "AI Personalized Feed", enabled: true },
  { key: "ai_summary", label: "AI Answer Summary", enabled: true },
  { key: "ai_enhance", label: "Post Enhance Button", enabled: false },
  { key: "ai_autotag", label: "Auto Tag Suggestions", enabled: true },
  { key: "polls", label: "Post Polls", enabled: false },
  { key: "rich_editor", label: "Rich Text Editor", enabled: true },
];

export default function SuperAdminDashboard() {
  const [section, setSection] = useState("overview");
  const [maintenance, setMaintenance] = useState(false);
  const [flags, setFlags] = useState(FEATURE_FLAGS.reduce((acc, f) => ({ ...acc, [f.key]: f.enabled }), {}));
  const [banModal, setBanModal] = useState(null);
  const [hardDeleteModal, setHardDeleteModal] = useState(null);
  const [hardDeleteText, setHardDeleteText] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementColor, setAnnouncementColor] = useState("#e85d26");
  const [banner, setBanner] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [aiPrompts, setAiPrompts] = useState({
    feed: "Score this post based on relevance to user interests: {topics}. Return a float 0-1.",
    summary: "Summarize the top answers to this question in 2-3 sentences.",
    toxicity: "Analyze this content for toxicity. Return JSON: { score: 0-1, flagged: bool }",
  });

  const [onboardingCategories, setOnboardingCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionPage, setNewQuestionPage] = useState(2);

  useEffect(() => {
    if (section === "onboarding") {
      apiClient.getOnboardingData()
        .then(data => setOnboardingCategories(data?.categories || []))
        .catch(console.error);
    }
  }, [section]);

  const loadQuestions = async (topicId) => {
    try {
      const data = await apiClient.getQuestionsByTopic(topicId);
      setTopicQuestions(data);
    } catch (e) { console.error(e); }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    loadQuestions(topic.id);
  };

  const handleCreateQuestion = async () => {
    if (!selectedTopic || !newQuestionText) return;
    try {
      await apiClient.createQuestion({
        topic_id: selectedTopic.id,
        question: newQuestionText,
        page: parseInt(newQuestionPage) || 2
      });
      setNewQuestionText("");
      loadQuestions(selectedTopic.id);
    } catch (e) { console.error(e); }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm("Delete this question?")) return;
    try {
      await apiClient.deleteQuestion(qId);
      loadQuestions(selectedTopic.id);
    } catch (e) { console.error(e); }
  };

  const navItems = [
    { key: "overview", label: "Platform Overview", icon: "📊" },
    { key: "users", label: "All Users", icon: "👥" },
    { key: "content", label: "All Content", icon: "📝" },
    { key: "ai", label: "AI Monitor", icon: "🤖" },
    { key: "config", label: "Site Config", icon: "⚙️" },
    { key: "onboarding", label: "Onboarding Config", icon: "🚀" },
    { key: "sessions", label: "Active Sessions", icon: "🔐" },
    { key: "audit", label: "Audit Log", icon: "📋" },
    { key: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  const filteredUsers = ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="py-8">
      {/* Banner */}
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
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {[
                      { label: "Total users", value: "4,821", icon: "👥", color: "text-blue-600 bg-blue-50" },
                      { label: "DAU", value: "1,240", icon: "📈", color: "text-emerald-600 bg-emerald-50" },
                      { label: "Posts today", value: "89", icon: "📝", color: "text-purple-600 bg-purple-50" },
                      { label: "Open reports", value: "12", icon: "🚩", color: "text-red-600 bg-red-50" },
                      { label: "AI calls today", value: "3.2K", icon: "🤖", color: "text-amber-600 bg-amber-50" },
                    ].map((s) => (
                      <div key={s.label} className="surface rounded-2xl p-4">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg mb-3 ${s.color}`}>{s.icon}</div>
                        <p className="font-display text-2xl font-bold text-[#1a1814]">{s.value}</p>
                        <p className="text-xs text-[#6b6358] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Growth analytics — Signups/day</h3>
                    <div className="flex items-end gap-1 h-32 mb-2">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div key={i} style={{ height: `${Math.random() * 85 + 8}%` }} className="flex-1 rounded-sm bg-[#2563eb]/50 hover:bg-[#2563eb] transition-colors cursor-pointer" />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-[#a09880]"><span>30 days ago</span><span>Today</span></div>
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Live activity feed</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[
                        { icon: "👤", text: "sara_new signed up", time: "just now" },
                        { icon: "📝", text: "gaurav_dev published a post", time: "1m ago" },
                        { icon: "🚩", text: "New report filed on post #4821", time: "3m ago" },
                        { icon: "🤖", text: "AI toxicity scan flagged content", time: "5m ago" },
                        { icon: "👤", text: "user_x456 signed up", time: "7m ago" },
                      ].map((e, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                          <span>{e.icon}</span>
                          <span className="flex-1 text-[#1a1814]">{e.text}</span>
                          <span className="text-xs text-[#a09880]">{e.time}</span>
                        </div>
                      ))}
                    </div>
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead>
                        <tr className="border-b border-[rgba(90,80,60,0.1)]">
                          {["User", "Role", "Status", "Posts", "Sessions", "Actions"].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#a09880]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-[rgba(90,80,60,0.05)] hover:bg-[rgba(90,80,60,0.02)] transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="avatar h-7 w-7 text-xs">{u.name[0].toUpperCase()}</div>
                                <div>
                                  <p className="font-semibold text-[#1a1814]">@{u.name}</p>
                                  <p className="text-xs text-[#a09880]">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <Badge tone={u.role === "admin" || u.role === "moderator" ? "warning" : "neutral"}>{u.role}</Badge>
                            </td>
                            <td className="py-3 px-3">
                              <Badge tone={u.status === "active" ? "success" : "danger"} dot>{u.status}</Badge>
                            </td>
                            <td className="py-3 px-3 text-[#6b6358]">{u.posts}</td>
                            <td className="py-3 px-3 text-[#6b6358]">{u.sessions} active</td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1 flex-wrap">
                                <Button size="sm" variant="ghost" className="text-xs px-2" onClick={() => setRoleModal(u)}>Role</Button>
                                <Button size="sm" variant="ghost" className="text-xs px-2">View as</Button>
                                <Button size="sm" variant="ghost" className="text-xs px-2 text-red-600" onClick={() => setBanModal(u.name)}>Ban</Button>
                                <Button size="sm" variant="ghost" className="text-xs px-2">Force reset</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI MONITOR */}
              {section === "ai" && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[{ label: "Tokens used today", value: "124K / 500K", pct: 24 }, { label: "AI calls this week", value: "22.4K", pct: 68 }, { label: "Flagged by AI today", value: "14 items", pct: null }].map((s) => (
                      <div key={s.label} className="surface rounded-2xl p-4">
                        <p className="font-display text-xl font-bold text-[#1a1814]">{s.value}</p>
                        <p className="text-xs text-[#6b6358] mt-0.5">{s.label}</p>
                        {s.pct !== null && (
                          <div className="progress-bar mt-3"><div className="progress-fill" style={{ width: `${s.pct}%` }} /></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">AI Prompt Configuration</h3>
                    <p className="text-xs text-[#a09880] mb-4">Edit AI system prompts live — changes take effect immediately.</p>
                    <div className="space-y-4">
                      {Object.entries(aiPrompts).map(([key, val]) => (
                        <div key={key}>
                          <label className="text-sm font-semibold text-[#1a1814] block mb-1.5 capitalize">{key} prompt</label>
                          <textarea className="input-field min-h-20 resize-y text-xs font-mono" value={val}
                            onChange={e => setAiPrompts(p => ({ ...p, [key]: e.target.value }))} />
                        </div>
                      ))}
                      <Button>Save AI prompts</Button>
                    </div>
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Feature Flags</h3>
                    <div className="space-y-3">
                      {FEATURE_FLAGS.map((f) => (
                        <div key={f.key} className="flex items-center justify-between py-2 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                          <span className="text-sm text-[#1a1814]">{f.label}</span>
                          <button onClick={() => setFlags(p => ({ ...p, [f.key]: !p[f.key] }))}
                            className={`relative h-5 w-9 rounded-full transition-colors ${flags[f.key] ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.15)]"}`}>
                            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${flags[f.key] ? "translate-x-4" : "translate-x-0.5"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONFIG */}
              {section === "config" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl p-5">
                    <h2 className="font-display text-xl font-bold text-[#1a1814] mb-5">Site Settings</h2>
                    <div className="space-y-4">
                      <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Site name</label><input className="input-field" defaultValue="Nexos" /></div>
                      <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Meta description</label><textarea className="input-field min-h-16 resize-none" defaultValue="A modern knowledge-sharing platform..." /></div>
                    </div>
                    <Button className="mt-4">Save site settings</Button>
                  </div>
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
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Rate Limit Config</h3>
                    <div className="space-y-3">
                      {[{ label: "Posts per day (member)", default: 10 }, { label: "Comments per day", default: 50 }, { label: "AI calls per day", default: 20 }].map((r) => (
                        <div key={r.label} className="flex items-center justify-between">
                          <span className="text-sm text-[#1a1814]">{r.label}</span>
                          <input type="number" defaultValue={r.default} className="input-field w-24 text-center" />
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4" variant="secondary">Save limits</Button>
                  </div>
                </div>
              )}

              {/* ONBOARDING CONFIG */}
              {section === "onboarding" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl p-5">
                    <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">Onboarding Configuration</h2>
                    <p className="text-sm text-[#6b6358] mb-5">Configure user preferences categories and dynamic questions to display based on topic selection.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Topics Selection */}
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        <h3 className="font-semibold text-sm text-[#1a1814]">1. Select a Topic</h3>
                        {onboardingCategories.map(cat => (
                          <div key={cat.id} className="mb-4">
                            <h4 className="text-xs font-bold text-[#a09880] uppercase tracking-wider mb-2">{cat.name}</h4>
                            <div className="space-y-1">
                              {cat.topics.map(topic => (
                                <button
                                  key={topic.id}
                                  onClick={() => handleSelectTopic(topic)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTopic?.id === topic.id ? 'bg-[#e85d26] text-white' : 'hover:bg-[rgba(90,80,60,0.05)] text-[#1a1814]'}`}
                                >
                                  {topic.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Questions Management */}
                      <div className="surface bg-[#faf9f7] rounded-xl p-4 border border-[rgba(90,80,60,0.08)]">
                        <h3 className="font-semibold text-sm text-[#1a1814] mb-3">
                          {selectedTopic ? `2. Questions for "${selectedTopic.name}"` : "2. Select a topic to manage questions"}
                        </h3>
                        
                        {selectedTopic && (
                          <>
                            <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto">
                              {topicQuestions.length === 0 ? (
                                <p className="text-sm text-[#a09880] italic">No questions added yet.</p>
                              ) : (
                                topicQuestions.map(q => (
                                  <div key={q.id} className="bg-white p-3 rounded-lg shadow-sm text-sm flex justify-between gap-3 border border-[rgba(90,80,60,0.08)]">
                                    <div className="min-w-0">
                                      <p className="text-[#1a1814] mb-1 leading-snug">{q.question}</p>
                                      <p className="text-xs text-[#a09880]">Targeting step page {q.page || 2}</p>
                                    </div>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:text-red-700 text-xs shrink-0 self-start">
                                      Delete
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            <div className="pt-4 border-t border-[rgba(90,80,60,0.08)]">
                              <h4 className="text-xs font-semibold text-[#1a1814] mb-2">Add New Question</h4>
                              <div className="space-y-2">
                                <textarea
                                  className="input-field min-h-[60px] text-sm"
                                  placeholder="e.g. What is your primary language for Backend dev?"
                                  value={newQuestionText}
                                  onChange={e => setNewQuestionText(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    className="input-field w-20 text-sm"
                                    placeholder="Page"
                                    min="2"
                                    max="4"
                                    value={newQuestionPage}
                                    onChange={e => setNewQuestionPage(e.target.value)}
                                  />
                                  <Button onClick={handleCreateQuestion} disabled={!newQuestionText} className="flex-1">Add Question</Button>
                                </div>
                                <p className="text-[10px] text-[#a09880]">Page 2 = Goals, Page 3 = Experience, Page 4 = Extras</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SESSIONS */}
              {section === "sessions" && (
                <div className="surface rounded-2xl p-5">
                  <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">Active Sessions</h2>
                  <p className="text-sm text-[#6b6358] mb-4">All currently logged-in users across the platform.</p>
                  <div className="space-y-3">
                    {ACTIVE_SESSIONS.map((s, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          <div>
                            <p className="font-semibold text-sm text-[#1a1814]">@{s.user}</p>
                            <p className="text-xs text-[#a09880]">{s.device} · {s.ip}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#a09880]">{s.time}</span>
                          <Button size="sm" variant="ghost" className="text-red-600 text-xs">Force logout</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[rgba(90,80,60,0.08)]">
                    <Button variant="danger" size="sm">Force logout all sessions</Button>
                  </div>
                </div>
              )}

              {/* AUDIT LOG */}
              {section === "audit" && (
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-bold text-[#1a1814]">Full Audit Log</h2>
                    <Button variant="secondary" size="sm">Export CSV</Button>
                  </div>
                  <div className="space-y-2">
                    {AUDIT_LOG.map((log) => (
                      <div key={log.id} className={`flex items-start gap-3 rounded-xl p-3 border ${log.level === "danger" ? "border-red-100 bg-red-50/50" : log.level === "success" ? "border-emerald-100 bg-emerald-50/50" : "border-[rgba(90,80,60,0.08)] bg-[rgba(90,80,60,0.02)]"}`}>
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${log.level === "danger" ? "bg-red-500" : log.level === "success" ? "bg-emerald-500" : "bg-blue-500"}`} />
                        <div className="flex-1">
                          <p className="text-sm text-[#1a1814]"><span className="font-semibold">{log.action}</span> — {log.target}</p>
                          <p className="text-xs text-[#a09880]">By {log.admin} · {log.detail} · {log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DANGER ZONE */}
              {section === "danger" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl border-2 border-red-200 p-5">
                    <h2 className="font-display text-xl font-bold text-red-700 mb-4">⚠️ Danger Zone</h2>
                    <p className="text-sm text-[#6b6358] mb-5">All actions here are irreversible or have significant impact. Proceed with extreme caution.</p>
                    <div className="space-y-3">
                      {[
                        { action: "Flush Cache", desc: "Clears all cached data — may cause brief slowdowns", icon: "🗑️" },
                        { action: "Reset All Sessions", desc: "Force logout all users platform-wide", icon: "🔓" },
                        { action: "Run DB Cleanup", desc: "Remove soft-deleted content and orphaned records", icon: "🧹" },
                        { action: "Rebuild AI Index", desc: "Re-index all posts for AI ranking. Takes ~10 min.", icon: "🤖" },
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
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-1">Global ban @{banModal}</h3>
            <p className="text-sm text-[#6b6358] mb-4">This bans the user from the entire platform. They will receive an email with the reason.</p>
            <div className="space-y-3">
              <textarea className="input-field min-h-20 resize-none" placeholder="Reason for global ban..." />
              <select className="input-field">
                <option>7 days</option><option>30 days</option><option>Permanent</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="danger" className="flex-1">Global ban</Button>
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
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-4">Change role: @{roleModal?.name}</h3>
            <div className="space-y-2">
              {["member", "moderator", "admin", "super_admin"].map((r) => (
                <button key={r} className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] p-3 text-left transition-all ${roleModal.role === r ? "border-[#e85d26] bg-[#fdf0ea]" : "border-[rgba(90,80,60,0.12)] hover:border-[rgba(232,93,38,0.3)]"}`}>
                  <div className={`h-4 w-4 rounded-full border-2 ${roleModal.role === r ? "border-[#e85d26] bg-[#e85d26]" : "border-[rgba(90,80,60,0.25)]"}`} />
                  <span className="text-sm font-medium capitalize text-[#1a1814]">{r.replace("_", " ")}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1">Save role</Button>
              <Button variant="secondary" onClick={() => setRoleModal(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
