import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { apiClientCore } from "../services/api/client";
import { useToast } from "../contexts/ToastContext";

export default function SettingsTopics() {
  const { showToast } = useToast();
  const [allTopics, setAllTopics] = useState([]); // from onboarding API
  const [interests, setInterests] = useState([]); // [{tag_name, score}]
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      // load all available topics from onboarding categories
      apiClientCore.request("/api/v1/onboarding", { method: "GET" }).catch(() => ({ categories: [] })),
      // load existing user interest scores
      apiClientCore.request("/api/v1/user/interests/full", { method: "GET" }).catch(() => []),
    ]).then(([onboarding, existingInterests]) => {
      // flatten categories → topics into a tag list
      const topics = [];
      for (const cat of onboarding.categories || []) {
        for (const topic of cat.topics || []) {
          topics.push({ id: topic.id, name: topic.name, slug: topic.slug, category: cat.name });
        }
      }
      setAllTopics(topics);

      // map existing interests — tag_name → score
      const interestMap = {};
      for (const i of existingInterests) {
        interestMap[i.tag_name.toLowerCase()] = i.score;
      }

      // pre-select topics that already have an interest score
      const tracked = existingInterests.map((i) => ({
        tag_name: i.tag_name,
        score: i.score,
      }));
      setInterests(tracked);
      setLoading(false);
    });
  }, []);

  const trackedNames = new Set(interests.map((i) => i.tag_name.toLowerCase()));

  const addTopic = (topic) => {
    const name = topic.name.toLowerCase();
    if (trackedNames.has(name)) return;
    setInterests((prev) => [...prev, { tag_name: name, score: 5 }]);
  };

  const removeTopic = (tag_name) => {
    setInterests((prev) => prev.filter((i) => i.tag_name !== tag_name));
  };

  const updateScore = (tag_name, score) => {
    setInterests((prev) => prev.map((i) => i.tag_name === tag_name ? { ...i, score } : i));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClientCore.request("/api/v1/user/interests/bulk", {
        method: "POST",
        body: JSON.stringify({ interests }),
      });
      showToast("Topic preferences saved! Your For You feed will update.", "success");
    } catch {
      showToast("Failed to save preferences", "error");
    } finally {
      setSaving(false);
    }
  };

  const available = allTopics.filter(
    (t) =>
      !trackedNames.has(t.name.toLowerCase()) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#e85d26] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-8 pb-20">
      <PageContainer narrow>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#1a1814]">Topic Preferences</h1>
              <p className="text-sm text-[#6b6358] mt-1">
                Set interest weights to personalise your <Link to="/for-you" className="text-[#e85d26] hover:underline">For You</Link> feed.
                Higher weight = more of that topic.
              </p>
            </div>
            <Link to="/for-you">
              <Button variant="secondary" size="sm">View For You →</Button>
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_280px]">
            {/* Tracked topics */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Your interests</p>
                <span className="text-xs text-[#a09880]">{interests.length} topics</span>
              </div>

              {interests.length === 0 ? (
                <div className="text-center py-10 text-[#a09880]">
                  <p className="text-3xl mb-2">🎯</p>
                  <p className="text-sm font-medium text-[#6b6358]">No topics yet</p>
                  <p className="text-xs mt-1">Add some from the list →</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interests.map((t, i) => (
                    <motion.div key={t.tag_name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <div className="flex items-center gap-3 rounded-xl p-3 bg-[rgba(90,80,60,0.04)] border border-[rgba(90,80,60,0.08)]">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-[#1a1814] capitalize">{t.tag_name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold w-6 text-right ${t.score >= 7 ? "text-[#e85d26]" : t.score >= 4 ? "text-amber-600" : "text-[#a09880]"}`}>
                                {t.score}
                              </span>
                              <button onClick={() => removeTopic(t.tag_name)} className="text-[#a09880] hover:text-red-500 transition-colors p-0.5 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#a09880] w-8">Low</span>
                            <input
                              type="range" min="0" max="10" step="0.5"
                              value={t.score}
                              onChange={(e) => updateScore(t.tag_name, parseFloat(e.target.value))}
                              className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
                              style={{ accentColor: "#e85d26" }}
                            />
                            <span className="text-xs text-[#a09880] w-8 text-right">High</span>
                          </div>
                          <div className="progress-bar mt-1.5">
                            <div className="progress-fill" style={{ width: `${(t.score / 10) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {interests.length > 0 && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-5 w-full text-sm py-2.5 rounded-xl font-semibold transition-all btn-primary disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save preferences"}
                </button>
              )}
            </Card>

            {/* Add topics */}
            <div className="space-y-4">
              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Add topics</p>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search topics..."
                  className="input-field mb-3 text-xs"
                />
                <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-hide">
                  {available.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => addTopic(topic)}
                      className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left hover:bg-[rgba(90,80,60,0.05)] transition-all group"
                    >
                      <span className="text-xs text-[#a09880] w-16 shrink-0 truncate">{topic.category}</span>
                      <span className="text-sm font-medium text-[#6b6358] group-hover:text-[#1a1814] flex-1">{topic.name}</span>
                      <svg className="w-3.5 h-3.5 text-[#a09880] group-hover:text-[#e85d26] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  ))}
                  {available.length === 0 && (
                    <p className="text-xs text-center text-[#a09880] py-4">
                      {search ? "No results" : allTopics.length === 0 ? "No topics configured yet" : "All topics added ✓"}
                    </p>
                  )}
                </div>
              </Card>

              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">How weights work</p>
                <div className="space-y-2">
                  {[
                    { range: "8–10", label: "High priority", color: "bg-[#e85d26]" },
                    { range: "4–7", label: "Normal", color: "bg-amber-400" },
                    { range: "1–3", label: "Low priority", color: "bg-[rgba(90,80,60,0.3)]" },
                    { range: "0", label: "Hidden from feed", color: "bg-[rgba(90,80,60,0.1)]" },
                  ].map(({ range, label, color }) => (
                    <div key={range} className="flex items-center gap-2.5">
                      <div className={`h-2 w-8 rounded-full shrink-0 ${color}`} />
                      <span className="text-xs text-[#6b6358]"><span className="font-semibold text-[#1a1814]">{range}</span> — {label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}
