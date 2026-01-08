import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "./ChatHeader";
import { ChatHeaderData } from "@/features/chat/types";

const meta: Meta<typeof ChatHeader> = {
  title: "Chat/ChatHeader",
  component: ChatHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const groupChat: ChatHeaderData = {
  id: "1",
  image: "https://via.placeholder.com/50",
  title: "Project Team",
  isGroup: true,
  memberCount: 8,
};

const privateChat: ChatHeaderData = {
  id: "2",
  image: "https://via.placeholder.com/50",
  title: "John Doe",
  isGroup: false,
  lastSeenOnline: new Date(Date.now() - 5 * 60 * 1000),
};

const privateOfflineChat: ChatHeaderData = {
  id: "3",
  image: "https://via.placeholder.com/50",
  title: "Jane Smith",
  isGroup: false,
  lastSeenOnline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
};

export const GroupChat: Story = {
  args: {
    chat: groupChat,
    onSearch: () => console.log("Search clicked"),
    onOptions: () => console.log("Options clicked"),
  },
};

export const PrivateChat: Story = {
  args: {
    chat: privateChat,
    onSearch: () => console.log("Search clicked"),
    onOptions: () => console.log("Options clicked"),
  },
};

export const PrivateOfflineChat: Story = {
  args: {
    chat: privateOfflineChat,
    onSearch: () => console.log("Search clicked"),
    onOptions: () => console.log("Options clicked"),
  },
};