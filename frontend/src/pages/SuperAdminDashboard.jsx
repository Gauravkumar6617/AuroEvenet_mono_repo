import { useState } from "react";
import { Link } from "react-router-dom";

const PLATFORM_STATS = [
    { label: "Total Users", value: "50,214", icon: "👥", trend: "+1.2K this week", color: "#6366f1" },
    { label: "Total Articles", value: "2,184", icon: "📝", trend: "+89 today", color: "#8b5cf6" },
    { label: "Monthly Views", value: "10.4M", icon: "📈", trend: "+14% vs last month", color: "#06b6d4" },
    { label: "Revenue (Ads)", value: "₹0", icon: "💰", trend: "Free platform", color: "#10b981" },
    { label: "Active Admins", value: "3", icon: "🛡️", trend: "Including you", color: "#f59e0b" },
    { label: "Reported Posts", value: "3", icon: "🚩", trend: "Needs attention", color: "#ef4444" },
];

const ALL_USERS = [
    { id: 1, name: "Gaurav S.", email: "gaurav@dev.com", role: "superadmin", articles: 2, joined: "Jan 2026", status: "active", verified: true },
    { id: 2, name: "Priya R.", email: "priya@dev.com", role: "admin", articles: 2, joined: "Feb 2026", status: "active", verified: true },
    { id: 3, name: "spammer_01", email: "spam@mail.ru", role: "writer", articles: 1, joined: "Apr 2026", status: "flagged", verified: false },
    { id: 4, name: "Rahul K.", email: "rahul@dev.com", role: "writer", articles: 1, joined: "Mar 2026", status: "active", verified: true },
    { id: 5, name: "Alex M.", email: "alex@dev.com", role: "writer", articles: 1, joined: "Mar 2026", status: "active", verified: true },
];

const ACTIVITY_LOG = [
    { time: "2 min ago", action: "Article removed", detail: "'[SPAM] Buy Cheap Followers' removed by admin Priya R.", type: "warn" },
    { time: "1 hr ago", action: "New admin promoted", detail: "Priya R. promoted to admin role by superadmin Gaurav S.", type: "info" },
    { time: "3 hr ago", action: "User suspended", detail: "spammer_01 suspended for policy violation.", type: "danger" },
    { time: "6 hr ago", action: "Maintenance window", detail: "Scheduled DB index rebuild completed. No downtime.", type: "success" },
    { time: "Yesterday", action: "API key rotated", detail: "SendGrid email API key rotated successfully.", type: "info" },
];

const SETTINGS_SECTIONS = [
    { icon: "✉️", label: "Email (SendGrid)", value: "Configured", status: "ok" },
    { icon: "🗄️", label: "PostgreSQL", value: "Connected · 42ms latency", status: "ok" },
    { icon: "⚡", label: "Redis Cache", value: "Connected · 1.2ms latency", status: "ok" },
    { icon: "🐳", label: "Docker", value: "3 containers running", status: "ok" },
    { icon: "🔐", label: "SSL Certificate", value: "Valid until Dec 2026", status: "ok" },
    { icon: "📦", label: "Storage", value: "1.2 GB / 10 GB used", status: "warn" },
];

