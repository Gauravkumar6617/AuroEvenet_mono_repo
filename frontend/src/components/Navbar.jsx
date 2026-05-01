import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
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
                ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex justify-between items-center h-16 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2.5 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                            <span className="text-white font-black text-lg z-10">B</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Blog<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Byte</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    }`}
                            >
                                {label}
                                {isActive(to) && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/create-post"
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    Create Post
                                </Link>
                                <div className="h-4 w-px bg-gray-300 mx-1" />
                                <div className="flex items-center space-x-3 pl-1 pr-1 py-1 rounded-full bg-gray-100 border border-gray-200">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                        {user.username?.slice(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 pr-3">
                                        {user.username}
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-all ml-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
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
                <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 sm:px-6 lg:px-8 xl:px-12 py-4 space-y-1">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 px-4 py-3 mb-2 rounded-xl bg-gray-50 border border-gray-200">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                        {user.username?.slice(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
                                    📊 Dashboard
                                </Link>
                                <Link to="/create-post" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
                                    ✍️ Create Post
                                </Link>
                                <button onClick={logout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                                    Log in
                                </Link>
                                <Link to="/signup" className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
