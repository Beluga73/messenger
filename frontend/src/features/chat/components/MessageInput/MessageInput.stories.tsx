import type { Meta, StoryObj } from "@storybook/react";
import { MessageInput } from "./MessageInput";
import { useState } from "react";

const meta: Meta<typeof MessageInput> = {
  title: "Chat/MessageInput",
  component: MessageInput,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const MessageInputWrapper = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, message]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            No messages yet. Start typing below!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className="mb-2 p-3 bg-primary text-primary-foreground rounded-lg"
            >
              {msg}
            </div>
          ))
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export const Default: Story = {
  render: () => <MessageInputWrapper />,
};

export const Loading: Story = {
  args: {
    onSendMessage: () => {},
    isLoading: true,
  },
};
