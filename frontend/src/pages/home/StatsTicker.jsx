import { T } from "./tokens";

export default function StatsTicker() {
  const items = [
    "1.2M+ Tickets Sold",
    "15,000 Hosts",
    "135+ Countries",
    "450 Events Daily",
    "80+ Cities",
    "₹24Cr+ Collected",
    "99.9% Uptime",
  ];
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 0",
        overflow: "hidden",
        background: T.violetLight,
      }}
    >
      <div
        className="ticker-track"
        style={{ display: "flex", gap: 48, width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: T.violet,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.violet,
                letterSpacing: "0.04em",
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
