import type { Meta, StoryObj } from "@storybook/react";
import { ChatWindow } from "./ChatWindow";
import { ChatHeaderData, Message } from "@/features/chat/types";
import { useState } from "react";

const meta: Meta<typeof ChatWindow> = {
  title: "Chat/ChatWindow",
  component: ChatWindow,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const chatHeader: ChatHeaderData = {
  id: "1",
  image: "https://via.placeholder.com/50",
  title: "John Doe",
  isGroup: false,
  lastSeenOnline: new Date(Date.now() - 5 * 60 * 1000),
};

const generateMessages = (count: number, offset: number = 0): Message[] => {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    const isFromMe = (i + offset) % 2 === 0;
    messages.push({
      id: `msg-${i + offset}`,
      content: isFromMe
        ? `This is my message ${i + offset}`
        : `This is a message from John ${i + offset}`,
      senderId: isFromMe ? "me" : "john",
      senderName: isFromMe ? "Me" : "John",
      timestamp: new Date(Date.now() - (100 - i - offset) * 60 * 1000),
      isRead: true,
      isFromMe,
    });
  }
  return messages;
};

const ChatWindowWrapper = () => {
  const [messages, setMessages] = useState<Message[]>(generateMessages(50));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setMessages((prev) => [...generateMessages(30, prev.length), ...prev]);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: `msg-${messages.length}`,
      content: message,
      senderId: "me",
      senderName: "Me",
      timestamp: new Date(),
      isRead: true,
      isFromMe: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-screen">
      <ChatWindow
        chatHeader={chatHeader}
        messages={messages}
        onLoadMore={handleLoadMore}
        onSendMessage={handleSendMessage}
        isLoadingMore={isLoadingMore}
        hasMoreMessages={messages.length < 200}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <ChatWindowWrapper />,
};
