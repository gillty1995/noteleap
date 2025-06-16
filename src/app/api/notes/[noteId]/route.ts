// src/app/api/notes/[noteId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

interface Params {
  params: { noteId: string };
}

/**
 * PUT /api/notes/[noteId]
 * body: { title?, content?, tags?, orderKey? }
 * → updates a note (only the owner can)
 */
export async function PUT(
  req: Request,
  { params: { noteId } }: Params
) {
  // Auth & ownership check
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

  // Fetch the existing note
  const existing = await prisma.note.findUnique({
    where: { id: noteId },
  });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Apply updates
  const data = await req.json();
  const updated = await prisma.note.update({
    where: { id: noteId },
    data: {
      title: data.title ?? existing.title,
      content: data.content ?? existing.content,
      tags: data.tags ?? existing.tags,
      orderKey: data.orderKey ?? existing.orderKey,
    },
  });

  return NextResponse.json(updated);
}

/**
 * DELETE /api/notes/[noteId]
 * → deletes a note (only the owner can)
 */
export async function DELETE(
  req: Request,
  { params: { noteId } }: Params
) {
  // Auth & ownership check
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

  // Verify owner
  const existing = await prisma.note.findUnique({
    where: { id: noteId },
  });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.note.delete({ where: { id: noteId } });
  return NextResponse.json({ success: true });
}