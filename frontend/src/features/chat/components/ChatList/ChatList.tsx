import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ChatItem as ChatItemComponent } from "../ChatItem";
import { ChatItem } from "@/features/chat/types";

interface ChatListProps {
  chats: ChatItem[];
}

export function ChatList({ chats }: ChatListProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="space-y-0">
        {chats.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4">
            No conversations yet
          </div>
        ) : (
          chats.map((chat) => <ChatItemComponent key={chat.id} chat={chat} />)
        )}
      </div>
    </ScrollArea>
  );
}
