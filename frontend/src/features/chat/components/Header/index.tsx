import { useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import { MoreVertical, Search } from "lucide-react";

import { useConversation } from "@/features/chat/hooks/useConversation";
import { ChatHeaderData } from "@/features/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { ChatHeaderOptionsMenu } from "./ChatHeaderOptionsMenu";

/**
 * ChatHeader smart component
 *
 * Fetches conversation data and displays:
 * - User/conversation info
 * - Avatar and title
 * - Last seen status
 * - Search and options menu
 */
export function ChatHeader() {
  const { id: conversationId } = useParams<{ id: string }>();
  const { data: conversation } = useConversation(conversationId);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const chatHeaderData: ChatHeaderData = useMemo(() => {
    return {
      id: conversation?.id || conversationId || "",
      title: conversation?.userName || "Loading...",
      image: conversation?.userAvatarUrl || "",
      isGroup: false,
    };
  }, [conversation, conversationId]);

  const handleSearch = () => {
    // TODO: implement search
  };

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
      <div className="chat-header justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={chatHeaderData.image} alt={chatHeaderData.title} />
            <AvatarFallback>{chatHeaderData.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{chatHeaderData.title}</h2>
            <p className="text-xs text-muted-foreground">
              {chatHeaderData.isGroup
                ? `${chatHeaderData.memberCount} members`
                : chatHeaderData.lastSeenOnline
                  ? `seen ${formatLastSeen(chatHeaderData.lastSeenOnline)}`
                  : "offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSearch} className="shrink-0" disabled>
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
