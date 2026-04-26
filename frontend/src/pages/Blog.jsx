import { useState } from "react";
import { Link } from "react-router-dom";

const TAGS = ["All", "Python", "FastAPI", "JavaScript", "React", "DevOps", "AI/ML", "Career", "Tutorial"];

const POSTS = [
    { id: 1, title: "Building a REST API with FastAPI and PostgreSQL", excerpt: "Learn how to build a production-ready REST API using Python's FastAPI framework with PostgreSQL as the database backend. We'll cover async routes, Pydantic models, and Alembic migrations.", author: "Gaurav S.", avatar: "GS", date: "Apr 24, 2026", readTime: "8 min", tags: ["Python", "FastAPI"], views: 4210, likes: 187, cover: null },
    { id: 2, title: "React Query vs Zustand: State Management in 2026", excerpt: "A deep dive into when to use React Query for server state and Zustand for client state. Real-world patterns that will keep your codebase clean and predictable.", author: "Priya R.", avatar: "PR", date: "Apr 22, 2026", readTime: "6 min", tags: ["React", "JavaScript"], views: 3890, likes: 214, cover: null },
    { id: 3, title: "RAG Systems with LangChain and FastAPI", excerpt: "Retrieval-Augmented Generation is transforming how we build AI apps. This guide walks through building a production RAG pipeline using Python, LangChain, and a FastAPI backend.", author: "Alex M.", avatar: "AM", date: "Apr 20, 2026", readTime: "12 min", tags: ["Python", "AI/ML"], views: 6700, likes: 310, cover: null },
    { id: 4, title: "Docker Compose for Python Microservices", excerpt: "Set up a multi-service Python application with Docker Compose. Includes FastAPI, PostgreSQL, Redis, and Celery workers — all orchestrated in a single compose file.", author: "Sarah T.", avatar: "ST", date: "Apr 18, 2026", readTime: "10 min", tags: ["Python", "DevOps"], views: 2900, likes: 143, cover: null },
    { id: 5, title: "From Junior to Senior: The Python Developer Roadmap", excerpt: "What separates a junior Python dev from a senior one? I've interviewed 200+ developers and here's the pattern I've noticed — skills, mindset, and habits that actually matter.", author: "Rahul K.", avatar: "RK", date: "Apr 15, 2026", readTime: "7 min", tags: ["Python", "Career"], views: 9800, likes: 521, cover: null },
    { id: 6, title: "Async Python: asyncio Patterns You Should Know", excerpt: "Mastering async/await in Python opens doors to building highly concurrent applications. This tutorial covers the most common asyncio patterns with real examples.", author: "Gaurav S.", avatar: "GS", date: "Apr 12, 2026", readTime: "9 min", tags: ["Python", "Tutorial"], views: 3400, likes: 198, cover: null },
    { id: 7, title: "Building a Blog Platform with Next.js 15", excerpt: "A complete tutorial series on building a full-featured blog platform using Next.js 15 App Router, Tailwind CSS, and a FastAPI backend. Part 1 of 5.", author: "Neha P.", avatar: "NP", date: "Apr 10, 2026", readTime: "11 min", tags: ["React", "Tutorial"], views: 5100, likes: 267, cover: null },
    { id: 8, title: "PostgreSQL Performance: Indexing Strategies", excerpt: "Most developers know indexes make queries faster. Few know which index type to pick for which workload. This guide covers B-tree, GIN, BRIN, and partial indexes.", author: "Raj V.", avatar: "RV", date: "Apr 8, 2026", readTime: "8 min", tags: ["Python", "Tutorial"], views: 2100, likes: 119, cover: null },
    { id: 9, title: "Deploying FastAPI to AWS with GitHub Actions", excerpt: "A step-by-step guide to setting up a CI/CD pipeline for your FastAPI application using GitHub Actions, Docker, and AWS ECS Fargate.", author: "Priya R.", avatar: "PR", date: "Apr 5, 2026", readTime: "14 min", tags: ["FastAPI", "DevOps"], views: 3750, likes: 176, cover: null },
];

