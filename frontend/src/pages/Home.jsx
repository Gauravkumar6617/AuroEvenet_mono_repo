import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import OnboardingModal from "../components/OnboardingModal";
import { useToast } from "../contexts/ToastContext";
import { usePosts } from "../contexts/PostsContext";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import { likesApi } from "../services/api/likesApi";
import { userApi } from "../services/api/userApi";

const POST_FORMATS = [
  { icon: "❓", label: "Question", desc: "Ask something specific and get answers from people who've solved it.", rotate: "-rotate-3", accent: "from-[#e85d26]/15 to-[#e85d26]/5", border: "border-[rgba(232,93,38,0.2)]" },
  { icon: "💬", label: "Discussion", desc: "Start a conversation, share an opinion, and see where the community takes it.", rotate: "rotate-2", accent: "from-[#2563eb]/15 to-[#2563eb]/5", border: "border-[rgba(37,99,235,0.2)]" },
  { icon: "📝", label: "Article", desc: "Write a long-form guide or deep-dive for people who want the full picture.", rotate: "-rotate-1", accent: "from-[#1a1814]/10 to-[#1a1814]/[0.02]", border: "border-[rgba(26,24,20,0.12)]" },
];

function HeroFormats() {
  return (
    <div className="relative space-y-4 py-4">
      {POST_FORMATS.map((f) => (
        <div
          key={f.label}
          className={`surface rounded-2xl p-4 border ${f.border} bg-gradient-to-br ${f.accent} shadow-sm hover:shadow-md hover:rotate-0 transition-all duration-300 ${f.rotate}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none">{f.icon}</span>
            <div>
              <p className="font-display text-sm font-bold text-[#1a1814]">{f.label}</p>
              <p className="mt-0.5 text-xs text-[#6b6358] leading-relaxed">{f.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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

export default function Home() {
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, fetchPosts, fetchPersonalizedFeed } = usePosts();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const onboardingStorageKey = user?.id ? `blogbyte_onboarding_skipped_${user.id}` : null;
  const onboardingDebug = (...args) => console.info("[OnboardingDebug:Home]", ...args);

  useEffect(() => {
    const loadFeed = user ? fetchPersonalizedFeed : fetchPosts;
    loadFeed().catch(() => showToast("Failed to load posts", "error"));
  }, [user, fetchPosts, fetchPersonalizedFeed]);

  useEffect(() => {
    onboardingDebug("auth check", {
      authLoading,
      hasUser: Boolean(user),
      userId: user?.id,
      onboardingStorageKey,
    });

    if (authLoading) return;

    if (!user) {
      onboardingDebug("not showing popup because user is not authenticated");
      setShowOnboarding(false);
      return;
    }

    let cancelled = false;
    const checkOnboarding = async () => {
      const skipped = onboardingStorageKey ? localStorage.getItem(onboardingStorageKey) : null;
      onboardingDebug("skip flag", { onboardingStorageKey, skipped });
      if (skipped) {
        onboardingDebug("not showing popup because skip flag exists");
        return;
      }

      try {
        const preferences = await userApi.getPreferences();
        onboardingDebug("preferences loaded", {
          count: preferences.length,
          preferences,
        });
        if (!cancelled && preferences.length === 0) {
          setTimeout(() => {
            if (!cancelled) {
              onboardingDebug("opening popup because preferences are empty");
              setShowOnboarding(true);
            }
          }, 700);
        } else if (!cancelled) {
          onboardingDebug("not showing popup because preferences already exist");
        }
      } catch (error) {
        onboardingDebug("preferences request failed, opening popup as fallback", error);
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled) {
              onboardingDebug("opening popup after preferences fallback");
              setShowOnboarding(true);
            }
          }, 700);
        }
      }
    };

    checkOnboarding();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, onboardingStorageKey]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      fetchLikeData();
    }
  }, [posts, user]);

  const fetchLikeData = async () => {
    if (!posts) return;
    
    const counts = {};
    const likes = {};
    const visiblePosts = posts.slice(0, 5);
    
    visiblePosts.forEach((post) => {
      counts[post.id] = post.like_count ?? post.likes_count ?? post.votes ?? 0;
      likes[post.id] = false;
    });

    try {
      const response = await likesApi.getLikeCounts(visiblePosts.map((post) => post.id));
      visiblePosts.forEach((post) => {
        counts[post.id] = response[post.id]?.count ?? counts[post.id];
        likes[post.id] = response[post.id]?.liked ?? false;
      });
    } catch (err) {
      console.error("Failed to load like data:", err);
    }
    
    setLikeCounts(counts);
    setUserLikes(likes);
  };

  const handleLike = async (postId) => {
    if (!user) {
      showToast("Please login to like posts", "info");
      return;
    }

    try {
      await likesApi.toggleLike(postId);
      
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

  const typeColors = { question: "info", discussion: "success", article: "brand" };

  return (
    <div className="pb-20">
      {showOnboarding && <OnboardingModal onClose={() => { onboardingDebug("popup closed", { onboardingStorageKey }); setShowOnboarding(false); if (onboardingStorageKey) localStorage.setItem(onboardingStorageKey, "1"); }} />}

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 noise pointer-events-none opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[rgba(232,93,38,0.08)] to-transparent rounded-full blur-3xl pointer-events-none" />
        <PageContainer>
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
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
            </div>
            <div className="hidden lg:block animate-fadeInUp stagger-2">
              <HeroFormats />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Feed preview */}
      <section className="py-16">
        <PageContainer>
          <div className="mb-8 flex items-end justify-between">
            <SectionHeader eyebrow={user ? "For You" : "Trending Now"} title={user ? "Recommended discussions" : "Top discussions"} description={user ? "Posts ranked from your interests and reading activity." : "High-signal posts from top contributors this week."} className="mb-0" />
            <Link to={user ? "/for-you" : "/blog"} className="hidden text-sm font-semibold text-[#e85d26] hover:underline md:block">View all →</Link>
          </div>
          <div className="space-y-3">
            {postsLoading ? (
              Array(3).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
            ) : (
              (posts || []).slice(0, 5).map((raw, idx) => {
                const post = normalizePost(raw);
                if (!post) return null;
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    idx={idx}
                    likeCount={likeCounts[post.id] || 0}
                    isLiked={userLikes[post.id] || false}
                    onLike={handleLike}
                    typeColors={typeColors}
                  />
                );
              })
            )}
          </div>
          <div className="mt-6 text-center">
            <Link to={user ? "/for-you" : "/blog"}><Button variant="secondary" size="lg">Load more discussions</Button></Link>
          </div>
        </PageContainer>
      </section>

      {/* Feature trio */}
      <section className="py-12 bg-white/40 border-y border-[rgba(90,80,60,0.08)]">
        <PageContainer>
          <SectionHeader eyebrow="Why BlogByte" title="Built for serious knowledge sharing" align="center" />
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
