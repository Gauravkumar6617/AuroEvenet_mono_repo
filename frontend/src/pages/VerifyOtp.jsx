import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { verifyOTP, loading, error } = useAuth();
  const [otp, setOtp] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("pending_email") || "";
    await verifyOTP(email, otp);
    navigate("/");
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-lg px-4">
        <Card>
          <h1 className="font-display text-3xl font-bold">Verify your email</h1>
          <p className="mt-2 text-sm text-slate-600">Enter the OTP sent to your inbox to activate your account.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <Input label="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
