import {
  getPokemonList,
  getTypeList,
  getTypeDetail,
  idFromUrl,
} from "$lib/api/client";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const list = await getPokemonList(fetch, 2000, 0);
  const typeList = await getTypeList(fetch);
  const relevantTypes = typeList.results.filter(
    (t) => t.name !== "unknown" && t.name !== "shadow"
  );
  const typeDetails = await Promise.all(
    relevantTypes.map((t) => getTypeDetail(fetch, t.name))
  );

  const typesByPokemonId = new Map<number, string[]>();
  for (const detail of typeDetails) {
    for (const entry of detail.pokemon) {
      const id = idFromUrl(entry.pokemon.url);
      const existing = typesByPokemonId.get(id) ?? [];
      existing[entry.slot - 1] = detail.name;
      typesByPokemonId.set(id, existing);
    }
  }

  return {
    allPokemon: list.results,
    typesByPokemonId: Object.fromEntries(
      [...typesByPokemonId].map(([id, types]) => [id, types.filter(Boolean)])
    ),
  };
};
