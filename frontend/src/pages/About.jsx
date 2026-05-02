import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const values = [
  { title: "Signal over noise", desc: "We prioritize high-quality discussions, moderation tooling, and expert visibility." },
  { title: "Open learning", desc: "Every member can ask, answer, publish, and discover focused knowledge spaces." },
  { title: "Product craftsmanship", desc: "SaaS-grade UX and performance are built into every interaction." },
];

export default function About() {
  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="About BlogByte"
          title="A modern knowledge network for builders and learners"
          description="BlogByte combines fast community discussion with deep answer threads so technical knowledge is easier to share, discover, and trust."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {values.map((item) => (
            <Card key={item.title}>
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-gradient-to-r from-brand-600 to-violet-600 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold">Join the next generation of high-context discussion.</h3>
              <p className="mt-2 text-sm text-white/80">Publish insights, answer questions, and build a reputation that compounds.</p>
            </div>
            <Link to="/signup">
              <Button className="bg-white text-brand-700 hover:bg-brand-50">Create Account</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    </div>
  );
}
