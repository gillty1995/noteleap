// src/app/api/notes/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

/**
 * GET /api/notes?sessionId=...
 * → returns all notes for a given NoteSession
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing sessionId query parameter" },
      { status: 400 }
    );
  }

  const notes = await prisma.note.findMany({
    where: { sessionId },
    orderBy: { orderKey: "asc" },
  });

  return NextResponse.json(notes);
}

/**
 * POST /api/notes
 * body: { sessionId, title, content?, tags?, orderKey? }
 * → creates a new note under the authenticated user
 */
export async function POST(req: Request) {
  // 1) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 2) Parse & validate
  const { sessionId, title, content, tags, orderKey } = await req.json();
  if (!sessionId || !title) {
    return NextResponse.json(
      { error: "sessionId and title are required" },
      { status: 400 }
    );
  }

  // 3) Create
  const note = await prisma.note.create({
    data: {
      sessionId,
      userId: user.id,
      title,
      content: content ?? "",
      tags: tags ?? [],
      orderKey: orderKey ?? 0,
    },
  });

  return NextResponse.json(note, { status: 201 });
}