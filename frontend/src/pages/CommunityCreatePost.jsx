import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { usePosts } from "../contexts/PostsContext";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";

const COMMUNITY_DATA = {
  engineering: { name: "Engineering", icon: "🛠️", desc: "System design, backend, infra, and everything that ships to prod.", members: 4200, posts: 892, color: "from-[#1a1814] to-[#2d2820]", tags: ["systems", "backend", "infra", "microservices", "observability", "postgres", "architecture"] },
  "ai-ml": { name: "AI & ML", icon: "🤖", desc: "LLMs, fine-tuning, MLOps, and the future of intelligence.", members: 6800, posts: 2140, color: "from-[#1e1b2e] to-[#2d2a4a]", tags: ["llm", "pytorch", "mlops", "fine-tuning", "transformers", "rag"] },
  "product-design": { name: "Product Design", icon: "🎨", desc: "UX research, design systems, and shipping products people love.", members: 2900, posts: 640, color: "from-[#2a1e1e] to-[#3d2a2a]", tags: ["ux", "design-systems", "figma", "user-research", "prototyping"] },
  fastapi: { name: "FastAPI", icon: "⚡", desc: "The community for Python async APIs — tips, patterns, and war stories.", members: 1800, posts: 430, color: "from-[#1a2418] to-[#2a3d28]", tags: ["python", "api", "async", "pydantic", "sqlalchemy", "openapi"] },
  devops: { name: "DevOps & Platform", icon: "⚙️", desc: "CI/CD, Kubernetes, observability, and keeping prod happy.", members: 3100, posts: 780, color: "from-[#1a1e24] to-[#2a303d]", tags: ["k8s", "ci-cd", "terraform", "observability", "helm", "argo"] },
  startup: { name: "Founder Logs", icon: "🚀", desc: "Raw, honest stories from people building companies.", members: 1400, posts: 320, color: "from-[#2a1e18] to-[#3d2e28]", tags: ["startup", "growth", "lessons", "fundraising", "bootstrapping", "product-market-fit"] },
  "open-source": { name: "Open Source", icon: "🔓", desc: "Maintainers, contributors, and everything OSS.", members: 2600, posts: 560, color: "from-[#1a1e1a] to-[#2a3d2a]", tags: ["oss", "contributing", "tools", "licensing", "community"] },
  career: { name: "Career & Growth", icon: "🎯", desc: "Levelling up, interviews, leadership, and navigating big tech.", members: 5200, posts: 1230, color: "from-[#1e2a1e] to-[#2a3d2a]", tags: ["jobs", "leadership", "interviews", "salary", "promotion", "remote-work"] },
  frontend: { name: "Frontend", icon: "🖥️", desc: "React, Vite, performance, and everything the user touches.", members: 3900, posts: 870, color: "from-[#1e1a2a] to-[#2e2a3d]", tags: ["react", "css", "performance", "vite", "typescript", "accessibility"] },
  "data-science": { name: "Data Science", icon: "📊", desc: "Analytics, pipelines, notebooks, and making data legible.", members: 2200, posts: 490, color: "from-[#1a2a2e] to-[#2a3d42]", tags: ["pandas", "sql", "viz", "jupyter", "etl", "analytics"] },
};

