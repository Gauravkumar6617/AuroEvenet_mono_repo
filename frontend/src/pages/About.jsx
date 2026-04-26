const techStack = [
    { name: "Python", icon: "🐍", desc: "Core backend language — FastAPI, async, type-safe" },
    { name: "FastAPI", icon: "⚡", desc: "High-performance REST API framework with auto-docs" },
    { name: "PostgreSQL", icon: "🐘", desc: "Reliable relational database for articles & users" },
    { name: "React", icon: "⚛️", desc: "Frontend UI library for a snappy reader experience" },
    { name: "Redis", icon: "🔴", desc: "Caching, session management & rate limiting" },
    { name: "Docker", icon: "🐳", desc: "Containerised deployments for easy scaling" },
];

const values = [
    {
        icon: "🌍",
        title: "Open & Free",
        desc: "Knowledge should be accessible to everyone. BlogByte is free for individuals — always.",
    },
    {
        icon: "🔓",
        title: "Developer First",
        desc: "Built by a developer, for developers. Markdown, syntax highlighting, code snippets — all first-class.",
    },
    {
        icon: "🚀",
        title: "Ship Fast",
        desc: "We ship improvements weekly. Real feedback from real writers drives every feature.",
    },
    {
        icon: "🤝",
        title: "Community Driven",
        desc: "Every suggestion matters. Join our Discord and shape the roadmap directly.",
    },
];

const timeline = [
    { year: "Jan 2026", label: "Idea born", desc: "Started as a side project while learning FastAPI." },
    { year: "Feb 2026", label: "First commit", desc: "Core API built with Python + FastAPI + PostgreSQL." },
    { year: "Mar 2026", label: "Beta launch", desc: "Opened sign-ups; 500 writers in the first week." },
    { year: "Apr 2026", label: "Public launch", desc: "50K+ articles published. Growing every day." },
];

export default function About() {
    return (
        <div className="relative pt-20">
            {/* ─── Hero ─── */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.13) 0%, transparent 60%)',
                }} />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-6"
                        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        Our Story
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
                        Built by a dev,
                        <br /><span className="gradient-text">for the community</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        BlogByte started as a weekend Python project — a simple FastAPI app to share code snippets.
                        It grew into something much bigger. Today it's a platform where thousands of developers write, learn, and grow together.
                    </p>
                </div>
            </section>

            {/* ─── Values ─── */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black text-white mb-3">What we stand for</h2>
                        <p className="text-slate-400">Principles that guide every decision we make.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map(({ icon, title, desc }) => (
                            <div key={title} className="glass-card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                                <div className="text-4xl mb-4">{icon}</div>
                                <h3 className="text-white font-bold mb-2 group-hover:text-indigo-200 transition-colors">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Tech Stack ─── */}
            <section className="py-20 relative">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.04) 50%, transparent)' }} />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4"
                            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                            Tech Stack
                        </div>
                        <h2 className="text-4xl font-black text-white mb-3">
                            Powered by <span className="gradient-text">Python</span> &amp; modern tools
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            The entire backend is written in Python — fast, readable, and production-ready.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {techStack.map(({ name, icon, desc }) => (
                            <div key={name} className="glass-card p-5 flex items-start gap-4 group hover:border-indigo-500/40 transition-all duration-300">
                                <div className="text-3xl flex-shrink-0">{icon}</div>
                                <div>
                                    <h3 className="text-white font-bold mb-1 group-hover:text-indigo-200 transition-colors">{name}</h3>
                                    <p className="text-slate-400 text-sm">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Python callout */}
                    <div className="mt-10 rounded-2xl p-6 flex items-center gap-5"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.25)' }}>
                        <div className="text-5xl flex-shrink-0">🐍</div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">Python all the way down</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                The API, background jobs, OTP mailer, and ML-powered tag suggestions are all Python. FastAPI gives us async request handling and automatic OpenAPI docs out of the box.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Timeline ─── */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black text-white mb-3">Our journey</h2>
                        <p className="text-slate-400">From a side project to a growing community.</p>
                    </div>

                    <div className="relative">
                        {/* Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.5), transparent)' }} />

                        <div className="space-y-10">
                            {timeline.map(({ year, label, desc }, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 relative"
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                                            <span className="text-white font-bold text-xs">{i + 1}</span>
                                        </div>
                                    </div>
                                    <div className="glass-card p-5 flex-1">
                                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{year}</span>
                                        <h3 className="text-white font-bold mt-1 mb-1">{label}</h3>
                                        <p className="text-slate-400 text-sm">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass-card p-10 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none blur-3xl"
                            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white mb-3">Want to write with us?</h2>
                            <p className="text-slate-400 mb-6">It's free — forever. Sign up and publish your first article today.</p>
                            <a href="/signup" className="btn-primary px-8 py-3.5 inline-flex">
                                Create Free Account →
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
