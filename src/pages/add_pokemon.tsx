import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Evolution, Pokemon } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import React, { useState } from 'react';

import PokemonBranch from '@/components/PokemonBranch';
import { Meta } from '@/layouts/Meta';
import prisma from '@/lib/prisma';
import { Main } from '@/templates/Main';
import { getEvolutions } from '@/utils/evolution-server-importable';
import { searchPokemonIdWithName } from '@/utils/pokemon-helpers';

const ObjectID = require('bson-objectid');

interface AddPokemonProps {
  evolutions: Evolution[];
  pokemons: Pokemon[];
}

interface AddPokemonState {
  pokemon: Pokemon;
  evolutions: Evolution[];
  loading: boolean;
}

interface AddPokemonReturnData {
  data: {
    pokemon: Pokemon;
  };
}

export default function AddPokemon(props: AddPokemonProps) {
  const [state, setState] = useState<AddPokemonState>({
    evolutions: [],
    loading: false,
    pokemon: {
      attack: 0,
      best_quick_move_dps: 0,
      best_main_move_dps: 0,
      defense: 0,
      id: 'a',
      image_name: '',
      main_type: '',
      max_hp: 0,
      name: '',
      total_dps: 0,
      attack_power: 0,
      defense_power: 0,
      fighting_duration: 6,
      total_power: 0,
      power_max_potential: 0,
    },
  });

  const router = useRouter();

  const attackChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const attack = parseInt(e.currentTarget.value, 10);

    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        attack: attack || 0,
      },
    });
  };

  const bestQuickMoveDpsChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const bestQuickMoveDps = parseFloat(e.currentTarget.value);

    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        best_quick_move_dps: bestQuickMoveDps || 0,
      },
    });
  };

  const bestMainMoveDpsChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const bestMainMoveDps = parseFloat(e.currentTarget.value);

    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        best_main_move_dps: bestMainMoveDps || 0,
      },
    });
  };

  const defenseChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const defense = parseInt(e.currentTarget.value, 10);

    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        defense: defense || 0,
      },
    });
  };

  const imageNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        image_name: e.currentTarget.value,
      },
    });
  };

  const mainTypeChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        main_type: e.currentTarget.value,
      },
    });
  };

  const maxHpChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const maxHp = parseInt(e.currentTarget.value, 10);

    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        max_hp: maxHp || 0,
      },
    });
  };

  const searchEvolutionsInHtml = (html: HTMLDivElement) => {
    const evolutions: Evolution[] = [];

    const branches = html.querySelectorAll('.branch');

    branches.forEach((branch) => {
      const gens = branch.querySelectorAll('.gen');

      gens.forEach((gen, index) => {
        const pokemonIsActive = !!gen.querySelector('.item.active');

        if (pokemonIsActive) {
          // Search evolutions before
          if (index > 0) {
            const previousGens = gen.previousElementSibling!;
            const previousEvolutionsGenSelectores =
              previousGens.querySelectorAll('a');

            previousEvolutionsGenSelectores.forEach(
              (previousEvolutionSelector) => {
                const previousPokemonName =
                  previousEvolutionSelector.querySelector('.name')!.innerHTML;

                // Search the previous pokemon id
                const previousPokemonId = searchPokemonIdWithName(
                  props.pokemons,
                  previousPokemonName
                );

                if (previousPokemonId) {
                  // Search the candy cost
                  const candyQuantity = parseInt(
                    gen.querySelector('.cost')!.innerHTML,
                    10
                  );

                  // Search if there's an evolution item
                  const evolutionItemSelector =
                    gen.querySelector('.ev-item img');
                  const evolutionItem = evolutionItemSelector
                    ? evolutionItemSelector.getAttribute('alt')
                    : null;

                  // evolution;
                  evolutions.push({
                    id: ObjectID().id,
                    pokemon_start: previousPokemonId,
                    pokemon_after: 'a',
                    candy_quantity: candyQuantity,
                    special_item: evolutionItem,
                  });
                }
              }
            );
          }

          // Search evolutions after
          if (index + 1 < gens.length) {
            const nextGens = gen.nextElementSibling!;
            const nextEvolutionsGenSelectores = nextGens.querySelectorAll('a');

            nextEvolutionsGenSelectores.forEach((nextEvolutionSelector) => {
              const nextPokemonName =
                nextEvolutionSelector.querySelector('.name')!.innerHTML;

              // Search the next pokemon id
              const nextPokemonId = searchPokemonIdWithName(
                props.pokemons,
                nextPokemonName
              );

              if (nextPokemonId) {
                // Search the candy cost
                const candyQuantity = parseInt(
                  nextEvolutionSelector.querySelector('.cost')!.innerHTML,
                  10
                );

                // Search if there's an evolution item
                const evolutionItemSelector =
                  nextEvolutionSelector.querySelector('.ev-item img');
                const evolutionItem = evolutionItemSelector
                  ? evolutionItemSelector.getAttribute('alt')
                  : null;

                // evolution;
                evolutions.push({
                  id: ObjectID().id,
                  pokemon_start: 'a',
                  pokemon_after: nextPokemonId,
                  candy_quantity: candyQuantity,
                  special_item: evolutionItem,
                });
              }
            });
          }
        }
      });
    });

    return evolutions;
  };

  const searchImageNameInHtml = (html: HTMLDivElement) => {
    let imageName = html
      .querySelector('.preview img')!
      .getAttribute('src')
      ?.trim();
    if (!imageName) imageName = '';
    imageName = imageName?.replace('.webp', '');
    imageName = imageName?.replace('.png', '');
    imageName = imageName?.replace(
      'https://images.gameinfo.io/pokemon/256/',
      ''
    );

    return imageName;
  };

  const searchMainTypeInHtml = (html: HTMLDivElement) => {
    let mainType = html
      .querySelector('.large-type .type:first-of-type')!
      .innerHTML.toLowerCase();
    mainType = mainType.replace('é', 'e');
    mainType = mainType.replace('è', 'e');

    return mainType;
  };

  const pastedHtml = (e: ChangeEvent<HTMLInputElement>) => {
    const html = e.currentTarget.value;
    const htmlObject = document.createElement('div');
    htmlObject.innerHTML = html;

    // Search the name
    const name = htmlObject.querySelector('.title h1')!.innerHTML.trim();

    // Search the image name
    const imageName = searchImageNameInHtml(htmlObject);

    const mainType = searchMainTypeInHtml(htmlObject);

    // Search quick move dps
    const bestQuickMoveDps = parseFloat(
      htmlObject.querySelector(
        '.moves:first-of-type tr:first-of-type td:last-of-type'
      )!.innerHTML
    );

    // Search main move dps
    const bestMainMoveDps = parseFloat(
      htmlObject.querySelector(
        '.moves:first-of-type tr:last-of-type td:last-of-type'
      )!.innerHTML
    );

    // Search Attack
    const attack = parseInt(
      htmlObject.querySelector('.table-stats tr:first-of-type td:last-of-type')!
        .innerHTML,
      10
    );

    // Search Defense
    const defense = parseInt(
      htmlObject.querySelector(
        '.table-stats tr:nth-of-type(2) td:last-of-type'
      )!.innerHTML,
      10
    );

    // Search maxHp
    const maxHp = parseInt(
      htmlObject.querySelector(
        '.table-stats:nth-of-type(4) tr td:last-of-type'
      )!.innerHTML,
      10
    );

    // Search evolutions
    const evolutions = searchEvolutionsInHtml(htmlObject);

    setState({
      ...state,
      evolutions,
      pokemon: {
        ...state.pokemon,
        attack,
        best_quick_move_dps: bestQuickMoveDps,
        best_main_move_dps: bestMainMoveDps,
        defense,
        image_name: imageName,
        main_type: mainType,
        max_hp: maxHp,
        name,
      },
    });
  };

  const pokemonAlreadyExist = () => {
    const pokemonsCorresponding = props.pokemons.filter(
      (pokemonTest) =>
        pokemonTest.name.toLowerCase() === state.pokemon.name.toLowerCase()
    );

    return pokemonsCorresponding.length > 0;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState({ ...state, loading: true });

    const body = {
      name: state.pokemon.name,
      main_type: state.pokemon.main_type,
      best_quick_move_dps: state.pokemon.best_quick_move_dps,
      best_main_move_dps: state.pokemon.best_main_move_dps,
      attack: state.pokemon.attack,
      defense: state.pokemon.defense,
      max_hp: state.pokemon.max_hp,
      image_name: state.pokemon.image_name,
      evolutions: state.evolutions,
    };

    const data: AddPokemonReturnData = await axios.post('/api/pokemon', body);

    router.push(`/pokemon/${data.data.pokemon.id}`);
  };

  const updateName = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      pokemon: {
        ...state.pokemon,
        name: e.currentTarget.value,
      },
    });
  };

  return (
    <Main meta={<Meta title="Add Pokemon" description="Add a Pokemon" />}>
      <h1 className="my-4 text-center">Pokemon Go</h1>
      <h2 className="my-4 text-center">Add a Pokemon</h2>
      <form className="pl-4 text-sm xl:text-4xl" onSubmit={submit}>
        <div className="flex">
          <div>
            <div className="my-1">
              <label className="mr-4" htmlFor="pastehtml">
                Coller la page
              </label>
              <input
                className={`rounded-xl border border-black px-2`}
                id="pastehtml"
                onChange={pastedHtml}
                type="text"
                value=""
              />
            </div>
            <div className="my-1">
              <label className="mr-4" htmlFor="name">
                Nom
              </label>
              <input
                className={`rounded-xl border px-2 ${
                  pokemonAlreadyExist()
                    ? 'border-8 border-red-500'
                    : 'border-black'
                }`}
                id="name"
                onChange={updateName}
                type="text"
                required
                value={state.pokemon.name}
              />
            </div>
            <div className="my-1">
              <label className=" mr-4" htmlFor="image_name">
                Image Name
              </label>
              <input
                className="rounded-xl  border border-black px-2"
                id="image_name"
                onChange={imageNameChanged}
                type="text"
                required
                value={state.pokemon.image_name}
              />
            </div>
            <div>
              <label className=" mr-4" htmlFor="main_type">
                Type Principal (en minuscule)
              </label>
              <input
                className="rounded-xl border border-black px-2"
                id="main_type"
                onChange={mainTypeChanged}
                type="text"
                required
                value={state.pokemon.main_type}
              />
            </div>
            <div className="my-1">
              <label className="mr-4" htmlFor="best_quick_move_dps">
                Best Quick Move DPS
              </label>
              <input
                className="rounded-xl border border-black px-2"
                id="best_quick_move_dps"
                onChange={bestQuickMoveDpsChanged}
                type="number"
                step="0.01"
                required
                value={state.pokemon.best_quick_move_dps}
              />
            </div>
            <div className="my-1">
              <label className="mr-4" htmlFor="best_main_move_dps">
                Best Main Move DPS
              </label>
              <input
                className="rounded-xl border border-black px-2"
                id="best_main_move_dps"
                onChange={bestMainMoveDpsChanged}
                type="number"
                step="0.01"
                required
                value={state.pokemon.best_main_move_dps}
              />
            </div>
            <div className="my-1">
              <label className="mr-4" htmlFor="attack">
                Stat - Attack
              </label>
              <input
                className="rounded-xl border border-black px-2"
                id="attack"
                onChange={attackChanged}
                type="number"
                required
                value={state.pokemon.attack}
              />
            </div>
            <div className="my-1">
              <label className="mr-4" htmlFor="defense">
                Stat - Defense
              </label>
              <input
                className="rounded-xl border border-black px-2"
                id="defense"
                onChange={defenseChanged}
                type="number"
                required
                value={state.pokemon.defense}
              />
            </div>
            <div className="my-1">
              <label className="mr-4" htmlFor="max_hp">
                Max HP (Carefull it&apos;s not Stat - Stamina)
              </label>
              <input
                className="rounded-xl border border-black px-2"
                id="max_hp"
                onChange={maxHpChanged}
                type="number"
                required
                value={state.pokemon.max_hp}
              />
            </div>
          </div>

          <div>
            <h3>Evolutions</h3>
            <PokemonBranch
              directions="both"
              evolutions={[...props.evolutions, ...state.evolutions]}
              mainPokemon={true}
              pokemonId="a"
              pokemons={[...props.pokemons, state.pokemon]}
            />
          </div>
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
      evolutions: await getEvolutions(),
      pokemons: await prisma.pokemon.findMany({}),
    },
  };
}
