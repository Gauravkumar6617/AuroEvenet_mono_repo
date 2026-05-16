import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Button from "../components/ui/Button";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import { usePosts } from "../contexts/PostsContext";
import { likesApi } from "../services/api/likesApi";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

function asString(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") return val.name || val.tag || val.slug || "";
  return "";
}

function normalizePost(raw) {
  if (!raw) return null;
  const excerpt = raw.content
    ? raw.content.replace(/<[^>]*>/g, "").slice(0, 160) + (raw.content.length > 160 ? "..." : "")
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

export default function ForYou() {
  const { posts, loading, error, fetchPersonalizedFeed } = usePosts();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const typeColors = { question: "info", discussion: "success", article: "brand" };

  useEffect(() => {
    fetchPersonalizedFeed().catch(() => showToast("Failed to load your personalized feed", "error"));
  }, [fetchPersonalizedFeed, showToast]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      fetchLikeData();
    }
  }, [posts, user]);

  const fetchLikeData = async () => {
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

  const personalizedPosts = useMemo(() => {
    const normalizedPosts = (posts || []).map(normalizePost).filter(Boolean);
    return normalizedPosts.filter((post) => {
      const text = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [posts, query]);

  const handleLike = async (postId) => {
    if (!user) {
      showToast("Please login to like posts", "info");
      return;
    }

    try {
      await likesApi.toggleLike(postId);
      const currentLiked = userLikes[postId] || false;
      const currentCount = likeCounts[postId] || 0;

      setUserLikes((prev) => ({ ...prev, [postId]: !currentLiked }));
      setLikeCounts((prev) => ({ ...prev, [postId]: currentLiked ? currentCount - 1 : currentCount + 1 }));
      showToast(currentLiked ? "Removed like" : "Post liked!", currentLiked ? "info" : "success");
    } catch (err) {
      console.error("Failed to toggle like:", err);
      showToast("Failed to toggle like", "error");
    }
  };

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow="Personalized"
              title="For You"
              description="Posts ranked from your topic preferences, likes, and reading history."
              className="mb-0"
            />
            <Link to="/blog">
              <Button variant="secondary">Browse all posts</Button>
            </Link>
          </div>

          <div className="mb-5">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09880]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input className="input-field pl-9" placeholder="Search your recommendations..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="surface mb-6 rounded-2xl p-8 text-center text-red-500">
              <p className="font-bold">Error loading recommendations</p>
              <p className="text-sm">{error}</p>
              <Button onClick={() => fetchPersonalizedFeed()} className="mt-4" variant="secondary">Try Again</Button>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="space-y-2.5">
                {Array(5).fill(0).map((_, i) => <PostCardSkeleton key={i} />)}
              </div>
            ) : personalizedPosts.length === 0 ? (
              <div className="surface rounded-2xl p-10 text-center">
                <p className="font-display text-xl font-bold text-[#1a1814]">Your recommendations are warming up</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#6b6358]">
                  Read or like a few posts, or choose topic preferences, and this page will become more personal.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link to="/blog"><Button>Browse posts</Button></Link>
                  <Link to="/settings/topics"><Button variant="secondary">Update topics</Button></Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {personalizedPosts.map((post, idx) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    idx={idx}
                    likeCount={likeCounts[post.id] || 0}
                    isLiked={userLikes[post.id] || false}
                    onLike={handleLike}
                    typeColors={typeColors}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </PageContainer>
    </div>
  );
}
