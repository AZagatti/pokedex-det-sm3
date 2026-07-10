import {
  getEvolutionChain,
  getPokemon,
  getPokemonSpecies,
} from "$lib/api/client";
import { normalizeEvolutionChain } from "$lib/api/schemas";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
  let pokemon: Awaited<ReturnType<typeof getPokemon>>;
  try {
    pokemon = await getPokemon(fetch, params.name);
  } catch {
    error(404, "Pokémon not found");
  }

  const species = await getPokemonSpecies(fetch, pokemon.species.name);
  let evolutionChain = null;
  if (species.evolution_chain) {
    const evolutionData = await getEvolutionChain(
      fetch,
      species.evolution_chain.url
    );
    evolutionChain = normalizeEvolutionChain(evolutionData.chain);
  }

  return { evolutionChain, pokemon, species };
};
