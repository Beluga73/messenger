import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStore {
  jwtToken: string | null;
  refreshToken: string | null;
  setTokens: (jwtToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      jwtToken: null,
      refreshToken: null,

      setTokens: (jwtToken: string, refreshToken: string) => {
        set({ jwtToken, refreshToken });
      },

      clearTokens: () => {
        set({ jwtToken: null, refreshToken: null });
      },
    }),
    {
      name: "token-store",
    }
  )
);
