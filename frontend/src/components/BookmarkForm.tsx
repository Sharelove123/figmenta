"use client";

import { useState, useEffect } from "react";
import { BookmarkInput } from "@/lib/api";

interface Props {
    initial?: BookmarkInput & { id?: number };
    onSubmit: (data: BookmarkInput) => Promise<void>;
    onCancel: () => void;
    isEdit?: boolean;
}

function isValidUrl(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

export default function BookmarkForm({ initial, onSubmit, onCancel, isEdit }: Props) {
    const [url, setUrl] = useState(initial?.url || "");
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") || "");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!url.trim()) errs.url = "URL is required.";
        else if (!isValidUrl(url.trim())) errs.url = "Please enter a valid URL (e.g. https://example.com).";
        if (!title.trim()) errs.title = "Title is required.";
        else if (title.length > 200) errs.title = "Title must be at most 200 characters.";
        if (description.length > 500) errs.description = "Description must be at most 500 characters.";
        const tags = tagsInput
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
        if (tags.length > 5) errs.tags = "Maximum 5 tags allowed.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError("");
        const tags = tagsInput
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
        try {
            await onSubmit({ url: url.trim(), title: title.trim(), description: description.trim(), tags });
        } catch (err: any) {
            setApiError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-in">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        {isEdit ? "Edit Bookmark" : "Add New Bookmark"}
                    </h2>

                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.url
                                        ? "border-red-400 dark:border-red-600"
                                        : "border-gray-200 dark:border-gray-600"
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                            />
                            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Awesome Website"
                                maxLength={200}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.title
                                        ? "border-red-400 dark:border-red-600"
                                        : "border-gray-200 dark:border-gray-600"
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            <p className="text-xs text-gray-400 mt-1">{title.length}/200</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A brief description…"
                                maxLength={500}
                                rows={3}
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.description
                                        ? "border-red-400 dark:border-red-600"
                                        : "border-gray-200 dark:border-gray-600"
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none`}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tags <span className="text-xs text-gray-400">(comma separated, max 5)</span>
                            </label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="react, javascript, web"
                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.tags
                                        ? "border-red-400 dark:border-red-600"
                                        : "border-gray-200 dark:border-gray-600"
                                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                            />
                            {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {loading ? "Saving…" : isEdit ? "Update" : "Add Bookmark"}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
