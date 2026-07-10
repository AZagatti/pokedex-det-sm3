const cache = new Map<string, unknown>();

export async function cachedFetch<T>(
  url: string,
  fetcher: typeof fetch,
  parse: (data: unknown) => T
): Promise<T> {
  const hit = cache.get(url);
  if (hit !== undefined) {
    return hit as T;
  }

  const response = await fetcher(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  const raw = await response.json();
  const parsed = parse(raw);
  cache.set(url, parsed);
  return parsed;
}

export function clearCache(): void {
  cache.clear();
}
