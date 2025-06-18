import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required." });
  }

  const normalized = email.toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return res.status(409).json({ error: "User already exists." });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
  data: { email: normalized, name, passwordHash },
})

  return res.status(201).json({ id: user.id, email: user.email });
}