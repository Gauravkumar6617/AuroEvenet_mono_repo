import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const groups = [
  {
    title: "Event Discovery",
    items: ["AI-powered event recommendations", "Location-based search", "Category filtering", "Trending events feed"],
  },
  {
    title: "Ticketing & Booking",
    items: ["Secure online payments", "QR code tickets", "Waitlist management", "Refund processing"],
  },
  {
    title: "Host Tools",
    items: ["Event analytics dashboard", "Attendee management", "Email notifications", "Revenue tracking"],
  },
];

export default function Features() {
  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="Platform Features"
          title="Everything needed to discover, host, and manage events"
          description="A complete event management platform for organizers and attendees alike."
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
