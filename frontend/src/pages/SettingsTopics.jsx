import { useState } from "react";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";

const ALL_TAGS = [
  { id: 1, name: "Engineering", icon: "🛠️" },
  { id: 2, name: "AI & ML", icon: "🤖" },
  { id: 3, name: "Product Design", icon: "🎨" },
  { id: 4, name: "DevOps", icon: "⚙️" },
  { id: 5, name: "Frontend", icon: "🖥️" },
  { id: 6, name: "Backend", icon: "🗄️" },
  { id: 7, name: "Open Source", icon: "🔓" },
  { id: 8, name: "Career", icon: "🎯" },
  { id: 9, name: "Startup", icon: "🚀" },
  { id: 10, name: "Data Science", icon: "📊" },
  { id: 11, name: "Security", icon: "🔐" },
  { id: 12, name: "System Design", icon: "🏗️" },
];

export default function SettingsTopics() {
  const [topics, setTopics] = useState([
    { tag_id: 1, tag_name: "Engineering", icon: "🛠️", weight: 8 },
    { tag_id: 5, tag_name: "Frontend", icon: "🖥️", weight: 6 },
    { tag_id: 2, tag_name: "AI & ML", icon: "🤖", weight: 5 },
  ]);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const addedIds = new Set(topics.map((t) => t.tag_id));

  const addTopic = (tag) => {
    if (addedIds.has(tag.id)) return;
    setTopics((prev) => [...prev, { tag_id: tag.id, tag_name: tag.name, icon: tag.icon, weight: 5 }]);
  };

  const removeTopic = (id) => setTopics((prev) => prev.filter((t) => t.tag_id !== id));

  const updateWeight = (id, weight) => {
    setTopics((prev) => prev.map((t) => (t.tag_id === id ? { ...t, weight } : t)));
    // call API: fetch('/api/v1/me/topics', { method:'POST', body: JSON.stringify({topic_id:id, weight}) ... })
  };

  const handleSave = () => {
    // batch save all
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const available = ALL_TAGS.filter(
    (t) => !addedIds.has(t.id) && t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-8 pb-20">
      <PageContainer narrow>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-[#1a1814]">Topic Preferences</h1>
            <p className="text-sm text-[#6b6358] mt-1">
              Tune your feed by setting interest weights. Higher weight = more of that topic in your feed.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_280px]">
            {/* Tracked topics */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Your interests</p>
                  <span className="text-xs text-[#a09880]">{topics.length} topics</span>
                </div>

                {topics.length === 0 && (
                  <div className="text-center py-10 text-[#a09880]">
                    <p className="text-3xl mb-2">🎯</p>
                    <p className="text-sm font-medium text-[#6b6358]">No topics yet</p>
                    <p className="text-xs mt-1">Add some from the list →</p>
                  </div>
                )}

                <div className="space-y-3">
                  {topics.map((t, i) => (
                    <motion.div key={t.tag_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <div className="flex items-center gap-3 rounded-xl p-3 bg-[rgba(90,80,60,0.04)] border border-[rgba(90,80,60,0.08)]">
                        <span className="text-xl shrink-0">{t.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-[#1a1814]">{t.tag_name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold w-6 text-right ${t.weight >= 7 ? "text-[#e85d26]" : t.weight >= 4 ? "text-amber-600" : "text-[#a09880]"}`}>
                                {t.weight}
                              </span>
                              <button onClick={() => removeTopic(t.tag_id)} className="text-[#a09880] hover:text-red-500 transition-colors p-0.5 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#a09880] w-8">Low</span>
                            <input
                              type="range" min="0" max="10" step="0.5"
                              value={t.weight}
                              onChange={(e) => updateWeight(t.tag_id, parseFloat(e.target.value))}
                              className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
                              style={{ accentColor: "#e85d26" }}
                            />
                            <span className="text-xs text-[#a09880] w-8 text-right">High</span>
                          </div>
                          {/* Visual bar */}
                          <div className="progress-bar mt-1.5">
                            <div className="progress-fill" style={{ width: `${(t.weight / 10) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {topics.length > 0 && (
                  <button
                    onClick={handleSave}
                    className={`mt-5 w-full text-sm py-2.5 rounded-xl font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "btn-primary"}`}
                  >
                    {saved ? "✓ Saved!" : "Save preferences"}
                  </button>
                )}
              </Card>
            </div>

            {/* Add topics */}
            <div>
              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Add topics</p>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search topics..."
                  className="input-field mb-3 text-xs"
                />
                <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-hide">
                  {available.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => addTopic(tag)}
                      className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left hover:bg-[rgba(90,80,60,0.05)] transition-all group"
                    >
                      <span className="text-base">{tag.icon}</span>
                      <span className="text-sm font-medium text-[#6b6358] group-hover:text-[#1a1814] flex-1">{tag.name}</span>
                      <svg className="w-3.5 h-3.5 text-[#a09880] group-hover:text-[#e85d26] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  ))}
                  {available.length === 0 && (
                    <p className="text-xs text-center text-[#a09880] py-4">{search ? "No results" : "All topics added ✓"}</p>
                  )}
                </div>
              </Card>

              <Card className="mt-4">
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
