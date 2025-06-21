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
  const filterSearch = searchParams.get("search");
  // fetch only this user’s notes
  let notesWithMeta = [];
  let finalWhere: any = { userId }; // Always start with userId
  let filtersApplied = false;
  if (tags.length > 0) {
      finalWhere.tags = { hasSome: tags };
      filtersApplied = true;
  }
  if (sessionId) { // Not else if anymore
      finalWhere.sessionId = sessionId;
      filtersApplied = true;
  }
  if (filterSearch) { // Not else if anymore
      finalWhere.title = { contains: filterSearch, mode: 'insensitive' };
      filtersApplied = true;
  }
  if(!filtersApplied){
      return NextResponse.json([], { status: 200 });
  }

// Now, regardless of conditions, you only have one findMany call
notesWithMeta = await prisma.note.findMany({
    where: finalWhere,
    orderBy: { orderKey: "asc" },
    include: { session: { select: { id: true, name: true } } },
});

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