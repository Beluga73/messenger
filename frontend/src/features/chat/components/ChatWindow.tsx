import { useRef, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useParams } from "react-router-dom";
import { useTokenStore } from "@/stores/tokenStore";
import { ChatHeader } from "./ChatHeader/ChatHeader";
import { MessageBubble } from "./MessageBubble/MessageBubble";
import { MessageInput } from "./MessageInput/MessageInput";
import { ChatHeaderData } from "@/features/chat/types";
import {
  useMessages,
  flattenMessages,
} from "@/features/chat/hooks/useMessages";
import { useConversation } from "@/features/chat/hooks/useConversation";

// This is bad, rewrite with sth else
const getCurrentUser = (jwtToken: string | null) => {
  if (!jwtToken) return;

  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    return payload.sub || payload.unique_name || "";
  } catch (e) {
    console.error("Failed to decode token", e);
  }
};

export function ChatWindow() {
  const { id: conversationId } = useParams<{ id: string }>();
  const { data: conversation } = useConversation(conversationId);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { jwtToken } = useTokenStore();
  let currentUserId = getCurrentUser(jwtToken);

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

  const { data, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage } =
    useMessages(conversationId!);

  // 1. REVERSE THE DATA: Newest message is now Index 0
  // This places the newest messages at the "start" of the list (which is the bottom visually with scaleY(-1))
  const messages = data ? flattenMessages(data.pages) : [];
  // Memoize the reversed array to avoid unnecessary re-renders or calculations
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const rowVirtualizer = useVirtualizer({
    count: reversedMessages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: () => 100, // Estimate row height
    overscan: 10,
    onChange: (_instance) => {
      // Logic for unread badges could go here
    },
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 2. INFINITE SCROLL (Load Older Messages)
  // With scaleY(-1), "End" of the list (index N) is visually at the TOP.
  // We check if we are scrolling near the end (visually top).
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    // Logic: If the last visible item (highest index) is near the actual total count
    // This happens when the user scrolls "Up" (visually) -> "Down" (logically in virtualizer)
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

  // 3. FIX SCROLL DIRECTION FOR scaleY(-1)
  // The inversion makes the scroll wheel work backwards. We need to manually intercept and invert it back.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // We manually apply the scroll delta.
      // Normally scrolling 'down' (deltaY > 0) increases scrollTop.
      // But because we want the opposite visual feel (scrolling 'up' to go 'down' into history),
      // we subtract the delta. Or effectively, we want 'natural' scrolling to feel correct.
      // Experimentally, subtracting deltaY fixes the "reversed" feeling on touchpads with scaleY(-1).
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollTop -= e.deltaY;
      }
    };

    // 'passive: false' is required to use preventDefault()
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader chat={chatHeaderData} onSearch={handleSearch} />
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto thin-scrollbar"
        style={{
          // INVERT THE CONTAINER
          // This puts scrollTop: 0 at the VISUAL BOTTOM.
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
                {/* 
                  INVERT THE CONTENT BACK 
                  So the text isn't upside down.
                */}
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
      <MessageInput onSendMessage={() => {}} />
    </div>
  );
}
