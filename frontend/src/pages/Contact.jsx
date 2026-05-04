import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-8 pb-20">
      <PageContainer narrow>
        <SectionHeader eyebrow="Contact" align="center" title="Get in touch" description="Questions, partnerships, or feedback — we read every message." />
        {sent ? (
          <Card className="rounded-3xl text-center py-12">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="font-display text-2xl font-bold text-[#1a1814] mb-2">Message sent!</h2>
            <p className="text-[#6b6358] text-sm">We'll get back to you within 24 hours.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
            <Card className="rounded-3xl">
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Name</label>
                    <input className="input-field" placeholder="Jane Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Email</label>
                    <input className="input-field" type="email" placeholder="jane@co.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Subject</label>
                  <select className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required>
                    <option value="">Select topic</option>
                    <option>General question</option>
                    <option>Partnership / sponsorship</option>
                    <option>Bug report</option>
                    <option>Feature request</option>
                    <option>Press inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Message</label>
                  <textarea className="input-field resize-none" rows={5} placeholder="Tell us what's on your mind..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
                </div>
                <Button type="submit" size="lg" className="w-full">Send message →</Button>
              </form>
            </Card>
            <div className="space-y-4">
              {[
                { icon: "✉️", label: "Email", value: "hello@nexos.dev" },
                { icon: "🐦", label: "Twitter", value: "@nexosdev" },
                { icon: "💼", label: "LinkedIn", value: "Nexos Platform" },
              ].map((c) => (
                <Card key={c.label} className="rounded-2xl flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div><p className="text-xs text-[#a09880]">{c.label}</p><p className="text-sm font-semibold text-[#1a1814]">{c.value}</p></div>
                </Card>
              ))}
              <Card className="rounded-2xl bg-[#fdf0ea] border border-[rgba(232,93,38,0.15)]">
                <p className="text-sm font-semibold text-[#e85d26] mb-1">Response time</p>
                <p className="text-xs text-[#6b6358] leading-relaxed">We reply to all inquiries within 24 hours on business days.</p>
              </Card>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
