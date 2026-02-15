"use client";

import { useState, useEffect } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
    const [input, setInput] = useState(value);

    useEffect(() => {
        setInput(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(input);
        }, 200);
        return () => clearTimeout(timer);
    }, [input, onChange]);

    return (
        <div className="relative">
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder || "Search bookmarks by title or URL…"}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
            {input && (
                <button
                    onClick={() => {
                        setInput("");
                        onChange("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
