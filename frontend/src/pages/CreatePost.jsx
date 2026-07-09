import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useCategories } from "../contexts/CategoriesContext";
import { useCommunities } from "../contexts/CommunityContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { apiClient } from "../services/api";
import { aiApi } from "../services/api/aiApi";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";

const SUGGESTED_TAGS = ["react", "python", "typescript", "fastapi", "devops", "system-design", "ai", "startup", "career", "frontend"];

export default function CreatePost() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, fetchCategories } = useCategories();
  const { communities, fetchCommunities } = useCommunities();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("Question");
  const [saving, setSaving] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [aiTagSuggestions, setAiTagSuggestions] = useState([]);
  const [aiImprovements, setAiImprovements] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category_id: "", community_id: "", tags: [], thumbnail: null });
  const [onboardingCategories, setOnboardingCategories] = useState([]);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [preview, setPreview] = useState(false);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [checkingSimilar, setCheckingSimilar] = useState(false);
  const similarCheckTimer = useRef(null);
  const tagSuggestTimer = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchCategories();
    fetchCommunities();
    apiClient.getOnboardingData()
      .then((data) => {
        const loadedCategories = data?.categories || [];
        console.info("[CreatePostDebug] onboarding topics loaded", {
          categoryCount: loadedCategories.length,
          topics: loadedCategories.flatMap(cat =>
            (cat.topics || []).map(topic => ({
              categoryId: cat.id,
              categoryName: cat.name,
              topicId: topic.id,
              topicName: topic.name,
              slug: topic.slug,
              availablePosts: topic.post_count ?? 0,
            }))
          ),
        });
        setOnboardingCategories(loadedCategories);
      })
      .catch((error) => {
        console.info("[CreatePostDebug] onboarding topics unavailable", error);
      });
  }, [isAuthenticated, navigate, fetchCategories, fetchCommunities]);

  // Real AI tag suggestions, debounced as the title is typed
  useEffect(() => {
    if (tagSuggestTimer.current) clearTimeout(tagSuggestTimer.current);
    if (form.title.trim().length < 8) {
      setAiTagSuggestions([]);
      return;
    }
    tagSuggestTimer.current = setTimeout(() => {
      aiApi.suggestTags({ title: form.title, preview: form.content.slice(0, 200) })
        .then((res) => setAiTagSuggestions((res.suggested_tags || []).map((t) => t.toLowerCase())))
        .catch(() => {});
    }, 700);
    return () => clearTimeout(tagSuggestTimer.current);
  }, [form.title, form.content]);

  // Real AI duplicate-post check, debounced as the title is typed
  useEffect(() => {
    if (similarCheckTimer.current) clearTimeout(similarCheckTimer.current);
    if (form.title.trim().length < 8) {
      setSimilarPosts([]);
      return;
    }
    similarCheckTimer.current = setTimeout(() => {
      setCheckingSimilar(true);
      aiApi.checkSimilar({ title: form.title, category_id: form.category_id ? Number(form.category_id) : null })
        .then((res) => setSimilarPosts(res.matches || []))
        .catch(() => {})
        .finally(() => setCheckingSimilar(false));
    }, 900);
    return () => clearTimeout(similarCheckTimer.current);
  }, [form.title, form.category_id]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 180)), [form.content]);

  const handleEnhance = async () => {
    if (!form.title || enhancing) return;
    setEnhancing(true);
    try {
      const res = await aiApi.enhanceDraft({ title: form.title, content: form.content });
      setForm((f) => ({ ...f, title: res.title || f.title, content: res.content || f.content }));
      if (res.suggested_tags?.length) {
        setAiTagSuggestions(res.suggested_tags.map((t) => t.toLowerCase()));
      }
      setAiImprovements(res.improvements || []);
      setEnhanced(true);
      showToast("Draft enhanced by AI", "success");
    } catch (err) {
      showToast("AI enhance failed. Please try again.", "error");
    } finally {
      setEnhancing(false);
    }
  };

  const normalizeTag = (tag) => tag.trim().replace(/^#/, "").toLowerCase();

  const addTag = (tag) => {
    const normalized = normalizeTag(tag);
    if (normalized && !form.tags.includes(normalized)) {
      setForm(f => ({ ...f, tags: [...f.tags, normalized] }));
    }
  };

  const removeTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      console.info("[CreatePostDebug] publishing post", {
        title: form.title,
        categoryId: Number(form.category_id),
        communityId: form.community_id ? Number(form.community_id) : null,
        tags: form.tags,
        matchingOnboardingTopics: matchingTopicTags
          .filter(topic => form.tags.includes(topic.slug) || form.tags.includes(normalizeTag(topic.name)))
          .map(topic => ({ id: topic.id, name: topic.name, slug: topic.slug })),
      });
      await createPost({
        title: form.title,
        content: form.content,
        category_id: Number(form.category_id),
        community_id: form.community_id ? Number(form.community_id) : undefined,
        tags: form.tags.join(","),
        thumbnail: form.thumbnail
      });
      showToast("Post published successfully!", "success");
      navigate("/blog");
    } catch (err) {
      showToast("Failed to publish post. Please try again.", "error");
      console.error(err);
    } finally { setSaving(false); }
  };

  const modeHints = { Question: "Ask a specific question and add context. The more detail you give, the better answers you'll get.", Discussion: "Share a topic to discuss, debate, or get community opinions on.", Article: "Write a long-form guide, tutorial, or opinion piece for the community." };
  const selectedOnboardingCategory = onboardingCategories.find(cat => Number(cat.id) === Number(form.category_id));
  const matchingTopicTags = selectedOnboardingCategory?.topics?.length
    ? selectedOnboardingCategory.topics
    : onboardingCategories.flatMap(cat => cat.topics || []);

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
                  <button type="button" onClick={handleEnhance} disabled={!form.title || enhancing}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-50 ${enhanced ? "bg-emerald-100 text-emerald-700" : "bg-[#fdf0ea] text-[#e85d26] hover:bg-[#f0ddd1]"}`}>
                    {enhancing ? "✨ Enhancing..." : enhanced ? "✓ Enhanced" : "✨ AI Enhance"}
                  </button>
                </div>
                <input className="input-field text-base" placeholder={mode === "Question" ? "What is the best way to...?" : mode === "Discussion" ? "A topic I've been thinking about..." : "Title of your article..."} value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); setEnhanced(false); }} required />
                {aiImprovements.length > 0 && (
                  <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                    <p className="text-xs font-semibold text-emerald-700 mb-1">✨ AI improvements applied:</p>
                    <ul className="text-xs text-emerald-700 space-y-0.5">
                      {aiImprovements.map((imp, i) => <li key={i}>• {imp}</li>)}
                    </ul>
                  </div>
                )}
                {aiTagSuggestions.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[#a09880]">🤖 AI-suggested tags:</span>
                    {aiTagSuggestions.map(t => (
                      <button key={t} type="button" onClick={() => addTag(t)} className="tag-pill py-0.5 text-xs">+ #{t}</button>
                    ))}
                  </div>
                )}
                {checkingSimilar && (
                  <p className="mt-2 text-xs text-[#a09880]">🔍 Checking for similar posts...</p>
                )}
                {similarPosts.length > 0 && (
                  <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-800 mb-1.5">⚠️ Similar posts already exist — check before publishing:</p>
                    <ul className="space-y-1">
                      {similarPosts.map((m) => (
                        <li key={m.id}>
                          <Link to={`/blog/${m.id}`} target="_blank" className="text-xs text-amber-800 underline hover:text-amber-900">
                            {m.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
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
                  <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required disabled={categories.length === 0}>
                    <option value="">{categories.length === 0 ? "No categories available" : "Select a community..."}</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Community (Optional)</label>
                  <select className="input-field" value={form.community_id} onChange={(e) => setForm({ ...form, community_id: e.target.value })}>
                    <option value="">No community (Post to general feed)</option>
                    {communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 rounded-xl bg-[rgba(90,80,60,0.03)] border border-[rgba(90,80,60,0.08)]">
                    {form.tags.length === 0 && <span className="text-xs text-[#a09880] p-1">No tags added yet</span>}
                    {form.tags.map(t => (
                      <span key={t} className="tag-pill py-1 px-2.5 text-xs bg-[#fdf0ea] text-[#e85d26] flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors">✕</button>
                      </span>
                    ))}
                  </div>
                  <input className="input-field" placeholder="Type a tag and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = e.target.value.trim().replace(/^#/, '');
                        if (val) addTag(val);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUGGESTED_TAGS.slice(0, 8).map(t => (
                      <button key={t} type="button" onClick={() => addTag(t)}
                        className={`tag-pill py-1 px-2.5 text-xs transition-all ${form.tags.includes(t) ? "bg-[#e85d26] text-white opacity-50 cursor-not-allowed" : "hover:bg-[rgba(90,80,60,0.06)]"}`}>
                        #{t}
                      </button>
                    ))}
                  </div>
                  {matchingTopicTags.length > 0 && (
                    <div className="mt-3 rounded-xl border border-[rgba(232,93,38,0.15)] bg-[#fdf0ea] p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26]">Feed matching topics</p>
                        <span className="text-[11px] font-medium text-[#a09880]">
                          {selectedOnboardingCategory ? selectedOnboardingCategory.name : "All topics"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingTopicTags.map(topic => {
                          const tagValue = normalizeTag(topic.slug || topic.name);
                          const isAdded = form.tags.includes(tagValue) || form.tags.includes(normalizeTag(topic.name));
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => addTag(tagValue)}
                              className={`tag-pill py-1 px-2.5 text-xs transition-all ${isAdded ? "active opacity-70" : "bg-white hover:border-[#e85d26]"}`}
                              title={`${topic.post_count ?? 0} posts currently match this onboarding interest`}
                            >
                              {isAdded ? "✓ " : "+ "}#{tagValue}
                              <span className="ml-1 text-[10px] opacity-70">{topic.post_count ?? 0} posts</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-[#6b6358]">
                        Use these tags when a post should appear for users who selected the same popup interests.
                      </p>
                    </div>
                  )}
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
