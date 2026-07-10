const STORAGE_KEY = "pokedex-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

class ThemeStore {
  current = $state<Theme>("light");

  constructor() {
    if (typeof window !== "undefined") {
      this.current = getInitialTheme();
      $effect.root(() => {
        $effect(() => {
          document.documentElement.classList.toggle(
            "dark",
            this.current === "dark"
          );
          localStorage.setItem(STORAGE_KEY, this.current);
        });
      });
    }
  }

  toggle() {
    this.current = this.current === "light" ? "dark" : "light";
  }
}

export const themeStore = new ThemeStore();
