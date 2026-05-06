import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

const MOCK = {
  slug: "engineering",
  name: "Engineering",
  icon: "🛠️",
  desc: "System design, backend, infra, and everything that ships to prod. A space for engineers who care about the craft.",
  rules: "1. Be constructive\n2. No self-promotion spam\n3. Keep discussions technical",
  members: 4200,
  posts: 892,
  online: 38,
  joined: true,
  created: "Jan 2024",
  moderators: [{ username: "priya_arch", avatar: "P" }, { username: "alex_swe", avatar: "A" }],
};

const POSTS = [
  { id: 1, title: "How do you handle distributed tracing in microservices?", author: "alex_swe", avatar: "A", votes: 142, comments: 23, time: "2h ago", pinned: true, type: "question", tags: ["distributed", "observability"] },
  { id: 2, title: "PostgreSQL vs CockroachDB for global SaaS — my findings after 6 months", author: "ravi_db", avatar: "R", votes: 88, comments: 31, time: "5h ago", pinned: false, type: "article", tags: ["postgres", "database"] },
  { id: 3, title: "Rant: why do people still use synchronous HTTP for internal services in 2026?", author: "dev_patel", avatar: "D", votes: 67, comments: 44, time: "8h ago", pinned: false, type: "discussion", tags: ["architecture"] },
  { id: 4, title: "Show HN: I built an open-source alternative to Datadog for small teams", author: "karthik_ai", avatar: "K", votes: 210, comments: 57, time: "1d ago", pinned: false, type: "article", tags: ["oss", "observability"] },
];

const MEMBERS = [
  { username: "priya_arch", avatar: "P", karma: 2840, role: "moderator" },
  { username: "alex_swe", avatar: "A", karma: 1920, role: "moderator" },
  { username: "ravi_db", avatar: "R", karma: 1540, role: "member" },
  { username: "dev_patel", avatar: "D", karma: 980, role: "member" },
];

function TypeBadge({ type }) {
  const m = { article: "bg-[#fdf0ea] text-[#e85d26]", discussion: "bg-emerald-50 text-emerald-700", question: "bg-blue-50 text-blue-700" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m[type] || m.article}`}>{type}</span>;
}

export default function CommunityDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [joined, setJoined] = useState(MOCK.joined);
  const [tab, setTab] = useState("posts");
  const [sort, setSort] = useState("Hot");

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a1814] to-[#2d2820] border-b border-[rgba(90,80,60,0.15)]">
        <PageContainer>
          <div className="py-8 flex items-start gap-5 flex-wrap">
            <span className="text-5xl">{MOCK.icon}</span>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold text-white">{MOCK.name}</h1>
              <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1 max-w-xl leading-relaxed">{MOCK.desc}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-xs text-[rgba(255,255,255,0.5)]">👥 {MOCK.members.toLocaleString()} members</span>
                <span className="text-xs text-[rgba(255,255,255,0.5)]">📝 {MOCK.posts.toLocaleString()} posts</span>
                <span className="text-xs text-emerald-400">● {MOCK.online} online</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {user && (
                <button
                  onClick={() => setJoined(!joined)}
                  className={`text-sm px-5 py-2.5 rounded-xl font-semibold transition-all ${joined ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300" : "btn-primary"}`}
                >
                  {joined ? "Joined ✓" : "Join community"}
                </button>
              )}
              {joined && (
                <Link to={`/communities/${slug}/create-post`} className="btn-secondary text-sm px-4 py-2.5 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  + Post
                </Link>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="pt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main */}
          <div>
            {/* Tabs + sort */}
            <div className="flex items-center justify-between mb-4 border-b border-[rgba(90,80,60,0.1)] pb-0">
              <div className="flex">
                {["posts", "members"].map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px capitalize transition-all ${tab === t ? "border-[#e85d26] text-[#e85d26]" : "border-transparent text-[#a09880] hover:text-[#6b6358]"}`}>
                    {t}
                  </button>
                ))}
              </div>
              {tab === "posts" && (
                <div className="flex gap-1 pb-2">
                  {["Hot", "New", "Top"].map((s) => (
                    <button key={s} onClick={() => setSort(s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${sort === s ? "bg-[#fdf0ea] text-[#e85d26]" : "text-[#a09880] hover:bg-[rgba(90,80,60,0.06)]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {tab === "posts" && (
              <div className="space-y-3">
                {POSTS.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card hover>
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                          <div className="vote-btn">▲</div>
                          <span className="text-xs font-bold text-[#1a1814]">{post.votes}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {post.pinned && <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-semibold">📌 Pinned</span>}
                            <TypeBadge type={post.type} />
                            {post.tags.map((t) => <span key={t} className="tag-pill">#{t}</span>)}
                          </div>
                          <Link to={`/blog/${post.id}`}>
                            <h3 className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[#a09880]">
                            <Link to={`/u/${post.author}`} className="hover:text-[#e85d26] transition-colors font-medium">@{post.author}</Link>
                            <span>💬 {post.comments}</span>
                            <span className="ml-auto">{post.time}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "members" && (
              <div className="space-y-2">
                {MEMBERS.map((m, i) => (
                  <motion.div key={m.username} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card>
                      <div className="flex items-center gap-3">
                        <div className="avatar h-9 w-9 text-sm shrink-0">{m.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/u/${m.username}`} className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors">@{m.username}</Link>
                          <p className="text-xs text-[#a09880]">⚡ {m.karma.toLocaleString()} karma</p>
                        </div>
                        {m.role === "moderator" && (
                          <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-semibold">Mod</span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">About</p>
              <div className="space-y-2 text-xs text-[#6b6358]">
                <div className="flex justify-between"><span>Created</span><span className="font-semibold text-[#1a1814]">{MOCK.created}</span></div>
                <div className="flex justify-between"><span>Members</span><span className="font-semibold text-[#1a1814]">{MOCK.members.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Posts</span><span className="font-semibold text-[#1a1814]">{MOCK.posts.toLocaleString()}</span></div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Rules</p>
                <Link to={`/communities/${slug}/rules`} className="text-xs text-[#e85d26] font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-1.5">
                {MOCK.rules.split("\n").map((r) => (
                  <p key={r} className="text-xs text-[#6b6358] leading-relaxed">{r}</p>
                ))}
              </div>
            </Card>

            <Card>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Moderators</p>
              <div className="space-y-2">
                {MOCK.moderators.map((m) => (
                  <Link key={m.username} to={`/u/${m.username}`} className="flex items-center gap-2.5 group">
                    <div className="avatar h-7 w-7 text-xs">{m.avatar}</div>
                    <span className="text-xs font-medium text-[#1a1814] group-hover:text-[#e85d26] transition-colors">@{m.username}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
