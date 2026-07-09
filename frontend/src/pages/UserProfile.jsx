import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { postsApi } from "../services/api/postsApi";
import { communitiesApi } from "../services/api/communitiesApi";
import { userApi } from "../services/api/userApi";
import { commentsApi } from "../services/api/commentsApi";
import { apiClientCore } from "../services/api/client";
import { useToast } from "../contexts/ToastContext";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function TypeBadge({ type }) {
  const map = {
    article: { label: "Article", color: "bg-[#fdf0ea] text-[#e85d26]" },
    discussion: { label: "Discussion", color: "bg-emerald-50 text-emerald-700" },
    question: { label: "Question", color: "bg-blue-50 text-blue-700" },
  };
  const { label, color } = map[type] || map.article;
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{label}</span>;
}

export default function UserProfile() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [stats, setStats] = useState({ followers_count: 0, following_count: 0 });

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [interests, setInterests] = useState([]);

  const isOwn = me?.username === username;

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    if (isOwn && me) {
      Promise.all([
        postsApi.getMyPosts().catch(() => []),
        communitiesApi.getMyCommunities().catch(() => []),
        userApi.getMyInterests().catch(() => []),
        commentsApi.getMyComments().catch(() => []),
        authApi_getProfile(),
      ]).then(([p, c, i, cm, profile]) => {
        if (profile?.id) {
          apiClientCore.request(`/api/v1/social/stats/${profile.id}`, { method: "GET" }, false, null, false, false)
            .then(setStats).catch(() => {});
        }
        setPosts(p.map((post) => ({
          id: post.id, title: post.title, slug: post.slug,
          votes: post.like_count || 0, comments: post.comment_count || 0,
          views: post.view_count || 0, time: timeAgo(post.created_at),
          type: post.category_name?.toLowerCase().includes("discuss") ? "discussion" : "article",
          tags: post.tags || [],
        })));
        setCommunities(c.map((com) => ({ name: com.name, slug: com.slug, icon_url: com.icon_url, members_count: com.members_count })));
        setInterests(i);
        setComments(cm.map((c) => ({
          id: c.id,
          post_title: c.post_title || `Post #${c.post_id}`,
          post_slug: c.post_slug || String(c.post_id),
          body: c.content,
          time: timeAgo(c.created_at),
        })));
        setLoading(false);
      });
    } else {
      apiClientCore.request(`/api/v1/user/public/${username}`, { method: "GET" }, false, null, false, false)
        .then((data) => {
          setProfileUser(data.user);
          setPosts(data.posts.map((p) => ({
            id: p.id, title: p.title, slug: p.slug,
            votes: p.like_count || 0, comments: p.comment_count || 0,
            views: p.view_count || 0, time: timeAgo(p.created_at),
            type: "article", tags: p.tags || [],
          })));
          setComments(data.comments.map((c) => ({
            id: c.id,
            post_title: c.post_title || `Post #${c.post_id}`,
            post_slug: c.post_slug || String(c.post_id),
            body: c.content, time: timeAgo(c.created_at),
          })));
          setCommunities(data.communities);
          setInterests(data.interests);

          // fetch real follower/following counts
          if (data.user?.id) {
            apiClientCore.request(`/api/v1/social/stats/${data.user.id}`, { method: "GET" }, false, null, false, false)
              .then(setStats).catch(() => {});
            // check if current user is following this profile
            if (me) {
              apiClientCore.request(`/api/v1/social/is-following/${data.user.id}`, { method: "GET" })
                .then((r) => setIsFollowing(r.is_following)).catch(() => {});
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [username, isOwn]);

  // helper to get own profile id
  function authApi_getProfile() {
    return apiClientCore.request("/api/v1/user/profile", { method: "GET" }).catch(() => null);
  }

  const handleFollow = async () => {
    if (!profileUser?.id || followLoading) return;
    setFollowLoading(true);
    try {
      const res = await apiClientCore.request(`/api/v1/social/follow/${profileUser.id}`, { method: "POST" });
      setIsFollowing(res.action === "followed");
      setStats(res.stats);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update follow status", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  const profile = (() => {
    const src = isOwn ? me : profileUser;
    if (!src) return null;
    return {
      username: src.username,
      full_name: src.full_name || src.username,
      avatar: (src.full_name?.[0] || src.username?.[0] || "U").toUpperCase(),
      avatar_url: src.avatar_url || null,
      bio: src.bio || "",
      location: src.location || "",
      website: src.website || "",
      joined: src.created_at
        ? new Date(src.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
        : "Recently",
      role: src.role || "user",
      karma: posts.reduce((s, p) => s + p.votes, 0),
      posts_count: posts.length,
    };
  })();

  const tabs = [
    { key: "posts", label: "Posts", count: posts.length },
    { key: "comments", label: "Comments", count: comments.length },
    { key: "communities", label: "Communities", count: communities.length },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#e85d26] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#a09880]">User not found.</p>
      </div>
    );
  }

  return (
    <div className="py-8 pb-20">
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* ── Left: Profile card ── */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Card>
                <div className="flex flex-col items-center text-center pb-4 border-b border-[rgba(90,80,60,0.08)]">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username}
                      className="h-20 w-20 rounded-full object-cover mb-3 ring-4 ring-[rgba(232,93,38,0.15)]" />
                  ) : (
                    <div className="avatar h-20 w-20 text-2xl mb-3 ring-4 ring-[rgba(232,93,38,0.15)]">
                      {profile.avatar}
                    </div>
                  )}
                  <h1 className="font-display text-xl font-bold text-[#1a1814]">{profile.full_name}</h1>
                  <p className="text-sm text-[#a09880] mb-3">@{profile.username}</p>

                  {isOwn ? (
                    <Link to="/edit-profile" className="btn-secondary text-xs px-4 py-2 rounded-lg w-full text-center">
                      Edit profile
                    </Link>
                  ) : (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading || !me}
                      className={`w-full text-xs px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-60 ${isFollowing ? "btn-secondary" : "btn-primary"}`}
                    >
                      {followLoading ? "…" : isFollowing ? "Following ✓" : "Follow"}
                    </button>
                  )}
                </div>

                {/* Stats — real follower/following counts */}
                <div className="grid grid-cols-3 py-3 border-b border-[rgba(90,80,60,0.08)]">
                  {[
                    { label: "Posts", value: profile.posts_count },
                    { label: "Followers", value: stats.followers_count },
                    { label: "Following", value: stats.following_count },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-base font-bold text-[#1a1814]">{value}</p>
                      <p className="text-xs text-[#a09880]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Bio + meta */}
                <div className="pt-3 space-y-2.5">
                  {profile.bio && <p className="text-sm text-[#6b6358] leading-relaxed">{profile.bio}</p>}
                  {[
                    { icon: "📍", text: profile.location },
                    { icon: "🔗", text: profile.website, href: profile.website },
                    { icon: "📅", text: `Joined ${profile.joined}` },
                  ].map(({ icon, text, href }) => text && (
                    <div key={text} className="flex items-center gap-2 text-xs text-[#a09880]">
                      <span>{icon}</span>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#e85d26] hover:underline truncate">{text}</a>
                      ) : (
                        <span>{text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {interests.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
                <Card>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </Card>
              </motion.div>
            )}

            {communities.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
                <Card>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Communities</p>
                  <div className="space-y-2">
                    {communities.map((c) => (
                      <Link key={c.slug} to={`/communities/${c.slug}`}
                        className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-[rgba(90,80,60,0.05)] transition-all group">
                        {c.icon_url
                          ? <img src={c.icon_url} className="h-6 w-6 rounded object-cover" alt={c.name} />
                          : <span className="text-base">🌐</span>}
                        <span className="text-sm font-medium text-[#1a1814] group-hover:text-[#e85d26] transition-colors">{c.name}</span>
                        <svg className="ml-auto w-3.5 h-3.5 text-[#a09880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* ── Right: Activity ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
              <div className="flex gap-1 border-b border-[rgba(90,80,60,0.1)] mb-5">
                {tabs.map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all ${
                      tab === t.key ? "border-[#e85d26] text-[#e85d26]" : "border-transparent text-[#a09880] hover:text-[#6b6358]"
                    }`}>
                    {t.label}
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${tab === t.key ? "bg-[#fdf0ea] text-[#e85d26]" : "bg-[rgba(90,80,60,0.07)] text-[#a09880]"}`}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              {tab === "posts" && (
                <div className="space-y-3">
                  {posts.length === 0 ? (
                    <p className="text-sm text-[#a09880] py-8 text-center">No posts yet.</p>
                  ) : posts.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Card hover>
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                            <div className="vote-btn">▲</div>
                            <span className="text-xs font-bold text-[#1a1814]">{post.votes}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <TypeBadge type={post.type} />
                              {post.tags.map((tag) => <span key={tag} className="tag-pill text-xs">#{tag}</span>)}
                            </div>
                            <Link to={`/blog/${post.slug || post.id}`}>
                              <h3 className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-3 mt-2 text-xs text-[#a09880]">
                              <span>💬 {post.comments} comments</span>
                              <span>👁️ {post.views.toLocaleString()} views</span>
                              <span className="ml-auto">{post.time}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {tab === "comments" && (
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-sm text-[#a09880] py-8 text-center">No comments yet.</p>
                  ) : comments.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Card>
                        <p className="text-xs text-[#a09880] mb-1.5">
                          On: <Link to={`/blog/${c.post_slug}`} className="text-[#e85d26] hover:underline font-medium">{c.post_title}</Link>
                        </p>
                        <p className="text-sm text-[#1a1814] leading-relaxed">{c.body}</p>
                        <p className="text-xs text-[#a09880] mt-2 text-right">{c.time}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {tab === "communities" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {communities.length === 0 ? (
                    <p className="text-sm text-[#a09880] py-8 text-center col-span-2">No communities joined yet.</p>
                  ) : communities.map((c, i) => (
                    <motion.div key={c.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link to={`/communities/${c.slug}`}>
                        <Card hover>
                          <div className="flex items-center gap-3">
                            {c.icon_url
                              ? <img src={c.icon_url} className="h-8 w-8 rounded-lg object-cover" alt={c.name} />
                              : <span className="text-2xl">🌐</span>}
                            <div>
                              <p className="text-sm font-bold text-[#1a1814]">{c.name}</p>
                              <p className="text-xs text-[#a09880]">{c.members_count?.toLocaleString()} members</p>
                            </div>
                            <svg className="ml-auto w-4 h-4 text-[#a09880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
