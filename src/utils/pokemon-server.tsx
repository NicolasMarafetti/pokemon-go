import type { Evolution, Pokemon } from '@prisma/client';

import prisma from '@/lib/prisma';

import {
  evolutionFindStartPokemon,
  findPokemonEvolutions,
} from './evolution-helpers';
import { getEvolutions } from './evolution-server-importable';
import {
  calculatePokemonAttackPower,
  calculatePokemonDefensePower,
  calculatePokemonTotalPower,
  calculatPokemonTotalDps,
} from './pokemon-helpers';
import {
  calculateNewFinalDivider,
  getCombatDuration,
  getFinalCalculationDivider,
  updateDivider,
} from './variable-server';

function calculatePokemonFightingDuration(
  maxHp: number,
  totalDps: number,
  attack: number,
  defense: number
) {
  const fightingDuration = maxHp / (0.5 * totalDps * (attack / defense));
  return Number(fightingDuration.toFixed(2));
}

function calculatePokemonPowerMaxPotential(
  pokemon: Pokemon,
  pokemons: Pokemon[],
  evolutions: Evolution[]
): number {
  // On récupère tous les pokémons lié à cette évolution
  const allPokemons: Pokemon[] = [];
  const allPokemonsEvolutions = findPokemonEvolutions(
    'both',
    false,
    evolutions,
    pokemon.id,
    pokemons
  );
  for (let i = 0; i < allPokemonsEvolutions.length; i += 1) {
    allPokemons.push(allPokemonsEvolutions[i]!.pokemon);
  }
  allPokemons.push(pokemon);

  // On calcul la puissance maximum de ces pokémons
  let maxPower: number = 0;
  for (let i = 0; i < allPokemons.length; i += 1) {
    if (allPokemons[i]!.total_power > maxPower)
      maxPower = allPokemons[i]!.total_power;
  }

  return maxPower;
}

export async function getPokemons() {
  const pokemons = await prisma.pokemon.findMany({
    orderBy: {
      total_power: 'desc',
    },
  });

  return pokemons;
}

async function updatePokemonTotalPowerInDatabase(
  pokemon: Pokemon,
  divider: number
) {
  const totalPower = calculatePokemonTotalPower(
    pokemon.attack_power,
    pokemon.defense_power,
    divider
  );

  return prisma.pokemon.update({
    data: {
      total_power: totalPower,
    },
    where: {
      id: pokemon.id,
    },
  });
}

async function updatePokemonPowerMaxPotentialInDatabase(
  pokemon: Pokemon,
  pokemons: Pokemon[],
  evolutions: Evolution[]
) {
  const powerMaxPotential = calculatePokemonPowerMaxPotential(
    pokemon,
    pokemons,
    evolutions
  );

  return prisma.pokemon.update({
    data: {
      power_max_potential: powerMaxPotential,
    },
    where: {
      id: pokemon.id,
    },
  });
}

export async function getPokemon(id: string) {
  const pokemon = await prisma.pokemon.findUnique({
    where: {
      id,
    },
  });

  return pokemon;
}

export async function getPokemonsOrderedName() {
  const pokemons = await prisma.pokemon.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return pokemons;
}

async function updatePokemonMaxPotential(
  pokemonId: string,
  newMaxPotential: number
) {
  await prisma.pokemon.update({
    where: {
      id: pokemonId,
    },
    data: {
      power_max_potential: newMaxPotential,
    },
  });
}

async function updatePokemonFightingDurations(pokemon: Pokemon) {
  const pokemonFightingDuration = calculatePokemonFightingDuration(
    pokemon.max_hp,
    pokemon.total_dps,
    pokemon.attack,
    pokemon.defense
  );

  if (pokemon.fighting_duration !== pokemonFightingDuration) {
    await prisma.pokemon.update({
      data: {
        fighting_duration: pokemonFightingDuration,
      },
      where: {
        id: pokemon.id,
      },
    });
  }
}

export async function updatePokemonsCombatPower() {
  // eslint-disable-next-line no-console
  console.log('updatePokemonsCombatPower has begin');

  const pokemons = await getPokemons();
  const combatDuration = await getCombatDuration();
  const finalCalcuationDivider = await getFinalCalculationDivider();

  const promises: Promise<any>[] = [];
  pokemons.forEach((pokemon) => {
    const attackPower = calculatePokemonAttackPower(
      pokemon.attack,
      pokemon.total_dps,
      combatDuration
    );

    const totalPower = calculatePokemonTotalPower(
      attackPower,
      pokemon.defense_power,
      finalCalcuationDivider
    );

    promises.push(
      prisma.pokemon.update({
        data: {
          attack_power: attackPower,
          total_power: totalPower,
        },
        where: {
          id: pokemon.id,
        },
      })
    );
  });

  Promise.all(promises);
}

export async function updatePokemonsFightingDurations() {
  const pokemons = await getPokemons();

  const promises: Promise<any>[] = [];
  for (let i = 0; i < pokemons.length; i += 1) {
    promises.push(updatePokemonFightingDurations(pokemons[i]!));
  }

  await Promise.all(promises);
}

