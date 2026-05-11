import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { authApi } from "../services/api/authApi";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function EditProfile() {
  const { user, setAuth } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    location: "",
    website: "",
    avatar_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          avatar_url: data.avatar_url || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateProfile({
        full_name: form.full_name || undefined,
        bio: form.bio || undefined,
        location: form.location || undefined,
        website: form.website || undefined,
        avatar_url: form.avatar_url || undefined,
      });
      setAuth(updated);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <PageContainer>
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-[rgba(90,80,60,0.08)] rounded w-1/3" />
              <div className="h-40 bg-[rgba(90,80,60,0.08)] rounded" />
              <div className="h-10 bg-[rgba(90,80,60,0.08)] rounded" />
              <div className="h-10 bg-[rgba(90,80,60,0.08)] rounded" />
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="py-8">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#1a1814]">Edit Profile</h1>
              <p className="text-sm text-[#6b6358] mt-1">Update your public profile information</p>
            </div>
            <Link to={`/u/${user?.username || "user"}`}>
              <Button variant="secondary" size="sm">View Profile</Button>
            </Link>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar preview */}
              <div className="flex items-center gap-4 pb-5 border-b border-[rgba(90,80,60,0.08)]">
                <div className="avatar h-16 w-16 text-xl shrink-0">
                  {form.full_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1814]">@{user?.username}</p>
                  <p className="text-xs text-[#a09880]">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell the community about yourself"
                    rows={4}
                    className="input-field resize-none"
                  />
                  <p className="text-xs text-[#a09880] mt-1">{form.bio?.length || 0}/500 characters</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yoursite.com"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={form.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.png"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[rgba(90,80,60,0.08)]">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost" type="button">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </motion.div>
      </PageContainer>
    </div>
  );
}
