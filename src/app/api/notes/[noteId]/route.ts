import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

interface Params {
  params: { noteId: string };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  // auth
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

  // ownership
  const existing = await prisma.note.findUnique({ where: { id: noteId } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const data = await req.json();

  // enforce one key per session
  if (
    data.keybinding != null &&
    data.keybinding !== existing.keybinding
  ) {
    const conflict = await prisma.note.findFirst({
      where: {
        sessionId: existing.sessionId,
        keybinding: data.keybinding,
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: `Key "${data.keybinding}" already in use in this session.` },
        { status: 400 }
      );
    }
  }

  // apply updates
   const updateData: any = {
    title:     data.title    ?? existing.title,
    content:   data.content  ?? existing.content,
    tags:      data.tags     ?? existing.tags,
    orderKey:  data.orderKey ?? existing.orderKey,
  };

  // If the client even sent a `keybinding` field (even if null), apply it.
  if (Object.prototype.hasOwnProperty.call(data, "keybinding")) {
    updateData.keybinding = data.keybinding;
  }

  const updated = await prisma.note.update({
    where: { id: noteId },
    data: updateData,
    include: { session: { select: { name: true } } },
  });

   return NextResponse.json({
    id:          updated.id,
    title:       updated.title,
    content:     updated.content,
    tags:        updated.tags,
    createdAt:   updated.createdAt,
    keybinding:  updated.keybinding,
    sessionName: updated.session.name,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
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
  const existing = await prisma.note.findUnique({ where: { id: noteId } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await prisma.note.delete({ where: { id: noteId } });
  return NextResponse.json({ success: true });
}