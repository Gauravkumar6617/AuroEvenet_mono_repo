import { useState } from "react";

const contactReasons = [
    "General inquiry",
    "Bug report",
    "Feature request",
    "Partnership",
    "Other",
];

const contactInfo = [
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        label: "Email",
        value: "hello@blogbyte.dev",
        href: "mailto:hello@blogbyte.dev",
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
        ),
        label: "Discord",
        value: "discord.gg/blogbyte",
        href: "#",
    },
    {
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        ),
        label: "GitHub",
        value: "github.com/blogbyte",
        href: "#",
    },
];

const faqs = [
    {
        q: "Is BlogByte really free?",
        a: "Yes — completely. No credit card, no trials, no paywalls. We believe open knowledge sharing should cost nothing.",
    },
    {
        q: "What backend does BlogByte use?",
        a: "The entire backend is Python — FastAPI for the REST API, PostgreSQL for storage, and Redis for caching. All containerised with Docker.",
    },
    {
        q: "Can I use the API to publish articles programmatically?",
        a: "Absolutely. We expose a full REST API built with FastAPI. Check the /api/docs endpoint for auto-generated Swagger UI documentation.",
    },
    {
        q: "How do I report a bug?",
        a: "Use the contact form on this page, select 'Bug report', and describe the issue. Or open a GitHub Issue — we respond within 24 hours.",
    },
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1400));
        setLoading(false);
        setSent(true);
    };

    return (
        <div className="relative pt-20">
            {/* ─── Hero ─── */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)',
                }} />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />
                <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-6"
                        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        Get in Touch
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black text-white mb-5">
                        We'd love to <span className="gradient-text">hear from you</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Have a question, a bug to report, or an idea? Drop us a message and we'll get back to you within 24 hours.
                    </p>
                </div>
            </section>

            {/* ─── Main content ─── */}
            <section className="py-10 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-10">

                        {/* ── Left: Contact info + FAQ ── */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact info cards */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-white">Reach us directly</h2>
                                {contactInfo.map(({ icon, label, value, href }) => (
                                    <a key={label} href={href}
                                        className="flex items-center gap-4 glass-card p-4 group hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0"
                                            style={{ background: 'rgba(99,102,241,0.1)' }}>
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                                            <p className="text-slate-200 text-sm font-medium group-hover:text-indigo-300 transition-colors">{value}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Response time badge */}
                            <div className="glass-card p-4 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                                <div>
                                    <p className="text-white text-sm font-semibold">Usually responds in &lt; 24h</p>
                                    <p className="text-slate-400 text-xs">Mon – Fri, 9 AM – 6 PM IST</p>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div>
                                <h2 className="text-lg font-bold text-white mb-4">Quick answers</h2>
                                <div className="space-y-2">
                                    {faqs.map(({ q, a }, i) => (
                                        <div key={i} className="glass-card overflow-hidden">
                                            <button
                                                className="w-full flex items-center justify-between px-5 py-4 text-left"
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            >
                                                <span className="text-sm font-medium text-slate-200 pr-4">{q}</span>
                                                <svg
                                                    className="h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200"
                                                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {openFaq === i && (
                                                <div className="px-5 pb-4">
                                                    <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Contact form ── */}
                        <div className="lg:col-span-3">
                            <div className="glass-card p-8">
                                {sent ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                                            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.1))', border: '1px solid rgba(16,185,129,0.4)' }}>
                                            <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2">Message sent! 🎉</h3>
                                        <p className="text-slate-400 mb-6">Thanks for reaching out, {form.name.split(" ")[0]}. We'll reply to <span className="text-indigo-400">{form.email}</span> within 24 hours.</p>
                                        <button onClick={() => { setSent(false); setForm({ name: "", email: "", reason: "", message: "" }); }}
                                            className="btn-secondary px-6 py-2.5 text-sm">
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-black text-white mb-6">Send us a message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            {/* Name + Email */}
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-medium text-slate-300">Full name <span className="text-rose-400">*</span></label>
                                                    <div className="relative">
                                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </span>
                                                        <input
                                                            id="contact-name"
                                                            type="text"
                                                            required
                                                            placeholder="John Doe"
                                                            value={form.name}
                                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                            className="input-field pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-medium text-slate-300">Email address <span className="text-rose-400">*</span></label>
                                                    <div className="relative">
                                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        </span>
                                                        <input
                                                            id="contact-email"
                                                            type="email"
                                                            required
                                                            placeholder="you@example.com"
                                                            value={form.email}
                                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                            className="input-field pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reason dropdown */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-300">Reason for contact</label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                    </span>
                                                    <select
                                                        id="contact-reason"
                                                        value={form.reason}
                                                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                                        className="input-field pl-10 appearance-none cursor-pointer"
                                                        style={{ background: 'rgba(15,15,30,0.8)' }}
                                                    >
                                                        <option value="" disabled>Select a reason…</option>
                                                        {contactReasons.map((r) => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Message */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-300">Message <span className="text-rose-400">*</span></label>
                                                <textarea
                                                    id="contact-message"
                                                    required
                                                    rows={5}
                                                    placeholder="Tell us what's on your mind…"
                                                    value={form.message}
                                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                    className="input-field resize-none"
                                                />
                                                <p className="text-xs text-slate-600 text-right">{form.message.length} / 1000</p>
                                            </div>

                                            {/* Submit */}
                                            <button
                                                id="contact-submit"
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary w-full py-3.5 text-base"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Sending…
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        Send Message
                                                    </span>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
