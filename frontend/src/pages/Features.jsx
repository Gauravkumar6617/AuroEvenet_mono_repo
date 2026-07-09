import { Link } from "react-router-dom";
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

export default function Features() {
  return (
    <div className="py-8 pb-20">
      <PageContainer>
        <SectionHeader eyebrow="Platform Features" align="center"
          title="Everything for high-signal knowledge sharing"
          description="A single workspace for asking, answering, publishing, and moderating knowledge at scale."
          action={<Badge tone="success" dot>Free to start</Badge>} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
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

        <div className="rounded-3xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.2)] p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-3">Ready when you are</p>
          <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-2">Join BlogByte, free</h2>
          <p className="text-sm text-[#6b6358] mb-5">Create an account and start sharing what you know.</p>
          <Link to="/signup"><Button variant="outline">Get started →</Button></Link>
        </div>
      </PageContainer>
    </div>
  );
}