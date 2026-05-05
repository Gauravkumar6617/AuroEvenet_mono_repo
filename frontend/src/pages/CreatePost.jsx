import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useCategories } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";

const SUGGESTED_TAGS = ["react", "python", "typescript", "fastapi", "devops", "system-design", "ai", "startup", "career", "frontend"];

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, fetchCategories } = useCategories();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("Question");
  const [saving, setSaving] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [aiTagSuggestions, setAiTagSuggestions] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category_id: "", tags: "", thumbnail: null });
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchCategories();
  }, [isAuthenticated, navigate, fetchCategories]);

  // Auto-suggest tags as title is typed
  useEffect(() => {
    if (form.title.length > 8) {
      const lower = form.title.toLowerCase();
      const matches = SUGGESTED_TAGS.filter(t => lower.includes(t) || t.includes(lower.split(" ")[0])).slice(0, 4);
      setAiTagSuggestions(matches);
    } else {
      setAiTagSuggestions([]);
    }
  }, [form.title]);

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
    setSaving(true);
    try {
      await createPost({ title: form.title, content: form.content, category_id: Number(form.category_id), tags: form.tags, thumbnail: form.thumbnail });
      navigate("/blog");
    } finally { setSaving(false); }
  };

  const modeHints = { Question: "Ask a specific question and add context. The more detail you give, the better answers you'll get.", Discussion: "Share a topic to discuss, debate, or get community opinions on.", Article: "Write a long-form guide, tutorial, or opinion piece for the community." };

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="brand">Create Post</Badge>
            {readingTime > 1 && <Badge tone="neutral">{readingTime} min read estimate</Badge>}
          </div>
          <h1 className="font-display text-3xl font-bold text-[#1a1814]">Publish to the community</h1>
          <p className="text-sm text-[#6b6358] mt-1">Questions, discussions, and long-form articles — all welcome.</p>
        </div>

        {/* Mode selector */}
        <div className="mb-6">
          <Tabs items={["Question", "Discussion", "Article"]} active={mode} onChange={setMode} />
          <p className="mt-2 text-xs text-[#a09880]">{modeHints[mode]}</p>
        </div>

        <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_320px]">
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
                <input className="input-field text-base" placeholder={mode === "Question" ? "What is the best way to...?" : mode === "Discussion" ? "A topic I've been thinking about..." : "Title of your article..."} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                {aiTagSuggestions.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[#a09880]">🤖 Suggested tags:</span>
                    {aiTagSuggestions.map(t => (
                      <button key={t} type="button" onClick={() => addTag(t)} className="tag-pill py-0.5 text-xs">+ #{t}</button>
                    ))}
                  </div>
                )}
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
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input-field min-h-56 resize-y text-sm leading-relaxed"
                  placeholder={`Write your ${mode.toLowerCase()}...\n\nTip: Use **bold**, _italic_, and \`code\` for formatting.`}
                  required />
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
            <div className="surface rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#1a1814] mb-3">Post Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Community / Category <span className="text-red-500">*</span></label>
                  <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                    <option value="">Select a community...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    {categories.length === 0 && (
                      <>
                        <option value="1">Engineering</option>
                        <option value="2">Frontend</option>
                        <option value="3">Backend</option>
                        <option value="4">DevOps</option>
                        <option value="5">AI & ML</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Tags (comma-separated)</label>
                  <input className="input-field" placeholder="e.g. react, performance, ssr" value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUGGESTED_TAGS.slice(0, 6).map(t => (
                      <button key={t} type="button" onClick={() => addTag(t)} className="tag-pill py-0.5 text-xs">#{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Thumbnail (optional)</label>
                  <input type="file" accept="image/*" className="input-field py-2 text-xs text-[#6b6358]"
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] || null })} />
                </div>
              </div>
            </div>

            <div className="surface rounded-2xl p-5">
              <div className="mb-3 rounded-xl bg-[rgba(90,80,60,0.04)] p-3 text-xs text-[#6b6358] space-y-1">
                <p>📌 Mode: <span className="font-semibold text-[#1a1814]">{mode}</span></p>
                {readingTime > 1 && <p>⏱ Estimated read: <span className="font-semibold text-[#1a1814]">{readingTime} min</span></p>}
                <p>🤖 AI will auto-suggest related posts after publishing</p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Publishing..." : "Publish"}</Button>
                <Button variant="secondary" type="button" onClick={() => navigate("/blog")}>Cancel</Button>
              </div>
              <button type="button" className="mt-2 w-full text-xs text-[#a09880] hover:text-[#6b6358] text-center">Save as draft</button>
            </div>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
