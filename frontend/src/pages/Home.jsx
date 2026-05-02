import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import TerminalActivity from "../components/TerminalActivity";

const pillars = [
  { title: "Ask better questions", desc: "Structured prompts and topic tagging help users get high-quality answers faster." },
  { title: "Write long-form answers", desc: "Blend Reddit-style speed with Quora-style depth using rich content cards." },
  { title: "Grow your reputation", desc: "Public profiles, follower graphs, and verified expertise raise discoverability." },
];

const stats = [
  { value: "1.9M", label: "Monthly discussions" },
  { value: "82%", label: "Answer resolution rate" },
  { value: "240+", label: "Active communities" },
  { value: "37K", label: "Daily active members" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);

  return (
    <div className="pb-8">
      <section className="relative overflow-hidden bg-hero-gradient pb-20 pt-16">
        <motion.div style={{ y }} className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-brand-300/30 blur-3xl" />
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -120]) }} className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />
        <PageContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Badge tone="brand">Modern community knowledge platform</Badge>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                Reddit speed meets Quora depth for <span className="gradient-text">high-signal discussions</span>.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-600">
                Build communities around questions, long-form answers, and insight-driven posts with a premium publishing and moderation experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup">
                  <Button className="px-6 py-3 text-base">Start Free</Button>
                </Link>
                <Link to="/blog">
                  <Button variant="secondary" className="px-6 py-3 text-base">
                    Explore Feed
                  </Button>
                </Link>
              </div>
            </div>
            <TerminalActivity />
          </div>
        </PageContainer>
      </section>

      <PageContainer className="mt-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label}>
              <p className="font-display text-3xl font-bold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <section className="py-20">
        <PageContainer>
          <SectionHeader
            eyebrow="Platform"
            title="A complete SaaS-grade social knowledge stack"
            description="Unified UX across discovery, discussion, writing, moderation, and analytics for teams and communities."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {pillars.map((item) => (
              <Card key={item.title}>
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <Card className="bg-gradient-to-r from-brand-600 to-violet-600 text-white">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-white/80">Launch fast</p>
              <h3 className="mt-2 font-display text-2xl font-bold">Create your first discussion space in under 3 minutes.</h3>
            </div>
            <Link to="/create-post">
              <Button className="bg-white text-brand-700 hover:bg-brand-50">Create your first post</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    </div>
  );
}
