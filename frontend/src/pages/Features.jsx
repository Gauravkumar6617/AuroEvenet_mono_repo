import { Link } from "react-router-dom";
import { useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const TABS = ["User Features", "Admin Panel", "Super Admin"];
const FEATURES = {
  "User Features": {
    meta: "47 features — the full public-facing platform",
    sections: [
      { title: "Auth & Registration", icon: "🔐", items: [
        { name: "Register form", desc: "Email, username, password with confirm" },
        { name: "Password strength meter", desc: "Live bar: weak / fair / strong / very strong" },
        { name: "Show/hide password", desc: "Eye icon toggle on all password inputs" },
        { name: "Username availability", desc: "Debounced API check with live feedback" },
        { name: "Google & GitHub OAuth", desc: "One-click sign in via OAuth providers" },
        { name: "Forgot password flow", desc: "Email reset link with token validation" },
        { name: "Email verification", desc: "Banner / modal nudging unverified users" },
        { name: "Subscribe popup", desc: "Shown to guests after 2 posts — smooth slide-up" },
      ]},
      { title: "AI Personalisation", icon: "🤖", items: [
        { name: "Interest onboarding", desc: "Pick 3–5 topics on first login to seed feed" },
        { name: "Personalised home feed", desc: "AI scores posts based on liked topics & history" },
        { name: "Reading history tracking", desc: "Posts viewed >10s logged to tune feed silently" },
        { name: "'Because you liked' row", desc: "Horizontal scroll row of similar recent posts" },
        { name: "AI answer summary", desc: "TL;DR of top comments on post detail page" },
        { name: "Post enhance button", desc: "AI rewrites draft question for clarity" },
        { name: "Auto-tag suggestions", desc: "Suggests relevant tags as title is typed" },
        { name: "'People also asked'", desc: "3 related AI-generated questions per post" },
      ]},
      { title: "Notifications", icon: "🔔", items: [
        { name: "Like & comment alerts", desc: "In-app bell count for all interactions" },
        { name: "Reply & mention alerts", desc: "Notifications for thread replies and @mentions" },
        { name: "Notification centre", desc: "Full-page list, mark all read, filter by type" },
        { name: "Notification preferences", desc: "Toggle per type — likes, comments, follows, etc." },
        { name: "Email digest setting", desc: "Daily / weekly / never digest toggle" },
        { name: "Follow users & communities", desc: "Followed posts appear in personalised feed" },
      ]},
      { title: "Posts & Interaction", icon: "💬", items: [
        { name: "Home feed (Hot/New/Top)", desc: "Sorted, infinite scroll, AI-personalised" },
        { name: "Post detail with threads", desc: "Nested comments, votes, AI panel, share" },
        { name: "Create post (3 modes)", desc: "Question, Discussion, Article — with polls" },
        { name: "Edit & delete own posts", desc: "Edit within 15 min, 'edited' label shown" },
        { name: "Vote + bookmark + share", desc: "Optimistic UI, save to personal list" },
        { name: "Report content", desc: "Flag post or comment with reason selector" },
        { name: "Search page", desc: "Posts + users + communities, tag filter, date range" },
      ]},
    ]
  },
  "Admin Panel": {
    meta: "22 features — moderator panel at /admin (role-guarded route)",
    sections: [
      { title: "Content Moderation", icon: "🚩", items: [
        { name: "Reports queue", desc: "All flagged posts/comments sorted by count" },
        { name: "Approve / dismiss / remove", desc: "Full action set on each reported item" },
        { name: "Pin / unpin post", desc: "Sticky posts to top of community feed" },
        { name: "Lock thread", desc: "Disable new comments on any post" },
        { name: "AI toxicity scanner", desc: "Auto-flags high-risk content before publishing" },
        { name: "AI spam detector", desc: "Flags repeated low-quality posts from same user" },
      ]},
      { title: "Community Management", icon: "⚙️", items: [
        { name: "Community settings", desc: "Name, description, avatar, banner, rules" },
        { name: "Member list + ban", desc: "All members, post count, temporary / permanent ban" },
        { name: "Assign co-moderator", desc: "Promote members to moderator role" },
        { name: "Manage custom flairs", desc: "Create / edit / delete post flair tags" },
        { name: "Toggle post approval", desc: "Require mod approval before posts go live" },
        { name: "Post approval queue", desc: "Pending posts — approve or reject with note" },
      ]},
      { title: "Analytics & Audit", icon: "📊", items: [
        { name: "Community analytics", desc: "Member growth, top posts, daily post count" },
        { name: "Mod action log", desc: "Every mod action timestamped" },
        { name: "Send warning to user", desc: "DM-style warning notification to user inbox" },
        { name: "Manage categories", desc: "Create, rename, delete topic categories" },
      ]},
    ]
  },
  "Super Admin": {
    meta: "28 features — platform-wide control at /superadmin",
    sections: [
      { title: "Platform Dashboard", icon: "📊", items: [
        { name: "Stats overview", desc: "Users, DAU, posts today, reports, AI calls" },
        { name: "Live activity feed", desc: "Real-time log of signups, posts, bans, reports" },
        { name: "AI usage monitor", desc: "Token count, daily limit gauge, estimated cost" },
        { name: "AI prompt config editor", desc: "Edit system prompts for each AI feature live" },
        { name: "Growth analytics", desc: "Charts: signups/day, posts/day, top communities" },
      ]},
      { title: "User Management", icon: "👥", items: [
        { name: "All users table", desc: "Search, filter by role/status, paginate all users" },
        { name: "Global ban / unban", desc: "Platform-wide ban with reason and email notification" },
        { name: "Assign / change role", desc: "Member → Admin → Super admin promotion" },
        { name: "Impersonate user", desc: "View site as any user for support/debugging" },
        { name: "Hard delete account", desc: "Full removal with cascade, confirm by typing username" },
        { name: "Force password reset", desc: "Invalidate session and email reset link" },
      ]},
      { title: "Platform Config", icon: "⚙️", items: [
        { name: "Site settings", desc: "Name, logo, meta description, favicon" },
        { name: "Maintenance mode", desc: "Show maintenance page to all non-admin users" },
        { name: "Feature flags", desc: "Toggle AI features, pages, experiments live" },
        { name: "Announcement banner", desc: "Push sitewide banner with custom message + colour" },
        { name: "Rate limit config", desc: "Set post/comment/AI call limits per user tier" },
      ]},
      { title: "Security & Audit", icon: "🔐", items: [
        { name: "Full audit log", desc: "Every admin action, exportable as CSV" },
        { name: "API health monitor", desc: "Endpoint status, avg response time, error rate" },
        { name: "Active sessions viewer", desc: "All logged-in sessions, force logout any" },
      ]},
    ]
  }
};

export default function Features() {
  const [tab, setTab] = useState("User Features");
  const data = FEATURES[tab];
  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader eyebrow="Platform Features" title="Everything your community needs" description="A complete knowledge platform combining Reddit's energy with Quora's depth — with AI built in." align="center" />
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-[rgba(90,80,60,0.12)] bg-white p-1 gap-1">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${tab === t ? "bg-[#e85d26] text-white shadow-sm" : "text-[#6b6358] hover:bg-[rgba(90,80,60,0.05)]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-[#a09880] mb-8 font-medium">{data.meta}</p>
        <div className="space-y-8">
          {data.sections.map((section) => (
            <div key={section.title}>
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-[#1a1814] mb-4">
                <span>{section.icon}</span>{section.title}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.items.map((item) => (
                  <div key={item.name} className="surface rounded-xl p-4 post-card">
                    <p className="font-semibold text-sm text-[#1a1814] mb-1">{item.name}</p>
                    <p className="text-xs text-[#6b6358] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <Link to="/signup"><Button size="lg">Get started free →</Button></Link>
          <Link to="/contact"><Button variant="secondary" size="lg">Talk to us</Button></Link>
        </div>
      </PageContainer>
    </div>
  );
}
