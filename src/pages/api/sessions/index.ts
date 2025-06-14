// pages/api/sessions/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const userId = session.user.id;

  if (req.method === "GET") {
    const list = await prisma.noteSession.findMany({ where: { userId } });
    return res.status(200).json(list);
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
    const created = await prisma.noteSession.create({
      data: { userId, name },
    });
    return res.status(201).json(created);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}