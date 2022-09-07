import type { NextApiRequest, NextApiResponse } from 'next';

import { saveEvolution } from '@/utils/evolution-server';

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

  await saveEvolution(pokemonStart, pokemonAfter, candyQuantity, specialItem);

  return res.status(200).json({});
}
