import { T } from "./tokens";

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
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
      @keyframes float-gentle{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      .ticker-track{animation:ticker 30s linear infinite}
      .ticker-track:hover{animation-play-state:paused}
      @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}
      .dot-pulse{animation:pulse-dot 1.6s ease-in-out infinite}

      /* ─── Responsive Utilities ─── */
      .home-section { padding: 80px 0 0; }
      .home-container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }

      /* Tablet */
      @media (max-width: 1024px) {
        .bento-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .bento-bottom-grid { grid-template-columns: 1fr !important; }
        .features-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .features-mockup { display: none !important; }
        .host-cta-inner { padding: 48px 40px !important; }
        .nav-links { display: none !important; }
        .nav-hamburger { display: flex !important; }
        .floating-ticket { display: none !important; }
      }

      /* Mobile */
      @media (max-width: 640px) {
        .home-section { padding: 48px 0 0; }
        .home-container { padding: 0 16px; }
        .bento-stats-grid { grid-template-columns: 1fr !important; }
        .hero-search-bar { flex-wrap: wrap !important; padding: 10px !important; }
        .hero-search-location { display: none !important; }
        .hero-search-divider { display: none !important; }
        .hero-popular-tags { display: none !important; }
        .host-cta-inner { padding: 32px 20px !important; border-radius: 20px !important; }
        .host-cta-buttons { flex-direction: column !important; }
        .events-grid { grid-template-columns: 1fr !important; }
        .trending-cats-grid { grid-template-columns: 1fr !important; }
        .near-you-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        .section-title { font-size: clamp(1.5rem, 6vw, 2rem) !important; }
        .nav-desktop-auth { display: none !important; }
        .nav-get-started { display: flex !important; }
      }

      /* Mobile nav drawer */
      .mobile-nav-drawer {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 200;
        display: flex;
        justify-content: flex-end;
      }
      .mobile-nav-panel {
        background: ${T.surface};
        width: 280px;
        height: 100%;
        padding: 24px 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `}</style>
  );
}
