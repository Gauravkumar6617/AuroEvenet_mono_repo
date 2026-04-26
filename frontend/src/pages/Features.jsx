const features = [
    {
        category: "Writing",
        icon: "✍️",
        color: "rgba(99,102,241,0.15)",
        accent: "#6366f1",
        items: [
            { name: "Rich Markdown Editor", desc: "Write in Markdown with live preview, shortcuts, and auto-formatting." },
            { name: "Code Syntax Highlighting", desc: "100+ languages supported — Python, JS, SQL, Bash and more." },
            { name: "Embedded Snippets", desc: "Paste GitHub Gists or inline code blocks with one click." },
            { name: "Draft Autosave", desc: "Never lose a word — your drafts are saved every 10 seconds." },
        ],
    },
    {
        category: "Discovery",
        icon: "🔍",
        color: "rgba(139,92,246,0.15)",
        accent: "#8b5cf6",
        items: [
            { name: "Smart Tags", desc: "ML-powered tag suggestions help readers find your articles." },
            { name: "Topic Feed", desc: "Personalised reading feed based on what you follow." },
            { name: "Search", desc: "Full-text search across titles, tags, and article bodies." },
            { name: "Trending Section", desc: "See what the community is reading and sharing right now." },
        ],
    },
    {
        category: "Publishing",
        icon: "🚀",
        color: "rgba(236,72,153,0.12)",
        accent: "#ec4899",
        items: [
            { name: "Custom Slugs", desc: "Choose your own URL slug for SEO-friendly article links." },
            { name: "Schedule Posts", desc: "Write now, publish later — schedule to any date and time." },
            { name: "Series Support", desc: "Group related articles into a series with auto-navigation." },
            { name: "RSS Feed", desc: "Every author gets an RSS feed — great for newsletters." },
        ],
    },
    {
        category: "Community",
        icon: "🤝",
        color: "rgba(6,182,212,0.12)",
        accent: "#06b6d4",
        items: [
            { name: "Reactions & Comments", desc: "Unicode reactions and threaded comments on every article." },
            { name: "Follow Authors", desc: "Get notified when your favourite writers publish something new." },
            { name: "Reading Lists", desc: "Bookmark articles into named lists and share them publicly." },
            { name: "Author Profiles", desc: "Showcase your bio, stack, and all your published work." },
        ],
    },
    {
        category: "Analytics",
        icon: "📊",
        color: "rgba(16,185,129,0.12)",
        accent: "#10b981",
        items: [
            { name: "View & Read Stats", desc: "Track views, read-through rate, and unique visitors per article." },
            { name: "Traffic Sources", desc: "See where your readers come from — search, social, direct." },
            { name: "Engagement Graph", desc: "Daily/weekly engagement history visualised as a chart." },
            { name: "Top Articles", desc: "Know which posts perform best to inform future writing." },
        ],
    },
    {
        category: "Developer",
        icon: "🛠️",
        color: "rgba(245,158,11,0.12)",
        accent: "#f59e0b",
        items: [
            { name: "Public REST API", desc: "Built with Python FastAPI — fetch articles, profiles, and tags." },
            { name: "Webhooks", desc: "Get notified on new comments, follows, or reactions via HTTP POST." },
            { name: "OpenAPI Docs", desc: "Automatic Swagger UI docs for every endpoint, always up-to-date." },
            { name: "CLI Tool", desc: "Publish articles straight from your terminal with our Python CLI." },
        ],
    },
];

const freePerks = [
    "Unlimited articles",
    "All writing tools",
    "Full analytics dashboard",
    "Public REST API access",
    "Custom author profile",
    "Community features",
    "RSS feed",
    "Series support",
];

export default function Features() {
    return (
        <div className="relative pt-20">
            {/* ─── Hero ─── */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.13) 0%, transparent 60%)',
                }} />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-purple-400 mb-6"
                        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                        Everything's Included
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black text-white mb-6">
                        Packed with features.
                        <br /><span className="gradient-text">100% free.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        No hidden tiers. No paywalls. Every feature below is available to every writer from day one.
                        Think of it as your Python-powered publishing superpower.
                    </p>
                </div>
            </section>

            {/* ─── Free banner ─── */}
            <section className="pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl p-8 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15), rgba(236,72,153,0.08))', border: '1px solid rgba(99,102,241,0.35)' }}>
                        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-8xl font-black opacity-5 select-none pointer-events-none text-white">FREE</div>
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🎉</span>
                                    <h2 className="text-2xl font-black text-white">Always Free — No Credit Card</h2>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    BlogByte is a portfolio-driven open platform. We believe writing and knowledge-sharing shouldn't cost a thing.
                                </p>
                            </div>
                            <a href="/signup" className="btn-primary px-6 py-3 whitespace-nowrap flex-shrink-0">
                                Start for Free →
                            </a>
                        </div>
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {freePerks.map((perk) => (
                                <div key={perk} className="flex items-center gap-2 text-sm text-slate-300">
                                    <svg className="h-4 w-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {perk}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Feature Categories ─── */}
            <section className="py-10 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                    {features.map(({ category, icon, color, accent, items }) => (
                        <div key={category}>
                            {/* Category header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                    style={{ background: color, border: `1px solid ${accent}40` }}>
                                    {icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">{category}</h2>
                                </div>
                                <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
                            </div>

                            {/* Feature cards */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {items.map(({ name, desc }) => (
                                    <div key={name} className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300"
                                        style={{ '--accent': accent }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                                            <h3 className="text-white font-semibold text-sm group-hover:text-indigo-200 transition-colors">{name}</h3>
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Bottom CTA ─── */}
            <section className="py-20 relative">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-black text-white mb-4">
                        Ready to publish your first article?
                    </h2>
                    <p className="text-slate-400 mb-8">Join the community. Everything is free. No catch.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/signup" className="btn-primary px-8 py-3.5 w-full sm:w-auto">
                            Create Free Account
                        </a>
                        <a href="/contact" className="btn-secondary px-8 py-3.5 w-full sm:w-auto">
                            Have questions? Contact us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
