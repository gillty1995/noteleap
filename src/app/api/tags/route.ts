import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // only pull tags belonging to that user
  const userNotes = await prisma.note.findMany({
    where: { userId },
    select: { tags: true },
  });

  // flatten + dedupe
  const allTags = Array.from(
    new Set(userNotes.flatMap((note) => note.tags))
  ).sort();

  return NextResponse.json(allTags);
}