const TAG_COLORS = {
    Python: { bg: "rgba(99,102,241,0.15)", text: "#a5b4fc" },
    FastAPI: { bg: "rgba(16,185,129,0.15)", text: "#6ee7b7" },
    JavaScript: { bg: "rgba(245,158,11,0.15)", text: "#fcd34d" },
    React: { bg: "rgba(6,182,212,0.15)", text: "#67e8f9" },
    DevOps: { bg: "rgba(239,68,68,0.15)", text: "#fca5a5" },
    "AI/ML": { bg: "rgba(139,92,246,0.15)", text: "#c4b5fd" },
    Career: { bg: "rgba(236,72,153,0.15)", text: "#f9a8d4" },
    Tutorial: { bg: "rgba(251,146,60,0.15)", text: "#fdba74" },
};

function TagBadge({ tag, small }) {
    const c = TAG_COLORS[tag] || { bg: "rgba(99,102,241,0.1)", text: "#a5b4fc" };
    return (
        <span className={`inline-flex items-center rounded-full font-medium ${small ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"}`}
            style={{ background: c.bg, color: c.text }}>
            {tag}
        </span>
    );
}

function PostCard({ post }) {
    return (
        <Link to={`/blog/${post.id}`} className="glass-card flex flex-col group hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300">
            {/* Cover placeholder */}
            <div className="h-40 rounded-t-[calc(1rem-1px)] flex items-center justify-center relative overflow-hidden flex-shrink-0"
                style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))` }}>
                <span className="text-5xl opacity-30 select-none">✍️</span>
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {post.tags.map(t => <TagBadge key={t} tag={t} small />)}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h2 className="text-white font-bold leading-snug mb-2 group-hover:text-indigo-200 transition-colors line-clamp-2">{post.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-indigo-500/10">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            {post.avatar}
                        </div>
                        <div>
                            <p className="text-slate-300 text-xs font-medium">{post.author}</p>
                            <p className="text-slate-500 text-xs">{post.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {post.views.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Blog() {
    const [activeTag, setActiveTag] = useState("All");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");

    const filtered = POSTS
        .filter(p => activeTag === "All" || p.tags.includes(activeTag))
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sortBy === "popular" ? b.views - a.views : sortBy === "liked" ? b.likes - a.likes : b.id - a.id);

    const featured = POSTS.find(p => p.id === 5);

    return (
        <div className="relative pt-20 min-h-screen">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%)" }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4"
                        style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                        Community Articles
                    </div>
                    <h1 className="text-5xl font-black text-white mb-3">The <span className="gradient-text">Blog</span></h1>
                    <p className="text-slate-400 max-w-lg mx-auto">Tutorials, insights, and ideas from the BlogByte developer community.</p>
                </div>

                {/* Featured post */}
                {featured && (
                    <Link to={`/blog/${featured.id}`} className="block glass-card mb-10 group hover:border-indigo-500/30 transition-all duration-300">
                        <div className="grid md:grid-cols-5">
                            <div className="md:col-span-2 h-48 md:h-auto rounded-l-[calc(1rem-1px)] flex items-center justify-center relative overflow-hidden"
                                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))" }}>
                                <span className="text-7xl opacity-20 select-none">🔥</span>
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                        🔥 Featured
                                    </span>
                                </div>
                            </div>
                            <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                                <div className="flex flex-wrap gap-2 mb-3">{featured.tags.map(t => <TagBadge key={t} tag={t} />)}</div>
                                <h2 className="text-2xl font-black text-white mb-3 group-hover:text-indigo-200 transition-colors">{featured.title}</h2>
                                <p className="text-slate-400 leading-relaxed mb-4">{featured.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                            {featured.avatar}
                                        </div>
                                        <span className="text-slate-300 font-medium">{featured.author}</span>
                                    </div>
                                    <span>{featured.date}</span>
                                    <span>{featured.readTime} read</span>
                                    <span>{featured.views.toLocaleString()} views</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Search + Sort bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search articles…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field pl-10 py-2.5"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="input-field w-auto px-4 py-2.5 cursor-pointer"
                        style={{ background: "rgba(15,15,30,0.8)" }}
                    >
                        <option value="latest">Latest</option>
                        <option value="popular">Most Viewed</option>
                        <option value="liked">Most Liked</option>
                    </select>
                </div>

                {/* Tag filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                            style={activeTag === tag
                                ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }
                                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }
                            }
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-slate-500 text-sm mb-6">{filtered.length} article{filtered.length !== 1 ? "s" : ""} found</p>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="text-white font-bold text-xl mb-2">No articles found</p>
                        <p className="text-slate-400 text-sm">Try a different search term or tag.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
