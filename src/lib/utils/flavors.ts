export const FLAVOR_COLORS: Record<string, string> = {
  bitter: "#588850",
  dry: "#f0a840",
  sour: "#a8d848",
  spicy: "#e0603c",
  sweet: "#f870a0",
};

export function flavorColor(flavor: string): string {
  return FLAVOR_COLORS[flavor] ?? "#94a3b8";
}
