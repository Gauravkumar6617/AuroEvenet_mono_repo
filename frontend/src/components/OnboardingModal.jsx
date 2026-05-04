import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const TOPICS = ["Engineering", "AI & ML", "Product Design", "DevOps", "Open Source", "Career", "Startup", "Data Science", "Frontend", "Backend", "System Design", "Security"];
const GOALS = [
  { id: "learn", label: "Learn from experts", icon: "📚" },
  { id: "share", label: "Share my knowledge", icon: "✍️" },
  { id: "network", label: "Connect with peers", icon: "🤝" },
  { id: "answers", label: "Get questions answered", icon: "💡" },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [experience, setExperience] = useState("");

  const steps = ["Welcome", "Interests", "Goals", "Experience"];
  const totalSteps = steps.length;

  const toggleTopic = (t) => setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleGoal = (g) => setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const canProceed = () => {
    if (step === 1) return selectedTopics.length >= 2;
    if (step === 2) return selectedGoals.length >= 1;
    return true;
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg glass-card overflow-hidden"
      >
        {/* Progress header */}
        <div className="px-6 pt-6 pb-4 border-b border-[rgba(90,80,60,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">N</div>
              <span className="font-display text-base font-bold">Nexos</span>
            </div>
            <button onClick={onClose} className="text-xs text-[#a09880] hover:text-[#6b6358] transition-colors">Skip setup</button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`step-indicator ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 min-w-[1.5rem] transition-colors ${i < step ? "bg-[#e85d26]" : "bg-[rgba(90,80,60,0.12)]"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="progress-bar mt-3">
            <div className="progress-fill" style={{ width: `${((step) / (totalSteps - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="px-6 py-5 min-h-[280px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-4xl mb-4">👋</div>
                <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-2">Welcome to Nexos!</h2>
                <p className="text-[#6b6358] text-sm leading-relaxed mb-4">Let's personalize your experience. It takes 60 seconds and unlocks a feed tailored to what you actually care about.</p>
                <div className="rounded-xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.15)] p-4">
                  <p className="text-sm font-semibold text-[#e85d26] mb-2">What you'll get:</p>
                  {["Personalized topic feed", "Recommended experts to follow", "Relevant discussions surfaced first"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[#6b6358] py-0.5">
                      <span className="text-[#e85d26]">✓</span>{item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">What topics interest you?</h2>
                <p className="text-[#a09880] text-sm mb-4">Pick at least 2 to personalize your feed.</p>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button key={t} onClick={() => toggleTopic(t)}
                      className={`tag-pill transition-all ${selectedTopics.includes(t) ? "active" : ""}`}>
                      {selectedTopics.includes(t) && <span>✓ </span>}{t}
                    </button>
                  ))}
                </div>
                {selectedTopics.length > 0 && <p className="text-xs text-[#e85d26] mt-3">{selectedTopics.length} selected</p>}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">What brings you here?</h2>
                <p className="text-[#a09880] text-sm mb-4">Select your primary goals (pick any).</p>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((g) => (
                    <button key={g.id} onClick={() => toggleGoal(g.id)}
                      className={`flex items-center gap-3 rounded-xl border-[1.5px] p-3 text-left transition-all ${selectedGoals.includes(g.id) ? "border-[#e85d26] bg-[#fdf0ea]" : "border-[rgba(90,80,60,0.12)] bg-white hover:border-[rgba(232,93,38,0.3)]"}`}>
                      <span className="text-xl">{g.icon}</span>
                      <span className="text-sm font-medium text-[#1a1814]">{g.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">Your experience level?</h2>
                <p className="text-[#a09880] text-sm mb-4">Helps us calibrate the depth of content shown.</p>
                <div className="space-y-2.5">
                  {[
                    { id: "student", label: "Student / Learning", desc: "New to the field, building foundations" },
                    { id: "mid", label: "Mid-level (2–5 yrs)", desc: "Hands-on practitioner, growing expertise" },
                    { id: "senior", label: "Senior (5+ yrs)", desc: "Depth of experience, ready to contribute" },
                    { id: "lead", label: "Lead / Staff / Principal", desc: "Driving technical strategy and teams" },
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setExperience(opt.id)}
                      className={`flex items-center gap-3 w-full rounded-xl border-[1.5px] p-3 text-left transition-all ${experience === opt.id ? "border-[#e85d26] bg-[#fdf0ea]" : "border-[rgba(90,80,60,0.12)] bg-white hover:border-[rgba(232,93,38,0.3)]"}`}>
                      <div className={`h-4 w-4 rounded-full border-2 shrink-0 transition-all ${experience === opt.id ? "border-[#e85d26] bg-[#e85d26]" : "border-[rgba(90,80,60,0.25)]"}`} />
                      <div>
                        <p className="text-sm font-semibold text-[#1a1814]">{opt.label}</p>
                        <p className="text-xs text-[#a09880]">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[rgba(90,80,60,0.08)]">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Button>
          ) : <div />}
          {step < totalSteps - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Continue →
            </Button>
          ) : (
            <Button onClick={onClose} className="shadow-[0_4px_16px_rgba(232,93,38,0.3)]">
              🎉 Enter Nexos
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
