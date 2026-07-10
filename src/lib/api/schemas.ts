import { z } from "zod";

export const namedResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type NamedResource = z.infer<typeof namedResourceSchema>;

export const pokemonListItemSchema = namedResourceSchema;

export const pokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(pokemonListItemSchema),
});
export type PokemonList = z.infer<typeof pokemonListSchema>;

const pokemonSpriteOtherSchema = z.object({
  home: z
    .object({
      front_default: z.string().nullable().optional(),
      front_shiny: z.string().nullable().optional(),
    })
    .optional(),
  "official-artwork": z
    .object({
      front_default: z.string().nullable().optional(),
      front_shiny: z.string().nullable().optional(),
    })
    .optional(),
});

const pokemonSpritesSchema = z.object({
  back_default: z.string().nullable().optional(),
  back_shiny: z.string().nullable().optional(),
  front_default: z.string().nullable().optional(),
  front_shiny: z.string().nullable().optional(),
  other: pokemonSpriteOtherSchema.optional(),
});
export type PokemonSprites = z.infer<typeof pokemonSpritesSchema>;

const pokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: namedResourceSchema,
});

const pokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: namedResourceSchema,
});
export type PokemonStat = z.infer<typeof pokemonStatSchema>;

const pokemonAbilitySchema = z.object({
  ability: namedResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});
export type PokemonAbility = z.infer<typeof pokemonAbilitySchema>;

const pokemonMoveSchema = z.object({
  move: namedResourceSchema,
});

const pokemonCriesSchema = z.object({
  latest: z.string().nullable().optional(),
  legacy: z.string().nullable().optional(),
});

export const pokemonSchema = z.object({
  abilities: z.array(pokemonAbilitySchema),
  base_experience: z.number().nullable(),
  cries: pokemonCriesSchema.optional(),
  height: z.number(),
  id: z.number(),
  moves: z.array(pokemonMoveSchema),
  name: z.string(),
  species: namedResourceSchema,
  sprites: pokemonSpritesSchema,
  stats: z.array(pokemonStatSchema),
  types: z.array(pokemonTypeSlotSchema),
  weight: z.number(),
});
export type Pokemon = z.infer<typeof pokemonSchema>;

const flavorTextEntrySchema = z.object({
  flavor_text: z.string(),
  language: namedResourceSchema,
  version: namedResourceSchema.optional(),
});

const generaSchema = z.object({
  genus: z.string(),
  language: namedResourceSchema,
});

export const pokemonSpeciesSchema = z.object({
  evolution_chain: z.object({ url: z.string() }).nullable(),
  flavor_text_entries: z.array(flavorTextEntrySchema),
  genera: z.array(generaSchema),
  generation: namedResourceSchema,
  id: z.number(),
  is_legendary: z.boolean(),
  is_mythical: z.boolean(),
  name: z.string(),
});
export type PokemonSpecies = z.infer<typeof pokemonSpeciesSchema>;

export interface EvolutionChainLink {
  species: NamedResource;
  min_level: number | null;
  trigger_name: string | null;
  evolves_to: EvolutionChainLink[];
}

const evolutionDetailSchema = z.object({
  min_level: z.number().nullable(),
  trigger: namedResourceSchema.nullable(),
});

const evolutionChainLinkSchema: z.ZodType<EvolutionChainLink> = z.lazy(() =>
  z.object({
    evolves_to: z.array(evolutionChainLinkSchema),
    min_level: z.number().nullable().default(null),
    species: namedResourceSchema,
    trigger_name: z.string().nullable().default(null),
  })
);

const rawEvolutionChainLinkSchema: z.ZodType<{
  species: NamedResource;
  evolution_details: z.infer<typeof evolutionDetailSchema>[];
  evolves_to: unknown[];
}> = z.lazy(() =>
  z.object({
    evolution_details: z.array(evolutionDetailSchema),
    evolves_to: z.array(rawEvolutionChainLinkSchema),
    species: namedResourceSchema,
  })
);

export const evolutionChainSchema = z.object({
  chain: rawEvolutionChainLinkSchema,
  id: z.number(),
});
export type EvolutionChain = z.infer<typeof evolutionChainSchema>;

export function normalizeEvolutionChain(
  raw: z.infer<typeof rawEvolutionChainLinkSchema>
): EvolutionChainLink {
  const [detail] = raw.evolution_details;
  return {
    evolves_to: raw.evolves_to.map((child) =>
      normalizeEvolutionChain(
        child as z.infer<typeof rawEvolutionChainLinkSchema>
      )
    ),
    min_level: detail?.min_level ?? null,
    species: raw.species,
    trigger_name: detail?.trigger?.name ?? null,
  };
}

export const typeListSchema = z.object({
  results: z.array(namedResourceSchema),
});

export const generationListSchema = z.object({
  results: z.array(namedResourceSchema),
});

export const typeDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: namedResourceSchema,
      slot: z.number(),
    })
  ),
});
export type TypeDetail = z.infer<typeof typeDetailSchema>;

export const generationDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(namedResourceSchema),
});
export type GenerationDetail = z.infer<typeof generationDetailSchema>;

const berryFlavorSchema = z.object({
  flavor: namedResourceSchema,
  potency: z.number(),
});

export const berrySchema = z.object({
  firmness: namedResourceSchema,
  flavors: z.array(berryFlavorSchema),
  growth_time: z.number(),
  id: z.number(),
  item: namedResourceSchema,
  max_harvest: z.number(),
  name: z.string(),
  natural_gift_power: z.number(),
  natural_gift_type: namedResourceSchema,
  size: z.number(),
  smoothness: z.number(),
});
export type Berry = z.infer<typeof berrySchema>;

export const berryListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  results: z.array(namedResourceSchema),
});
export type BerryList = z.infer<typeof berryListSchema>;
