import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { apiClient } from "../services/api";

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiClient.getOnboardingData()
      .then(data => setCategories(data?.categories || []))
      .catch(console.error);
  }, []);

  const steps = ["Welcome", "Interests", "Goals", "Experience"];
  const totalSteps = steps.length;

  const allTopics = categories.flatMap(c => c.topics) || [];
  const activeTopics = allTopics.filter(t => selectedTopicIds.includes(t.id));
  const dynamicQuestions = [...new Map(activeTopics.flatMap(t => t.questions || []).map(q => [q.id, q])).values()];
  const step2Questions = dynamicQuestions.filter(q => q.page <= 2 || !q.page);
  const step3Questions = dynamicQuestions.filter(q => q.page >= 3);

  const toggleTopic = (tId) => setSelectedTopicIds(prev => prev.includes(tId) ? prev.filter(x => x !== tId) : [...prev, tId]);

  const canProceed = () => {
    if (step === 1) return selectedTopicIds.length >= 1;
    if (step === 2) return step2Questions.length === 0 || step2Questions.some(q => answers[q.id]?.trim());
    return true;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      if (selectedTopicIds.length > 0) {
        await apiClient.saveTopics({ topic_ids: selectedTopicIds });
      }
      const payloadAnswers = Object.entries(answers).map(([qId, answer]) => ({
        question_id: parseInt(qId),
        answer: answer.trim()
      })).filter(a => a.answer);
      if (payloadAnswers.length > 0) {
        await apiClient.saveAnswers({ answers: payloadAnswers });
      }
      onClose();
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
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
                <p className="text-[#a09880] text-sm mb-4">Pick at least 1 to personalize your feed.</p>
                {categories.map((cat) => (
                  <div key={cat.id} className="mb-4">
                    <h3 className="text-xs font-bold text-[#a09880] uppercase tracking-wider mb-2">{cat.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.topics.map((t) => (
                        <button key={t.id} onClick={() => toggleTopic(t.id)}
                          className={`tag-pill transition-all ${selectedTopicIds.includes(t.id) ? "active" : ""}`}>
                          {selectedTopicIds.includes(t.id) && <span>✓ </span>}{t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedTopicIds.length > 0 && <p className="text-xs text-[#e85d26] mt-3">{selectedTopicIds.length} selected</p>}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">Your Goals</h2>
                <p className="text-[#a09880] text-sm mb-4">Tell us about your objectives.</p>
                <div className="space-y-4">
                  {step2Questions.length === 0 ? (
                    <p className="text-sm text-[#a09880] italic">No specific goal questions for the selected topics.</p>
                  ) : (
                    step2Questions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-sm font-semibold text-[#1a1814] mb-1.5">{q.question}</label>
                        <input
                          type="text"
                          className="input-field w-full text-sm"
                          value={answers[q.id] || ""}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Type your answer..."
                        />
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">Your Experience</h2>
                <p className="text-[#a09880] text-sm mb-4">Help us calibrate the depth of content to show you.</p>
                <div className="space-y-4">
                  {step3Questions.length === 0 ? (
                    <p className="text-sm text-[#a09880] italic">No specific experience questions for the selected topics.</p>
                  ) : (
                    step3Questions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-sm font-semibold text-[#1a1814] mb-1.5">{q.question}</label>
                        <input
                          type="text"
                          className="input-field w-full text-sm"
                          value={answers[q.id] || ""}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Type your answer..."
                        />
                      </div>
                    ))
                  )}
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
            <Button onClick={handleFinish} disabled={isSubmitting || !canProceed()} className="shadow-[0_4px_16px_rgba(232,93,38,0.3)]">
              {isSubmitting ? "Saving..." : "🎉 Enter Nexos"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
