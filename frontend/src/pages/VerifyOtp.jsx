import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const { login } = useAppStore();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(59);
    const inputs = useRef([]);

    // Auto-focus first input
    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // digits only
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // only last char
        setOtp(newOtp);
        setError("");

        // Auto-advance
        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // Auto submit when all filled
        if (value && index === 5 && newOtp.every((d) => d !== "")) {
            handleVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length > 0) {
            const newOtp = [...otp];
            pasted.split("").forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            const focusIdx = Math.min(pasted.length, 5);
            inputs.current[focusIdx]?.focus();
            if (pasted.length === 6) handleVerify(pasted);
        }
    };

    const handleVerify = async (code) => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1200));
        if (code === "123456") { // demo valid code
            login({ username: "newuser" });
            navigate("/");
        } else {
            setError("Invalid OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        }
        setLoading(false);
    };

    const handleResend = () => {
        if (resendTimer > 0) return;
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setResendTimer(59);
        inputs.current[0]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) {
            setError("Please enter all 6 digits.");
            return;
        }
        handleVerify(code);
    };

    const filled = otp.filter(Boolean).length;

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
            {/* Background */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 65%)',
            }} />
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
            }} />

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card p-8 sm:p-10">
                    {/* Shield icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-ring"
                            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.4)' }}>
                            <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-white mb-2">Verify your email</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            We've sent a 6-digit verification code to your email address. Enter it below to complete sign-up.
                        </p>
                        <p className="text-xs text-indigo-400 mt-2 font-medium">Demo: use 123456</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP inputs */}
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputs.current[i] = el)}
                                    id={`otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    className={`otp-input ${digit ? "filled" : ""}`}
                                    style={{ outline: 'none' }}
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(filled / 6) * 100}%`,
                                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                    }}
                                />
                            </div>
                            <p className="text-right text-xs text-slate-500">{filled}/6 digits</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-rose-300"
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                <svg className="h-4 w-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="otp-submit"
                            type="submit"
                            disabled={loading || filled < 6}
                            className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Verify Email
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Resend */}
                    <div className="text-center mt-6 space-y-2">
                        <p className="text-sm text-slate-500">
                            Didn't receive the code?{" "}
                            <button
                                onClick={handleResend}
                                disabled={resendTimer > 0}
                                className="font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                                style={{ color: resendTimer > 0 ? '#475569' : '#818cf8' }}
                            >
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                            </button>
                        </p>
                        <Link to="/signup" className="text-xs text-slate-600 hover:text-slate-400 transition-colors block">
                            ← Back to sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
