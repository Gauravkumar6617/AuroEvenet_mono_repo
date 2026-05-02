import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
    <div className="py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 lg:grid-cols-2 lg:px-8">
        <Card className="hidden bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.15em] text-white/80">Join BlogByte</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Create your profile and start sharing high-impact ideas.</h1>
        </Card>
        <Card>
          <h2 className="font-display text-3xl font-bold">Create account</h2>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-700">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
