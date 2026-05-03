import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe2,
  Heart,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import PageContainer from "../components/layout/PageContainer";

/** Demo payload — mirrors fields produced by Unified catalog + Host desk flows. */
const DEMO = {
  title: "AI Engineering Summit 2026",
  subtitle:
    "Two days on production LLMs, retrieval systems, observability — with hands-on breakout tracks.",
  banner:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=82&w=1600",
  organizer: "AuraEvents · Engineering Guild",
  startLabel: "Sun, Jun 14, 2026",
  doors: "Doors · 9:30 AM PST",
  endLabel: "Closes · 5:30 PM PST",
  locationLine: "Moscone West · 800 Howard Street",
  city: "San Francisco, CA",
  format: "Hybrid",
  timezone: "America/Los_Angeles",
  attendees: 320,
  capacity: 900,
  ticketsSold: 612,
  priceLabel: "$489",
  perks: ["Breakfast & lunch · both days", "Certificate of attendance", "Recording pass (virtual)"],
  tags: ["AI / ML", "LLMs", "Observability", "Hybrid"],
};

const INITIAL_THREAD = [
  {
    id: 1,
    user: "priya_ops",
    text: "Hybrid ticket holders — will links go out the night before?",
    time: "2h ago",
    likes: 12,
    replies: [
      { id: 101, user: "host_team", badge: "Organizer", text: "Yes, Thursday 18:00 PT with backstage checks.", time: "1h ago" },
    ],
  },
];

