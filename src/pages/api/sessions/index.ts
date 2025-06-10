import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // getSession returns Session | null
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).end();
  }

  // you can now safely read session.user.id (assuming you augmented the Session type)
  if (req.method === 'GET') {
    const sessions = await prisma.noteSession.findMany({
      where: { userId: session.user.id },
    });
    return res.json(sessions);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}