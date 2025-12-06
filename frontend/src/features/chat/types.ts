export interface ChatItem {
  id: string;
  image: string;
  title: string;
  lastMessage: string;
  isFromMe: boolean;
  isRead: boolean;
  time: Date;
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
