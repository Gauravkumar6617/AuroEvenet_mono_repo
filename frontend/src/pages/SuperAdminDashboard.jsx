import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SidebarNav from "../components/layout/SidebarNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function SuperAdminDashboard() {
  const [section, setSection] = useState("overview");
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="py-10">
      <PageContainer>
        <h1 className="mb-6 font-display text-3xl font-bold">Super Admin Console</h1>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <SidebarNav
            title="Super Admin"
            active={section}
            onChange={setSection}
            items={[
              { key: "overview", label: "Overview" },
              { key: "roles", label: "Role Access" },
              { key: "platform", label: "Platform Settings" },
              { key: "danger", label: "Danger Zone" },
            ]}
          />
          <div className="space-y-4">
            {section === "overview" && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {["Users", "Posts", "Reports", "Admins"].map((item) => (
                  <Card key={item}>
                    <p className="font-display text-2xl font-bold">{Math.floor(Math.random() * 900 + 100)}</p>
                    <p className="text-sm text-slate-600">{item}</p>
                  </Card>
                ))}
              </div>
            )}
            {section === "roles" && (
              <Card>
                <h2 className="font-display text-xl font-semibold">Role assignments</h2>
                <p className="mt-3 text-sm text-slate-600">Promote/demote admin roles and audit permission scopes.</p>
              </Card>
            )}
            {section === "platform" && (
              <Card>
                <h2 className="font-display text-xl font-semibold">Platform controls</h2>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Maintenance mode</p>
                    <p className="text-xs text-slate-500">Restrict non-admin access</p>
                  </div>
                  <Button variant={maintenance ? "danger" : "secondary"} onClick={() => setMaintenance((v) => !v)}>
                    {maintenance ? "Disable" : "Enable"}
                  </Button>
                </div>
              </Card>
            )}
            {section === "danger" && (
              <Card>
                <h2 className="font-display text-xl font-semibold text-rose-700">Danger zone</h2>
                <p className="mt-3 text-sm text-slate-600">Critical actions (cache flush, session reset, cleanup) should be gated behind backend confirmations.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="danger">Flush Cache</Button>
                  <Button variant="danger">Reset Sessions</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
