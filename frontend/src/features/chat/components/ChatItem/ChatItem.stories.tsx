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
  userId: "some-user-id",
  userName: "John Doe",
  userAvatarUrl: "https://via.placeholder.com/50",
  lastMessage:
    "Hey, how are you doing today? This is a longer message to test truncation.",
  lastMessageAt: new Date().toISOString(),
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
      lastMessage: "Sure, let's meet tomorrow!",
    },
  },
};

export const SentByMeUnread: Story = {
  args: {
    chat: {
      ...sampleChat,
      lastMessage: "What time works for you?",
    },
  },
};

export const OldMessage: Story = {
  args: {
    chat: {
      ...sampleChat,
      lastMessageAt: new Date(
        Date.now() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(), // 8 days ago
    },
  },
};
