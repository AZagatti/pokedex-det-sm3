import { describe, expect, it } from "vitest";

import { capitalize, formatName, idFromUrl, padId } from "./format";

describe("capitalize", () => {
  it("uppercases the first letter", () => {
    expect(capitalize("pikachu")).toBe("Pikachu");
  });
});

describe("formatName", () => {
  it("formats hyphenated names into title case", () => {
    expect(formatName("mr-mime")).toBe("Mr Mime");
  });

  it("handles single-word names", () => {
    expect(formatName("bulbasaur")).toBe("Bulbasaur");
  });
});

describe("padId", () => {
  it("pads ids to three digits", () => {
    expect(padId(1)).toBe("#001");
    expect(padId(25)).toBe("#025");
    expect(padId(1024)).toBe("#1024");
  });
});

describe("idFromUrl", () => {
  it("extracts the trailing numeric id", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  it("returns 0 for urls with no id", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/")).toBe(0);
  });
});
