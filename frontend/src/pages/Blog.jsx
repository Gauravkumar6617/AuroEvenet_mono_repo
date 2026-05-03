import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";

// ─── API CONFIG ──────────────────────────────────────────────
// Replace with your real API endpoint. The page will call:
//   GET  /api/events?sort=upcoming&mode=all&q=searchTerm
//   POST /api/events  (body: EventForm fields)
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

// ─── FALLBACK DATA (used when API_BASE is empty) ─────────────
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
    location: "San Francisco, CA",
    mode: "In-person",
    attendees: 320,
    saves: 87,
    status: "upcoming",
    image: null,
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
    location: "Online",
    mode: "Virtual",
    attendees: 540,
    saves: 112,
    status: "upcoming",
    image: null,
  },
  {
    id: 3,
    title: "DevOps & Platform Engineering Meetup",
    excerpt:
      "Kubernetes cost optimisation, GitOps workflows, and building great internal developer platforms.",
    tag: "DevOps",
    color: "teal",
    date: "2026-05-10",
    time: "19:30",
    location: "Austin, TX",
    mode: "In-person",
    attendees: 180,
    saves: 44,
    status: "past",
    image: null,
  },
  {
    id: 4,
    title: "Open Source Contributor Day",
    excerpt:
      "Sprint on popular OSS projects, meet maintainers, and ship your first PR of the year.",
    tag: "Open Source",
    color: "green",
    date: "2026-07-05",
    time: "09:00",
    location: "Remote",
    mode: "Virtual",
    attendees: 210,
    saves: 61,
    status: "upcoming",
    image: null,
  },
  {
    id: 5,
    title: "Python Performance & Observability",
    excerpt:
      "Deep dive into profiling Python services, distributed tracing, and building dashboards that matter.",
    tag: "Python",
    color: "amber",
    date: "2026-08-02",
    time: "11:00",
    location: "New York, NY",
    mode: "In-person",
    attendees: 145,
    saves: 39,
    status: "upcoming",
    image: null,
  },
  {
    id: 6,
    title: "Security Engineering Workshop",
    excerpt:
      "Threat modelling, SAST pipelines, and zero-trust architecture — practical skills for modern teams.",
    tag: "Security",
    color: "coral",
    date: "2026-07-18",
    time: "14:00",
    location: "Online",
    mode: "Virtual",
    attendees: 290,
    saves: 73,
    status: "upcoming",
    image: null,
  },
];

// ─── COLOR MAPS ───────────────────────────────────────────────
const GRADIENT = {
  violet: "from-violet-500 to-purple-600",
  blue:   "from-blue-500 to-indigo-600",
  teal:   "from-teal-500 to-emerald-600",
  green:  "from-green-500 to-teal-600",
  amber:  "from-amber-500 to-orange-500",
  coral:  "from-rose-500 to-pink-600",
};
const TAG_PILL = {
  violet: "bg-violet-100 text-violet-800",
  blue:   "bg-blue-100 text-blue-800",
  teal:   "bg-teal-100 text-teal-800",
  green:  "bg-green-100 text-green-800",
  amber:  "bg-amber-100 text-amber-800",
  coral:  "bg-rose-100 text-rose-800",
};
const ICON_BG = {
  violet: "bg-violet-100 text-violet-600",
  blue:   "bg-blue-100 text-blue-600",
  teal:   "bg-teal-100 text-teal-600",
  green:  "bg-green-100 text-green-600",
  amber:  "bg-amber-100 text-amber-600",
  coral:  "bg-rose-100 text-rose-600",
};

// ─── HELPERS ──────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtDay(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}
function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}
function dayNum(iso) {
  return iso ? String(new Date(iso).getDate()).padStart(2, "0") : "";
}
function monthAbbr(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}

