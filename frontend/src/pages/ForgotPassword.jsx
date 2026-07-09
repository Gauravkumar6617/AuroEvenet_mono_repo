import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { authApi } from "../services/api/authApi";
import { PASSWORD_CHECKS, isPasswordStrong } from "./Signup";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email | sent | reset | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = (p) => PASSWORD_CHECKS.filter((c) => c.test(p)).length;
  const bars = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-amber-400", "bg-green-500"];

  const handleSendOtp = async () => {
    if (!email || loading) return;
    setLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email);
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await authApi.resetPassword({ email, otp, new_password: newPassword });
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md surface rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">B</div>
          <span className="font-display text-lg font-bold">Blog<span className="gradient-text">Byte</span></span>
        </Link>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
            <span className="text-red-500 text-sm">⚠️</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {step === "email" && (
          <>
            <h2 className="font-display text-3xl font-bold text-[#1a1814]">Forgot password?</h2>
            <p className="mt-1 text-sm text-[#6b6358] mb-6">Enter your email and we'll send a verification code.</p>
            <Input label="Email address" type="email" placeholder="you@company.com" icon="✉️" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
            <Button className="w-full mt-4" size="lg" onClick={handleSendOtp} disabled={!email || loading}>
              {loading ? "Sending..." : "Send code →"}
            </Button>
          </>
        )}
        {step === "sent" && (
          <>
            <div className="text-5xl mb-4">📬</div>
            <h2 className="font-display text-2xl font-bold text-[#1a1814]">Check your inbox</h2>
            <p className="mt-2 text-sm text-[#6b6358] mb-6">We sent a verification code to <span className="font-semibold text-[#1a1814]">{email}</span>. It expires in 10 minutes.</p>
            <Input label="Verification code" type="text" placeholder="6-digit code" value={otp} onChange={e => setOtp(e.target.value)} disabled={loading} />
            <Button variant="secondary" className="w-full mt-4" onClick={() => setStep("reset")} disabled={!otp}>Continue — set new password</Button>
            <button onClick={() => setStep("email")} disabled={loading} className="mt-3 w-full text-xs text-[#a09880] hover:text-[#6b6358] text-center">Try a different email</button>
          </>
        )}
        {step === "reset" && (
          <>
            <h2 className="font-display text-2xl font-bold text-[#1a1814]">Set new password</h2>
            <p className="mt-1 text-sm text-[#6b6358] mb-6">Choose a strong password to protect your account.</p>
            <div className="space-y-4">
              <div>
                <Input label="New password" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} />
                {newPassword.length > 0 && (
                  <div className="mt-1.5 space-y-1.5">
                    <div className="flex gap-1">
                      {PASSWORD_CHECKS.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength(newPassword) ? bars[strength(newPassword) - 1] : "bg-[rgba(90,80,60,0.1)]"}`} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {PASSWORD_CHECKS.map((c) => {
                        const ok = c.test(newPassword);
                        return (
                          <span key={c.label} className={`text-xs flex items-center gap-1 ${ok ? "text-green-600" : "text-[#a09880]"}`}>
                            <span>{ok ? "✓" : "○"}</span>{c.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <Input label="Confirm password" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} disabled={loading}
                error={confirm.length > 0 && confirm !== newPassword ? "Passwords don't match" : undefined} />
            </div>
            <Button className="w-full mt-5" size="lg" disabled={!isPasswordStrong(newPassword) || newPassword !== confirm || loading} onClick={handleResetPassword}>
              {loading ? "Updating..." : "Update password →"}
            </Button>
          </>
        )}
        {step === "done" && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-2xl font-bold text-[#1a1814]">Password updated!</h2>
            <p className="mt-2 text-sm text-[#6b6358] mb-6">You can now sign in with your new password.</p>
            <Link to="/login"><Button className="w-full" size="lg">Go to sign in →</Button></Link>
          </>
        )}
        {step !== "done" && (
          <p className="mt-6 text-center text-sm text-[#6b6358]">
            Remember it? <Link to="/login" className="font-semibold text-[#e85d26] hover:underline">Sign in →</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