const COMMUNITY_RULES = {
  engineering: [
    { title: "Be constructive", body: "Critique ideas, not people. Offer solutions when pointing out problems." },
    { title: "No self-promotion spam", body: "Sharing your work is welcome, but only if it adds value to the discussion." },
    { title: "Keep discussions technical", body: "Avoid off-topic chatter. Focus on engineering practices, tools, and architecture." },
  ],
  "ai-ml": [
    { title: "Cite your sources", body: "When sharing claims about model performance or research, provide links or references." },
    { title: "No hype without substance", body: "Avoid low-effort AI hype posts. Share experiments, data, and reproducible results." },
    { title: "Respect compute costs", body: "When sharing training setups, be mindful of accessibility for smaller teams." },
  ],
  "product-design": [
    { title: "Show your work", body: "Screenshots, prototypes, and process notes make feedback more actionable." },
    { title: "Be kind to beginners", body: "Design is for everyone. Welcome questions from people learning the craft." },
    { title: "Give specific feedback", body: "Vague praise or criticism helps no one. Point to what works and why." },
  ],
  fastapi: [
    { title: "Share minimal reproducible examples", body: "When asking for help, include a small code sample that demonstrates the issue." },
    { title: "Use the docs first", body: "Check the official FastAPI documentation before asking common questions." },
    { title: "Stay on topic", body: "General Python questions are welcome, but keep the focus on API development." },
  ],
  devops: [
    { title: "Blameless post-mortems", body: "When discussing incidents, focus on systems and processes, not individuals." },
    { title: "Security by default", body: "Do not share sensitive infrastructure details, credentials, or private IPs." },
    { title: "Share runbooks", body: "If you solved a tricky ops problem, share the steps so others can learn." },
  ],
  startup: [
    { title: "Be honest", body: "Share real numbers, real struggles, and real lessons. No growth-hacking fluff." },
    { title: "No stealth pitches", body: "This is a community for learning, not a lead-generation channel." },
    { title: "Support fellow founders", body: "Building is hard. Celebrate wins and offer support during rough patches." },
  ],
  "open-source": [
    { title: "Respect maintainers' time", body: "Before opening an issue, search existing ones and provide clear reproduction steps." },
    { title: "License awareness", body: "Only share code and projects with clear, OSI-approved licenses." },
    { title: "Credit contributors", body: "When sharing a project, acknowledge the people and projects that helped you." },
  ],
  career: [
    { title: "No compensation bragging", body: "Salary discussions are welcome, but avoid one-upmanship. Share ranges and context." },
    { title: "Protect anonymity", body: "When discussing employers, avoid naming specific individuals or leaking confidential info." },
    { title: "Help others rise", body: "If you have interview experience or career advice, share it generously." },
  ],
  frontend: [
    { title: "Accessibility matters", body: "When sharing UI work, consider and mention accessibility practices." },
    { title: "Performance with proof", body: "Claims about performance improvements should include metrics or before/after data." },
    { title: "Framework agnostic respect", body: "Every framework has trade-offs. Avoid fanboyism and keep discussions balanced." },
  ],
  "data-science": [
    { title: "Reproducible notebooks", body: "Share code and data sources so others can reproduce your analysis." },
    { title: "Ethical data use", body: "Do not share datasets or insights that violate privacy or consent." },
    { title: "Interpret, don't just predict", body: "Focus on explaining models and findings, not just accuracy metrics." },
  ],
};

const POSTING_TIPS = [
  "Use a clear, specific title that summarizes your question or topic.",
  "Add code snippets, screenshots, or data to support your post.",
  "Tag with relevant keywords so the right people find it.",
  "Be respectful — everyone is here to learn and share.",
];

