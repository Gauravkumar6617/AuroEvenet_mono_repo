import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function SuperAdminDashboard() {
  const [section, setSection] = useState("overview");
  const [maintenance, setMaintenance] = useState(false);
  const [confirmDanger, setConfirmDanger] = useState("");

  const navItems = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "roles", label: "Role Access", icon: "🔑" },
    { key: "platform", label: "Platform Settings", icon: "⚙️" },
    { key: "danger", label: "Danger Zone", icon: "⚠️", danger: true },
  ];

  const PLATFORM_STATS = [
    { label: "Total users", value: "4,821" }, { label: "Total posts", value: "18,340" },
    { label: "Open reports", value: "3" }, { label: "Admin accounts", value: "7" },
  ];

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6">
          <Badge tone="danger" dot>Super Admin</Badge>
          <h1 className="font-display text-3xl font-bold text-[#1a1814] mt-1">Super Admin Console</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="surface rounded-2xl p-3 h-fit">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""} ${item.danger && section !== item.key ? "hover:bg-red-50 hover:text-red-600" : ""}`}>
                <span>{item.icon}</span><span className={item.danger ? "text-red-600" : ""}>{item.label}</span>
              </button>
            ))}
          </aside>

          <div className="space-y-4 min-w-0">
            {section === "overview" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {PLATFORM_STATS.map((s) => (
                    <Card key={s.label} className="rounded-2xl">
                      <p className="font-display text-3xl font-bold text-[#1a1814]">{s.value}</p>
                      <p className="text-xs text-[#a09880] mt-0.5">{s.label}</p>
                    </Card>
                  ))}
                </div>
                <Card className="rounded-2xl">
                  <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">System health</h3>
                  {[["API latency", "42ms", "success"], ["DB connections", "12/100", "success"], ["Error rate", "0.02%", "success"], ["Queue depth", "3 jobs", "success"]].map(([k, v, tone]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                      <span className="text-sm text-[#6b6358]">{k}</span>
                      <div className="flex items-center gap-2"><span className="text-sm font-semibold text-[#1a1814]">{v}</span><Badge tone={tone}>OK</Badge></div>
                    </div>
                  ))}
                </Card>
              </>
            )}
            {section === "roles" && (
              <Card className="rounded-2xl">
                <h3 className="font-display text-xl font-bold mb-4">Role Assignments</h3>
                <div className="space-y-3">
                  {[["priya_arch", "Moderator"], ["gaurav_dev", "User"], ["alex_admin", "Admin"], ["super", "Super Admin"]].map(([user, role]) => (
                    <div key={user} className="flex items-center justify-between rounded-xl border border-[rgba(90,80,60,0.1)] p-3">
                      <div className="flex items-center gap-2"><div className="avatar h-7 w-7 text-xs">{user[0].toUpperCase()}</div><span className="text-sm font-medium text-[#1a1814]">@{user}</span></div>
                      <div className="flex items-center gap-2">
                        <Badge tone={role === "Super Admin" ? "danger" : role === "Admin" ? "brand" : role === "Moderator" ? "info" : "neutral"}>{role}</Badge>
                        <Button variant="ghost" size="sm">Change role</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {section === "platform" && (
              <Card className="rounded-2xl">
                <h3 className="font-display text-xl font-bold mb-4">Platform Controls</h3>
                <div className="space-y-3">
                  {[
                    { label: "Maintenance mode", desc: "Restrict non-admin access", key: "maintenance", state: maintenance, toggle: () => setMaintenance(v => !v) },
                  ].map((item) => (
                    <div key={item.key} className={`flex items-center justify-between rounded-xl border p-4 ${item.state ? "border-amber-200 bg-amber-50" : "border-[rgba(90,80,60,0.1)]"}`}>
                      <div><p className="text-sm font-semibold text-[#1a1814]">{item.label}</p><p className="text-xs text-[#a09880]">{item.desc}</p></div>
                      <button onClick={item.toggle}
                        className={`relative h-6 w-11 rounded-full transition-all ${item.state ? "bg-amber-500" : "bg-[rgba(90,80,60,0.15)]"}`}>
                        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${item.state ? "left-6" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {section === "danger" && (
              <Card className="rounded-2xl border border-red-200">
                <h3 className="font-display text-xl font-bold text-red-700 mb-2">Danger Zone</h3>
                <p className="text-sm text-[#6b6358] mb-4">These actions are irreversible and affect the entire platform. Type "CONFIRM" to unlock.</p>
                <input className="input-field mb-4" placeholder='Type "CONFIRM" to enable danger actions' value={confirmDanger} onChange={e => setConfirmDanger(e.target.value)} />
                <div className="flex flex-wrap gap-3">
                  <Button variant="danger" disabled={confirmDanger !== "CONFIRM"}>Flush Cache</Button>
                  <Button variant="danger" disabled={confirmDanger !== "CONFIRM"}>Reset All Sessions</Button>
                  <Button variant="danger" disabled={confirmDanger !== "CONFIRM"}>Purge Spam Content</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
