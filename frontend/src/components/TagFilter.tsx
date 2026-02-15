"use client";

interface Props {
    tags: string[];
    activeTag: string | null;
    onTagClick: (tag: string | null) => void;
}

export default function TagFilter({ tags, activeTag, onTagClick }: Props) {
    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">
                Filter by tag:
            </span>
            {activeTag && (
                <button
                    onClick={() => onTagClick(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                >
                    Clear filter ✕
                </button>
            )}
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onTagClick(activeTag === tag ? null : tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${activeTag === tag
                            ? "bg-indigo-600 text-white shadow-md scale-105"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300"
                        }`}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
}
