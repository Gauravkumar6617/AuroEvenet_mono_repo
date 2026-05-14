import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";

const CommunityRules = () => {
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`/api/community/${slug}`);
        setCommunity(response.data);
        setIsMember(response.data.isMember); // Assuming the API provides the member status
      } catch (error) {
        console.error("Error fetching community data:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/v1/user/profile");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchCommunity();
    fetchUserProfile();
  }, [slug]);

  const handleJoin = async () => {
    try {
      await axios.post(`/api/v1/community/${slug}/join`);
      setIsMember(true);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const handleLeave = async () => {
    try {
      await axios.delete(`/api/v1/community/${slug}/leave`);
      setIsMember(false);
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a1814] to-[#2d2820] border-b border-[rgba(90,80,60,0.15)]">
        <PageContainer>
          <div className="py-8 flex items-start gap-5 flex-wrap">
            <img
              src={community.image_url}
              alt={community.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl font-bold text-white">
                  {community.name}
                </h1>
                <span className="text-xs text-[rgba(255,255,255,0.4)]">
                  Community Rules
                </span>
              </div>
              <p className="text-sm text-[rgba(255,255,255,0.6)] max-w-xl leading-relaxed">
                {community.desc}
              </p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-xs text-[rgba(255,255,255,0.5)]">
                  👥 {community.members.toLocaleString()} members
                </span>
                <span className="text-xs text-[rgba(255,255,255,0.5)]">
                  📝 {community.posts.toLocaleString()} posts
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Link
                to={`/communities/${slug}`}
                className="text-sm px-5 py-2.5 rounded-xl font-semibold transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                ← Back to community
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="pt-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📜</span>
              <h2 className="font-display text-xl font-bold text-[#1a1814]">
                Rules & Guidelines
              </h2>
            </div>

            <div className="space-y-4">
              {community.rules.map((rule, i) => (
                <motion.div
                  key={rule.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card>
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fdf0ea] text-[#e85d26] text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm font-bold text-[#1a1814]">
                          {rule.title}
                        </span>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className={`text-[#a09880] transition-transform ${expanded === i ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {expanded === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-[#6b6358] leading-relaxed mt-3 pl-11"
                      >
                        {rule.body}
                      </motion.p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 surface rounded-2xl p-5">
              <p className="text-sm font-bold text-[#1a1814] mb-2">
                Need to report a violation?
              </p>
              <p className="text-xs text-[#6b6358] leading-relaxed mb-3">
                If you see content that breaks these rules, use the report
                button on the post or comment, or contact a moderator directly.
              </p>
              <Link
                to={`/communities/${slug}`}
                className="text-xs font-semibold text-[#e85d26] hover:underline"
              >
                Return to {community.name} →
              </Link>
            </div>

            <div className="mt-8">
              {isMember ? (
                <button
                  onClick={handleLeave}
                  className="w-full px-4 py-2 rounded-lg bg-red-600 text-white font-semibold transition-all hover:bg-red-700"
                >
                  Leave Community
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  className="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-semibold transition-all hover:bg-green-700"
                >
                  Join Community
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </PageContainer>

      <div className="mt-10">
        {userProfile ? (
          <div className="user-profile bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#1a1814]">
              {userProfile.name}
            </h3>
            <p className="text-sm text-[#6b6358]">{userProfile.email}</p>
          </div>
        ) : (
          <p className="text-center text-[#6b6358]">Loading user profile...</p>
        )}
      </div>
    </div>
  );
};

export default CommunityRules;
