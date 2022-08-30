import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Pokemon } from '@prisma/client';
import axios from 'axios';
import type { FormEvent } from 'react';
import React, { useRef, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { getPokemonsOrderedName } from '@/utils/pokemon-server';

interface TestPokemonProps {
  pokemons: Pokemon[];
}

interface TestPokemonState {
  loading: boolean;
  power: number;
}

interface ServerSubmitData {
  data: {
    power: number;
  };
}

export default function TestPokemon(props: TestPokemonProps) {
  const [state, setState] = useState<TestPokemonState>({
    loading: false,
    power: 0,
  });

  const pokemonInput = useRef<HTMLSelectElement>(null);
  const fastAttackInput = useRef<HTMLInputElement>(null);
  const principalAttackInput = useRef<HTMLInputElement>(null);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ ...state, loading: true });

    const pokemonId = pokemonInput.current!.value;
    const fastAttackDps = parseFloat(fastAttackInput.current!.value);
    const principalAttackDps = parseFloat(principalAttackInput.current!.value);

    const body = { pokemonId, fastAttackDps, principalAttackDps };

    const data: ServerSubmitData = await axios.post('/api/pokemon/test/', body);

    setState({ ...state, loading: false, power: data.data.power });
  };

  return (
    <Main meta={<Meta title="Add Pokemon" description="Add a Pokemon" />}>
      <h1 className="my-4 text-center">Tester un Pokémon</h1>
      <form onSubmit={submitForm}>
        <div>
          <label className="mx-4" htmlFor="pokemon">
            Pokémon
          </label>
          <select
            className="border border-black p-2"
            id="pokemon"
            ref={pokemonInput}
          >
            {props.pokemons.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mx-4" htmlFor="fast_attack">
            DPS de l&apos;attaque rapide
          </label>
          <input
            className="border border-black p-2"
            id="fast_attack"
            ref={fastAttackInput}
            type="number"
            step="0.1"
          />
        </div>
        <div>
          <label className="mx-4" htmlFor="fast_attack">
            DPS de l&apos;attaque principale
          </label>
          <input
            className="border border-black p-2"
            id="fast_attack"
            ref={principalAttackInput}
            type="number"
            step="0.1"
          />
        </div>
        <button className="border border-black p-2" type="submit">
          {state.loading && (
            <FontAwesomeIcon
              className="h-4 w-4 animate-spin"
              icon={faSpinner}
            />
          )}
          <span>Tester</span>
        </button>
      </form>
      {state.power ? <p>Puissance : {state.power}</p> : <></>}
    </Main>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      pokemons: await getPokemonsOrderedName(),
    },
  };
}
