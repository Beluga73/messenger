import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Search, MoreVertical } from "lucide-react";
import { ChatHeaderData } from "@/features/chat/types";
import { ChatHeaderOptionsMenu } from "./ChatHeaderOptionsMenu";

interface ChatHeaderProps {
  chat: ChatHeaderData;
  onSearch: () => void;
}

export function ChatHeader({ chat, onSearch }: ChatHeaderProps) {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  // EXTRACT in lib/ as helper
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "online";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={chat.image} alt={chat.title} />
            <AvatarFallback>{chat.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{chat.title}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.isGroup
                ? `${chat.memberCount} members`
                : chat.lastSeenOnline
                  ? `seen ${formatLastSeen(chat.lastSeenOnline)}`
                  : "offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearch}
            className="shrink-0"
            disabled
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOptionsMenuOpen(true)}
            className="shrink-0"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ChatHeaderOptionsMenu
        isOpen={isOptionsMenuOpen}
        onClose={() => setIsOptionsMenuOpen(false)}
      />
    </>
  );
}
