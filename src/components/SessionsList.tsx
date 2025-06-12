// components/SessionsList.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import DeleteModal from "./DeleteModal";
import { Plus, Minus } from "lucide-react"; // or any icons you like

type SessionsListProps = {
  sessions: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onAdd: (name: string) => void;
  onDelete: (i: number) => void;
  onRename: (i: number, newName: string) => void;
};

export default function SessionsList({
  sessions,
  activeIndex,
  onSelect,
  onAdd,
  onDelete,
  onRename,
}: SessionsListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (editingIndex !== null) {
      setDraftName(sessions[editingIndex] || "");
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  const commitRename = () => {
    if (editingIndex !== null) {
      onRename(editingIndex, draftName.trim() || sessions[editingIndex]);
      setEditingIndex(null);
    }
  };

  return (
    <div className="relative p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow space-y-2 mb-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="sharetech text-gray-900 text-xl">Sessions</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              onAdd("New Session");
              setEditingIndex(sessions.length);
            }}
            className="p-1 hover:bg-green-100 rounded text-green-600 hover:text-green-800 cursor-pointer"
            aria-label="Add session"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => {
              if (activeIndex != null) setShowDeleteModal(true);
            }}
            className="p-1 hover:bg-red-100 rounded text-green-600 hover:text-red-600 cursor-pointer"
            aria-label="Delete session"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {sessions.map((s, i) =>
        editingIndex === i ? (
          <input
            key={i}
            ref={inputRef}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") setEditingIndex(null);
            }}
            className="w-full px-3 py-2 border sharetech rounded bg-white text-gray-900"
          />
        ) : (
          <button
            key={i}
            onClick={() => onSelect(i)}
            onDoubleClick={() => setEditingIndex(i)}
            className={`block w-full text-left sharetech px-3 py-2 rounded hover:bg-green-100 transition ${
              i === activeIndex
                ? "bg-green-200 font-bold text-green-800"
                : "text-gray-700"
            }`}
          >
            {s}
          </button>
        )
      )}

      <small className="text-gray-500 block">
        {showDeleteModal
          ? ""
          : activeIndex == null
          ? "select session to delete"
          : "click to switch sessions / double-click to rename"}
      </small>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(activeIndex)}
        itemName={sessions[activeIndex]}
      />
    </div>
  );
}
