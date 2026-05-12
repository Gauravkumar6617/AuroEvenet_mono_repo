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
import { usePosts } from "../contexts/PostsContext";
import { likesApi } from "../services/api/likesApi";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const TAGS = ["All", "Engineering", "Frontend", "Backend", "DevOps", "Security", "Startup", "AI", "Career"];
const SIDEBAR_TRENDING = [
  { title: "How does LLM context window work?", votes: 312 },
  { title: "Best practices for database indexing", votes: 248 },
  { title: "Monolith vs modular monolith in 2026", votes: 195 },
  { title: "How to do a proper technical interview prep", votes: 167 },
];

// safely extract a string from a string or an object with name/tag property
function asString(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") return val.name || val.tag || val.slug || "";
  return "";
}

// normalize API post fields to match PostCard expectations
function normalizePost(raw) {
  if (!raw) return null;
  const excerpt = raw.content
    ? raw.content.replace(/<[^>]*>/g, "").slice(0, 160) + (raw.content.length > 160 ? "…" : "")
    : "";
  const firstTag = raw.post_tags?.[0]?.tag || asString(raw.tags?.[0]) || "";
  const timeAgo = raw.created_at
    ? new Date(raw.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";
  return {
    id: raw.id,
    type: "article",
    title: raw.title,
    excerpt,
    image: raw.thumbnail_url || raw.image || "",
    category: asString(raw.category_name) || asString(raw.category) || "General",
    tag: firstTag,
    votes: raw.likes_count ?? raw.votes ?? 0,
    answers: raw.comments_count ?? raw.answers ?? 0,
    comments: raw.comments_count ?? raw.comments ?? 0,
    saves: raw.saves ?? 0,
    author: raw.author_name || raw.author || "User",
    avatar: (raw.author_name || raw.author || "U")[0]?.toUpperCase(),
    time: timeAgo,
    tags: raw.post_tags?.map((t) => t.tag) || raw.tags?.map(asString) || [],
  };
}

export default function Blog() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Hot");
  const [activeTag, setActiveTag] = useState("All");
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      fetchLikeData();
    }
  }, [posts, user]);

  const fetchLikeData = async () => {
    if (!posts) return;
    
    const counts = {};
    const likes = {};
    
    posts.forEach((post) => {
      counts[post.id] = post.like_count ?? post.likes_count ?? post.votes ?? 0;
      likes[post.id] = false;
    });

    try {
      const response = await likesApi.getLikeCounts(posts.map((post) => post.id));
      posts.forEach((post) => {
        counts[post.id] = response[post.id]?.count ?? counts[post.id];
        likes[post.id] = response[post.id]?.liked ?? false;
      });
    } catch (err) {
      console.error("Failed to load like data:", err);
    }
    
    setLikeCounts(counts);
    setUserLikes(likes);
  };

  const filtered = useMemo(() => {
    const normalizedPosts = (posts || []).map(normalizePost).filter(Boolean);
    let base = normalizedPosts.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesTag = activeTag === "All" || p.category === activeTag || p.tag === activeTag;
      return matchesQuery && matchesTag;
    });
    if (sort === "Top") return [...base].sort((a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0));
    if (sort === "New") return [...base].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    if (sort === "Unanswered") return base.filter((p) => p.comments === 0);
    return base;
  }, [posts, query, sort, activeTag, likeCounts]);

  const handleVote = async (postId) => {
    if (!user) {
      showToast("Please login to like posts", "info");
      return;
    }

    try {
      await likesApi.toggleLike(postId);
      
      // Update local state
      const currentLiked = userLikes[postId] || false;
      const currentCount = likeCounts[postId] || 0;
      
      setUserLikes(prev => ({ ...prev, [postId]: !currentLiked }));
      setLikeCounts(prev => ({ ...prev, [postId]: currentLiked ? currentCount - 1 : currentCount + 1 }));
      
      showToast(currentLiked ? "Removed like" : "Post liked!", currentLiked ? "info" : "success");
    } catch (err) {
      console.error("Failed to toggle like:", err);
      showToast("Failed to toggle like", "error");
    }
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
            {error && (
              <div className="surface rounded-2xl p-8 text-center text-red-500 mb-6">
                <p className="font-bold">Error loading posts</p>
                <p className="text-sm">{error}</p>
                <Button onClick={() => fetchPosts()} className="mt-4" variant="secondary">Try Again</Button>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="space-y-2.5">
                  {Array(5).fill(0).map((_, i) => <PostCardSkeleton key={i} />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="surface rounded-2xl p-12 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-display text-xl font-bold text-[#1a1814]">No results found</p>
                  <p className="text-sm text-[#a09880] mt-1">Try different keywords or tags</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filtered.map((post, idx) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      idx={idx} 
                      likeCount={likeCounts[post.id] || 0}
                      isLiked={userLikes[post.id] || false}
                      onLike={handleVote} 
                      typeColors={typeColor} 
                    />
                  ))}
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
