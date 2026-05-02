import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const groups = [
  {
    title: "Discussion Engine",
    items: ["Threaded answers", "Upvote/downvote", "Saved posts", "Topic tagging"],
  },
  {
    title: "Publishing",
    items: ["Question/discussion/article modes", "Draft autosave", "Rich editor support", "Profile publishing history"],
  },
  {
    title: "Moderation & Admin",
    items: ["Report queue", "User management", "Content status actions", "Analytics snapshots"],
  },
];

export default function Features() {
  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="Platform Features"
          title="Everything needed for modern, high-signal communities"
          description="A single workspace for asking, answering, publishing, and moderating knowledge at scale."
          action={<Badge tone="brand">Free to start</Badge>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.title}>
              <h3 className="font-display text-xl font-semibold">{group.title}</h3>
              <div className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <p key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {item}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">Talk to us</Button>
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
