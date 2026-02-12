export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  lastMessage: Message | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt?: string;
}

// TODO: move that directly in ChatWindow file?
// Random comment to check if cloudflare preview for develop will work
export interface ChatHeaderData {
  id: string;
  image: string;
  title: string;
  isGroup: boolean;
  memberCount?: number;
  lastSeenOnline?: Date;
}

export interface SearchUserResult {
  id: string;
  username: string;
  name: string | null;
  phoneNumber: string;
  avatarUrl: string;
  status: string | null;
}
