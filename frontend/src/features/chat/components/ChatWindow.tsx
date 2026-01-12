import { useEffect, useRef, useState, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { MessageDateSeparator } from "./MessageDateSeparator";
import { MessageInput } from "./MessageInput";
import { Message, ChatHeaderData } from "@/features/chat/types";

interface ChatWindowProps {
  chatHeader: ChatHeaderData;
  messages: Message[];
  onLoadMore?: () => void;
  onSendMessage?: (message: string) => void;
  isLoadingMore?: boolean;
  isLoadingMessages?: boolean;
  hasMoreMessages?: boolean;
}

// Group messages by date
function groupMessagesByDate(messages: Message[]) {
  const groups: Array<{ date: Date; messages: Message[] }> = [];

  for (const message of messages) {
    const messageDate = new Date(message.timestamp);
    messageDate.setHours(0, 0, 0, 0);

    const existingGroup = groups.find(
      (g) => g.date.getTime() === messageDate.getTime()
    );

    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({ date: messageDate, messages: [message] });
    }
  }

  return groups;
}

type VirtualItem = {
  type: "separator" | "message";
  data: Message | Date;
  index: number;
  key: string;
};

export function ChatWindow({
  chatHeader,
  messages,
  onLoadMore,
  onSendMessage,
  isLoadingMore = false,
  isLoadingMessages = false,
  hasMoreMessages = true,
}: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [prevMessagesLength, setPrevMessagesLength] = useState(messages.length);

  // Flatten messages with date separators
  const virtualItems: VirtualItem[] = [];
  const groups = groupMessagesByDate(messages);

  for (const group of groups) {
    virtualItems.push({
      type: "separator",
      data: group.date,
      index: virtualItems.length,
      key: `sep-${group.date.getTime()}`,
    });

    for (const message of group.messages) {
      virtualItems.push({
        type: "message",
        data: message,
        index: virtualItems.length,
        key: `msg-${message.id}`,
      });
    }
  }

  const virtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: useCallback(() => 50, []),
    overscan: 10,
  });

  const virtualRange = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Handle scroll to load more messages
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (container.scrollTop < 100 && hasMoreMessages && !isLoadingMore) {
        const scrollHeight = container.scrollHeight;
        const offsetHeight = container.clientHeight;
        const beforeScrollTop = container.scrollTop;

        onLoadMore?.();

        // Keep scroll position relative to bottom of content
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          const diff = newScrollHeight - scrollHeight;
          container.scrollTop = beforeScrollTop + diff;
        });
      }

      // Check if we're at the bottom
      if (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100
      ) {
        setShouldAutoScroll(true);
      } else {
        setShouldAutoScroll(false);
      }
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMoreMessages, isLoadingMore, onLoadMore]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLength && shouldAutoScroll) {
      setPrevMessagesLength(messages.length);
      if (scrollContainerRef.current) {
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
              scrollContainerRef.current.scrollHeight;
          }
        });
      }
    } else {
      setPrevMessagesLength(messages.length);
    }
  }, [messages.length, shouldAutoScroll, prevMessagesLength]);

  const handleSendMessage = (message: string) => {
    onSendMessage?.(message);
    setShouldAutoScroll(true);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader chat={chatHeader} />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{
          contain: "strict",
        }}
      >
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">
              Loading messages...
            </div>
          </div>
        ) : virtualItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          <div
            style={{
              height: `${totalSize}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualRange.map((virtualItem) => {
              const item = virtualItems[virtualItem.index];

              return (
                <div
                  key={item.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {item.type === "separator" ? (
                    <MessageDateSeparator date={item.data as Date} />
                  ) : (
                    <MessageBubble message={item.data as Message} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
