import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import { usePosts } from "../contexts/PostsContext";
import { useCommunities } from "../contexts/CommunityContext";
import { useEffect } from "react";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [tab, setTab] = useState("Posts");
  const [dateFilter, setDateFilter] = useState("all");

  const { posts, searchPosts, loading, error } = usePosts();
  const { communities, fetchCommunities } = useCommunities();

  useEffect(() => {
    if (q) {
      searchPosts(q);
    }
    if (tab === "Communities") {
      fetchCommunities();
    }
  }, [q, tab, searchPosts, fetchCommunities]);

  return (
    <div className="py-8">
      <PageContainer>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xl">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09880]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input className="input-field pl-10" defaultValue={q} placeholder="Search everything..." />
            </div>
            <select className="input-field w-36" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
              <option value="all">Any time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
          {q && <p className="text-sm text-[#6b6358]">Results for "<strong>{q}</strong>" — {posts.length + communities.length} found</p>}
        </div>
        <Tabs items={["Posts", "Users", "Communities"]} active={tab} onChange={setTab} variant="underline" />
        <div className="mt-5 space-y-3">
          {loading && <div className="text-center py-10">Searching...</div>}
          {error && <div className="text-center py-10 text-red-500">{error}</div>}

          {tab === "Posts" && !loading && posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`}>
              <Card hover className="post-card rounded-2xl">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <Badge tone="brand">
                    {typeof p.category_name === 'object' ? p.category_name.name : (p.category_name || "General")}
                  </Badge>
                  {p.tags?.map(t => (
                    <span key={typeof t === 'object' ? (t.id || t.name) : t} className="tag-pill">
                      #{typeof t === 'object' ? t.name : t}
                    </span>
                  ))}
                  <span className="text-xs text-[#a09880]">{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[#1a1814] hover:text-[#e85d26] transition-colors">{p.title}</h3>
                <p className="text-xs text-[#a09880] mt-1">@{p.author_name} · {p.like_count || 0} likes</p>
              </Card>
            </Link>
          ))}
          {tab === "Posts" && !loading && posts.length === 0 && (
            <div className="text-center py-10 text-[#a09880]">No posts found matching "{q}"</div>
          )}
          {tab === "Users" && (
            <div className="text-center py-10 text-[#a09880]">User search isn't available yet</div>
          )}
          {tab === "Communities" && !loading && communities.map((c) => (
            <div key={c.id} className="surface rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#1a1814]">#{c.name}</p>
                <p className="text-xs text-[#a09880]">{c.slug}</p>
              </div>
              <Button variant="secondary" size="sm">Join</Button>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
