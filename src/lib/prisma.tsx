import { PrismaClient } from '@prisma/client';

import { NODE_ENV } from '@/config';

// Prevent multiple instances of Prisma Client in development
declare const global: typeof globalThis & { prisma?: PrismaClient };

const prisma = global.prisma || new PrismaClient();
if (NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
