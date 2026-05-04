import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";

const REPORTS = [
  { id: 1, title: "Spam promotion thread in #engineering", type: "spam", count: 8, user: "anon_user", time: "30m ago", severity: "high" },
  { id: 2, title: "Off-topic personal attack in discussion", type: "harassment", count: 3, user: "dev_xyz", time: "2h ago", severity: "medium" },
  { id: 3, title: "Misinformation about database performance", type: "misinformation", count: 5, user: "ghost_99", time: "4h ago", severity: "medium" },
];
const USERS = [
  { id: 1, name: "gaurav_dev", email: "gaurav@ex.com", role: "user", status: "active", posts: 34, joined: "Mar 2025" },
  { id: 2, name: "priya_arch", email: "priya@ex.com", role: "moderator", status: "active", posts: 91, joined: "Jan 2025" },
  { id: 3, name: "spam_bot_99", email: "spam@junk.com", role: "user", status: "suspended", posts: 2, joined: "Apr 2026" },
  { id: 4, name: "alex_ops", email: "alex@ops.io", role: "user", status: "active", posts: 58, joined: "Feb 2025" },
];

const STATS = [
  { label: "Total users", value: "4,821", icon: "👥", change: "+12% this week" },
  { label: "Posts today", value: "342", icon: "📝", change: "+5%" },
  { label: "Open reports", value: "3", icon: "🚨", change: "Needs attention", danger: true },
  { label: "Answer rate", value: "82%", icon: "✅", change: "+2% vs last month" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const [tab, setTab] = useState("All");

  const navItems = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "moderation", label: "Moderation", icon: "🛡️", count: REPORTS.length },
    { key: "users", label: "Users", icon: "👥" },
    { key: "content", label: "Content", icon: "📝" },
    { key: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Badge tone="danger" dot>Admin Panel</Badge>
            <h1 className="font-display text-3xl font-bold text-[#1a1814] mt-1">Admin Dashboard</h1>
          </div>
          <Button variant="secondary" size="sm">⬇️ Export report</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-2">
            <div className="surface rounded-2xl p-3">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => setSection(item.key)}
                  className={`sidebar-item ${section === item.key ? "active" : ""}`}>
                  <span>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${item.count > 0 ? "bg-red-500 text-white" : "bg-[rgba(90,80,60,0.1)] text-[#6b6358]"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-4 min-w-0">
            {section === "overview" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {STATS.map((s) => (
                    <Card key={s.label} className="rounded-2xl">
                      <span className="text-2xl">{s.icon}</span>
                      <p className="mt-2 font-display text-3xl font-bold text-[#1a1814]">{s.value}</p>
                      <p className="text-xs text-[#a09880]">{s.label}</p>
                      <p className={`text-xs font-medium mt-1 ${s.danger ? "text-red-600" : "text-green-600"}`}>{s.change}</p>
                    </Card>
                  ))}
                </div>
                <Card className="rounded-2xl">
                  <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">Platform activity (last 7 days)</h3>
                  <div className="flex items-end gap-1 h-28">
                    {[42, 58, 35, 71, 89, 64, 53].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg bg-gradient-to-t from-[#e85d26] to-[#f59e6b]" style={{ height: `${(val / 90) * 100}%` }} />
                        <span className="text-xs text-[#a09880]">{["M","T","W","T","F","S","S"][i]}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {section === "moderation" && (
              <Card className="rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold text-[#1a1814]">Report Queue</h3>
                  <Badge tone="danger" dot>{REPORTS.length} open</Badge>
                </div>
                <div className="space-y-3">
                  {REPORTS.map((r) => (
                    <div key={r.id} className={`rounded-xl border p-4 ${r.severity === "high" ? "border-red-200 bg-red-50/50" : "border-[rgba(90,80,60,0.1)]"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge tone={r.severity === "high" ? "danger" : "warning"}>{r.severity}</Badge>
                            <Badge tone="neutral">{r.type}</Badge>
                          </div>
                          <p className="text-sm font-semibold text-[#1a1814]">{r.title}</p>
                          <p className="text-xs text-[#a09880] mt-1">Reported by {r.count} users · @{r.user} · {r.time}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="secondary" size="sm">Review</Button>
                          <Button variant="danger" size="sm">Remove</Button>
                          <Button variant="ghost" size="sm">Dismiss</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {section === "users" && (
              <Card className="rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold">User Management</h3>
                  <div className="flex gap-2">
                    <input className="input-field w-48 text-sm" placeholder="Search users..." />
                    <Tabs items={["All", "Active", "Suspended"]} active={tab} onChange={setTab} />
                  </div>
                </div>
                <div className="space-y-2">
                  {USERS.filter(u => tab === "All" || (tab === "Active" ? u.status === "active" : u.status === "suspended")).map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-3 hover:bg-[rgba(90,80,60,0.02)]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="avatar h-8 w-8 text-sm shrink-0">{u.name[0].toUpperCase()}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1a1814]">@{u.name}</p>
                          <p className="text-xs text-[#a09880] truncate">{u.email} · {u.posts} posts · joined {u.joined}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <Badge tone={u.status === "active" ? "success" : "danger"}>{u.status}</Badge>
                        <Badge tone={u.role === "moderator" ? "brand" : "neutral"}>{u.role}</Badge>
                        <Button variant="secondary" size="sm">{u.status === "active" ? "Suspend" : "Restore"}</Button>
                        <Button variant="ghost" size="sm">Promote</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {section === "analytics" && (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { title: "Top categories", items: [["Engineering", "34%"], ["Product", "22%"], ["DevOps", "18%"], ["AI/ML", "15%"]] },
                  { title: "Content types", items: [["Questions", "48%"], ["Discussions", "31%"], ["Articles", "21%"]] },
                ].map((block) => (
                  <Card key={block.title} className="rounded-2xl">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">{block.title}</h3>
                    <div className="space-y-3">
                      {block.items.map(([label, pct]) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs text-[#6b6358] mb-1"><span>{label}</span><span className="font-semibold">{pct}</span></div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: pct }} /></div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
