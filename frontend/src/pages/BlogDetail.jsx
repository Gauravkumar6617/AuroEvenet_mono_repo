import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { usePosts } from "../contexts/PostsContext";
import { useEffect } from "react";


const ANSWERS = [
  {
    id: 1, author: "priya_arch", avatar: "P", votes: 48, time: "1h ago", accepted: true,
    text: `<p>Use <strong>domain-driven vertical slices</strong>, not technical layers. Each domain owns its routes, models, services, and tests.</p>
<pre><code>src/
  domains/
    auth/      ← owns routes, models, service, schemas, tests
    posts/
    users/
  core/        ← shared: config, db, middleware
  shared/      ← DTOs, utils, exceptions</code></pre>
<p>This way teams own vertical slices, not shared files. When auth breaks, only auth engineers are paged.</p>`
  },
  {
    id: 2, author: "alex_swe", avatar: "A", votes: 23, time: "90m ago", accepted: false,
    text: `<p>Agree with the vertical slice approach. I'd add: enforce DTOs at domain boundaries so internal models stay private.</p>
<p>Also add <code>src/domains/*/tests/</code> so unit tests live next to the code they test — not in a parallel tree.</p>`
  },
  {
    id: 3, author: "dev_patel", avatar: "D", votes: 15, time: "45m ago", accepted: false,
    text: `<p>One thing often missed: add API contract tests at the HTTP layer. When you refactor internals, they protect consumers.</p>
<p>We use <code>pytest-asyncio</code> + <code>httpx.AsyncClient</code> for this and it's been great.</p>`
  },
];

const RELATED = [
  "How to design API versioning strategy?",
  "Monolith vs modular monolith in 2026",
  "Best auth strategy for SaaS backends",
  "Database schema design for multi-tenant apps",
];

