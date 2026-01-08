import type { Meta, StoryObj } from "@storybook/react";
import { ChatList } from "./ChatList";
import { ChatItem } from "@/features/chat/types";

const meta: Meta<typeof ChatList> = {
  title: "Chat/ChatList",
  component: ChatList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleChats: ChatItem[] = [
  {
    id: "1",
    image: "https://via.placeholder.com/50",
    title: "John Doe",
    lastMessage: "Hey, how are you?",
    isFromMe: false,
    isRead: true,
    time: new Date(),
    unreadCount: 0,
  },
  {
    id: "2",
    image: "https://via.placeholder.com/50",
    title: "Jane Smith",
    lastMessage: "Let's catch up soon!",
    isFromMe: true,
    isRead: true,
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 2,
  },
  {
    id: "3",
    image: "https://via.placeholder.com/50",
    title: "Group Chat",
    lastMessage: "Alice: Meeting at 3 PM",
    isFromMe: false,
    isRead: false,
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 5,
  },
];

export const Default: Story = {
  args: {
    chats: sampleChats,
  },
};

export const Empty: Story = {
  args: {
    chats: [],
  },
};
