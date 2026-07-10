export const TYPE_COLORS: Record<string, string> = {
  bug: "#a8b820",
  dark: "#705848",
  dragon: "#7038f8",
  electric: "#f8d030",
  fairy: "#ee99ac",
  fighting: "#c03028",
  fire: "#f08030",
  flying: "#a890f0",
  ghost: "#705898",
  grass: "#78c850",
  ground: "#e0c068",
  ice: "#98d8d8",
  normal: "#a8a878",
  poison: "#a040a0",
  psychic: "#f85888",
  rock: "#b8a038",
  steel: "#b8b8d0",
  water: "#6890f0",
};

export const ALL_TYPES = Object.keys(TYPE_COLORS);

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? "#68a090";
}

export function typeGradient(type: string): string {
  const color = typeColor(type);
  return `linear-gradient(160deg, ${color} 0%, color-mix(in srgb, ${color} 60%, black) 100%)`;
}

function relativeLuminance(hex: string): number {
  const rgb = [1, 3, 5].map(
    (i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255
  );
  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

export function typeTextColor(type: string): string {
  return relativeLuminance(typeColor(type)) > 0.5 ? "#1c1c28" : "#ffffff";
}
