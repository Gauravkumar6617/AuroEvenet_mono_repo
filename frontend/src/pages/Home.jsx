import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import TerminalActivity from "../components/TerminalActivity";
import OnboardingModal from "../components/OnboardingModal";
import { useToast } from "../contexts/ToastContext";

const STATS = [
  { value: "1.9M", label: "Monthly discussions", icon: "💬" },
  { value: "82%", label: "Answer resolution rate", icon: "✅" },
  { value: "240+", label: "Active communities", icon: "🌐" },
  { value: "48K", label: "Expert contributors", icon: "🧠" },
];

const TOPICS = [
  { id: 1, name: "Engineering", count: "1.2k", icon: "🛠️", color: "bg-blue-50 text-blue-700" },
  { id: 2, name: "Product Design", count: "850", icon: "🎨", color: "bg-purple-50 text-purple-700" },
  { id: 3, name: "AI & ML", count: "2.4k", icon: "🤖", color: "bg-green-50 text-green-700" },
  { id: 4, name: "Growth", count: "500", icon: "📈", color: "bg-orange-50 text-orange-700" },
  { id: 5, name: "Founder Logs", count: "320", icon: "🚀", color: "bg-pink-50 text-pink-700" },
  { id: 6, name: "DevOps", count: "780", icon: "⚙️", color: "bg-slate-100 text-slate-700" },
  { id: 7, name: "Open Source", count: "930", icon: "🔓", color: "bg-emerald-50 text-emerald-700" },
  { id: 8, name: "Career", count: "1.1k", icon: "🎯", color: "bg-amber-50 text-amber-700" },
];

