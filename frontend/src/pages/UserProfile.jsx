import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useAuth } from "../contexts/AuthContext";

function generateMockUser(username) {
  const initial = username ? username[0].toUpperCase() : "U";
  const nameParts = username.split(/[_\-.]/);
  const fullName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  const karma = 500 + Math.abs(username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 4000);
  const followers = 50 + Math.abs(karma % 800);
  const following = 20 + Math.abs(karma % 300);
  const posts = 5 + Math.abs(karma % 60);
  const communitiesPool = [
    { name: "Engineering", slug: "engineering", icon: "🛠️" },
    { name: "FastAPI", slug: "fastapi", icon: "⚡" },
    { name: "System Design", slug: "system-design", icon: "🏗️" },
    { name: "AI & ML", slug: "ai-ml", icon: "🤖" },
    { name: "DevOps", slug: "devops", icon: "⚙️" },
    { name: "Frontend", slug: "frontend", icon: "🖥️" },
    { name: "Career & Growth", slug: "career", icon: "🎯" },
  ];
  const topicsPool = ["Backend", "Python", "Architecture", "DevOps", "API Design", "AI", "Frontend", "System Design", "Career", "Open Source"];
  const shuffledCommunities = [...communitiesPool].sort(() => 0.5 - Math.random()).slice(0, 2 + (karma % 3));
  const shuffledTopics = [...topicsPool].sort(() => 0.5 - Math.random()).slice(0, 3 + (karma % 4));
  return {
    username,
    full_name: fullName,
    avatar: initial,
    bio: `Engineer and community member. Passionate about ${shuffledTopics.slice(0, 3).join(", ")}. Building in public since 2024.`,
    location: karma % 2 === 0 ? "Bengaluru, India" : "Remote",
    website: `https://${username}.dev`,
    joined: ["March 2024", "Jan 2024", "Nov 2023", "June 2024"][karma % 4],
    role: "member",
    karma,
    followers,
    following,
    posts_count: posts,
    badges: karma > 2000 ? ["Top Contributor", "Early Adopter", "Helpful"] : karma > 1000 ? ["Early Adopter", "Helpful"] : ["Member"],
    communities: shuffledCommunities,
    topics: shuffledTopics,
  };
}

function generateMockPosts(username) {
  const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const titles = [
    { title: "How to structure FastAPI for scale", tags: ["fastapi", "architecture"], type: "article" },
    { title: "React Query patterns I use daily", tags: ["react", "frontend"], type: "discussion" },
    { title: "PostgreSQL indexing deep dive", tags: ["postgres", "database"], type: "article" },
    { title: "Kubernetes cost optimization in 2026", tags: ["k8s", "devops"], type: "article" },
    { title: "Why I switched from REST to gRPC", tags: ["api", "backend"], type: "discussion" },
    { title: "Building real-time collaboration with WebSockets", tags: ["websockets", "frontend"], type: "article" },
  ];
  const shuffled = [...titles].sort(() => 0.5 - Math.random()).slice(0, 3);
  return shuffled.map((t, i) => ({
    id: i + 1,
    title: t.title,
    votes: 20 + ((seed + i * 100) % 200),
    comments: 5 + ((seed + i * 50) % 40),
    views: 300 + ((seed + i * 200) % 5000),
    time: ["2d ago", "5d ago", "2w ago", "1w ago", "3d ago"][(seed + i) % 5],
    type: t.type,
    tags: t.tags,
  }));
}

function generateMockComments(username) {
  const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return [
    { id: 1, post_title: "Auth strategy for multi-tenant SaaS", body: "Great write-up! One thing to add — consider using row-level security in Postgres to enforce tenant isolation at the DB level.", votes: 5 + (seed % 40), time: "3h ago" },
    { id: 2, post_title: "Kubernetes security checklist 2026", body: "RBAC misconfiguration is still the #1 issue I see in audits. Worth adding a section on least-privilege service accounts.", votes: 5 + ((seed * 2) % 30), time: "1d ago" },
  ];
}

