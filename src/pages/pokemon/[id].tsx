import type { Evolution, Pokemon } from '@prisma/client';
import React, { useState } from 'react';

import AddEvolutionModal from '@/components/addEvolutionModal';
import PokemonBranch from '@/components/PokemonBranch';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { getEvolutions } from '@/utils/evolution-server';
import { getPokemon, getPokemonsOrderedName } from '@/utils/pokemon-server';

interface SeePokemonProps {
  evolutions: Evolution[];
  pokemon: Pokemon;
  pokemons: Pokemon[];
}

interface SeePokemonState {
  evolutionModal: boolean;
}

export default function SeePokemon(props: SeePokemonProps) {
  const [state, setState] = useState<SeePokemonState>({
    evolutionModal: false,
  });

  const addEvolutionClicked = () => {
    setState({ ...state, evolutionModal: true });
  };

  const closeModal = () => {
    setState({ ...state, evolutionModal: false });
  };

  return (
    <Main
      meta={
        <Meta
          title="Pokemon Go"
          description="Calculate the real Pokemons Power !!"
        />
      }
    >
      {state.evolutionModal && (
        <AddEvolutionModal
          closeModal={closeModal}
          defaultPokemonId={props.pokemon.id}
          pokemons={props.pokemons}
        />
      )}
      <h1 className="my-4 text-center">{props.pokemon.name}</h1>
      <PokemonBranch
        directions="both"
        evolutions={props.evolutions}
        mainPokemon={true}
        pokemonId={props.pokemon.id}
        pokemons={props.pokemons}
      />
      <button
        className="mx-auto mt-4 block border border-black p-2"
        onClick={addEvolutionClicked}
      >
        Ajouter une évolution
      </button>
      <ul className="flex flex-col items-start p-2 text-sm xl:text-xl">
        <li className="m-2 border border-black px-4 py-1">
          Pokemon id: {props.pokemon.id}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Type principal: {props.pokemon.main_type}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Meilleur attaque rapide DPS: {props.pokemon.best_quick_move_dps}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Meilleur attaque principale DPS: {props.pokemon.best_main_move_dps}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Attaque: {props.pokemon.attack}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Défense: {props.pokemon.defense}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          HP max: {props.pokemon.max_hp}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          DPS Total: {props.pokemon.total_dps}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Puissance d&apos;attaque: {props.pokemon.attack_power}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Puissance de défense: {props.pokemon.defense_power}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Durée d&apos;un combat contre soi-même:{' '}
          {props.pokemon.fighting_duration}s
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Puissance totale: {props.pokemon.total_power}
        </li>
        <li className="m-2 border border-black px-4 py-1">
          Potentiel max (avec les évolutions):{' '}
          {props.pokemon.power_max_potential}
        </li>
      </ul>
    </Main>
  );
}

export async function getServerSideProps(context: any) {
  const pokemonId: string = context.params!.id;

  return {
    props: {
      evolutions: await getEvolutions(),
      pokemon: await getPokemon(pokemonId),
      pokemons: await getPokemonsOrderedName(),
    },
  };
}
