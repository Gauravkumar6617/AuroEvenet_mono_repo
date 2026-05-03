import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Mail, KeyRound, ShieldCheck, RefreshCcw } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { T } from "./home/tokens";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { showToast } = useToast();

  const sendOtp = (e) => {
    e.preventDefault();
    setStep(2);
    showToast("Reset OTP sent to your email", "success");
  };

  const verify = (e) => {
    e.preventDefault();
    setStep(3);
    showToast("Identity check verified", "success");
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
            <p style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: T.violet, marginBottom: 12 }}>Account recovery</p>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.15, color: T.text, margin: 0 }}>Reset your<br />password.</h1>
            <p style={{ fontSize: 15, color: T.text3, marginTop: 16, lineHeight: 1.6 }}>We will send you a secure OTP to verify your identity and help you regain access.</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
              <ShieldCheck size={16} color={T.emerald} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>Secure OTP verification</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: T.surface, borderRadius: 16, padding: "40px", border: `1px solid ${T.border}`, boxShadow: T.shadow }}
        >
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, margin: 0 }}>Forgot password</h2>
          <p style={{ fontSize: 14, color: T.text3, marginTop: 8 }}>Follow the steps to recover your account.</p>

          {step === 1 && (
            <form onSubmit={sendOtp} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Account email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} color={T.text4} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                    style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: `1px solid ${T.borderMed}`, background: T.surfaceEl, fontSize: 14, color: T.text, fontFamily: "'Cabinet Grotesk', sans-serif", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = T.violet; e.target.style.boxShadow = `0 0 0 3px ${T.violetLight}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.borderMed; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: "100%", padding: "14px", borderRadius: 10, background: T.violet, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Send OTP <ArrowRight size={16} />
              </motion.button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verify} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Enter OTP</label>
                <div style={{ position: "relative" }}>
                  <KeyRound size={16} color={T.text4} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="123456" maxLength={6}
                    style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, border: `1px solid ${T.borderMed}`, background: T.surfaceEl, fontSize: 14, color: T.text, fontFamily: "'Cabinet Grotesk', sans-serif", outline: "none", letterSpacing: "0.3em" }}
                    onFocus={(e) => { e.target.style.borderColor = T.violet; e.target.style.boxShadow = `0 0 0 3px ${T.violetLight}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.borderMed; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: "100%", padding: "14px", borderRadius: 10, background: T.violet, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Verify & continue <ArrowRight size={16} />
              </motion.button>
              <button type="button" onClick={() => setStep(1)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "none", color: T.violet, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                <RefreshCcw size={14} /> Resend OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "20px", borderRadius: 12, background: T.emeraldLight, border: `1px solid ${T.emerald}33`, textAlign: "center" }}>
                <ShieldCheck size={32} color={T.emerald} style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: T.text, margin: 0 }}>Verification successful!</p>
                <p style={{ fontSize: 13, color: T.text3, marginTop: 4 }}>You can now create a new password.</p>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: "100%", padding: "14px", borderRadius: 10, background: T.violet, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Cabinet Grotesk', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Proceed to reset <ArrowRight size={16} />
              </motion.button>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.text3, margin: 0 }}>Remember your password? <Link to="/login" style={{ color: T.violet, fontWeight: 700, textDecoration: "none" }}>Sign in</Link></p>
          </div>
        </motion.div>
      </div>
      <style>{`@media (max-width: 900px) { .auth-grid { grid-template-columns: 1fr !important; } .auth-left { display: none !important; } }`}</style>
    </div>
  );
}
