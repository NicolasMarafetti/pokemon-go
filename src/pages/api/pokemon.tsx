import type { Evolution } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { saveEvolutions } from '@/utils/evolution-server';
import { savePokemon } from '@/utils/pokemon-server';

interface AddPokemonRequest extends NextApiRequest {
  body: {
    name: string;
    main_type: string;
    best_quick_move_dps: number;
    best_main_move_dps: number;
    attack: number;
    defense: number;
    max_hp: number;
    image_name: string;
    evolutions: Evolution[];
  };
}

export default async function AddPokemon(
  req: AddPokemonRequest,
  res: NextApiResponse
) {
  const { name, attack, defense } = req.body;
  const bestQuickMoveDps = req.body.best_quick_move_dps;
  const bestMainMoveDps = req.body.best_main_move_dps;
  const maxHp = req.body.max_hp;
  const imageName = req.body.image_name;
  const mainType = req.body.main_type;
  const { evolutions } = req.body;

  const pokemon = await savePokemon(
    name,
    mainType,
    bestQuickMoveDps,
    bestMainMoveDps,
    attack,
    defense,
    maxHp,
    imageName
  );

  const evolutionsUpdated = evolutions.map((evolutionTmp) => {
    const evolutionUpdated: Evolution = { ...evolutionTmp };
    if (evolutionUpdated.pokemon_after === 'a')
      evolutionUpdated.pokemon_after = pokemon.id;
    if (evolutionUpdated.pokemon_start === 'a')
      evolutionUpdated.pokemon_start = pokemon.id;
    return evolutionUpdated;
  });

  await saveEvolutions(evolutionsUpdated);

  return res.status(200).json({ pokemon });
}
