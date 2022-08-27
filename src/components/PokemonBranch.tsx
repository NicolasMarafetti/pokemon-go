import type { Evolution, Pokemon } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

import {
  findPokemonEvolutions,
  searchPokemonPrecedentEvolution,
} from '@/utils/evolution-helpers';

import EvolutionArrow from './EvolutionArrow';
import PokemonCard from './pokemon-card';

interface PokemonBranchProps {
  directions: 'start' | 'both' | 'after';
  evolutions: Evolution[];
  mainPokemon: boolean;
  pokemonId: string;
  pokemons: Pokemon[];
}

export default function PokemonBranch(props: PokemonBranchProps) {
  const pokemon = props.pokemons.find(
    (pokemonTest) => pokemonTest.id === props.pokemonId
  );

  const pokemonBeforeEvolutions: { evolution: Evolution; pokemon: Pokemon }[] =
    props.directions === 'start' || props.directions === 'both'
      ? findPokemonEvolutions(
          'before',
          true,
          props.evolutions,
          props.pokemonId,
          props.pokemons
        )
      : [];

  const pokemonsSameEvolutions = props.mainPokemon
    ? findPokemonEvolutions(
        'same',
        true,
        props.evolutions,
        props.pokemonId,
        props.pokemons
      )
    : [];

  const pokemonAfterEvolutions =
    props.directions === 'after' || props.directions === 'both'
      ? findPokemonEvolutions(
          'after',
          true,
          props.evolutions,
          props.pokemonId,
          props.pokemons
        )
      : [];

  const precedentEvolution = searchPokemonPrecedentEvolution(
    props.pokemonId,
    props.evolutions
  );

  return pokemon ? (
    <div className="flex items-center justify-center">
      <div className="flex flex-col">
        {pokemonBeforeEvolutions.map((pokemonEvolution) => (
          <div className="flex items-center" key={pokemonEvolution.pokemon.id}>
            <PokemonBranch
              directions="start"
              evolutions={props.evolutions}
              mainPokemon={false}
              pokemonId={pokemonEvolution.pokemon.id}
              pokemons={props.pokemons}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <Link href={`/pokemon/${pokemon.id}`}>
          <a className="flex items-center text-black">
            {precedentEvolution && (
              <EvolutionArrow evolution={precedentEvolution} />
            )}
            <PokemonCard
              evolutions={props.evolutions}
              mainPokemon={props.mainPokemon}
              pokemon={pokemon}
              pokemons={props.pokemons}
              size="small"
            />
          </a>
        </Link>

        {pokemonsSameEvolutions.map((pokemonEvolution) => (
          <Link
            href={`/pokemon/${pokemonEvolution.pokemon.id}`}
            key={pokemonEvolution.pokemon.id}
          >
            <a className="flex items-center text-black">
              {pokemonBeforeEvolutions.length > 0 && (
                <EvolutionArrow evolution={pokemonEvolution.evolution} />
              )}
              <PokemonCard
                evolutions={props.evolutions}
                mainPokemon={false}
                pokemon={pokemonEvolution.pokemon}
                pokemons={props.pokemons}
                size="small"
              />
            </a>
          </Link>
        ))}
      </div>

      <div className="flex flex-col">
        {pokemonAfterEvolutions.map((pokemonEvolution) => (
          <div className="flex items-center" key={pokemonEvolution.pokemon.id}>
            <PokemonBranch
              directions="after"
              evolutions={props.evolutions}
              mainPokemon={false}
              pokemonId={pokemonEvolution.pokemon.id}
              pokemons={props.pokemons}
            />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Pokemon not found</p>
  );
}
