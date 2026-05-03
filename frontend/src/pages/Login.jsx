import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, Globe } from "lucide-react";
import AuthShell from "./auth/AuthShell";

const field =
  "w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400";

const btnPrimary =
  "w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

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
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Tickets, saved events, and your host tools — one place."
    >
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
              className={field}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
              className={field}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-slate-50"
        >
          <Globe className="h-4 w-4" /> Google
        </button>
        <button
          type="button"
          onClick={loginWithGitHub}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-slate-50"
        >
          GitHub
        </button>
      </div>

      <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        <p>
          No account?{" "}
          <Link to="/signup" className="font-bold text-violet-600 hover:text-violet-700">
            Create one
          </Link>
        </p>
        <p>
          <Link to="/forgot-password" className="font-semibold text-violet-600 hover:text-violet-700">
            Forgot password?
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
