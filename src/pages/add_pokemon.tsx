import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Pokemon } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import React, { useRef, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import prisma from '@/lib/prisma';
import { Main } from '@/templates/Main';

interface AddPokemonProps {
  pokemons: { name: string }[];
}

interface AddPokemonState {
  loading: boolean;
  name: string;
}

interface AddPokemonReturnData {
  data: {
    pokemon: Pokemon;
  };
}

export default function AddPokemon(props: AddPokemonProps) {
  const [state, setState] = useState<AddPokemonState>({
    loading: false,
    name: '',
  });

  const mainTypeInput = useRef<HTMLInputElement>(null);
  const bestQuickMoveDpsInput = useRef<HTMLInputElement>(null);
  const bestMainMoveDpsInput = useRef<HTMLInputElement>(null);
  const attackInput = useRef<HTMLInputElement>(null);
  const defenseInput = useRef<HTMLInputElement>(null);
  const maxHpInput = useRef<HTMLInputElement>(null);
  const imageNameInput = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const pokemonAlreadyExist = () => {
    const pokemonsCorresponding = props.pokemons.filter(
      (pokemonTest) =>
        pokemonTest.name.toLowerCase() === state.name.toLowerCase()
    );

    return pokemonsCorresponding.length > 0;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ ...state, loading: true });

    const body = {
      name: state.name,
      main_type: mainTypeInput.current!.value,
      best_quick_move_dps: parseFloat(bestQuickMoveDpsInput.current!.value),
      best_main_move_dps: parseFloat(bestMainMoveDpsInput.current!.value),
      attack: parseInt(attackInput.current!.value, 10),
      defense: parseInt(defenseInput.current!.value, 10),
      max_hp: parseInt(maxHpInput.current!.value, 10),
      image_name: imageNameInput.current!.value,
    };

    const data: AddPokemonReturnData = await axios.post('/api/pokemon', body);

    router.push(`/pokemon/${data.data.pokemon.id}`);
  };

  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      name: e.currentTarget.value,
    });
  };

  return (
    <Main meta={<Meta title="Add Pokemon" description="Add a Pokemon" />}>
      <h1 className="my-4 text-center">Pokemon Go</h1>
      <h2 className="my-4 text-center">Add a Pokemon</h2>
      <form className="pl-4 text-sm xl:text-4xl" onSubmit={submit}>
        <div className="my-1">
          <label className="mr-4" htmlFor="name">
            Nom
          </label>
          <input
            className={`rounded-xl border px-2 ${
              pokemonAlreadyExist() ? 'border-8 border-red-500' : 'border-black'
            }`}
            id="name"
            onChange={updateName}
            type="text"
            required
            value={state.name}
          />
        </div>
        <div className="my-1">
          <label className=" mr-4" htmlFor="image_name">
            Image Name
          </label>
          <input
            className="rounded-xl  border border-black px-2"
            id="image_name"
            type="text"
            ref={imageNameInput}
            required
          />
        </div>
        <div>
          <label className=" mr-4" htmlFor="main_type">
            Type Principal (en minuscule)
          </label>
          <input
            className="rounded-xl border border-black px-2"
            id="main_type"
            type="text"
            ref={mainTypeInput}
            required
          />
        </div>
        <div className="my-1">
          <label className="mr-4" htmlFor="best_quick_move_dps">
            Best Quick Move DPS
          </label>
          <input
            className="rounded-xl border border-black px-2"
            id="best_quick_move_dps"
            type="number"
            step="0.01"
            ref={bestQuickMoveDpsInput}
            required
          />
        </div>
        <div className="my-1">
          <label className="mr-4" htmlFor="best_main_move_dps">
            Best Main Move DPS
          </label>
          <input
            className="rounded-xl border border-black px-2"
            id="best_main_move_dps"
            type="number"
            step="0.01"
            ref={bestMainMoveDpsInput}
            required
          />
        </div>
        <div className="my-1">
          <label className="mr-4" htmlFor="attack">
            Stat - Attack
          </label>
          <input
            className="rounded-xl border border-black px-2"
            id="attack"
            type="number"
            ref={attackInput}
            required
          />
        </div>
        <div className="my-1">
          <label className="mr-4" htmlFor="defense">
            Stat - Defense
          </label>
          <input
            className="rounded-xl border border-black px-2"
            id="defense"
            type="number"
            ref={defenseInput}
            required
          />
        </div>
        <div className="my-1">
          <label className="mr-4" htmlFor="max_hp">
            Max HP (Carefull it&apos;s not Stat - Stamina)
          </label>
          <input
            className="rounded-xl border border-black px-2"
            id="max_hp"
            type="number"
            ref={maxHpInput}
            required
          />
        </div>
        <button className="rounded-xl border border-black p-2" type="submit">
          {state.loading && (
            <FontAwesomeIcon
              className="mr-2 inline-block w-4 animate-spin"
              icon={faSpinner}
            />
          )}
          Valider
        </button>
      </form>
    </Main>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      pokemons: await prisma.pokemon.findMany({
        select: {
          name: true,
        },
      }),
    },
  };
}
