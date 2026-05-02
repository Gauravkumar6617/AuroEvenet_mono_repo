import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Button";
import PageContainer from "./layout/PageContainer";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Feed" },
    { to: "/features", label: "Features" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 px-2 py-2 sm:px-4">
      <PageContainer>
        <motion.nav
          initial={false}
          animate={{
            boxShadow: scrolled ? "0 10px 30px rgba(2, 10, 48, 0.08)" : "0 0 0 rgba(0,0,0,0)",
          }}
          className="surface rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 font-display text-lg text-white">
                B
              </span>
              <span className="font-display text-lg font-bold">
                Nex<span className="gradient-text">os</span>
              </span>
            </Link>

            <div className="hidden flex-1 justify-center lg:flex">
              <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                Search topics, posts, answers...
              </div>
            </div>

            <div className="ml-auto hidden items-center gap-1 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    location.pathname === item.to ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link to="/create-post" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Create
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Dashboard
                  </Link>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
            >
              Menu
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2 border-t border-slate-200 pt-3 md:hidden"
              >
                {navLinks.map((item) => (
                  <Link key={item.to} to={item.to} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    {item.label}
                  </Link>
                ))}
                <Link to="/dashboard" className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </PageContainer>
    </header>
  );
}
