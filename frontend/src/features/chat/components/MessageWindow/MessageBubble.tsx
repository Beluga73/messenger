import { FC, memo } from "react";
import { Check } from "lucide-react";
import { Message } from "@/features/chat/types";

interface MessageBubbleProps {
  message: Message;
  isCurrentUserMessage?: boolean;
}

export const MessageBubble: FC<MessageBubbleProps> = memo(
  ({ message, isCurrentUserMessage = false }) => {
    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return (
      <div
        className={`flex ${
          isCurrentUserMessage ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl relative ${
            isCurrentUserMessage
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-secondary text-secondary-foreground rounded-bl-none"
          }`}
        >
          <p className="break-words">{message.content}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-xs opacity-70">
              {formatTime(message.sentAt)}
            </span>
            {isCurrentUserMessage && (
              <div className="flex -space-x-1">
                <Check className="h-3 w-3" />
                {message.isRead && <Check className="h-3 w-3" />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";
