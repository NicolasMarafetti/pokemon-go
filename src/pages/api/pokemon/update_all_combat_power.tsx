import type { NextApiRequest, NextApiResponse } from 'next';

import {
  updatePokemonsCombatPower,
  updatePokemonsMaxPotential,
} from '@/utils/pokemon-server';

export default async function UpdateAllPokemonsCombatPower(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  await updatePokemonsCombatPower();

  await updatePokemonsMaxPotential();

  return res.status(200).json({});
}
