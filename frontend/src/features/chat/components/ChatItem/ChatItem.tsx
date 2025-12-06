import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Check } from "lucide-react";
import { formatChatTime } from "@/lib/utils";
import { ChatItem as ChatItemType } from "@/features/chat/types";

interface ChatItemProps {
  chat: ChatItemType;
}

export function ChatItem({ chat }: ChatItemProps) {
  const truncatedMessage =
    chat.lastMessage.length > 30
      ? `${chat.lastMessage.slice(0, 30).trim()}...`
      : chat.lastMessage;

  return (
    <div className="flex items-center p-3 hover:bg-accent/50 cursor-pointer transition-colors">
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={chat.image} alt={chat.title} />
        <AvatarFallback>{chat.title.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{chat.title}</h3>
          <span className="text-xs text-muted-foreground">
            {formatChatTime(chat.time)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground truncate">
            {truncatedMessage}
          </p>
          <div className="flex items-center space-x-1">
            {chat.isFromMe && (
              <div className="flex">
                <Check className="h-3 w-3 text-muted-foreground" />
                {chat.isRead && (
                  <Check className="h-3 w-3 text-muted-foreground -ml-1" />
                )}
              </div>
            )}
            {chat.unreadCount > 0 && (
              <Badge
                variant="default"
                className="h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
