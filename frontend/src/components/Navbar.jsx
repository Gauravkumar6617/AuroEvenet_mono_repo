import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "./layout/PageContainer";

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "answer", text: "priya_dev answered your question about FastAPI", time: "2m ago", unread: true },
  { id: 2, type: "upvote", text: "Your post got 12 upvotes", time: "1h ago", unread: true },
  { id: 3, type: "follow", text: "karthik_ai started following you", time: "3h ago", unread: false },
  { id: 4, type: "mention", text: "You were mentioned in a discussion", time: "1d ago", unread: false },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const createRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Feed" },
    { to: "/communities", label: "Communities" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (createRef.current && !createRef.current.contains(e.target)) setCreateOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Close search on ESC
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setSearchOpen(false); if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const avatarInitials = user?.username ? user.username[0].toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 px-2 py-2 sm:px-4">
      <PageContainer>
        <motion.nav
          initial={false}
          animate={{ boxShadow: scrolled ? "0 8px 32px rgba(26,24,20,0.09)" : "0 0 0 rgba(0,0,0,0)" }}
          className="surface rounded-2xl px-4 py-2.5"
        >
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm shadow-sm">N</div>
              <span className="font-display text-lg font-bold text-[#1a1814]">Nex<span className="gradient-text">os</span></span>
            </Link>

            {/* Search bar (desktop) */}
            <div className="mx-4 hidden flex-1 lg:block max-w-sm">
              <button onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 rounded-xl border border-[rgba(90,80,60,0.15)] bg-[rgba(90,80,60,0.04)] px-3 py-2 text-sm text-[#a09880] hover:bg-white hover:border-[#e85d26] transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                Search topics, posts, people...
                <span className="ml-auto text-xs font-mono bg-[rgba(90,80,60,0.08)] px-1.5 py-0.5 rounded">⌘K</span>
              </button>
            </div>

            {/* Nav links */}
            <div className="hidden items-center gap-0.5 md:flex ml-auto">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${location.pathname === item.to || location.pathname.startsWith(item.to + "/") && item.to !== "/" ? "bg-[#fdf0ea] text-[#e85d26]" : "text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] hover:text-[#1a1814]"}`}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden items-center gap-2 md:flex ml-2">
              <button onClick={() => setSearchOpen(true)} className="rounded-xl p-2 text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] lg:hidden">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>

              <div className="relative" ref={createRef}>
                <button
                  onClick={() => setCreateOpen(!createOpen)}
                  className="flex items-center gap-1.5 rounded-xl border border-[rgba(90,80,60,0.15)] bg-white px-3 py-2 text-sm font-semibold text-[#1a1814] hover:bg-[#fdf0ea] hover:border-[#e85d26] hover:text-[#e85d26] transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                  Create
                </button>
                <AnimatePresence>
                  {createOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 surface overflow-hidden z-50">
                      <Link to="/create-post" onClick={() => setCreateOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#6b6358] hover:bg-[rgba(90,80,60,0.04)] hover:text-[#1a1814] transition-all border-b border-[rgba(90,80,60,0.05)]">
                        <span>📝</span> Create Post
                      </Link>
                      <Link to="/communities?create=true" onClick={() => setCreateOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#6b6358] hover:bg-[rgba(90,80,60,0.04)] hover:text-[#1a1814] transition-all">
                        <span>🌐</span> New Community
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                      className="relative rounded-xl p-2 text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                      {unreadCount > 0 && <span className="notif-dot" />}
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-80 surface overflow-hidden z-50">
                          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(90,80,60,0.08)]">
                            <span className="text-sm font-bold text-[#1a1814]">Notifications</span>
                            <button className="text-xs text-[#e85d26] font-semibold hover:underline">Mark all read</button>
                          </div>
                          <div className="max-h-72 overflow-y-auto">
                            {MOCK_NOTIFICATIONS.map((n) => (
                              <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-[rgba(90,80,60,0.05)] cursor-pointer hover:bg-[rgba(90,80,60,0.03)] transition-all ${n.unread ? "bg-[rgba(232,93,38,0.03)]" : ""}`}>
                                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-[#e85d26]" : "bg-transparent"}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-[#1a1814] leading-relaxed">{n.text}</p>
                                  <p className="text-xs text-[#a09880] mt-0.5">{n.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 py-2.5 text-center border-t border-[rgba(90,80,60,0.08)]">
                            <Link to="/dashboard" onClick={() => setNotifOpen(false)} className="text-xs text-[#e85d26] font-semibold hover:underline">View all notifications</Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                      className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-[rgba(90,80,60,0.06)] transition-all">
                      <div className="avatar h-7 w-7 text-xs">{avatarInitials}</div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 surface overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-[rgba(90,80,60,0.08)]">
                            <p className="text-sm font-semibold text-[#1a1814]">@{user?.username || "user"}</p>
                            <p className="text-xs text-[#a09880] truncate">{user?.email || ""}</p>
                          </div>
                          {[
                            { label: "Public profile", to: `/u/${user?.username || "user"}`, icon: "👤" },
                            { label: "Dashboard", to: "/dashboard", icon: "⚡" },
                            { label: "My Posts", to: "/dashboard", icon: "📝" },
                            { label: "Communities", to: "/communities", icon: "🌐" },
                            { label: "Topic preferences", to: "/settings/topics", icon: "🎯" },
                            { label: "Privacy", to: "/privacy", icon: "🔒" },
                          ].map((item) => (
                            <Link key={item.label} to={item.to} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6b6358] hover:bg-[rgba(90,80,60,0.04)] hover:text-[#1a1814] transition-all">
                              <span>{item.icon}</span>{item.label}
                            </Link>
                          ))}
                          <div className="border-t border-[rgba(90,80,60,0.08)]">
                            <button onClick={() => { logout(); setProfileOpen(false); }}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all">
                              <span>🚪</span> Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-[#6b6358] hover:text-[#1a1814] hover:bg-[rgba(90,80,60,0.06)] transition-all">Sign in</Link>
                  <Link to="/signup" className="btn-primary text-sm px-4 py-2 rounded-xl font-semibold inline-flex items-center gap-1.5">
                    Get started
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="ml-auto rounded-xl border border-[rgba(90,80,60,0.15)] p-2 md:hidden">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-1 border-t border-[rgba(90,80,60,0.08)] pt-3 md:hidden overflow-hidden">
                {navLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#6b6358] hover:bg-[rgba(90,80,60,0.06)] hover:text-[#1a1814]">{item.label}</Link>
                ))}
                <Link to="/create-post" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#e85d26]">+ Create Post</Link>
                {user ? (
                  <>
                    <Link to={`/u/${user?.username}`} className="block rounded-lg px-3 py-2.5 text-sm text-[#6b6358]">My Profile</Link>
                    <Link to="/dashboard" className="block rounded-lg px-3 py-2.5 text-sm text-[#6b6358]">Dashboard</Link>
                    <Link to="/settings/topics" className="block rounded-lg px-3 py-2.5 text-sm text-[#6b6358]">Topic Preferences</Link>
                    <button onClick={logout} className="block w-full text-left rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                  </>
                ) : (
                  <Link to="/signup" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#e85d26]">Get started →</Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </PageContainer>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-xl surface overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 p-4 border-b border-[rgba(90,80,60,0.08)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a09880" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && searchQuery) { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); } }}
                  className="flex-1 text-sm outline-none bg-transparent text-[#1a1814] placeholder:text-[#a09880]"
                  placeholder="Search topics, posts, questions, people..." />
                <button onClick={() => setSearchOpen(false)} className="text-xs text-[#a09880] border border-[rgba(90,80,60,0.15)] rounded px-1.5 py-0.5 font-mono">ESC</button>
              </div>
              <div className="p-3">
                {searchQuery.length === 0 ? (
                  <div>
                    <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-[#a09880]">Quick links</p>
                    {[
                      { label: "Browse communities", to: "/communities", icon: "🌐" },
                      { label: "Topic preferences", to: "/settings/topics", icon: "🎯" },
                      { label: "My profile", to: `/u/${user?.username || ""}`, icon: "👤" },
                    ].map(({ label, to, icon }) => (
                      <Link key={label} to={to} onClick={() => setSearchOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#6b6358] hover:bg-[rgba(90,80,60,0.05)] hover:text-[#1a1814]">
                        <span>{icon}</span>{label}
                      </Link>
                    ))}
                    <p className="mt-2 px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-[#a09880]">Trending topics</p>
                    <div className="flex flex-wrap gap-2 px-2 pt-1">
                      {["#engineering", "#product", "#ai", "#devops", "#design", "#startup"].map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {["How to structure FastAPI for scale", "React Query patterns 2026", "System design: message queues"].filter((r) => r.toLowerCase().includes(searchQuery.toLowerCase())).map((result) => (
                      <button key={result} onClick={() => { navigate("/blog"); setSearchOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#1a1814] hover:bg-[rgba(90,80,60,0.05)]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a09880" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                        {result}
                      </button>
                    ))}
                    <button onClick={() => { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#e85d26] font-semibold hover:bg-[#fdf0ea]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                      Search all results for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
