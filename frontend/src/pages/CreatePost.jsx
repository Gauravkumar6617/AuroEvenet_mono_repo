import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useCategories } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Tabs from "../components/ui/Tabs";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const TIPS = {
  Question: ["Be specific — include what you've tried", "Add relevant tags", "Show error messages or code snippets"],
  Discussion: ["State your perspective clearly", "Invite others' opinions", "Link to relevant resources"],
  Article: ["Start with the problem you're solving", "Use headers to structure sections", "Include real examples or code"],
};

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, fetchCategories } = useCategories();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("Discussion");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category_id: "", tags: "", thumbnail: null });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchCategories();
  }, [isAuthenticated]);

  const wordCount = useMemo(() => form.content.trim().split(/\s+/).filter(Boolean).length, [form.content]);
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 180)), [wordCount]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPost({ title: form.title, content: form.content, category_id: Number(form.category_id), tags: form.tags, thumbnail: form.thumbnail });
      navigate("/blog");
    } finally { setSaving(false); }
  };

  const typeIcons = { Question: "❓", Discussion: "💬", Article: "📝" };

  return (
    <div className="py-8">
      <PageContainer narrow>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-1">New Post</p>
          <h1 className="font-display text-3xl font-bold text-[#1a1814]">Share your knowledge</h1>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <Tabs items={["Question", "Discussion", "Article"]} active={mode} onChange={setMode} />
          <div className="flex items-center gap-2">
            <Badge tone={preview ? "brand" : "neutral"}>{preview ? "Preview" : "Editing"}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setPreview(!preview)}>
              {preview ? "✏️ Edit" : "👁️ Preview"}
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <Card className="rounded-2xl">
              <label className="block mb-1.5 text-sm font-semibold text-[#1a1814]">
                {typeIcons[mode]} Title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field text-base font-semibold"
                placeholder={mode === "Question" ? "What's your question? Be specific..." : mode === "Discussion" ? "What do you want to discuss?" : "Article headline"}
                required
              />
              <p className="text-xs text-[#a09880] mt-1">{form.title.length}/150 characters</p>
            </Card>

            <Card className="rounded-2xl">
              {!preview ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-[#1a1814]">Body</label>
                    <div className="flex items-center gap-3 text-xs text-[#a09880]">
                      <span>{wordCount} words</span>
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                  <div className="mb-2 flex gap-1 border-b border-[rgba(90,80,60,0.08)] pb-2">
                    {["B", "I", "Code", "Link", "Quote", "H2", "List"].map((t) => (
                      <button key={t} type="button" className="rounded-lg px-2.5 py-1 text-xs font-bold text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] transition-all">{t}</button>
                    ))}
                  </div>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="input-field min-h-80 resize-y text-sm font-normal leading-relaxed"
                    placeholder={`Write your ${mode.toLowerCase()} here. Markdown is supported.\n\n## Context\n\nDescribe the problem or topic...\n\n## Details\n\nAdd more specifics...`}
                    required
                  />
                </>
              ) : (
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-4">{form.title || "Untitled"}</h2>
                  <div className="prose-content text-sm text-[#3a3530] leading-relaxed whitespace-pre-wrap">
                    {form.content || <span className="text-[#a09880] italic">Nothing written yet...</span>}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Post settings</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1814] mb-1.5">Category</label>
                  <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.length > 0 ? categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>) : (
                      ["Engineering", "Product", "DevOps", "Career", "Open Source", "Startup"].map(c => <option key={c} value={c}>{c}</option>)
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1814] mb-1.5">Tags</label>
                  <input className="input-field" placeholder="react, performance, frontend..." value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                  <p className="text-xs text-[#a09880] mt-1">Comma-separated, max 5 tags</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1814] mb-1.5">Cover image</label>
                  <input type="file" accept="image/*" className="input-field py-2 text-xs"
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] || null })} />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.15)]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-2">Tips for {mode}s</p>
              {TIPS[mode].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#6b6358] py-1">
                  <span className="text-[#e85d26] font-bold mt-0.5">→</span>{tip}
                </div>
              ))}
            </Card>

            <Card className="rounded-2xl">
              <div className="space-y-2">
                <Button type="button" className="w-full" onClick={submit} disabled={saving || !form.title || !form.content}>
                  {saving ? "Publishing..." : `🚀 Publish ${mode}`}
                </Button>
                <Button variant="secondary" type="button" className="w-full" onClick={() => navigate("/blog")}>
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-center text-[#a09880] mt-2">Your post will be visible immediately</p>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
