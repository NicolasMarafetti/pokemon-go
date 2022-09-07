import type { NextApiRequest, NextApiResponse } from 'next';

import { updatePokemonsMaxPotential } from '@/utils/pokemon-server';

export default async function UpdateAllPokemonsMaxPotential(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  await updatePokemonsMaxPotential();

  return res.status(200).json({});
}
