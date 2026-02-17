import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (theme: Theme) => {
        set({ theme });

        const root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      },

      toggleTheme: () => {
        const current = get().theme;
        const newTheme = current === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },
    }),
    {
      name: "theme-store",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
