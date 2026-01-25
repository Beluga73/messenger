import { useQuery } from "@tanstack/react-query";

import { fetchConversations } from "../lib/api";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
