import { fetchWrapper } from "@/shared/lib/fetchWrapper";
import { buildUrl } from "@/shared/lib/buildUrl";
import { Conversation } from "@/features/chat/types";

export const fetchConversation = async (
  conversationId: string
): Promise<Conversation> => {
  const url = buildUrl(`/api/messages/conversations/${conversationId}`);
  return fetchWrapper(url, "GET");
};
