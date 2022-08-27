import Link from 'next/link';
import React from 'react';

export default function Menu() {
  return (
    <nav>
      <ul className="flex">
        <li className="m-2 rounded-xl border border-black p-2">
          <Link href="/">
            <a>Accueil</a>
          </Link>
        </li>
        <li className="m-2 rounded-xl border border-black p-2">
          <Link href="/add_pokemon">
            <a>Ajouter un Pokémon</a>
          </Link>
        </li>
        <li className="m-2 rounded-xl border border-black p-2">
          <Link href="/test_pokemon">
            <a>Tester un Pokémon</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
