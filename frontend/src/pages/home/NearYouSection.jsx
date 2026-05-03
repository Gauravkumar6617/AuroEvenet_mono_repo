import { motion } from "framer-motion";
import { Navigation, ChevronRight } from "lucide-react";
import { T, events } from "./tokens";
import EventCard from "./EventCard";

export default function NearYouSection() {
  const nearEvents = events.filter((e) => e.nearYou);

  return (
    <section className="home-section">
      <div className="home-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="near-you-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Navigation size={14} color={T.emerald} />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.emerald, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Near You
              </span>
            </div>
            <h2
              className="section-title"
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
              cursor: "pointer",
              fontFamily: "'Cabinet Grotesk', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            View all <ChevronRight size={15} />
          </motion.button>
        </motion.div>

        <div
          className="events-grid"
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
