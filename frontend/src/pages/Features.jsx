import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MarketingHero from "./home/MarketingHero";
import PageContainer from "../components/layout/PageContainer";

const CORE_SYSTEMS = [
  {
    title: "Dynamic ticket tiers",
    desc: "Early bird, VIP, and member-only inventory with locks and timed price steps.",
    icon: "🎫",
    tag: "Revenue",
    grad: "from-violet-500 to-purple-600",
    pill: "bg-violet-100 text-violet-800",
  },
  {
    title: "Attendee CRM",
    desc: "Registration fields, segments, exports for check-in and on-site logistics.",
    icon: "👥",
    tag: "Data",
    grad: "from-cyan-500 to-blue-600",
    pill: "bg-cyan-100 text-cyan-800",
  },
  {
    title: "Payout-ready payments",
    desc: "Stripe-style flows, invoices, and multi-currency for global summits.",
    icon: "💳",
    tag: "Payouts",
    grad: "from-emerald-500 to-teal-600",
    pill: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Instant entry",
    desc: "Browser QR scanning for staff—no extra app—included in organizer mode.",
    icon: "✨",
    tag: "On-site",
    grad: "from-orange-500 to-rose-600",
    pill: "bg-orange-100 text-orange-800",
  },
];

const LOGS = [
  { time: "14:02", user: "Alex R.", amt: "+$49.00", amtStyle: true },
  { time: "13:58", user: "Sarah K.", amt: "+$149.00", amtStyle: true },
  { time: "13:45", user: "Mike T.", amt: "VALID", amtStyle: false },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MarketingHero
        eyebrow="Platform"
        title={
          <>
            Everything hosts need{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              from first RSVP to payout.
            </span>
          </>
        }
        subtitle="Tickets, attendee data, payouts, and check-in — one calm operations layer instead of brittle spreadsheets."
      />

      <PageContainer>
        <div className="py-12 md:py-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {CORE_SYSTEMS.map((sys, idx) => (
              <motion.div
                key={sys.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="text-3xl">{sys.icon}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${sys.pill}`}
                  >
                    {sys.tag}
                  </span>
                </div>
                <div
                  className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${sys.grad}`}
                  aria-hidden
                />
                <h3 className="font-display text-xl font-bold text-slate-900">{sys.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{sys.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>

      <section className="border-y border-slate-100 bg-slate-900 py-14 md:py-20">
        <PageContainer>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-black text-white md:text-4xl md:leading-tight">
                Live sales &amp;{" "}
                <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
                  check-in velocity
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                See payout readiness, scan progress, and last sales in one dashboard — same energy as the Event explorer, tuned for hosts.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Payout status
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <span className="font-display text-3xl font-bold text-white">$42,850</span>
                    <span className="text-xs font-bold text-emerald-400">Ready</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Check-in
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    <span className="font-semibold text-white">780</span> scanned · 1,000 total
                  </p>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:opacity-90"
              >
                Open dashboard
              </Link>
            </div>

            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-400">
                  LIVE_FEED
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {LOGS.map((log) => (
                  <div
                    key={log.time + log.user}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500">{log.time}</span>
                      <span className="text-xs font-bold text-white">{log.user}</span>
                    </div>
                    <span
                      className={`text-xs font-extrabold ${log.amtStyle ? "text-violet-300" : "text-emerald-400"}`}
                    >
                      {log.amt}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-3 -left-3 rotate-[-3deg] rounded-2xl bg-emerald-500 px-4 py-3 text-white shadow-xl">
                <p className="text-[9px] font-bold uppercase opacity-90">Conversion</p>
                <p className="font-display text-2xl font-black">12.4%</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <div className="py-14 text-center">
          <p className="text-sm text-slate-500">Ready to browse what&apos;s live?</p>
          <Link
            to="/event"
            className="mt-4 inline-flex rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
          >
            Explore events →
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