const ROLE_COLORS = {
    superadmin: { bg: "rgba(236,72,153,0.15)", color: "#f9a8d4" },
    admin: { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc" },
    writer: { bg: "rgba(255,255,255,0.06)", color: "#94a3b8" },
};

const NAV = [
    { key: "overview", label: "Overview", icon: "🌐" },
    { key: "users", label: "All Users", icon: "👥" },
    { key: "activity", label: "Activity Log", icon: "📋" },
    { key: "platform", label: "Platform Settings", icon: "⚙️" },
];

export default function SuperAdminDashboard() {
    const [active, setActive] = useState("overview");
    const [users, setUsers] = useState(ALL_USERS);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const changeRole = (id, newRole) => setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

    return (
        <div className="relative pt-16 min-h-screen flex">
            {/* sidebar */}
            <aside className="hidden md:flex flex-col w-64 flex-shrink-0 pt-8 px-3 space-y-1"
                style={{ background: "rgba(8,8,18,0.95)", borderRight: "1px solid rgba(236,72,153,0.15)" }}>
                <div className="px-3 pb-6 mb-2 border-b border-pink-500/10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(139,92,246,0.25))", border: "1px solid rgba(236,72,153,0.4)" }}>
                            👑
                        </div>
                        <div>
                            <p className="text-white font-black text-sm">Super Admin</p>
                            <p className="text-pink-400 text-xs font-semibold">Full Access</p>
                        </div>
                    </div>
                </div>

                {NAV.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setActive(key)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200"
                        style={active === key
                            ? { background: "rgba(236,72,153,0.12)", color: "#f9a8d4", border: "1px solid rgba(236,72,153,0.3)" }
                            : { color: "#64748b" }}>
                        <span className="text-base">{icon}</span>{label}
                    </button>
                ))}

                <div className="mt-auto pt-4 border-t border-pink-500/10 space-y-1">
                    <Link to="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-all">
                        <span>🛡️</span> Admin Panel
                    </Link>
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
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-black text-white">Platform Overview</h1>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    All systems operational
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                                {PLATFORM_STATS.map(({ label, value, icon, trend, color }) => (
                                    <div key={label} className="glass-card p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="text-2xl">{icon}</div>
                                            <div className="w-2 h-2 rounded-full mt-1" style={{ background: color }} />
                                        </div>
                                        <div className="text-2xl font-black text-white">{value}</div>
                                        <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                                        <div className="text-xs mt-2 font-medium" style={{ color }}>{trend}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick actions */}
                            <h2 className="text-lg font-black text-white mb-4">Quick Actions</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { icon: "📧", label: "Send Announcement", desc: "Email all users" },
                                    { icon: "🔄", label: "Clear Cache", desc: "Flush Redis cache" },
                                    { icon: "📊", label: "Export Data", desc: "Download user CSV" },
                                ].map(({ icon, label, desc }) => (
                                    <button key={label} className="glass-card p-4 text-left group hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-0.5">
                                        <div className="text-2xl mb-2">{icon}</div>
                                        <p className="text-white font-semibold text-sm group-hover:text-pink-200 transition-colors">{label}</p>
                                        <p className="text-slate-500 text-xs">{desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─ Users ─ */}
                    {active === "users" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-black text-white">All Users</h1>
                                <p className="text-slate-400 text-sm">{users.length} total</p>
                            </div>
                            <div className="space-y-3">
                                {users.map(u => (
                                    <div key={u.id} className="glass-card px-5 py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                            style={{ background: u.role === "superadmin" ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                            {u.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-white font-semibold text-sm">{u.name}</p>
                                                {u.verified && <svg className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                            </div>
                                            <p className="text-slate-500 text-xs">{u.email} · {u.articles} articles · joined {u.joined}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                                                style={ROLE_COLORS[u.role]}>
                                                {u.role}
                                            </span>
                                            {u.role !== "superadmin" && (
                                                <select
                                                    value={u.role}
                                                    onChange={e => changeRole(u.id, e.target.value)}
                                                    className="text-xs px-2 py-1.5 rounded-lg cursor-pointer outline-none"
                                                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                                                    <option value="writer">Writer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            )}
                                            {u.role !== "superadmin" && (
                                                <button onClick={() => deleteUser(u.id)} className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all">
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─ Activity Log ─ */}
                    {active === "activity" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-6">Activity Log</h1>
                            <div className="space-y-3">
                                {ACTIVITY_LOG.map((log, i) => {
                                    const colors = { info: "#6366f1", success: "#10b981", warn: "#f59e0b", danger: "#ef4444" };
                                    const c = colors[log.type];
                                    return (
                                        <div key={i} className="glass-card px-5 py-4 flex items-start gap-4">
                                            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: c }} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-white font-semibold text-sm">{log.action}</p>
                                                    <span className="text-slate-500 text-xs">· {log.time}</span>
                                                </div>
                                                <p className="text-slate-400 text-xs leading-relaxed">{log.detail}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ─ Platform Settings ─ */}
                    {active === "platform" && (
                        <div>
                            <h1 className="text-3xl font-black text-white mb-6">Platform Settings</h1>

                            {/* Services */}
                            <div className="glass-card p-6 mb-6">
                                <h2 className="text-base font-bold text-white mb-4">Service Status</h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {SETTINGS_SECTIONS.map(({ icon, label, value, status }) => (
                                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                                            <span className="text-xl">{icon}</span>
                                            <div className="flex-1">
                                                <p className="text-slate-200 text-xs font-semibold">{label}</p>
                                                <p className="text-slate-500 text-xs">{value}</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: status === "ok" ? "#10b981" : "#f59e0b" }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Maintenance mode */}
                            <div className="glass-card p-6 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-bold text-white mb-1">Maintenance Mode</h2>
                                        <p className="text-slate-400 text-xs">When enabled, only admins can access the platform.</p>
                                    </div>
                                    <button onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                                        style={{ background: maintenanceMode ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.1)" }}>
                                        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm"
                                            style={{ left: maintenanceMode ? "calc(100% - 1.35rem)" : "0.125rem" }} />
                                    </button>
                                </div>
                                {maintenanceMode && (
                                    <div className="mt-4 px-4 py-3 rounded-xl text-sm text-amber-300" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
                                        ⚠️ Maintenance mode is <strong>ON</strong>. The site is not accessible to regular users.
                                    </div>
                                )}
                            </div>

                            {/* Danger zone */}
                            <div className="glass-card p-6" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                                <h2 className="text-base font-bold text-rose-400 mb-4">Danger Zone</h2>
                                <div className="space-y-3">
                                    {[
                                        { label: "Flush Redis Cache", desc: "Clear all cached data immediately." },
                                        { label: "Reset All Sessions", desc: "Force all users to log in again." },
                                        { label: "Wipe Test Data", desc: "Remove all test accounts and articles." },
                                    ].map(({ label, desc }) => (
                                        <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.04)" }}>
                                            <div>
                                                <p className="text-slate-200 text-sm font-semibold">{label}</p>
                                                <p className="text-slate-500 text-xs">{desc}</p>
                                            </div>
                                            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-rose-300 hover:text-rose-200 transition-all flex-shrink-0"
                                                style={{ border: "1px solid rgba(239,68,68,0.4)" }}>
                                                Execute
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
