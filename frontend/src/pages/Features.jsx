import { Link } from "react-router-dom";
import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const features = [
  { icon: "🗳️", title: "Reddit-style voting", desc: "Community-driven signal. Posts and answers ranked by upvotes, not algorithm. Best content always floats.", tag: "Discovery" },
  { icon: "🧵", title: "Threaded answers", desc: "Nested reply threads so complex topics get the depth they deserve. Quora-style knowledge tree structure.", tag: "Discussion" },
  { icon: "📝", title: "3 post types", desc: "Ask questions, start discussions, or publish full articles — each with its own editor and formatting tools.", tag: "Publishing" },
  { icon: "🏆", title: "Reputation system", desc: "Earn points for accepted answers, upvotes, and quality posts. Reputation unlocks moderation privileges.", tag: "Gamification" },
  { icon: "🔖", title: "Save & organize", desc: "Bookmark posts into personal collections. Build your own knowledge library across any topic.", tag: "Productivity" },
  { icon: "🔔", title: "Smart notifications", desc: "Get notified on answers, mentions, and upvote milestones — with full control over what and when.", tag: "Engagement" },
  { icon: "🛡️", title: "Community moderation", desc: "Transparent report queue, content flags, and tiered admin roles. Keep quality high at scale.", tag: "Safety" },
  { icon: "📊", title: "Analytics dashboard", desc: "Track your post views, engagement rate, follower growth, and content performance over time.", tag: "Insights" },
  { icon: "🔍", title: "Powerful search", desc: "Full-text search across all posts, answers, tags, and user profiles with real-time results.", tag: "Discovery" },
];

const PLANS = [
  { name: "Free", price: "$0", period: "forever", features: ["Full feed access", "Post questions & discussions", "Vote and comment", "Save up to 50 posts", "Basic profile"], cta: "Get started", highlight: false },
  { name: "Pro", price: "$8", period: "per month", features: ["Everything in Free", "Publish long-form articles", "Unlimited saves", "Analytics dashboard", "Verified badge", "Priority support"], cta: "Start free trial", highlight: true },
  { name: "Team", price: "$24", period: "per month", features: ["Everything in Pro", "Private community spaces", "Team moderation tools", "Custom branding", "API access", "Dedicated support"], cta: "Contact us", highlight: false },
];

export default function Features() {
  const [activePlan, setActivePlan] = useState("Pro");

  return (
    <div className="py-8 pb-20">
      <PageContainer>
        <SectionHeader eyebrow="Platform Features" align="center"
          title="Everything for high-signal knowledge sharing"
          description="A single workspace for asking, answering, publishing, and moderating knowledge at scale."
          action={<Badge tone="success" dot>Free to start</Badge>} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-20">
          {features.map((f, i) => (
            <Card key={i} hover className="rounded-2xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fdf0ea] text-2xl">{f.icon}</div>
                <Badge tone="neutral">{f.tag}</Badge>
              </div>
              <h3 className="font-display text-lg font-bold text-[#1a1814] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[#6b6358] leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>

        <SectionHeader eyebrow="Pricing" align="center" title="Simple, honest pricing" description="Start free. Upgrade when you need more power." />
        <div className="grid gap-5 md:grid-cols-3 mb-16">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`rounded-3xl p-6 border-[1.5px] transition-all ${plan.highlight ? "border-[#e85d26] bg-[#1a1814] text-white shadow-[0_8px_32px_rgba(232,93,38,0.2)]" : "border-[rgba(90,80,60,0.12)] bg-white"}`}>
              {plan.highlight && <Badge tone="brand" dot>Most popular</Badge>}
              <div className={`mt-3 font-display text-xl font-bold ${plan.highlight ? "text-white" : "text-[#1a1814]"}`}>{plan.name}</div>
              <div className="flex items-baseline gap-1 mt-1 mb-4">
                <span className={`font-display text-4xl font-bold ${plan.highlight ? "text-white" : "text-[#1a1814]"}`}>{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? "text-[#a09880]" : "text-[#6b6358]"}`}>/{plan.period}</span>
              </div>
              <div className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <span className={`text-xs font-bold ${plan.highlight ? "text-[#e85d26]" : "text-green-600"}`}>✓</span>
                    <span className={plan.highlight ? "text-[#d0c8be]" : "text-[#6b6358]"}>{f}</span>
                  </div>
                ))}
              </div>
              <Button className={`w-full ${plan.highlight ? "bg-[#e85d26] hover:bg-[#c44718]" : ""}`}
                variant={plan.highlight ? "primary" : "secondary"} size="lg">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.2)] p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-3">Questions?</p>
          <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-2">Need help choosing a plan?</h2>
          <p className="text-sm text-[#6b6358] mb-5">Talk to us and we'll find the right fit for your team or community.</p>
          <Link to="/contact"><Button variant="outline">Get in touch →</Button></Link>
        </div>
      </PageContainer>
    </div>
  );
}