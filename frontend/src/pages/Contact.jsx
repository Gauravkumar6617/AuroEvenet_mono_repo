import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="Contact"
          title="Talk to the Nexos team"
          description="Share product feedback, support requests, partnerships, or moderation concerns."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            {sent ? (
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold">Message received</h3>
                <p className="mt-2 text-sm text-slate-600">Thanks, {form.name || "there"}. We will reply soon.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Message</span>
                  <textarea
                    className="input-field min-h-36 resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </label>
                <Button type="submit">Send message</Button>
              </form>
            )}
          </Card>
          <Card>
            <h3 className="font-display text-xl font-semibold">Response standards</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>General support: within 24 hours</p>
              <p>Moderation and abuse reports: within 6 hours</p>
              <p>Partnership or enterprise requests: within 48 hours</p>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
