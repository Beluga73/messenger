import type { Meta, StoryObj } from "@storybook/react";
import { ChatItem } from "./ChatItem";
import { ChatItem as ChatItemType } from "@/features/chat/types";

const meta: Meta<typeof ChatItem> = {
  title: "Chat/ChatItem",
  component: ChatItem,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleChat: ChatItemType = {
  id: "1",
  image: "https://via.placeholder.com/50",
  title: "John Doe",
  lastMessage:
    "Hey, how are you doing today? This is a longer message to test truncation.",
  isFromMe: false,
  isRead: true,
  time: new Date(),
  unreadCount: 0,
};

export const Default: Story = {
  args: {
    chat: sampleChat,
  },
};

export const Unread: Story = {
  args: {
    chat: {
      ...sampleChat,
      unreadCount: 3,
    },
  },
};

export const SentByMeRead: Story = {
  args: {
    chat: {
      ...sampleChat,
      isFromMe: true,
      isRead: true,
      lastMessage: "Sure, let's meet tomorrow!",
    },
  },
};

export const SentByMeUnread: Story = {
  args: {
    chat: {
      ...sampleChat,
      isFromMe: true,
      isRead: false,
      lastMessage: "What time works for you?",
    },
  },
};

export const OldMessage: Story = {
  args: {
    chat: {
      ...sampleChat,
      time: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    },
  },
};
