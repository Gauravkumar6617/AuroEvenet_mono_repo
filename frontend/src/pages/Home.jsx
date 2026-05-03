import { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  Zap,
  ArrowRight,
  Users,
  Clock,
  Compass,
  Flame,
  Heart,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Music,
  Cpu,
  Leaf,
  Palette,
  Dumbbell,
  Coffee,
  BookOpen,
  Camera,
  Utensils,
  Globe,
  Play,
  Bell,
  Filter,
  Hash,
  Navigation,
  Radio,
  Eye,
  Mic,
} from "lucide-react";

/* ───────────────────── TOKENS ───────────────────── */
const T = {
  bg: "#fafaf8",
  surface: "#ffffff",
  surfaceEl: "#f5f4f0",
  border: "rgba(0,0,0,0.07)",
  borderMed: "rgba(0,0,0,0.12)",
  violet: "#7c3aed",
  violetLight: "#ede9fe",
  violetMid: "#ddd6fe",
  rose: "#e11d48",
  roseLight: "#ffe4e6",
  amber: "#d97706",
  amberLight: "#fef3c7",
  emerald: "#059669",
  emeraldLight: "#d1fae5",
  cyan: "#0891b2",
  cyanLight: "#cffafe",
  orange: "#ea580c",
  orangeLight: "#ffedd5",
  text: "#0f0e0c",
  text2: "#44403c",
  text3: "#78716c",
  text4: "#a8a29e",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.1), 0 20px 48px rgba(0,0,0,0.12)",
};

