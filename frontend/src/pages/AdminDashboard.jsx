import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SidebarNav from "../components/layout/SidebarNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const reports = [
  { id: 1, title: "Spam promotion thread", count: 8 },
  { id: 2, title: "Off-topic personal attack", count: 3 },
];

export default function AdminDashboard() {
  const [section, setSection] = useState("moderation");

  return (
    <div className="py-10">
      <PageContainer>
        <h1 className="mb-6 font-display text-3xl font-bold">Admin Panel</h1>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <SidebarNav
            title="Admin"
            active={section}
            onChange={setSection}
            items={[
              { key: "moderation", label: "Moderation", count: reports.length },
              { key: "users", label: "Users" },
              { key: "analytics", label: "Analytics" },
            ]}
          />
          <div className="space-y-4">
            {section === "moderation" && (
              <Card>
                <h2 className="font-display text-xl font-semibold">Report Queue</h2>
                <div className="mt-4 space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{report.title}</p>
                        <p className="text-xs text-slate-500">{report.count} reports</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary">Review</Button>
                        <Button variant="danger">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {section === "users" && (
              <Card>
                <h2 className="font-display text-xl font-semibold">User Management</h2>
                <div className="mt-4 space-y-3">
                  {["gaurav", "priya", "alex"].map((name) => (
                    <div key={name} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <p className="text-sm text-slate-700">@{name}</p>
                      <div className="flex items-center gap-2">
                        <Badge tone="brand">Active</Badge>
                        <Button variant="secondary">Suspend</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {section === "analytics" && (
              <Card>
                <h2 className="font-display text-xl font-semibold">Analytics</h2>
                <p className="mt-3 text-sm text-slate-600">Add charts for DAU, moderation volume, and top content trends.</p>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