function Answer({ answer, depth = 0 }) {
  const [votes, setVotes] = useState(answer.votes);
  const [voted, setVoted] = useState(null);
  const [showReply, setShowReply] = useState(false);

  const handleVote = (dir) => {
    setVoted(v => {
      if (v === dir) { setVotes(answer.votes); return null; }
      setVotes(answer.votes + (dir === "up" ? 1 : -1));
      return dir;
    });
  };

  return (
    <div className={`${depth > 0 ? "ml-8 mt-3 border-l-2 border-[rgba(90,80,60,0.1)] pl-4" : ""}`}>
      <div className={`rounded-2xl border-[1.5px] p-4 ${answer.accepted ? "border-green-300 bg-green-50/50" : "border-[rgba(90,80,60,0.1)] bg-white"}`}>
        {answer.accepted && (
          <div className="flex items-center gap-1.5 mb-3 text-green-700 text-xs font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
            Accepted Answer
          </div>
        )}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button onClick={() => handleVote("up")} className={`vote-btn ${voted === "up" ? "active-up" : ""}`}>▲</button>
            <span className="text-sm font-bold text-[#1a1814]">{votes}</span>
            <button onClick={() => handleVote("down")} className={`vote-btn ${voted === "down" ? "active-down" : ""}`}>▼</button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="avatar h-7 w-7 text-xs">{answer.avatar}</div>
                <Link to={`/u/${answer.author}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors">@{answer.author}</Link>
                <span className="text-xs text-[#a09880]">{answer.time}</span>
              </div>
            </div>
            <div className="prose-content text-sm text-[#3a3530]" dangerouslySetInnerHTML={{ __html: answer.text }} />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => setShowReply(!showReply)} className="text-xs text-[#6b6358] hover:text-[#e85d26] font-medium transition-colors">Reply</button>
              <button className="text-xs text-[#6b6358] hover:text-[#6b6358] font-medium">Share</button>
            </div>
            {showReply && (
              <div className="mt-3 flex gap-2">
                <input className="input-field text-sm flex-1" placeholder={`Reply to @${answer.author}...`} />
                <Button size="sm">Post</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const { currentPost, fetchPostById, loading, error } = usePosts();
  const [reply, setReply] = useState("");
  const [postVote, setPostVote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [sortAnswers, setSortAnswers] = useState("Top");

  useEffect(() => {
    if (id) fetchPostById(Number(id));
  }, [id, fetchPostById]);

  if (loading) return <div className="py-20 text-center text-[#6b6358]">Loading post...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error: {error}</div>;
  if (!currentPost) return <div className="py-20 text-center text-[#a09880]">Post not found.</div>;

  const POST = currentPost;
  const postVotes = (POST.likes ?? POST.like_count ?? POST.votes ?? 0) + (postVote === "up" ? 1 : postVote === "down" ? -1 : 0);
  return (
    <div className="py-8">
      <PageContainer>
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm">
          <Link to="/blog" className="text-[#a09880] hover:text-[#e85d26] transition-colors">Feed</Link>
          <span className="text-[#a09880]">/</span>
          <span className="text-[#6b6358] truncate max-w-xs">{POST.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div className="space-y-4">
            {/* Post */}
            <div className="surface rounded-2xl p-5">
              <div className="flex items-start gap-4">
                {/* Vote sidebar */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 pt-1">
                  <button onClick={() => setPostVote(v => v === "up" ? null : "up")}
                    className={`vote-btn ${postVote === "up" ? "active-up" : ""}`}>▲</button>
                  <span className="text-base font-bold text-[#1a1814]">{postVotes}</span>
                  <button onClick={() => setPostVote(v => v === "down" ? null : "down")}
                    className={`vote-btn ${postVote === "down" ? "active-down" : ""}`}>▼</button>
                  <button onClick={() => setIsSaved(!isSaved)} className={`mt-1 vote-btn ${isSaved ? "active-up" : ""}`} title="Save">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  </button>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge tone="brand">{POST.category_name || "General"}</Badge>
                    {POST.tags.map(t => <span key={t} className="tag-pill">#{t}</span>)}
                  </div>
                  <h1 className="font-display text-2xl font-bold text-[#1a1814] leading-snug md:text-3xl">{POST.title}</h1>
                  <div className="flex items-center gap-3 mt-3 text-xs text-[#a09880]">
                    <div className="flex items-center gap-1.5">
                      <div className="avatar h-5 w-5" style={{ fontSize: "0.6rem" }}>{POST.author_name?.[0] || "?"}</div>
                      <Link to={`/u/${POST.author_name}`} className="font-medium text-[#6b6358] hover:text-[#e85d26] transition-colors">@{POST.author_name}</Link>
                    </div>
                    <span>{new Date(POST.created_at).toLocaleDateString()}</span>
                    <span>{(POST.view_count ?? POST.views ?? 0).toLocaleString()} views</span>
                  </div>
                  <div className="mt-5 prose-content text-sm text-[#3a3530] leading-relaxed" dangerouslySetInnerHTML={{ __html: POST.content }} />
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Button variant="secondary" size="sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">Report</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#1a1814]">{ANSWERS.length} Answers</h2>
                <select className="input-field w-36 text-xs" value={sortAnswers} onChange={e => setSortAnswers(e.target.value)}>
                  <option>Top</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
              <div className="space-y-4">
                {ANSWERS.map((a) => <Answer key={a.id} answer={a} />)}
              </div>
            </div>

            {/* Write answer */}
            <div className="surface rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">Your Answer</h3>
              <div className="mb-2 flex gap-1 border-b border-[rgba(90,80,60,0.08)] pb-2">
                {["B", "I", "Code", "Link", "Quote"].map((tool) => (
                  <button key={tool} className="rounded-lg px-2.5 py-1 text-xs font-bold text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] transition-all">{tool}</button>
                ))}
              </div>
              <textarea
                value={reply} onChange={(e) => setReply(e.target.value)}
                className="input-field min-h-36 resize-y text-sm"
                placeholder="Write a detailed answer. Include code examples, references, or your direct experience..."
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-[#a09880]">Markdown supported. Be specific and cite your experience.</p>
                <Button disabled={reply.length < 10}>
                  Post Answer
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 hidden lg:block">
            <div className="surface rounded-2xl p-4">
              <div className="flex justify-between text-xs text-[#a09880] mb-1">
                <span>Post stats</span>
              </div>
              {[
                ["Views", (POST.view_count ?? POST.views ?? 0).toLocaleString()], // Fixed line
                ["Votes", postVotes],
                ["Answers", ANSWERS.length],
                ["Saves", POST.saves ?? 0] // Fixed line
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-1.5 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                  <span className="text-xs text-[#6b6358]">{k}</span>
                  <span className="text-xs font-bold text-[#1a1814]">{v}</span>
                </div>
              ))}
            </div>
            <div className="surface rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">About the author</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="avatar h-10 w-10 text-sm">{POST.avatar}</div>
                <div>
                  <Link to={`/u/${POST.author}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors">@{POST.author}</Link>
                  <p className="text-xs text-[#a09880]">Backend Engineer · 240 posts</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">Follow</Button>
            </div>

            <div className="surface rounded-2xl p-4">
              <div className="flex justify-between text-xs text-[#a09880] mb-1">
                <span>Post stats</span>
              </div>
              {[
                ["Views", (POST.view_count ?? POST.views ?? 0).toLocaleString()],
                ["Votes", postVotes],
                ["Answers", ANSWERS.length],
                ["Saves", POST.saves ?? 0]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-1.5 border-b border-[rgba(90,80,60,0.06)] last:border-0">
                  <span className="text-xs text-[#6b6358]">{k}</span>
                  <span className="text-xs font-bold text-[#1a1814]">{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