const POSTS = [
  { id: "p1", type: "question", title: "How do you handle distributed tracing in a microservices architecture?", author: "Alex Rivera", avatar: "A", category: "Engineering", votes: 142, answers: 23, time: "2h ago", tags: ["microservices", "observability"] },
  { id: "p2", type: "discussion", title: "The shift from 'Users' to 'Community Members' — why it matters", author: "Sarah Chen", avatar: "S", category: "Product", votes: 88, answers: 31, time: "4h ago", tags: ["product", "community"], image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=60" },
  { id: "p3", type: "article", title: "Scaling React applications with micro-frontends in 2026", author: "Dev Patel", avatar: "D", category: "Frontend", votes: 256, answers: 48, time: "1d ago", tags: ["react", "architecture"], image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=60" },
];

export default function Home() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
    const seen = localStorage.getItem("nexos_onboarding_done");
    if (!seen) {
      setTimeout(() => setShowOnboarding(true), 1200);
    }
  }, []);

  const typeColors = { question: "info", discussion: "success", article: "brand" };

  return (
    <div className="pb-20">
      {showOnboarding && <OnboardingModal onClose={() => { setShowOnboarding(false); localStorage.setItem("nexos_onboarding_done", "1"); }} />}

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 noise pointer-events-none opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[rgba(232,93,38,0.08)] to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageContainer>
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="animate-fadeInUp">
              <Badge tone="brand" dot>The Knowledge Network · 2026</Badge>
              <h1 className="mt-5 font-display text-5xl font-bold leading-[1.1] text-[#1a1814] md:text-6xl lg:text-7xl" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
                Where experts share{" "}
                <span className="gradient-text italic">actual insights</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[#6b6358] leading-relaxed">
                A platform combining Reddit's community energy with Quora's depth. Explore technical discussions, Q&As, and long-form articles from practitioners who actually know.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button size="lg" className="shadow-[0_4px_20px_rgba(232,93,38,0.35)]">
                    Join the community
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="secondary" size="lg">Browse Feed</Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["A", "S", "D", "K", "P"].map((l, i) => (
                    <div key={i} className="avatar h-8 w-8 text-xs border-2 border-white" style={{ background: `hsl(${i * 50 + 20}, 70%, 55%)` }}>{l}</div>
                  ))}
                </div>
                <p className="text-sm text-[#6b6358]"><span className="font-semibold text-[#1a1814]">2,400+</span> joined this week</p>
              </div>
            </div>
            <div className="animate-fadeInUp stagger-2">
              <TerminalActivity />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Stats row */}
      <section className="border-y border-[rgba(90,80,60,0.08)] bg-white/60">
        <PageContainer>
          <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center py-6 text-center ${i < 3 ? "border-r border-[rgba(90,80,60,0.08)]" : ""}`}>
                <span className="text-2xl mb-1">{stat.icon}</span>
                <p className="font-display text-3xl font-bold text-[#1a1814]">{stat.value}</p>
                <p className="mt-1 text-xs text-[#a09880] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Topics cloud */}
      <PageContainer className="mt-14">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a09880]">Explore Communities</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => <div key={i} className="skeleton h-9 w-28 rounded-full" />)
            ) : (
              TOPICS.map((topic, i) => (
                <motion.div key={topic.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog`}
                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium border border-[rgba(90,80,60,0.1)] bg-white hover:border-[#e85d26] hover:shadow-md transition-all ${topic.color}`}>
                    <span>{topic.icon}</span>
                    <span>{topic.name}</span>
                    <span className="text-xs opacity-60">{topic.count}</span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </PageContainer>

      {/* Feed preview */}
      <section className="py-16">
        <PageContainer>
          <div className="mb-8 flex items-end justify-between">
            <SectionHeader eyebrow="Trending Now" title="Top discussions" description="High-signal posts from top contributors this week." className="mb-0" />
            <Link to="/blog" className="hidden text-sm font-semibold text-[#e85d26] hover:underline md:block">View all →</Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
            ) : (
              POSTS.map((post, idx) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                  <Link to={`/blog/${post.id}`}>
                    <Card hover className="p-0 overflow-hidden rounded-2xl">
                      <div className="flex items-center gap-0">
                        {/* Vote column */}
                        <div className="flex flex-col items-center gap-1 px-4 py-4 border-r border-[rgba(90,80,60,0.07)] shrink-0">
                          <button className="vote-btn" onClick={(e) => e.preventDefault()}>▲</button>
                          <span className="text-sm font-bold text-[#1a1814]">{post.votes}</span>
                          <button className="vote-btn" onClick={(e) => e.preventDefault()}>▼</button>
                        </div>
                        {/* Content */}
                        <div className="flex flex-1 items-center gap-4 p-4 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <Badge tone={typeColors[post.type]}>{post.type}</Badge>
                              <span className="text-xs text-[#a09880]">{post.category} · {post.time}</span>
                            </div>
                            <h3 className="font-display text-lg font-semibold text-[#1a1814] line-clamp-2 leading-tight hover:text-[#e85d26] transition-colors">
                              {post.title}
                            </h3>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className="avatar h-5 w-5 text-xs" style={{ fontSize: "0.6rem" }}>{post.avatar}</div>
                                <span className="text-xs text-[#6b6358]">{post.author}</span>
                              </div>
                              <span className="text-xs text-[#a09880]">{post.answers} answers</span>
                              <div className="hidden sm:flex gap-1">
                                {post.tags.map(t => <span key={t} className="tag-pill py-0.5 px-2 text-xs">#{t}</span>)}
                              </div>
                            </div>
                          </div>
                          {post.image && (
                            <img src={post.image} alt={post.title} className="h-20 w-28 rounded-xl object-cover shrink-0 hidden sm:block" />
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-6 text-center">
            <Link to="/blog"><Button variant="secondary" size="lg">Load more discussions</Button></Link>
          </div>
        </PageContainer>
      </section>

      {/* Feature trio */}
      <section className="py-12 bg-white/40 border-y border-[rgba(90,80,60,0.08)]">
        <PageContainer>
          <SectionHeader eyebrow="Why Nexos" title="Built for serious knowledge sharing" align="center" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: "🎯", title: "Signal-first ranking", desc: "Posts ranked by community vote, expert endorsements, and answer quality — not recency or algorithmic hacks." },
              { icon: "🧵", title: "Threaded depth", desc: "Every discussion supports nested answer threads so complex topics can be explored properly, Quora-style." },
              { icon: "🏆", title: "Reputation system", desc: "Your expertise compounds. Top contributors get verified badges, boosted visibility, and community recognition." },
            ].map((f, i) => (
              <Card key={i} className={`animate-fadeInUp stagger-${i + 1}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdf0ea] text-2xl mb-4">{f.icon}</div>
                <h3 className="font-display text-xl font-bold text-[#1a1814] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6b6358] leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* CTA */}
      <PageContainer className="mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#1a1814] p-10 md:p-14 text-white">
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#e85d26]/10 blur-3xl" />
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#2563eb]/10 blur-3xl" />
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-3">Ready to contribute?</p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Share what you know.<br />Discover what you don't.</h2>
              <p className="mt-3 text-[#a09880] max-w-md">High-quality contributions are rewarded with reputation, visibility, and a community that values expertise.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link to="/create-post">
                <Button size="lg" className="w-full bg-[#e85d26] hover:bg-[#c44718] shadow-[0_4px_20px_rgba(232,93,38,0.4)]">
                  Start writing
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </Button>
              </Link>
              <Link to="/blog">
                <Button variant="ghost" size="lg" className="w-full text-[#a09880] hover:text-white hover:bg-white/10">
                  Explore feed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
