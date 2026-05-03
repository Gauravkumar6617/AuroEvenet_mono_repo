import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const STATS = [
  { label: "Community Members", value: "50k+", icon: "👥" },
  { label: "Events Hosted", value: "1,200+", icon: "📅" },
  { label: "Partner Brands", value: "450+", icon: "🤝" },
  { label: "Cities Globally", value: "120+", icon: "🌎" },
];

const VALUES = [
  {
    title: "Community First",
    desc: "We believe the best breakthroughs happen in the hallway, not just on the stage.",
    color: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    title: "Radical Access",
    desc: "Providing high-quality tech education and networking to everyone, everywhere.",
    color: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    title: "Engineering Excellence",
    desc: "We prioritize deep technical content over marketing fluff every single time.",
    color: "bg-orange-50",
    text: "text-orange-600",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-28 pb-20 font-sans selection:bg-indigo-100">
      <PageContainer>
        {/* --- HERO SECTION --- */}
        <section className="text-center max-w-4xl mx-auto mb-24">
          <Badge className="bg-indigo-50 text-indigo-600 border-none px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest mb-6">
            Our Story
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
            Building the infrastructure for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              human connection.
            </span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            Founded in 2024, our platform was born out of a simple frustration:
            tech events were becoming too corporate and too disconnected. We're
            here to bring the "Engineering" back to the Summit.
          </p>
        </section>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {STATS.map((stat, i) => (
            <Card
              key={i}
              className="p-8 rounded-[40px] border-none shadow-sm ring-1 ring-slate-100 text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <span className="text-3xl mb-4 block">{stat.icon}</span>
              <h3 className="text-4xl font-black text-slate-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </Card>
          ))}
        </section>

        {/* --- VALUES SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">
                Why we do what we do.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                We aren't just a ticketing platform. We are an ecosystem
                designed to foster real-time collaboration between AI
                researchers, frontend wizards, and backend architects.
              </p>
            </div>

            <div className="space-y-6">
              {VALUES.map((val, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div
                    className={`h-12 w-12 shrink-0 rounded-2xl ${val.color} flex items-center justify-center font-bold ${val.text}`}
                  >
                    0{i + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg mb-1">
                      {val.title}
                    </h4>
                    <p className="text-slate-500 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE / VISUAL SIDE */}
          <div className="relative">
            <div className="aspect-square rounded-[60px] bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-700"
                alt="Event atmosphere"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-2xl max-w-[280px] ring-1 ring-slate-100 hidden md:block">
              <p className="text-sm font-bold text-slate-900 mb-4 italic">
                "The community here is unlike anything else. It's high-signal,
                zero-noise."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                  <p className="text-xs font-black text-slate-900">
                    Sarah Chen
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    Principal Engineer, OpenAI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CTA SECTION --- */}
        <section className="relative rounded-[64px] bg-[#020617] p-12 md:p-24 overflow-hidden shadow-2xl border border-slate-800/50">
          {/* The Background Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-40 -mb-40" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Ready to join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                future of engineering?
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              {/* PRIMARY: High-Contrast Purple Gradient */}
              <Button className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(147,51,234,0.4)] border-t border-white/20">
                Browse Events
              </Button>

              {/* SECONDARY: Deep Glassmorphism */}
              <Button className="bg-white/5 backdrop-blur-md text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300">
                Contact Our Team
              </Button>
            </div>

            {/* Social Proof Stats */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-[#020617] shadow-2xl object-cover"
                    src={`https://i.pravatar.cc/150?u=techuser${i}`}
                    alt="user"
                  />
                ))}
              </div>
              <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase">
                Join <span className="text-white">2,400+</span> top-tier
                engineers
              </p>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