const MOCK_USER_STATIC = {
  username: "gaurav_dev",
  full_name: "Gaurav Sharma",
  avatar: "G",
  bio: "Senior backend engineer. Building distributed systems and occasionally breaking prod. FastAPI + PostgreSQL enthusiast.",
  location: "Bengaluru, India",
  website: "https://gaurav.dev",
  joined: "March 2024",
  role: "member",
  karma: 1840,
  followers: 312,
  following: 88,
  posts_count: 34,
  badges: ["Top Contributor", "Early Adopter", "Helpful"],
  communities: [
    { name: "Engineering", slug: "engineering", icon: "🛠️" },
    { name: "FastAPI", slug: "fastapi", icon: "⚡" },
    { name: "System Design", slug: "system-design", icon: "🏗️" },
  ],
  topics: ["Backend", "Python", "Architecture", "DevOps", "API Design"],
};

const MOCK_POSTS_STATIC = [
  { id: 1, title: "How to structure FastAPI for scale", votes: 82, comments: 19, views: 1240, time: "2d ago", type: "article", tags: ["fastapi", "architecture"] },
  { id: 2, title: "React Query patterns I use daily", votes: 45, comments: 8, views: 780, time: "5d ago", type: "discussion", tags: ["react", "frontend"] },
  { id: 3, title: "PostgreSQL indexing deep dive", votes: 124, comments: 31, views: 3200, time: "2w ago", type: "article", tags: ["postgres", "database"] },
];

const MOCK_COMMENTS_STATIC = [
  { id: 1, post_title: "Auth strategy for multi-tenant SaaS", body: "Great write-up! One thing to add — consider using row-level security in Postgres to enforce tenant isolation at the DB level.", votes: 23, time: "3h ago" },
  { id: 2, post_title: "Kubernetes security checklist 2026", body: "RBAC misconfiguration is still the #1 issue I see in audits. Worth adding a section on least-privilege service accounts.", votes: 11, time: "1d ago" },
];

function TypeBadge({ type }) {
  const map = { article: { label: "Article", color: "bg-[#fdf0ea] text-[#e85d26]" }, discussion: { label: "Discussion", color: "bg-emerald-50 text-emerald-700" }, question: { label: "Question", color: "bg-blue-50 text-blue-700" } };
  const { label, color } = map[type] || map.article;
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>{label}</span>;
}

