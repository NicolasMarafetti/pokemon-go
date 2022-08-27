import type { NextApiRequest, NextApiResponse } from 'next';

import {
  calculatePokemonAttackPower,
  calculatePokemonDefensePower,
  calculatePokemonTotalPower,
  calculatPokemonTotalDps,
} from '@/utils/pokemon-helpers';
import { getPokemon } from '@/utils/pokemon-server';
import {
  getCombatDuration,
  getFinalCalculationDivider,
} from '@/utils/variable-server';

export default async function testPokemon(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pokemonId, fastAttackDps, principalAttackDps } = req.body;

  const pokemon = await getPokemon(pokemonId);
  if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });
  const combatDuration = await getCombatDuration();
  const finalCalculationDivider = await getFinalCalculationDivider();

  const totalDps = calculatPokemonTotalDps(fastAttackDps, principalAttackDps);

  const attackPower = calculatePokemonAttackPower(
    pokemon.attack,
    totalDps,
    combatDuration
  );
  const defensePower = calculatePokemonDefensePower(
    pokemon.defense,
    pokemon.max_hp
  );

  return res.status(200).json({
    power: calculatePokemonTotalPower(
      attackPower,
      defensePower,
      finalCalculationDivider
    ),
  });
}
