import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";

const MOCK_RESULTS = {
  posts: [
    { id: 1, title: "How to structure FastAPI for scale", type: "article", author: "gaurav_dev", votes: 82, time: "2d ago", tag: "Python" },
    { id: 2, title: "React Query + Zustand patterns 2026", type: "discussion", author: "priya_fe", votes: 64, time: "5d ago", tag: "React" },
  ],
  users: [
    { id: 1, name: "gaurav_dev", bio: "Backend Engineer · 34 posts · 1.2k karma", followers: 240 },
    { id: 2, name: "priya_arch", bio: "Software Architect · 89 posts · 3.1k karma", followers: 580 },
  ],
  communities: [
    { id: 1, name: "Engineering", members: 1240, posts: 4820 },
    { id: 2, name: "Frontend", members: 890, posts: 2100 },
  ],
};

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [tab, setTab] = useState("Posts");
  const [dateFilter, setDateFilter] = useState("all");

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xl">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09880]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input className="input-field pl-10" defaultValue={q} placeholder="Search everything..." />
            </div>
            <select className="input-field w-36" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
              <option value="all">Any time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
          {q && <p className="text-sm text-[#6b6358]">Results for "<strong>{q}</strong>" — {MOCK_RESULTS.posts.length + MOCK_RESULTS.users.length + MOCK_RESULTS.communities.length} found</p>}
        </div>
        <Tabs items={["Posts", "Users", "Communities"]} active={tab} onChange={setTab} variant="underline" />
        <div className="mt-5 space-y-3">
          {tab === "Posts" && MOCK_RESULTS.posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.id}`}>
              <Card hover className="post-card rounded-2xl">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <Badge tone="brand">{p.type}</Badge>
                  <span className="tag-pill">#{p.tag}</span>
                  <span className="text-xs text-[#a09880]">{p.time}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors">{p.title}</h3>
                <p className="text-xs text-[#a09880] mt-1">@{p.author} · {p.votes} votes</p>
              </Card>
            </Link>
          ))}
          {tab === "Users" && MOCK_RESULTS.users.map((u) => (
            <div key={u.id} className="surface rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar h-10 w-10 text-sm">{u.name[0].toUpperCase()}</div>
                <div>
                  <p className="font-semibold text-[#1a1814]">@{u.name}</p>
                  <p className="text-xs text-[#a09880]">{u.bio}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Follow</Button>
            </div>
          ))}
          {tab === "Communities" && MOCK_RESULTS.communities.map((c) => (
            <div key={c.id} className="surface rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1a1814]">#{c.name}</p>
                <p className="text-xs text-[#a09880]">{c.members.toLocaleString()} members · {c.posts.toLocaleString()} posts</p>
              </div>
              <Button variant="secondary" size="sm">Join</Button>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
