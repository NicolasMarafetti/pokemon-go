import type { Evolution, Pokemon } from '@prisma/client';

import { findPokemonEvolutions } from './evolution-helpers';

export function calculatePokemonAttackPower(
  attack: number,
  totalDps: number,
  combatDuration: number
) {
  return (attack * totalDps * combatDuration) / 2;
}

export function calculatePokemonDefensePower(defense: number, max_hp: number) {
  return defense * max_hp;
}

export function calculatPokemonTotalDps(
  best_quick_move_dps: number,
  best_main_move_dps: number
) {
  return best_quick_move_dps + best_main_move_dps;
}

export function calculatePokemonTotalPower(
  attackPower: number,
  defensePower: number,
  finalCalculationDivider: number
) {
  const totalPower = (attackPower + defensePower) / finalCalculationDivider;
  return Number(totalPower.toFixed(2));
}

export function findPokemonMaxPotential(
  evolutions: Evolution[],
  pokemonId: string,
  pokemons: Pokemon[]
) {
  const pokemon = pokemons.find((pokemonTest) => pokemonTest.id === pokemonId);
  if (!pokemon) return 0;

  const pokemonEvolutions: { evolution: Evolution; pokemon: Pokemon }[] =
    findPokemonEvolutions('both', false, evolutions, pokemonId, pokemons);

  let maxPotential = pokemon.total_power;

  for (let i = 0; i < pokemonEvolutions.length; i += 1) {
    if (pokemonEvolutions[i]!.pokemon.total_power > maxPotential)
      maxPotential = pokemonEvolutions[i]!.pokemon.total_power;
  }

  return maxPotential;
}

export function getPokemonTypeBackgroundSource(pokemonMainType: string) {
  let typeForUrl = pokemonMainType;
  if (pokemonMainType === 'acier') typeForUrl = 'steel';
  if (pokemonMainType === 'roche') typeForUrl = 'rock';
  if (pokemonMainType === 'eau') typeForUrl = 'water';
  if (pokemonMainType === 'feu') typeForUrl = 'fire';
  if (pokemonMainType === 'combat') typeForUrl = 'fighting';
  if (pokemonMainType === 'electrik') typeForUrl = 'electric';
  if (pokemonMainType === 'sol') typeForUrl = 'ground';
  if (pokemonMainType === 'psy') typeForUrl = 'psychic';
  if (pokemonMainType === 'insecte') typeForUrl = 'bug';
  if (pokemonMainType === 'fee') typeForUrl = 'fairy';
  if (pokemonMainType === 'plante') typeForUrl = 'grass';
  if (pokemonMainType === 'spectre') typeForUrl = 'ghost';
  if (pokemonMainType === 'tenebres') typeForUrl = 'dark';

  return `https://pokemon.gameinfo.io//images/game/details_type_bg_${typeForUrl}.png`;
}

export function getPokemonImageSource(pokemonImageName: string) {
  return `https://images.gameinfo.io/pokemon/256/${pokemonImageName}.png`;
}