/* ───────────────────── GLOBAL STYLES ───────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;cursor:none}
    body{
      background:${T.bg};
      color:${T.text};
      font-family:'Cabinet Grotesk',sans-serif;
      overflow-x:hidden;
      line-height:1.6;
    }
    h1,h2,h3{font-family:'Instrument Serif',serif}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:${T.bg}}
    ::-webkit-scrollbar-thumb{background:${T.violet};border-radius:4px}
    .no-scrollbar::-webkit-scrollbar{display:none}
    .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
    button,a{cursor:none}
    @keyframes float-gentle{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    .ticker-track{animation:ticker 30s linear infinite}
    .ticker-track:hover{animation-play-state:paused}
    @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}
    .dot-pulse{animation:pulse-dot 1.6s ease-in-out infinite}
  `}</style>
);

/* ───────────────────── CUSTOM CURSOR ───────────────────── */
function Cursor() {
  const mx = useMotionValue(-100),
    my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 500, damping: 22 });
  const sy = useSpring(my, { stiffness: 500, damping: 22 });
  const tx = useSpring(mx, { stiffness: 150, damping: 30 });
  const ty = useSpring(my, { stiffness: 150, damping: 30 });
  useEffect(() => {
    const h = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <>
      <motion.div
        style={{
          x: tx,
          y: ty,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: `1.5px solid ${T.violet}55`,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <motion.div
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: T.violet,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}

/* ───────────────────── FLOATING TICKET ───────────────────── */
function FloatingTicket({ title, date, price, color, bg, style }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: style.rotate
          ? [style.rotate, style.rotate - 1.5, style.rotate]
          : [0, -1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        borderRadius: 16,
        padding: "14px 18px",
        minWidth: 190,
        background: T.surface,
        boxShadow: T.shadowHover,
        border: `1px solid ${T.border}`,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: T.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: T.text3 }}>{date}</span>
        <span
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 15,
            fontWeight: 400,
            color,
            fontStyle: "italic",
          }}
        >
          {price}
        </span>
      </div>
      <div
        style={{
          marginTop: 8,
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${color}, ${color}44)`,
          width: "65%",
        }}
      />
    </motion.div>
  );
}

/* ───────────────────── SPARKLINE ───────────────────── */
function Sparkline({ data, color, h = 36 }) {
  const w = 100,
    mx = Math.max(...data),
    mn = Math.min(...data);
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - mn) / (mx - mn || 1)) * h}`,
    )
    .join(" ");
  const id = `sg${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
    </svg>
  );
}

/* ───────────────────── BENTO DASHBOARD ───────────────────── */
function BentoDashboard() {
  const [liveCount, setLiveCount] = useState(3842);
  const [ticketData] = useState(() =>
    Array.from({ length: 12 }, () => 30 + Math.random() * 70),
  );
  const [viewData] = useState(() =>
    Array.from({ length: 12 }, () => 20 + Math.random() * 80),
  );
  useEffect(() => {
    const id = setInterval(
      () => setLiveCount((n) => n + Math.floor(Math.random() * 6) - 2),
      1800,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ padding: "80px 0 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <TrendingUp size={15} color={T.violet} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.violet,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Live Snapshot
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.9rem,3.5vw,2.8rem)",
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            What's happening <em>right now</em>
          </h2>
          <p style={{ color: T.text3, fontSize: 16, marginBottom: 48 }}>
            Real-time pulse of the AuraEvents universe.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              label: "Tickets Sold Today",
              val: "12,480",
              delta: "+8.2% this week",
              color: T.violet,
              bg: T.violetLight,
              data: ticketData,
              icon: <Zap size={16} color={T.violet} />,
            },
            {
              label: "People Browsing",
              val: liveCount.toLocaleString(),
              delta: "live right now",
              color: T.emerald,
              bg: T.emeraldLight,
              data: viewData,
              icon: <Eye size={16} color={T.emerald} />,
              live: true,
            },
            {
              label: "Events Starting Soon",
              val: "24",
              delta: "next 2 hours",
              color: T.orange,
              bg: T.orangeLight,
              data: Array.from({ length: 12 }, () => 10 + Math.random() * 90),
              icon: <Clock size={16} color={T.orange} />,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: T.shadowHover }}
                transition={{ duration: 0.2 }}
                style={{
                  background: T.surface,
                  borderRadius: 20,
                  padding: "22px 22px 18px",
                  border: `1px solid ${T.border}`,
                  boxShadow: T.shadow,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: T.text3,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 6,
                      }}
                    >
                      {s.label}
                    </p>
                    <motion.p
                      key={s.val}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: 34,
                        fontWeight: 400,
                        lineHeight: 1,
                        marginBottom: 4,
                      }}
                    >
                      {s.val}
                    </motion.p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      {s.live && (
                        <span
                          className="dot-pulse"
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: T.emerald,
                            display: "inline-block",
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: 12,
                          color: s.live ? T.emerald : T.text3,
                        }}
                      >
                        {s.delta}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: s.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
                <Sparkline data={s.data} color={s.color} />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Second row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: 14,
            marginTop: 14,
          }}
        >
          {/* Hottest Cities */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ y: -4, boxShadow: T.shadowHover }}
              transition={{ duration: 0.2 }}
              style={{
                background: T.surface,
                borderRadius: 20,
                padding: 22,
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
                minHeight: 240,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <Globe size={14} color={T.text3} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Hottest Cities
                </span>
              </div>
              {[
                { city: "New York", events: 142, pct: 90 },
                { city: "London", events: 98, pct: 70 },
                { city: "Tokyo", events: 87, pct: 62 },
                { city: "Berlin", events: 74, pct: 53 },
                { city: "Mumbai", events: 61, pct: 44 },
              ].map((c, i) => (
                <div key={c.city} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: T.text }}
                    >
                      {c.city}
                    </span>
                    <span style={{ fontSize: 12, color: T.text3 }}>
                      {c.events} events
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 5,
                      background: T.surfaceEl,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.1,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                      style={{
                        height: "100%",
                        borderRadius: 5,
                        background: `linear-gradient(90deg, ${T.violet}, ${T.violet}66)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Trending Categories */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ y: -4, boxShadow: T.shadowHover }}
              transition={{ duration: 0.2 }}
              style={{
                background: T.surface,
                borderRadius: 20,
                padding: 22,
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
                minHeight: 240,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <Flame size={14} color={T.rose} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: T.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Trending Categories
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  {
                    cat: "AI & Tech",
                    growth: "+42%",
                    color: T.violet,
                    bg: T.violetLight,
                    icon: <Cpu size={14} color={T.violet} />,
                  },
                  {
                    cat: "Live Music",
                    growth: "+38%",
                    color: T.rose,
                    bg: T.roseLight,
                    icon: <Music size={14} color={T.rose} />,
                  },
                  {
                    cat: "Food & Drink",
                    growth: "+29%",
                    color: T.amber,
                    bg: T.amberLight,
                    icon: <Utensils size={14} color={T.amber} />,
                  },
                  {
                    cat: "Wellness",
                    growth: "+24%",
                    color: T.emerald,
                    bg: T.emeraldLight,
                    icon: <Dumbbell size={14} color={T.emerald} />,
                  },
                  {
                    cat: "Photography",
                    growth: "+18%",
                    color: T.cyan,
                    bg: T.cyanLight,
                    icon: <Camera size={14} color={T.cyan} />,
                  },
                  {
                    cat: "Art & Design",
                    growth: "+15%",
                    color: T.orange,
                    bg: T.orangeLight,
                    icon: <Palette size={14} color={T.orange} />,
                  },
                ].map((c) => (
                  <motion.div
                    key={c.cat}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: c.bg,
                      border: `1px solid ${c.color}22`,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: T.surface,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: T.text,
                          lineHeight: 1.2,
                        }}
                      >
                        {c.cat}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: c.color,
                          fontWeight: 600,
                        }}
                      >
                        {c.growth} this week
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── CATEGORY PILLS ───────────────────── */
const CATS = [
  { label: "All", icon: Sparkles, color: T.violet, bg: T.violetLight },
  { label: "Music", icon: Music, color: T.rose, bg: T.roseLight },
  { label: "Technology", icon: Cpu, color: T.violet, bg: T.violetLight },
  { label: "Food & Drink", icon: Utensils, color: T.amber, bg: T.amberLight },
  { label: "Wellness", icon: Dumbbell, color: T.emerald, bg: T.emeraldLight },
  { label: "Art & Design", icon: Palette, color: T.orange, bg: T.orangeLight },
  { label: "Sustainability", icon: Leaf, color: T.emerald, bg: T.emeraldLight },
  { label: "Photography", icon: Camera, color: T.cyan, bg: T.cyanLight },
  { label: "Education", icon: BookOpen, color: T.amber, bg: T.amberLight },
  { label: "Networking", icon: Users, color: T.violet, bg: T.violetLight },
];

