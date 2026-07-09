import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { usePosts } from "../contexts/PostsContext";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import BlogDetailSkeleton from "../components/skeletons/BlogDetailSkeleton";
import { commentsApi } from "../services/api/commentsApi";
import { likesApi } from "../services/api/likesApi";
import { readingHistoryApi } from "../services/api/readingHistoryApi";
import { apiClientCore } from "../services/api/client";
import { aiApi } from "../services/api/aiApi";
import { useToast } from "../contexts/ToastContext";

async function shareLink(url, title, showToast) {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (err) {
      if (err?.name === "AbortError") return; // user cancelled the native share sheet
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!", "success");
  } catch {
    showToast("Couldn't copy link", "error");
  }
}

function CommentCard({ comment, depth = 0 }) {
  const { showToast } = useToast();
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
              <button onClick={() => shareLink(`${window.location.href.split("#")[0]}#comment-${comment.id}`, "Comment on BlogByte", showToast)} className="text-xs text-[#6b6358] hover:text-[#e85d26] font-medium transition-colors">Share</button>
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
  const isNumericId = /^\d+$/.test(id || "");
  const { currentPost, fetchPostById, fetchPostBySlug, loading, error } = usePosts();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [reply, setReply] = useState("");
  const [postVote, setPostVote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [sortAnswers, setSortAnswers] = useState("Top");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [discussionSummary, setDiscussionSummary] = useState("");
  const [loadingAiInsights, setLoadingAiInsights] = useState(false);
  const readStartedAt = useRef(Date.now());
  const scrolledToBottom = useRef(false);
  const likedPost = useRef(false);

  useEffect(() => {
    if (!id) return;
    readStartedAt.current = Date.now();
    scrolledToBottom.current = false;
    likedPost.current = false;
    if (isNumericId) {
      fetchPostById(Number(id));
    } else {
      fetchPostBySlug(id);
    }
  }, [id, isNumericId, fetchPostById, fetchPostBySlug]);

  // Comments need the post's real numeric id — resolve it once the post loads
  // (matters when navigating by slug, since the URL param isn't the id).
  useEffect(() => {
    if (currentPost?.id) fetchComments(currentPost.id);
  }, [currentPost?.id]);

  useEffect(() => {
    if (!isAuthenticated || !currentPost?.id) return;
    const postId = currentPost.id;

    const markScrollDepth = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 160;
      if (scrollBottom >= threshold) scrolledToBottom.current = true;
    };

    const trackReading = () => {
      const durationSeconds = Math.max(1, Math.round((Date.now() - readStartedAt.current) / 1000));
      readingHistoryApi.trackReading({
        post_id: postId,
        duration_seconds: durationSeconds,
        scrolled_to_bottom: scrolledToBottom.current,
        liked: likedPost.current,
      }).catch(() => {});
    };

    window.addEventListener("scroll", markScrollDepth, { passive: true });
    const timer = window.setTimeout(trackReading, 8000);

    return () => {
      window.removeEventListener("scroll", markScrollDepth);
      window.clearTimeout(timer);
      trackReading();
    };
  }, [currentPost?.id, isAuthenticated]);

  useEffect(() => {
    const authorId = currentPost?.author_id;
    if (!isAuthenticated || !authorId || authorId === user?.id) {
      setIsFollowingAuthor(false);
      return;
    }
    apiClientCore.request(`/api/v1/social/is-following/${authorId}`, { method: "GET" })
      .then((r) => setIsFollowingAuthor(r.is_following))
      .catch(() => {});
  }, [currentPost?.author_id, isAuthenticated, user?.id]);

  // AI: related questions to explore next
  useEffect(() => {
    if (!currentPost?.id || !isAuthenticated) {
      setRelatedQuestions([]);
      return;
    }
    aiApi.getRelatedQuestions(currentPost.id)
      .then((r) => setRelatedQuestions(r.questions || []))
      .catch(() => {});
  }, [currentPost?.id, isAuthenticated]);

  // AI: discussion TL;DR + debate detection, once there's enough conversation to summarize
  useEffect(() => {
    if (!currentPost?.id || comments.length < 3) {
      setDiscussionSummary("");
      return;
    }
    setLoadingAiInsights(true);
    Promise.all([
      aiApi.getCommentSummary(currentPost.id).catch(() => ({ summary: "" })),
      aiApi.getDebateSummary(currentPost.id).catch(() => ({ summary: { is_debate: false } })),
    ])
      .then(([commentRes, debateRes]) => {
        const debate = debateRes.summary;
        if (debate && typeof debate === "object" && debate.is_debate) {
          setDiscussionSummary(`🔥 Lively debate (controversy ${debate.controversy_score}/100) — "${debate.side_a}" vs. "${debate.side_b}"`);
        } else {
          setDiscussionSummary(commentRes.summary || "");
        }
      })
      .finally(() => setLoadingAiInsights(false));
  }, [currentPost?.id, comments.length]);

  const handleFollowAuthor = async () => {
    if (!isAuthenticated) {
      showToast("Please sign in to follow authors", "error");
      return;
    }
    const authorId = currentPost?.author_id;
    if (!authorId || followLoading) return;
    setFollowLoading(true);
    try {
      const res = await apiClientCore.request(`/api/v1/social/follow/${authorId}`, { method: "POST" });
      setIsFollowingAuthor(res.action === "followed");
      showToast(res.action === "followed" ? "Following author" : "Unfollowed author", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update follow status", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShare = () => {
    shareLink(window.location.href, currentPost?.title || "BlogByte post", showToast);
  };

  const fetchComments = async (postId) => {
    setCommentsLoading(true);
    try {
      const data = await commentsApi.getCommentsByPostId(postId);
      setComments(data || []);
    } catch {
      // ignore comment fetch errors
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showToast("Please sign in to vote", "error");
      return;
    }
    try {
      await likesApi.createLike({ post_id: currentPost.id });
      likedPost.current = true;
      setPostVote(v => v === "up" ? null : "up");
      showToast("Post liked!", "success");
    } catch (err) {
      showToast("Failed to vote. Please try again.", "error");
    }
  };

  const handlePostComment = async () => {
    if (!isAuthenticated) {
      showToast("Please sign in to comment", "error");
      return;
    }
    if (reply.length < 3) {
      showToast("Comment must be at least 3 characters", "error");
      return;
    }
    try {
      await commentsApi.createComment({ content: reply, post_id: currentPost.id, user_id: user?.id || 0 });
      setReply("");
      fetchComments(currentPost.id);
      showToast("Comment posted!", "success");
    } catch (err) {
      showToast("Failed to post comment. Please try again.", "error");
    }
  };

  const hasRequestedPost = currentPost && (String(currentPost.id) === id || currentPost.slug === id);

  if (loading && !hasRequestedPost) return <BlogDetailSkeleton />;
  if (error) return (
    <div className="py-20 text-center">
      <p className="text-red-500 font-medium">Error loading post</p>
      <p className="text-sm text-[#a09880] mt-1">{error}</p>
      <Button onClick={() => (isNumericId ? fetchPostById(Number(id)) : fetchPostBySlug(id))} className="mt-4" variant="secondary">Try Again</Button>
    </div>
  );
  if (!hasRequestedPost) return <div className="py-20 text-center text-[#a09880]">Post not found.</div>;

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
                  <button onClick={handleLike}
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
                  {POST.thumbnail_url && (
                    <img
                      src={POST.thumbnail_url}
                      alt={POST.title}
                      className="w-full rounded-xl mt-4 mb-2 object-cover max-h-[400px]"
                      loading="lazy"
                    />
                  )}
                  <div className="mt-5 prose-content text-sm text-[#3a3530] leading-relaxed" dangerouslySetInnerHTML={{ __html: POST.content }} />
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Button variant="secondary" size="sm" onClick={handleShare}>
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
                {commentsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-[rgba(90,80,60,0.1)] p-4 bg-white animate-pulse">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="w-24 h-3 bg-gray-200 rounded" />
                          <div className="w-full h-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : comments.length > 0 ? (
                  comments.map((c) => <CommentCard key={c.id} comment={c} />)
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
                <Button onClick={handlePostComment} disabled={reply.length < 3}>
                  Post Answer
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 hidden lg:block">
            {(loadingAiInsights || discussionSummary) && (
              <div className="surface rounded-2xl p-4 bg-gradient-to-br from-[#fdf0ea] to-white border border-[rgba(232,93,38,0.15)]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-2">🤖 AI Discussion Summary</h3>
                {loadingAiInsights ? (
                  <p className="text-xs text-[#a09880]">Summarizing the conversation...</p>
                ) : (
                  <p className="text-sm text-[#3a3530] leading-relaxed">{discussionSummary}</p>
                )}
              </div>
            )}
            {relatedQuestions.length > 0 && (
              <div className="surface rounded-2xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">🤖 Related Questions</h3>
                <div className="space-y-2">
                  {relatedQuestions.map((q, i) => (
                    <Link key={i} to={`/search?q=${encodeURIComponent(q)}`} className="block text-sm text-[#1a1814] hover:text-[#e85d26] transition-colors leading-snug">
                      {q}
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
              {POST.author_id !== user?.id && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={handleFollowAuthor}
                  disabled={followLoading}
                >
                  {followLoading ? "…" : isFollowingAuthor ? "Following ✓" : "Follow"}
                </Button>
              )}
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
