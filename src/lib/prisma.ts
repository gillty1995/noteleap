import { PrismaClient } from '@prisma/client';

declare global {
  // allow global "prisma" var to prevent multiple instances in development
  var prisma: PrismaClient | undefined;
}

// use existing client if it exists (dev mode hot reload), otherwise create new
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}