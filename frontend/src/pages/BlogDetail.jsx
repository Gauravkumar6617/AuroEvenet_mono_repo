import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const THREAD = [
  { id: 1, author: "gaurav", text: "Use service boundaries + domain modules, not endpoint folders.", depth: 0, votes: 18 },
  { id: 2, author: "priya", text: "Agree. Also enforce DTOs at boundaries to keep internal models private.", depth: 1, votes: 7 },
  { id: 3, author: "alex", text: "Add API contract tests so refactors don't break consumers.", depth: 1, votes: 5 },
];

export default function BlogDetail() {
  const { slug } = useParams();
  const [reply, setReply] = useState("");

  return (
    <div className="py-10">
      <PageContainer>
        <div className="mb-5 text-sm text-slate-500">
          <Link to="/blog" className="hover:text-brand-700">
            Feed
          </Link>{" "}
          / Discussion
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <Card>
              <div className="flex items-center gap-2">
                <Badge tone="brand">Architecture</Badge>
                <Badge>Question</Badge>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">What is the best backend folder structure in 2026?</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Looking for patterns that scale with larger teams, clear boundaries for domains, and testability across service layers.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="secondary">Upvote</Button>
                <Button variant="secondary">Bookmark</Button>
                <Button variant="secondary">Share</Button>
              </div>
            </Card>

            <Card className="mt-5">
              <h2 className="font-display text-xl font-semibold">Answers & discussion</h2>
              <div className="mt-4 space-y-3">
                {THREAD.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3" style={{ marginLeft: `${item.depth * 24}px` }}>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>@{item.author}</span>
                      <span>{item.votes} votes</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="input-field min-h-24 resize-none" placeholder="Write an answer..." />
                <Button>Post answer</Button>
              </div>
            </Card>
          </div>

          <Card className="h-fit">
            <h3 className="font-display text-lg font-semibold">Related Threads</h3>
            <div className="mt-3 space-y-3">
              {["How to design API versioning?", "Monolith vs modular monolith", "Best auth strategy for SaaS"].map((item) => (
                <Link key={item} to={`/blog/${slug}`} className="block rounded-lg border border-slate-200 p-3 text-sm text-slate-700 hover:border-brand-200 hover:bg-brand-50/40">
                  {item}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
