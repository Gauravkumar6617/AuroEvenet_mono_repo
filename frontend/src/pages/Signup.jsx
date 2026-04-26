import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return { level: 0, label: "", color: "" };
        if (p.length < 6) return { level: 1, label: "Weak", color: "#ef4444" };
        if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { level: 2, label: "Fair", color: "#f59e0b" };
        return { level: 3, label: "Strong", color: "#10b981" };
    };

    const strength = passwordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) return;
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1000));
        setLoading(false);
        navigate("/verify-otp");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
            {/* Background */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 70% 50% at 70% 30%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 30% 70%, rgba(99,102,241,0.08) 0%, transparent 60%)',
            }} />
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
            }} />

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card p-8 sm:p-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center space-x-2.5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                <span className="text-white font-black text-xl">B</span>
                            </div>
                            <span className="text-2xl font-bold text-white">Blog<span className="gradient-text">Byte</span></span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
                        <p className="text-slate-400 text-sm">Join thousands of writers and developers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Full name</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    id="signup-name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email address</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    id="signup-email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password strength */}
                            {form.password && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{ background: i <= strength.level ? strength.color : 'rgba(255,255,255,0.1)' }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs" style={{ color: strength.color }}>{strength.label} password</p>
                                </div>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                style={{
                                    background: agreed ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                                    border: agreed ? 'none' : '1.5px solid rgba(99,102,241,0.4)',
                                }}
                                onClick={() => setAgreed(!agreed)}
                            >
                                {agreed && (
                                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                            <span className="text-xs text-slate-400">
                                I agree to the{" "}
                                <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link>
                                {" "}and{" "}
                                <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            id="signup-submit"
                            type="submit"
                            disabled={loading || !agreed}
                            className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
