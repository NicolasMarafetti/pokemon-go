import type { NextApiRequest, NextApiResponse } from 'next';

import { updatePokemonsFightingDurations } from '@/utils/pokemon-server';

export default async function updateFightingDurations(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  await updatePokemonsFightingDurations();

  return res.status(200).json({});
}
