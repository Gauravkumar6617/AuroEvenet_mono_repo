import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const values = [
  { icon: "🎯", title: "Signal over noise", desc: "We build tools that reward depth, specificity, and expertise. Noise is filtered out by community voting, not algorithmic engagement optimization." },
  { icon: "🧠", title: "Open learning", desc: "Every member can ask, answer, publish, and discover — regardless of title or background. Knowledge is more useful when it flows freely." },
  { icon: "🔨", title: "Product craftsmanship", desc: "SaaS-grade UX and performance built into every interaction. We treat every page and component as if it's a product feature." },
];
const TEAM = [
  { name: "Priya Sharma", role: "Co-founder & CEO", avatar: "P" },
  { name: "Alex Rivera", role: "Co-founder & CTO", avatar: "A" },
  { name: "Karthik Nair", role: "Head of Product", avatar: "K" },
  { name: "Sara Ahmed", role: "Head of Community", avatar: "S" },
];

export default function About() {
  return (
    <div className="py-8 pb-20">
      <PageContainer>
        <SectionHeader eyebrow="About Nexos" align="center"
          title="A knowledge network for people who care about depth"
          description="Nexos is where builders, engineers, designers, and founders share what they actually know — not what performs on social media." />
        <div className="grid gap-5 lg:grid-cols-3 mb-16">
          {values.map((v) => (
            <Card key={v.title} className="rounded-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdf0ea] text-2xl mb-4">{v.icon}</div>
              <h3 className="font-display text-xl font-bold text-[#1a1814] mb-2">{v.title}</h3>
              <p className="text-sm text-[#6b6358] leading-relaxed">{v.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mb-16 rounded-3xl bg-[#1a1814] p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#e85d26]/10 blur-3xl" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d26] mb-3">Our story</p>
          <h2 className="font-display text-3xl font-bold md:text-4xl max-w-2xl mx-auto leading-tight">
            Built by engineers tired of shallow answers and noisy feeds.
          </h2>
          <p className="mt-4 text-[#a09880] max-w-xl mx-auto leading-relaxed text-sm">
            We started Nexos after years of frustration with Stack Overflow's adversarial culture and Quora's social-first approach. We wanted a platform that genuinely rewards expertise and deep writing. In 2024, we started building. In 2025, we launched.
          </p>
        </div>

        <SectionHeader eyebrow="Team" align="center" title="The people behind Nexos" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {TEAM.map((m) => (
            <Card key={m.name} className="rounded-2xl text-center">
              <div className="avatar h-14 w-14 text-xl mx-auto mb-3">{m.avatar}</div>
              <p className="font-display text-base font-bold text-[#1a1814]">{m.name}</p>
              <p className="text-xs text-[#a09880] mt-0.5">{m.role}</p>
            </Card>
          ))}
        </div>

        <Card className="rounded-3xl bg-gradient-to-r from-[#e85d26] to-[#c44718] text-white p-8 md:p-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold md:text-3xl">Join the next generation of knowledge sharing.</h3>
              <p className="mt-2 text-white/75 text-sm">Publish insights, answer questions, build reputation that compounds.</p>
            </div>
            <Link to="/signup" className="shrink-0">
              <Button className="bg-white text-[#e85d26] hover:bg-orange-50 shadow-none" size="lg">Create Account</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    </div>
  );
}
