import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Evolution } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

import { getEvolutionSpecialItemSource } from '@/utils/evolution-helpers';

interface EvolutionArrowProps {
  evolution: Evolution;
}

export default function EvolutionArrow(props: EvolutionArrowProps) {
  return (
    <div className="flex flex-col items-center text-sm xl:text-lg">
      <p className="m-0">{props.evolution.candy_quantity}</p>
      <FontAwesomeIcon className="mx-4 h-12" icon={faLongArrowAltRight} />
      {props.evolution.special_item ? (
        <Image
          src={getEvolutionSpecialItemSource(props.evolution.special_item)}
          width="24"
          height="24"
          alt={props.evolution.special_item}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
