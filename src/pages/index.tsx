import type { Evolution, Pokemon } from '@prisma/client';
import Link from 'next/link';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import PokemonCard from '@/components/pokemon-card';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { getEvolutions } from '@/utils/evolution-server';
import { getPokemons } from '@/utils/pokemon-server';

interface IndexProps {
  evolutions: Evolution[];
  pokemons: Pokemon[];
}

interface IndexState {
  search: string;
}

const Index = (props: IndexProps) => {
  const [state, setState] = useState<IndexState>({
    search: '',
  });

  const modifySearch = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      search: e.currentTarget.value,
    });
  };

  const activePokemons: Pokemon[] = state.search
    ? props.pokemons.filter((pokemonTest) =>
        pokemonTest.name.toLowerCase().includes(state.search.toLowerCase())
      )
    : props.pokemons;

  return (
    <Main
      meta={
        <Meta
          title="Pokemon Go"
          description="Calculate the real Pokemons Power !!"
        />
      }
    >
      <h1 className="text-center">Pokemon Go</h1>
      <input
        className="mx-auto block border border-black"
        onChange={modifySearch}
        placeholder="Search"
        type="text"
        value={state.search}
      />
      <ul className="flex flex-wrap">
        {activePokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <Link href={`/pokemon/${pokemon.id}`}>
              <a>
                <PokemonCard
                  evolutions={props.evolutions}
                  mainPokemon={false}
                  pokemon={pokemon}
                  pokemons={props.pokemons}
                  size="big"
                />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Main>
  );
};

export default Index;

export async function getServerSideProps() {
  return {
    props: {
      evolutions: await getEvolutions(),
      pokemons: await getPokemons(),
    },
  };
}
