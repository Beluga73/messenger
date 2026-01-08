import type { Meta, StoryObj } from "@storybook/react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/features/chat/types";

const meta: Meta<typeof MessageBubble> = {
  title: "Chat/MessageBubble",
  component: MessageBubble,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseSentMessage: Message = {
  id: "1",
  content: "Hey, how are you doing?",
  senderId: "me",
  senderName: "Me",
  timestamp: new Date(),
  isRead: true,
  isFromMe: true,
};

const baseReceivedMessage: Message = {
  id: "2",
  content: "I'm doing great, thanks for asking!",
  senderId: "other",
  senderName: "John",
  timestamp: new Date(Date.now() - 5 * 60 * 1000),
  isRead: true,
  isFromMe: false,
};

export const SentRead: Story = {
  args: {
    message: baseSentMessage,
  },
};

export const SentUnread: Story = {
  args: {
    message: {
      ...baseSentMessage,
      isRead: false,
    },
  },
};

export const Received: Story = {
  args: {
    message: baseReceivedMessage,
  },
};

export const LongMessage: Story = {
  args: {
    message: {
      ...baseSentMessage,
      content:
        "This is a much longer message to test how the component handles text wrapping and multiple lines. It should wrap nicely and maintain readability.",
    },
  },
};

export const WithReply: Story = {
  args: {
    message: {
      ...baseSentMessage,
      content: "That sounds great!",
      replyTo: {
        id: "2",
        content: "Let's meet up tomorrow",
        senderName: "John",
      },
    },
  },
};

export const ReceivedWithReply: Story = {
  args: {
    message: {
      ...baseReceivedMessage,
      content: "Sure, I'm free at 3 PM",
      replyTo: {
        id: "1",
        content: "Let's meet up tomorrow",
        senderName: "Me",
      },
    },
  },
};
