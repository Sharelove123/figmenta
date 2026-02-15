"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Bookmark,
  BookmarkInput,
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from "@/lib/api";
import BookmarkCard from "@/components/BookmarkCard";
import BookmarkForm from "@/components/BookmarkForm";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showWakeUpWarning, setShowWakeUpWarning] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError("");
    setShowWakeUpWarning(false);

    // Set a timer to show warning if request takes too long (Render cold start)
    const timer = setTimeout(() => {
      setShowWakeUpWarning(true);
    }, 2000); // 2 seconds

    try {
      const data = await getBookmarks(activeTag || undefined);
      setBookmarks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookmarks.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setShowWakeUpWarning(false);
    }
  }, [activeTag]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Collect all unique tags from bookmarks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return bookmarks;
    const q = search.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
    );
  }, [bookmarks, search]);

  const handleCreate = async (data: BookmarkInput) => {
    await createBookmark(data);
    setShowForm(false);
    fetchBookmarks();
  };

  const handleUpdate = async (data: BookmarkInput) => {
    if (!editingBookmark) return;
    await updateBookmark(editingBookmark.id, data);
    setEditingBookmark(null);
    fetchBookmarks();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBookmark(id);
      fetchBookmarks();
    } catch (err: any) {
      setError(err.message || "Failed to delete bookmark.");
    }
  };

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              📑 Bookmark Manager
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Organize your web, your way
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <TagFilter tags={allTags} activeTag={activeTag} onTagClick={handleTagClick} />
        )}

        {/* Active filter indicator */}
        {activeTag && (
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
            <span>Filtering by:</span>
            <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-full font-medium">
              #{activeTag}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl animate-in">
            {error}
            <button onClick={fetchBookmarks} className="ml-3 underline font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Slow Loading / Wake Up Warning */}
        {showWakeUpWarning && loading && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl flex items-center gap-3 animate-in">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            <div>
              <p className="font-medium">Waking up the server...</p>
              <p className="text-sm opacity-90 mt-0.5">
                The backend is on a free Render instance. This might take up to 60 seconds. Hang tight! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {search ? "No bookmarks match your search" : activeTag ? "No bookmarks with this tag" : "No bookmarks yet"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {search
                ? "Try a different search term."
                : "Click the Add button to create your first bookmark."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
              {search ? ` matching "${search}"` : ""}
            </p>
            {filtered.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={setEditingBookmark}
                onDelete={handleDelete}
                onTagClick={(tag) => handleTagClick(tag)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showForm && (
        <BookmarkForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Modal */}
      {editingBookmark && (
        <BookmarkForm
          initial={{
            url: editingBookmark.url,
            title: editingBookmark.title,
            description: editingBookmark.description,
            tags: editingBookmark.tags,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setEditingBookmark(null)}
          isEdit
        />
      )}
    </div>
  );
}
