import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Pokemon } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React, { useRef, useState } from 'react';

interface AddEvolutionModalProps {
  closeModal: any;
  defaultPokemonId: string;
  pokemons: Pokemon[];
}

interface AddEvolutionModalState {
  loading: boolean;
}

export default function AddEvolutionModal(props: AddEvolutionModalProps) {
  const [state, setState] = useState<AddEvolutionModalState>({
    loading: false,
  });

  const router = useRouter();

  const pokemonStartInput = useRef<HTMLSelectElement>(null);
  const pokemonAfterInput = useRef<HTMLSelectElement>(null);
  const candyQuantityInput = useRef<HTMLInputElement>(null);
  const specialItemInput = useRef<HTMLInputElement>(null);

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({
      ...state,
      loading: true,
    });

    const pokemonStart = pokemonStartInput.current!.value;
    const pokemonAfter = pokemonAfterInput.current!.value;
    const candyQuantity = parseInt(candyQuantityInput.current!.value, 10);
    const specialItem = specialItemInput.current!.value;

    const body = { pokemonStart, pokemonAfter, candyQuantity, specialItem };

    try {
      await axios.post('/api/evolution/', body);

      router.reload();
    } catch (error) {
      setState({
        ...state,
        loading: false,
      });
    }
  };

  return (
    <div className="absolute top-0 left-0 z-10 h-screen w-screen bg-white">
      <h3 className="my-4 text-center">AddEvolutionModal</h3>
      <button
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-black"
        onClick={props.closeModal}
      >
        <FontAwesomeIcon className="h-6 w-6" icon={faTimes} />
      </button>
      <form className="mx-10" onSubmit={sendForm}>
        <div className="mb-4">
          <select
            className="mr-4 border border-black text-sm"
            defaultValue={props.defaultPokemonId}
            ref={pokemonStartInput}
            required
          >
            {props.pokemons.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name}
              </option>
            ))}
          </select>
          <span className="mr-4 text-sm">evolve in</span>
          <select
            className="border border-black text-sm"
            ref={pokemonAfterInput}
            required
          >
            {props.pokemons.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>
        <h4 className="mb-4 font-bold">Costing</h4>
        <div className="mb-4">
          <div className="flex">
            <input
              className="border border-black text-sm"
              id="candy_quantity"
              type="number"
              ref={candyQuantityInput}
              required
            />
            <label className="text-sm" htmlFor="candy_quantity">
              Candies
            </label>
          </div>
          <span className="text-sm">and a special item (optionnal) : </span>
          <div className="flex">
            <input
              className="border border-black text-sm"
              id="special_item"
              ref={specialItemInput}
              type="text"
            />
          </div>
        </div>
        <button
          className="flex h-10 w-40 items-center justify-center border border-black"
          disabled={state.loading}
          type="submit"
        >
          {state.loading ? (
            <FontAwesomeIcon
              className="mr-4 h-4 w-4 animate-spin"
              icon={faSpinner}
            />
          ) : (
            <span>Submit</span>
          )}
        </button>
      </form>
    </div>
  );
}
