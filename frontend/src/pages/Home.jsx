import { Link } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const features = [
  {
    icon: "✍️",
    title: "Rich Text Editor",
    desc: "Write beautifully with our powerful Markdown editor supporting syntax highlighting for 100+ languages.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Built on cutting-edge infrastructure. Pages load in under 100ms, giving your readers the best experience.",
  },
  {
    icon: "🌐",
    title: "Global CDN",
    desc: "Your content delivered from servers worldwide, ensuring low latency for readers in every corner of the globe.",
  },
  {
    icon: "🔐",
    title: "Secure by Default",
    desc: "End-to-end encryption, two-factor authentication, and enterprise-grade security built in from day one.",
  },
  {
    icon: "📊",
    title: "Deep Analytics",
    desc: "Understand your audience with detailed insights on views, reads, engagement, and reader demographics.",
  },
  {
    icon: "🤝",
    title: "Collaboration",
    desc: "Work seamlessly with co-authors, editors, and reviewers using our real-time collaborative workflow.",
  },
];

const stats = [
  { value: "50K+", label: "Active Writers" },
  { value: "2M+", label: "Articles Published" },
  { value: "10M+", label: "Monthly Readers" },
  { value: "150+", label: "Countries Reached" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Senior Engineer @ Google",
    avatar: "PS",
    text: "BlogByte transformed how I share technical knowledge. The editor is a dream for writing code-heavy tutorials.",
  },
  {
    name: "Alex Chen",
    role: "Indie Developer",
    avatar: "AC",
    text: "I migrated from Medium and never looked back. The analytics alone are worth every penny.",
  },
  {
    name: "Sarah O'Brien",
    role: "Tech Lead @ Stripe",
    avatar: "SO",
    text: "Our engineering blog went from 500 to 80K monthly readers in 6 months. BlogByte made it possible.",
  },
];

const tagColors = [
  "rgba(99,102,241,0.15)",
  "rgba(139,92,246,0.15)",
  "rgba(236,72,153,0.15)",
  "rgba(6,182,212,0.15)",
  "rgba(16,185,129,0.15)",
];

const trendingTags = ["#javascript", "#python", "#webdev", "#ai", "#devops", "#career", "#react", "#golang"];

export default function Home() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [showPosts, setShowPosts] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="relative">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Gradient background */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.1) 0%, transparent 60%)',
        }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Floating orbs */}
        <div className="animate-float absolute top-1/4 left-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div className="animate-float-delayed absolute bottom-1/3 right-10 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium text-indigo-300 animate-fade-in-up"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Now in public beta — join the community
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Where developers{" "}
            <span className="gradient-text animate-gradient" style={{ animationDelay: '0.15s' }}>
              share & grow
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 w-full max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A modern publishing platform built for the technical community. Write markdown, share code, grow your audience.
          </p>

          {/* Terminal Animation Widget */}
          <div className="w-full max-w-xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card overflow-hidden border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
              <div className="bg-slate-950/80 px-4 py-2.5 flex items-center justify-between border-b border-indigo-500/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">blogbyte-cli — bash</div>
                <div className="w-12" />
              </div>
              <div className="p-6 font-mono text-xs sm:text-sm text-left space-y-1.5 leading-relaxed bg-[#020205]">
                <div className="flex gap-2">
                  <span className="text-emerald-400">➜</span>
                  <span className="text-indigo-400 opacity-80">~</span>
                  <span className="text-slate-100">blogbyte publish ./scaling-fastapi.md</span>
                </div>
                <div className="text-slate-500 ml-6 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  <span>Scanning local file...</span>
                </div>
                <div className="text-slate-500 ml-6 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-500" />
                  <span>Converting markdown to blocks...</span>
                </div>
                <div className="text-emerald-400/90 ml-6 flex items-center gap-2 font-bold italic">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Published! blogbyte.dev/gaurav/fastapi-scale</span>
                </div>
                <div className="flex gap-2 animate-pulse">
                  <span className="text-emerald-400">➜</span>
                  <span className="text-indigo-400 opacity-80">~</span>
                  <span className="w-2 h-4 bg-indigo-500/60" />
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/signup" className="btn-primary px-8 py-4 w-full sm:w-auto text-lg flex items-center justify-center group shadow-indigo-500/20 shadow-xl">
              Get Started for Free
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/blog" className="btn-secondary px-8 py-4 w-full sm:w-auto text-lg flex items-center justify-center hover:bg-white/5">
              Read the Blog
            </Link>
          </div>

          {/* Trending tags */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <span className="text-slate-500 text-sm mr-1 self-center">Trending:</span>
            {trendingTags.map((tag, i) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 cursor-pointer hover:text-white transition-colors duration-200"
                style={{ background: tagColors[i % tagColors.length], border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.04) 50%, transparent)' }} />
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center glass-card py-6 px-4">
                <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{value}</div>
                <div className="text-slate-400 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Everything you need to <span className="gradient-text">publish</span>
            </h2>
            <p className="text-slate-400 w-full max-w-xl mx-auto">
              Powerful tools crafted for technical writers, developers, and content creators who demand the best.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="glass-card p-6 group hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-200 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.04) 50%, transparent)' }} />
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              Testimonials
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              Loved by <span className="gradient-text">creators</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text }) => (
              <div key={name} className="glass-card p-6 flex flex-col gap-4">
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{name}</div>
                    <div className="text-slate-500 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest Posts ─── */}
      <section className="py-24 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Latest Posts
            </h2>
            <p className="text-slate-400 text-lg w-full max-w-2xl mx-auto">
              Discover the latest insights and tutorials from our community
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">Failed to load posts: {error}</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {post.thumbnail_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>{post.view_count} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No posts available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-24 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="relative rounded-2xl overflow-hidden p-10 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(236,72,153,0.1) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Ready to start writing?
              </h2>
              <p className="text-slate-300 mb-8 w-full max-w-md mx-auto">
                Join over 50,000 developers sharing knowledge. Free forever for individual writers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto">
                  Create Free Account
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-3.5 text-base w-full sm:w-auto">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