export default function EventDetail() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [comments] = useState(INITIAL_THREAD);

  const pct = Math.min(100, Math.round((DEMO.ticketsSold / DEMO.capacity) * 100));

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      <PageContainer className="max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            to="/event"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to events
          </Link>
          {id ? (
            <span className="font-mono text-[11px] font-semibold text-slate-400">Listing #{id}</span>
          ) : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <article className="space-y-6">
            {/* Hero */}
            <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="relative h-52 w-full sm:h-72">
                <img src={DEMO.banner} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  {DEMO.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                    {DEMO.format}
                  </span>
                </div>
              </div>
              <div className="px-6 pb-8 pt-10 sm:px-10">
                <div className="-mt-24 mb-6 flex flex-wrap gap-4 sm:-mt-20">
                  <div className="rounded-3xl bg-white px-6 py-4 shadow-xl shadow-slate-200/70 ring-1 ring-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600">{DEMO.doors}</p>
                    <p className="mt-2 font-display text-3xl font-black text-slate-900">{DEMO.priceLabel}</p>
                    <p className="text-xs text-slate-500">
                      Includes {DEMO.capacity.toLocaleString()} total inventory
                    </p>
                  </div>
                  <div className="flex flex-1 min-w-[200px] flex-col justify-center rounded-3xl border border-slate-100 bg-white/90 px-5 py-4 shadow-inner backdrop-blur">
                    <p className="text-xs font-semibold text-slate-500">Happening</p>
                    <p className="font-display text-lg font-bold text-slate-900">{DEMO.startLabel}</p>
                    <p className="text-[11px] text-slate-400">{DEMO.timezone}</p>
                  </div>
                </div>

                <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 md:text-[2.65rem] md:leading-[1.1]">
                  {DEMO.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-500">{DEMO.subtitle}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: Calendar, label: DEMO.startLabel },
                    { icon: Clock, label: DEMO.endLabel },
                    DEMO.format === "Virtual" ? { icon: Globe2, label: "Virtual broadcast" } : { icon: MapPin, label: `${DEMO.locationLine}` },
                  ].map(({ icon: Ico, label }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      <Ico size={18} className="mt-0.5 shrink-0 text-violet-600" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                {DEMO.format !== "Virtual" ? (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-sm text-slate-600">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-violet-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{DEMO.locationLine}</p>
                      <p className="text-slate-500">{DEMO.city}</p>
                      <button type="button" className="mt-3 text-xs font-bold text-violet-600 hover:underline">
                        Open maps
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-8">
                  <button
                    type="button"
                    onClick={() => setLiked(!liked)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                      liked ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Heart size={17} className={liked ? "fill-rose-500 text-rose-500" : ""} />{" "}
                    {liked ? "Saved" : "Save"}
                  </button>

                  <div className="flex -space-x-2 border-l border-slate-200 pl-6">
                    {[13, 16, 20].map((img) => (
                      <img
                        key={img}
                        src={`https://i.pravatar.cc/80?img=${img}`}
                        alt=""
                        className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
                      />
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500">
                      +420
                    </div>
                  </div>

                  <div className="relative ml-auto">
                    <button
                      type="button"
                      onClick={() => setShareOpen(!shareOpen)}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95"
                    >
                      <Share2 size={14} /> Share
                    </button>
                    {shareOpen ? (
                      <div className="absolute right-0 z-40 mt-4 w-48 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl">
                        {["X / Twitter", "LinkedIn", "Copy RSVP link"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            className="w-full rounded-xl px-3 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-4">
                <Ticket className="mt-1 h-5 w-5 text-violet-600" />
                <div className="space-y-2">
                  <h2 className="font-display text-xl font-bold text-slate-900">What ticket holders receive</h2>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600">
                    {DEMO.perks.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <div className="rounded-2xl bg-slate-50 px-5 py-4 text-[13px] leading-relaxed text-slate-500">
                    <p className="font-semibold text-slate-800">Refund & transfers</p>
                    <p className="mt-2">
                      Refunds processed up to seven days ahead; within seven days transfers are honoured but sales are final.
                      COVID-force-majeure cancellations receive credit toward the next AuraEvents summit.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="px-2 font-display text-xl font-bold text-slate-900">Attendee hub</h3>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200" />
                  <div className="flex-1 space-y-3">
                    <textarea
                      placeholder="Ask the organizer (public replies help everyone)."
                      rows={5}
                      className="input-field resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95"
                      >
                        Post question
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {comments.map((c) => (
                <div key={c.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <div className="flex gap-4">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user}`} alt="" className="h-10 w-10 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-900">@{c.user}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">{c.text}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Like • {c.likes}</p>
                      {c.replies.map((r) => (
                        <div key={r.id} className="ml-8 mt-5 flex gap-3 rounded-2xl border border-slate-50 bg-slate-50 px-5 py-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-[11px] font-black text-white">
                            H
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              @{r.user}{" "}
                              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-700">
                                {r.badge}
                              </span>
                            </p>
                            <p className="mt-1 text-xs text-slate-600">{r.text}</p>
                            <p className="mt-2 text-[10px] uppercase text-slate-400">{r.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </article>

          <aside className="space-y-5">
            <div className="sticky top-28 space-y-5">
              <div className="rounded-3xl border border-violet-100 bg-white p-7 shadow-xl shadow-violet-100 ring-1 ring-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">General admission</p>
                <p className="mt-4 font-display text-5xl font-black text-slate-900">{DEMO.priceLabel}</p>
                <p className="text-[11px] font-semibold text-slate-500">Pre-tax • includes fees where applicable</p>

                <div className="mt-6 flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Users size={22} className="text-violet-600" />
                    <div>
                      <p className="font-display text-2xl font-black text-violet-700">{pct}%</p>
                      <p className="text-xs font-semibold text-slate-500">sold</p>
                    </div>
                  </div>
                  <span className="text-right font-mono text-xs font-bold text-violet-800">
                    {DEMO.ticketsSold.toLocaleString()} / {DEMO.capacity.toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600`} style={{ width: `${pct}%` }} />
                </div>

                <button
                  type="button"
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-lg font-black text-white shadow-lg shadow-violet-200 transition hover:opacity-95 active:scale-[0.98]"
                >
                  Reserve seats
                </button>
                <button
                  type="button"
                  className="mt-3 w-full rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Add to calendar (.ics)
                </button>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <p className="mb-4 font-display text-[11px] font-bold uppercase tracking-widest text-slate-400">Organizer</p>
                <div className="flex gap-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=aurahost"
                    alt=""
                    className="h-14 w-14 rounded-3xl bg-slate-100 ring-4 ring-white"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{DEMO.organizer}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">Verified presenter</p>
                    <button type="button" className="mt-4 text-[11px] font-bold uppercase tracking-wide text-slate-500 hover:text-violet-700">
                      Message host desk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
