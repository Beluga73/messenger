import { fetchWrapper } from "@/shared/lib/fetchWrapper";
import { buildUrl } from "@/shared/lib/buildUrl";
import { Conversation } from "@/features/chat/types";

export const fetchConversations = async (): Promise<Conversation[]> => {
  const url = buildUrl("/api/messages/conversations");
  return fetchWrapper(url, "GET");
};
