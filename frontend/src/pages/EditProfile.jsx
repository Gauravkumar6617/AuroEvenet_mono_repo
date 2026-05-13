import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { authApi } from "../services/api/authApi";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { apiClientCore } from "../services/api/client";

export default function EditProfile() {
  const { user, setAuth } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({ full_name: "", bio: "", location: "", website: "", avatar_url: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stats, setStats] = useState({ followers_count: 0, following_count: 0 });

  useEffect(() => {
    authApi.getProfile()
      .then((data) => {
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          avatar_url: data.avatar_url || "",
        });
        // fetch follow stats + lists using user id
        if (data.id) {
          apiClientCore.request(`/api/v1/social/stats/${data.id}`, { method: "GET" }, false, null, false, false)
            .then(setStats).catch(() => {});
          apiClientCore.request(`/api/v1/social/followers/${data.id}`, { method: "GET" }, false, null, false, false)
            .then(setFollowers).catch(() => {});
          apiClientCore.request(`/api/v1/social/following/${data.id}`, { method: "GET" }, false, null, false, false)
            .then(setFollowing).catch(() => {});
        }
      })
      .catch(() => showToast("Failed to load profile", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = form.avatar_url;

      // Upload avatar via backend if a new file was selected
      if (avatarFile) {
        setUploadingAvatar(true);
        const fd = new FormData();
        fd.append("file", avatarFile);
        const res = await apiClientCore.request("/api/v1/user/avatar", {
          method: "POST",
          body: fd,
          headers: {},
        });
        avatarUrl = res.avatar_url;
        setUploadingAvatar(false);
      }

      const updated = await authApi.updateProfile({ ...form, avatar_url: avatarUrl });
      setAuth({ ...user, ...updated });
      setForm((f) => ({ ...f, avatar_url: avatarUrl }));
      setAvatarFile(null);
      setAvatarPreview(null);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <PageContainer>
          <div className="max-w-2xl mx-auto animate-pulse space-y-4">
            <div className="h-8 bg-[rgba(90,80,60,0.08)] rounded w-1/3" />
            <div className="h-40 bg-[rgba(90,80,60,0.08)] rounded" />
          </div>
        </PageContainer>
      </div>
    );
  }

  const avatarSrc = avatarPreview || form.avatar_url;
  const avatarInitial = (form.full_name?.[0] || user?.username?.[0] || "U").toUpperCase();

  return (
    <div className="py-8">
      <PageContainer>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="max-w-2xl mx-auto space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#1a1814]">Edit Profile</h1>
              <p className="text-sm text-[#6b6358] mt-1">Update your public profile information</p>
            </div>
            <Link to={`/u/${user?.username}`}>
              <Button variant="secondary" size="sm">View Profile</Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <p className="text-2xl font-bold text-[#1a1814] font-display">{stats.followers_count}</p>
              <p className="text-xs text-[#a09880]">Followers</p>
            </Card>
            <Card>
              <p className="text-2xl font-bold text-[#1a1814] font-display">{stats.following_count}</p>
              <p className="text-xs text-[#a09880]">Following</p>
            </Card>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-5 pb-5 border-b border-[rgba(90,80,60,0.08)]">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="h-16 w-16 rounded-full object-cover shrink-0 ring-2 ring-[rgba(232,93,38,0.2)]" />
                ) : (
                  <div className="avatar h-16 w-16 text-xl shrink-0">{avatarInitial}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1814]">@{user?.username}</p>
                  <p className="text-xs text-[#a09880] mb-2">{user?.email}</p>
                  <label className="btn-secondary text-xs px-3 py-1.5 rounded-lg cursor-pointer inline-block">
                    {uploadingAvatar ? "Uploading…" : "Change photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  {avatarFile && <p className="text-xs text-emerald-600 mt-1">✓ {avatarFile.name} selected</p>}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Full Name</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell the community about yourself" rows={4} className="input-field resize-none" />
                  <p className="text-xs text-[#a09880] mt-1">{form.bio?.length || 0}/500</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Location</label>
                  <input type="text" name="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="City, Country" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a1814] mb-1.5 block">Website</label>
                  <input type="url" name="website" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    placeholder="https://yoursite.com" className="input-field" />
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
                      Saving…
                    </span>
                  ) : "Save Changes"}
                </Button>
                <Link to="/dashboard"><Button variant="ghost" type="button">Cancel</Button></Link>
              </div>
            </form>
          </Card>

          {/* Followers */}
          <Card>
            <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">
              Followers ({stats.followers_count})
            </p>
            {followers.length === 0 ? (
              <p className="text-sm text-[#a09880]">No followers yet.</p>
            ) : (
              <div className="space-y-2">
                {followers.map((u) => (
                  <Link key={u.id} to={`/u/${u.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(90,80,60,0.04)] transition-all">
                    {u.avatar_url
                      ? <img src={u.avatar_url} className="h-8 w-8 rounded-full object-cover" alt={u.username} />
                      : <div className="avatar h-8 w-8 text-xs">{u.username[0].toUpperCase()}</div>
                    }
                    <span className="text-sm font-medium text-[#1a1814] hover:text-[#e85d26]">@{u.username}</span>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Following */}
          <Card>
            <p className="text-xs font-bold uppercase tracking-widest text-[#a09880] mb-3">
              Following ({stats.following_count})
            </p>
            {following.length === 0 ? (
              <p className="text-sm text-[#a09880]">Not following anyone yet.</p>
            ) : (
              <div className="space-y-2">
                {following.map((u) => (
                  <Link key={u.id} to={`/u/${u.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(90,80,60,0.04)] transition-all">
                    {u.avatar_url
                      ? <img src={u.avatar_url} className="h-8 w-8 rounded-full object-cover" alt={u.username} />
                      : <div className="avatar h-8 w-8 text-xs">{u.username[0].toUpperCase()}</div>
                    }
                    <span className="text-sm font-medium text-[#1a1814] hover:text-[#e85d26]">@{u.username}</span>
                  </Link>
                ))}
              </div>
            )}
          </Card>

        </motion.div>
      </PageContainer>
    </div>
  );
}
