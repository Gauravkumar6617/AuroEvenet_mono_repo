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
    { label: "Login", to: "/login" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 py-12">
      <PageContainer>
        <div className="surface p-6 md:p-8">
          <div className="mb-8 grid gap-5 border-b border-slate-200 pb-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold">Build smarter discussions with Nexos</h3>
              <p className="mt-2 text-sm text-slate-600">One place for questions, deep answers, and community knowledge.</p>
            </div>
            <div className="flex gap-2">
              <input className="input-field md:w-64" placeholder="Work email" />
              <Button>Subscribe</Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="font-display text-xl font-bold">
                Nex<span className="gradient-text">os</span>
              </p>
              <p className="mt-3 text-sm text-slate-600">A premium knowledge-sharing platform combining short-form conversation with in-depth answers.</p>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{title}</p>
                <div className="space-y-2">
                  {links.map((item) => (
                    <Link key={item.to} to={item.to} className="block text-sm text-slate-600 hover:text-brand-700">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Nexos. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Status</span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
