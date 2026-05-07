import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";

const ALL_POSTS = [
  { id: 1, type: "question", title: "How to structure FastAPI for scale", excerpt: "A practical architecture for large Python APIs with domain-driven design and clean service boundaries.", author: "gaurav_dev", avatar: "G", category: "Backend", tag: "Python", votes: 82, comments: 19, saves: 31, time: "2h ago", answered: true },
  { id: 2, type: "discussion", title: "React Query + Zustand in 2026 — Clear split of server vs client state", excerpt: "How we eliminated prop drilling, redux boilerplate, and over-fetching in a large dashboard app.", author: "priya_fe", avatar: "P", category: "Frontend", tag: "React", votes: 64, comments: 12, saves: 18, time: "5h ago", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=60" },
  { id: 3, type: "article", title: "Reliable async jobs with Redis queues — retries, DLQs, and observability", excerpt: "Operational patterns for background job processing that actually works at scale in production.", author: "alex_ops", avatar: "A", category: "DevOps", tag: "DevOps", votes: 45, comments: 9, saves: 24, time: "1d ago" },
  { id: 4, type: "question", title: "What's the best auth strategy for a multi-tenant SaaS in 2026?", excerpt: "Comparing JWT, session tokens, and newer approaches for B2B apps. Looking for real production experience.", author: "sara_prod", avatar: "S", category: "Security", tag: "Auth", votes: 128, comments: 34, saves: 56, time: "1d ago", answered: false },
  { id: 5, type: "article", title: "Scaling from 10 to 10,000 users: lessons from a bootstrapped SaaS", excerpt: "The technical and operational decisions that actually mattered — and the ones that didn't.", author: "ravi_founder", avatar: "R", category: "Startup", tag: "Startup", votes: 203, comments: 51, saves: 89, time: "2d ago", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=60" },
  { id: 6, type: "discussion", title: "Is TypeScript's complexity worth it for small teams?", excerpt: "After 3 years of TypeScript-first development, here's my honest take on the tradeoffs.", author: "karthik_ts", avatar: "K", category: "Engineering", tag: "TypeScript", votes: 91, comments: 42, saves: 33, time: "3d ago" },
];

const TAGS = ["All", "Engineering", "Frontend", "Backend", "DevOps", "Security", "Startup", "AI", "Career"];
const SIDEBAR_TRENDING = [
  { title: "How does LLM context window work?", votes: 312 },
  { title: "Best practices for database indexing", votes: 248 },
  { title: "Monolith vs modular monolith in 2026", votes: 195 },
  { title: "How to do a proper technical interview prep", votes: 167 },
];

export default function Blog() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Hot");
  const [activeTag, setActiveTag] = useState("All");
  const [votes, setVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let base = ALL_POSTS.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesTag = activeTag === "All" || p.category === activeTag || p.tag === activeTag;
      return matchesQuery && matchesTag;
    });
    if (sort === "Top") return [...base].sort((a, b) => b.votes - a.votes);
    if (sort === "New") return [...base].sort((a, b) => a.id - b.id).reverse();
    if (sort === "Unanswered") return base.filter((p) => p.type === "question" && !p.answered);
    return base;
  }, [query, sort, activeTag]);

  const handleVote = (id, dir) => {
    setVotes(prev => {
      const cur = prev[id] || "none";
      return { ...prev, [id]: cur === dir ? "none" : dir };
    });
  };

  const typeColor = { question: "info", discussion: "success", article: "brand" };

  return (
    <div className="py-8">
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main feed */}
          <div>
            {/* Header controls */}
            <div className="mb-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09880]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input className="input-field pl-9" placeholder="Search discussions, questions, articles..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <Link to="/create-post">
                  <Button className="shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    New Post
                  </Button>
                </Link>
              </div>
              {/* Sort tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Tabs items={["Hot", "Top", "New", "Unanswered"]} active={sort} onChange={setSort} />
                <p className="text-xs text-[#a09880] font-medium">{filtered.length} posts</p>
              </div>
              {/* Tag filter */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TAGS.map((tag) => (
                  <button key={tag} onClick={() => setActiveTag(tag)}
                    className={`tag-pill whitespace-nowrap shrink-0 ${activeTag === tag ? "active" : ""}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Post list */}
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <div className="surface rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-display text-xl font-bold text-[#1a1814]">No results found</p>
                  <p className="text-sm text-[#a09880] mt-1">Try different keywords or tags</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
                  ) : (
                    filtered.map((post, idx) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        idx={idx} 
                        votes={votes} 
                        onVote={handleVote} 
                        typeColors={typeColor} 
                      />
                    ))
                  )}
                </div>
              )}
            </AnimatePresence>

            {filtered.length > 0 && (
              <div className="mt-6 text-center">
                <Button variant="secondary">Load more posts</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 hidden lg:block">
            {/* Trending */}
            <div className="surface p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">🔥 Trending</h3>
              <div className="space-y-2.5">
                {SIDEBAR_TRENDING.map((item, i) => (
                  <Link key={i} to="/blog/1" className="flex items-start gap-2.5 group">
                    <span className="font-display text-xl font-bold text-[rgba(90,80,60,0.2)] shrink-0 leading-none mt-0.5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-[#1a1814] group-hover:text-[#e85d26] transition-colors leading-snug">{item.title}</p>
                      <p className="text-xs text-[#a09880] mt-0.5">{item.votes} votes</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community rules */}
            <div className="surface p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">📋 Community</h3>
              <div className="space-y-2">
                {["Be specific and clear", "Share context and reasoning", "Credit sources", "Constructive > combative", "No self-promotion spam"].map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#6b6358]">
                    <span className="text-[#e85d26] font-bold">{i + 1}.</span>{rule}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(90,80,60,0.08)]">
                <Link to="/create-post">
                  <Button className="w-full" size="sm">Create a Post</Button>
                </Link>
              </div>
            </div>

            {/* Active members */}
            <div className="surface p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">👥 Active Now</h3>
              <div className="flex flex-wrap gap-1.5">
                {["gaurav", "priya", "alex", "sara", "ravi", "karthik", "dev", "anita"].map((name) => (
                  <div key={name} className="flex items-center gap-1.5 rounded-full bg-[rgba(90,80,60,0.05)] px-2.5 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-[#6b6358]">@{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
