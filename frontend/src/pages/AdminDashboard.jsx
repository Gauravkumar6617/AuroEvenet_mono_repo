import { useState } from "react";
import { Link } from "react-router-dom";

const ARTICLES = [
    { id: 1, title: "Building a REST API with FastAPI and PostgreSQL", author: "Gaurav S.", status: "published", date: "Apr 24, 2026", views: 4210, reports: 0 },
    { id: 3, title: "RAG Systems with LangChain and FastAPI", author: "Alex M.", status: "published", date: "Apr 20, 2026", views: 6700, reports: 2 },
    { id: 5, title: "From Junior to Senior: The Python Developer Roadmap", author: "Rahul K.", status: "published", date: "Apr 15, 2026", views: 9800, reports: 1 },
    { id: 10, title: "Pydantic v2 Data Validation Deep Dive", author: "Gaurav S.", status: "draft", date: "Apr 26, 2026", views: 0, reports: 0 },
    { id: 12, title: "[SPAM] Buy Cheap Followers NOW", author: "spammer_01", status: "reported", date: "Apr 26, 2026", views: 45, reports: 8 },
];

const USERS = [
    { id: 1, name: "Gaurav S.", email: "gaurav@dev.com", role: "writer", articles: 2, joined: "Jan 2026", status: "active" },
    { id: 2, name: "Priya R.", email: "priya@dev.com", role: "writer", articles: 2, joined: "Feb 2026", status: "active" },
    { id: 3, name: "spammer_01", email: "spam@mail.ru", role: "writer", articles: 1, joined: "Apr 2026", status: "flagged" },
    { id: 4, name: "Rahul K.", email: "rahul@dev.com", role: "writer", articles: 1, joined: "Mar 2026", status: "active" },
];

const ADMIN_STATS = [
    { label: "Total Articles", value: "2,184", icon: "📝", color: "#6366f1" },
    { label: "Pending Reviews", value: "12", icon: "🔍", color: "#f59e0b" },
    { label: "Reported Posts", value: "3", icon: "🚩", color: "#ef4444" },
    { label: "Active Users", value: "48.2K", icon: "👥", color: "#10b981" },
];

const NAV = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "articles", label: "All Articles", icon: "📝" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "reports", label: "Reports", icon: "🚩" },
];

