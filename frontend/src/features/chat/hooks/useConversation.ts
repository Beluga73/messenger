import { useQuery } from "@tanstack/react-query";
import { fetchConversation } from "../lib/fetchConversation";

export const useConversation = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => {
      if (!conversationId) throw new Error("Conversation ID is required");
      return fetchConversation(conversationId);
    },
    enabled: !!conversationId,
    // Keep data fresh but cache it, similar to useConversations but maybe not Infinity if we want updates?
    // User didn't specify, but I'll stick to a reasonable default or the user's standard.
    // existing useConversations uses Infinity. I'll stick to defaults or maybe Infinity too if it's static-ish.
    // However, for detail view, user status or last message might update.
    // I'll leave default options for now unless I see a pattern to override.
  });
};
