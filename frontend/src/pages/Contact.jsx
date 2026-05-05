import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Button from "../components/ui/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <div className="py-10">
      <PageContainer narrow>
        <SectionHeader eyebrow="Get in Touch" title="Contact us" description="Have a question, feedback, or want to partner? We read every message." align="center" />
        {sent ? (
          <div className="surface rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display text-2xl font-bold text-[#1a1814]">Message sent!</h3>
            <p className="text-[#6b6358] mt-2">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="surface rounded-2xl p-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Name</label><input className="input-field" placeholder="Jane Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Email</label><input type="email" className="input-field" placeholder="jane@company.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
            </div>
            <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Subject</label><input className="input-field" placeholder="What's on your mind?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
            <div><label className="text-sm font-semibold text-[#1a1814] block mb-1.5">Message</label><textarea className="input-field min-h-36 resize-none" placeholder="Your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required /></div>
            <Button type="submit" size="lg" className="w-full">Send message →</Button>
          </form>
        )}
      </PageContainer>
    </div>
  );
}
