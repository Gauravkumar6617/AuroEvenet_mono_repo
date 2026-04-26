import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ALL_POSTS = [
    { id: 1, title: "Building a REST API with FastAPI and PostgreSQL", excerpt: "Learn how to build a production-ready REST API using Python's FastAPI framework with PostgreSQL as the database backend.", author: "Gaurav S.", avatar: "GS", date: "Apr 24, 2026", readTime: "8 min", tags: ["Python", "FastAPI"], views: 4210, likes: 187 },
    { id: 2, title: "React Query vs Zustand: State Management in 2026", excerpt: "A deep dive into when to use React Query for server state and Zustand for client state.", author: "Priya R.", avatar: "PR", date: "Apr 22, 2026", readTime: "6 min", tags: ["React", "JavaScript"], views: 3890, likes: 214 },
    { id: 3, title: "RAG Systems with LangChain and FastAPI", excerpt: "Retrieval-Augmented Generation is transforming how we build AI apps.", author: "Alex M.", avatar: "AM", date: "Apr 20, 2026", readTime: "12 min", tags: ["Python", "AI/ML"], views: 6700, likes: 310 },
    { id: 5, title: "From Junior to Senior: The Python Developer Roadmap", excerpt: "What separates a junior Python dev from a senior one? Here's the pattern.", author: "Rahul K.", avatar: "RK", date: "Apr 15, 2026", readTime: "7 min", tags: ["Python", "Career"], views: 9800, likes: 521 },
];

const ARTICLE_BODY = `
## Introduction

FastAPI is one of the fastest Python web frameworks available. In this tutorial, we'll build a production-ready REST API with proper database integration, migrations, and async support.

## Setting Up the Project

First, let's create a virtual environment and install our dependencies:

\`\`\`bash
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy asyncpg alembic pydantic
\`\`\`

## Defining the Database Models

We'll use SQLAlchemy with async support:

\`\`\`python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, DateTime
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
\`\`\`

## Creating FastAPI Routes

With Pydantic schemas and async routes:

\`\`\`python
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI()

@app.get("/articles", response_model=list[ArticleOut])
async def get_articles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article))
    return result.scalars().all()
\`\`\`

## Running Migrations with Alembic

\`\`\`bash
alembic init migrations
alembic revision --autogenerate -m "create articles table"
alembic upgrade head
\`\`\`

## Conclusion

You now have a fully async FastAPI application backed by PostgreSQL with proper migrations. The combination of FastAPI + SQLAlchemy 2.0 + Alembic gives you a solid foundation for production Python APIs.
`;

const COMMENTS = [
    { id: 1, author: "Neha P.", avatar: "NP", date: "Apr 25, 2026", text: "This is exactly what I was looking for! The async SQLAlchemy part was super clear. Subscribed 🙌" },
    { id: 2, author: "Raj V.", avatar: "RV", date: "Apr 25, 2026", text: "Great writeup. One question — how do you handle connection pooling in production? Do you use PgBouncer alongside this setup?" },
    { id: 3, author: "Sarah T.", avatar: "ST", date: "Apr 24, 2026", text: "Love the Alembic section. Most tutorials skip migrations entirely. This is the real-world version 🔥" },
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

function renderMarkdown(md) {
    const lines = md.trim().split("\n");
    const elements = [];
    let i = 0;
    let codeBuffer = [];
    let inCode = false;
    let codeLang = "";

    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith("```")) {
            if (!inCode) {
                inCode = true;
                codeLang = line.slice(3);
                codeBuffer = [];
            } else {
                elements.push(
                    <pre key={i} className="rounded-xl overflow-x-auto my-5 text-sm" style={{ background: "rgba(10,10,20,0.9)", border: "1px solid rgba(99,102,241,0.2)", padding: "1.25rem 1.5rem" }}>
                        <code className="text-slate-200 font-mono leading-relaxed">{codeBuffer.join("\n")}</code>
                    </pre>
                );
                inCode = false; codeBuffer = []; codeLang = "";
            }
        } else if (inCode) {
            codeBuffer.push(line);
        } else if (line.startsWith("## ")) {
            elements.push(<h2 key={i} className="text-2xl font-black text-white mt-10 mb-4">{line.slice(3)}</h2>);
        } else if (line.startsWith("### ")) {
            elements.push(<h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(4)}</h3>);
        } else if (line.trim() === "") {
            elements.push(<div key={i} className="h-2" />);
        } else {
            elements.push(<p key={i} className="text-slate-300 leading-relaxed mb-2">{line}</p>);
        }
        i++;
    }
    return elements;
}

