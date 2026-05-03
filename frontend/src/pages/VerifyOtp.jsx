import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, ArrowRight, KeyRound, RefreshCcw } from "lucide-react";
import { T } from "./home/tokens";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { verifyOTP, resendOTP, loading, error, clearError } = useAuth();
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const email = localStorage.getItem("pending_email") || "";

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const submit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError?.();
    try {
      await verifyOTP(email, otp);
      navigate("/");
    } catch (err) {
      setLocalError(err?.message || "Verification failed. Please check your OTP and try again.");
    }
  };

  const handleResend = async () => {
    if (!email || countdown > 0 || resendLoading) return;
    setResendLoading(true);
    setLocalError(null);
    clearError?.();
    try {
      await resendOTP(email);
      setCountdown(60);
    } catch (err) {
      setLocalError(err?.message || "Failed to resend OTP. Please try again later.");
    } finally {
      setResendLoading(false);
    }
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
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: T.violet, marginBottom: 12 }}>Almost there</p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: T.text, margin: 0 }}>Secure your<br />account.</h1>
            <p style={{ fontSize: 15, color: T.text3, marginTop: 16, lineHeight: 1.6 }}>We take security seriously. Verify your email to start hosting and attending events.</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
              <ShieldCheck size={16} color={T.emerald} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>End-to-end encrypted</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: T.surface, borderRadius: 16, padding: "40px", border: `1px solid ${T.border}`, boxShadow: T.shadow }}
        >
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Verify your email</h2>
          <p style={{ fontSize: 14, color: T.text3, marginTop: 8 }}>
            Enter the OTP sent to <strong style={{ color: T.text }}>{email || "your email"}</strong> to activate your account.
          </p>

          {(error || localError) && (
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: T.roseLight, border: `1px solid ${T.rose}33`, color: T.rose, fontSize: 13, fontWeight: 500 }}>
              {localError || error}
            </div>
          )}

          <form onSubmit={submit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>6-digit OTP</label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} color={T.text4} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setLocalError(null); clearError?.(); }}
                  required
                  placeholder="123456"
                  maxLength={6}
                  inputMode="numeric"
                  style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: `1px solid ${T.borderMed}`, background: T.surfaceEl, fontSize: 14, color: T.text, fontFamily: "'Cabinet Grotesk', sans-serif", outline: "none", letterSpacing: "0.3em" }}
                  onFocus={(e) => { e.target.style.borderColor = T.violet; e.target.style.boxShadow = `0 0 0 3px ${T.violetLight}`; }}
                  onBlur={(e) => { e.target.style.borderColor = T.borderMed; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <motion.button type="submit" disabled={loading || otp.length < 6} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: T.violet, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: (loading || otp.length < 6) ? "not-allowed" : "pointer", opacity: (loading || otp.length < 6) ? 0.7 : 1, fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Verifying..." : "Verify email"}
              {!loading && <ArrowRight size={16} />}
            </motion.button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || resendLoading || !email}
              style={{ background: "none", border: "none", color: countdown > 0 ? T.text4 : T.violet, fontWeight: 700, fontSize: 13, cursor: (countdown > 0 || resendLoading || !email) ? "not-allowed" : "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", display: "inline-flex", alignItems: "center", gap: 6, opacity: (countdown > 0 || resendLoading || !email) ? 0.6 : 1 }}
            >
              <RefreshCcw size={14} style={{ animation: resendLoading ? "spin 1s linear infinite" : "none" }} />
              {resendLoading ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @media (max-width: 900px) { .auth-grid { grid-template-columns: 1fr !important; } .auth-left { display: none !important; } }`}</style>
    </div>
  );
}
