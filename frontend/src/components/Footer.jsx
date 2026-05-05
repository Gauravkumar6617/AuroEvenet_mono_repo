import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "./layout/PageContainer";
import Button from "./ui/Button";

const footerLinks = {
  Product: [
    { label: "Features", to: "/features" },
    { label: "Feed", to: "/blog" },
    { label: "Create Post", to: "/create-post" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Account: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Sign in", to: "/login" },
    { label: "Sign up", to: "/signup" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-16 border-t border-[rgba(90,80,60,0.08)] py-12">
      <PageContainer>
        <div className="surface rounded-2xl p-6 md:p-10">
          {/* Top CTA row */}
          <div className="mb-8 grid gap-5 border-b border-[rgba(90,80,60,0.08)] pb-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#1a1814]">Build smarter discussions with Nexos</h3>
              <p className="mt-1 text-sm text-[#6b6358]">One place for questions, deep answers, and community knowledge.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                <span>✅</span> You're subscribed!
              </div>
            ) : (
              <div className="flex gap-2">
                <input className="input-field md:w-56" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
                <Button onClick={() => email && setSubscribed(true)}>Subscribe</Button>
              </div>
            )}
          </div>
          {/* Links grid */}
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">N</div>
                <span className="font-display text-lg font-bold text-[#1a1814]">Nex<span className="gradient-text">os</span></span>
              </Link>
              <p className="text-sm text-[#6b6358] leading-relaxed">A premium knowledge-sharing platform combining short-form conversation with in-depth answers.</p>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#a09880]">{title}</p>
                <div className="space-y-2.5">
                  {links.map((item) => (
                    <Link key={item.to} to={item.to} className="block text-sm text-[#6b6358] hover:text-[#e85d26] transition-colors">{item.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-2 text-xs text-[#a09880] sm:flex-row">
          <p>© 2026 Nexos. All rights reserved.</p>
          <div className="flex gap-4">{["Privacy", "Terms", "Status"].map(l => <span key={l} className="hover:text-[#6b6358] cursor-pointer transition-colors">{l}</span>)}</div>
        </div>
      </PageContainer>
    </footer>
  );
}