export default function UserProfile() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [tab, setTab] = useState("posts");
  const [following, setFollowing] = useState(false);

  const profile = username === "gaurav_dev" ? MOCK_USER_STATIC : generateMockUser(username || "user");
  const posts = username === "gaurav_dev" ? MOCK_POSTS_STATIC : generateMockPosts(username || "user");
  const comments = username === "gaurav_dev" ? MOCK_COMMENTS_STATIC : generateMockComments(username || "user");
  const isOwn = me?.username === (username || profile.username);

  const tabs = [
    { key: "posts", label: "Posts", count: profile.posts_count },
    { key: "comments", label: "Comments", count: comments.length },
    { key: "communities", label: "Communities", count: profile.communities.length },
  ];

  return (
    <div className="py-8 pb-20">
      <PageContainer>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* ── Left: Profile card ─────────────────────── */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Card>
                {/* Avatar + name */}
                <div className="flex flex-col items-center text-center pb-4 border-b border-[rgba(90,80,60,0.08)]">
                  <div className="avatar h-20 w-20 text-2xl mb-3 ring-4 ring-[rgba(232,93,38,0.15)]">
                    {profile.avatar}
                  </div>
                  <h1 className="font-display text-xl font-bold text-[#1a1814]">{profile.full_name}</h1>
                  <p className="text-sm text-[#a09880] mb-2">@{profile.username}</p>
                  <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                    {profile.badges.map((b) => (
                      <span key={b} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        ✦ {b}
                      </span>
                    ))}
                  </div>

                  {isOwn ? (
                    <Link to="/dashboard" className="btn-secondary text-xs px-4 py-2 rounded-lg w-full justify-center">
                      Edit profile
                    </Link>
                  ) : (
                    <button
                      onClick={() => setFollowing(!following)}
                      className={`w-full text-xs px-4 py-2 rounded-lg font-semibold transition-all ${following ? "btn-secondary" : "btn-primary"}`}
                    >
                      {following ? "Following ✓" : "Follow"}
                    </button>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 py-3 border-b border-[rgba(90,80,60,0.08)]">
                  {[
                    { label: "Posts", value: profile.posts_count },
                    { label: "Followers", value: profile.followers },
                    { label: "Karma", value: profile.karma.toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-base font-bold text-[#1a1814]">{value}</p>
                      <p className="text-xs text-[#a09880]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Bio + meta */}
                <div className="pt-3 space-y-2.5">
                  {profile.bio && (
                    <p className="text-sm text-[#6b6358] leading-relaxed">{profile.bio}</p>
                  )}
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

            {/* Topics */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.topics.map((t) => (
                    <span key={t} className="tag-pill">{t}</span>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Communities */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
              <Card>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Communities</p>
                <div className="space-y-2">
                  {profile.communities.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/communities/${c.slug}`}
                      className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-[rgba(90,80,60,0.05)] transition-all group"
                    >
                      <span className="text-base">{c.icon}</span>
                      <span className="text-sm font-medium text-[#1a1814] group-hover:text-[#e85d26] transition-colors">{c.name}</span>
                      <svg className="ml-auto w-3.5 h-3.5 text-[#a09880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ── Right: Activity ────────────────────────── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
              {/* Tabs */}
              <div className="flex gap-1 border-b border-[rgba(90,80,60,0.1)] mb-5">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all ${
                      tab === t.key
                        ? "border-[#e85d26] text-[#e85d26]"
                        : "border-transparent text-[#a09880] hover:text-[#6b6358]"
                    }`}
                  >
                    {t.label}
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${tab === t.key ? "bg-[#fdf0ea] text-[#e85d26]" : "bg-[rgba(90,80,60,0.07)] text-[#a09880]"}`}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Posts tab */}
              {tab === "posts" && (
                <div className="space-y-3">
                  {posts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Card hover>
                        <div className="flex items-start gap-4">
                          {/* Vote column */}
                          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                            <div className="vote-btn active-up">▲</div>
                            <span className="text-xs font-bold text-[#1a1814]">{post.votes}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <TypeBadge type={post.type} />
                              {post.tags.map((tag) => (
                                <span key={tag} className="tag-pill text-xs">#{tag}</span>
                              ))}
                            </div>
                            <Link to={`/blog/${post.id}`}>
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

              {/* Comments tab */}
              {tab === "comments" && (
                <div className="space-y-3">
                  {comments.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Card>
                        <p className="text-xs text-[#a09880] mb-1.5">
                          On: <Link to="/blog/1" className="text-[#e85d26] hover:underline font-medium">{c.post_title}</Link>
                        </p>
                        <p className="text-sm text-[#1a1814] leading-relaxed">{c.body}</p>
                        <div className="flex items-center gap-3 mt-2.5 text-xs text-[#a09880]">
                          <span className="flex items-center gap-1"><span className="text-[#e85d26]">▲</span> {c.votes}</span>
                          <span className="ml-auto">{c.time}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Communities tab */}
              {tab === "communities" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {profile.communities.map((c, i) => (
                    <motion.div key={c.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link to={`/communities/${c.slug}`}>
                        <Card hover>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.icon}</span>
                            <div>
                              <p className="text-sm font-bold text-[#1a1814]">{c.name}</p>
                              <p className="text-xs text-[#a09880]">Member</p>
                            </div>
                            <svg className="ml-auto w-4 h-4 text-[#a09880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
