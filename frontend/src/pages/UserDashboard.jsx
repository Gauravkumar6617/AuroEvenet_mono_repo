import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import SidebarNav from "../components/layout/SidebarNav";
import Card from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import Button from "../components/ui/Button";

const kpis = [
  { label: "Total views", value: "12.4K" },
  { label: "Answers posted", value: "84" },
  { label: "Saved posts", value: "27" },
  { label: "Followers", value: "139" },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("overview");
  const [tab, setTab] = useState("Recent");

  return (
    <div className="py-10">
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Dashboard, {user?.username || "User"}</h1>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <SidebarNav
            title="Workspace"
            active={section}
            onChange={setSection}
            items={[
              { key: "overview", label: "Overview" },
              { key: "history", label: "Post history" },
              { key: "saved", label: "Saved content" },
              { key: "settings", label: "Settings" },
            ]}
          />
          <div className="space-y-5">
            {section === "overview" && (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {kpis.map((kpi) => (
                    <Card key={kpi.label}>
                      <p className="font-display text-2xl font-bold">{kpi.value}</p>
                      <p className="mt-1 text-sm text-slate-600">{kpi.label}</p>
                    </Card>
                  ))}
                </div>
                <Card>
                  <p className="text-sm text-slate-600">Your profile completion and engagement graph can be added here using backend analytics endpoints.</p>
                </Card>
              </>
            )}
            {section === "history" && (
              <Card>
                <Tabs items={["Recent", "Top", "Drafts"]} active={tab} onChange={setTab} />
                <div className="mt-4 space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                      {tab} post item #{item}
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {section === "saved" && <Card><p className="text-sm text-slate-600">Saved answers and discussions appear here.</p></Card>}
            {section === "settings" && <Card><p className="text-sm text-slate-600">Account and notification settings panel.</p></Card>}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
