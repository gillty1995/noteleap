// app/note-ui/page.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import FilterSearch from "@/components/FilterSearch";
import TagSection from "@/components/TagSection";
import SessionsList from "@/components/SessionsList";
import HeaderSection from "@/components/HeaderSection";
import NotesList from "@/components/NotesList";
import Navbar from "@/components/Navbar";

export default function NoteUIPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // redirect to sign-in if you like
      signIn();
    },
  });

  if (status !== "authenticated") {
    return (
      <p className="h-screen flex items-center justify-center">Loading…</p>
    );
  }

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 mt-20 fixed">
      <Navbar
        onSignInClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      {/* Sidebar */}
      <aside className="space-y-6">
        <FilterSearch />
        <TagSection />
        <SessionsList />
      </aside>

      {/* Main area */}
      <main className="md:col-span-3 flex flex-col gap-6">
        <HeaderSection />
        <NotesList />
      </main>
    </div>
  );
}
