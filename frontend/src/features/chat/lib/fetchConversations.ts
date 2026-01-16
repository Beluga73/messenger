import { fetchWrapper } from "@/shared/lib/fetchWrapper";
import { buildUrl } from "@/shared/lib/buildUrl";
import { ChatItem } from "@/features/chat/types";

export const fetchConversations = async (): Promise<ChatItem[]> => {
  const url = buildUrl("/api/messages/conversations");
  return fetchWrapper(url, "GET");
};
