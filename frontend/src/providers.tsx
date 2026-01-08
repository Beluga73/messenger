import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeStore } from "@/stores/themeStore";
import type { ReactNode } from "react";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
