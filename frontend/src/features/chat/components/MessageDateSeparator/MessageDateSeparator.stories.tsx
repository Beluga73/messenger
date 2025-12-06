import type { Meta, StoryObj } from "@storybook/react";
import { MessageDateSeparator } from "./MessageDateSeparator";

const meta: Meta<typeof MessageDateSeparator> = {
  title: "Chat/MessageDateSeparator",
  component: MessageDateSeparator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Today: Story = {
  args: {
    date: new Date(),
  },
};

export const Yesterday: Story = {
  args: {
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
};

export const LastWeek: Story = {
  args: {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
};

export const LastMonth: Story = {
  args: {
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
};

export const LastYear: Story = {
  args: {
    date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  },
};
