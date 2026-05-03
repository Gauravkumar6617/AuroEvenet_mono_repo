import UnifiedEventCard from "../../components/events/UnifiedEventCard";

/** Home sections use `events` from tokens — routed through unified listing visuals. */
export default function EventCard({ event }) {
  return <UnifiedEventCard raw={event} />;
}
