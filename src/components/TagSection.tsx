// src/components/TagSection.tsx
"use client";

import { useState, useEffect } from "react";

interface TagSectionProps {
  onFilterTags?: (tags: string[]) => void;
}

export default function TagSection({ onFilterTags }: TagSectionProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      fetch("/api/tags", { credentials: "include" })
        .then((r) => r.json())
        .then((data: string[]) => setTags(data))
        .catch(console.error);
    };
    load();
    window.addEventListener("tags-updated", load);
    return () => window.removeEventListener("tags-updated", load);
  }, []);

  const toggle = (tag: string) => {
    let next: string[];
    if (activeTags.includes(tag)) {
      next = activeTags.filter((t) => t !== tag);
    } else {
      next = [...activeTags, tag];
    }
    setActiveTags(next);
    onFilterTags?.(next);
  };

  return (
    <div className="p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow space-x-2 space-y-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={`px-3 py-1 rounded-full text-sm transition ${
            activeTags.includes(tag)
              ? "bg-green-600 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          {tag}
        </button>
      ))}
      <small className="block text-gray-500 mt-2">
        Click to filter by tag{activeTags.length > 1 ? "s" : ""}
      </small>
    </div>
  );
}
