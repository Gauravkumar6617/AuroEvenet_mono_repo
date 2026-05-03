/**
 * Home.jsx — entry point for the AuraEvents home page.
 * All sections live in ./home/ for maintainability.
 * Note: Nav and Footer are now provided globally by App.tsx
 */
import GlobalStyle from "./home/GlobalStyle";
import Hero from "./home/Hero";
import StatsTicker from "./home/StatsTicker";
import BentoDashboard from "./home/BentoDashboard";
import NearYouSection from "./home/NearYouSection";
import EventGalaxy from "./home/EventGalaxy";
import FeaturesSection from "./home/FeaturesSection";
import HostCTA from "./home/HostCTA";
import { T } from "./home/tokens";

export default function AuraEvents() {
  return (
    <>
      <GlobalStyle />
      <div style={{ background: T.bg, minHeight: "100vh", paddingTop: "62px" }}>
        <Hero />
        <StatsTicker />
        <BentoDashboard />
        <NearYouSection />
        <EventGalaxy />
        <FeaturesSection />
        <HostCTA />
      </div>
    </>
  );
}
