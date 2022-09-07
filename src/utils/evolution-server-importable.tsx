import prisma from '@/lib/prisma';

export async function getEvolutions() {
  const evolutions = await prisma.evolution.findMany({});

  return evolutions;
}
