import { useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PageContainer from "../components/layout/PageContainer";
import { useToast } from "../contexts/ToastContext";

const aiTips = [
  "AI risk scoring checks unusual reset requests.",
  "Visual OTP pattern makes bot abuse harder.",
  "Adaptive OTP timeout adjusts to suspicious behavior.",
];

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { showToast } = useToast();

  const sendOtp = (e) => {
    e.preventDefault();
    setStep(2);
    showToast("Reset OTP sent to your email", "success");
  };

  const verify = (e) => {
    e.preventDefault();
    if (!selectedImage) {
      showToast("Pick an image pattern to continue", "error");
      return;
    }
    setStep(3);
    showToast("Identity check verified", "success");
  };

  return (
    <div className="py-10">
      <PageContainer>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card className="bg-gradient-to-br from-brand-600 to-violet-600 text-white">
            <p className="text-sm uppercase tracking-[0.15em] text-white/80">AI Recovery Mode</p>
            <h1 className="mt-3 font-display text-3xl font-bold">Image-based password recovery with smart OTP validation.</h1>
            <div className="mt-6 space-y-2 text-sm text-white/90">
              {aiTips.map((tip) => (
                <p key={tip}>- {tip}</p>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-2xl font-bold">Forgot password</h2>
            {step === 1 && (
              <form className="mt-5 space-y-4" onSubmit={sendOtp}>
                <Input label="Account email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit">Send OTP</Button>
              </form>
            )}

            {step === 2 && (
              <form className="mt-5 space-y-4" onSubmit={verify}>
                <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Choose your image pattern</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["mountain", "cube", "planet", "leaf", "cloud", "flame"].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setSelectedImage(item)}
                        className={`rounded-xl border px-3 py-4 text-xs capitalize ${selectedImage === item ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit">Verify & continue</Button>
              </form>
            )}

            {step === 3 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-slate-700">Verification successful. You can now create a new password in the next secure step.</p>
                <Button onClick={() => showToast("Password reset flow connected", "info")}>Proceed</Button>
              </div>
            )}
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
