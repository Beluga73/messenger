import { fetchWrapper } from "@/shared/lib/fetchWrapper";
import { buildUrl } from "@/shared/lib/buildUrl";
import { Message } from "@/features/chat/types";

export interface FetchMessagesParams {
  conversationId: string;
  skip: number;
  take?: number;
}

export interface FetchMessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

export const fetchMessages = async ({
  conversationId,
  skip,
  take = 50,
}: FetchMessagesParams): Promise<FetchMessagesResponse> => {
  const url = buildUrl(
    `/api/messages/conversation/${conversationId}?skip=${skip}&take=${take}`,
  );
  const messages = await fetchWrapper(url, "GET");

  return {
    messages: messages || [],
    hasMore: (messages || []).length === take,
  };
};
