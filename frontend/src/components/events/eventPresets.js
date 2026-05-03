/** Shared gradient / pill palette for listings (aligned with Events page). */

export const GRADIENT = {
  violet: "from-violet-500 to-purple-600",
  blue: "from-blue-500 to-indigo-600",
  teal: "from-teal-500 to-emerald-600",
  green: "from-green-500 to-teal-600",
  amber: "from-amber-500 to-orange-500",
  coral: "from-rose-500 to-pink-600",
};

export const TAG_PILL = {
  violet: "bg-violet-100 text-violet-800",
  blue: "bg-blue-100 text-blue-800",
  teal: "bg-teal-100 text-teal-800",
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  coral: "bg-rose-100 text-rose-800",
};

export const CATEGORY_TO_COLOR = {
  "AI / ML": "violet",
  Technology: "violet",
  Music: "coral",
  Sustainability: "teal",
  "Art & Design": "amber",
  Wellness: "green",
  Photography: "teal",
  "Food & Drink": "amber",
  Networking: "violet",
  Education: "amber",
  Frontend: "blue",
  DevOps: "teal",
  Python: "amber",
  Security: "coral",
  "Open Source": "green",
};

export function colorKeyFromCategory(cat) {
  return CATEGORY_TO_COLOR[cat] || "violet";
}

export function monthAbbr(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}

export function dayNum(iso) {
  return iso ? String(new Date(iso).getDate()).padStart(2, "0") : "";
}

export function weekdayShort(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function formatMoney(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(amount));
  } catch {
    return `${currency} ${amount}`;
  }
}

export function fmtClock(t) {
  if (!t) return "";
  const [h, m] = String(t).split(":").map(Number);
  if (Number.isNaN(h)) return "";
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

/** Merge home list shape + `/event` API shape into one card model */
export function normalizeCardEvent(raw) {
  const loc = raw.location ?? raw.loc ?? "";
  const tag = raw.tag ?? raw.cat ?? "Event";
  const image =
    raw.image ??
    raw.img ??
    raw.banner_url ??
    raw.cover_url ??
    null;
  let color =
    raw.color ?? colorKeyFromCategory(typeof tag === "string" ? tag : String(tag));
  if (!GRADIENT[color]) color = "violet";

  const currencyCode = raw.currency || "USD";
  let priceLabel = raw.price_display;
  if (!priceLabel) {
    const free = raw.is_free || raw.price === "Free" || String(raw.price || "").toLowerCase() === "free";
    if (free) priceLabel = "Free";
    else if (typeof raw.price === "number") priceLabel = formatMoney(raw.price, currencyCode);
    else if (raw.price != null && raw.price !== "") priceLabel = String(raw.price);
    else priceLabel = "—";
  }

  const dateIso =
    raw.date ??
    raw.starts_at ??
    raw.start_date ??
    raw.date_iso ??
    null;

  const dateLabel =
    raw.dateLabel ??
    (dateIso ? new Date(dateIso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : raw.date_compact ?? "");

  const mode = raw.mode ?? raw.format ?? "In-person";

  return {
    id: raw.id,
    title: raw.title ?? "Untitled",
    excerpt: raw.excerpt ?? raw.subtitle ?? "",
    tag,
    color,
    image,
    dateIso: typeof dateIso === "string" && dateIso.includes("T") ? dateIso.split("T")[0] : dateIso,
    dateLabel:
      dateLabel ||
      (typeof dateIso === "string" && dateIso.length >= 10
        ? fmtShortDate(dateIso.slice(0, 10))
        : ""),
    time: raw.time ?? raw.start_time ?? "",
    location: loc,
    mode,
    attendees: typeof raw.attendees === "number" ? raw.attendees : raw.registrations ?? 0,
    saves: typeof raw.saves === "number" ? raw.saves : undefined,
    status: raw.status ?? "upcoming",
    priceLabel,
    currency: currencyCode,
    capacity: raw.capacity ?? raw.totalCapacity ?? null,
    badge: raw.badge ?? null,
    speakers: Array.isArray(raw.speakers) ? raw.speakers : [],
    rating: raw.rating ?? null,
    href: raw.href ?? `/events/${raw.id}`,
  };
}

function fmtShortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Embedded JSON in publisher `content` so host metadata survives today's posts API shape. */
export const EVENT_META_START = "[[aura:event-meta]]";
export const EVENT_META_END = "[[/aura:event-meta]]";

export function stripEventMetaFromBody(text) {
  const s = String(text ?? "");
  const i0 = s.indexOf(EVENT_META_START);
  if (i0 === -1) return s.trim();
  const i1 = s.indexOf(EVENT_META_END, i0);
  if (i1 === -1) return s.trim();
  return (s.slice(0, i0) + s.slice(i1 + EVENT_META_END.length)).trim();
}

export function extractEventMetaFromContent(text) {
  const s = String(text ?? "");
  const i0 = s.indexOf(EVENT_META_START);
  if (i0 === -1) return null;
  const i1 = s.indexOf(EVENT_META_END, i0);
  if (i1 === -1) return null;
  try {
    return JSON.parse(s.slice(i0 + EVENT_META_START.length, i1).trim());
  } catch {
    return null;
  }
}

export function buildEventContent(meta, publicDescriptionMarkdown) {
  return `${EVENT_META_START}\n${JSON.stringify(meta)}\n${EVENT_META_END}\n\n${publicDescriptionMarkdown.trim()}`;
}
