/**
 * Home.jsx — entry point for the AuraEvents home page.
 * All sections live in ./home/ for maintainability.
 */
import GlobalStyle from "./home/GlobalStyle";
import Nav from "./home/Nav";
import Hero from "./home/Hero";
import StatsTicker from "./home/StatsTicker";
import BentoDashboard from "./home/BentoDashboard";
import NearYouSection from "./home/NearYouSection";
import EventGalaxy from "./home/EventGalaxy";
import FeaturesSection from "./home/FeaturesSection";
import HostCTA from "./home/HostCTA";
import HomeFooter from "./home/HomeFooter";
import { T } from "./home/tokens";

export default function AuraEvents() {
  return (
    <>
      <GlobalStyle />
      <div style={{ background: T.bg, minHeight: "100vh" }}>
        <Nav />
        <Hero />
        <StatsTicker />
        <BentoDashboard />
        <NearYouSection />
        <EventGalaxy />
        <FeaturesSection />
        <HostCTA />
        <HomeFooter />
      </div>
    </>
  );
}
