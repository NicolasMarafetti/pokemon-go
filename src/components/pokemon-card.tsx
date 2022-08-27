import type { Evolution, Pokemon } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

import {
  getPokemonImageSource,
  getPokemonTypeBackgroundSource,
} from '@/utils/pokemon-helpers';

interface PokemonCardProps {
  className?: string;
  evolutions: Evolution[];
  mainPokemon: boolean;
  pokemon: Pokemon;
  pokemons: Pokemon[];
  size: 'small' | 'big';
}

export default function PokemonCard(props: PokemonCardProps) {
  return (
    <div
      className={`flex w-fit items-center justify-center  ${
        props.className ? props.className : ''
      } ${props.size === 'small' ? 'flex-col' : 'm-2'}`}
    >
      <div
        className={`border border-black bg-cover bg-center ${
          props.size === 'small' ? '' : 'mr-4'
        }`}
        style={{
          backgroundImage: `url('${getPokemonTypeBackgroundSource(
            props.pokemon.main_type
          )}')`,
        }}
      >
        <Image
          alt={props.pokemon.name}
          height={props.size === 'small' ? '80' : `128`}
          src={getPokemonImageSource(props.pokemon.image_name)}
          width={props.size === 'small' ? '80' : `128`}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2
          className={`inline-block border-collapse ${
            props.size === 'small' ? 'text-sm' : 'text-4xl'
          } ${props.mainPokemon ? 'font-bold' : 'font-light'}`}
        >
          {props.pokemon.name}
        </h2>
        <span
          className={`inline-block border-collapse ${
            props.size === 'small' ? 'text-sm' : ''
          }`}
        >
          {props.size === 'small' ? '' : 'Puissance : '}
          {props.pokemon.total_power}
        </span>
        {props.size === 'big' && (
          <span className={`inline-block border-collapse`}>
            Puissance max : {props.pokemon.power_max_potential}
          </span>
        )}
      </div>
    </div>
  );
}
