import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tags = searchParams.getAll("tag");
  const sessionId = searchParams.get("sessionId");

  let notesWithSession;
  if (tags.length) {
    notesWithSession = await prisma.note.findMany({
      where: { tags: { hasSome: tags } },
      orderBy: { orderKey: "asc" },
      include: { session: { select: { id: true, name: true } } },
    });
  } else if (sessionId) {
    notesWithSession = await prisma.note.findMany({
      where: { sessionId },
      orderBy: { orderKey: "asc" },
      include: { session: { select: { id: true, name: true } } },
    });
  } else {
    return NextResponse.json([], { status: 200 });
  }

  const notes = notesWithSession.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    tags: n.tags,
    orderKey: n.orderKey,
    createdAt: n.createdAt,
    sessionId: n.sessionId,
    sessionName: n.session.name,
    keybinding: n.keybinding,
  }));

  return NextResponse.json(notes, { status: 200 });
}

export async function POST(req: Request) {
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

  const { sessionId, title, content, tags, orderKey } = await req.json();
  if (!sessionId || !title) {
    return NextResponse.json(
      { error: "sessionId and title are required" },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      sessionId,
      userId: user.id,
      title,
      content: content ?? "",
      tags: tags ?? [],
      orderKey: orderKey ?? 0,
      keybinding: null,
    },
  });

  return NextResponse.json(note, { status: 201 });
}