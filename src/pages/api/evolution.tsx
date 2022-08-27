import type { NextApiRequest, NextApiResponse } from 'next';

import { saveEvolution } from '@/utils/evolution-server';
import { updatePokemonsPowerMaxPotentialAfterAnEvolution } from '@/utils/pokemon-server';

interface AddEvolutionRequest extends NextApiRequest {
  body: {
    pokemonStart: string;
    pokemonAfter: string;
    candyQuantity: number;
    specialItem?: string;
  };
}

export default async function AddEvolution(
  req: AddEvolutionRequest,
  res: NextApiResponse
) {
  const { pokemonStart, pokemonAfter, candyQuantity, specialItem } = req.body;

  const evolution = await saveEvolution(
    pokemonStart,
    pokemonAfter,
    candyQuantity,
    specialItem
  );

  await updatePokemonsPowerMaxPotentialAfterAnEvolution(evolution);

  return res.status(200).json({});
}
