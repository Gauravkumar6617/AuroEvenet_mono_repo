import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { KeyRound, RefreshCcw } from "lucide-react";
import AuthShell from "./auth/AuthShell";

const field =
  "w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 tracking-[0.25em]";

const btnPrimary =
  "w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50";

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
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
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

  const desc = (
    <>
      Enter the code sent to <span className="font-semibold text-white">{email || "your email"}</span>.
    </>
  );

  return (
    <AuthShell eyebrow="Security" title="Verify your email" description={desc}>
      {(error || localError) && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          {localError || error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">6-digit code</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setLocalError(null);
                clearError?.();
              }}
              required
              placeholder="••••••"
              maxLength={6}
              inputMode="numeric"
              className={field}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || otp.length < 6} className={btnPrimary}>
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resendLoading || !email}
          className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 disabled:cursor-not-allowed disabled:opacity-50 hover:text-violet-700"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${resendLoading ? "animate-spin" : ""}`} />
          {resendLoading ? "Sending…" : countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
        </button>
      </div>
    </AuthShell>
  );
}
