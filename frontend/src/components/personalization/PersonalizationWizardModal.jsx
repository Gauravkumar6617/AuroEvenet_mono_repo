import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Radar, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ATTENDANCE_PREF_OPTIONS, INTEREST_TAGS } from "../../config/tasteConfig";
import usePersonalizationStore from "../../store/usePersonalizationStore";

async function reverseLookupCity(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return "";
    const data = await res.json();
    const a = data.address || {};
    return (
      a.city ||
      a.town ||
      a.village ||
      a.state ||
      a.country ||
      ""
    );
  } catch {
    return "";
  }
}

export default function PersonalizationWizardModal({ open, onClose }) {
  const { user } = useAuth();
  const finalizeTaste = usePersonalizationStore((s) => s.finalizeTaste);
  const skipTastePermanent = usePersonalizationStore((s) => s.skipTastePermanent);

  const [step, setStep] = useState(0);
  const [cityInput, setCityInput] = useState("");
  const [geoStatus, setGeoStatus] = useState("");
  const [latLng, setLatLng] = useState(null);
  const [modesPick, setModesPick] = useState([]);
  const [interestsPick, setInterestsPick] = useState([]);
  const [digest, setDigest] = useState("");
  const [digestOpt, setDigestOpt] = useState(true);

  useEffect(() => {
    if (!open) return;
    const p = usePersonalizationStore.getState().prefs;
    setCityInput(p.city || p.geoLabel || "");
    setModesPick(Array.isArray(p.modes) ? [...p.modes] : []);
    setInterestsPick(Array.isArray(p.interests) ? [...p.interests] : []);
    setDigest(p.digest_email && p.digest_email !== user?.email ? p.digest_email : "");
    setDigestOpt(Boolean(p.digest_opt_in));
    setGeoStatus("");
    setStep(0);
    const hasCoords =
      p.lat != null &&
      p.lng != null &&
      Number.isFinite(Number(p.lat)) &&
      Number.isFinite(Number(p.lng));
    setLatLng(hasCoords ? { lat: Number(p.lat), lng: Number(p.lng) } : null);
  }, [open, user?.email]);

  function toggleMode(m) {
    setModesPick((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  function toggleInterest(t) {
    setInterestsPick((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function requestGeo() {
    if (!navigator.geolocation) {
      setGeoStatus("Location not supported — type a city instead.");
      return;
    }
    setGeoStatus("Locating…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLatLng({ lat: latitude, lng: longitude });
        const label = await reverseLookupCity(latitude, longitude);
        if (label) setCityInput(label);
        setGeoStatus(label ? `Pinned near ${label}` : "Coordinates captured — add a city label if you like.");
      },
      () => {
        setGeoStatus("We couldn’t access location. Type your city below.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  function saveAll() {
    const city = cityInput.trim();
    finalizeTaste({
      city,
      lat: latLng?.lat ?? null,
      lng: latLng?.lng ?? null,
      geoLabel: city,
      modes: modesPick,
      interests: interestsPick,
      digest_email: digest.trim() || user?.email || "",
      digest_opt_in: digestOpt,
    });
    sessionStorage.removeItem("aura_prefs_later");
    onClose();
  }

  function laterSessionOnly() {
    if (!usePersonalizationStore.getState().onboardingClosed) {
      sessionStorage.setItem("aura_prefs_later", "1");
    }
    onClose();
  }

  function neverMind() {
    skipTastePermanent();
    sessionStorage.removeItem("aura_prefs_later");
    onClose();
  }

  if (!open) return null;

  const stepsMeta = ["Where & format", "Interests & AI lineup", "Optional digest"];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(12,10,24,0.55)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
        className="relative max-h-[90vh] w-full max-w-xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={() => laterSessionOnly()}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 px-6 pb-14 pt-7 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
            <Sparkles className="h-3.5 w-3.5" /> Aura taste engine
          </span>
          <h2 id="prefs-title" className="font-display mt-3 text-2xl font-black leading-tight">
            Teach the feed what you’d actually attend.
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/85">
            We combine your city hints, modality choices, and track picks to rank the catalogue (“For you”) — ready for richer AI embeddings next.
          </p>
          <div className="mt-6 flex gap-2">
            {stepsMeta.map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(idx)}
                className={`flex-1 rounded-xl border px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wide transition ${
                  step === idx
                    ? "border-white bg-white/20 text-white"
                    : "border-white/25 text-white/60 hover:bg-white/10"
                }`}
              >
                {idx + 1}. {label}
              </button>
            ))}
          </div>
        </div>

        <div className="-mt-10 max-h-[60vh] space-y-5 overflow-y-auto rounded-t-3xl bg-white px-6 pb-7 pt-8">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="s0" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="space-y-4">
                <p className="text-sm font-semibold text-slate-800">Preferred city or region</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={requestGeo}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-100"
                  >
                    <Radar className="h-4 w-4" /> Use my location
                  </button>
                  <span className="self-center text-xs text-slate-400">or type manually</span>
                </div>
                {geoStatus ? (
                  <p className="text-xs font-medium text-slate-600">{geoStatus}</p>
                ) : null}
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    aria-label="City"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-sm text-slate-800 outline-none ring-violet-200 focus:ring-2"
                    placeholder="e.g. San Francisco, Lagos, Hyderabad"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-800 pt-2">How do you like to participate?</p>
                <div className="flex flex-wrap gap-2">
                  {ATTENDANCE_PREF_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMode(m)}
                      className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                        modesPick.includes(m)
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="s1" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <p className="text-sm font-semibold text-slate-800">Themes you never want to miss</p>
                <p className="mt-1 text-xs text-slate-500">
                  Multi-select chips — we'll boost rows whose tags, titles, or blurbs resemble these topics.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {INTEREST_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleInterest(t)}
                      className={`rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                        interestsPick.includes(t)
                          ? "border-violet-600 bg-violet-50 text-violet-800"
                          : "border-slate-200 bg-white text-slate-500 hover:border-violet-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="s2" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="space-y-3">
                <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={digestOpt} onChange={(e) => setDigestOpt(e.target.checked)} className="mt-1" />
                  Email me weekly picks from Aura intelligence (digest only, no spam).
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-200"
                  placeholder={user?.email || "your@email.com"}
                  value={digest}
                  onChange={(e) => setDigest(e.target.value)}
                />
                <p className="text-[11px] text-slate-400">
                  We store contacts locally until your mail provider is wired. Unsubscribe anytime in settings.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => laterSessionOnly()} className="text-xs font-bold text-slate-500 hover:text-slate-800">
                Later this session
              </button>
              <span className="text-slate-300">•</span>
              <button type="button" onClick={() => neverMind()} className="text-xs font-bold text-slate-400 hover:text-rose-600">
                Never personalise (standard listings)
              </button>
            </div>
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white hover:opacity-95"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={saveAll}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2 text-sm font-bold text-white hover:opacity-95"
                >
                  Save tastes
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
