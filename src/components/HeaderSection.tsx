"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Minus,
  Tag as TagIcon,
  Keyboard as KeyboardIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NoteCard, { Note } from "./NoteCard";
import DeleteModal from "./DeleteModal";

interface HeaderSectionProps {
  sessionId?: string;
  sessionName: string;
  filterTags?: string[];
  filterSearch?: string;
}

interface DropdownPos {
  top: number;
  left: number;
}

export default function HeaderSection({
  sessionId,
  sessionName,
  filterTags = [],
  filterSearch,
}: HeaderSectionProps) {
  console.log("Filter value:", filterSearch, typeof filterSearch);

  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // expanded/collapse header
  const [isExpanded, setIsExpanded] = useState(false);

  // dropdown state
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagDropdownPos, setTagDropdownPos] = useState<DropdownPos | null>(
    null
  );
  const [newTag, setNewTag] = useState("");
  const tagButtonRef = useRef<HTMLButtonElement>(null);
  const tags = filterTags ?? [];

  // keybind dropdown state
  const [showKeyDropdown, setShowKeyDropdown] = useState(false);
  const [keyDropdownPos, setKeyDropdownPos] = useState<DropdownPos | null>(
    null
  );
  const [newKey, setNewKey] = useState("");
  const keyButtonRef = useRef<HTMLButtonElement>(null);

  // map from pressed key to note.id
  const [keyMap, setKeyMap] = useState<Record<string, string[]>>({});
  const keyOrderRef = useRef<Record<string, string[]>>({});
  const pressCount = useRef<Record<string, number>>({});

  // sort helper
  const sortByDateDesc = (arr: Note[]) =>
    [...arr].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  // This fetches all notes without session or tag filters, needed for search filter
  useEffect(() => {
    fetch(`/api/notes`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: Note[]) => {
        setAllNotes(sortByDateDesc(data));
      })
      .catch(console.error);
  }, []);

  // load notes
  useEffect(() => {
    // clear selection only on real context switch
    setSelectedId(null);
    const params = new URLSearchParams();
    if (tags.length > 0) {
      tags.forEach((t) => params.append("tag", t));
    } else if (sessionId) {
      params.append("sessionId", sessionId);
    } else {
      setNotes([]);
      return;
    }

    fetch(`/api/notes?${params.toString()}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data: Note[]) => {
        const sorted = sortByDateDesc(data);
        setNotes(sorted);
        setAllNotes(sorted);
        const order: Record<string, string[]> = {};
        sorted.forEach((n) => {
          if (n.keybinding) {
            order[n.keybinding] = order[n.keybinding] ?? [];
            order[n.keybinding].push(n.id);
          }
        });
        keyOrderRef.current = order;

        // reset cycle counter on context change
        pressCount.current = {};
      })
      .catch(console.error);
  }, [sessionId, tags.length, tags.join(",")]);

  useEffect(() => {
    const km: Record<string, string[]> = {};
    notes.forEach((n) => {
      if (n.keybinding) {
        km[n.keybinding] = km[n.keybinding] ?? [];
        km[n.keybinding].push(n.id);
      }
    });
    setKeyMap(km);
  }, [notes]);

  // only reset the cycle counters when “context” changes
  useEffect(() => {
    pressCount.current = {};
  }, [sessionId, tags.join(",")]);

  // helper to PATCH any field (including keybinding)
  const updateNote = async (
    fields: Partial<Note> & { id: string }
  ): Promise<Note> => {
    const res = await fetch(`/api/notes/${fields.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) throw new Error("Failed to update note");
    return await res.json();
  };

  // global keydown and lookup in keyMap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const arr = keyOrderRef.current[k];
      if (!arr?.length) return;
      e.preventDefault();

      // cycle through all matches
      const count = pressCount.current[k] ?? 0;
      const idx = count % arr.length;
      pressCount.current[k] = count + 1;

      const noteId = arr[idx];
      setSelectedId(noteId);
      setNotes((cur) => {
        const hit = cur.find((n) => n.id === noteId)!;
        const rest = cur.filter((n) => n.id !== noteId);
        return [hit, ...rest];
      });
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // de/select on outside dblclick
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!selectedId) return;
      const el = document.getElementById(`note-${selectedId}`);
      if (el && !el.contains(e.target as Node)) {
        setSelectedId(null);
        setShowTagDropdown(false);
        setShowKeyDropdown(false);
      }
    };
    document.addEventListener("dblclick", handler);
    return () => document.removeEventListener("dblclick", handler);
  }, [selectedId]);

  // CRUD handlers (add, delete, update)
  const addNote = async () => {
    if (!sessionId) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, title: "New Note" }),
    });
    if (!res.ok) return console.error(await res.text());
    const n = (await res.json()) as Note;
    setNotes((p) => sortByDateDesc([n, ...p]));
    setAllNotes((p) => sortByDateDesc([n, ...p]));
    setSelectedId(n.id);
  };
  const deleteNote = async () => {
    if (!selectedId) return;
    const res = await fetch(`/api/notes/${selectedId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return console.error(await res.text());
    setNotes((p) => p.filter((x) => x.id !== selectedId));
    setAllNotes((p) => p.filter((x) => x.id !== selectedId));
    setSelectedId(null);
    window.dispatchEvent(new Event("tags-updated"));
  };

  // tag ui
  const handleTagToggle = () => {
    if (!selectedId || !tagButtonRef.current) return;
    const r = tagButtonRef.current.getBoundingClientRect();
    setTagDropdownPos({
      top: r.bottom + window.scrollY,
      left: r.right + window.scrollX - 160,
    });
    setNewTag("");
    setShowTagDropdown((v) => !v);
    setShowKeyDropdown(false);
  };
  const handleTagSubmit = async () => {
    if (!selectedId || !newTag.trim()) return;
    const orig = notes.find((n) => n.id === selectedId)!;
    const updated = await updateNote({
      ...orig,
      tags: [...orig.tags, newTag.trim()],
    });
    setNotes((p) =>
      sortByDateDesc(p.map((x) => (x.id === updated.id ? updated : x)))
    );
    setAllNotes((p) => // Update allNotes as well
      sortByDateDesc(p.map((x) => (x.id === updated.id ? updated : x)))
    );
    setShowTagDropdown(false);
    window.dispatchEvent(new Event("tags-updated"));
  };

  // keybind ui
  const handleKeyToggle = () => {
    if (!selectedId || !keyButtonRef.current) return;
    const r = keyButtonRef.current.getBoundingClientRect();
    setKeyDropdownPos({
      top: r.bottom + window.scrollY,
      left: r.right + window.scrollX - 200,
    });
    setNewKey("");
    setShowKeyDropdown((v) => !v);
    setShowTagDropdown(false);
  };
  const handleKeyAssign = async () => {
    if (!selectedId || !newKey) return;
    const k = newKey.toLowerCase();

    // only enforce uniqueness if we’re in a real session
    if (sessionId) {
      const conflict = notes.find(
        (n) =>
          n.keybinding === k && n.sessionId === sessionId && n.id !== selectedId
      );
      if (conflict) {
        alert(`Key "${k}" is already used in this session.`);
        return;
      }
    }

    try {
      // overwrite any old binding on that note
      const updated = await updateNote({ id: selectedId, keybinding: k });
      setNotes((prev) =>
        sortByDateDesc(prev.map((n) => (n.id === updated.id ? updated : n)))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign key. Please try again.");
    } finally {
      setShowKeyDropdown(false);
      setNewKey("");
    }
  };

  // filter notes by search
  useEffect(() => {
    if (!filterSearch?.trim()) {
      setNotes(allNotes);
    } else {
      const search = filterSearch.toLowerCase();
      const filtered = allNotes.filter((note) =>
        note.title.toLowerCase().includes(search)
      );
      setNotes(filtered);
    }
  }, [filterSearch, allNotes]);
  

  return (
    <>
      <div className="flex flex-col gap-4 mb-7">
        {/* header */}
        <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow relative z-20">
          <h2 className="text-2xl sharetech text-gray-700">{sessionName}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={addNote}
              className="p-1 hover:bg-green-100 rounded text-green-600 hover:text-green-800 cursor-pointer"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <button
              ref={tagButtonRef}
              onClick={handleTagToggle}
              className="p-1 hover:bg-blue-100 rounded text-blue-600 cursor-pointer"
            >
              <TagIcon size={16} />
            </button>
            <button
              ref={keyButtonRef}
              onClick={handleKeyToggle}
              className="p-1 hover:bg-yellow-100 rounded text-yellow-600 cursor-pointer"
            >
              <KeyboardIcon size={16} />
            </button>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              aria-label={isExpanded ? "Collapse index" : "Expand index"}
              className="p-1 hover:bg-gray-200 text-gray-700 rounded cursor-pointer"
            >
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false} mode="popLayout">
          {isExpanded && (
            <motion.div
              key="index-panel"
              layout
              style={{ overflow: "hidden" }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-gray-100 p-4 rounded-b-2xl mt-[-25]"
            >
              <motion.ul layout className="space-y-1">
                {notes.map((n) => {
                  const key = Object.entries(keyMap).find(([k, ids]) =>
                    ids.includes(n.id)
                  )?.[0];

                  return (
                    <motion.li
                      layout
                      key={n.id}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      onClick={() => {
                        setSelectedId(n.id);
                        setNotes((curr) => {
                          const hit = curr.find((x) => x.id === n.id)!;
                          const rest = curr.filter((x) => x.id !== n.id);
                          return [hit, ...rest];
                        });
                      }}
                      className="cursor-pointer flex items-center space-x-2 sharetech text-gray-700 px-2 py-1 hover:bg-gray-200 rounded"
                    >
                      {/* fixed-width, centered key */}
                      <span className="inline-flex w-6 h-6 items-center justify-center border rounded border-gray-400/30 text-center font-mono text-sm text-gray-600">
                        {key?.toLowerCase() ?? ""}
                      </span>
                      {/* title takes remaining space */}
                      <span className="flex-1 truncate">
                        {n.title || "(Untitled)"}
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* notes list */}
        <div className="flex-1 overflow-auto space-y-4 px-4 pt-4 pb-4">
          
          {notes.map((note) => {
            const boundKey = Object.entries(keyMap).find(([k, ids]) =>
              ids.includes(note.id)
            )?.[0];
            return (
              <motion.div
                key={note.id}
                layout="position"
                style={{ overflow: "visible" }}
                transition={{ type: "tween", stiffness: 500, damping: 30 }}
              >
                <NoteCard
                  key={note.id}
                  note={note}
                  boundKey={boundKey}
                  onRemoveKeyBind={async () => {
                    if (!boundKey) return;
                    try {
                      const updated = await updateNote({
                        id: note.id,
                        keybinding: null,
                      });

                      setNotes((all) =>
                        sortByDateDesc(
                          all.map((n) => (n.id === updated.id ? updated : n))
                        )
                      );
                    } catch (err) {
                      console.error(err);
                      alert("Failed to remove keybind. Please try again.");
                    }
                  }}
                  sessionName={note.sessionName}
                  isSelected={note.id === selectedId}
                  onSelect={() => setSelectedId(note.id)}
                  onDeselect={() => setSelectedId(null)}
                  onUpdate={async (n) => {
                    const saved = await updateNote(n);
                    setNotes((p) =>
                      sortByDateDesc(
                        p.map((x) => (x.id === saved.id ? saved : x))
                      )
                    );
                    window.dispatchEvent(new Event("tags-updated"));
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* delete-confirm */}
        <DeleteModal
          isOpen={showDeleteModal}
          itemName={notes.find((n) => n.id === selectedId)?.title ?? ""}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteNote}
        />
      </div>

      {/* tag portal */}
      {showTagDropdown &&
        tagDropdownPos &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: tagDropdownPos.top,
              left: tagDropdownPos.left,
              width: 160,
              zIndex: 9999,
            }}
            className="bg-white rounded shadow p-2"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag…"
              className="w-full px-2 py-1 border rounded text-sm focus:outline-none text-gray-700"
            />
            <button
              onClick={handleTagSubmit}
              disabled={!newTag.trim()}
              className="mt-2 w-full px-2 py-1 bg-blue-200 text-green-800 disabled:text-gray-700 disabled:bg-blue-100 cursor-pointer disabled:cursor-default sharetech rounded text-sm"
            >
              Add Tag
            </button>
          </div>,
          document.body
        )}

      {/* keybind portal */}
      {showKeyDropdown &&
        keyDropdownPos &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: keyDropdownPos.top,
              left: keyDropdownPos.left,
              width: 200,
              zIndex: 9999,
            }}
            className="bg-white rounded shadow p-2"
          >
            <input
              type="text"
              maxLength={1}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value.slice(-1))}
              placeholder="Assign key…"
              className="w-full px-2 py-1 border rounded text-sm focus:outline-none text-gray-700"
            />
            <button
              onClick={handleKeyAssign}
              disabled={!newKey}
              className="mt-2 w-full px-2 py-1 bg-yellow-200 text-green-800 disabled:bg-yellow-100 disabled:text-gray-700 disabled:cursor-default cursor-pointer rounded text-sm"
            >
              Assign
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
