import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions }       from "@/pages/api/auth/[...nextauth]";
import { prisma }            from "@/lib/prisma";

export async function GET(req: Request) {
  // auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // parse filters
  const { searchParams } = new URL(req.url);
  const tags = searchParams.getAll("tag");
  const sessionId = searchParams.get("sessionId");

  // fetch only this user’s notes
  let notesWithMeta = [];
  if (tags.length) {
    notesWithMeta = await prisma.note.findMany({
      where: { userId, tags: { hasSome: tags } },
      orderBy: { orderKey: "asc" },
      include: { session: { select: { id: true, name: true } } },
    });
  } else if (sessionId) {
    notesWithMeta = await prisma.note.findMany({
      where: { userId, sessionId },
      orderBy: { orderKey: "asc" },
      include: { session: { select: { id: true, name: true } } },
    });
  } else {
    return NextResponse.json([], { status: 200 });
  }

  // shape the response
  const notes = notesWithMeta.map((n) => ({
    id:          n.id,
    title:       n.title,
    content:     n.content,
    tags:        n.tags,
    orderKey:    n.orderKey,
    createdAt:   n.createdAt,
    sessionId:   n.sessionId,
    sessionName: n.session.name,
    keybinding:  n.keybinding,
  }));

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  // auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // pull body
  const { sessionId, title, content = "", tags = [], orderKey = 0 } = await req.json();
  if (!sessionId || !title) {
    return NextResponse.json(
      { error: "sessionId and title are required" },
      { status: 400 }
    );
  }

  // create note scoped to this user
  const note = await prisma.note.create({
    data: { userId, sessionId, title, content, tags, orderKey },
  });

  return NextResponse.json(note, { status: 201 });
}