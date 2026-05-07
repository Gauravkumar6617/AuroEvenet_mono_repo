import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

export default function PostCard({ post, votes, onVote, typeColors, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
    >
      <Card className="p-0 post-card overflow-hidden rounded-2xl group">
        <div className="flex">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-1 px-3 py-4 bg-[rgba(90,80,60,0.03)] border-r border-[rgba(90,80,60,0.07)] shrink-0 min-w-[56px]">
            <button
              onClick={() => onVote(post.id, "up")}
              className={`vote-btn ${votes[post.id] === "up" ? "active-up" : ""}`}
            >
              ▲
            </button>
            <span className="text-sm font-bold text-[#1a1814]">
              {post.votes + (votes[post.id] === "up" ? 1 : votes[post.id] === "down" ? -1 : 0)}
            </span>
            <button
              onClick={() => onVote(post.id, "down")}
              className={`vote-btn ${votes[post.id] === "down" ? "active-down" : ""}`}
            >
              ▼
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 items-start gap-4 p-4 min-w-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge tone={typeColors[post.type]}>{post.type}</Badge>
                {post.tag && <span className="tag-pill py-0.5">{post.tag}</span>}
                {post.category && <span className="text-xs text-[#a09880]">{post.category}</span>}
                {post.type === "question" && post.hasOwnProperty("answered") && (
                  <Badge tone={post.answered ? "success" : "warning"} dot>
                    {post.answered ? "Answered" : "Open"}
                  </Badge>
                )}
              </div>
              <Link to={`/blog/${post.id}`}>
                <h3 className="font-display text-lg font-semibold text-[#1a1814] line-clamp-2 group-hover:text-[#e85d26] transition-colors leading-snug">
                  {post.title}
                </h3>
              </Link>
              {post.excerpt && (
                <p className="mt-1.5 text-sm text-[#6b6358] line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="avatar h-5 w-5" style={{ fontSize: "0.6rem" }}>
                    {post.avatar || (post.author ? post.author[0].toUpperCase() : "?")}
                  </div>
                  <span className="text-xs font-medium text-[#6b6358]">@{post.author}</span>
                </div>
                <span className="text-xs text-[#a09880]">{post.time}</span>
                {post.comments !== undefined && (
                  <Link to={`/blog/${post.id}`} className="flex items-center gap-1 text-xs text-[#a09880] hover:text-[#6b6358]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {post.comments}
                  </Link>
                )}
                {post.saves !== undefined && (
                  <button className="flex items-center gap-1 text-xs text-[#a09880] hover:text-[#e85d26] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    {post.saves}
                  </button>
                )}
              </div>
            </div>
            {post.image && (
              <img src={post.image} alt="" className="h-20 w-28 rounded-xl object-cover shrink-0 hidden sm:block" />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
