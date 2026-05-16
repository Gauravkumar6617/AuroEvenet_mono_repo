import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { apiClientCore } from "../services/api/client";
import { adminQuestionsApi } from "../services/api/adminQuestionsApi";
import { adminCategoriesApi } from "../services/api/adminCategoriesApi";
import { adminTopicsApi } from "../services/api/adminTopicsApi";
import { userApi } from "../services/api/userApi";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function onboardingQuestionPage(value) {
  const parsed = parseInt(value) || 2;
  return Math.min(4, Math.max(2, parsed));
}

const emptyCategoryForm = { name: "", slug: "", is_active: true };
const emptyTopicForm = { name: "", slug: "", category_id: "", is_active: true };

function DangerAction({ item }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const run = async () => {
    if (!confirm(`Run "${item.action}"? This cannot be undone.`)) return;
    setLoading(true);
    setResult("");
    try {
      const res = await apiClientCore.request(item.endpoint, { method: "POST" });
      setResult(res.detail || "Done");
    } catch (e) {
      setResult("Error: " + (e.message || "failed"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/30 p-4">
      <div>
        <p className="font-semibold text-sm text-[#1a1814]">{item.icon} {item.action}</p>
        <p className="text-xs text-[#a09880]">{item.desc}</p>
        {result && <p className="text-xs text-emerald-600 mt-1">{result}</p>}
      </div>
      <Button variant="danger" size="sm" disabled={loading} onClick={run}>
        {loading ? "Running…" : item.action}
      </Button>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [section, setSection] = useState("overview");
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [banModal, setBanModal] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementColor, setAnnouncementColor] = useState("#e85d26");
  const [banner, setBanner] = useState(null);
  const [hardDeleteText, setHardDeleteText] = useState("");

  // Real data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userPreferences, setUserPreferences] = useState([]);
  const [loadingPreferences, setLoadingPreferences] = useState(false);

  // Onboarding
  const [adminCategories, setAdminCategories] = useState([]);
  const [adminTopics, setAdminTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questionTopicId, setQuestionTopicId] = useState("");
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [loadingOnboarding, setLoadingOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [topicForm, setTopicForm] = useState(emptyTopicForm);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionPage, setNewQuestionPage] = useState(2);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionEditText, setQuestionEditText] = useState("");
  const [questionEditPage, setQuestionEditPage] = useState(2);

  // Topic interests
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    apiClientCore
      .request("/api/v1/admin/users/stats", { method: "GET" })
      .then(setStats)
      .catch(() => {});
    apiClientCore
      .request("/api/v1/admin/system/maintenance", { method: "GET" })
      .then((r) => setMaintenance(r.enabled))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (section === "users" && users.length === 0) {
      setLoadingUsers(true);
      apiClientCore
        .request("/api/v1/admin/users", { method: "GET" })
        .then(setUsers)
        .catch(() => {})
        .finally(() => setLoadingUsers(false));
    }
    if (section === "onboarding") {
      loadAdminOnboarding();
    }
    if (section === "interests") {
      userApi
        .getMyInterests()
        .then(setInterests)
        .catch(() => {});
    }
    if (section === "preferences" && userPreferences.length === 0) {
      loadUserPreferences();
    }
  }, [section]);

  const loadUserPreferences = async () => {
    setLoadingPreferences(true);
    try {
      const data = await apiClientCore.request("/api/v1/admin/users/preferences", {
        method: "GET",
      });
      setUserPreferences(data);
    } catch (error) {
      console.error("Unable to load user preferences", error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const loadAdminOnboarding = async () => {
    setLoadingOnboarding(true);
    setOnboardingError("");
    try {
      const [categories, topics] = await Promise.all([
        adminCategoriesApi.listCategories(),
        adminTopicsApi.listTopics(),
      ]);
      setAdminCategories(categories);
      setAdminTopics(topics);
      if (selectedTopic && !topics.some((t) => t.id === selectedTopic.id)) {
        setSelectedTopic(null);
        setQuestionTopicId("");
        setTopicQuestions([]);
      }
    } catch (error) {
      setOnboardingError(
        error?.message || "Unable to load onboarding configuration",
      );
    } finally {
      setLoadingOnboarding(false);
    }
  };

  const loadQuestions = (topicId) => {
    adminQuestionsApi
      .getQuestionsByTopic(topicId)
      .then(setTopicQuestions)
      .catch((error) => {
        setOnboardingError(error?.message || "Unable to load questions.");
      });
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setQuestionTopicId(String(topic.id));
    loadQuestions(topic.id);
  };

  const handleQuestionTopicChange = (topicId) => {
    setQuestionTopicId(topicId);
    const topic = adminTopics.find((t) => t.id === Number(topicId));
    if (topic) {
      handleSelectTopic(topic);
    } else {
      setSelectedTopic(null);
      setTopicQuestions([]);
    }
  };

  const handleCreateQuestion = async () => {
    const topicId = selectedTopic?.id || Number(questionTopicId);
    if (!topicId || !newQuestionText.trim()) return;
    try {
      await adminQuestionsApi.createQuestion({
        topic_id: topicId,
        question: newQuestionText.trim(),
        page: onboardingQuestionPage(newQuestionPage),
      });
      setNewQuestionText("");
      const topic = adminTopics.find((t) => t.id === topicId);
      if (topic && !selectedTopic) setSelectedTopic(topic);
      loadQuestions(topicId);
    } catch (error) {
      setOnboardingError(error?.message || "Unable to create question.");
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm("Delete this question?")) return;
    try {
      await adminQuestionsApi.deleteQuestion(qId);
      loadQuestions(selectedTopic.id);
    } catch (error) {
      setOnboardingError(error?.message || "Unable to delete question.");
    }
  };

  const handleCategoryNameChange = (name) => {
    setCategoryForm((prev) => ({
      ...prev,
      name,
      slug: editingCategoryId ? prev.slug : slugify(name),
    }));
  };

  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  };

  const handleSubmitCategory = async () => {
    if (!categoryForm.name.trim() || !categoryForm.slug.trim()) return;
    setOnboardingError("");
    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      is_active: Boolean(categoryForm.is_active),
    };
    try {
      if (editingCategoryId) {
        await adminCategoriesApi.updateCategory(editingCategoryId, payload);
      } else {
        await adminCategoriesApi.createCategory(payload);
      }
      resetCategoryForm();
      await loadAdminOnboarding();
    } catch (error) {
      setOnboardingError(error?.message || "Unable to save category.");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      is_active: category.is_active,
    });
  };

  const handleDeleteCategory = async (category) => {
    if (
      !confirm(
        `Delete category "${category.name}"? Topics under it may no longer appear in onboarding.`,
      )
    )
      return;
    try {
      await adminCategoriesApi.deleteCategory(category.id);
      if (editingCategoryId === category.id) resetCategoryForm();
      await loadAdminOnboarding();
    } catch (error) {
      setOnboardingError(error?.message || "Unable to delete category.");
    }
  };

  const handleTopicNameChange = (name) => {
    setTopicForm((prev) => ({
      ...prev,
      name,
      slug: editingTopicId ? prev.slug : slugify(name),
    }));
  };

  const resetTopicForm = () => {
    setEditingTopicId(null);
    setTopicForm(emptyTopicForm);
  };

  const handleSubmitTopic = async () => {
    if (
      !topicForm.name.trim() ||
      !topicForm.slug.trim() ||
      !topicForm.category_id
    )
      return;
    setOnboardingError("");
    const payload = {
      name: topicForm.name.trim(),
      slug: topicForm.slug.trim(),
      category_id: Number(topicForm.category_id),
      is_active: Boolean(topicForm.is_active),
    };
    try {
      if (editingTopicId) {
        const updated = await adminTopicsApi.updateTopic(
          editingTopicId,
          payload,
        );
        if (selectedTopic?.id === editingTopicId) {
          setSelectedTopic(updated);
          setQuestionTopicId(String(updated.id));
        }
      } else {
        const created = await adminTopicsApi.createTopic(payload);
        setSelectedTopic(created);
        setQuestionTopicId(String(created.id));
        setTopicQuestions([]);
      }
      resetTopicForm();
      await loadAdminOnboarding();
    } catch (error) {
      setOnboardingError(error?.message || "Unable to save topic.");
    }
  };

  const handleEditTopic = (topic) => {
    setEditingTopicId(topic.id);
    setTopicForm({
      name: topic.name,
      slug: topic.slug,
      category_id: String(topic.category_id),
      is_active: topic.is_active,
    });
  };

  const handleDeleteTopic = async (topic) => {
    if (
      !confirm(
        `Delete topic "${topic.name}"? Its questions will stop appearing in onboarding.`,
      )
    )
      return;
    try {
      await adminTopicsApi.deleteTopic(topic.id);
      if (selectedTopic?.id === topic.id) {
        setSelectedTopic(null);
        setQuestionTopicId("");
        setTopicQuestions([]);
      }
      if (editingTopicId === topic.id) resetTopicForm();
      await loadAdminOnboarding();
    } catch (error) {
      setOnboardingError(error?.message || "Unable to delete topic.");
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setQuestionEditText(question.question);
    setQuestionEditPage(question.page || 2);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestionId || !questionEditText.trim()) return;
    try {
      await adminQuestionsApi.updateQuestion(editingQuestionId, {
        question: questionEditText.trim(),
        page: onboardingQuestionPage(questionEditPage),
      });
      setEditingQuestionId(null);
      setQuestionEditText("");
      loadQuestions(selectedTopic.id);
    } catch (error) {
      setOnboardingError(error?.message || "Unable to update question.");
    }
  };

  const topicsByCategory = adminCategories.map((category) => ({
    ...category,
    topics: adminTopics.filter((topic) => topic.category_id === category.id),
  }));

  const handleRoleSave = async () => {
    if (!roleModal || !selectedRole) return;
    await apiClientCore
      .request(`/api/v1/admin/users/${roleModal.id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: selectedRole }),
      })
      .catch(() => {});
    setUsers((prev) =>
      prev.map((u) =>
        u.id === roleModal.id ? { ...u, role: selectedRole } : u,
      ),
    );
    setRoleModal(null);
  };

  const handleBan = async (userId, reason) => {
    await apiClientCore
      .request(`/api/v1/admin/users/${userId}/ban`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
      })
      .catch(() => {});
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: false } : u)),
    );
    setBanModal(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const navItems = [
    { key: "overview", label: "Platform Overview", icon: "📊" },
    { key: "users", label: "All Users", icon: "👥" },
    { key: "preferences", label: "User Preferences", icon: "🎯" },
    { key: "onboarding", label: "Onboarding Config", icon: "🚀" },
    { key: "config", label: "Site Config", icon: "⚙️" },
    { key: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="py-8">
      {banner && (
        <div
          style={{ background: announcementColor }}
          className="fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-6 py-2.5 text-white text-sm font-medium shadow-lg"
        >
          <span>{banner}</span>
          <button
            onClick={() => setBanner(null)}
            className="text-white/70 hover:text-white ml-4"
          >
            ✕
          </button>
        </div>
      )}
      <PageContainer>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge tone="danger">Super Admin</Badge>
              <Badge tone="brand">Platform-wide access</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-[#1a1814]">
              Super Admin Console
            </h1>
          </div>
          {maintenance && (
            <Badge tone="warning" dot>
              🔧 Maintenance Mode ON
            </Badge>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <aside className="surface h-fit p-3 rounded-2xl">
            <p className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-[#a09880] mb-1">
              Super Admin
            </p>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`sidebar-item ${section === item.key ? "active" : ""} ${item.key === "danger" ? "text-red-600 hover:bg-red-50" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </aside>

          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 min-w-0"
            >
              {/* OVERVIEW */}
              {section === "overview" && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        label: "Total users",
                        value: stats?.total_users ?? "—",
                        icon: "👥",
                        color: "text-blue-600 bg-blue-50",
                      },
                      {
                        label: "Total posts",
                        value: stats?.total_posts ?? "—",
                        icon: "📝",
                        color: "text-emerald-600 bg-emerald-50",
                      },
                      {
                        label: "Total comments",
                        value: stats?.total_comments ?? "—",
                        icon: "💬",
                        color: "text-purple-600 bg-purple-50",
                      },
                      {
                        label: "Communities",
                        value: stats?.total_communities ?? "—",
                        icon: "🌐",
                        color: "text-amber-600 bg-amber-50",
                      },
                    ].map((s) => (
                      <div key={s.label} className="surface rounded-2xl p-4">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg mb-3 ${s.color}`}
                        >
                          {s.icon}
                        </div>
                        <p className="font-display text-2xl font-bold text-[#1a1814]">
                          {s.value}
                        </p>
                        <p className="text-xs text-[#6b6358] mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ALL USERS */}
              {section === "users" && (
                <div className="surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h2 className="font-display text-xl font-bold text-[#1a1814]">
                      All Users
                    </h2>
                    <input
                      className="input-field w-56 text-sm"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                  {loadingUsers ? (
                    <p className="text-sm text-[#a09880]">Loading…</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead>
                          <tr className="border-b border-[rgba(90,80,60,0.1)]">
                            {[
                              "User",
                              "Role",
                              "Status",
                              "Posts",
                              "Comments",
                              "Joined",
                              "Actions",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#a09880]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr
                              key={u.id}
                              className="border-b border-[rgba(90,80,60,0.05)] hover:bg-[rgba(90,80,60,0.02)] transition-colors"
                            >
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="avatar h-7 w-7 text-xs">
                                    {(u.username || "U")[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#1a1814]">
                                      @{u.username}
                                    </p>
                                    <p className="text-xs text-[#a09880]">
                                      {u.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <Badge
                                  tone={
                                    u.role === "super_admin"
                                      ? "danger"
                                      : u.role === "admin"
                                        ? "warning"
                                        : "neutral"
                                  }
                                >
                                  {u.role}
                                </Badge>
                              </td>
                              <td className="py-3 px-3">
                                <Badge
                                  tone={u.is_active ? "success" : "danger"}
                                  dot
                                >
                                  {u.is_active ? "active" : "banned"}
                                </Badge>
                              </td>
                              <td className="py-3 px-3 text-[#6b6358]">
                                {u.stats?.post_count ?? 0}
                              </td>
                              <td className="py-3 px-3 text-[#6b6358]">
                                {u.stats?.comment_count ?? 0}
                              </td>
                              <td className="py-3 px-3 text-xs text-[#a09880]">
                                {u.created_at
                                  ? new Date(u.created_at).toLocaleDateString()
                                  : "—"}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex gap-1 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs px-2"
                                    onClick={() => {
                                      setRoleModal(u);
                                      setSelectedRole(u.role);
                                    }}
                                  >
                                    Role
                                  </Button>
                                  {u.is_active && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs px-2 text-red-600"
                                      onClick={() => setBanModal(u)}
                                    >
                                      Ban
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs px-2"
                                    onClick={() => setSection("preferences")}
                                  >
                                    Preferences
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* USER PREFERENCES */}
              {section === "preferences" && (
                <div className="surface rounded-2xl p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#1a1814]">
                        User Preferences
                      </h2>
                      <p className="text-sm text-[#6b6358]">
                        Selected topics, onboarding answers, and learned interest scores.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={loadUserPreferences}
                      disabled={loadingPreferences}
                    >
                      {loadingPreferences ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>

                  {loadingPreferences ? (
                    <p className="text-sm text-[#a09880]">Loading preferences...</p>
                  ) : userPreferences.length === 0 ? (
                    <div className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-[#faf9f7] p-5 text-sm text-[#6b6358]">
                      No user preferences have been saved yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userPreferences.map((entry) => (
                        <div
                          key={entry.user.id}
                          className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-white p-4"
                        >
                          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="avatar h-8 w-8 text-xs">
                                {(entry.user.username || "U")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-[#1a1814]">
                                  @{entry.user.username}
                                </p>
                                <p className="text-xs text-[#a09880]">
                                  {entry.user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge tone="brand">{entry.summary.topic_count} topics</Badge>
                              <Badge tone="info">{entry.summary.answer_count} answers</Badge>
                              <Badge tone="success">{entry.summary.interest_count} interests</Badge>
                            </div>
                          </div>

                          <div className="grid gap-4 xl:grid-cols-3">
                            <div>
                              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#a09880]">
                                Selected Topics
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {entry.selected_topics.length > 0 ? (
                                  entry.selected_topics.map((topic) => (
                                    <span key={topic.id} className="tag-pill">
                                      {topic.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-[#a09880]">No topics selected</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#a09880]">
                                Learned Interests
                              </p>
                              <div className="space-y-1.5">
                                {entry.interests.length > 0 ? (
                                  entry.interests.slice(0, 5).map((interest) => (
                                    <div key={interest.name} className="flex items-center justify-between gap-2 text-xs">
                                      <span className="text-[#6b6358]">{interest.name}</span>
                                      <span className="font-semibold text-[#1a1814]">{interest.score}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-[#a09880]">No reading signals yet</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#a09880]">
                                Onboarding Answers
                              </p>
                              <div className="space-y-2">
                                {entry.answers.length > 0 ? (
                                  entry.answers.slice(0, 3).map((answer) => (
                                    <div key={answer.id} className="rounded-lg bg-[#faf9f7] p-2">
                                      <p className="line-clamp-1 text-xs font-medium text-[#1a1814]">
                                        {answer.question || answer.topic || "Preference"}
                                      </p>
                                      <p className="line-clamp-2 text-xs text-[#6b6358]">
                                        {answer.answer}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-[#a09880]">No answers saved</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ONBOARDING CONFIG */}
              {section === "onboarding" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-[#1a1814]">
                          Onboarding Configuration
                        </h2>
                        <p className="text-sm text-[#6b6358]">
                          Create categories, topics, and questions used by the
                          onboarding flow.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={loadAdminOnboarding}
                        disabled={loadingOnboarding}
                      >
                        {loadingOnboarding ? "Refreshing..." : "Refresh"}
                      </Button>
                    </div>
                    {onboardingError && (
                      <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {onboardingError}
                      </div>
                    )}

                    <div className="grid gap-5 xl:grid-cols-2">
                      <div className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-[#faf9f7] p-4">
                        <h3 className="font-semibold text-sm text-[#1a1814] mb-3">
                          {editingCategoryId ? "Edit Category" : "Add Category"}
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            className="input-field text-sm"
                            placeholder="Category name"
                            value={categoryForm.name}
                            onChange={(e) =>
                              handleCategoryNameChange(e.target.value)
                            }
                          />
                          <input
                            className="input-field text-sm"
                            placeholder="category-slug"
                            value={categoryForm.slug}
                            onChange={(e) =>
                              setCategoryForm((prev) => ({
                                ...prev,
                                slug: slugify(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <label className="mt-3 flex items-center gap-2 text-sm text-[#6b6358]">
                          <input
                            type="checkbox"
                            checked={categoryForm.is_active}
                            onChange={(e) =>
                              setCategoryForm((prev) => ({
                                ...prev,
                                is_active: e.target.checked,
                              }))
                            }
                          />
                          Active in onboarding
                        </label>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSubmitCategory}
                            disabled={
                              !categoryForm.name.trim() ||
                              !categoryForm.slug.trim()
                            }
                          >
                            {editingCategoryId
                              ? "Save Category"
                              : "Create Category"}
                          </Button>
                          {editingCategoryId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={resetCategoryForm}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-[#faf9f7] p-4">
                        <h3 className="font-semibold text-sm text-[#1a1814] mb-3">
                          {editingTopicId ? "Edit Topic" : "Add Topic"}
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            className="input-field text-sm"
                            placeholder="Topic name"
                            value={topicForm.name}
                            onChange={(e) =>
                              handleTopicNameChange(e.target.value)
                            }
                          />
                          <input
                            className="input-field text-sm"
                            placeholder="topic-slug"
                            value={topicForm.slug}
                            onChange={(e) =>
                              setTopicForm((prev) => ({
                                ...prev,
                                slug: slugify(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                          <select
                            className="input-field text-sm"
                            value={topicForm.category_id}
                            onChange={(e) =>
                              setTopicForm((prev) => ({
                                ...prev,
                                category_id: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select category</option>
                            {adminCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 rounded-xl border border-[rgba(90,80,60,0.1)] bg-white px-3 text-sm text-[#6b6358]">
                            <input
                              type="checkbox"
                              checked={topicForm.is_active}
                              onChange={(e) =>
                                setTopicForm((prev) => ({
                                  ...prev,
                                  is_active: e.target.checked,
                                }))
                              }
                            />
                            Active
                          </label>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSubmitTopic}
                            disabled={
                              !topicForm.name.trim() ||
                              !topicForm.slug.trim() ||
                              !topicForm.category_id
                            }
                          >
                            {editingTopicId ? "Save Topic" : "Create Topic"}
                          </Button>
                          {editingTopicId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={resetTopicForm}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,0.9fr)_1fr] gap-5">
                    <div className="surface rounded-2xl p-5">
                      <h3 className="font-display text-lg font-bold text-[#1a1814] mb-4">
                        Categories & Topics
                      </h3>
                      {loadingOnboarding ? (
                        <p className="text-sm text-[#a09880]">
                          Loading onboarding records...
                        </p>
                      ) : topicsByCategory.length === 0 ? (
                        <p className="text-sm text-[#a09880]">
                          No categories yet.
                        </p>
                      ) : (
                        <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                          {topicsByCategory.map((category) => (
                            <div
                              key={category.id}
                              className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-white p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-sm text-[#1a1814]">
                                      {category.name}
                                    </p>
                                    <Badge
                                      tone={
                                        category.is_active
                                          ? "success"
                                          : "neutral"
                                      }
                                      dot
                                    >
                                      {category.is_active
                                        ? "active"
                                        : "inactive"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-[#a09880] break-all">
                                    {category.slug}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="px-2"
                                    onClick={() => handleEditCategory(category)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="px-2 text-red-600"
                                    onClick={() =>
                                      handleDeleteCategory(category)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-3 space-y-1">
                                {category.topics.length === 0 ? (
                                  <p className="text-xs text-[#a09880]">
                                    No topics in this category.
                                  </p>
                                ) : (
                                  category.topics.map((topic) => (
                                    <div
                                      key={topic.id}
                                      className={`flex items-center justify-between gap-2 rounded-lg px-2 py-2 ${selectedTopic?.id === topic.id ? "bg-[#fdf0ea]" : "hover:bg-[rgba(90,80,60,0.04)]"}`}
                                    >
                                      <button
                                        onClick={() => handleSelectTopic(topic)}
                                        className="min-w-0 flex-1 text-left"
                                      >
                                        <span className="block truncate text-sm font-medium text-[#1a1814]">
                                          {topic.name}
                                        </span>
                                        <span className="block truncate text-xs text-[#a09880]">
                                          {topic.slug}
                                        </span>
                                      </button>
                                      <Badge
                                        tone={
                                          topic.is_active ? "info" : "neutral"
                                        }
                                      >
                                        {topic.is_active
                                          ? "active"
                                          : "inactive"}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="px-2"
                                        onClick={() => handleEditTopic(topic)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="px-2 text-red-600"
                                        onClick={() => handleDeleteTopic(topic)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="surface rounded-2xl p-5">
                      <h3 className="font-display text-lg font-bold text-[#1a1814] mb-1">
                        {selectedTopic
                          ? `Questions for "${selectedTopic.name}"`
                          : "Questions"}
                      </h3>
                      <p className="text-sm text-[#6b6358] mb-4">
                        Choose a topic here, then add the prompts that should
                        appear in the onboarding popup.
                      </p>
                      <div className="mb-4">
                        <select
                          className="input-field text-sm"
                          value={questionTopicId}
                          onChange={(e) =>
                            handleQuestionTopicChange(e.target.value)
                          }
                        >
                          <option value="">Select topic for questions</option>
                          {adminCategories.map((category) => (
                            <optgroup key={category.id} label={category.name}>
                              {adminTopics
                                .filter(
                                  (topic) => topic.category_id === category.id,
                                )
                                .map((topic) => (
                                  <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                  </option>
                                ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      {selectedTopic ? (
                        <div className="space-y-3 mb-6 max-h-[360px] overflow-y-auto pr-1">
                          {topicQuestions.length === 0 ? (
                            <p className="text-sm text-[#a09880]">
                              No questions added yet for this topic.
                            </p>
                          ) : (
                            topicQuestions.map((q) => (
                              <div
                                key={q.id}
                                className="rounded-xl border border-[rgba(90,80,60,0.08)] bg-white p-3"
                              >
                                {editingQuestionId === q.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      className="input-field min-h-[70px] text-sm"
                                      value={questionEditText}
                                      onChange={(e) =>
                                        setQuestionEditText(e.target.value)
                                      }
                                    />
                                    <div className="flex flex-wrap gap-2">
                                      <input
                                        type="number"
                                        className="input-field w-24 text-sm"
                                        min="2"
                                        max="4"
                                        value={questionEditPage}
                                        onChange={(e) =>
                                          setQuestionEditPage(e.target.value)
                                        }
                                      />
                                      <Button
                                        size="sm"
                                        onClick={handleUpdateQuestion}
                                        disabled={!questionEditText.trim()}
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          setEditingQuestionId(null)
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm text-[#1a1814] mb-1 leading-snug">
                                        {q.question}
                                      </p>
                                      <p className="text-xs text-[#a09880]">
                                        Page {q.page || 2}
                                      </p>
                                    </div>
                                    <div className="flex shrink-0 gap-1 self-start">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="px-2"
                                        onClick={() => handleEditQuestion(q)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="px-2 text-red-600"
                                        onClick={() =>
                                          handleDeleteQuestion(q.id)
                                        }
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="mb-6 rounded-xl border border-[rgba(90,80,60,0.08)] bg-[#faf9f7] px-4 py-5 text-sm text-[#a09880]">
                          Select an existing topic above, or create a new topic
                          first. After that this panel will save questions
                          directly to that topic.
                        </div>
                      )}

                      <div className="border-t border-[rgba(90,80,60,0.08)] pt-4">
                        <h4 className="text-sm font-semibold text-[#1a1814] mb-2">
                          Add Question
                        </h4>
                        <div className="space-y-2">
                          <textarea
                            className="input-field min-h-[76px] text-sm"
                            placeholder="e.g. What do you want to learn about this topic?"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              className="input-field w-24 text-sm"
                              placeholder="Page"
                              min="2"
                              max="4"
                              value={newQuestionPage}
                              onChange={(e) =>
                                setNewQuestionPage(e.target.value)
                              }
                            />
                            <Button
                              onClick={handleCreateQuestion}
                              disabled={
                                !questionTopicId || !newQuestionText.trim()
                              }
                              className="flex-1"
                            >
                              Add Question
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SITE CONFIG */}
              {section === "config" && (
                <div className="space-y-4">
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">
                      Announcement Banner
                    </h3>
                    <div className="space-y-3">
                      <input
                        className="input-field"
                        placeholder="Banner message..."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                      />
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-[#6b6358]">Color:</label>
                        {["#e85d26", "#2563eb", "#16a34a", "#d97706"].map(
                          (c) => (
                            <button
                              key={c}
                              onClick={() => setAnnouncementColor(c)}
                              style={{ background: c }}
                              className={`h-6 w-6 rounded-full border-2 transition-all ${announcementColor === c ? "border-[#1a1814] scale-110" : "border-transparent"}`}
                            />
                          ),
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setBanner(announcementText)}
                        disabled={!announcementText}
                      >
                        Publish banner
                      </Button>
                    </div>
                  </div>
                  <div className="surface rounded-2xl p-5">
                    <h3 className="font-display text-lg font-bold text-[#1a1814] mb-3">
                      Maintenance Mode
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#1a1814]">
                          Restrict access to non-admin users
                        </p>
                        <p className="text-xs text-[#a09880]">
                          Shows maintenance page to regular users
                        </p>
                      </div>
                      <Button
                        variant={maintenance ? "danger" : "secondary"}
                        size="sm"
                        disabled={maintenanceLoading}
                        onClick={async () => {
                          setMaintenanceLoading(true);
                          const next = !maintenance;
                          await apiClientCore.request("/api/v1/admin/system/maintenance", {
                            method: "POST",
                            body: JSON.stringify({ enabled: next }),
                          }).catch(() => {});
                          setMaintenance(next);
                          setMaintenanceLoading(false);
                        }}
                      >
                        {maintenanceLoading ? "…" : maintenance ? "Disable" : "Enable"} maintenance
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* DANGER ZONE */}
              {section === "danger" && (
                <div className="surface rounded-2xl border-2 border-red-200 p-5">
                  <h2 className="font-display text-xl font-bold text-red-700 mb-4">
                    ⚠️ Danger Zone
                  </h2>
                  <p className="text-sm text-[#6b6358] mb-5">
                    All actions here are irreversible. Proceed with extreme
                    caution.
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Flush Cache",
                        desc: "Clears all cached data — may cause brief slowdowns",
                        icon: "🗑️",
                        endpoint: "/api/v1/admin/system/cache/flush",
                      },
                      {
                        action: "Reset All Sessions",
                        desc: "Force logout all users platform-wide",
                        icon: "🔓",
                        endpoint: "/api/v1/admin/system/sessions/reset",
                      },
                      {
                        action: "Run DB Cleanup",
                        desc: "Remove soft-deleted content and orphaned records",
                        icon: "🧹",
                        endpoint: "/api/v1/admin/system/db/cleanup",
                      },
                    ].map((item) => (
                      <DangerAction key={item.action} item={item} />)
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </PageContainer>

      {/* Ban modal */}
      {banModal && (
        <div className="modal-overlay" onClick={() => setBanModal(null)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="surface rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-1">
              Ban @{banModal.username}
            </h3>
            <p className="text-sm text-[#6b6358] mb-4">
              This deactivates the user's account immediately.
            </p>
            <textarea
              id="ban-reason"
              className="input-field min-h-20 resize-none w-full"
              placeholder="Reason for ban..."
            />
            <div className="flex gap-3 mt-4">
              <Button
                variant="danger"
                className="flex-1"
                onClick={() =>
                  handleBan(
                    banModal.id,
                    document.getElementById("ban-reason").value,
                  )
                }
              >
                Confirm ban
              </Button>
              <Button variant="secondary" onClick={() => setBanModal(null)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Role modal */}
      {roleModal && (
        <div className="modal-overlay" onClick={() => setRoleModal(null)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="surface rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold text-[#1a1814] mb-4">
              Change role: @{roleModal?.username}
            </h3>
            <div className="space-y-2">
              {["user", "admin", "super_admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] p-3 text-left transition-all ${selectedRole === r ? "border-[#e85d26] bg-[#fdf0ea]" : "border-[rgba(90,80,60,0.12)] hover:border-[rgba(232,93,38,0.3)]"}`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${selectedRole === r ? "border-[#e85d26] bg-[#e85d26]" : "border-[rgba(90,80,60,0.25)]"}`}
                  />
                  <span className="text-sm font-medium capitalize text-[#1a1814]">
                    {r.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1" onClick={handleRoleSave}>
                Save role
              </Button>
              <Button variant="secondary" onClick={() => setRoleModal(null)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
