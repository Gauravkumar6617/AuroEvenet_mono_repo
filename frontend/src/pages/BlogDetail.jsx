import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { usePosts } from "../contexts/PostsContext";
import { useEffect } from "react";
import BlogDetailSkeleton from "../components/skeletons/BlogDetailSkeleton";

function CommentCard({ comment, depth = 0 }) {
  const [votes, setVotes] = useState(comment.votes ?? 0);
  const [voted, setVoted] = useState(null);
  const [showReply, setShowReply] = useState(false);

  const handleVote = (dir) => {
    setVoted(v => {
      if (v === dir) { setVotes(comment.votes ?? 0); return null; }
      setVotes((comment.votes ?? 0) + (dir === "up" ? 1 : -1));
      return dir;
    });
  };

  const author = comment.author_name || comment.author || "user";
  const avatar = author[0]?.toUpperCase() || "?";
  const time = comment.created_at
    ? new Date(comment.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";

  return (
    <div className={`${depth > 0 ? "ml-8 mt-3 border-l-2 border-[rgba(90,80,60,0.1)] pl-4" : ""}`}>
      <div className="rounded-2xl border-[1.5px] border-[rgba(90,80,60,0.1)] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button onClick={() => handleVote("up")} className={`vote-btn ${voted === "up" ? "active-up" : ""}`}>▲</button>
            <span className="text-sm font-bold text-[#1a1814]">{votes}</span>
            <button onClick={() => handleVote("down")} className={`vote-btn ${voted === "down" ? "active-down" : ""}`}>▼</button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="avatar h-7 w-7 text-xs">{avatar}</div>
                <Link to={`/u/${author}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors">@{author}</Link>
                <span className="text-xs text-[#a09880]">{time}</span>
              </div>
            </div>
            <div className="prose-content text-sm text-[#3a3530]" dangerouslySetInnerHTML={{ __html: comment.content || comment.text || "" }} />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => setShowReply(!showReply)} className="text-xs text-[#6b6358] hover:text-[#e85d26] font-medium transition-colors">Reply</button>
              <button className="text-xs text-[#6b6358] hover:text-[#6b6358] font-medium">Share</button>
            </div>
            {showReply && (
              <div className="mt-3 flex gap-2">
                <input className="input-field text-sm flex-1" placeholder={`Reply to @${author}...`} />
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

  if (loading) return <BlogDetailSkeleton />;
  if (error) return (
    <div className="py-20 text-center">
      <p className="text-red-500 font-medium">Error loading post</p>
      <p className="text-sm text-[#a09880] mt-1">{error}</p>
      <Button onClick={() => fetchPostById(Number(id))} className="mt-4" variant="secondary">Try Again</Button>
    </div>
  );
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
                      <div className="avatar h-5 w-5" style={{ fontSize: "0.6rem" }}>{(POST.author_name || POST.author || "?")[0]?.toUpperCase()}</div>
                      <Link to={`/u/${POST.author_name || POST.author || "user"}`} className="font-medium text-[#6b6358] hover:text-[#e85d26] transition-colors">@{POST.author_name || POST.author || "user"}</Link>
                    </div>
                    <span>{POST.created_at ? new Date(POST.created_at).toLocaleDateString() : ""}</span>
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

            {/* Answers / Comments */}
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#1a1814]">{(POST.comments?.length ?? POST.comments_count ?? 0)} Comments</h2>
                <select className="input-field w-36 text-xs" value={sortAnswers} onChange={e => setSortAnswers(e.target.value)}>
                  <option>Top</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
              <div className="space-y-4">
                {POST.comments?.length > 0 ? (
                  POST.comments.map((c) => <CommentCard key={c.id} comment={c} />)
                ) : (
                  <div className="text-center py-8 text-[#a09880]">
                    <p className="text-2xl mb-2">💬</p>
                    <p className="font-medium">No comments yet</p>
                    <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                  </div>
                )}
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
                ["Views", (POST.view_count ?? POST.views ?? 0).toLocaleString()],
                ["Votes", postVotes],
                ["Comments", POST.comments?.length ?? POST.comments_count ?? 0],
                ["Saves", POST.saves ?? 0]
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
                <div className="avatar h-10 w-10 text-sm">{(POST.author_name || POST.author || "U")[0]?.toUpperCase()}</div>
                <div>
                  <Link to={`/u/${POST.author_name || POST.author || "user"}`} className="text-sm font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors">@{POST.author_name || POST.author || "user"}</Link>
                  <p className="text-xs text-[#a09880]">Member</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">Follow</Button>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
