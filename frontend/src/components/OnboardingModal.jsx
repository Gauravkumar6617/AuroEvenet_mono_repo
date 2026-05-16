import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { apiClient } from "../services/api";

const fallbackGoalQuestions = [
  {
    id: "fallback_goal",
    question: "What are you hoping to learn, build, or discover on Nexos?",
  },
];

const fallbackExperienceQuestions = [
  {
    id: "fallback_experience",
    question: "How deep should your recommendations go right now?",
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onboardingDebug = (...args) => console.info("[OnboardingDebug:Modal]", ...args);

  useEffect(() => {
    onboardingDebug("mounted, loading onboarding data");
    apiClient.getOnboardingData()
      .then(data => {
        onboardingDebug("onboarding data loaded", {
          categoryCount: data?.categories?.length || 0,
          topicCounts: (data?.categories || []).flatMap(cat =>
            (cat.topics || []).map(topic => ({
              category: cat.name,
              topicId: topic.id,
              topicName: topic.name,
              availablePosts: topic.post_count ?? 0,
            }))
          ),
          categories: data?.categories || [],
        });
        setCategories(data?.categories || []);
      })
      .catch(error => {
        onboardingDebug("failed to load onboarding data", error);
        console.error(error);
      })
      .finally(() => {
        setIsLoadingConfig(false);
      });
  }, []);

  const steps = ["Welcome", "Interests", "Goals", "Experience"];
  const totalSteps = steps.length;

  const configuredCategories = categories
    .map(cat => ({ ...cat, topics: cat.topics || [] }))
    .filter(cat => cat.topics.length > 0);
  const allTopics = configuredCategories.flatMap(c => c.topics) || [];
  const hasConfiguredTopics = allTopics.length > 0;
  const activeTopics = allTopics.filter(t => selectedTopicIds.includes(t.id));
  const selectedTopicDebug = activeTopics.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    availablePosts: t.post_count ?? 0,
  }));
  const dynamicQuestions = [...new Map(activeTopics.flatMap(t => t.questions || []).map(q => [q.id, q])).values()];
  const questionTopicById = new Map(dynamicQuestions.map(q => [q.id, q.topic_id]));
  const step2Questions = dynamicQuestions.filter(q => q.page <= 2 || !q.page);
  const step3Questions = dynamicQuestions.filter(q => q.page >= 3);
  const visibleStep2Questions = step2Questions.length > 0 ? step2Questions : fallbackGoalQuestions;
  const visibleStep3Questions = step3Questions.length > 0 ? step3Questions : fallbackExperienceQuestions;

  const toggleTopic = (tId) => {
    const topic = allTopics.find(t => t.id === tId);
    setSelectedTopicIds(prev => {
      const wasSelected = prev.includes(tId);
      const next = wasSelected ? prev.filter(x => x !== tId) : [...prev, tId];
      onboardingDebug(wasSelected ? "topic deselected" : "topic selected", {
        topic: topic ? {
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          availablePosts: topic.post_count ?? 0,
        } : { id: tId },
        selectedTopicIds: next,
        selectedTopics: allTopics
          .filter(t => next.includes(t.id))
          .map(t => ({ id: t.id, name: t.name, availablePosts: t.post_count ?? 0 })),
      });
      return next;
    });
  };

  const canProceed = () => {
    if (step === 1) return !isLoadingConfig && (!hasConfiguredTopics || selectedTopicIds.length >= 1);
    if (step === 2) return visibleStep2Questions.some(q => answers[q.id]?.trim());
    return true;
  };

  const handleFinish = async () => {
    onboardingDebug("finish clicked", {
      selectedTopicIds,
      selectedTopics: selectedTopicDebug,
      totalAvailablePostsForSelection: selectedTopicDebug.reduce((sum, t) => sum + t.availablePosts, 0),
      answers,
    });
    setIsSubmitting(true);
    try {
      if (selectedTopicIds.length > 0) {
        onboardingDebug("saving topics", {
          selectedTopicIds,
          selectedTopics: selectedTopicDebug,
          topicsWithNoPosts: selectedTopicDebug.filter(t => t.availablePosts === 0),
        });
        await apiClient.saveTopics({ topic_ids: selectedTopicIds });
      }
      const payloadAnswers = Object.entries(answers)
        .map(([qId, answer]) => {
          const numericQuestionId = Number(qId);
          if (!Number.isInteger(numericQuestionId) || numericQuestionId <= 0) return null;
          return {
            question_id: numericQuestionId,
            topic_id: questionTopicById.get(numericQuestionId),
            answer: answer.trim()
          };
        })
        .filter(a => a?.answer);
      if (payloadAnswers.length > 0) {
        onboardingDebug("saving answers", payloadAnswers);
        await apiClient.saveAnswers({ answers: payloadAnswers });
      }
      if (selectedTopicIds.length === 0 && payloadAnswers.length === 0) {
        onboardingDebug("marking onboarding complete without configured topics/questions");
        await apiClient.markOnboardingComplete();
      }
      onboardingDebug("saved successfully, closing popup");
      onClose();
    } catch (e) {
      onboardingDebug("save failed", e);
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
          <div className="grid grid-cols-4 gap-2 mb-2">
            {steps.map((s, i) => (
              <div key={s} className="min-w-0">
                <div className={`step-indicator ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`mt-1 truncate text-[10px] font-semibold ${i === step ? "text-[#e85d26]" : "text-[#a09880]"}`}>{s}</p>
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
                <p className="text-[#6b6358] text-sm leading-relaxed mb-4">Answer a few quick prompts so Nexos can shape your feed around the topics, depth, and goals that matter to you.</p>
                <div className="rounded-xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.15)] p-4">
                  <p className="text-sm font-semibold text-[#e85d26] mb-2">Your setup helps us tune:</p>
                  {["Topics that show up first", "The level of detail in recommendations", "Communities and posts worth your time"].map((item) => (
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
                <p className="text-[#a09880] text-sm mb-4">{hasConfiguredTopics ? "Pick at least 1 to personalize your feed." : "Topics are not configured yet, so we will start with your goals instead."}</p>
                {isLoadingConfig ? (
                  <div className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-[#faf9f7] p-4 text-sm text-[#a09880]">Loading topics...</div>
                ) : hasConfiguredTopics ? (
                  configuredCategories.map((cat) => (
                    <div key={cat.id} className="mb-4">
                      <h3 className="text-xs font-bold text-[#a09880] uppercase tracking-wider mb-2">{cat.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {cat.topics.map((t) => (
                          <button key={t.id} onClick={() => toggleTopic(t.id)}
                            className={`tag-pill transition-all ${selectedTopicIds.includes(t.id) ? "active" : ""}`}>
                            {selectedTopicIds.includes(t.id) && <span>✓ </span>}{t.name}
                            <span className="ml-1 text-[10px] opacity-70">{t.post_count ?? 0} posts</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-[rgba(232,93,38,0.15)] bg-[#fdf0ea] p-4">
                    <p className="text-sm font-semibold text-[#1a1814] mb-1">We can still personalize your start.</p>
                    <p className="text-sm text-[#6b6358]">The admin topic list is empty right now, so Nexos will ask two broad questions and save those as your first preferences.</p>
                  </div>
                )}
                {selectedTopicIds.length > 0 && (
                  <div className="mt-3 rounded-xl border border-[rgba(232,93,38,0.15)] bg-[#fdf0ea] p-3">
                    <p className="text-xs font-semibold text-[#e85d26]">
                      {selectedTopicIds.length} selected · {selectedTopicDebug.reduce((sum, t) => sum + t.availablePosts, 0)} matching posts
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedTopicDebug.map(topic => (
                        <span key={topic.id} className="rounded-full bg-white px-2 py-1 text-[11px] text-[#6b6358]">
                          {topic.name}: {topic.availablePosts}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">Your Goals</h2>
                <p className="text-[#a09880] text-sm mb-4">Tell us about your objectives.</p>
                <div className="space-y-4">
                  {visibleStep2Questions.map((q) => (
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
                  ))}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold text-[#1a1814] mb-1">Your Experience</h2>
                <p className="text-[#a09880] text-sm mb-4">Help us calibrate the depth of content to show you.</p>
                <div className="space-y-4">
                  {visibleStep3Questions.map((q) => (
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
            <Button onClick={handleFinish} disabled={isSubmitting || !canProceed()} className="shadow-[0_4px_16px_rgba(232,93,38,0.3)]">
              {isSubmitting ? "Saving..." : "🎉 Enter Nexos"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
