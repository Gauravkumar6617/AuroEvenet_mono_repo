import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Search, Navigation } from "lucide-react";
import { T } from "./tokens";
import FloatingTicket from "./FloatingTicket";

export default function Hero() {
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
      {/* Parallax background */}
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

      {/* Floating tickets — hidden on mobile/tablet via CSS class */}
      <motion.div
        className="floating-ticket"
        style={{ y: ticketL, position: "absolute", zIndex: 2, top: "20%", left: "4%" }}
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
        className="floating-ticket"
        style={{ y: ticketR, position: "absolute", zIndex: 2, top: "28%", right: "4%" }}
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
        className="floating-ticket"
        style={{ y: mesh1Y, position: "absolute", zIndex: 2, bottom: "20%", left: "8%" }}
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
        className="floating-ticket"
        style={{ y: ticketR, position: "absolute", zIndex: 2, bottom: "24%", right: "6%" }}
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

      {/* Main hero content */}
      <motion.div
        style={{
          y: contentY,
          opacity: contentO,
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 780,
          width: "100%",
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
            fontSize: "clamp(2.4rem,7.5vw,6.5rem)",
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
            fontSize: "clamp(15px, 2vw, 18px)",
            color: T.text2,
            marginBottom: 44,
            lineHeight: 1.65,
          }}
        >
          AuraEvents connects you with ticketed summits, local meetups,
          and virtual experiences tailored to you.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.38 }}
          className="hero-search-bar"
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
          <Search size={17} color={T.text4} style={{ flexShrink: 0 }} />
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
              minWidth: 0,
            }}
          />
          <div
            className="hero-search-divider"
            style={{ width: 1, height: 20, background: T.border, flexShrink: 0 }}
          />
          <div
            className="hero-search-location"
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
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Search
          </motion.button>
        </motion.div>

        {/* Popular tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="hero-popular-tags"
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
                  cursor: "pointer",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {tag}
              </motion.button>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
