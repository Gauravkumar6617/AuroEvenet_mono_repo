import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Skeleton from "../components/ui/Skeleton";
import UnifiedEventCard from "../components/events/UnifiedEventCard";
import { GRADIENT } from "../components/events/eventPresets";
import { hasPersonalizationSignals, personalizationScore } from "../lib/personalizationScore";
import usePersonalizationStore from "../store/usePersonalizationStore";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const FALLBACK_EVENTS = [
  {
    id: 1,
    title: "AI Engineering Summit 2026",
    excerpt:
      "Hands-on workshops on deploying LLMs at production scale — RAG pipelines, fine-tuning, and evals.",
    tag: "AI / ML",
    color: "violet",
    date: "2026-06-14",
    time: "10:00",
    location: "Moscone West, San Francisco, CA",
    mode: "In-person",
    attendees: 320,
    saves: 87,
    status: "upcoming",
    price: 489,
    price_display: "$489",
    capacity: 900,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "React & State Management Deep Dive",
    excerpt:
      "Live walkthrough of Zustand + React Query patterns with Q&A from core contributors.",
    tag: "Frontend",
    color: "blue",
    date: "2026-05-22",
    time: "18:00",
    location: "Online (Zoom Events)",
    mode: "Virtual",
    attendees: 540,
    saves: 112,
    status: "upcoming",
    price_display: "$59",
    price: 59,
    capacity: 800,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "DevOps & Platform Engineering Meetup",
    excerpt:
      "Kubernetes cost optimisation, GitOps workflows, and IDPs.",
    tag: "DevOps",
    color: "teal",
    date: "2026-05-10",
    time: "19:30",
    location: "Capital Factory · Austin, TX",
    mode: "In-person",
    attendees: 180,
    saves: 44,
    status: "past",
    price_display: "Free",
    price: "Free",
    capacity: 220,
    image: "https://images.unsplash.com/photo-1504384764586-bb4fc1706091?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Open Source Contributor Day",
    excerpt:
      "Sprint on popular OSS projects, meet maintainers, and ship PRs.",
    tag: "Open Source",
    color: "green",
    date: "2026-07-05",
    time: "09:00",
    location: "GitHub HQ · San Francisco",
    mode: "Hybrid",
    attendees: 210,
    saves: 61,
    status: "upcoming",
    price_display: "$25",
    price: 25,
    capacity: 400,
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Python Performance & Observability",
    excerpt:
      "Profiling Python services, tracing, and SLO-driven dashboards.",
    tag: "Python",
    color: "amber",
    date: "2026-08-02",
    time: "11:00",
    location: "Javits Center · New York, NY",
    mode: "In-person",
    attendees: 145,
    saves: 39,
    status: "upcoming",
    price_display: "$120",
    price: 120,
    capacity: 350,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Security Engineering Workshop",
    excerpt:
      "Threat modelling, SAST pipelines, and zero-trust fundamentals.",
    tag: "Security",
    color: "coral",
    date: "2026-07-18",
    time: "14:00",
    location: "Livestream + Warsaw hub",
    mode: "Hybrid",
    attendees: 290,
    saves: 73,
    status: "upcoming",
    price_display: "$199",
    price: 199,
    capacity: 500,
    image: "https://images.unsplash.com/photo-1563986768494-de4a4436df25?auto=format&fit=crop&w=900&q=80",
  },
];

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  tag: "",
  color: "violet",
  date: "",
  time: "",
  location: "",
  mode: "Virtual",
  ticket_price: "",
  currency: "USD",
  is_free: false,
  capacity: "",
  cover_file: null,
};

const IconPlus = ({ cls }) => (
  <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 4v12M4 10h12" />
  </svg>
);
const IconSearch = ({ cls }) => (
  <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="9" r="6" />
    <path d="M15 15l3 3" />
  </svg>
);
const IconCal = ({ cls }) => (
  <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="4" width="16" height="14" rx="3" />
    <path d="M2 8h16M7 2v3M13 2v3" />
  </svg>
);

function CreateModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  function set(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  useEffect(() => {
    if (!form.cover_file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.cover_file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.cover_file]);

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      setError("Title, date, and location are required.");
      return;
    }
    const capNum = Number(form.capacity);
    if (!form.is_free && form.ticket_price && Number.isNaN(Number(form.ticket_price))) {
      setError("Enter a valid ticket price.");
      return;
    }
    if (!form.capacity || capNum <= 0) {
      setError("Venue capacity is required (guest / seat limit).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let newEvent;
      if (API_BASE) {
        const res = await fetch(`${API_BASE}/api/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            capacity: capNum,
            ticket_price_minor: form.is_free ? 0 : Math.round(Number(form.ticket_price) * 100),
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        newEvent = await res.json();
      } else {
        let priceDisp = "Free";
        if (!form.is_free && form.ticket_price) {
          priceDisp =
            form.currency === "USD"
              ? `$${Number(form.ticket_price).toFixed(0)}`
              : `${form.currency} ${form.ticket_price}`;
        }
        newEvent = {
          title: form.title,
          excerpt: form.excerpt,
          tag: form.tag || "Community",
          color: form.color,
          date: form.date,
          time: form.time,
          location: form.location,
          mode: form.mode,
          capacity: capNum,
          currency: form.currency,
          id: Date.now(),
          attendees: 0,
          saves: 0,
          status: "upcoming",
          image: previewUrl,
          price_display: priceDisp,
          price: form.is_free ? "Free" : Number(form.ticket_price),
        };
      }
      onCreate(newEvent);
      setForm(EMPTY_FORM);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const inp =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition";
  const lbl = "block text-xs font-semibold text-slate-500 mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,15,30,0.55)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.22 }}
        className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className={`bg-gradient-to-r ${GRADIENT[form.color] || GRADIENT.violet} p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/75">Quick listing</p>
              <h2 className="text-xl font-bold text-white">{form.title || "New event"}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-white/80">
            Tip:{" "}
            <Link className="font-bold underline" to="/create-event">
              Host desk
            </Link>{" "}
            adds refund policy &amp; richer agenda.
          </p>
          {previewUrl ? (
            <div className="mt-4 h-24 w-full overflow-hidden rounded-xl ring-2 ring-white/30">
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>

        <form onSubmit={submit} className="max-h-[calc(90vh-8rem)] space-y-3 overflow-y-auto p-6">
          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">{error}</p>
          )}

          <div>
            <label className={lbl}>Cover banner *</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={!API_BASE}
              className={inp}
              onChange={(e) =>
                set(
                  "cover_file",
                  e.target.files?.length ? e.target.files[0] : null,
                )
              }
            />
            <p className="mt-1 text-[11px] text-slate-400">Landscape 16:9 — used on listing &amp; social preview.</p>
          </div>

          <div>
            <label className={lbl}>Event title *</label>
            <input
              className={inp}
              placeholder="Annual Product Summit"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div>
            <label className={lbl}>Short description</label>
            <textarea
              className={`${inp} resize-none`}
              rows={2}
              placeholder="What attendees will learn or experience"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>Track / tag</label>
              <input className={inp} placeholder="e.g. Product" value={form.tag} onChange={(e) => set("tag", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Accent colour</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.keys(GRADIENT).map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => set("color", c)}
                    className={`h-7 w-7 rounded-full bg-gradient-to-br ring-2 ring-offset-1 transition ${GRADIENT[c]} ${form.color === c ? "ring-slate-500" : "ring-transparent"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>Starts (date) *</label>
              <input type="date" className={inp} value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Doors open *</label>
              <input type="time" className={inp} value={form.time} onChange={(e) => set("time", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={lbl}>Venue &amp; address *</label>
            <input
              className={inp}
              placeholder="Building, street, city (or Zoom link)"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>

          <div>
            <label className={lbl}>Format</label>
            <div className="flex flex-wrap gap-2">
              {["Virtual", "In-person", "Hybrid"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set("mode", m)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    form.mode === m
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={lbl}>Total capacity / tickets *</label>
              <input
                type="number"
                min={1}
                className={inp}
                placeholder="500"
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
              />
            </div>
            <div>
              <label className={lbl}>Free event</label>
              <button
                type="button"
                onClick={() => set("is_free", !form.is_free)}
                className={`flex w-full items-center justify-center rounded-xl border py-2.5 text-sm font-semibold transition ${
                  form.is_free
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {form.is_free ? "Free — RSVP only" : "Paid tickets"}
              </button>
            </div>
          </div>

          {!form.is_free && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>Currency</label>
                <select className={inp} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className={lbl}>General admission price</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className={inp}
                  placeholder="49.00"
                  value={form.ticket_price}
                  onChange={(e) => set("ticket_price", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 rounded-xl bg-gradient-to-r ${GRADIENT[form.color] || GRADIENT.violet} py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50`}
            >
              {loading ? "Saving…" : "Publish"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Event() {
  const prefs = usePersonalizationStore((s) => s.prefs);
  const tasteDisabled = usePersonalizationStore((s) => s.tasteDisabled);
  const hasSignals =
    !tasteDisabled && hasPersonalizationSignals(prefs);

  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("upcoming");
  const [modeFilter, setModeFilter] = useState("all");
  const [modalOpen, setModal] = useState(false);

  useEffect(() => {
    if (sort === "foryou" && !hasSignals) setSort("upcoming");
  }, [sort, hasSignals]);

  useEffect(() => {
    if (!API_BASE) return;
    setLoading(true);
    fetch(`${API_BASE}/api/events`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data);
        setApiError(false);
      })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let base = events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
    if (modeFilter !== "all") {
      base = base.filter((e) => {
        const m = (e.mode || "").toLowerCase().replace(/\s+/g, "");
        if (modeFilter === "virtual") return m === "virtual";
        if (modeFilter === "hybrid") return m === "hybrid";
        if (modeFilter === "in-person") return m === "in-person" || m === "inperson";
        return true;
      });
    }
    if (sort === "foryou") {
      base = [...base].sort(
        (a, b) => personalizationScore(b, prefs) - personalizationScore(a, prefs),
      );
    } else if (sort === "upcoming") base = base.filter((e) => e.status === "upcoming");
    else if (sort === "popular") base = [...base].sort((a, b) => (b.attendees || 0) - (a.attendees || 0));
    else if (sort === "saved") base = [...base].sort((a, b) => (b.saves || 0) - (a.saves || 0));
    return base;
  }, [events, query, sort, modeFilter, prefs]);

  const stats = useMemo(
    () => ({
      total: events.length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      attendees: events.reduce((s, e) => s + (e.attendees || 0), 0),
    }),
    [events],
  );

  function handleCreate(ev) {
    setEvents((prev) => [{ ...ev, color: ev.color || "violet" }, ...prev]);
  }

  const SORTS = useMemo(() => {
    const base = [
      { key: "upcoming", label: "Upcoming" },
      { key: "popular", label: "Popular" },
      { key: "saved", label: "Most saved" },
      { key: "all", label: "All" },
    ];
    if (!hasSignals) return base;
    return [{ key: "foryou", label: "For you" }, ...base];
  }, [hasSignals]);
  const MODES = [
    { key: "all", label: "All" },
    { key: "virtual", label: "Virtual" },
    { key: "in-person", label: "In-person" },
    { key: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AnimatePresence>
        {modalOpen && (
          <CreateModal open={modalOpen} onClose={() => setModal(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden border-b border-slate-100 bg-white pb-14 pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_-10%,#ede9fe_0%,transparent_70%)]"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_-5%_60%,#e0f2fe_0%,transparent_65%)]"
          />
        </div>

        <PageContainer>
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl flex-1">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                  Community Events
                </span>
                <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl md:leading-[1.1]">
                  Where builders <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      connect &amp; grow
                    </span>
                    <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-sm bg-violet-100" />
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
                  Discover trainings, conferences, meetups — with clear ticketing, venues, and capacity.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {[
                    { label: "upcoming events", value: stats.upcoming, c: "text-violet-700" },
                    { label: "total attendees", value: stats.attendees.toLocaleString(), c: "text-blue-700" },
                    { label: "events listed", value: stats.total, c: "text-teal-700" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-baseline gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm"
                    >
                      <span className={`text-2xl font-black ${s.c}`}>{s.value}</span>
                      <span className="text-xs font-medium text-slate-500">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="shrink-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl lg:w-72"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
                <IconPlus cls="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Host an event</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Full host flow: banner, GA price, refunds, agenda.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setModal(true)}
                  className="w-full rounded-xl border border-violet-200 bg-violet-50 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-100"
                >
                  Quick listing
                </button>
                <Link
                  to="/create-event"
                  className="block w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-center text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
                >
                  Host desk
                </Link>
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">Publishing subject to moderation</p>
            </motion.div>
          </div>
        </PageContainer>
      </div>

      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md">
        <PageContainer>
          <div className="flex flex-wrap items-center gap-3 py-3">
            <div className="relative min-w-[180px] flex-1">
              <IconSearch cls="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="Search events…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center rounded-xl bg-slate-100 p-1">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setModeFilter(m.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      modeFilter === m.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center rounded-xl bg-slate-100 p-1">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSort(s.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      sort === s.key ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="py-10">
          {!loading && sort === "foryou" && hasSignals ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-sm text-violet-900"
            >
              <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Taste engine
              </span>
              <span className="text-violet-800/95">
                Order uses your saved city, formats, and interest chips — deterministic for now; ready for embeddings later.
              </span>
            </motion.div>
          ) : null}

          {apiError && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <span className="shrink-0">⚠</span>
              <span>
                Could not reach the API — showing sample data. Set{" "}
                <code className="rounded bg-amber-100 px-1">VITE_API_BASE</code> to connect.
              </span>
            </div>
          )}

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <IconCal cls="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No events found</h3>
              <p className="mb-6 text-sm text-slate-400">Try adjusting filters or search.</p>
              <button
                type="button"
                onClick={() => setModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                <IconPlus cls="h-4 w-4" /> Create the first one
              </button>
            </motion.div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((ev, idx) => (
                <UnifiedEventCard key={ev.id} raw={ev} index={idx} />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
