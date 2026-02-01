import { useEffect } from "react";
import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";

import { Toaster } from "@/shared/components/ui/sonner";

// import { useThemeStore } from "@/stores/themeStore";

export const RootProviders = async ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const LDProvider = await asyncWithLDProvider({
    clientSideID: import.meta.env.VITE_LAUNCH_DARKLY_CLIENT_SIDE_ID,
  });
  // const initTheme = useThemeStore((state) => state.initTheme);

  // useEffect(() => {
  //   initTheme();
  // }, [initTheme]);

  return (
    <LDProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors />
        {children}
      </QueryClientProvider>
    </LDProvider>
  );
};
