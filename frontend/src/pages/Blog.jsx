import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const POSTS = [
  { id: 1, title: "How to structure FastAPI for scale", excerpt: "A practical architecture for large Python APIs.", tag: "Python", votes: 82, comments: 19, saves: 31 },
  { id: 2, title: "React Query + Zustand in 2026", excerpt: "Clear split of server and client state patterns.", tag: "Frontend", votes: 64, comments: 12, saves: 18 },
  { id: 3, title: "Reliable async jobs with Redis queues", excerpt: "Operational patterns for retries, DLQs, and observability.", tag: "DevOps", votes: 45, comments: 9, saves: 24 },
];

export default function Blog() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("hot");

  const filtered = useMemo(() => {
    const base = POSTS.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()));
    if (sort === "top") return [...base].sort((a, b) => b.votes - a.votes);
    if (sort === "new") return [...base].reverse();
    return base;
  }, [query, sort]);

  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="Community Feed"
          title="Reddit-style discovery, Quora-style depth"
          description="Explore high-signal discussions with voting, saved posts, and threaded answers."
        />
        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input className="input-field" placeholder="Search discussions..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input-field md:w-40" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="hot">Hot</option>
            <option value="top">Top</option>
            <option value="new">New</option>
          </select>
          <Link to="/create-post">
            <Button className="w-full md:w-auto">Create Post</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {filtered.map((post, idx) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="p-0">
                <div className="grid gap-3 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-slate-200 px-2 py-1 text-sm">▲</button>
                    <span className="text-sm font-semibold text-slate-700">{post.votes}</span>
                    <button className="rounded-lg border border-slate-200 px-2 py-1 text-sm">▼</button>
                  </div>
                  <div>
                    <Link to={`/blog/${post.id}`} className="font-display text-xl font-semibold text-slate-900 hover:text-brand-700">
                      {post.title}
                    </Link>
                    <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Badge tone="brand">{post.tag}</Badge>
                      <span className="text-xs text-slate-500">{post.comments} comments</span>
                      <span className="text-xs text-slate-500">{post.saves} saves</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">Save</button>
                    <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">Share</button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
