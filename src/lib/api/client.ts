import { cachedFetch } from "./cache";
import {
  berryListSchema,
  berrySchema,
  evolutionChainSchema,
  generationDetailSchema,
  generationListSchema,
  pokemonListSchema,
  pokemonSchema,
  pokemonSpeciesSchema,
  typeDetailSchema,
  typeListSchema,
} from "./schemas";
import type {
  Berry,
  BerryList,
  EvolutionChain,
  GenerationDetail,
  NamedResource,
  Pokemon,
  PokemonSpecies,
  TypeDetail,
} from "./schemas";

const BASE = "https://pokeapi.co/api/v2";

export function getPokemonList(
  fetcher: typeof fetch,
  limit: number,
  offset: number
) {
  return cachedFetch(
    `${BASE}/pokemon?limit=${limit}&offset=${offset}`,
    fetcher,
    (data) => pokemonListSchema.parse(data)
  );
}

export function getPokemon(
  fetcher: typeof fetch,
  nameOrId: string | number
): Promise<Pokemon> {
  return cachedFetch(`${BASE}/pokemon/${nameOrId}`, fetcher, (data) =>
    pokemonSchema.parse(data)
  );
}

export function getPokemonSpecies(
  fetcher: typeof fetch,
  nameOrId: string | number
): Promise<PokemonSpecies> {
  return cachedFetch(`${BASE}/pokemon-species/${nameOrId}`, fetcher, (data) =>
    pokemonSpeciesSchema.parse(data)
  );
}

export function getEvolutionChain(
  fetcher: typeof fetch,
  url: string
): Promise<EvolutionChain> {
  return cachedFetch(url, fetcher, (data) => evolutionChainSchema.parse(data));
}

export function getTypeList(fetcher: typeof fetch): Promise<{
  results: NamedResource[];
}> {
  return cachedFetch(`${BASE}/type?limit=30`, fetcher, (data) =>
    typeListSchema.parse(data)
  );
}

export function getGenerationList(fetcher: typeof fetch): Promise<{
  results: NamedResource[];
}> {
  return cachedFetch(`${BASE}/generation?limit=20`, fetcher, (data) =>
    generationListSchema.parse(data)
  );
}

export function getTypeDetail(
  fetcher: typeof fetch,
  name: string
): Promise<TypeDetail> {
  return cachedFetch(`${BASE}/type/${name}`, fetcher, (data) =>
    typeDetailSchema.parse(data)
  );
}

export function getGenerationDetail(
  fetcher: typeof fetch,
  name: string
): Promise<GenerationDetail> {
  return cachedFetch(`${BASE}/generation/${name}`, fetcher, (data) =>
    generationDetailSchema.parse(data)
  );
}

export function getBerryList(fetcher: typeof fetch): Promise<BerryList> {
  return cachedFetch(`${BASE}/berry?limit=100`, fetcher, (data) =>
    berryListSchema.parse(data)
  );
}

export function getBerry(
  fetcher: typeof fetch,
  nameOrId: string | number
): Promise<Berry> {
  return cachedFetch(`${BASE}/berry/${nameOrId}`, fetcher, (data) =>
    berrySchema.parse(data)
  );
}

export function idFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts.at(-1));
}
