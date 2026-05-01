import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';
import { useCategories } from '../contexts/CategoriesContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost, loading } = usePosts();
  const { categories, fetchCategories } = useCategories();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    thumbnail_url: '',
    summary: '',
    is_active: false,
    is_featured: false,
    category_id: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSaveStatus, setShowSaveStatus] = useState(false);
  const fileInputRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  const popularTags = ['javascript', 'react', 'python', 'webdev', 'ai', 'machine-learning', 'tutorial', 'frontend', 'backend', 'devops'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchCategories();
  }, [isAuthenticated, navigate, fetchCategories]);

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(formData.content.length);
  }, [formData.content]);

  useEffect(() => {
    if (formData.thumbnail_url && isValidUrl(formData.thumbnail_url)) {
      setThumbnailPreview(formData.thumbnail_url);
    } else {
      setThumbnailPreview('');
    }
  }, [formData.thumbnail_url]);

  // Auto-save functionality
  useEffect(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Only auto-save if there's content to save
    if (formData.title || formData.content) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDraft();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData.title, formData.content, formData.slug, formData.category_id, formData.tags, formData.thumbnail_url]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blogbyte_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({
          ...prev,
          title: draft.title || '',
          content: draft.content || '',
          slug: draft.slug || '',
          category_id: draft.category_id || '',
          tags: draft.tags || [],
          thumbnail_url: draft.thumbnail_url || '',
          summary: draft.summary || '',
          is_featured: draft.is_featured || false
        }));
        setLastSaved(new Date(draft.savedAt));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    if (formData.thumbnail_url && !isValidUrl(formData.thumbnail_url)) {
      newErrors.thumbnail_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const generatedSlug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      content: value
    }));

    if (errors.content) {
      setErrors(prev => ({
        ...prev,
        content: ''
      }));
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        category_id: parseInt(formData.category_id),
        tags: formData.tags.join(','),
        thumbnail: formData.thumbnail
      };

      await createPost(postData);
      navigate('/blog');
    } catch (error) {
      console.error('Failed to create post:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to create post. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const draft = {
        ...formData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('blogbyte_draft', JSON.stringify(draft));
      setLastSaved(new Date());
      setShowSaveStatus(true);
      setTimeout(() => setShowSaveStatus(false), 2000);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('blogbyte_draft');
    setFormData({
      title: '',
      content: '',
      slug: '',
      thumbnail_url: '',
      summary: '',
      is_active: false,
      is_featured: false,
      category_id: '',
      tags: []
    });
    setLastSaved(null);
  };

  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Post</h1>
              <p className="text-gray-600">Share your thoughts with the community</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 w-full lg:w-auto">
              <div className="text-right sm:text-left">
                <p className="text-sm text-gray-600">Word count: <span className="font-medium text-gray-900">{wordCount}</span></p>
                <p className="text-sm text-gray-600">Characters: <span className="font-medium text-gray-900">{charCount}</span></p>
                {lastSaved && (
                  <p className="text-xs text-gray-500">
                    Saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {showSaveStatus && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Draft saved
                  </span>
                )}
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  {isPreviewMode ? '✏️ Edit' : '👁️ Preview'}
                </button>
                <button
                  onClick={saveDraft}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-300 font-medium disabled:opacity-50 text-sm sm:text-base"
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-8 lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
              {!isPreviewMode ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title */}
                  <div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full text-2xl sm:text-3xl lg:text-4xl font-black bg-transparent border-b-2 outline-none transition-all duration-300 pb-3 ${
                        errors.title ? 'border-red-500' : 'border-transparent hover:border-gray-300 focus:border-blue-500'
                      }`}
                      style={{ color: '#1f2937' }}
                      placeholder="Enter your post title..."
                      disabled={isSubmitting}
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL-friendly)</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-gray-900 outline-none transition-all duration-300 ${
                        errors.slug ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                      }`}
                      style={{ background: '#f9fafb' }}
                      placeholder="your-post-slug"
                      disabled={isSubmitting}
                    />
                    {errors.slug && (
                      <p className="mt-2 text-sm text-red-500">{errors.slug}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className={`w-full sm:w-auto px-4 py-3 rounded-xl border text-gray-900 outline-none transition-all duration-300 ${
                        errors.category_id ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                      }`}
                      disabled={isSubmitting}
                      style={{ background: '#f9fafb' }}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="text-sm text-red-500">{errors.category_id}</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary (Optional)</label>
                    <textarea
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border text-gray-900 outline-none transition-all duration-300 resize-none border-gray-300 hover:border-gray-400 focus:border-blue-500"
                      style={{ background: '#f9fafb' }}
                      placeholder="Brief summary of your post (AI feature)"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleContentChange}
                      rows={12}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 rounded-xl border text-gray-900 outline-none transition-all duration-300 resize-none text-sm sm:text-base ${
                        errors.content ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                      }`}
                      style={{ background: '#f9fafb', minHeight: '300px' }}
                      placeholder="Start writing your post..."
                      disabled={isSubmitting}
                    />
                    {errors.content && (
                      <p className="mt-2 text-sm text-red-500">{errors.content}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Publishing...
                        </span>
                      ) : (
                        '🚀 Publish Post'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/blog')}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-base sm:text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Preview Mode */
                <div className="prose max-w-none">
                  <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formData.title || 'Untitled Post'}
                  </h1>
                  
                  {formData.category_id && (
                    <div className="mb-8">
                      <span className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {categories.find(c => c.id === parseInt(formData.category_id))?.name || 'Uncategorized'}
                      </span>
                    </div>
                  )}

                  <div 
                    className="text-gray-600 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.content ? `<p class="mb-6">${formatContent(formData.content)}</p>` : '<p class="text-gray-400">Start writing to see your preview...</p>' 
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 lg:col-span-5 space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📷 Thumbnail</h3>
              
              <div
                className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {thumbnailPreview ? (
                  <div className="space-y-4">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                        setThumbnailPreview('');
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-900 text-base sm:text-lg font-medium mb-2">Drop image here or click to upload</p>
                      <p className="text-gray-600 text-sm">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm mb-2 text-gray-600">Or enter URL:</label>
                <input
                  type="url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 outline-none transition-all duration-300 ${
                    errors.thumbnail_url ? 'border-red-500' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                  }`}
                  style={{ background: '#f9fafb' }}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.thumbnail_url && (
                  <p className="mt-1 text-sm text-red-500">{errors.thumbnail_url}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🏷️ Tags</h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border text-gray-900 outline-none transition-all duration-300 border-gray-300 hover:border-gray-400 focus:border-blue-500 text-sm sm:text-base"
                  style={{ background: '#f9fafb' }}
                />

                <div>
                  <p className="text-sm mb-2 sm:mb-3 text-gray-600">Popular tags:</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {popularTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Options */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">⚙️ Post Options</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <label htmlFor="is_featured" className="text-sm text-gray-700 leading-tight">
                    Feature this post
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700 leading-tight">
                    Publish immediately (uncheck for draft)
                  </label>
                </div>
              </div>
            </div>

            {/* Draft Management */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📝 Draft Management</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'No draft saved yet'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={saveDraft}
                    disabled={isSaving}
                    className="flex-1 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-300 font-medium disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isSaving ? '💾 Saving...' : '💾 Save Draft'}
                  </button>
                  <button
                    onClick={clearDraft}
                    className="flex-1 px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    🗑️ Clear Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">💡 Writing Tips</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use **bold** for emphasis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use *italics* for quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use `code` for technical terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use #, ##, ### for headings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Keep paragraphs short and readable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
