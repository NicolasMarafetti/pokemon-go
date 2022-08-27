import prisma from '@/lib/prisma';

export async function getEvolutions() {
  const evolutions = await prisma.evolution.findMany({});

  return evolutions;
}

export async function saveEvolution(
  pokemonStart: string,
  pokemonAfter: string,
  candyQuantity: number,
  specialItem?: string
) {
  const evolution = await prisma.evolution.create({
    data: {
      pokemon_start: pokemonStart,
      pokemon_after: pokemonAfter,
      candy_quantity: candyQuantity,
      special_item: specialItem,
    },
  });

  return evolution;
}
