import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email | sent | reset | done
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const strength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const bars = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md surface rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">N</div>
          <span className="font-display text-lg font-bold">Nex<span className="gradient-text">os</span></span>
        </Link>
        {step === "email" && (
          <>
            <h2 className="font-display text-3xl font-bold text-[#1a1814]">Forgot password?</h2>
            <p className="mt-1 text-sm text-[#6b6358] mb-6">Enter your email and we'll send a reset link.</p>
            <Input label="Email address" type="email" placeholder="you@company.com" icon="✉️" value={email} onChange={e => setEmail(e.target.value)} />
            <Button className="w-full mt-4" size="lg" onClick={() => email && setStep("sent")}>Send reset link →</Button>
          </>
        )}
        {step === "sent" && (
          <>
            <div className="text-5xl mb-4">📬</div>
            <h2 className="font-display text-2xl font-bold text-[#1a1814]">Check your inbox</h2>
            <p className="mt-2 text-sm text-[#6b6358] mb-6">We sent a reset link to <span className="font-semibold text-[#1a1814]">{email}</span>. It expires in 15 minutes.</p>
            <Button variant="secondary" className="w-full" onClick={() => setStep("reset")}>I got the link — set new password</Button>
            <button onClick={() => setStep("email")} className="mt-3 w-full text-xs text-[#a09880] hover:text-[#6b6358] text-center">Try a different email</button>
          </>
        )}
        {step === "reset" && (
          <>
            <h2 className="font-display text-2xl font-bold text-[#1a1814]">Set new password</h2>
            <p className="mt-1 text-sm text-[#6b6358] mb-6">Must be at least 8 characters.</p>
            <div className="space-y-4">
              <div>
                <Input label="New password" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                {newPassword.length > 0 && (
                  <div className="mt-2 flex gap-1">{[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength(newPassword) ? bars[strength(newPassword)] : "bg-[rgba(90,80,60,0.1)]"}`} />)}</div>
                )}
              </div>
              <Input label="Confirm password" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)}
                error={confirm.length > 0 && confirm !== newPassword ? "Passwords don't match" : undefined} />
            </div>
            <Button className="w-full mt-5" size="lg" disabled={newPassword.length < 8 || newPassword !== confirm} onClick={() => setStep("done")}>Update password →</Button>
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