function MagneticPill({ label, active, color, bg, icon: Icon, onClick }) {
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18 });
  const sy = useSpring(y, { stiffness: 280, damping: 18 });
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.22);
    y.set((e.clientY - r.top - r.height / 2) * 0.22);
  };
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        x: sx,
        y: sy,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 100,
        border: `1.5px solid ${active ? color : T.border}`,
        background: active ? bg : T.surface,
        cursor: "none",
        whiteSpace: "nowrap",
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: 13,
        color: active ? color : T.text2,
        boxShadow: active ? `0 4px 16px ${color}28` : T.shadow,
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={14} />
      {label}
    </motion.button>
  );
}

/* ───────────────────── EVENT DATA ───────────────────── */
const events = [
  {
    id: 1,
    title: "Tech Frontier Summit",
    date: "Jun 12–14",
    loc: "San Francisco, CA",
    cat: "Technology",
    img: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&w=700&q=80",
    price: "$299",
    speakers: [
      "https://i.pravatar.cc/32?img=1",
      "https://i.pravatar.cc/32?img=2",
      "https://i.pravatar.cc/32?img=3",
    ],
    rating: "4.9",
    badge: "Trending",
    nearYou: false,
  },
  {
    id: 2,
    title: "Global Jazz Initiative",
    date: "Jul 05",
    loc: "London, UK",
    cat: "Music",
    img: "https://images.unsplash.com/photo-1514525253344-991c70cdc0d9?auto=format&fit=crop&w=700&q=80",
    price: "Free",
    speakers: [
      "https://i.pravatar.cc/32?img=4",
      "https://i.pravatar.cc/32?img=5",
    ],
    rating: "4.7",
    badge: null,
    nearYou: false,
  },
  {
    id: 3,
    title: "Green Future Expo",
    date: "Aug 20",
    loc: "Berlin, DE",
    cat: "Sustainability",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=80",
    price: "$45",
    speakers: [
      "https://i.pravatar.cc/32?img=6",
      "https://i.pravatar.cc/32?img=7",
    ],
    rating: "4.8",
    badge: "Hot",
    nearYou: false,
  },
  {
    id: 4,
    title: "Neon Art Collective",
    date: "Sep 02",
    loc: "Tokyo, JP",
    cat: "Art & Design",
    img: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=700&q=80",
    price: "$89",
    speakers: [
      "https://i.pravatar.cc/32?img=9",
      "https://i.pravatar.cc/32?img=10",
    ],
    rating: "5.0",
    badge: "Sold Out Soon",
    nearYou: false,
  },
  {
    id: 5,
    title: "Morning Yoga in the Park",
    date: "May 10",
    loc: "Lucknow, IN",
    cat: "Wellness",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80",
    price: "Free",
    speakers: ["https://i.pravatar.cc/32?img=11"],
    rating: "4.6",
    badge: "Near You",
    nearYou: true,
  },
  {
    id: 6,
    title: "Street Photography Walk",
    date: "May 12",
    loc: "Lucknow, IN",
    cat: "Photography",
    img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=700&q=80",
    price: "₹199",
    speakers: [
      "https://i.pravatar.cc/32?img=12",
      "https://i.pravatar.cc/32?img=13",
    ],
    rating: "4.9",
    badge: "Near You",
    nearYou: true,
  },
  {
    id: 7,
    title: "Indie Food Festival",
    date: "May 18",
    loc: "Lucknow, IN",
    cat: "Food & Drink",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
    price: "₹499",
    speakers: [],
    rating: "4.7",
    badge: "Near You",
    nearYou: true,
  },
  {
    id: 8,
    title: "AI Research Forum 2026",
    date: "Oct 15",
    loc: "Online",
    cat: "Technology",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=700&q=80",
    price: "$120",
    speakers: [
      "https://i.pravatar.cc/32?img=14",
      "https://i.pravatar.cc/32?img=15",
    ],
    rating: "4.6",
    badge: "Trending",
    nearYou: false,
  },
];

