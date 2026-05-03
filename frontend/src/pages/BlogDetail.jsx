import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const EVENT_DETAIL = {
  id: "ai-summit-2026",
  title: "AI Engineering Summit 2026",
  organizer: "Gaurav Kumar",
  date: "JUN 14",
  fullDate: "Sunday, June 14, 2026",
  time: "10:00 AM - 5:00 PM",
  location: "San Francisco, CA",
  ticketsSold: 850,
  totalCapacity: 1000,
  price: "$49.00",
  tags: {
    topics: ["AI / ML", "LLMs", "Orchestration"],
    level: "Intermediate",
    format: "Hybrid",
  },
  likes: 1240,
};

const INITIAL_COMMENTS = [
  {
    id: 1,
    user: "priya",
    text: "Is there a virtual link for those who can't travel?",
    time: "2h ago",
    likes: 12,
    hasLiked: false,
    replies: [
      {
        id: 101,
        user: "gaurav_staff",
        text: "Yes! Hybrid tickets include a Zoom link.",
        time: "1h ago",
      },
    ],
  },
];

export default function EventDetail() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [isLiked, setIsLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const ticketPercent =
    (EVENT_DETAIL.ticketsSold / EVENT_DETAIL.totalCapacity) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* --- MAIN CONTENT AREA --- */}
          <div className="space-y-8">
            {/* 1. HERO SECTION */}
            <section className="overflow-hidden rounded-[40px] bg-white border border-slate-200 shadow-sm">
              <div className="h-64 w-full bg-gradient-to-tr from-indigo-600 to-violet-600 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
              </div>

              <div className="px-8 pb-8">
                {/* Date Float */}
                <div className="relative -mt-12 mb-6 flex h-24 w-20 flex-col items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
                  <span className="text-xs font-bold text-indigo-600 uppercase">
                    {EVENT_DETAIL.date.split(" ")[0]}
                  </span>
                  <span className="text-3xl font-black text-slate-900">
                    {EVENT_DETAIL.date.split(" ")[1]}
                  </span>
                </div>

                <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">
                  {EVENT_DETAIL.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {EVENT_DETAIL.tags.topics.map((t) => (
                    <Badge
                      key={t}
                      className="bg-slate-100 text-slate-600 border-none px-3 py-1"
                    >
                      #{t}
                    </Badge>
                  ))}
                </div>

                <p className="text-lg text-slate-500 leading-relaxed mb-8">
                  Join us for the definitive gathering of AI practitioners.
                  We're diving deep into agentic workflows, RAG optimization,
                  and the future of LLM orchestration.
                </p>

                {/* --- NEW: LIKES & SHARING BAR (BELOW CONTENT) --- */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                        isLiked
                          ? "bg-pink-50 text-pink-600"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span>{isLiked ? "❤️" : "🤍"}</span>
                      {EVENT_DETAIL.likes + (isLiked ? 1 : 0)}
                    </button>

                    <div className="flex -space-x-2 ml-2">
                      {[1, 2, 3].map((i) => (
                        <img
                          key={i}
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          className="h-7 w-7 rounded-full border-2 border-white"
                          alt="user"
                        />
                      ))}
                      <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        +24
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShareOpen(!shareOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 transition-colors"
                    >
                      <span>📤</span> Share Event
                    </button>

                    {shareOpen && (
                      <div className="absolute bottom-full right-0 mb-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                          Twitter / X
                        </button>
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                          LinkedIn
                        </button>
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl">
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. THREADED COMMENTS */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 px-2">
                Community Discussion
              </h3>

              <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <textarea
                      placeholder="Write a comment..."
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-100 min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold">
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thread Example */}
              {comments.map((c) => (
                <div key={c.id} className="space-y-4">
                  <div className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm">
                    <div className="flex gap-4">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user}`}
                        className="h-10 w-10 rounded-full bg-slate-100"
                        alt="user"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-900 text-sm">
                            @{c.user}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {c.time}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {c.text}
                        </p>
                        <div className="flex gap-4 mt-4">
                          <button className="text-[10px] font-black text-slate-400 uppercase tracking-tighter hover:text-pink-500">
                            Like • {c.likes}
                          </button>
                          <button className="text-[10px] font-black text-slate-400 uppercase tracking-tighter hover:text-indigo-600">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reply Thread */}
                  {c.replies.map((r) => (
                    <div
                      key={r.id}
                      className="ml-12 bg-slate-50/50 rounded-[24px] border border-slate-100 p-4 flex gap-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                        G
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          @{r.user}{" "}
                          <span className="text-[10px] text-indigo-500 ml-1">
                            Organizer
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          </div>

          {/* --- SIDEBAR (STICKY) --- */}
          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-[40px] border-none p-8 shadow-2xl shadow-indigo-100 ring-1 ring-slate-100">
                <div className="mb-6">
                  <span className="text-4xl font-black text-slate-900">
                    {EVENT_DETAIL.price}
                  </span>
                  <span className="text-slate-400 text-sm font-bold ml-2">
                    / person
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Tickets Sold</span>
                    <span className="text-indigo-600">
                      {Math.round(ticketPercent)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600"
                      style={{ width: `${ticketPercent}%` }}
                    />
                  </div>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 transition-transform active:scale-95">
                  Book Tickets
                </Button>
              </Card>

              <Card className="rounded-[32px] border-none p-6 shadow-sm bg-white ring-1 ring-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                  Hosted By
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=gaurav"
                    className="h-12 w-12 rounded-2xl bg-orange-50"
                    alt="host"
                  />
                  <div>
                    <p className="font-bold text-slate-900">
                      {EVENT_DETAIL.organizer}
                    </p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">
                      Top-Rated Host
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
