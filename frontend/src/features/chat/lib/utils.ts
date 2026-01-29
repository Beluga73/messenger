import { Message } from "@/features/chat/types";

export const flattenMessages = (pages: any[]): Message[] => {
  return pages.flatMap((page) => page.messages);
};
