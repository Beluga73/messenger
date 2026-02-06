import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/shared/components/ui/sonner";

export const RootProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
      {children}
    </QueryClientProvider>
  );
};
