import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

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
    <div className="py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 lg:grid-cols-2 lg:px-8">
        <Card className="hidden bg-gradient-to-br from-brand-600 to-violet-600 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.15em] text-white/80">Welcome back</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Sign in to continue your knowledge journey.</h1>
          <p className="mt-4 text-sm text-white/80">Access your feed, saved answers, and dashboard insights.</p>
        </Card>
        <Card>
          <h2 className="font-display text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">Use your account credentials or OAuth.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={loginWithGoogle}>
              Google
            </Button>
            <Button variant="secondary" onClick={loginWithGitHub}>
              GitHub
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            No account?{" "}
            <Link to="/signup" className="font-medium text-brand-700">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
