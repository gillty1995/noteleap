// src/components/NoteCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Edit2, X } from "lucide-react";

export type Note = {
  sessionId: string;
  sessionName: string;
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  keybinding?: string | null;
};

interface NoteCardProps {
  note: Note;
  boundKey?: string;
  isSelected: boolean;
  sessionName: string;
  onSelect: () => void;
  onDeselect: () => void;
  onUpdate: (updated: Note) => void;
  onRemoveKeyBind?: () => void;
}

export default function NoteCard({
  note,
  boundKey,
  isSelected,
  onSelect,
  onDeselect,
  sessionName,
  onUpdate,
  onRemoveKeyBind,
}: NoteCardProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // edit/draft states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [draftTitle, setDraftTitle] = useState(note.title);
  const [draftContent, setDraftContent] = useState(note.content);

  // keep draftTitle in sync if note.title changes externally
  useEffect(() => {
    setDraftTitle(note.title);
  }, [note.title]);

  // autofocus
  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
  }, [editingTitle]);
  useEffect(() => {
    if (editingContent) textareaRef.current?.focus();
  }, [editingContent]);

  // commit
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

  // click/double-click to select/deselect
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) onSelect();
  };
  const handleDouble = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) onDeselect();
  };

  const formatted = new Date(note.createdAt).toLocaleString();

  return (
    <div
      id={`note-${note.id}`}
      onClick={handleClick}
      onDoubleClick={handleDouble}
      className={`
        w-full p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow transition
        ${
          isSelected
            ? "ring-2 ring-green-400 overflow-auto resize-y max-h-[70vh]"
            : "hover:shadow-lg overflow-hidden max-h-42"
        }
      `}
      style={{ cursor: "pointer" }}
    >
      {/* title row */}
      <div className="flex items-center justify-between mb-2">
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
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingTitle(true);
            }}
            className="sharetech text-xl text-gray-700 flex-1 pr-2 select-text"
          >
            {draftTitle}
          </h3>
        )}
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-400 italic">{sessionName} -</span>
          <span className="text-xs text-gray-500">{formatted}</span>
          {boundKey && (
            <div className="relative group inline-flex items-center bg-gray-200 rounded px-1 text-xs">
              <span className="pr-1 pl-1.5 text-gray-700">
                {boundKey.toUpperCase()}
              </span>
              {onRemoveKeyBind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveKeyBind();
                  }}
                  className="opacity-50 group-hover:opacity-100 ml-1 p-0.5 rounded-full text-gray-800 hover:scale-125 cursor-pointer"
                  aria-label="Remove keybind"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* collapse preview */}
      {!isSelected && (
        <p className="text-gray-700 line-clamp-2 mb-2">
          {note.content || "\u00A0"}
        </p>
      )}

      {/* expand content */}
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

          {/* edit icon */}
          {!editingContent && note.content !== "" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingContent(true);
              }}
              className="absolute top-[-10] right-[-5] p-1 text-gray-500 hover:text-gray-800 transition ease-in-out delay-100 cursor-pointer"
              aria-label="Edit content"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>
      )}

      {/* tags */}
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <div
              key={tag}
              className="relative group bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({
                    ...note,
                    tags: note.tags.filter((t) => t !== tag),
                  });
                }}
                className="absolute -top-1 -right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={12} className="text-gray-600 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
