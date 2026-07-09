import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";

const SECTIONS = [
  {
    icon: "📖",
    title: "What data we collect",
    body: `We collect the minimum needed to run BlogByte. This includes:
    
• **Account data** — email, username, hashed password (never plaintext).
• **Content you create** — posts, comments, votes, bookmarks.
• **Reading history** — which posts you've opened, approximate time spent, and whether you scrolled to the bottom. This is used only to power your personalised feed and de-duplicate already-read posts.
• **Device & session** — IP address, browser/device type, and session tokens for security.
• **Analytics** — only if you opt in. Anonymous, aggregated usage stats (page views, feature usage). Never linked to your identity.`,
  },
  {
    icon: "⚙️",
    title: "How we use it",
    body: `We use your data to:

• **Run the product** — authentication, serving your content, moderation.
• **Personalise your feed** — reading history and topic weights rank posts you'll find relevant. You can disable this in Settings → Topic Preferences.
• **Improve BlogByte** — aggregated, anonymised analytics help us understand what's working.
• **Security** — detect abuse, spam, and unauthorised access.

We do **not** use your data to serve ads, train external AI models, or build profiles for third-party marketing.`,
  },
  {
    icon: "🤝",
    title: "Who we share data with",
    body: `We do not sell your personal data. Period.

We share data with:
• **Infrastructure providers** — hosting (servers, databases). These are data processors under contract and cannot use your data independently.
• **Error tracking** — anonymous crash reports to fix bugs.
• **Legal obligations** — if required by law or to protect users from serious harm.

No ad networks. No data brokers. No social media tracking pixels.`,
  },
  {
    icon: "🔐",
    title: "Security",
    body: `• Passwords are hashed using bcrypt — we never store or see your plaintext password.
• All data is encrypted in transit (TLS 1.3) and at rest (AES-256).
• Session tokens are rotated on sensitive actions.
• We run regular dependency audits and follow responsible disclosure for security reports.
• Report vulnerabilities to: security@blogbyte.dev`,
  },
  {
    icon: "✅",
    title: "Your rights",
    body: `You have the right to:

• **Access** — request a full export of your data at any time from Dashboard → Settings → Export data.
• **Correction** — update your profile, preferences, and content.
• **Deletion** — delete your account and all associated data permanently from Settings → Account → Delete account. This is irreversible.
• **Portability** — export your posts and activity in JSON format.
• **Withdraw consent** — change your tracking preferences from Settings → Privacy at any time.

For GDPR / DPDP requests contact: privacy@blogbyte.dev`,
  },
  {
    icon: "🍪",
    title: "Cookies & tracking",
    body: `We use minimal cookies:

• **Essential** — session auth cookie. Required. Cannot be disabled.
• **Reading history** — server-side log, not a cookie. Opt-out available in Settings.
• **Analytics** — only with your explicit consent via the cookie banner.

We do not use third-party tracking scripts, Facebook Pixel, Google Analytics, or similar tools without your consent.`,
  },
  {
    icon: "🌍",
    title: "Data residency",
    body: `BlogByte data is stored on servers in the European Union (AWS eu-west-1) by default. If you are in India, your data may also be processed in ap-south-1 (Mumbai) for performance. Both regions are GDPR-compliant and follow India's DPDP Act 2023.`,
  },
  {
    icon: "📅",
    title: "Retention",
    body: `• Account and content data: retained until you delete your account.
• Reading history: 90 days rolling window. Older entries are automatically purged.
• Server logs: 30 days for security purposes.
• Deleted content: permanently removed within 30 days of deletion.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="py-10 pb-24">
      <PageContainer narrow>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fdf0ea] border border-[rgba(232,93,38,0.2)] px-3 py-1 text-xs font-semibold text-[#e85d26] mb-4">
              🔒 Privacy Policy
            </div>
            <h1 className="font-display text-3xl font-bold text-[#1a1814]">How we handle your data</h1>
            <p className="text-sm text-[#6b6358] mt-2 leading-relaxed max-w-xl">
              We believe privacy is a right, not a feature. This document explains in plain language exactly what we collect, why, and what you can do about it.
            </p>
            <p className="text-xs text-[#a09880] mt-3">Last updated: May 2026 · Effective: May 1, 2026</p>
          </div>

          {/* Quick summary */}
          <div className="rounded-2xl bg-[rgba(232,93,38,0.04)] border border-[rgba(232,93,38,0.15)] p-5 mb-8">
            <p className="text-sm font-bold text-[#1a1814] mb-3">TL;DR — The short version</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: "🚫", text: "No ads. Ever." },
                { icon: "🤐", text: "We don't sell your data." },
                { icon: "🗑️", text: "Delete your account anytime." },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 rounded-xl bg-white border border-[rgba(90,80,60,0.1)] px-3 py-2.5">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-semibold text-[#1a1814]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-1">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-[rgba(90,80,60,0.1)] bg-white overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none hover:bg-[rgba(90,80,60,0.02)] transition-colors">
                    <span className="text-xl">{s.icon}</span>
                    <span className="flex-1 text-sm font-bold text-[#1a1814]">{s.title}</span>
                    <svg className="w-4 h-4 text-[#a09880] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                  </summary>
                  <div className="px-5 pb-5 pt-1 border-t border-[rgba(90,80,60,0.07)]">
                    <div className="prose-content text-sm text-[#6b6358] leading-relaxed whitespace-pre-line">
                      {s.body.split("\n").map((line, j) => {
                        const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                        return <p key={j} className="mb-1" dangerouslySetInnerHTML={{ __html: bold }} />;
                      })}
                    </div>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-10 rounded-2xl bg-[#1a1814] text-white p-6 text-center">
            <p className="font-display text-lg font-bold mb-2">Questions about your privacy?</p>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mb-4">We're humans, not bots. We actually read and respond to privacy emails.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:privacy@blogbyte.dev" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                📧 privacy@blogbyte.dev
              </a>
              <Link to="/contact" className="btn-secondary text-sm px-5 py-2.5 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                Contact form
              </Link>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}
