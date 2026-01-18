import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMessages } from "../lib/fetchMessages";
import { Message } from "@/features/chat/types";

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = 0 }) =>
      fetchMessages({
        conversationId,
        skip: pageParam,
        take: 50,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length * 50;
    },
    getPreviousPageParam: (firstPage, pages) => {
      if (pages.length === 1) return undefined;
      return (pages.length - 1) * 50 - 50;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// TODO: Move outside hooks folder in lib
export const flattenMessages = (pages: any[]): Message[] => {
  return pages.flatMap((page) => page.messages);
};
