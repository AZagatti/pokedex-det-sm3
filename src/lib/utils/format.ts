export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatName(name: string): string {
  return name
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");
}

export function padId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

export function idFromUrl(url: string): number {
  const match = url.match(/\/(?<id>\d+)\/?$/u);
  return match ? Number(match.groups?.id) : 0;
}
