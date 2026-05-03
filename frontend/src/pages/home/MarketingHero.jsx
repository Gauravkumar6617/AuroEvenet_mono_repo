import PageContainer from "../../components/layout/PageContainer";

/**
 * Hero strip aligned with Event.jsx (radial violet/sky glow, pill eyebrow, font-display).
 */
export default function MarketingHero({ eyebrow, title, subtitle, badgePulse = true, align = "left" }) {
  const alignCls =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left";

  return (
    <div className="relative overflow-hidden border-b border-slate-100 bg-white pt-24 pb-12 md:pb-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 60% -10%, #ede9fe 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at -5% 60%, #e0f2fe 0%, transparent 65%)",
          }}
        />
      </div>
      <PageContainer>
        <div className={`relative max-w-3xl ${alignCls}`}>
          {eyebrow && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-700">
              {badgePulse ? (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
              ) : null}
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl md:leading-[1.1]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-5 text-lg leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </PageContainer>
    </div>
  );
}
