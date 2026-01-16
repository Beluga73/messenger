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

export interface ChatHeaderData {
  id: string;
  image: string;
  title: string;
  isGroup: boolean;
  memberCount?: number;
  lastSeenOnline?: Date;
}
