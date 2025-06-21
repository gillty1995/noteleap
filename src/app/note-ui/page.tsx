// app/note-ui/page.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SessionsList from "@/components/SessionsList";
import HeaderSection from "@/components/HeaderSection";
import FilterSearch from "@/components/FilterSearch";
import TagSection from "@/components/TagSection";

export default function NoteUIPage() {
  const { data: session, status } = useSession({
    required: true,
  });
  interface SessionItem {
    id: string;
    name: string;
  }
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterSearch, setFilterSearch] = useState<string>("");

  // load sessions on mount
  useEffect(() => {
    fetch("/api/sessions", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch sessions");
        return r.json();
      })
      .then((list: SessionItem[]) => {
        setSessions(list);
      })
      .catch(console.error);
  }, []);

  if (status !== "authenticated") {
    return (
      <p className="h-screen flex items-center justify-center">Loading…</p>
    );
  }

  const addSession = async (name: string) => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        console.error("Failed to create session", await res.text());
        return;
      }
      const created: SessionItem = await res.json();
      setSessions((prev) => [...prev, created]);
      setActiveIndex(sessions.length);
    } catch (err) {
      console.error(err);
    }
  };

  // delete a session
  const deleteSession = async (i: number) => {
    const toDelete = sessions[i];
    try {
      const res = await fetch(`/api/sessions/${toDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to delete session", await res.text());
        return;
      }
      setSessions((prev) => prev.filter((s) => s.id !== toDelete.id));
      setActiveIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  // rename a session
  const renameSession = async (i: number, newName: string) => {
    const target = sessions[i];
    try {
      const res = await fetch(`/api/sessions/${target.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        console.error("Failed to rename session", await res.text());
        return;
      }
      setSessions((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, name: newName } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const activeSession = sessions[activeIndex];

  return (
    <div className="pt-30 min-h-screen grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50">
      <Navbar />
      <aside className="space-y-6">
        <FilterSearch onFilterSearch={setFilterSearch}/>
        <TagSection onFilterTags={setFilterTags} />
        <SessionsList
          sessions={sessions.map((s) => s.name)}
          activeIndex={activeIndex}
          onSelect={(i) => {
            setFilterTags([]);
            setFilterSearch("");
            setActiveIndex(i);
          }}
          onAdd={addSession}
          onDelete={deleteSession}
          onRename={renameSession}
        />
      </aside>
      <main className="md:col-span-3 flex flex-col gap-6">
        {filterTags.length > 0 ? (
          <HeaderSection
            filterTags={filterTags}
            sessionName={`Filter by Tag${
              filterTags.length > 1 ? "s" : ""
            }: ${filterTags.join(", ")}`}
          />
        ) : filterSearch ? (
          <HeaderSection
            filterSearch={filterSearch}
            sessionName={`Filter by Search: ${filterSearch}`}
          />
        ) : activeSession ? (
          <HeaderSection
            sessionId={activeSession.id}
            sessionName={activeSession.name}
          />
        ) : (
          <p className="p-4 text-gray-500">
            Select or create a session to get started.
          </p>
        )}
      </main>
    </div>
  );
}
