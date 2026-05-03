import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, RefreshCcw, ShieldCheck } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import AuthShell from "./auth/AuthShell";

const field =
  "w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400";

const btnPrimary =
  "w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99]";

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
    <AuthShell
      eyebrow="Recovery"
      title="Reset password"
      description="We’ll verify it’s you with a one-time code."
    >
      {step === 1 && (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Account email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={field}
              />
            </div>
          </div>
          <button type="submit" className={btnPrimary}>
            Send code
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verify} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Enter code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="••••••"
                maxLength={6}
                className={field + " tracking-[0.25em]"}
              />
            </div>
          </div>
          <button type="submit" className={btnPrimary}>
            Verify & continue
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-violet-600 hover:text-violet-700"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Resend code
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center">
            <ShieldCheck className="mx-auto mb-2 h-10 w-10 text-emerald-600" />
            <p className="text-sm font-bold text-slate-900">You’re verified</p>
            <p className="mt-1 text-xs text-slate-500">You can set a new password next.</p>
          </div>
          <button type="button" className={btnPrimary}>
            Continue
          </button>
        </div>
      )}

      <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
