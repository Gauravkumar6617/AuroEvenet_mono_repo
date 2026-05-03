import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Star,
  Heart,
  Users,
  Clock,
  Globe,
} from "lucide-react";
import {
  GRADIENT,
  TAG_PILL,
  monthAbbr,
  dayNum,
  weekdayShort,
  fmtClock,
  normalizeCardEvent,
} from "./eventPresets";

const IconGlobe = ({ cls }) => (
  <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="10" cy="10" r="8" />
    <path d="M10 2a14 14 0 0 1 0 16M2 10h16" />
  </svg>
);
const IconPinSm = ({ cls }) => (
  <svg className={cls} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 2a6 6 0 0 1 6 6c0 4-6 11-6 11S4 12 4 8a6 6 0 0 1 6-6z" />
    <circle cx="10" cy="8" r="2" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * One listing treatment for Home + `/event` grids.
 * Pass raw event objects from either source; normalization handles field names.
 */
export default function UnifiedEventCard({
  raw,
  index = 0,
  /** When false, renders as div (e.g. inside another link context) — prefer true */
  linkable = true,
}) {
  const e = normalizeCardEvent(raw);
  const [hover, setHover] = useState(false);
  const [saved, setSaved] = useState(false);

  const g = GRADIENT[e.color] || GRADIENT.violet;
  const tp = TAG_PILL[e.color] || TAG_PILL.violet;

  const showDateBadge = Boolean(e.dateIso);
  const timeLine = fmtClock(e.time);

  const media = (
    <div className="relative h-48 overflow-hidden bg-slate-100 md:h-[196px]">
      {e.image ? (
        <motion.img
          src={e.image}
          alt=""
          className="h-full w-full object-cover"
          animate={{ scale: hover ? 1.06 : 1 }}
          transition={{ duration: 0.45 }}
        />
      ) : (
        <motion.div
          className={`h-full w-full bg-gradient-to-br ${g}`}
          animate={{ filter: hover ? "brightness(1.05)" : "brightness(1)" }}
        >
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
          <div className="absolute -bottom-6 -left-4 h-28 w-28 rounded-full bg-white/10" />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />

      {/* top row */}
      <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2 md:left-4 md:right-4 md:top-4">
        {showDateBadge ? (
          <div className="rounded-2xl bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
            <p className="text-center text-[9px] font-bold uppercase tracking-wider text-violet-600">
              {monthAbbr(e.dateIso)}
            </p>
            <p className="text-center font-display text-xl font-black leading-none text-slate-900">
              {dayNum(e.dateIso)}
            </p>
            <p className="text-center text-[9px] text-slate-500">{weekdayShort(e.dateIso)}</p>
          </div>
        ) : (
          <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {e.dateLabel}
          </span>
        )}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm ${e.mode === "Virtual" ? "bg-blue-100 text-blue-800" : e.mode === "Hybrid" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"} flex items-center gap-1`}
          >
            {e.mode === "Virtual" ? <Globe size={11} /> : <MapPin size={11} />}
            {e.mode}
          </span>
          {e.badge ? (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-700">
              {e.badge}
            </span>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {hover && e.excerpt ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-end bg-black/45 p-4"
          >
            <p className="line-clamp-3 text-sm leading-relaxed text-white/95">{e.excerpt}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setSaved((s) => !s);
        }}
        animate={{ opacity: hover || saved ? 1 : 0 }}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 shadow-md backdrop-blur-sm"
      >
        <Heart size={16} className={saved ? "fill-rose-500 text-rose-500" : "text-slate-500"} />
      </motion.button>
    </div>
  );

  const body = (
    <>
      {media}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${tp}`}>
            {e.tag}
          </span>
          {e.status === "past" ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              Past
            </span>
          ) : null}
        </div>

        <h3 className="font-display line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-slate-900">
          {e.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {showDateBadge && !timeLine ? (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="shrink-0" />
              {e.dateLabel}
            </span>
          ) : null}
          {timeLine ? (
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {timeLine}
            </span>
          ) : null}
          {!showDateBadge && !timeLine && e.dateLabel ? (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {e.dateLabel}
            </span>
          ) : null}
          <span className="flex min-w-0 items-center gap-1.5">
            {e.mode === "Virtual" ? (
              <IconGlobe cls="w-3.5 h-3.5 shrink-0 opacity-70" />
            ) : (
              <IconPinSm cls="w-3.5 h-3.5 shrink-0 opacity-70" />
            )}
            <span className="truncate">{e.location || "Venue TBA"}</span>
          </span>
        </div>

        {typeof e.attendees === "number" && e.attendees > 0 ? (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={14} />
            <span className="font-semibold text-slate-700">{e.attendees.toLocaleString()}</span>
            attending
            {e.capacity ? (
              <span className="text-slate-400">· {e.capacity.toLocaleString()} cap</span>
            ) : null}
          </p>
        ) : null}

        <AnimatePresence>
          {hover && e.speakers?.length ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100 pt-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Speakers</span>
                  <div className="flex -space-x-2">
                    {e.speakers.slice(0, 5).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-6 w-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                </div>
                {e.rating ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {e.rating}
                  </span>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span
              className={`font-display text-xl font-semibold tracking-tight ${
                String(e.priceLabel).toLowerCase() === "free" ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              {e.priceLabel}
            </span>
            {!["free", "—"].includes(String(e.priceLabel).toLowerCase()) ? (
              <span className="ml-1.5 text-[11px] font-medium text-slate-400">per ticket</span>
            ) : null}
          </div>
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-xl bg-gradient-to-r px-5 py-2 text-center text-xs font-bold text-white shadow-sm ${g}`}
          >
            Tickets
          </motion.span>
        </div>

        {/* saves teaser for listing pages that expose it */}
        {e.saves !== undefined ? (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            {saved ? e.saves + 1 : e.saves} saves
          </p>
        ) : null}
      </div>
    </>
  );

  const outer = (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 12) * 0.06, duration: 0.35 }}
      className={`group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-[box-shadow,transform] duration-300 ${
        hover ? "-translate-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.09)]" : ""
      }`}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      layout={false}
    >
      {body}
    </motion.article>
  );

  if (!linkable) return outer;

  return (
    <Link
      to={e.href}
      className="-m-px block h-full min-h-[420px] rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
    >
      {outer}
    </Link>
  );
}
