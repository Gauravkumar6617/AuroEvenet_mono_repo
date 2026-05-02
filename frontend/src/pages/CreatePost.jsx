import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useCategories } from "../contexts/CategoriesContext";
import { useAuth } from "../contexts/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Tabs from "../components/ui/Tabs";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const { categories, fetchCategories } = useCategories();
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("Discussion");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category_id: "",
    tags: "",
    thumbnail: null,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    fetchCategories();
  }, [isAuthenticated, navigate, fetchCategories]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 180)), [form.content]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.thumbnail) return;
    setSaving(true);
    try {
      await createPost({
        title: form.title,
        content: form.content,
        category_id: Number(form.category_id),
        tags: form.tags,
        thumbnail: form.thumbnail,
      });
      navigate("/blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10">
      <PageContainer>
        <SectionHeader
          eyebrow="Create Post"
          title="Publish questions, discussions, and long-form articles"
          description="Use the composer to create high-quality knowledge posts with clear context and metadata."
          action={<Badge tone="brand">{readingTime} min read estimate</Badge>}
        />
        <div className="mb-5">
          <Tabs items={["Question", "Discussion", "Article"]} active={mode} onChange={setMode} />
        </div>
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <div className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Body</span>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input-field min-h-72 resize-y"
                  placeholder={`Write your ${mode.toLowerCase()}...`}
                  required
                />
              </label>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Category</span>
                <select
                  className="input-field"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Thumbnail Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field py-2"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      thumbnail: e.target.files && e.target.files.length > 0 ? e.target.files[0] : null,
                    })
                  }
                  required
                />
              </label>
            </Card>
            <Card>
              <p className="text-sm text-slate-600">Publishing as {mode}. Make sure title and tags clearly reflect intent.</p>
              <div className="mt-4 flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Publishing..." : "Publish"}
                </Button>
                <Button variant="secondary" type="button" onClick={() => navigate("/blog")}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
