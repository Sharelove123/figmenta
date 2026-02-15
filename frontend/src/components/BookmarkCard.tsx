"use client";

import { Bookmark } from "@/lib/api";

interface Props {
    bookmark: Bookmark;
    onEdit: (bookmark: Bookmark) => void;
    onDelete: (id: number) => void;
    onTagClick: (tag: string) => void;
}

export default function BookmarkCard({ bookmark, onEdit, onDelete, onTagClick }: Props) {
    const formattedDate = new Date(bookmark.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const handleDelete = () => {
        if (window.confirm(`Delete "${bookmark.title}"? This action cannot be undone.`)) {
            onDelete(bookmark.id);
        }
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {bookmark.title}
                    </h3>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 truncate block mt-0.5 hover:underline"
                    >
                        {bookmark.url}
                    </a>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        onClick={() => onEdit(bookmark)}
                        className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {bookmark.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {bookmark.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap gap-1.5">
                    {bookmark.tags?.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => onTagClick(tag)}
                            className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                    {formattedDate}
                </span>
            </div>
        </div>
    );
}
