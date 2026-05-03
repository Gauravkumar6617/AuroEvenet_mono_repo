import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const values = [
  { title: "Curated experiences", desc: "We prioritize high-quality events, trusted organizers, and memorable attendee experiences." },
  { title: "Open discovery", desc: "Everyone can discover, book, and host events that match their interests and location." },
  { title: "Product craftsmanship", desc: "SaaS-grade UX and performance are built into every interaction, from search to checkout." },
];

export default function About() {
  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="About AuraEvents"
          title="The global event discovery and management platform"
          description="AuraEvents connects people with experiences they love — from tech conferences to music festivals, workshops to wellness retreats."
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
              <h3 className="font-display text-2xl font-bold">Start hosting and discovering amazing events.</h3>
              <p className="mt-2 text-sm text-white/80">Join thousands of organizers and attendees on the global event platform.</p>
            </div>
            <Link to="/signup">
              <Button className="bg-white text-brand-700 hover:bg-brand-50">Get Started</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    </div>
  );
}
