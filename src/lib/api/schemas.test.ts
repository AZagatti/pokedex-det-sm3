import { describe, expect, it } from "vitest";

import { pokemonSchema, berrySchema } from "./schemas";

describe("pokemonSchema", () => {
  it("parses a minimal valid pokemon payload", () => {
    const sample = {
      abilities: [
        { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
      ],
      base_experience: 112,
      cries: { latest: "https://example.com/cry.ogg", legacy: null },
      height: 4,
      id: 25,
      moves: [
        {
          move: { name: "thunder-shock", url: "" },
          version_group_details: [],
        },
      ],
      name: "pikachu",
      species: { name: "pikachu", url: "" },
      sprites: {
        front_default: null,
        front_shiny: null,
        other: {
          "official-artwork": { front_default: null, front_shiny: null },
        },
      },
      stats: [{ base_stat: 35, effort: 0, stat: { name: "hp", url: "" } }],
      types: [{ slot: 1, type: { name: "electric", url: "" } }],
      weight: 60,
    };

    expect(() => pokemonSchema.parse(sample)).not.toThrow();
  });
});

describe("berrySchema", () => {
  it("parses a minimal valid berry payload", () => {
    const sample = {
      firmness: { name: "soft", url: "" },
      flavors: [{ flavor: { name: "spicy", url: "" }, potency: 10 }],
      growth_time: 3,
      id: 1,
      item: { name: "cheri-berry", url: "" },
      max_harvest: 5,
      name: "cheri",
      natural_gift_power: 60,
      natural_gift_type: { name: "fire", url: "" },
      size: 20,
      smoothness: 25,
    };

    expect(() => berrySchema.parse(sample)).not.toThrow();
  });
});
