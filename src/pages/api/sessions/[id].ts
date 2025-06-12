// pages/api/sessions/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).end();
  }

  const id = String(req.query.id);

  if (req.method === "PATCH") {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
    const updated = await prisma.noteSession.update({
      where: { id },
      data: { name },
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.noteSession.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  return res.status(405).end();
}