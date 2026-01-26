import { Conversation, Message, SearchUserResult } from "@/features/chat/types";
import { api } from "@/shared/lib/api";

export interface FetchMessagesParams {
  conversationId: string;
  skip: number;
  take?: number;
}

export interface FetchMessagesResponse {
  messages: Message[];
  hasMore: boolean;
}

export const fetchConversation = async (conversationId: string): Promise<Conversation> => {
  return api.get<Conversation>(`/api/messages/conversations/${conversationId}`);
};

export const fetchConversations = async (): Promise<Conversation[]> => {
  return api.get<Conversation[]>("/api/messages/conversations");
};

export const fetchMessages = async ({
  conversationId,
  skip,
  take = 50,
}: FetchMessagesParams): Promise<FetchMessagesResponse> => {
  const messages = await api.get<Message[]>(
    `/api/messages/conversation/${conversationId}?skip=${skip}&take=${take}`
  );

  return {
    messages: messages || [],
    hasMore: (messages || []).length === take,
  };
};

export async function searchUsersByUsername(query: string): Promise<SearchUserResult[]> {
  return api.get<SearchUserResult[]>(`/api/search/username?query=${encodeURIComponent(query)}`);
}

export const createConversation = async (targetUserId: string): Promise<Conversation> => {
  const body = {
    targetUserId,
  };
  return api.post<Conversation>("/api/messages/conversations/start", body);
};
