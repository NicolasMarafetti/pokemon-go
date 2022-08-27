import type { NextApiRequest, NextApiResponse } from 'next';

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

  return res.status(200).json({ pokemon });
}
