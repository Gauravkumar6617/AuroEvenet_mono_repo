import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useCommunities } from "../contexts/CommunityContext";
import { useEffect } from "react";
import CommunityDetailSkeleton from "../components/skeletons/CommunityDetailSkeleton";


import { communitiesApi } from "../services/api/communitiesApi";

function TypeBadge({ type }) {
  const m = { article: "bg-[#fdf0ea] text-[#e85d26]", discussion: "bg-emerald-50 text-emerald-700", question: "bg-blue-50 text-blue-700" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m[type] || m.article}`}>{type}</span>;
}

export default function CommunityDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const {
    currentCommunity,
    fetchCommunityBySlug,
    fetchCommunityPosts,
    joinCommunity,
    leaveCommunity,
    loading
  } = useCommunities();

  const [tab, setTab] = useState("posts");
  const [sort, setSort] = useState("Hot");
  const [posts, setPosts] = useState([]);
  const [communityMembers, setCommunityMembers] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchCommunityBySlug(slug);
      fetchCommunityPosts(slug).then(setPosts);
      communitiesApi.getMembers(slug).then(res => setCommunityMembers(res.members || []));
    }
  }, [slug, fetchCommunityBySlug, fetchCommunityPosts]);

  const handleToggleJoin = async () => {
    if (!currentCommunity) return;
    try {
      if (currentCommunity.joined) {
        await leaveCommunity(currentCommunity.slug);
      } else {
        await joinCommunity(currentCommunity.slug);
      }
      fetchCommunityBySlug(slug);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !currentCommunity) return <CommunityDetailSkeleton />;
  if (!currentCommunity) return <div className="py-20 text-center">Community not found.</div>;

  const MOCK = currentCommunity;

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a1814] to-[#2d2820] border-b border-[rgba(90,80,60,0.15)]">
        <PageContainer>
          <div className="py-8 flex items-start gap-5 flex-wrap">
            <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
              {MOCK.icon_url?.startsWith("http") ? (
                <img src={MOCK.icon_url} alt={MOCK.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl">{MOCK.icon_url || "📍"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold text-white">{MOCK.name}</h1>
              <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1 max-w-xl leading-relaxed">{MOCK.description}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-xs text-[rgba(255,255,255,0.5)]">👥 {MOCK.members_count || 0} members</span>
                <span className="text-xs text-[rgba(255,255,255,0.5)]">📝 {posts.length} posts</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {user && (
                <button
                  onClick={handleToggleJoin}
                  className={`text-sm px-5 py-2.5 rounded-xl font-semibold transition-all ${MOCK.joined ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300" : "btn-primary"}`}
                >
                  {MOCK.joined ? "Joined ✓" : "Join community"}
                </button>
              )}
              {MOCK.joined && (
                <Link to={`/communities/${slug}/create-post`} className="btn-secondary text-sm px-4 py-2.5 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  + Post
                </Link>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="pt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main */}
          <div>
            {/* Tabs + sort */}
            <div className="flex items-center justify-between mb-4 border-b border-[rgba(90,80,60,0.1)] pb-0">
              <div className="flex">
                {["posts", "members"].map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px capitalize transition-all ${tab === t ? "border-[#e85d26] text-[#e85d26]" : "border-transparent text-[#a09880] hover:text-[#6b6358]"}`}>
                    {t}
                  </button>
                ))}
              </div>
              {tab === "posts" && (
                <div className="flex gap-1 pb-2">
                  {["Hot", "New", "Top"].map((s) => (
                    <button key={s} onClick={() => setSort(s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${sort === s ? "bg-[#fdf0ea] text-[#e85d26]" : "text-[#a09880] hover:bg-[rgba(90,80,60,0.06)]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {tab === "posts" && (
              <div className="space-y-3">
                {posts.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card hover>
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                          <div className="vote-btn">▲</div>
                          <span className="text-xs font-bold text-[#1a1814]">{post.like_count || 0}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="tag-pill">#{post.category_name || "General"}</span>
                            {post.tags?.map((t) => <span key={t} className="tag-pill">#{t}</span>)}
                          </div>
                          <Link to={`/blog/${post.slug}`}>
                            <h3 className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-xs text-[#a09880]">
                            <Link to={`/u/${post.author_name}`} className="hover:text-[#e85d26] transition-colors font-medium">@{post.author_name}</Link>
                            <span>💬 {post.comment_count || 0}</span>
                            <span className="ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "members" && (
              <div className="space-y-2">
                {communityMembers.map((m, i) => (
                  <motion.div key={m.username} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card>
                      <div className="flex items-center gap-3">
                        <div className="avatar h-9 w-9 text-sm shrink-0">{m.username?.[0].toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/u/${m.username}`} className="text-sm font-bold text-[#1a1814] hover:text-[#e85d26] transition-colors">@{m.username}</Link>
                          <p className="text-xs text-[#a09880]">Joined {new Date(m.joined_at).toLocaleDateString()}</p>
                        </div>
                        {m.role === "admin" && (
                          <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-semibold">Admin</span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {communityMembers.length === 0 && (
                  <div className="py-20 text-center text-[#a09880]">No members yet.</div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">About</p>
              <div className="space-y-2 text-xs text-[#6b6358]">
                <div className="flex justify-between"><span>Created</span><span className="font-semibold text-[#1a1814]">{new Date(MOCK.created_at).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span>Members</span><span className="font-semibold text-[#1a1814]">{MOCK.members_count || 0}</span></div>
                <div className="flex justify-between"><span>Posts</span><span className="font-semibold text-[#1a1814]">{posts.length}</span></div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880]">Rules</p>
                <Link to={`/communities/${slug}/rules`} className="text-xs text-[#e85d26] font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-[#6b6358] leading-relaxed">Be respectful. No spam. Keep discussions technical.</p>
              </div>
            </Card>

            {communityMembers.filter(m => m.role === 'admin' || m.role === 'moderator').length > 0 && (
              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Moderators</p>
                <div className="space-y-2">
                  {communityMembers.filter(m => m.role === 'admin' || m.role === 'moderator').map((m) => (
                    <Link key={m.username} to={`/u/${m.username}`} className="flex items-center gap-2.5 group">
                      <div className="avatar h-7 w-7 text-xs">{m.username?.[0].toUpperCase()}</div>
                      <span className="text-xs font-medium text-[#1a1814] group-hover:text-[#e85d26] transition-colors">@{m.username}</span>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
