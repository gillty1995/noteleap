// src/components/NoteCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Edit2, X } from "lucide-react";

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
};

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onUpdate: (updated: Note) => void;
  awaitingKeyBind: boolean;
  onFinishKeyBind: (id: string, key: string) => void;
}

export default function NoteCard({
  note,
  isSelected,
  onSelect,
  onDeselect,
  onUpdate,
  awaitingKeyBind,
  onFinishKeyBind,
}: NoteCardProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // edit states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [draftTitle, setDraftTitle] = useState(note.title);
  const [draftContent, setDraftContent] = useState(note.content);

  // autofocus
  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
  }, [editingTitle]);
  useEffect(() => {
    if (editingContent) textareaRef.current?.focus();
  }, [editingContent]);

  // commit handlers
  const commitTitle = () => {
    setEditingTitle(false);
    const t = draftTitle.trim();
    if (t && t !== note.title) onUpdate({ ...note, title: t });
  };
  const commitContent = () => {
    setEditingContent(false);
    if (draftContent !== note.content)
      onUpdate({ ...note, content: draftContent });
  };

  // click handlers
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) onSelect();
  };
  const handleCardDouble = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) onDeselect();
  };
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    if (awaitingKeyBind) {
      const key = prompt("Press a key now:") || "";
      if (key) onFinishKeyBind(note.id, key);
    }
  };
  const handleTitleDouble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitle(true);
  };

  // format createdAt
  const formatted = new Date(note.createdAt).toLocaleString();

  return (
    <div
      id={`note-${note.id}`}
      onClick={handleCardClick}
      onDoubleClick={handleCardDouble}
      className={`
        w-full p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow transition
        ${
          isSelected
            ? "ring-2 ring-green-400 overflow-auto resize-y max-h-[70vh]"
            : "hover:shadow-lg overflow-hidden max-h-32"
        }
      `}
      style={{ cursor: "pointer" }}
    >
      {/* TITLE ROW */}
      <div className="flex justify-between items-start mb-2">
        {editingTitle ? (
          <input
            ref={titleRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => e.key === "Enter" && commitTitle()}
            className="sharetech text-xl text-gray-700 flex-1 pr-2 border-b border-gray-300 focus:outline-none"
          />
        ) : (
          <h3
            onClick={handleTitleClick}
            onDoubleClick={handleTitleDouble}
            className="sharetech text-xl text-gray-700 flex-1 pr-2 select-text"
          >
            {note.title}
          </h3>
        )}
        <span className="text-xs text-gray-500 ml-2">{formatted}</span>
      </div>

      {/* COLLAPSED PREVIEW */}
      {!isSelected && (
        <p className="text-gray-700 line-clamp-2 mb-2">
          {note.content || "\u00A0"}
        </p>
      )}

      {/* EXPANDED CONTENT */}
      {isSelected && (
        <div className="relative mb-2 w-full min-h-[6rem]">
          {editingContent || note.content === "" ? (
            <textarea
              ref={textareaRef}
              placeholder="Write your note here…"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              onBlur={commitContent}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) commitContent();
              }}
              rows={4}
              className="
                w-full pl-2 pr-12 p-2
                border border-gray-200 rounded resize-y
                focus:outline-none text-gray-700 whitespace-pre-wrap
              "
            />
          ) : (
            <p className="text-gray-700 w-full pr-12 min-h-[6rem] whitespace-pre-wrap">
              {note.content}
            </p>
          )}
          {!editingContent && note.content !== "" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingContent(true);
              }}
              className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800 cursor-pointer"
              aria-label="Edit content"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>
      )}

      {/* TAGS */}
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <div
              key={tag}
              className="relative group flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
              {/* X button, only visible on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({
                    ...note,
                    tags: note.tags.filter((t) => t !== tag),
                  });
                }}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition"
                aria-label={`Remove tag ${tag}`}
              >
                <X
                  size={12}
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
