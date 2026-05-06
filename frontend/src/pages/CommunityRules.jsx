import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";

const ALL_COMMUNITIES = [
  { slug: "engineering", name: "Engineering", icon: "🛠️", desc: "System design, backend, infra, and everything that ships to prod.", members: 4200, posts: 892, rules: [
    { title: "Be constructive", body: "Critique ideas, not people. Offer solutions when pointing out problems." },
    { title: "No self-promotion spam", body: "Sharing your work is welcome, but only if it adds value to the discussion." },
    { title: "Keep discussions technical", body: "Avoid off-topic chatter. Focus on engineering practices, tools, and architecture." },
  ]},
  { slug: "ai-ml", name: "AI & ML", icon: "🤖", desc: "LLMs, fine-tuning, MLOps, and the future of intelligence.", members: 6800, posts: 2140, rules: [
    { title: "Cite your sources", body: "When sharing claims about model performance or research, provide links or references." },
    { title: "No hype without substance", body: "Avoid low-effort AI hype posts. Share experiments, data, and reproducible results." },
    { title: "Respect compute costs", body: "When sharing training setups, be mindful of accessibility for smaller teams." },
  ]},
  { slug: "product-design", name: "Product Design", icon: "🎨", desc: "UX research, design systems, and shipping products people love.", members: 2900, posts: 640, rules: [
    { title: "Show your work", body: "Screenshots, prototypes, and process notes make feedback more actionable." },
    { title: "Be kind to beginners", body: "Design is for everyone. Welcome questions from people learning the craft." },
    { title: "Give specific feedback", body: "Vague praise or criticism helps no one. Point to what works and why." },
  ]},
  { slug: "fastapi", name: "FastAPI", icon: "⚡", desc: "The community for Python async APIs — tips, patterns, and war stories.", members: 1800, posts: 430, rules: [
    { title: "Share minimal reproducible examples", body: "When asking for help, include a small code sample that demonstrates the issue." },
    { title: "Use the docs first", body: "Check the official FastAPI documentation before asking common questions." },
    { title: "Stay on topic", body: "General Python questions are welcome, but keep the focus on API development." },
  ]},
  { slug: "devops", name: "DevOps & Platform", icon: "⚙️", desc: "CI/CD, Kubernetes, observability, and keeping prod happy.", members: 3100, posts: 780, rules: [
    { title: "Blameless post-mortems", body: "When discussing incidents, focus on systems and processes, not individuals." },
    { title: "Security by default", body: "Do not share sensitive infrastructure details, credentials, or private IPs." },
    { title: "Share runbooks", body: "If you solved a tricky ops problem, share the steps so others can learn." },
  ]},
  { slug: "startup", name: "Founder Logs", icon: "🚀", desc: "Raw, honest stories from people building companies.", members: 1400, posts: 320, rules: [
    { title: "Be honest", body: "Share real numbers, real struggles, and real lessons. No growth-hacking fluff." },
    { title: "No stealth pitches", body: "This is a community for learning, not a lead-generation channel." },
    { title: "Support fellow founders", body: "Building is hard. Celebrate wins and offer support during rough patches." },
  ]},
  { slug: "open-source", name: "Open Source", icon: "🔓", desc: "Maintainers, contributors, and everything OSS.", members: 2600, posts: 560, rules: [
    { title: "Respect maintainers' time", body: "Before opening an issue, search existing ones and provide clear reproduction steps." },
    { title: "License awareness", body: "Only share code and projects with clear, OSI-approved licenses." },
    { title: "Credit contributors", body: "When sharing a project, acknowledge the people and projects that helped you." },
  ]},
  { slug: "career", name: "Career & Growth", icon: "🎯", desc: "Levelling up, interviews, leadership, and navigating big tech.", members: 5200, posts: 1230, rules: [
    { title: "No compensation bragging", body: "Salary discussions are welcome, but avoid one-upmanship. Share ranges and context." },
    { title: "Protect anonymity", body: "When discussing employers, avoid naming specific individuals or leaking confidential info." },
    { title: "Help others rise", body: "If you have interview experience or career advice, share it generously." },
  ]},
  { slug: "frontend", name: "Frontend", icon: "🖥️", desc: "React, Vite, performance, and everything the user touches.", members: 3900, posts: 870, rules: [
    { title: "Accessibility matters", body: "When sharing UI work, consider and mention accessibility practices." },
    { title: "Performance with proof", body: "Claims about performance improvements should include metrics or before/after data." },
    { title: "Framework agnostic respect", body: "Every framework has trade-offs. Avoid fanboyism and keep discussions balanced." },
  ]},
  { slug: "data-science", name: "Data Science", icon: "📊", desc: "Analytics, pipelines, notebooks, and making data legible.", members: 2200, posts: 490, rules: [
    { title: "Reproducible notebooks", body: "Share code and data sources so others can reproduce your analysis." },
    { title: "Ethical data use", body: "Do not share datasets or insights that violate privacy or consent." },
    { title: "Interpret, don't just predict", body: "Focus on explaining models and findings, not just accuracy metrics." },
  ]},
];

export default function CommunityRules() {
  const { slug } = useParams();
  const community = ALL_COMMUNITIES.find((c) => c.slug === slug) || ALL_COMMUNITIES[0];
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a1814] to-[#2d2820] border-b border-[rgba(90,80,60,0.15)]">
        <PageContainer>
          <div className="py-8 flex items-start gap-5 flex-wrap">
            <span className="text-5xl">{community.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl font-bold text-white">{community.name}</h1>
                <span className="text-xs text-[rgba(255,255,255,0.4)]">Community Rules</span>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.6)] max-w-xl leading-relaxed">{community.desc}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-xs text-[rgba(255,255,255,0.5)]">👥 {community.members.toLocaleString()} members</span>
                <span className="text-xs text-[rgba(255,255,255,0.5)]">📝 {community.posts.toLocaleString()} posts</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Link to={`/communities/${slug}`} className="text-sm px-5 py-2.5 rounded-xl font-semibold transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20">
                ← Back to community
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="pt-8 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📜</span>
              <h2 className="font-display text-xl font-bold text-[#1a1814]">Rules & Guidelines</h2>
            </div>

            <div className="space-y-4">
              {community.rules.map((rule, i) => (
                <motion.div
                  key={rule.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card>
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fdf0ea] text-[#e85d26] text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm font-bold text-[#1a1814]">{rule.title}</span>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={`text-[#a09880] transition-transform ${expanded === i ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {expanded === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-[#6b6358] leading-relaxed mt-3 pl-11"
                      >
                        {rule.body}
                      </motion.p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 surface rounded-2xl p-5">
              <p className="text-sm font-bold text-[#1a1814] mb-2">Need to report a violation?</p>
              <p className="text-xs text-[#6b6358] leading-relaxed mb-3">
                If you see content that breaks these rules, use the report button on the post or comment, or contact a moderator directly.
              </p>
              <Link to={`/communities/${slug}`} className="text-xs font-semibold text-[#e85d26] hover:underline">
                Return to {community.name} →
              </Link>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
