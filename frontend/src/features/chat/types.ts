export interface ChatItem {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
  isFromMe: boolean;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

// TODO: move that directly in ChatWindow file?
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
