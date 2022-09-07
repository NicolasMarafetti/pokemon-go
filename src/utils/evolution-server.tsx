import type { Evolution } from '@prisma/client';

import prisma from '@/lib/prisma';

import { updatePokemonsPowerMaxPotentialAfterAnEvolution } from './pokemon-server';

export async function saveEvolution(
  pokemonStart: string,
  pokemonAfter: string,
  candyQuantity: number,
  specialItem?: string | null
) {
  const evolution = await prisma.evolution.create({
    data: {
      pokemon_start: pokemonStart,
      pokemon_after: pokemonAfter,
      candy_quantity: candyQuantity,
      special_item: specialItem,
    },
  });

  await updatePokemonsPowerMaxPotentialAfterAnEvolution(evolution);

  return evolution;
}

export async function saveEvolutions(evolutions: Evolution[]) {
  const promises: Promise<any>[] = [];
  evolutions.forEach((evolutionTmp) => {
    promises.push(
      saveEvolution(
        evolutionTmp.pokemon_start,
        evolutionTmp.pokemon_after,
        evolutionTmp.candy_quantity,
        evolutionTmp.special_item
      )
    );
  });

  await Promise.all(promises);
}
