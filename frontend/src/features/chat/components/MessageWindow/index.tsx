import { useEffect, useMemo, useRef } from "react";

import { useParams } from "react-router-dom";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

import { flattenMessages, useMessages } from "@/features/chat/hooks/useMessages";
import { FetchMessagesResponse } from "@/features/chat/lib/fetchMessages";
import { Message } from "@/features/chat/types";
import { useSignalRStore } from "@/stores/signalRStore";
import { useTokenStore } from "@/stores/tokenStore";

import { MessageBubble } from "./MessageBubble";

/**
 * MessageWindow smart component
 *
 * Handles all message display logic including:
 * - Fetching messages with infinite scroll
 * - Virtual scrolling for performance
 * - Real-time message updates via SignalR
 * - User identification from JWT token
 */

const getCurrentUser = (jwtToken: string | null) => {
  if (!jwtToken) return;

  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    return payload.sub || payload.unique_name || "";
  } catch (e) {
    console.error("Failed to decode token", e);
  }
};

export function MessageWindow() {
  const { id: conversationId } = useParams<{ id: string }>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { isConnected, on, off, invoke } = useSignalRStore();
  const { jwtToken } = useTokenStore();
  const currentUserId = getCurrentUser(jwtToken);

  const { data, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage } = useMessages(
    conversationId!
  );

  // Join conversation and listen for real-time messages
  useEffect(() => {
    if (isConnected && conversationId) {
      invoke("JoinConversation", conversationId).catch(console.error);

      const handleReceiveMessage = (message: Message) => {
        if (message.conversationId === conversationId) {
          queryClient.setQueryData<InfiniteData<FetchMessagesResponse>>(
            ["messages", conversationId],
            (old) => {
              if (!old) return old;

              // Avoid duplicates across all pages
              const exists = old.pages.some((page) =>
                page.messages.some((m) => m.id === message.id)
              );
              if (exists) return old;

              const newPages = [...old.pages];
              const lastPageIndex = newPages.length - 1;

              // Add message to the most recent page
              newPages[lastPageIndex] = {
                ...newPages[lastPageIndex],
                messages: [...newPages[lastPageIndex].messages, message],
              };

              return { ...old, pages: newPages };
            }
          );
        }
      };

      on("ReceiveMessage", handleReceiveMessage);

      return () => {
        invoke("LeaveConversation", conversationId).catch(console.error);
        off("ReceiveMessage", handleReceiveMessage);
      };
    }
  }, [isConnected, conversationId, queryClient, invoke, on, off]);

  // Extract and flatten messages from paginated data
  const messages = data ? flattenMessages(data.pages) : [];

  // Ensure messages are consistently ordered by date descending (newest at index 0)
  const reversedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
  }, [messages]);

  const rowVirtualizer = useVirtualizer({
    count: reversedMessages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: () => 100, // Estimate row height
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Infinite scroll for loading older messages
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (
      lastItem.index >= reversedMessages.length - 1 &&
      hasPreviousPage &&
      !isFetchingPreviousPage
    ) {
      fetchPreviousPage();
    }
  }, [
    virtualItems,
    reversedMessages.length,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  ]);

  // Fix scroll direction for scaleY(-1)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollTop -= e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto thin-scrollbar"
      style={{
        transform: "scaleY(-1)",
      }}
    >
      <div
        className="w-full relative"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {virtualItems.map((virtualItem) => {
          const message = reversedMessages[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div
                ref={rowVirtualizer.measureElement}
                data-index={virtualItem.index}
                className="px-4 pb-3"
                style={{ transform: "scaleY(-1)" }}
              >
                <MessageBubble
                  message={message}
                  isCurrentUserMessage={message.senderId === currentUserId}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
