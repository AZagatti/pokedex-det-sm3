import { describe, expect, it } from "vitest";

import { typeColor, typeGradient, ALL_TYPES } from "./types";

describe("typeColor", () => {
  it("returns a known color for a valid type", () => {
    expect(typeColor("fire")).toBe("#f08030");
  });

  it("falls back to a default color for unknown types", () => {
    expect(typeColor("unknown-type")).toBe("#68a090");
  });

  it("has a color for every listed type", () => {
    for (const type of ALL_TYPES) {
      expect(typeColor(type)).toMatch(/^#[0-9a-f]{6}$/u);
    }
  });
});

describe("typeGradient", () => {
  it("produces a css linear-gradient string", () => {
    expect(typeGradient("water")).toContain("linear-gradient");
  });
});
