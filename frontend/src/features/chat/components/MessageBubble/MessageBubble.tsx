import { Check } from "lucide-react";
import { Message } from "@/features/chat/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className={`flex ${
        message.isFromMe ? "justify-end" : "justify-start"
      } mb-3`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl relative ${
          message.isFromMe
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none"
        }`}
      >
        {message.replyTo && (
          <div
            className={`mb-2 pb-2 border-l-2 ${
              message.isFromMe
                ? "border-primary-foreground"
                : "border-secondary-foreground"
            } pl-2 opacity-75 text-sm`}
          >
            <p className="font-semibold">{message.replyTo.senderName}</p>
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}
        <p className="break-words">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">
            {formatTime(message.timestamp)}
          </span>
          {message.isFromMe && (
            <div className="flex -space-x-1">
              <Check className="h-3 w-3" />
              {message.isRead && <Check className="h-3 w-3" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