export async function updatePokemonsMaxPotential() {
  // eslint-disable-next-line no-console
  console.log('updatePokemonsMaxPotential has begin');

  const pokemons = await getPokemons();
  const evolutions = await getEvolutions();

  const promises: Promise<any>[] = [];
  pokemons.forEach((pokemon) => {
    const pokemonMaxPotential = calculatePokemonPowerMaxPotential(
      pokemon,
      pokemons,
      evolutions
    );

    promises.push(
      prisma.pokemon.update({
        data: {
          power_max_potential: pokemonMaxPotential,
        },
        where: {
          id: pokemon.id,
        },
      })
    );
  });

  await Promise.all(promises);

  return true;
}

export async function updatePokemonsPowerMaxPotentialAfterAnEvolution(
  evolution: Evolution
) {
  const pokemons = await getPokemons();
  const evolutions = await getEvolutions();

  // On récupère le pokémon de départ initial
  const initialPokemon = evolutionFindStartPokemon(evolution, pokemons);
  if (!initialPokemon) return false;

  // On récupère tous les pokémons lié à cette évolution
  const allPokemons: Pokemon[] = [];
  const allPokemonsEvolutions = findPokemonEvolutions(
    'both',
    false,
    evolutions,
    evolution.pokemon_start,
    pokemons
  );
  for (let i = 0; i < allPokemonsEvolutions.length; i += 1) {
    allPokemons.push(allPokemonsEvolutions[i]!.pokemon);
  }
  allPokemons.push(initialPokemon);

  // On calcul la puissance maximum de ces pokémons
  let maxPower: number = 0;
  for (let i = 0; i < allPokemons.length; i += 1) {
    if (allPokemons[i]!.total_power > maxPower)
      maxPower = allPokemons[i]!.total_power;
  }

  // On met à jour les pokémons qui en ont besoin
  const promises = [];
  for (let i = 0; i < allPokemons.length; i += 1) {
    if (allPokemons[i]!.power_max_potential !== maxPower) {
      promises.push(updatePokemonMaxPotential(allPokemons[i]!.id, maxPower));
    }
  }
  await Promise.all(promises);

  return true;
}

export async function updateEveryPokemonTotalPowers(
  newFinalCalculationDivider: number
) {
  let pokemons = await getPokemons();
  const evolutions = await getEvolutions();

  // Update total_power
  const updateTotalPowersPromises: Promise<any>[] = [];
  for (let i = 0; i < pokemons.length; i += 1) {
    updateTotalPowersPromises.push(
      updatePokemonTotalPowerInDatabase(
        pokemons[i]!,
        newFinalCalculationDivider
      )
    );
  }
  await Promise.all(updateTotalPowersPromises);

  // Update power_max_potential
  pokemons = await getPokemons();
  const updatePowerMaxPotentialPromises: Promise<any>[] = [];
  for (let i = 0; i < pokemons.length; i += 1) {
    updatePowerMaxPotentialPromises.push(
      updatePokemonPowerMaxPotentialInDatabase(
        pokemons[i]!,
        pokemons,
        evolutions
      )
    );
  }
  Promise.all(updatePowerMaxPotentialPromises);
  // TODO

  return true;
}

export async function savePokemon(
  name: string,
  main_type: string,
  best_quick_move_dps: number,
  best_main_move_dps: number,
  attack: number,
  defense: number,
  max_hp: number,
  image_name: string
) {
  const combatDuration = await getCombatDuration();
  const finalCalculationDivider = await getFinalCalculationDivider();

  const totalDps: number = calculatPokemonTotalDps(
    best_quick_move_dps,
    best_main_move_dps
  );
  const attackPower: number = calculatePokemonAttackPower(
    attack,
    totalDps,
    combatDuration
  );
  const defensePower: number = calculatePokemonDefensePower(defense, max_hp);

  const fightingDuration = calculatePokemonFightingDuration(
    max_hp,
    totalDps,
    attack,
    defense
  );

  const totalPower = calculatePokemonTotalPower(
    attackPower,
    defensePower,
    finalCalculationDivider
  );

  const powerMaxPotential = totalPower;

  const pokemon = await prisma.pokemon.create({
    data: {
      name,
      main_type,
      best_quick_move_dps,
      best_main_move_dps,
      attack,
      defense,
      max_hp,
      total_dps: totalDps,
      attack_power: attackPower,
      defense_power: defensePower,
      fighting_duration: fightingDuration,
      total_power: totalPower,
      power_max_potential: powerMaxPotential,
      image_name,
    },
  });

  if (totalPower > 100) {
    const newFinalCalculationDivider = calculateNewFinalDivider(
      attackPower,
      defensePower
    );

    await updateDivider(newFinalCalculationDivider);

    await updateEveryPokemonTotalPowers(newFinalCalculationDivider);
  }

  return pokemon;
}