// ─── SVG ICONS ────────────────────────────────────────────────
const IconCal     = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="16" height="14" rx="3"/><path d="M2 8h16M7 2v3M13 2v3"/></svg>;
const IconClock   = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/></svg>;
const IconPin     = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 2a6 6 0 0 1 6 6c0 4-6 11-6 11S4 12 4 8a6 6 0 0 1 6-6z"/><circle cx="10" cy="8" r="2" fill="currentColor" stroke="none"/></svg>;
const IconPeople  = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7" cy="7" r="3"/><path d="M1 18c0-3.314 2.686-6 6-6s6 2.686 6 6"/><path d="M13 5a3 3 0 0 1 0 6M19 18c0-3-2-5-4-5"/></svg>;
const IconPlus    = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4v12M4 10h12"/></svg>;
const IconSearch  = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="9" r="6"/><path d="M15 15l3 3"/></svg>;
const IconSave    = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 2h10l3 3v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M7 2v6h6V2M6 14h8"/></svg>;
const IconArrow   = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 10h12M11 5l5 5-5 5"/></svg>;
const IconGlobe   = ({ cls }) => <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 2a14 14 0 0 1 0 16M2 10h16"/></svg>;

// ─── CREATE-EVENT MODAL ───────────────────────────────────────
const EMPTY_FORM = { title: "", excerpt: "", tag: "", color: "violet", date: "", time: "", location: "", mode: "Virtual" };

function CreateModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      setError("Title, date, and location are required.");
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
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(await res.text());
        newEvent = await res.json();
      } else {
        // local fallback
        newEvent = { ...form, id: Date.now(), attendees: 0, saves: 0, status: "upcoming", image: null };
      }
      onCreate(newEvent);
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const inp  = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition";
  const lbl  = "block text-xs font-semibold text-slate-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,15,30,0.55)", backdropFilter: "blur(6px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* modal header */}
        <div className={`bg-gradient-to-r ${GRADIENT[form.color] || GRADIENT.violet} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">New Event</p>
              <h2 className="text-white text-xl font-bold">{form.title || "Untitled Event"}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l10 10M13 3L3 13"/></svg>
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2.5">{error}</p>
          )}

          <div>
            <label className={lbl}>Event title *</label>
            <input className={inp} placeholder="Give your event a name" value={form.title} onChange={e => set("title", e.target.value)} />
          </div>

          <div>
            <label className={lbl}>Short description</label>
            <textarea className={inp + " resize-none"} rows={2} placeholder="What's this event about?" value={form.excerpt} onChange={e => set("excerpt", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Tag / track</label>
              <input className={inp} placeholder="e.g. Frontend" value={form.tag} onChange={e => set("tag", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Accent colour</label>
              <div className="flex gap-2 pt-1">
                {Object.keys(GRADIENT).map(c => (
                  <button type="button" key={c} onClick={() => set("color", c)}
                    className={`w-6 h-6 rounded-full transition ring-2 ring-offset-1 ${form.color === c ? "ring-slate-500" : "ring-transparent"} bg-gradient-to-br ${GRADIENT[c]}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Date *</label>
              <input type="date" className={inp} value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Time</label>
              <input type="time" className={inp} value={form.time} onChange={e => set("time", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={lbl}>Location *</label>
            <input className={inp} placeholder="City, venue, or 'Online'" value={form.location} onChange={e => set("location", e.target.value)} />
          </div>

          <div>
            <label className={lbl}>Mode</label>
            <div className="flex gap-2">
              {["Virtual", "In-person", "Hybrid"].map(m => (
                <button type="button" key={m} onClick={() => set("mode", m)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${form.mode === m ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className={`flex-1 rounded-xl bg-gradient-to-r ${GRADIENT[form.color]} text-white py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 active:scale-95 transition disabled:opacity-50`}
            >
              {loading ? "Creating…" : "Create Event"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── EVENT CARD ───────────────────────────────────────────────
function EventCard({ event, idx }) {
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);
  const color = event.color || "violet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden cursor-pointer"
      style={{ boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.10)" : "0 2px 12px rgba(0,0,0,0.04)", transition: "box-shadow 0.3s ease, transform 0.3s ease", transform: hovered ? "translateY(-4px)" : "translateY(0)" }}
    >
      {/* ── coloured top strip / image area ── */}
      <div className={`relative h-40 bg-gradient-to-br ${GRADIENT[color]} overflow-hidden`}>
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {/* date badge */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-2 flex items-center gap-2">
            <div className="text-center">
              <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest leading-none">{monthAbbr(event.date)}</p>
              <p className="text-white text-xl font-black leading-none mt-0.5">{dayNum(event.date)}</p>
              <p className="text-white/70 text-[9px] leading-none mt-0.5">{fmtDay(event.date)}</p>
            </div>
          </div>
          {/* mode badge */}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${event.mode === "Virtual" ? "bg-blue-100/90 text-blue-800" : event.mode === "Hybrid" ? "bg-amber-100/90 text-amber-800" : "bg-emerald-100/90 text-emerald-800"}`}>
            {event.mode === "Virtual" ? <IconGlobe cls="w-3 h-3" /> : <IconPin cls="w-3 h-3" />}
            {event.mode}
          </div>
        </div>
        {/* hover overlay with excerpt */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-4"
            >
              <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{event.excerpt}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── card body ── */}
      <div className="p-5">
        {/* tag + status */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${TAG_PILL[color]}`}>{event.tag}</span>
          {event.status === "past" && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">Past</span>
          )}
        </div>

        {/* title */}
        <Link to={`/events/${event.id}`}>
          <h3 className="font-display text-[16px] font-bold text-slate-900 leading-snug hover:text-violet-700 transition-colors line-clamp-2 mb-3">
            {event.title}
          </h3>
        </Link>

        {/* meta grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${ICON_BG[color]}`}><IconClock cls="w-3.5 h-3.5" /></span>
            {fmtTime(event.time)}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${ICON_BG[color]}`}><IconPin cls="w-3.5 h-3.5" /></span>
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs col-span-2">
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${ICON_BG[color]}`}><IconPeople cls="w-3.5 h-3.5" /></span>
            <span className="font-semibold text-slate-700">{event.attendees.toLocaleString()}</span>&nbsp;attending
          </div>
        </div>

        {/* divider */}
        <div className="border-t border-slate-100 mb-4" />

        {/* actions */}
        <div className="flex items-center gap-2">
          <Link to={`/events/${event.id}`}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white bg-gradient-to-r ${GRADIENT[color]} hover:opacity-90 active:scale-95 transition-all shadow-sm`}
          >
            RSVP <IconArrow cls="w-4 h-4" />
          </Link>
          <button
            onClick={() => setSaved(s => !s)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${saved ? "bg-violet-600 border-violet-600 text-white" : "border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-600"}`}
            title={saved ? "Saved" : "Save event"}
          >
            <IconSave cls="w-4 h-4" />
          </button>
        </div>

        {/* saves count */}
        <p className="text-center text-[11px] text-slate-400 mt-2">
          {saved ? event.saves + 1 : event.saves} saves
        </p>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function Blog() {
  const [events, setEvents]     = useState(FALLBACK_EVENTS);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState(false);
  const [query, setQuery]       = useState("");
  const [sort, setSort]         = useState("upcoming");
  const [mode, setMode]         = useState("all");
  const [modalOpen, setModal]   = useState(false);

  // ── fetch from API if configured ──
  useEffect(() => {
    if (!API_BASE) return;
    setLoading(true);
    fetch(`${API_BASE}/api/events`)
      .then(r => r.json())
      .then(data => { setEvents(data); setApiError(false); })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── filter + sort ──
  const filtered = useMemo(() => {
    let base = events.filter(e =>
      e.title.toLowerCase().includes(query.toLowerCase()) &&
      (mode === "all" || e.mode.toLowerCase() === mode)
    );
    if (sort === "upcoming") base = base.filter(e => e.status === "upcoming");
    else if (sort === "popular") base = [...base].sort((a, b) => b.attendees - a.attendees);
    else if (sort === "saved")   base = [...base].sort((a, b) => b.saves - a.saves);
    return base;
  }, [events, query, sort, mode]);

  const stats = useMemo(() => ({
    total:     events.length,
    upcoming:  events.filter(e => e.status === "upcoming").length,
    attendees: events.reduce((s, e) => s + (e.attendees || 0), 0),
  }), [events]);

  function handleCreate(event) {
    setEvents(prev => [{ ...event, color: event.color || "violet" }, ...prev]);
  }

  // ── SORT / MODE TABS ──
  const SORTS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "popular",  label: "Popular" },
    { key: "saved",    label: "Most saved" },
    { key: "all",      label: "All" },
  ];
  const MODES = [
    { key: "all",       label: "All" },
    { key: "virtual",   label: "Virtual" },
    { key: "in-person", label: "In-person" },
    { key: "hybrid",    label: "Hybrid" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AnimatePresence>
        {modalOpen && <CreateModal open={modalOpen} onClose={() => setModal(false)} onCreate={handleCreate} />}
      </AnimatePresence>

      {/* ════ HERO ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-white border-b border-slate-100/80 pt-24 pb-14">
        {/* subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{ background: "radial-gradient(ellipse 70% 60% at 60% -10%, #ede9fe 0%, transparent 70%)" }} className="absolute inset-0" />
          <div style={{ background: "radial-gradient(ellipse 50% 50% at -5% 60%, #e0f2fe 0%, transparent 65%)" }} className="absolute inset-0" />
        </div>

        <PageContainer>
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-10">
            {/* left copy */}
            <div className="flex-1 max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 border border-violet-200 px-4 py-1.5 text-xs font-bold text-violet-700 uppercase tracking-widest mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  Community Events
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  Where builders <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">connect & grow</span>
                    <span className="absolute inset-x-0 bottom-1 h-3 bg-violet-100 rounded-sm -z-0" />
                  </span>
                </h1>
                <p className="mt-5 text-slate-500 text-lg leading-relaxed max-w-xl">
                  Discover live sessions, hands-on workshops, and meetups — virtual and in-person — curated for developers like you.
                </p>

                {/* stat chips */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {[
                    { label: "upcoming events", value: stats.upcoming, color: "violet" },
                    { label: "total attendees",  value: stats.attendees.toLocaleString(), color: "blue" },
                    { label: "events listed",    value: stats.total, color: "teal" },
                  ].map(s => (
                    <div key={s.label} className="flex items-baseline gap-2 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                      <span className={`text-2xl font-black ${s.color === "violet" ? "text-violet-700" : s.color === "blue" ? "text-blue-700" : "text-teal-700"}`}>{s.value}</span>
                      <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* right CTA card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:w-72 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 shrink-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-md">
                <IconPlus cls="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1.5">Host an event</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Share your knowledge. Reach thousands of developers in the Nexos community.
              </p>
              <button
                onClick={() => setModal(true)}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                Create Event
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-400">Free to list · No account needed</p>
            </motion.div>
          </div>
        </PageContainer>
      </div>

      {/* ════ STICKY FILTER BAR ══════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <PageContainer>
          <div className="py-3 flex flex-wrap items-center gap-3">
            {/* search */}
            <div className="relative flex-1 min-w-[180px]">
              <IconSearch cls="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                placeholder="Search events…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            {/* mode pills */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
              {MODES.map(m => (
                <button key={m.key} onClick={() => setMode(m.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === m.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* sort */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
              {SORTS.map(s => (
                <button key={s.key} onClick={() => setSort(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sort === s.key ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>

      {/* ════ GRID ══════════════════════════════════════════════ */}
      <PageContainer>
        <div className="py-10">
          {/* api error banner */}
          {apiError && (
            <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800 flex items-center gap-3">
              <span className="shrink-0">⚠</span>
              <span>Could not reach the API — showing sample data. Set <code className="bg-amber-100 px-1 rounded">VITE_API_BASE</code> in your <code className="bg-amber-100 px-1 rounded">.env</code> to connect.</span>
            </div>
          )}

          {/* loading shimmer */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* empty state */}
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
                <IconCal cls="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-bold text-lg mb-2">No events found</h3>
              <p className="text-slate-400 text-sm mb-6">Try adjusting your filters or search term.</p>
              <button onClick={() => setModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-6 py-3 text-sm font-semibold hover:bg-violet-700 transition"
              >
                <IconPlus cls="w-4 h-4" /> Create the first one
              </button>
            </motion.div>
          )}

          {/* event grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, idx) => (
                <EventCard key={event.id} event={event} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}