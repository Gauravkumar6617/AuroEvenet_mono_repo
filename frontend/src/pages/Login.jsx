import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Mail, Lock, Globe } from "lucide-react";
import { T } from "./home/tokens";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGitHub, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(form.email, form.password);
    navigate("/");
  };

  return (
    <div style={{ background: T.bg, minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%", padding: "40px 24px", display: "grid", gap: 40, gridTemplateColumns: "1fr 1fr" }} className="auth-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}
          className="auth-left"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.violet, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={18} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: T.text }}>AuraEvents</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: T.violet, marginBottom: 12 }}>Welcome back</p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: T.text, margin: 0 }}>Sign in to discover<br />amazing events.</h1>
            <p style={{ fontSize: 15, color: T.text3, marginTop: 16, lineHeight: 1.6 }}>Access your tickets, saved events, and host dashboard.</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.emerald }}></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>10,000+ events</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.violet }}></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>500K+ attendees</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: T.surface, borderRadius: 16, padding: "40px", border: `1px solid ${T.border}`, boxShadow: T.shadow }}
        >
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Sign in</h2>
          <p style={{ fontSize: 14, color: T.text3, marginTop: 8 }}>Use your account credentials or OAuth.</p>

          {error && (
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: T.roseLight, border: `1px solid ${T.rose}33`, color: T.rose, fontSize: 13, fontWeight: 500 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color={T.text4} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com"
                  style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: `1px solid ${T.borderMed}`, background: T.surfaceEl, fontSize: 14, color: T.text, fontFamily: "'Cabinet Grotesk', sans-serif", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = T.violet; e.target.style.boxShadow = `0 0 0 3px ${T.violetLight}`; }}
                  onBlur={(e) => { e.target.style.borderColor = T.borderMed; e.target.style.boxShadow = "none"; }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color={T.text4} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Enter your password"
                  style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: `1px solid ${T.borderMed}`, background: T.surfaceEl, fontSize: 14, color: T.text, fontFamily: "'Cabinet Grotesk', sans-serif", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = T.violet; e.target.style.boxShadow = `0 0 0 3px ${T.violetLight}`; }}
                  onBlur={(e) => { e.target.style.borderColor = T.borderMed; e.target.style.boxShadow = "none"; }} />
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: T.violet, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </motion.button>
          </form>

          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={loginWithGoogle}
              style={{ padding: "12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, fontSize: 13, fontWeight: 600, color: T.text2, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Globe size={16} /> Google
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={loginWithGitHub}
              style={{ padding: "12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, fontSize: 13, fontWeight: 600, color: T.text2, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
             GitHub
            </motion.button>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <p style={{ fontSize: 13, color: T.text3, margin: 0 }}>No account? <Link to="/signup" style={{ color: T.violet, fontWeight: 700, textDecoration: "none" }}>Create one</Link></p>
            <p style={{ fontSize: 13, color: T.text3, margin: 0 }}>Forgot password? <Link to="/forgot-password" style={{ color: T.violet, fontWeight: 700, textDecoration: "none" }}>Recover access</Link></p>
          </div>
        </motion.div>
      </div>
      <style>{`@media (max-width: 900px) { .auth-grid { grid-template-columns: 1fr !important; } .auth-left { display: none !important; } }`}</style>
    </div>
  );
}