export default function BlogDetail() {
    const { id } = useParams();
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(COMMENTS);

    const post = ALL_POSTS.find(p => p.id === Number(id)) || ALL_POSTS[0];
    const related = ALL_POSTS.filter(p => p.id !== post.id).slice(0, 3);

    const handleComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setComments([{ id: Date.now(), author: "You", avatar: "YO", date: "Just now", text: comment }, ...comments]);
        setComment("");
    };

    return (
        <div className="relative pt-20 min-h-screen">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)" }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* ── Main article ── */}
                    <article className="lg:col-span-2">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                            <Link to="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            <span className="text-slate-400 truncate">{post.title}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => {
                                const c = TAG_COLORS[tag] || { bg: "rgba(99,102,241,0.1)", text: "#a5b4fc" };
                                return <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.text }}>{tag}</span>;
                            })}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6">{post.title}</h1>

                        {/* Author + meta */}
                        <div className="flex flex-wrap items-center gap-4 pb-6 mb-6" style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                    {post.avatar}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{post.author}</p>
                                    <p className="text-slate-500 text-xs">{post.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500 text-sm ml-auto">
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {post.readTime} read
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    {post.views.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Article body */}
                        <div className="prose-custom mb-10">
                            {renderMarkdown(ARTICLE_BODY)}
                        </div>

                        {/* Like + Share */}
                        <div className="flex items-center gap-3 py-6 mb-8" style={{ borderTop: "1px solid rgba(99,102,241,0.15)" }}>
                            <button onClick={() => setLiked(!liked)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                                style={{
                                    background: liked ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))" : "rgba(255,255,255,0.04)",
                                    border: liked ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.08)",
                                    color: liked ? "#a5b4fc" : "#94a3b8",
                                }}>
                                <svg className="h-4 w-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {post.likes + (liked ? 1 : 0)} Likes
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-all duration-200"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-all duration-200 ml-auto"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4.5L5 21V5z" />
                                </svg>
                                Save
                            </button>
                        </div>

                        {/* Comments */}
                        <div id="comments">
                            <h3 className="text-xl font-black text-white mb-6">Comments <span className="text-slate-500 text-base font-normal">({comments.length})</span></h3>

                            {/* Comment form */}
                            <form onSubmit={handleComment} className="glass-card p-5 mb-6">
                                <textarea
                                    rows={3}
                                    placeholder="Share your thoughts…"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="input-field resize-none mb-3 text-sm"
                                />
                                <div className="flex justify-end">
                                    <button type="submit" disabled={!comment.trim()} className="btn-primary text-sm px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                                        Post Comment
                                    </button>
                                </div>
                            </form>

                            {/* Comment list */}
                            <div className="space-y-4">
                                {comments.map(c => (
                                    <div key={c.id} className="glass-card p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                                {c.avatar}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-sm">{c.author}</p>
                                                <p className="text-slate-500 text-xs">{c.date}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">{c.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* ── Sidebar ── */}
                    <aside className="space-y-6">
                        {/* Author card */}
                        <div className="glass-card p-5">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">About the Author</h4>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                    {post.avatar}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{post.author}</p>
                                    <p className="text-slate-400 text-xs">Python Developer · FastAPI enthusiast</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4">Building developer tools and APIs with Python, FastAPI, and PostgreSQL. Open-source contributor.</p>
                            <button className="btn-secondary w-full text-sm py-2">Follow Author</button>
                        </div>

                        {/* Table of contents */}
                        <div className="glass-card p-5">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">On This Page</h4>
                            <nav className="space-y-2">
                                {["Introduction", "Setting Up the Project", "Defining the Database Models", "Creating FastAPI Routes", "Running Migrations with Alembic", "Conclusion"].map(h => (
                                    <a key={h} href="#" className="block text-sm text-slate-400 hover:text-indigo-300 transition-colors py-0.5 pl-2 border-l-2 border-transparent hover:border-indigo-500">
                                        {h}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Related posts */}
                        <div className="glass-card p-5">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Related Articles</h4>
                            <div className="space-y-4">
                                {related.map(r => (
                                    <Link key={r.id} to={`/blog/${r.id}`} className="flex gap-3 group">
                                        <div className="w-14 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                                            style={{ background: "rgba(99,102,241,0.1)" }}>✍️</div>
                                        <div className="min-w-0">
                                            <p className="text-slate-200 text-xs font-medium leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">{r.title}</p>
                                            <p className="text-slate-500 text-xs mt-1">{r.readTime} · {r.views.toLocaleString()} views</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