export default function AdminDashboard() {
    const [active, setActive] = useState("overview");
    const [articles, setArticles] = useState(ARTICLES);
    const [users, setUsers] = useState(USERS);

    const reported = articles.filter(a => a.reports > 0 || a.status === "reported");

    const removeArticle = (id) => setArticles(prev => prev.filter(a => a.id !== id));
    const toggleUserStatus = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));

    return (
        <div className="relative pt-16 min-h-screen flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-60 flex-shrink-0 pt-8 px-3 space-y-1"
                style={{ background: "rgba(10,10,20,0.9)", borderRight: "1px solid rgba(99,102,241,0.12)" }}>
                <div className="px-3 pb-6 mb-2 border-b border-indigo-500/10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "rgba(99,102,241,0.2)" }}>🛡️</div>
                        <span className="text-white font-black text-sm">Admin Panel</span>
                    </div>
                    <p className="text-slate-500 text-xs pl-10">Content Moderator</p>
                </div>

                {NAV.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setActive(key)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200"
                        style={active === key
                            ? { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }
                            : { color: "#64748b" }}>
                        <span className="text-base">{icon}</span>
                        {label}
                        {key === "reports" && reported.length > 0 && (
                            <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#ef4444" }}>{reported.length}</span>
                        )}
                    </button>
                ))}

                <div className="mt-auto pt-4 border-t border-indigo-500/10">
                    <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-all">
                        <span>🌐</span> View Site
                    </Link>
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                    {/* ─ Overview ─ */}
                    {active === "overview" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-6">Admin Overview</h1>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                {ADMIN_STATS.map(({ label, value, icon, color }) => (
                                    <div key={label} className="glass-card p-5">
                                        <div className="text-2xl mb-2">{icon}</div>
                                        <div className="text-2xl font-black text-white">{value}</div>
                                        <div className="text-slate-400 text-xs mt-1">{label}</div>
                                        <div className="h-1 mt-3 rounded-full" style={{ background: color, opacity: 0.5 }} />
                                    </div>
                                ))}
                            </div>

                            {/* Reported posts quick view */}
                            {reported.length > 0 && (
                                <div className="glass-card p-5 mb-6" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-lg">🚩</span>
                                        <h2 className="text-base font-black text-white">Needs Attention</h2>
                                        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#ef4444" }}>{reported.length}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {reported.map(a => (
                                            <div key={a.id} className="flex items-center gap-3">
                                                <p className="text-slate-200 text-sm flex-1 line-clamp-1">{a.title}</p>
                                                <span className="text-xs text-rose-400 flex-shrink-0">🚩 {a.reports} reports</span>
                                                <button onClick={() => removeArticle(a.id)} className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-all flex-shrink-0">Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─ All Articles ─ */}
                    {active === "articles" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-6">All Articles</h1>
                            <div className="space-y-3">
                                {articles.map(a => (
                                    <div key={a.id} className="glass-card px-5 py-4 flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm line-clamp-1">{a.title}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{a.author} · {a.date} · {a.views.toLocaleString()} views</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {a.reports > 0 && <span className="text-xs text-rose-400 font-medium">🚩 {a.reports}</span>}
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={a.status === "published"
                                                    ? { background: "rgba(16,185,129,0.15)", color: "#6ee7b7" }
                                                    : a.status === "reported"
                                                        ? { background: "rgba(239,68,68,0.15)", color: "#fca5a5" }
                                                        : { background: "rgba(245,158,11,0.15)", color: "#fcd34d" }}>
                                                {a.status}
                                            </span>
                                            <button onClick={() => removeArticle(a.id)} className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─ Users ─ */}
                    {active === "users" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-6">Users</h1>
                            <div className="space-y-3">
                                {users.map(u => (
                                    <div key={u.id} className="glass-card px-5 py-4 flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                            {u.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm">{u.name}</p>
                                            <p className="text-slate-500 text-xs">{u.email} · {u.articles} articles · joined {u.joined}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                                style={u.status === "active"
                                                    ? { background: "rgba(16,185,129,0.15)", color: "#6ee7b7" }
                                                    : u.status === "flagged"
                                                        ? { background: "rgba(245,158,11,0.15)", color: "#fcd34d" }
                                                        : { background: "rgba(239,68,68,0.15)", color: "#fca5a5" }}>
                                                {u.status}
                                            </span>
                                            <button onClick={() => toggleUserStatus(u.id)}
                                                className="text-xs px-2 py-1.5 rounded-lg transition-all flex-shrink-0"
                                                style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                                                {u.status === "active" || u.status === "flagged" ? "Suspend" : "Restore"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─ Reports ─ */}
                    {active === "reports" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-6">Reported Posts</h1>
                            {reported.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-5xl mb-4">✅</p>
                                    <p className="text-white font-bold text-xl">All clear!</p>
                                    <p className="text-slate-400 text-sm mt-2">No reported posts to review.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reported.map(a => (
                                        <div key={a.id} className="glass-card p-5" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-xl flex-shrink-0">🚩</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-bold text-sm line-clamp-1">{a.title}</p>
                                                    <p className="text-slate-500 text-xs mt-0.5">by {a.author} · {a.reports} reports</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => removeArticle(a.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-rose-300 hover:text-rose-200 transition-all" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                                                    Remove Article
                                                </button>
                                                <button onClick={() => setArticles(prev => prev.map(art => art.id === a.id ? { ...art, reports: 0, status: "published" } : art))}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all" style={{ background: "rgba(255,255,255,0.06)" }}>
                                                    Dismiss Report
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
