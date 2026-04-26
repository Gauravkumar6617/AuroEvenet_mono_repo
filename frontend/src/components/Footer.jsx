import { Link } from "react-router-dom";

const socialLinks = [
    {
        label: "Twitter",
        href: "#",
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
        ),
    },
    {
        label: "GitHub",
        href: "#",
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
];

const footerLinks = {
    Product: [
        { label: "Features", to: "/features" },
        { label: "Pricing", to: "/pricing" },
        { label: "Changelog", to: "/changelog" },
        { label: "Roadmap", to: "/roadmap" },
    ],
    Company: [
        { label: "About", to: "/about" },
        { label: "Blog", to: "/blog" },
        { label: "Careers", to: "/careers" },
        { label: "Contact", to: "/contact" },
    ],
    Resources: [
        { label: "Documentation", to: "/docs" },
        { label: "Tutorials", to: "/tutorials" },
        { label: "Support", to: "/support" },
        { label: "Status", to: "/status" },
    ],
};

export default function Footer() {
    return (
        <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0a0a0f, #0d0d1a)' }}>
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)' }} />

            {/* Background orbs */}
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
            <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter section */}
                <div className="py-10 border-b border-indigo-500/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Stay in the loop</h3>
                            <p className="text-slate-400 text-sm">Get the latest articles, tutorials, and updates delivered to your inbox.</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="input-field flex-1 md:w-64 text-sm py-2.5"
                            />
                            <button className="btn-primary text-sm whitespace-nowrap px-5 py-2.5">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main footer content */}
                <div className="py-12 grid md:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-5">
                        <Link to="/" className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <span className="text-white font-black text-lg">B</span>
                            </div>
                            <span className="text-xl font-bold text-white">Blog<span className="gradient-text">Byte</span></span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The modern platform for developers and creators to share their thoughts, code snippets, and tutorials with a global community.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map(({ label, href, icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    }}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group} className="space-y-4">
                            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{group}</h4>
                            <ul className="space-y-2.5">
                                {links.map(({ label, to }) => (
                                    <li key={to}>
                                        <Link
                                            to={to}
                                            className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">© 2026 BlogByte. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {[{ label: "Privacy", to: "/privacy" }, { label: "Terms", to: "/terms" }, { label: "Cookies", to: "/cookies" }].map(({ label, to }) => (
                            <Link key={to} to={to} className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200">
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
