// src/components/HeaderSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Tag, Keyboard } from "lucide-react";
import NoteCard, { Note } from "./NoteCard";
import DeleteModal from "./DeleteModal";

interface HeaderSectionProps {
  sessionId?: string;
  sessionName: string;
}

export default function HeaderSection({
  sessionId,
  sessionName,
}: HeaderSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [awaitingKeyBind, setAwaitingKeyBind] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // sort helper
  const sortByDateDesc = (arr: Note[]) =>
    arr
      .slice()
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  // load & sort notes
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/notes?sessionId=${sessionId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: Note[]) => {
        const sorted = sortByDateDesc(data);
        setNotes(sorted);
        setSelectedId(sorted[0]?.id ?? null);
      })
      .catch(console.error);
  }, [sessionId]);

  // deselect outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!selectedId) return;
      const el = document.getElementById(`note-${selectedId}`);
      if (el && !el.contains(e.target as Node)) {
        setSelectedId(null);
      }
    };
    // listen for dblclick instead of mousedown
    document.addEventListener("dblclick", handler);
    return () => document.removeEventListener("dblclick", handler);
  }, [selectedId]);

  // create a new note
  const addNote = async () => {
    if (!sessionId) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, title: "New Note" }),
    });
    if (!res.ok) {
      console.error("Failed to create note:", await res.text());
      return;
    }
    const n: Note = await res.json();
    setNotes((prev) => sortByDateDesc([n, ...prev]));
    setSelectedId(n.id);
  };

  // delete the selected note
  const deleteNote = async () => {
    if (!selectedId) return;
    const res = await fetch(`/api/notes/${selectedId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      console.error("Failed to delete note:", await res.text());
      return;
    }
    setNotes((prev) => prev.filter((x) => x.id !== selectedId));
    setSelectedId(null);
  };

  // add a tag
  const addTag = async () => {
    if (!selectedId) return;
    const tag = prompt("Enter a tag:");
    if (!tag) return;
    const original = notes.find((x) => x.id === selectedId)!;
    const updated = await updateNote({
      ...original,
      tags: [...original.tags, tag],
    });
    setNotes((prev) =>
      sortByDateDesc(prev.map((x) => (x.id === updated.id ? updated : x)))
    );
  };

  // update note
  const updateNote = async (note: Note): Promise<Note> => {
    const res = await fetch(`/api/notes/${note.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: note.title,
        content: note.content,
        tags: note.tags,
      }),
    });
    if (!res.ok) {
      console.error("Failed to update note:", await res.text());
      return note;
    }
    return (await res.json()) as Note;
  };

  // key-binding flow
  const keyBind = () => {
    if (!selectedId) return;
    setAwaitingKeyBind(true);
  };
  const finishKeyBind = (id: string, key: string) => {
    console.log(`Bound note ${id} to key ${key}`);
    setAwaitingKeyBind(false);
  };

  // tooltip helper
  const hoverKey = () => {
    if (!localStorage.getItem("tooltip")) {
      setShowTooltip(true);
      localStorage.setItem("tooltip", "1");
      setTimeout(() => setShowTooltip(false), 8000);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 mb-7">
      {/* header controls */}
      <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow">
        <h2 className="text-2xl sharetech text-gray-700">{sessionName}</h2>
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={addNote}
            className="p-1 hover:bg-green-100 rounded text-green-600"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-1 hover:bg-red-100 rounded text-red-600"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={addTag}
            className="p-1 hover:bg-blue-100 rounded text-blue-600"
          >
            <Tag size={16} />
          </button>
          <div className="relative">
            <button
              onClick={keyBind}
              onMouseEnter={hoverKey}
              className="p-1 hover:bg-yellow-100 rounded text-yellow-600"
            >
              <Keyboard size={16} />
            </button>
            {showTooltip && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white p-2 rounded shadow text-sm z-[9999]">
                Press then click a title to bind a key.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* notes list */}
      <div className="flex-1 overflow-auto space-y-4 px-4 pt-4 pb-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={note.id === selectedId}
            onSelect={() => setSelectedId(note.id)}
            onUpdate={async (n) => {
              const saved = await updateNote(n);
              setNotes((p) =>
                sortByDateDesc(p.map((x) => (x.id === saved.id ? saved : x)))
              );
            }}
            awaitingKeyBind={awaitingKeyBind}
            onFinishKeyBind={finishKeyBind}
            onDeselect={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ))}
      </div>

      {/* delete-confirm */}
      <DeleteModal
        isOpen={showDeleteModal}
        itemName={notes.find((n) => n.id === selectedId)?.title ?? ""}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteNote}
      />
    </div>
  );
}