export default function CommunityCreatePost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { isAuthenticated, user } = useAuth();

  const community = COMMUNITY_DATA[slug] || COMMUNITY_DATA["engineering"];
  const rules = COMMUNITY_RULES[slug] || COMMUNITY_RULES["engineering"];
  const suggestedTags = community.tags || [];

  const [mode, setMode] = useState("Question");
  const [saving, setSaving] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", tags: "", thumbnail: null });
  const [preview, setPreview] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [agreedRules, setAgreedRules] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 180)), [form.content]);

  const handleEnhance = () => {
    if (!form.title) return;
    setEnhanced(true);
    setTimeout(() => {
      setForm(f => ({ ...f, title: f.title.trim().endsWith("?") ? f.title : f.title + " — detailed explanation needed" }));
    }, 500);
  };

  const addTag = (tag) => {
    const current = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    if (!current.includes(tag)) {
      setForm(f => ({ ...f, tags: [...current, tag].join(", ") }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!agreedRules) {
      setShowRules(true);
      return;
    }
    setSaving(true);
    try {
      await createPost({ title: form.title, content: form.content, tags: form.tags, thumbnail: form.thumbnail, community: slug });
      navigate(`/communities/${slug}`);
    } finally { setSaving(false); }
  };

  const modeHints = {
    Question: "Ask a specific question and add context. The more detail you give, the better answers you'll get.",
    Discussion: "Share a topic to discuss, debate, or get community opinions on.",
    Article: "Write a long-form guide, tutorial, or opinion piece for the community.",
  };

  return (
    <div className="pb-20">
      {/* Community banner */}
      <div className={`bg-gradient-to-r ${community.color} border-b border-[rgba(90,80,60,0.15)]`}>
        <PageContainer>
          <div className="py-6 flex items-center gap-4 flex-wrap">
            <span className="text-4xl">{community.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/communities/${slug}`} className="text-xs text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">← Back to {community.name}</Link>
              </div>
              <h1 className="font-display text-xl font-bold text-white mt-1">Create a post in {community.name}</h1>
              <p className="text-xs text-[rgba(255,255,255,0.6)] mt-0.5 max-w-lg leading-relaxed">{community.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[rgba(255,255,255,0.5)]">👥 {community.members.toLocaleString()} members</span>
              <span className="text-xs text-[rgba(255,255,255,0.5)]">📝 {community.posts.toLocaleString()} posts</span>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="pt-6">
          {/* Rules reminder */}
          {!agreedRules && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 surface rounded-2xl p-4 border-l-4 border-[#e85d26]">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1a1814]">Before you post — review the community rules</p>
                  <p className="text-xs text-[#6b6358] mt-0.5">Posts that break rules may be removed by moderators.</p>
                  <button onClick={() => setShowRules(!showRules)} className="text-xs text-[#e85d26] font-semibold mt-2 hover:underline">
                    {showRules ? "Hide rules" : "Show rules"}
                  </button>
                  {showRules && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2">
                      {rules.map((r, i) => (
                        <div key={r.title} className="flex items-start gap-2">
                          <span className="text-xs font-bold text-[#e85d26] shrink-0 mt-0.5">{i + 1}.</span>
                          <div>
                            <p className="text-xs font-semibold text-[#1a1814]">{r.title}</p>
                            <p className="text-xs text-[#6b6358]">{r.body}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input type="checkbox" checked={agreedRules} onChange={(e) => setAgreedRules(e.target.checked)} className="rounded border-[rgba(90,80,60,0.2)] text-[#e85d26] focus:ring-[#e85d26]" />
                    <span className="text-xs text-[#6b6358]">I agree to follow these rules</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge tone="brand">{community.name}</Badge>
              {readingTime > 1 && <Badge tone="neutral">{readingTime} min read estimate</Badge>}
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1a1814]">What do you want to share?</h2>
            <p className="text-sm text-[#6b6358] mt-1">Posts in this community are visible to all members.</p>
          </div>

          {/* Mode selector */}
          <div className="mb-5">
            <Tabs items={["Question", "Discussion", "Article"]} active={mode} onChange={setMode} />
            <p className="mt-2 text-xs text-[#a09880]">{modeHints[mode]}</p>
          </div>

          <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* Main editor */}
            <div className="space-y-4">
              <div className="surface rounded-2xl p-5">
                {/* Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-[#1a1814]">Title <span className="text-red-500">*</span></label>
                    <button type="button" onClick={handleEnhance}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${enhanced ? "bg-emerald-100 text-emerald-700" : "bg-[#fdf0ea] text-[#e85d26] hover:bg-[#f0ddd1]"}`}>
                      {enhanced ? "✓ Enhanced" : "✨ AI Enhance"}
                    </button>
                  </div>
                  <input
                    className="input-field text-base"
                    placeholder={mode === "Question" ? "What is the best way to...?" : mode === "Discussion" ? "A topic I've been thinking about..." : "Title of your article..."}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                {/* Toolbar */}
                <div className="flex gap-1 border-b border-[rgba(90,80,60,0.08)] pb-2 mb-3 overflow-x-auto">
                  {[["B", "font-bold"], ["I", "italic"], ["Code", "monospace"], ["H2", "text-lg"], ["Link", null], ["Quote", null], ["Image", null]].map(([tool]) => (
                    <button key={tool} type="button"
                      className="rounded-lg px-2.5 py-1 text-xs font-bold text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] whitespace-nowrap transition-all">{tool}</button>
                  ))}
                  <div className="ml-auto flex gap-1">
                    <button type="button" onClick={() => setPreview(!preview)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${preview ? "bg-[#fdf0ea] text-[#e85d26]" : "text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)]"}`}>
                      {preview ? "Edit" : "Preview"}
                    </button>
                  </div>
                </div>

                {preview ? (
                  <div className="prose-content min-h-56 text-sm text-[#3a3530] p-2">
                    {form.content || <span className="text-[#a09880] italic">Nothing to preview yet...</span>}
                  </div>
                ) : (
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="input-field min-h-56 resize-y text-sm leading-relaxed"
                    placeholder={`Write your ${mode.toLowerCase()} for the ${community.name} community...\n\nTip: Use **bold**, _italic_, and \`code\` for formatting.`}
                    required
                  />
                )}
              </div>

              {/* Poll section for Discussion mode */}
              {mode === "Discussion" && (
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#1a1814]">📊 Add a Poll (optional)</h3>
                  </div>
                  <div className="space-y-2">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input className="input-field text-sm flex-1" placeholder={`Option ${i + 1}...`} value={opt}
                          onChange={e => setPollOptions(p => p.map((o, j) => j === i ? e.target.value : o))} />
                        {pollOptions.length > 2 && <button type="button" onClick={() => setPollOptions(p => p.filter((_, j) => j !== i))} className="text-[#a09880] hover:text-red-500">✕</button>}
                      </div>
                    ))}
                    {pollOptions.length < 6 && (
                      <button type="button" onClick={() => setPollOptions(p => [...p, ""])} className="text-xs text-[#e85d26] font-semibold hover:underline">+ Add option</button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Community info */}
              <div className="surface rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{community.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-[#1a1814]">{community.name}</p>
                    <p className="text-xs text-[#a09880]">{community.members.toLocaleString()} members</p>
                  </div>
                </div>
                <p className="text-xs text-[#6b6358] leading-relaxed mb-3">{community.desc}</p>
                <Link to={`/communities/${slug}/rules`} className="text-xs text-[#e85d26] font-semibold hover:underline">View community rules →</Link>
              </div>

              {/* Tags */}
              <div className="surface rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#1a1814] mb-3">Tags</h3>
                <input className="input-field text-sm mb-3" placeholder="e.g. react, performance, ssr" value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                <p className="text-xs text-[#a09880] mb-2">Community-specific suggestions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map(t => (
                    <button key={t} type="button" onClick={() => addTag(t)} className="tag-pill py-0.5 text-xs">#{t}</button>
                  ))}
                </div>
              </div>

              {/* Thumbnail */}
              <div className="surface rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#1a1814] mb-3">Thumbnail (optional)</h3>
                <input type="file" accept="image/*" className="input-field py-2 text-xs text-[#6b6358]"
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] || null })} />
              </div>

              {/* Posting tips */}
              <div className="surface rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#1a1814] mb-3">💡 Posting tips</h3>
                <div className="space-y-2">
                  {POSTING_TIPS.map((tip, i) => (
                    <p key={i} className="text-xs text-[#6b6358] leading-relaxed flex items-start gap-2">
                      <span className="text-[#e85d26] shrink-0">▸</span>
                      {tip}
                    </p>
                  ))}
                </div>
              </div>

              {/* Publish box */}
              <div className="surface rounded-2xl p-5">
                <div className="mb-3 rounded-xl bg-[rgba(90,80,60,0.04)] p-3 text-xs text-[#6b6358] space-y-1">
                  <p>📌 Mode: <span className="font-semibold text-[#1a1814]">{mode}</span></p>
                  {readingTime > 1 && <p>⏱ Estimated read: <span className="font-semibold text-[#1a1814]">{readingTime} min</span></p>}
                  <p>🌍 Posting to: <span className="font-semibold text-[#1a1814]">{community.name}</span></p>
                  <p>🤖 AI will auto-suggest related posts after publishing</p>
                </div>
                {!agreedRules && (
                  <p className="text-xs text-red-500 mb-2">Please agree to the community rules before publishing.</p>
                )}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Publishing..." : "Publish to " + community.name}</Button>
                  <Button variant="secondary" type="button" onClick={() => navigate(`/communities/${slug}`)}>Cancel</Button>
                </div>
                <button type="button" className="mt-2 w-full text-xs text-[#a09880] hover:text-[#6b6358] text-center">Save as draft</button>
              </div>
            </div>
          </form>
        </div>
      </PageContainer>
    </div>
  );
}
