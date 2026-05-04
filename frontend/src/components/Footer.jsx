import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "./layout/PageContainer";
import Button from "./ui/Button";

const footerLinks = {
  Product: [{ label: "Features", to: "/features" }, { label: "Feed", to: "/blog" }, { label: "Create Post", to: "/create-post" }],
  Company: [{ label: "About", to: "/about" }, { label: "Contact", to: "/contact" }],
  Account: [{ label: "Dashboard", to: "/dashboard" }, { label: "Sign in", to: "/login" }, { label: "Sign up", to: "/signup" }],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-16 border-t border-[rgba(90,80,60,0.1)] pt-12 pb-8">
      <PageContainer>
        <div className="surface rounded-3xl p-7 md:p-10">
          <div className="mb-8 grid gap-6 border-b border-[rgba(90,80,60,0.08)] pb-8 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">N</div>
                <span className="font-display text-xl font-bold text-[#1a1814]">Nex<span className="gradient-text">os</span></span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#1a1814] mb-1">Build smarter discussions.</h3>
              <p className="text-sm text-[#6b6358] max-w-sm">One place for questions, deep answers, and community knowledge. Reddit's energy, Quora's depth.</p>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-[#1a1814] mb-2">Stay in the loop</p>
              {subscribed ? (
                <p className="text-sm text-green-600 font-medium">✓ You're subscribed!</p>
              ) : (
                <div className="flex gap-2">
                  <input className="input-field w-56" placeholder="Work email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <Button size="sm" onClick={() => email && setSubscribed(true)}>Subscribe</Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">Platform</p>
              <p className="text-sm text-[#6b6358] leading-relaxed">A premium knowledge-sharing platform combining short-form conversation with in-depth answers.</p>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">{title}</p>
                <div className="space-y-2">
                  {links.map((item) => (
                    <Link key={item.to} to={item.to} className="block text-sm text-[#6b6358] hover:text-[#e85d26] transition-colors">{item.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-3 text-xs text-[#a09880] sm:flex-row">
          <p>© 2026 Nexos. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Status", "Blog"].map(l => <span key={l} className="hover:text-[#6b6358] cursor-pointer transition-colors">{l}</span>)}
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
