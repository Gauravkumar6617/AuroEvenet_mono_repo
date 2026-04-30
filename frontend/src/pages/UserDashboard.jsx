import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MY_ARTICLES = [
    { id: 1, title: "Building a REST API with FastAPI and PostgreSQL", status: "published", date: "Apr 24, 2026", views: 4210, likes: 187, comments: 14 },
    { id: 6, title: "Async Python: asyncio Patterns You Should Know", status: "published", date: "Apr 12, 2026", views: 3400, likes: 198, comments: 9 },
    { id: 10, title: "Pydantic v2 Data Validation Deep Dive", status: "draft", date: "Apr 26, 2026", views: 0, likes: 0, comments: 0 },
    { id: 11, title: "FastAPI + Celery: Background Tasks in Python", status: "draft", date: "Apr 25, 2026", views: 0, likes: 0, comments: 0 },
];

const STATS = [
    { label: "Total Views", value: "7,610", icon: "👁️", change: "+12%" },
    { label: "Total Likes", value: "385", icon: "❤️", change: "+8%" },
    { label: "Articles", value: "4", icon: "✍️", change: "+2" },
    { label: "Followers", value: "128", icon: "👥", change: "+23" },
];

const NAV = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "articles", label: "My Articles", icon: "📝" },
    { key: "drafts", label: "Drafts", icon: "📋" },
    { key: "settings", label: "Settings", icon: "⚙️" },
];

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const [active, setActive] = useState("overview");
    const username = user?.username || "Writer";

    const published = MY_ARTICLES.filter(a => a.status === "published");
    const drafts = MY_ARTICLES.filter(a => a.status === "draft");

    return (
        <div className="relative pt-16 min-h-screen flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-60 border-r flex-shrink-0 pt-8 px-3 space-y-1"
                style={{ background: "rgba(10,10,20,0.8)", borderColor: "rgba(99,102,241,0.12)" }}>
                <div className="px-3 pb-6 mb-2 border-b border-indigo-500/10">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white mb-2"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        {username.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-white font-bold text-sm">{username}</p>
                    <p className="text-slate-500 text-xs">Writer · Free plan</p>
                </div>

                {NAV.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setActive(key)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200"
                        style={active === key
                            ? { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }
                            : { color: "#64748b" }}>
                        <span className="text-base">{icon}</span>{label}
                    </button>
                ))}

                <div className="mt-auto pt-4 border-t border-indigo-500/10">
                    <Link to="/blog/new" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white mb-2 transition-all"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <span>✏️</span> New Article
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                    {/* Overview */}
                    {active === "overview" && (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-white">Welcome back, <span className="gradient-text">{username}</span> 👋</h1>
                                <p className="text-slate-400 mt-1">Here's how your content is performing.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                {STATS.map(({ label, value, icon, change }) => (
                                    <div key={label} className="glass-card p-5">
                                        <div className="text-2xl mb-2">{icon}</div>
                                        <div className="text-2xl font-black text-white">{value}</div>
                                        <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                                        <div className="text-emerald-400 text-xs font-semibold mt-1">{change} this week</div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-lg font-black text-white mb-4">Recent Articles</h2>
                            <div className="space-y-3">
                                {published.map(a => (
                                    <div key={a.id} className="glass-card p-4 flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/blog/${a.id}`} className="text-white font-semibold text-sm hover:text-indigo-300 transition-colors line-clamp-1">{a.title}</Link>
                                            <p className="text-slate-500 text-xs mt-0.5">{a.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-400 flex-shrink-0">
                                            <span>👁️ {a.views.toLocaleString()}</span>
                                            <span>❤️ {a.likes}</span>
                                            <span>💬 {a.comments}</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                                            style={{ background: "rgba(16,185,129,0.15)", color: "#6ee7b7" }}>
                                            Live
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Articles */}
                    {active === "articles" && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-black text-white">My Articles</h1>
                                <Link to="/blog/new" className="btn-primary text-sm px-4 py-2">+ New</Link>
                            </div>
                            <div className="space-y-4">
                                {MY_ARTICLES.map(a => (
                                    <div key={a.id} className="glass-card p-5 flex items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/blog/${a.id}`} className="text-white font-bold hover:text-indigo-300 transition-colors text-sm line-clamp-1">{a.title}</Link>
                                            <p className="text-slate-500 text-xs mt-1">{a.date}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                                                <span>👁️ {a.views.toLocaleString()}</span>
                                                <span>❤️ {a.likes}</span>
                                                <span>💬 {a.comments}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                style={a.status === "published"
                                                    ? { background: "rgba(16,185,129,0.15)", color: "#6ee7b7" }
                                                    : { background: "rgba(245,158,11,0.15)", color: "#fcd34d" }}>
                                                {a.status === "published" ? "Published" : "Draft"}
                                            </span>
                                            <button className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Drafts */}
                    {active === "drafts" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-8">Drafts</h1>
                            {drafts.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-4xl mb-4">📋</p>
                                    <p className="text-white font-bold text-xl mb-2">No drafts yet</p>
                                    <p className="text-slate-400 text-sm mb-6">Start writing something new.</p>
                                    <Link to="/blog/new" className="btn-primary px-6 py-2.5 inline-flex">+ New Article</Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {drafts.map(a => (
                                        <div key={a.id} className="glass-card p-5 flex items-center gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm line-clamp-1">{a.title}</p>
                                                <p className="text-slate-500 text-xs mt-1">Last edited: {a.date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="btn-primary text-xs px-4 py-2">Edit & Publish</button>
                                                <button className="text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-all">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings */}
                    {active === "settings" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-8">Settings</h1>
                            <div className="space-y-6">
                                <div className="glass-card p-6">
                                    <h2 className="text-base font-bold text-white mb-4">Profile</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-300">Display name</label>
                                            <input defaultValue={username} className="input-field" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-300">Email</label>
                                            <input defaultValue={`${username}@example.com`} className="input-field" />
                                        </div>
                                        <div className="sm:col-span-2 space-y-1.5">
                                            <label className="text-sm font-medium text-slate-300">Bio</label>
                                            <textarea rows={3} defaultValue="Python developer. FastAPI enthusiast. Building cool stuff." className="input-field resize-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button className="btn-primary text-sm px-5 py-2">Save Changes</button>
                                    </div>
                                </div>
                                <div className="glass-card p-6">
                                    <h2 className="text-base font-bold text-white mb-4">Change Password</h2>
                                    <div className="space-y-3 max-w-sm">
                                        <input type="password" placeholder="Current password" className="input-field" />
                                        <input type="password" placeholder="New password" className="input-field" />
                                        <input type="password" placeholder="Confirm new password" className="input-field" />
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button className="btn-primary text-sm px-5 py-2">Update Password</button>
                                    </div>
                                </div>
                                <div className="glass-card p-6 border border-rose-500/20">
                                    <h2 className="text-base font-bold text-rose-400 mb-2">Danger Zone</h2>
                                    <p className="text-slate-400 text-sm mb-4">Once you delete your account, all your articles and data will be permanently removed.</p>
                                    <button className="px-4 py-2 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-500/15 transition-all" style={{ border: "1px solid rgba(239,68,68,0.4)" }}>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
