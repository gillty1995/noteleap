// src/app/api/tags/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // fetch all tags arrays
  const notes = await prisma.note.findMany({ select: { tags: true } });
  const all = notes.flatMap((n) => n.tags);
  const distinct = Array.from(new Set(all)).sort();
  return NextResponse.json(distinct);
}