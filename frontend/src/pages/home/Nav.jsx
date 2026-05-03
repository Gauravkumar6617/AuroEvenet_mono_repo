import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";
import { T } from "./tokens";

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const u = scrollY.on("change", (v) => setScrolled(v > 50));
    return u;
  }, [scrollY]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
    { label: "Features", path: "/features" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <motion.nav
        animate={{
          background: scrolled ? "rgba(250,250,248,0.92)" : "rgba(250,250,248,0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${T.border}`
            : "1px solid transparent",
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: T.violet,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={14} color="#fff" fill="#fff" />
              </div>
              <span
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: T.text,
                }}
              >
                BlogByte
              </span>
            </div>

            {/* Desktop nav links */}
            <div className="nav-links" style={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Link key={item.label} to={item.path}>
                  <motion.button
                    whileHover={{ color: T.violet, background: T.violetLight }}
                    style={{
                      padding: "7px 13px",
                      background: "none",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.text3,
                      cursor: "pointer",
                      borderRadius: 8,
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {item.label}
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop auth buttons */}
          <div
            className="nav-desktop-auth"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <motion.button
              whileHover={{ color: T.text }}
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 14px",
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: T.text3,
                cursor: "pointer",
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Sign in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 4px 20px ${T.violet}44` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                background: T.violet,
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile: Get started + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.button
              className="nav-get-started"
              whileTap={{ scale: 0.95 }}
              style={{
                display: "none",
                padding: "8px 16px",
                borderRadius: 10,
                background: T.violet,
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Get Started
            </motion.button>
            <motion.button
              className="nav-hamburger"
              onClick={() => setMenuOpen(true)}
              whileTap={{ scale: 0.9 }}
              style={{
                display: "none",
                width: 38,
                height: 38,
                borderRadius: 10,
                background: T.surfaceEl,
                border: `1px solid ${T.border}`,
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Menu size={18} color={T.text} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="mobile-nav-panel"
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: 16,
                    color: T.text,
                  }}
                >
                  BlogByte
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: T.surfaceEl,
                    border: "none",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} color={T.text} />
                </button>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(item.path);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "none",
                    fontSize: 15,
                    fontWeight: 600,
                    color: T.text2,
                    cursor: "pointer",
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  style={{
                    padding: "11px",
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    background: T.surfaceEl,
                    fontSize: 14,
                    fontWeight: 600,
                    color: T.text2,
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/signup");
                  }}
                  style={{
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background: T.violet,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
