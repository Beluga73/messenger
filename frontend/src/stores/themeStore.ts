import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",

  setTheme: (theme: Theme) => {
    set({ theme });
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  },

  toggleTheme: () => {
    const current = get().theme;
    const newTheme = current === "light" ? "dark" : "light";
    get().setTheme(newTheme);
  },

  initTheme: () => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      get().setTheme(saved);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme = prefersDark ? "dark" : "light";
    get().setTheme(theme);
  },
}));
