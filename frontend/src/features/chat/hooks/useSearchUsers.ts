import { useQuery } from "@tanstack/react-query";

import { searchUsersByUsername } from "../lib/api";

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["search-users", query],
    queryFn: () => searchUsersByUsername(query),
    enabled: !!query,
    retry: 1,
    gcTime: 60 * 1000,
    staleTime: 0,
  });
}
