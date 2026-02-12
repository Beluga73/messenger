import { formatChatTime } from "@/features/chat/lib/formatters";
import { Conversation } from "@/features/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

interface ChatItemProps {
  chat: Conversation;
  handleClick: () => void;
  selected?: boolean;
}

export function ChatItem({ chat, handleClick, selected = false }: ChatItemProps) {
  const truncatedMessage =
    chat.lastMessage?.content && chat.lastMessage.content.length > 30
      ? `${chat.lastMessage.content.slice(0, 30).trim()}...`
      : chat.lastMessage?.content || "No messages yet";

  const lastMessageDate = new Date(chat.lastMessageAt);

  return (
    <div
      className={`flex items-center p-3 hover:bg-accent/50 cursor-pointer transition-colors ${
        selected ? "bg-accent/30" : ""
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={chat.userAvatarUrl} alt={chat.userName} />
        <AvatarFallback>{chat.userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{chat.userName}</h3>
          <span className="text-xs text-muted-foreground">{formatChatTime(lastMessageDate)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground truncate">{truncatedMessage}</p>
          {chat.unreadCount > 0 && (
            <Badge
              variant="default"
              className="h-5 w-5 p-0 flex items-center justify-center text-xs ml-2"
            >
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
