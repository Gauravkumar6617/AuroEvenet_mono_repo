import { useState } from "react";
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

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [postTab, setPostTab] = useState("Recent");
  const [notifFilter, setNotifFilter] = useState("All");
  const [notifPrefs, setNotifPrefs] = useState({ likes: true, comments: true, replies: true, mentions: true, follows: true, emailDigest: "weekly" });
  const [selectedTopics, setSelectedTopics] = useState(["Engineering", "Frontend", "AI & ML"]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const toggleTopic = (t) => setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const sidebarItems = [
    { key: "overview", label: "Overview", icon: "⚡" },
    { key: "posts", label: "My Posts", icon: "📝" },
    { key: "saved", label: "Saved Posts", icon: "🔖" },
    { key: "notifications", label: "Notifications", icon: "🔔", count: NOTIFS.filter(n => n.unread).length },
    { key: "interests", label: "Topic Interests", icon: "🎯" },
    { key: "settings", label: "Account Settings", icon: "⚙️" },
    { key: "privacy", label: "Privacy", icon: "🔒" },
  ];

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#1a1814]">
              Hey, {user?.username || "there"} 👋
            </h1>
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
            {sidebarItems.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""}`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="rounded-full bg-[#e85d26] text-white text-xs px-1.5 py-0.5 font-bold">{item.count}</span>
                )}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="space-y-5 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                {/* OVERVIEW */}
                {section === "overview" && (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {KPIS.map((kpi) => (
                        <div key={kpi.label} className="surface rounded-2xl p-4">
                          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg ${kpi.color} mb-3`}>{kpi.icon}</div>
                          <p className="font-display text-2xl font-bold text-[#1a1814]">{kpi.value}</p>
                          <p className="text-xs text-[#6b6358] mt-0.5">{kpi.label}</p>
                          <p className="text-xs text-emerald-600 font-semibold mt-1">{kpi.trend} this week</p>
                        </div>
                      ))}
                    </div>
                    {/* Activity chart placeholder */}
                    <div className="surface rounded-2xl p-5">
                      <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Activity (last 30 days)</h3>
                      <div className="flex items-end gap-1.5 h-24">
                        {Array.from({ length: 30 }, (_, i) => {
                          const h = Math.random() * 80 + 5;
                          return <div key={i} style={{ height: `${h}%` }} className="flex-1 rounded-sm bg-[#e85d26] opacity-60 hover:opacity-100 transition-opacity" title={`Day ${i + 1}`} />;
                        })}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-[#a09880]">
                        <span>30 days ago</span><span>Today</span>
                      </div>
                    </div>
                    {/* Recent activity */}
                    <div className="surface rounded-2xl p-5">
                      <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Recent notifications</h3>
                      <div className="space-y-3">
                        {NOTIFS.slice(0, 3).map((n) => (
                          <div key={n.id} className={`flex items-start gap-3 rounded-xl p-3 ${n.unread ? "bg-[rgba(232,93,38,0.04)] border border-[rgba(232,93,38,0.1)]" : "bg-[rgba(90,80,60,0.03)]"}`}>
                            <span className="text-lg">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#1a1814]">{n.text}</p>
                              {n.sub && <p className="text-xs text-[#a09880] truncate mt-0.5">"{n.sub}"</p>}
                            </div>
                            <span className="text-xs text-[#a09880] shrink-0">{n.time}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSection("notifications")} className="mt-3 text-sm text-[#e85d26] font-semibold hover:underline">View all →</button>
                    </div>
                  </div>
                )}

                {/* MY POSTS */}
                {section === "posts" && (
                  <div className="surface rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-xl font-bold text-[#1a1814]">My Posts</h2>
                      <Link to="/create-post"><Button size="sm">+ Write new</Button></Link>
                    </div>
                    <Tabs items={["Recent", "Top", "Drafts"]} active={postTab} onChange={setPostTab} />
                    <div className="mt-4 space-y-3">
                      {MY_POSTS.filter(p => postTab === "Drafts" ? p.status === "draft" : p.status === "published").map((post) => (
                        <div key={post.id} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-4 hover:border-[rgba(232,93,38,0.2)] transition-all">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge tone={post.status === "draft" ? "warning" : "success"}>{post.status}</Badge>
                              <Badge tone="neutral">{post.type}</Badge>
                            </div>
                            <p className="font-semibold text-sm text-[#1a1814] line-clamp-1">{post.title}</p>
                            {post.status === "published" && (
                              <p className="text-xs text-[#a09880] mt-1">{post.votes} votes · {post.comments} comments · {post.views} views · {post.time}</p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="secondary" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SAVED */}
                {section === "saved" && (
                  <div className="surface rounded-2xl p-5">
                    <h2 className="font-display text-xl font-bold text-[#1a1814] mb-4">Saved Posts</h2>
                    <div className="space-y-3">
                      {SAVED_POSTS.map((post) => (
                        <div key={post.id} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-4">
                          <div>
                            <Link to={`/blog/${post.id}`} className="font-semibold text-sm text-[#1a1814] hover:text-[#e85d26] transition-colors">{post.title}</Link>
                            <p className="text-xs text-[#a09880] mt-1">@{post.author} · {post.votes} votes · {post.time}</p>
                          </div>
                          <button className="text-xs text-[#a09880] hover:text-red-500 transition-colors ml-4">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {section === "notifications" && (
                  <div className="space-y-4">
                    <div className="surface rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl font-bold text-[#1a1814]">Notifications</h2>
                        <button className="text-sm text-[#e85d26] font-semibold hover:underline">Mark all read</button>
                      </div>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {["All", "Likes", "Comments", "Follows", "Mentions"].map((f) => (
                          <button key={f} onClick={() => setNotifFilter(f)} className={`tag-pill ${notifFilter === f ? "active" : ""}`}>{f}</button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {NOTIFS.map((n) => (
                          <div key={n.id} className={`flex items-start gap-3 rounded-xl p-3 border transition-all cursor-pointer hover:border-[rgba(232,93,38,0.2)] ${n.unread ? "bg-[rgba(232,93,38,0.03)] border-[rgba(232,93,38,0.12)]" : "border-[rgba(90,80,60,0.08)] bg-white"}`}>
                            <span className="text-xl">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1a1814]">{n.text}</p>
                              {n.sub && <p className="text-xs text-[#a09880] mt-0.5 truncate">"{n.sub}"</p>}
                              <p className="text-xs text-[#a09880] mt-1">{n.time}</p>
                            </div>
                            {n.unread && <div className="h-2 w-2 rounded-full bg-[#e85d26] mt-1 shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Notification preferences */}
                    <div className="surface rounded-2xl p-5">
                      <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        {Object.entries({ likes: "Likes on my posts", comments: "Comments on my posts", replies: "Replies to my comments", mentions: "@Mentions", follows: "New followers" }).map(([key, label]) => (
                          <div key={key} className="flex items-center justify-between py-2 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                            <span className="text-sm text-[#1a1814]">{label}</span>
                            <button onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                              className={`relative h-5 w-9 rounded-full transition-colors ${notifPrefs[key] ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.15)]"}`}>
                              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifPrefs[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-[#1a1814]">Email digest</span>
                          <select className="input-field w-32 text-xs" value={notifPrefs.emailDigest} onChange={e => setNotifPrefs(p => ({ ...p, emailDigest: e.target.value }))}>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* INTERESTS */}
                {section === "interests" && (
                  <div className="surface rounded-2xl p-5">
                    <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">Topic Interests</h2>
                    <p className="text-sm text-[#6b6358] mb-5">Your selected topics tune the AI-personalized feed. Select at least 2.</p>
                    <div className="flex flex-wrap gap-2.5 mb-6">
                      {TOPICS.map((t) => (
                        <button key={t} onClick={() => toggleTopic(t)} className={`tag-pill text-sm py-1.5 px-4 ${selectedTopics.includes(t) ? "active" : ""}`}>
                          {selectedTopics.includes(t) && "✓ "}{t}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.15)] p-4 mb-4">
                      <p className="text-sm font-semibold text-[#e85d26]">Your current interests ({selectedTopics.length})</p>
                      <p className="text-xs text-[#6b6358] mt-1">{selectedTopics.join(", ") || "None selected"}</p>
                    </div>
                    <Button>Save preferences</Button>
                  </div>
                )}

                {/* SETTINGS */}
                {section === "settings" && (
                  <div className="space-y-4">
                    <div className="surface rounded-2xl p-5">
                      <h2 className="font-display text-xl font-bold text-[#1a1814] mb-5">Edit Profile</h2>
                      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[rgba(90,80,60,0.08)]">
                        <div className="relative">
                          <div className="avatar h-16 w-16 text-xl">{(user?.username || "U")[0].toUpperCase()}</div>
                          <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#e85d26] text-white flex items-center justify-center text-xs hover:bg-[#c44718] transition-colors">✏️</button>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1814]">Profile photo</p>
                          <p className="text-xs text-[#a09880]">JPG, PNG or GIF. Max 2MB. Crop + zoom available after upload.</p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Full name</label>
                          <input className="input-field" defaultValue={user?.full_name || ""} placeholder="Jane Doe" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Username</label>
                          <div className="relative">
                            <input className="input-field pr-8" defaultValue={user?.username || ""} placeholder="janedoe" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Bio</label>
                          <textarea className="input-field min-h-20 resize-none" placeholder="Tell the community about yourself..." />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Website</label>
                          <input className="input-field" placeholder="https://yoursite.com" type="url" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Twitter/X</label>
                          <input className="input-field" placeholder="@handle" />
                        </div>
                      </div>
                      <Button className="mt-5">Save profile</Button>
                    </div>

                    <div className="surface rounded-2xl p-5">
                      <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Change Password</h3>
                      <div className="space-y-3">
                        <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Current password</label><input type="password" className="input-field" placeholder="••••••••" /></div>
                        <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">New password</label><input type="password" className="input-field" placeholder="••••••••" /></div>
                        <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Confirm new password</label><input type="password" className="input-field" placeholder="••••••••" /></div>
                      </div>
                      <Button variant="secondary" className="mt-4">Update password</Button>
                    </div>

                    <div className="surface rounded-2xl border-2 border-red-100 p-5">
                      <h3 className="font-display text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
                      <p className="text-sm text-[#6b6358] mb-4">Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
                      <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>Delete my account</Button>
                    </div>
                  </div>
                )}

                {/* PRIVACY */}
                {section === "privacy" && (
                  <div className="surface rounded-2xl p-5">
                    <h2 className="font-display text-xl font-bold text-[#1a1814] mb-5">Privacy Settings</h2>
                    <div className="space-y-4">
                      {[
                        { label: "Show activity status", desc: "Others can see when you were last active" },
                        { label: "Public profile", desc: "Your profile is visible to non-members" },
                        { label: "Show karma publicly", desc: "Display your karma score on your profile" },
                        { label: "Allow DMs from anyone", desc: "Anyone can send you direct messages" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start justify-between py-3 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                          <div>
                            <p className="text-sm font-semibold text-[#1a1814]">{item.label}</p>
                            <p className="text-xs text-[#a09880] mt-0.5">{item.desc}</p>
                          </div>
                          <button className="relative h-5 w-9 rounded-full bg-[#e85d26] ml-4 shrink-0 mt-0.5">
                            <div className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <h3 className="text-sm font-bold text-[#1a1814] mb-3">Blocked users</h3>
                      <p className="text-sm text-[#a09880]">You haven't blocked anyone yet.</p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </PageContainer>

      {/* Delete account modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="surface rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="font-display text-xl font-bold text-red-700 mb-2">Delete your account?</h3>
            <p className="text-sm text-[#6b6358] mb-4">This will permanently delete all your posts, comments, saved content, and profile data. This cannot be undone.</p>
            <p className="text-sm font-semibold text-[#1a1814] mb-2">Type your username to confirm:</p>
            <input className="input-field mb-4" placeholder={user?.username || "username"} value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} />
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" disabled={deleteConfirmText !== (user?.username || "")}>Delete permanently</Button>
              <Button variant="secondary" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
