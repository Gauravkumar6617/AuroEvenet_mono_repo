import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useCategories } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { buildEventContent } from "../components/events/eventPresets";

const TZ = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, fetchCategories } = useCategories();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    category_id: "",
    topics_tags: "",
    agenda: "",
    venue_name: "",
    venue_address: "",
    city_region: "",
    format: "In-person",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    timezone: "America/Los_Angeles",
    currency: "USD",
    is_free: false,
    ga_price: "",
    capacity_total: "",
    refund_policy:
      "Cancellations 7+ days before the event receive a full refund to the original payment method. Within 7 days, tickets are transferable only.",
    registration_url: "",
    banner: null,
  });

  function update(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchCategories();
  }, [isAuthenticated, navigate, fetchCategories]);

  useEffect(() => {
    if (!form.banner) {
      setPreviewUrl(null);
      return;
    }
    const u = URL.createObjectURL(form.banner);
    setPreviewUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [form.banner]);

  const wordCount = useMemo(
    () => form.agenda.trim().split(/\s+/).filter(Boolean).length,
    [form.agenda],
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.banner) return;
    if (!form.category_id) return;
    if (!form.capacity_total || Number(form.capacity_total) <= 0) return;
    if (!form.start_date || !form.start_time || !form.venue_name.trim()) return;
    if (!form.is_free && (!form.ga_price || Number(form.ga_price) <= 0)) return;

    const meta = {
      schemaVersion: 1,
      subtitle: form.subtitle.trim(),
      venue_name: form.venue_name.trim(),
      venue_address: form.venue_address.trim(),
      city_region: form.city_region.trim(),
      starts_on: `${form.start_date}T${form.start_time}:00`,
      ends_on:
        form.end_date && form.end_time ? `${form.end_date}T${form.end_time}:00` : null,
      timezone: form.timezone,
      format: form.format,
      is_free: form.is_free,
      currency: form.currency,
      ga_price_major: form.is_free ? null : Number(form.ga_price),
      capacity_total: Number(form.capacity_total),
      refund_policy: form.refund_policy.trim(),
      registration_url: form.registration_url.trim() || null,
    };

    const content = buildEventContent(meta, form.agenda);
    const tags = [form.topics_tags.trim(), "aura-event"].filter(Boolean).join(", ");

    setSaving(true);
    try {
      await createPost({
        title: form.title,
        content,
        category_id: Number(form.category_id),
        tags,
        thumbnail: form.banner,
      });
      navigate("/event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-16">
      <div className="border-b border-slate-100 bg-white">
        <PageContainer className="py-10">
          <div className="mb-6 flex flex-wrap gap-3">
            <Badge tone="brand">Host desk</Badge>
            <Badge>Tickets · capacity · refunds</Badge>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 md:text-4xl md:leading-[1.1]">
            Create a{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              production-ready listing
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500">
            Lead with imagery, GA pricing, and refund policy. Structured logistics are prefixed with{" "}
            <code className="rounded-md bg-violet-100 px-2 py-0.5 font-mono text-xs text-violet-800">
              [[aura:event-meta]]
            </code>{" "}
            inside the publisher body until a dedicated endpoint exists.
          </p>
          <Link to="/event" className="mt-4 inline-flex text-sm font-bold text-violet-600 hover:text-violet-800">
            ← Back to catalogue
          </Link>
        </PageContainer>
      </div>

      <PageContainer>
        <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <Card className="space-y-4 border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-8">
              <h2 className="font-display text-lg font-bold text-slate-900">Listing</h2>
              <Input
                label="Event title"
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Frontier DevOps Summit"
              />
              <Input
                label="Subtitle line"
                value={form.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
                placeholder="One-line promise for RSVPs"
              />

              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">Banner hero *</span>
                <p className="mb-2 text-xs text-slate-500">Landscape 1600×900+. JPEG / PNG / WebP.</p>
                <input
                  required
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="input-field py-2"
                  onChange={(e) => update("banner", e.target.files?.[0] ?? null)}
                />
                {previewUrl ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <img src={previewUrl} alt="" className="aspect-[16/9] w-full object-cover" />
                  </div>
                ) : null}
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Detailed agenda</span>
                <textarea
                  required
                  value={form.agenda}
                  onChange={(e) => update("agenda", e.target.value)}
                  className="input-field min-h-64 resize-y leading-relaxed"
                  placeholder={`Session blocks, prerequisites, recordings policy, onsite contacts...`}
                />
                <span className="text-xs text-slate-400">~{wordCount} words</span>
              </label>
            </Card>

            <Card className="space-y-4 border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-8">
              <h2 className="font-display text-lg font-bold text-slate-900">Location & logistics</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Format *</span>
                  <div className="flex flex-wrap gap-2">
                    {["In-person", "Virtual", "Hybrid"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => update("format", opt)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                          form.format === opt
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  label="Venue or virtual stage name *"
                  required
                  value={form.venue_name}
                  onChange={(e) => update("venue_name", e.target.value)}
                  placeholder="Moscone West / Zoom Events stage"
                />
                <Input
                  label="Address / dial-in cue"
                  value={form.venue_address}
                  onChange={(e) => update("venue_address", e.target.value)}
                  placeholder="Street, floor, webinar link emailed to RSVPs…"
                />
                <Input
                  label="City / region shown publicly"
                  value={form.city_region}
                  onChange={(e) => update("city_region", e.target.value)}
                  placeholder="San Francisco Bay Area"
                />
                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Timezone *</span>
                  <select
                    className="input-field"
                    value={form.timezone}
                    onChange={(e) => update("timezone", e.target.value)}
                  >
                    {TZ.map((z) => (
                      <option key={z} value={z}>
                        {z.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Start date *"
                  type="date"
                  required
                  value={form.start_date}
                  onChange={(e) => update("start_date", e.target.value)}
                />
                <Input
                  label="Doors open *"
                  type="time"
                  required
                  value={form.start_time}
                  onChange={(e) => update("start_time", e.target.value)}
                />
                <Input
                  label="End date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => update("end_date", e.target.value)}
                />
                <Input
                  label="Ends"
                  type="time"
                  value={form.end_time}
                  onChange={(e) => update("end_time", e.target.value)}
                />
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="space-y-4 border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="font-display text-lg font-bold text-slate-900">Merchandising</h2>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Category *</span>
                <select
                  className="input-field"
                  required
                  value={form.category_id}
                  onChange={(e) => update("category_id", e.target.value)}
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Topics / hashtags"
                value={form.topics_tags}
                onChange={(e) => update("topics_tags", e.target.value)}
                placeholder="security, kubernetes, gala"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => update("is_free", !form.is_free)}
                  className={`rounded-xl border py-3 text-center text-sm font-bold transition ${
                    form.is_free
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {form.is_free ? "Free RSVP" : "Paid admission"}
                </button>
                <div className="space-y-2">
                  <span className="block text-xs font-semibold uppercase text-slate-500">Ticket currency</span>
                  <select
                    className="input-field"
                    value={form.currency}
                    onChange={(e) => update("currency", e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              {!form.is_free && (
                <Input
                  label="General admission price *"
                  type="number"
                  min={0}
                  step="0.01"
                  required={!form.is_free}
                  value={form.ga_price}
                  onChange={(e) => update("ga_price", e.target.value)}
                  placeholder="49.00"
                />
              )}

              <Input
                label="Total venue capacity / ticket cap *"
                type="number"
                min={1}
                required
                value={form.capacity_total}
                onChange={(e) => update("capacity_total", e.target.value)}
                placeholder="850"
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Refund & transfer policy</span>
                <textarea
                  rows={6}
                  className="input-field resize-y leading-relaxed"
                  value={form.refund_policy}
                  onChange={(e) => update("refund_policy", e.target.value)}
                />
              </label>

              <Input
                label="External registration URL (optional)"
                value={form.registration_url}
                onChange={(e) => update("registration_url", e.target.value)}
                placeholder="https://tickets.example.com/event-id"
              />
            </Card>

            <Card className="flex flex-wrap gap-2 border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <Button type="submit" disabled={saving} className="flex-1 min-w-[160px]">
                {saving ? "Publishing…" : "Publish listing"}
              </Button>
              <Button variant="secondary" type="button" onClick={() => navigate("/event")}>
                Discard
              </Button>
              <p className="basis-full pt-3 text-[11px] leading-relaxed text-slate-400">
                By publishing you certify this event complies with local commerce and safety disclosures.
              </p>
            </Card>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
