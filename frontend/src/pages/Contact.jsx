import { useState } from "react";
import { Link } from "react-router-dom";
import MarketingHero from "./home/MarketingHero";
import PageContainer from "../components/layout/PageContainer";

const departments = [
  { name: "Support", time: "24h", icon: "🛠️" },
  { name: "Partnerships", time: "48h", icon: "🤝" },
  { name: "Safety", time: "6h", icon: "🛡️" },
  { name: "Enterprise", time: "12h", icon: "🏢" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [activeDept, setActiveDept] = useState("Support");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MarketingHero
        eyebrow="Contact"
        align="center"
        badgePulse={false}
        title={
          <>
            We&apos;re here to help{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              you ship events.
            </span>
          </>
        }
        subtitle="Hosting, sponsorships, trust & safety — pick a lane and we’ll route your message."
      />

      <PageContainer>
        <div className="grid gap-8 pb-20 pt-10 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-10">
            {sent ? (
              <div className="py-14 text-center">
                <span className="text-5xl">🚀</span>
                <h3 className="font-display mt-4 text-2xl font-black text-slate-900">
                  Talk soon
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  We&apos;ve routed your note to{" "}
                  <span className="font-semibold text-slate-800">{activeDept}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {departments.map((d) => (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => setActiveDept(d.name)}
                        className={`rounded-2xl border-2 px-2 py-3 text-center transition ${
                          activeDept === d.name
                            ? "border-violet-500 bg-violet-50 shadow-sm"
                            : "border-slate-100 bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <span className="block text-xl">{d.icon}</span>
                        <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-wide text-slate-800">
                          {d.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Message
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={`How can ${activeDept} help?`}
                    rows={6}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 sm:w-auto sm:px-10"
                >
                  Send to {activeDept} →
                </button>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h3 className="font-display text-lg font-bold text-slate-900">Response times</h3>
              <ul className="mt-5 space-y-4">
                {departments.map((d) => (
                  <li
                    key={d.name}
                    className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-semibold text-slate-700">{d.name}</span>
                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {d.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-xl">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
              <h3 className="font-display text-lg font-bold">HQ</h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span>📍</span>
                  <span>Market St #4000, San Francisco, CA</span>
                </li>
                <li className="flex gap-3">
                  <span>✉️</span>
                  <a href="mailto:support@auraevents.io" className="hover:text-white">
                    support@auraevents.io
                  </a>
                </li>
              </ul>
              <Link
                to="/event"
                className="mt-6 inline-flex text-xs font-bold text-violet-300 hover:text-white"
              >
                ← Back to events
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
