import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function About() {
  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader eyebrow="About BlogByte" align="center"
          title="A modern knowledge network for builders and learners"
          description="BlogByte combines fast community discussion with deep answer threads so technical knowledge is easier to share, discover, and trust." />
        <div className="grid gap-5 lg:grid-cols-3 mb-12">
          {[
            { icon: "🎯", title: "Signal over noise", desc: "We prioritize high-quality discussions, expert visibility, and moderation tooling that keeps conversations focused." },
            { icon: "📚", title: "Open learning", desc: "Every member can ask, answer, publish, and discover focused knowledge spaces. No gatekeeping." },
            { icon: "🏆", title: "Product craftsmanship", desc: "SaaS-grade UX and performance are built into every interaction. We sweat the details." },
          ].map((v) => (
            <Card key={v.title}>
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-display text-xl font-bold text-[#1a1814] mb-2">{v.title}</h3>
              <p className="text-sm text-[#6b6358] leading-relaxed">{v.desc}</p>
            </Card>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-[#1a1814] p-10 md:p-14 text-white">
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#e85d26]/15 blur-3xl" />
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <h3 className="font-display text-3xl font-bold">Join the next generation of high-context discussion.</h3>
              <p className="mt-2 text-[#a09880] max-w-lg">Publish insights, answer questions, and build a reputation that compounds.</p>
            </div>
            <Link to="/signup"><Button size="lg" className="bg-[#e85d26] hover:bg-[#c44718] shadow-[0_4px_20px_rgba(232,93,38,0.4)]">Create free account →</Button></Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
