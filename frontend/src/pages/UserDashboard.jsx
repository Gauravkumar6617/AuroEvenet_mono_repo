import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Link } from "react-router-dom";

const kpis = [
  { label: "Total views", value: "12.4K", icon: "👁️", change: "+18%", up: true },
  { label: "Answers posted", value: "84", icon: "💬", change: "+5 this week", up: true },
  { label: "Saved posts", value: "27", icon: "🔖", change: "", up: true },
  { label: "Followers", value: "139", icon: "👥", change: "+12", up: true },
];

const MY_POSTS = [
  { id: 1, title: "How to structure FastAPI for scale", type: "article", votes: 82, answers: 19, status: "published", time: "2d ago" },
  { id: 2, title: "Is TypeScript worth it for small teams?", type: "discussion", votes: 44, answers: 12, status: "published", time: "5d ago" },
  { id: 3, title: "Best auth strategy for multi-tenant SaaS", type: "question", votes: 0, answers: 0, status: "draft", time: "1w ago" },
];

const ACTIVITY = [
  { icon: "▲", text: "Your post 'FastAPI architecture' got 12 new upvotes", time: "2h ago" },
  { icon: "💬", text: "priya_arch replied to your answer", time: "5h ago" },
  { icon: "👥", text: "alex_ops started following you", time: "1d ago" },
  { icon: "✅", text: "Your answer was marked as accepted", time: "2d ago" },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [postTab, setPostTab] = useState("Published");
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("Backend engineer & open source enthusiast. Love clean architecture and distributed systems.");
  const [notifPrefs, setNotifPrefs] = useState({ email: true, answers: true, upvotes: false, follows: true });

  const navItems = [
    { key: "overview", label: "Overview", icon: "⚡" },
    { key: "posts", label: "My Posts", icon: "📝" },
    { key: "saved", label: "Saved", icon: "🔖" },
    { key: "activity", label: "Activity", icon: "📊" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Dashboard</p>
            <h1 className="font-display text-3xl font-bold text-[#1a1814]">
              Welcome back, <span className="gradient-text">{user?.username || "User"}</span> 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/create-post"><Button size="sm">+ New Post</Button></Link>
            <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-3">
            <div className="surface rounded-2xl p-4 text-center">
              <div className="avatar h-16 w-16 text-xl mx-auto mb-3">{(user?.username || "U")[0].toUpperCase()}</div>
              <p className="font-display text-base font-bold text-[#1a1814]">@{user?.username || "user"}</p>
              <p className="text-xs text-[#a09880]">{user?.email}</p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-[#6b6358]">
                <div className="text-center"><p className="font-bold text-[#1a1814] text-sm">84</p><p>Posts</p></div>
                <div className="text-center"><p className="font-bold text-[#1a1814] text-sm">139</p><p>Followers</p></div>
                <div className="text-center"><p className="font-bold text-[#1a1814] text-sm">42</p><p>Following</p></div>
              </div>
            </div>
            <div className="surface rounded-2xl p-3">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => setSection(item.key)}
                  className={`sidebar-item ${section === item.key ? "active" : ""}`}>
                  <span>{item.icon}</span><span>{item.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <div className="space-y-4 min-w-0">
            {section === "overview" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {kpis.map((kpi) => (
                    <Card key={kpi.label} className="rounded-2xl">
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{kpi.icon}</span>
                        {kpi.change && <Badge tone={kpi.up ? "success" : "danger"} dot>{kpi.change}</Badge>}
                      </div>
                      <p className="mt-2 font-display text-3xl font-bold text-[#1a1814]">{kpi.value}</p>
                      <p className="text-xs text-[#a09880] mt-0.5">{kpi.label}</p>
                    </Card>
                  ))}
                </div>
                <Card className="rounded-2xl">
                  <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Profile completion</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Basic info", done: true },
                      { label: "Profile photo", done: false },
                      { label: "Bio added", done: true },
                      { label: "First post published", done: true },
                      { label: "5 answers given", done: false },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${step.done ? "bg-[#e85d26] text-white" : "border-2 border-[rgba(90,80,60,0.2)] text-[#a09880]"}`}>
                          {step.done ? "✓" : ""}
                        </div>
                        <span className={`text-sm ${step.done ? "text-[#1a1814]" : "text-[#a09880]"}`}>{step.label}</span>
                        {!step.done && <Badge tone="warning">Incomplete</Badge>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[#6b6358] mb-1"><span>Profile strength</span><span>60%</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: "60%" }} /></div>
                  </div>
                </Card>
                <Card className="rounded-2xl">
                  <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Recent activity</h3>
                  <div className="space-y-3">
                    {ACTIVITY.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-base mt-0.5">{a.icon}</span>
                        <div className="flex-1">
                          <p className="text-[#3a3530]">{a.text}</p>
                          <p className="text-xs text-[#a09880] mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {section === "posts" && (
              <Card className="rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold">My Posts</h3>
                  <Tabs items={["Published", "Drafts", "Top"]} active={postTab} onChange={setPostTab} />
                </div>
                <div className="space-y-3">
                  {MY_POSTS.filter(p => postTab === "Top" || (postTab === "Published" ? p.status === "published" : p.status === "draft")).map((post) => (
                    <div key={post.id} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-3 hover:border-[#e85d26] hover:bg-[#fdf0ea] transition-all">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge tone={post.status === "published" ? "success" : "warning"}>{post.status}</Badge>
                          <Badge tone="neutral">{post.type}</Badge>
                        </div>
                        <p className="text-sm font-semibold text-[#1a1814] truncate">{post.title}</p>
                        <p className="text-xs text-[#a09880] mt-0.5">{post.votes} votes · {post.answers} answers · {post.time}</p>
                      </div>
                      <div className="flex gap-2 ml-3 shrink-0">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {section === "saved" && (
              <Card className="rounded-2xl">
                <h3 className="font-display text-xl font-bold mb-4">Saved Posts</h3>
                <div className="space-y-3">
                  {["Scaling React with micro-frontends", "PostgreSQL indexing deep dive", "The staff engineer's playbook"].map((title, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-3">
                      <p className="text-sm font-medium text-[#1a1814]">{title}</p>
                      <Button variant="ghost" size="sm" className="text-red-500">Unsave</Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {section === "activity" && (
              <Card className="rounded-2xl">
                <h3 className="font-display text-xl font-bold mb-4">Activity Feed</h3>
                <div className="space-y-3">
                  {[...ACTIVITY, ...ACTIVITY].map((a, i) => (
                    <div key={i} className="flex items-start gap-3 border-b border-[rgba(90,80,60,0.06)] pb-3 last:border-0">
                      <span className="text-lg mt-0.5">{a.icon}</span>
                      <div><p className="text-sm text-[#3a3530]">{a.text}</p><p className="text-xs text-[#a09880] mt-0.5">{a.time}</p></div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {section === "settings" && (
              <div className="space-y-4">
                <Card className="rounded-2xl">
                  <h3 className="font-display text-xl font-bold mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="avatar h-14 w-14 text-lg shrink-0">{(user?.username || "U")[0].toUpperCase()}</div>
                      <div>
                        <Button variant="secondary" size="sm">Upload photo</Button>
                        <p className="text-xs text-[#a09880] mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Full name</label>
                        <input className="input-field" defaultValue={user?.username || ""} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Username</label>
                        <input className="input-field" defaultValue={user?.username || ""} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-semibold text-[#1a1814]">Bio</label>
                        <button className="text-xs text-[#e85d26] font-medium" onClick={() => setEditingBio(!editingBio)}>{editingBio ? "Save" : "Edit"}</button>
                      </div>
                      {editingBio ? (
                        <textarea className="input-field resize-none" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
                      ) : (
                        <p className="text-sm text-[#6b6358] rounded-xl border border-[rgba(90,80,60,0.1)] p-3">{bio}</p>
                      )}
                    </div>
                    <Button>Save profile</Button>
                  </div>
                </Card>
                <Card className="rounded-2xl">
                  <h3 className="font-display text-xl font-bold mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    {Object.entries({ email: "Email digests", answers: "New answers to my posts", upvotes: "Upvote milestones", follows: "New followers" }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-3">
                        <span className="text-sm text-[#1a1814]">{label}</span>
                        <button onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                          className={`relative h-5 w-9 rounded-full transition-all ${notifPrefs[key] ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.15)]"}`}>
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${notifPrefs[key] ? "left-4" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="rounded-2xl border border-red-200">
                  <h3 className="font-display text-lg font-bold text-red-700 mb-3">Danger Zone</h3>
                  <p className="text-sm text-[#6b6358] mb-3">These actions are irreversible. Please be careful.</p>
                  <div className="flex gap-3">
                    <Button variant="danger" size="sm">Delete account</Button>
                    <Button variant="secondary" size="sm">Export data</Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
