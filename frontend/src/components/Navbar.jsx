import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";

export default function Navbar() {
    const { user, logout } = useAppStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/blog", label: "Blog" },
        { to: "/features", label: "Features" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-indigo-500/10 shadow-lg shadow-black/20"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2.5 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                            <span className="text-white font-black text-lg z-10">B</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Blog<span className="gradient-text">Byte</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                    ? "text-indigo-300 bg-indigo-500/10"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                    }`}
                            >
                                {label}
                                {isActive(to) && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full"
                                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-slate-300">
                                        Hi, <span className="text-indigo-300 font-semibold">{user.username}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm rounded-lg font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-primary text-sm px-5 py-2.5"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#0d0d1a]/95 backdrop-blur-xl border-t border-indigo-500/10 px-4 py-4 space-y-1">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                ? "text-indigo-300 bg-indigo-500/10"
                                : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-indigo-500/10 space-y-2">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-2 px-4 py-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-sm text-slate-300">Hi, <span className="text-indigo-300 font-semibold">{user.username}</span></span>
                                </div>
                                <button onClick={logout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200">
                                    Log in
                                </Link>
                                <Link to="/signup" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all duration-200"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
