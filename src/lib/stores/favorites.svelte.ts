const STORAGE_KEY = "pokedex-favorites";

function loadFavorites(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

class FavoritesStore {
  names = $state<Set<string>>(new Set());

  constructor() {
    if (typeof window !== "undefined") {
      this.names = loadFavorites();
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.names]));
    }
  }

  has(name: string): boolean {
    return this.names.has(name);
  }

  toggle(name: string) {
    const next = new Set(this.names);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    this.names = next;
    this.persist();
  }
}

export const favoritesStore = new FavoritesStore();
