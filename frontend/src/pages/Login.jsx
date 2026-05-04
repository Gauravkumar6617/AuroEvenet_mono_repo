import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGitHub, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try { await login(form.email, form.password); navigate("/"); } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6">
        {/* Left panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col justify-between rounded-3xl bg-[#1a1814] p-10 text-white overflow-hidden relative">
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#e85d26]/15 blur-3xl" />
          <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-[#2563eb]/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm mb-6">N</div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-3">Welcome back</p>
            <h1 className="font-display text-4xl font-bold leading-tight">Sign in and continue your knowledge journey.</h1>
            <p className="mt-4 text-[#a09880] text-sm leading-relaxed">Access your personalized feed, saved discussions, and contributor dashboard.</p>
          </div>
          <div className="relative z-10 space-y-3">
            {[
              { avatar: "P", name: "priya_arch", text: "Nexos is the only platform where I actually learn from discussions. The depth is unmatched." },
              { avatar: "A", name: "alex_ops", text: "My answer got 200 upvotes in 2 days. This community genuinely rewards expertise." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-[#d0c8be] italic leading-relaxed">"{t.text}"</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="avatar h-6 w-6" style={{ fontSize: "0.65rem" }}>{t.avatar}</div>
                  <span className="text-xs text-[#a09880]">@{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="surface rounded-3xl p-8">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">N</div>
            <span className="font-display text-lg font-bold">Nex<span className="gradient-text">os</span></span>
          </Link>
          <h2 className="font-display text-3xl font-bold text-[#1a1814]">Sign in</h2>
          <p className="mt-1 text-sm text-[#6b6358]">Use your credentials or sign in with OAuth.</p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <span className="text-red-500 text-sm">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <Input label="Email address" type="email" placeholder="you@company.com" icon="✉️"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-[#1a1814]">Password</span>
                <Link to="/forgot-password" className="text-xs text-[#e85d26] hover:underline font-medium">Forgot?</Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"}
                  className="input-field pr-10" placeholder="Your password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a09880] hover:text-[#6b6358]">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Signing in..." : "Sign in →"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(90,80,60,0.1)]" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#a09880] font-medium">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={loginWithGoogle} className="w-full">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="secondary" onClick={loginWithGitHub} className="w-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[#6b6358]">
            No account?{" "}
            <Link to="/signup" className="font-semibold text-[#e85d26] hover:underline">Create one free →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
