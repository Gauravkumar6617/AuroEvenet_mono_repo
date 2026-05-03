/**
 * Lightweight “signals” scorer — deterministic & cheap; swap embeddings later for real AI ranks.
 */

function norm(v) {
  return String(v || "").toLowerCase();
}

/** @typedef {{ city?: string; interests?: string[]; modes?: string[] }} TastePrefs */

/**
 * Higher = better personalised fit for the catalogue row.
 */
export function personalizationScore(event, prefs) {
  const p = prefs || {};
  let score =
    Math.log10(((event.attendees ?? 100) || 50) / 40 + 1) * 18 +
    (event.status === "upcoming" ? 8 : -4);

  const hay = `${event.tag || ""} ${event.cat || ""} ${event.title || ""} ${event.excerpt || ""} ${event.location || ""} ${event.mode || ""}`;

  const city = norm(p.city).trim();
  if (city.length > 2) {
    if (hay.includes(city)) score += 70;
    const parts = city.split(/[\s,/]+/).filter(Boolean);
    for (const part of parts) {
      if (part.length >= 4 && hay.includes(part)) score += 32;
    }
  }

  const interests = Array.isArray(p.interests) ? p.interests : [];
  for (const t of interests) {
    const n = norm(t);
    if (n.length <= 2) continue;
    if (hay.includes(n)) score += 48;
    for (const bit of n.split(/[\s&/]+/).filter((x) => x.length >= 3)) {
      if (hay.includes(bit)) score += 20;
    }
  }

  const modes = Array.isArray(p.modes) ? p.modes.filter(Boolean) : [];
  const em = norm(event.mode);
  if (modes.length) {
    let hit = modes.some((m) => norm(m) === em || norm(m).replace("-", "").includes(em.replace("-", "")));
    if (!hit)
      modes.forEach((m) => {
        if (em.includes(norm(m))) hit = true;
      });
    if (hit) score += 40;
    else score *= 0.45;
  }

  return Number.isFinite(score) ? score : 0;
}

export function hasPersonalizationSignals(prefs) {
  const p = prefs || {};
  const city = String(p.city || "").trim();
  const ints = Array.isArray(p.interests) ? p.interests : [];
  const modes = Array.isArray(p.modes) ? p.modes : [];
  return city.length > 2 || ints.length > 0 || modes.length > 0;
}
