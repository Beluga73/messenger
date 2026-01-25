import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchMessages } from "../lib/api";

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = 0 }) =>
      fetchMessages({
        conversationId,
        skip: pageParam as number,
        take: 50,
      }),
    initialPageParam: 0,
    getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
      if (!firstPage.hasMore) return undefined;
      return (firstPageParam as number) + 50;
    },
    getNextPageParam: () => undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
