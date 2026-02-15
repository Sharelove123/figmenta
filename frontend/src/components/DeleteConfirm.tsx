"use client";

import { useState } from "react";

interface Props {
    id: number;
    onDelete: (id: number) => void;
}

export default function DeleteConfirm({ id, onDelete }: Props) {
    const [confirming, setConfirming] = useState(false);

    if (!confirming) {
        return (
            <button
                onClick={() => setConfirming(true)}
                className="text-red-500 hover:text-red-700 transition-colors"
            >
                Delete
            </button>
        );
    }

    return (
        <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">Sure?</span>
            <button
                onClick={() => onDelete(id)}
                className="text-red-600 font-medium text-sm hover:text-red-800"
            >
                Yes
            </button>
            <button
                onClick={() => setConfirming(false)}
                className="text-gray-500 text-sm hover:text-gray-700"
            >
                No
            </button>
        </div>
    );
}
