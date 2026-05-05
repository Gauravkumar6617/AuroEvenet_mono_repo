import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { verifyOTP, resendOTP, loading, error } = useAuth();
  const [digits, setDigits] = useState(["","","","","",""]);
  const [resent, setResent] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const email = localStorage.getItem("pending_email") || "your email";

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) setDigits(pasted.split(""));
  };

  const submit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) return;
    await verifyOTP(email, otp);
    navigate("/");
  };

  const handleResend = async () => {
    await resendOTP(email);
    setResent(true);
    setTimeout(() => setResent(false), 30000);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md surface rounded-3xl p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fdf0ea] text-3xl mx-auto mb-5">✉️</div>
        <h1 className="font-display text-2xl font-bold text-[#1a1814] mb-1">Check your inbox</h1>
        <p className="text-sm text-[#6b6358] mb-6">
          We sent a 6-digit code to <strong className="text-[#1a1814]">{email}</strong>.<br />
          Enter it below to activate your account.
        </p>
        <form onSubmit={submit}>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
                value={d} onChange={e => handleDigit(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
                className={`h-14 w-11 rounded-xl border-[1.5px] text-center text-xl font-bold text-[#1a1814] outline-none transition-all ${d ? "border-[#e85d26] bg-[#fdf0ea]" : "border-[rgba(90,80,60,0.15)] bg-white"} focus:border-[#e85d26] focus:shadow-[0_0_0_3px_rgba(232,93,38,0.12)]`}
              />
            ))}
          </div>
          <Button type="submit" className="w-full mb-4" size="lg" disabled={loading || digits.join("").length < 6}>
            {loading ? "Verifying..." : "Verify email →"}
          </Button>
        </form>
        <p className="text-sm text-[#6b6358]">
          Didn't receive it?{" "}
          {resent ? (
            <span className="text-green-600 font-semibold">Code resent ✓</span>
          ) : (
            <button onClick={handleResend} className="font-semibold text-[#e85d26] hover:underline">Resend code</button>
          )}
        </p>
        <p className="mt-3 text-xs text-[#a09880]">
          Wrong email?{" "}
          <Link to="/signup" className="text-[#e85d26] hover:underline">Start over</Link>
        </p>
      </motion.div>
    </div>
  );
}
