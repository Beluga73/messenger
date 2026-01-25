import { useEffect } from "react";
import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/shared/components/ui/sonner";
import { useThemeStore } from "@/stores/themeStore";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
      {children}
    </QueryClientProvider>
  );
};
