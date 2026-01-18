import { useRef, useLayoutEffect, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useParams } from "react-router-dom";
import { useTokenStore } from "@/stores/tokenStore";
import { ChatHeader } from "./ChatHeader/ChatHeader";
import { MessageBubble } from "./MessageBubble/MessageBubble";
import { MessageInput } from "./MessageInput/MessageInput";
import { Message, ChatHeaderData } from "@/features/chat/types";
import {
  useMessages,
  flattenMessages,
} from "@/features/chat/hooks/useMessages";

// Mock data for now
const mockChatHeader: ChatHeaderData = {
  id: "1",
  title: "John Doe",
  image: "",
  isGroup: false,
  lastSeenOnline: new Date(Date.now() - 300000), // 5 min ago
};

export function ChatWindow() {
  const { id: conversationId } = useParams<{ id: string }>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const { jwtToken } = useTokenStore();

  // Decode current user ID from JWT token
  let currentUserId = "";
  if (jwtToken) {
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      currentUserId = payload.sub || payload.nameid || "";
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }
  const isLoadingMoreRef = useRef(false);

  // Fetch messages with infinite query
  const { data, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage } =
    useMessages(conversationId!);
  console.log(data);

  const messages = data ? flattenMessages(data.pages) : [];

  // Handle scroll position preservation when loading older messages
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Store scroll height before new messages are added
    if (isFetchingPreviousPage) {
      prevScrollHeightRef.current = container.scrollHeight;
      isLoadingMoreRef.current = true;
    }

    // Restore scroll position after messages are added
    if (isLoadingMoreRef.current && !isFetchingPreviousPage) {
      const heightDifference =
        container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop += heightDifference;
      isLoadingMoreRef.current = false;
    }
  }, [isFetchingPreviousPage]);

  useEffect(() => {
    rowVirtualizer.scrollToIndex(messages.length - 1, {
      // align: "end",
    });
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || isFetchingPreviousPage) return;

    // Only auto-scroll if user is already near the bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, isFetchingPreviousPage]);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: () => 100,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // Fetch previous page when scrolling near top
  useEffect(() => {
    const [firstItem] = virtualItems;

    if (!firstItem) {
      return;
    }

    if (firstItem.index <= 5 && hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
  }, [
    virtualItems,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  ]);

  const handleSendMessage = (message: string) => {
    // TODO: Implement sending message with mutation
    console.log("Send message:", message);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <ChatHeader chat={mockChatHeader} />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          contain: "strict",
          overflowAnchor: "none",
        }}
      >
        {/* Loading indicator for older messages */}
        {isFetchingPreviousPage && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          </div>
        )}

        <div
          className="w-full relative"
          style={{
            height: `${totalSize}px`,
          }}
        >
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.key}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div
                ref={rowVirtualizer.measureElement}
                data-index={virtualItem.index}
                className="px-4 pb-3"
              >
                <MessageBubble
                  message={messages[virtualItem.index]}
                  isCurrentUserMessage={
                    messages[virtualItem.index].senderId === currentUserId
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
