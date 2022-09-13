import type { Evolution, Pokemon } from '@prisma/client';

export function evolutionFindStartPokemon(
  evolution: Evolution,
  pokemons: Pokemon[]
) {
  return pokemons.find(
    (pokemonTest) => pokemonTest.id === evolution.pokemon_start
  );
}

export function findPokemonEvolutions(
  direction: 'before' | 'after' | 'both' | 'same',
  onlyDirectEvolution: boolean,
  evolutions: Evolution[],
  pokemonId: string,
  pokemons: Pokemon[]
): { evolution: Evolution; pokemon: Pokemon }[] {
  let totalPokemons: { evolution: Evolution; pokemon: Pokemon }[] = [];

  let pokemonsBefore: { evolution: Evolution; pokemon: Pokemon }[] = [];
  if (direction === 'before' || direction === 'both' || direction === 'same') {
    const evolutionsBefore = evolutions.filter((evolution) => {
      return evolution.pokemon_after === pokemonId;
    });

    for (let i = 0; i < evolutionsBefore.length; i += 1) {
      const pokemonTest = pokemons.find(
        (pokemonTestFind) =>
          pokemonTestFind.id === evolutionsBefore[i]!.pokemon_start
      );

      if (pokemonTest)
        pokemonsBefore.push({
          pokemon: pokemonTest,
          evolution: evolutionsBefore[i]!,
        });
    }
  }

  let pokemonsAfter: { evolution: Evolution; pokemon: Pokemon }[] = [];
  if (direction === 'after' || direction === 'both' || direction === 'same') {
    const evolutionsAfter = evolutions.filter((evolution) => {
      return evolution.pokemon_start === pokemonId;
    });

    for (let i = 0; i < evolutionsAfter.length; i += 1) {
      const pokemonTest = pokemons.find(
        (pokemonTestFind) =>
          pokemonTestFind.id === evolutionsAfter[i]!.pokemon_after
      );

      if (pokemonTest)
        pokemonsAfter.push({
          pokemon: pokemonTest,
          evolution: evolutionsAfter[i]!,
        });
    }
  }

  if (direction !== 'same')
    totalPokemons = [...totalPokemons, ...pokemonsBefore, ...pokemonsAfter];

  // We continue to search far evolutions
  if (!onlyDirectEvolution) {
    while (pokemonsBefore.length > 0 || pokemonsAfter.length > 0) {
      let newPokemonsBefore: { evolution: Evolution; pokemon: Pokemon }[] = [];
      let newPokemonsAfter: { evolution: Evolution; pokemon: Pokemon }[] = [];

      for (let i = 0; i < pokemonsBefore.length; i += 1) {
        newPokemonsBefore = [
          ...newPokemonsBefore,
          ...findPokemonEvolutions(
            'before',
            false,
            evolutions,
            pokemonsBefore[i]!.pokemon.id,
            pokemons
          ),
        ];
      }

      for (let i = 0; i < pokemonsAfter.length; i += 1) {
        newPokemonsAfter = [
          ...newPokemonsAfter,
          ...findPokemonEvolutions(
            'after',
            false,
            evolutions,
            pokemonsAfter[i]!.pokemon.id,
            pokemons
          ),
        ];
      }

      totalPokemons = [
        ...totalPokemons,
        ...newPokemonsBefore,
        ...newPokemonsAfter,
      ];

      pokemonsBefore = newPokemonsBefore;
      pokemonsAfter = newPokemonsAfter;
    }
  }

  // We search pokemons on the same level, with the before pokemons link
  if (direction === 'same') {
    for (let i = 0; i < pokemonsBefore.length; i += 1) {
      const pokemonsAfterTmp = findPokemonEvolutions(
        'after',
        true,
        evolutions,
        pokemonsBefore[i]!.pokemon.id,
        pokemons
      );

      for (let y = 0; y < pokemonsAfterTmp.length; y += 1) {
        if (pokemonsAfterTmp[y]!.pokemon.id !== pokemonId) {
          let isAlreadyIncluded = false;
          for (let z = 0; z < totalPokemons.length; z += 1) {
            if (
              totalPokemons[z]!.pokemon.id === pokemonsAfterTmp[y]!.pokemon.id
            )
              isAlreadyIncluded = true;
          }

          if (!isAlreadyIncluded) {
            totalPokemons.push(pokemonsAfterTmp[y]!);
          }
        }
      }
    }
  }

  return totalPokemons;
}

export function getEvolutionSpecialItemSource(specialItem: string) {
  switch (specialItem) {
    case 'Pierre Sinnoh':
      return 'https://images.gameinfo.io/items/48/bag-sinnoh-stone-sprite.png';
    case 'Pierre Unys':
      return 'https://images.gameinfo.io/items/48/bag-unova-stone-sprite.png';
    case 'Roche Royale':
      return 'https://images.gameinfo.io/items/48/bag-kings-rock-sprite.png';
    default:
      return '';
  }
}

export function searchPokemonPrecedentEvolution(
  pokemonId: string,
  evolutions: Evolution[]
): Evolution | null {
  const evolutionsCorresponding = evolutions.filter(
    (evolutionTest) => evolutionTest.pokemon_after === pokemonId
  );

  return evolutionsCorresponding.length ? evolutionsCorresponding[0]! : null;
}