const catMeta = {
  Technology: { color: T.violet, bg: T.violetLight },
  Music: { color: T.rose, bg: T.roseLight },
  Sustainability: { color: T.emerald, bg: T.emeraldLight },
  "Art & Design": { color: T.orange, bg: T.orangeLight },
  Wellness: { color: T.emerald, bg: T.emeraldLight },
  Photography: { color: T.cyan, bg: T.cyanLight },
  "Food & Drink": { color: T.amber, bg: T.amberLight },
  Networking: { color: T.violet, bg: T.violetLight },
  Education: { color: T.amber, bg: T.amberLight },
};

const badgeColors = {
  Trending: { bg: T.violetLight, color: T.violet },
  Hot: { bg: T.roseLight, color: T.rose },
  "Near You": { bg: T.emeraldLight, color: T.emerald },
  "Sold Out Soon": { bg: T.amberLight, color: T.amber },
};

/* ───────────────────── EVENT CARD ───────────────────── */
function EventCard({ event }) {
  const [hov, setHov] = useState(false);
  const [saved, setSaved] = useState(false);
  const cm = catMeta[event.cat] || { color: T.violet, bg: T.violetLight };

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: T.surface,
        border: `1px solid ${hov ? cm.color + "44" : T.border}`,
        boxShadow: hov ? T.shadowHover : T.shadow,
        cursor: "none",
        transition: "border-color 0.3s",
      }}
    >
      <div style={{ height: 196, overflow: "hidden", position: "relative" }}>
        <motion.img
          src={event.img}
          alt={event.title}
          animate={{ scale: hov ? 1.08 : 1 }}
          transition={{ duration: 0.55 }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: T.surface,
              border: `1px solid ${T.border}`,
              fontSize: 11,
              fontWeight: 700,
              color: cm.color,
              backdropFilter: "blur(8px)",
            }}
          >
            {event.cat}
          </span>
          {event.badge && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                background: badgeColors[event.badge]?.bg || T.violetLight,
                fontSize: 11,
                fontWeight: 700,
                color: badgeColors[event.badge]?.color || T.violet,
              }}
            >
              {event.badge}
            </span>
          )}
        </div>
        <motion.button
          onClick={() => setSaved(!saved)}
          whileTap={{ scale: 0.85 }}
          animate={{ opacity: hov || saved ? 1 : 0 }}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.surface,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "none",
          }}
        >
          <Heart
            size={14}
            fill={saved ? T.rose : "none"}
            color={saved ? T.rose : T.text3}
          />
        </motion.button>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <h4
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 18,
            lineHeight: 1.25,
            marginBottom: 8,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </h4>
        <div
          style={{
            display: "flex",
            gap: 14,
            fontSize: 12,
            color: T.text3,
            marginBottom: 14,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={11} />
            {event.date}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={11} />
            {event.loc}
          </span>
        </div>
        <AnimatePresence>
          {hov && event.speakers.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden", marginBottom: 12 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: T.text4 }}>Speakers</span>
                  <div style={{ display: "flex" }}>
                    {event.speakers.map((s, i) => (
                      <img
                        key={i}
                        src={s}
                        alt=""
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: `2px solid ${T.surface}`,
                          marginLeft: i > 0 ? -7 : 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={11} fill={T.amber} color={T.amber} />
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: T.text }}
                  >
                    {event.rating}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 22,
                color: event.price === "Free" ? T.emerald : T.text,
              }}
            >
              {event.price}
            </span>
            {event.price !== "Free" && (
              <span style={{ fontSize: 11, color: T.text4, marginLeft: 4 }}>
                per ticket
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 4px 20px ${cm.color}44` }}
            whileTap={{ scale: 0.94 }}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              background: cm.color,
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: "none",
            }}
          >
            Get Tickets
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────────── NEAR YOU ───────────────────── */
function NearYouSection() {
  const nearEvents = events.filter((e) => e.nearYou);
  return (
    <section style={{ padding: "80px 0 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Navigation size={14} color={T.emerald} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.emerald,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Near You
              </span>
            </div>
            <h2
              style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", lineHeight: 1.15 }}
            >
              Happening in <em>Lucknow</em>
            </h2>
            <p style={{ color: T.text3, fontSize: 15, marginTop: 6 }}>
              Events within reach this week.
            </p>
          </div>
          <motion.button
            whileHover={{ color: T.violet }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: T.text3,
              cursor: "none",
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >
            View all <ChevronRight size={15} />
          </motion.button>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {nearEvents.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <EventCard event={e} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── EVENT GALAXY ───────────────────── */
function EventGalaxy() {
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? events : events.filter((e) => e.cat === filter);

  return (
    <section style={{ padding: "80px 0 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 32 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Flame size={14} color={T.rose} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.rose,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Trending Events
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
                lineHeight: 1.15,
              }}
            >
              Find your next <em>experience</em>
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                background: T.surface,
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
                cursor: "none",
              }}
            >
              <SlidersHorizontal size={13} color={T.text3} />
              <span style={{ fontSize: 13, color: T.text3, fontWeight: 600 }}>
                Filters
              </span>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 28,
            marginBottom: 32,
          }}
          className="no-scrollbar"
        >
          {CATS.map((c) => (
            <MagneticPill
              key={c.label}
              label={c.label}
              active={filter === c.label}
              color={c.color}
              bg={c.bg}
              icon={c.icon}
              onClick={() => setFilter(c.label)}
            />
          ))}
        </div>

        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          <AnimatePresence>
            {visible.map((e, i) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <EventCard event={e} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── FEATURES ───────────────────── */
const features = [
  {
    id: "discover",
    icon: Compass,
    color: T.violet,
    title: "Smart Discovery",
    desc: "Personalized recommendations based on your location, interests, and attendance history.",
    mockup: (
      <div style={{ padding: 20 }}>
        <p
          style={{
            fontSize: 11,
            color: T.text4,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 14,
          }}
        >
          Recommended for you
        </p>
        {[
          {
            t: "Morning Yoga Session",
            d: "0.8km away · Free",
            color: T.emerald,
          },
          { t: "Tech Startup Mixer", d: "2.1km away · ₹299", color: T.violet },
          { t: "Jazz Under the Stars", d: "4km away · ₹799", color: T.rose },
        ].map((r) => (
          <div
            key={r.t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: r.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                {r.t}
              </p>
              <p style={{ fontSize: 11, color: T.text3 }}>{r.d}</p>
            </div>
            <ChevronRight size={14} color={T.text4} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "ticketing",
    icon: Zap,
    color: T.rose,
    title: "Instant Ticketing",
    desc: "One-tap checkout, QR code tickets, and group bookings — secured with cryptographic verification.",
    mockup: (
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: T.surfaceEl,
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 10,
                background: T.text,
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 3,
                padding: 8,
              }}
            >
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 1,
                    background: Math.random() > 0.4 ? "#fff" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18 }}>
            Tech Frontier Summit
          </p>
          <p style={{ fontSize: 12, color: T.text3, marginTop: 4 }}>
            General Admission · Jun 12
          </p>
        </div>
        {[
          { label: "Name", val: "Aryan Sharma" },
          { label: "Order", val: "#AE-48291" },
          { label: "Seat", val: "Hall B, Row 4" },
        ].map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "9px 0",
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <span style={{ fontSize: 12, color: T.text3 }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>
              {r.val}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "analytics",
    icon: TrendingUp,
    color: T.amber,
    title: "Host Analytics",
    desc: "Real-time dashboards, geographic breakdowns, and post-event reports for hosts.",
    mockup: (
      <div style={{ padding: 20 }}>
        <p
          style={{
            fontSize: 11,
            color: T.text4,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 14,
          }}
        >
          Event Performance
        </p>
        {[
          { s: "Views", v: 14800, pct: 100 },
          { s: "RSVPs", v: 3420, pct: 23 },
          { s: "Purchased", v: 1840, pct: 12 },
        ].map((s, i) => (
          <div key={s.s} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>
                {s.s}
              </span>
              <span style={{ fontSize: 12, color: T.text3 }}>
                {s.v.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                height: 7,
                borderRadius: 4,
                background: T.surfaceEl,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                style={{
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${T.amber}, ${T.amber}66)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

function FeaturesSection() {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setActive(Math.min(features.length - 1, Math.floor(v * features.length)));
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: `${features.length * 75}vh`,
        position: "relative",
        marginTop: 80,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Sparkles size={14} color={T.violet} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.violet,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Platform
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem,3.5vw,3rem)",
                lineHeight: 1.1,
                marginBottom: 44,
              }}
            >
              Everything to discover
              <br />
              <em>and host events.</em>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {features.map((f, i) => {
                const Icon = f.icon;
                const isA = active === i;
                return (
                  <motion.button
                    key={f.id}
                    onClick={() => setActive(i)}
                    animate={{
                      background: isA ? f.color + "10" : "transparent",
                      borderColor: isA ? f.color + "44" : "transparent",
                    }}
                    style={{
                      padding: "18px 22px",
                      borderRadius: 14,
                      border: "1px solid transparent",
                      textAlign: "left",
                      cursor: "none",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 11,
                        background: isA ? f.color + "18" : T.surfaceEl,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background 0.3s",
                      }}
                    >
                      <Icon size={17} color={isA ? f.color : T.text3} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: isA ? T.text : T.text3,
                          marginBottom: isA ? 4 : 0,
                          transition: "color 0.3s",
                        }}
                      >
                        {f.title}
                      </p>
                      {isA && (
                        <p
                          style={{
                            fontSize: 13,
                            color: T.text3,
                            lineHeight: 1.6,
                          }}
                        >
                          {f.desc}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.38 }}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background: T.surface,
                boxShadow: T.shadowHover,
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: T.surfaceEl,
                }}
              >
                {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c,
                      opacity: 0.7,
                    }}
                  />
                ))}
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    color: T.text3,
                    fontFamily: "monospace",
                  }}
                >
                  aura.events / {features[active].id}
                </span>
              </div>
              {features[active].mockup}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── TICKER ───────────────────── */
function StatsTicker() {
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

/* ───────────────────── HOST CTA ───────────────────── */
function HostCTA() {
  return (
    <section style={{ padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            borderRadius: 28,
            padding: "64px 72px",
            position: "relative",
            overflow: "hidden",
            background: T.violet,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "55%",
              bottom: -60,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", maxWidth: 560 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 13px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.15)",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 22,
              }}
            >
              <Sparkles size={11} /> For Creators
            </span>
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2rem,4vw,3.2rem)",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 18,
              }}
            >
              Plan your next big
              <br />
              <em>thing with Aura.</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                marginBottom: 36,
              }}
            >
              From intimate workshops to 50,000-seat arenas — AuraEvents gives
              you the tools to create unforgettable experiences.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <motion.button
                whileHover={{
                  scale: 1.04,
                  background: "#fff",
                  color: T.violet,
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "13px 30px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                Host an Event <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "13px 30px",
                  borderRadius: 12,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  cursor: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Play size={14} /> Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────── NAV ───────────────────── */
function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const u = scrollY.on("change", (v) => setScrolled(v > 50));
    return u;
  }, [scrollY]);

  return (
    <motion.nav
      animate={{
        background: scrolled ? "rgba(250,250,248,0.92)" : "rgba(250,250,248,0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${T.border}`
          : "1px solid transparent",
      }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              cursor: "none",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: T.violet,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: T.text,
              }}
            >
              AuraEvents
            </span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {["Discover", "Near You", "Host", "Pricing"].map((item) => (
              <motion.button
                key={item}
                whileHover={{ color: T.violet, background: T.violetLight }}
                style={{
                  padding: "7px 13px",
                  background: "none",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.text3,
                  cursor: "none",
                  borderRadius: 8,
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <motion.button
            whileHover={{ color: T.text }}
            style={{
              padding: "8px 14px",
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: T.text3,
              cursor: "none",
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >
            Sign in
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 4px 20px ${T.violet}44` }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              background: T.violet,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              cursor: "none",
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

/* ───────────────────── HERO ───────────────────── */
function Hero() {
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const mesh1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const mesh2Y = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const ticketL = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const ticketR = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 62,
      }}
    >
      <motion.div style={{ y: bgY, position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: T.bg }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle, ${T.borderMed} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <motion.div
          style={{
            y: mesh1Y,
            position: "absolute",
            top: "-15%",
            left: "-5%",
            width: "55%",
            height: "55%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.violetLight} 0%, transparent 65%)`,
            filter: "blur(48px)",
          }}
        />
        <motion.div
          style={{
            y: mesh2Y,
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "45%",
            height: "45%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.roseLight} 0%, transparent 65%)`,
            filter: "blur(56px)",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "30%",
            right: "20%",
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.amberLight} 0%, transparent 65%)`,
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, ${T.bg} 100%)`,
          }}
        />
      </motion.div>

      <motion.div
        style={{
          y: ticketL,
          position: "absolute",
          zIndex: 2,
          top: "20%",
          left: "4%",
        }}
      >
        <FloatingTicket
          title="Tech Frontier Summit"
          date="Jun 12–14 · SF"
          price="$299"
          color={T.violet}
          bg={T.violetLight}
          style={{ rotate: -5 }}
        />
      </motion.div>
      <motion.div
        style={{
          y: ticketR,
          position: "absolute",
          zIndex: 2,
          top: "28%",
          right: "4%",
        }}
      >
        <FloatingTicket
          title="Global Jazz Night"
          date="Jul 05 · London"
          price="Free"
          color={T.rose}
          bg={T.roseLight}
          style={{ rotate: 6 }}
        />
      </motion.div>
      <motion.div
        style={{
          y: mesh1Y,
          position: "absolute",
          zIndex: 2,
          bottom: "20%",
          left: "8%",
        }}
      >
        <FloatingTicket
          title="Indie Food Festival"
          date="May 18 · Lucknow"
          price="₹499"
          color={T.amber}
          bg={T.amberLight}
          style={{ rotate: 4 }}
        />
      </motion.div>
      <motion.div
        style={{
          y: ticketR,
          position: "absolute",
          zIndex: 2,
          bottom: "24%",
          right: "6%",
        }}
      >
        <FloatingTicket
          title="Neon Art Collective"
          date="Sep 02 · Tokyo"
          price="$89"
          color={T.orange}
          bg={T.orangeLight}
          style={{ rotate: -4 }}
        />
      </motion.div>

      <motion.div
        style={{
          y: contentY,
          opacity: contentO,
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 780,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              background: T.violetLight,
              border: `1px solid ${T.violetMid}`,
              fontSize: 12,
              fontWeight: 700,
              color: T.violet,
              marginBottom: 32,
            }}
          >
            <span
              className="dot-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: T.violet,
                display: "inline-block",
              }}
            />
            The Global Event Discovery Platform
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(3rem,7.5vw,6.5rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.01em",
            marginBottom: 26,
            color: T.text,
          }}
        >
          Discover & host
          <br />
          <span style={{ fontStyle: "italic", color: T.violet }}>
            extraordinary
          </span>
          <br />
          events.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          style={{
            fontSize: 18,
            color: T.text2,
            marginBottom: 44,
            lineHeight: 1.65,
          }}
        >
          AuraEvents connects you with ticketed summits, local meetups,
          <br />
          and virtual experiences tailored to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.38 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 18,
            padding: "12px 14px 12px 20px",
            maxWidth: 640,
            margin: "0 auto",
            background: T.surface,
            border: `1.5px solid ${T.borderMed}`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.1), 0 0 0 4px ${T.violetLight}`,
          }}
        >
          <Search size={17} color={T.text4} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, cities, categories..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 15,
              color: T.text,
              fontFamily: "'Cabinet Grotesk', sans-serif",
              caretColor: T.violet,
            }}
          />
          <div style={{ width: 1, height: 20, background: T.border }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              color: T.text3,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <Navigation size={12} color={T.emerald} /> Lucknow
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 4px 20px ${T.violet}44` }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "10px 22px",
              borderRadius: 12,
              background: T.violet,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              cursor: "none",
              whiteSpace: "nowrap",
            }}
          >
            Search
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12, color: T.text4, alignSelf: "center" }}>
            Popular:
          </span>
          {["Morning Yoga", "Tech Summit", "Food Festival", "Jazz Night"].map(
            (tag) => (
              <motion.button
                key={tag}
                whileHover={{
                  color: T.violet,
                  background: T.violetLight,
                  borderColor: T.violetMid,
                }}
                style={{
                  background: T.surfaceEl,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  padding: "3px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.text3,
                  cursor: "none",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {tag}
              </motion.button>
            ),
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────────────────── ROOT ───────────────────── */
export default function AuraEvents() {
  return (
    <>
      <GlobalStyle />
      <Cursor />
      <div style={{ background: T.bg, minHeight: "100vh" }}>
        <Nav />
        <Hero />
        <StatsTicker />
        <BentoDashboard />
        <NearYouSection />
        <EventGalaxy />
        <FeaturesSection />
        <HostCTA />
        <footer
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: "36px 24px",
            textAlign: "center",
            background: T.surface,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              marginBottom: 10,
              cursor: "none",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: T.violet,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={12} color="#fff" fill="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                color: T.text,
              }}
            >
              AuraEvents
            </span>
          </div>
          <p style={{ fontSize: 12, color: T.text4 }}>
            © 2026 AuraEvents Inc. · The Global Event Discovery Platform
          </p>
        </footer>
      </div>
    </>
  );
}
