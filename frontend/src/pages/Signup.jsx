import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import AuthShell from "./auth/AuthShell";

const field =
  "w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400";

const btnPrimary =
  "w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

export default function Signup() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    await register({
      email: form.email,
      password: form.password,
      username: form.name,
      full_name: form.name,
    });
    navigate("/verify-otp");
  };

  return (
    <AuthShell
      eyebrow="Join"
      title="Create account"
      description="Hosts and attendees — verify your email to get started."
    >
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Your name"
              className={field}
            />
          </div>
        </div>
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
              placeholder="Create a strong password"
              className={field}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "Creating…" : "Continue"}
        </button>
      </form>

      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
