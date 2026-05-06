import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

const COMMUNITIES = [
  { slug: "engineering", name: "Engineering", icon: "🛠️", desc: "System design, backend, infra, and everything that ships to prod.", members: 4200, posts: 892, tags: ["systems", "backend", "infra"], joined: true },
  { slug: "ai-ml", name: "AI & ML", icon: "🤖", desc: "LLMs, fine-tuning, MLOps, and the future of intelligence.", members: 6800, posts: 2140, tags: ["llm", "pytorch", "mlops"], joined: false },
  { slug: "product-design", name: "Product Design", icon: "🎨", desc: "UX research, design systems, and shipping products people love.", members: 2900, posts: 640, tags: ["ux", "design-systems", "figma"], joined: true },
  { slug: "fastapi", name: "FastAPI", icon: "⚡", desc: "The community for Python async APIs — tips, patterns, and war stories.", members: 1800, posts: 430, tags: ["python", "api", "async"], joined: false },
  { slug: "devops", name: "DevOps & Platform", icon: "⚙️", desc: "CI/CD, Kubernetes, observability, and keeping prod happy.", members: 3100, posts: 780, tags: ["k8s", "ci-cd", "terraform"], joined: false },
  { slug: "startup", name: "Founder Logs", icon: "🚀", desc: "Raw, honest stories from people building companies.", members: 1400, posts: 320, tags: ["startup", "growth", "lessons"], joined: false },
  { slug: "open-source", name: "Open Source", icon: "🔓", desc: "Maintainers, contributors, and everything OSS.", members: 2600, posts: 560, tags: ["oss", "contributing", "tools"], joined: false },
  { slug: "career", name: "Career & Growth", icon: "🎯", desc: "Levelling up, interviews, leadership, and navigating big tech.", members: 5200, posts: 1230, tags: ["jobs", "leadership", "interviews"], joined: false },
  { slug: "frontend", name: "Frontend", icon: "🖥️", desc: "React, Vite, performance, and everything the user touches.", members: 3900, posts: 870, tags: ["react", "css", "performance"], joined: true },
  { slug: "data-science", name: "Data Science", icon: "📊", desc: "Analytics, pipelines, notebooks, and making data legible.", members: 2200, posts: 490, tags: ["pandas", "sql", "viz"], joined: false },
];

const SORT_OPTIONS = ["Most active", "Newest", "Most members"];
const CATEGORY_FILTERS = ["All", "Technology", "Design", "Career", "Startup"];

export default function CommunityList() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most active");
  const [joined, setCommunities] = useState(COMMUNITIES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("All");

  const toggle = (slug) => {
    setCommunities((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c))
    );
  };

  const filtered = joined.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const myJoined = joined.filter((c) => c.joined);

  return (
    <div className="py-8 pb-20">
      <PageContainer>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl font-bold text-[#1a1814]">Communities</h1>
              <p className="text-sm text-[#6b6358] mt-1">Find your people. Join focused groups built around what you care about.</p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-sm px-5 py-2.5 rounded-xl"
              >
                + Create community
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main */}
          <div>
            {/* Search + sort */}
            <div className="flex gap-3 mb-5 flex-wrap">
              <div className="flex-1 relative min-w-[200px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09880]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search communities..."
                  className="input-field pl-9"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field w-auto pr-8"
              >
                {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Community cards */}
            <div className="space-y-3">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card hover>
                    <div className="flex items-start gap-4">
                      <span className="text-3xl shrink-0 mt-0.5">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Link to={`/communities/${c.slug}`}>
                            <h3 className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors">
                              {c.name}
                            </h3>
                          </Link>
                          {c.joined && (
                            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-semibold">
                              Joined
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6b6358] leading-relaxed mb-2">{c.desc}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-[#a09880]">👥 {c.members.toLocaleString()} members</span>
                          <span className="text-xs text-[#a09880]">📝 {c.posts.toLocaleString()} posts</span>
                          <div className="flex gap-1 ml-auto">
                            {c.tags.map((t) => (
                              <span key={t} className="tag-pill">#{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggle(c.slug)}
                        className={`shrink-0 text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                          c.joined
                            ? "border border-[rgba(90,80,60,0.2)] text-[#6b6358] hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                            : "btn-primary"
                        }`}
                      >
                        {c.joined ? "Leave" : "Join"}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-[#a09880]">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-semibold text-[#6b6358]">No communities match "{search}"</p>
                  <p className="text-sm mt-1">Try a different search or create your own</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Your communities */}
            {myJoined.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Your communities</p>
                  <div className="space-y-1">
                    {myJoined.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/communities/${c.slug}`}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[rgba(90,80,60,0.05)] transition-all group"
                      >
                        <span className="text-base">{c.icon}</span>
                        <span className="text-sm font-medium text-[#1a1814] group-hover:text-[#e85d26] transition-colors flex-1">{c.name}</span>
                        <span className="text-xs text-[#a09880]">{c.posts}</span>
                      </Link>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Suggested */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Trending this week</p>
                <div className="space-y-2.5">
                  {COMMUNITIES.slice(0, 4).map((c) => (
                    <Link key={c.slug} to={`/communities/${c.slug}`} className="flex items-center gap-2.5 group">
                      <span className="text-base">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1a1814] group-hover:text-[#e85d26] transition-colors">{c.name}</p>
                        <p className="text-xs text-[#a09880]">{c.members.toLocaleString()} members</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gradient-to-br from-[#e85d26] to-[#c44718] border-0 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-3">Platform stats</p>
                {[
                  { label: "Communities", value: "240+" },
                  { label: "Active members", value: "48K" },
                  { label: "Posts this week", value: "3.2K" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
                    <span className="text-xs opacity-75">{label}</span>
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                ))}
              </Card>
            </motion.div>
          </div>
        </div>
      </PageContainer>

      {/* Create community modal */}
      {showCreateModal && <CreateCommunityModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

function CreateCommunityModal({ onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [rules, setRules] = useState("");

  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="w-full max-w-lg glass-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[rgba(90,80,60,0.08)] flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#1a1814]">Create a community</h2>
          <button onClick={onClose} className="text-[#a09880] hover:text-[#6b6358] rounded-lg p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Community name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rust Programming" className="input-field" />
            {slug && <p className="text-xs text-[#a09880] mt-1">URL: nexos.dev/communities/<span className="text-[#e85d26] font-mono">{slug}</span></p>}
          </div>
          <div>
            <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="What is this community about?" className="input-field resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Community rules <span className="text-[#a09880] font-normal">(optional)</span></label>
            <textarea value={rules} onChange={(e) => setRules(e.target.value)} rows={2} placeholder="Be respectful. No spam." className="input-field resize-none" />
          </div>
          <p className="text-xs text-[#a09880] bg-[rgba(90,80,60,0.04)] rounded-lg p-3">
            You'll be the admin. Communities are public by default. You can manage members and posts from your dashboard.
          </p>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm py-2.5 rounded-xl">Cancel</button>
          <button disabled={!name || !desc} className="btn-primary flex-1 text-sm py-2.5 rounded-xl disabled:opacity-40">Create community</button>
        </div>
      </motion.div>
    </div>
  );
}
