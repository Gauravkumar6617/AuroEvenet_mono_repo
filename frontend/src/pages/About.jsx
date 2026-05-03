import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MarketingHero from "./home/MarketingHero";
import PageContainer from "../components/layout/PageContainer";

const STATS = [
  { label: "Community members", value: "50k+", icon: "👥" },
  { label: "Events hosted", value: "1,200+", icon: "📅" },
  { label: "Partner brands", value: "450+", icon: "🤝" },
  { label: "Cities", value: "120+", icon: "🌎" },
];

const VALUES = [
  {
    title: "Community first",
    desc: "Breakthroughs happen in the hallway as much as on stage.",
    grad: "from-violet-500 to-indigo-600",
    num: "01",
  },
  {
    title: "Radical access",
    desc: "Tech education and networking for everyone — virtual, hybrid, and IRL.",
    grad: "from-cyan-500 to-blue-600",
    num: "02",
  },
  {
    title: "Host-grade quality",
    desc: "Operational depth over buzzwords — tickets, payouts, and trust.",
    grad: "from-orange-500 to-rose-500",
    num: "03",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <MarketingHero
        eyebrow="Our story"
        title={
          <>
            Infrastructure for{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              real-world gatherings.
            </span>
          </>
        }
        subtitle="AuraEvents builds the glue between organizers, attendees, and venues — from discovery on the Events page to the night-of experience."
      />

      <PageContainer>
        <div className="py-12 md:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="font-display mt-3 text-3xl font-black text-slate-900">{s.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-black text-slate-900 md:text-4xl">
              Why we show up every day.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              We aren&apos;t only a ticketing form — we&apos;re trying to match the polish of our home
              and events experience end to end for hosts and guests.
            </p>
            <ul className="mt-10 space-y-8">
              {VALUES.map((v) => (
                <li key={v.num} className="flex gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${v.grad} font-display text-sm font-black text-white shadow-md`}
                  >
                    {v.num}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
                alt="People at a conference"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/50 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-2 right-6 max-w-xs rounded-2xl border border-slate-100 bg-white p-5 shadow-xl md:-left-6">
              <p className="text-sm italic leading-relaxed text-slate-600">
                &ldquo;High-signal, low-noise — finally an events product that respects engineers.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Sarah Chen</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Principal engineer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <section className="border-t border-slate-100 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 py-16 md:py-20">
        <PageContainer className="text-center">
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-black text-white md:text-4xl">
            Ready to{" "}
            <span className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-transparent">
              find your next crowd?
            </span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/event"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            >
              Browse events
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-xl border border-white/15 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Talk to us
            </Link>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
