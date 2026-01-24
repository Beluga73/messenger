import { useEffect } from "react";

import { useSignalRStore } from "@/stores/signalRStore";
import { useTokenStore } from "@/stores/tokenStore";

import { ChatHeader } from "./Header";
import { MessageInput } from "./MessageInput";
import { MessageWindow } from "./MessageWindow";

/**
 * ChatWindow - Main chat container
 *
 * Composes three fully smart sub-components:
 * - ChatHeader: fetches and displays conversation info
 * - MessageWindow: fetches, displays, and manages messages
 * - MessageInput: handles message sending
 *
 * Manages:
 * - SignalR connection setup
 */

export function ChatWindow() {
  const { connect, isConnected } = useSignalRStore();
  const { jwtToken } = useTokenStore();

  // SignalR connection setup
  useEffect(() => {
    if (jwtToken && !isConnected) {
      connect().catch(console.error);
    }
  }, [jwtToken, isConnected, connect]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <MessageWindow />
      <MessageInput />
    </div>
  );
}
