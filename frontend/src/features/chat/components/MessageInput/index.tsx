import { FC, memo, useCallback, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import EmojiPicker from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";

import { useConversation } from "@/features/chat/hooks/useConversation";
import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Textarea } from "@/shared/components/ui/textarea";
import { useSignalRStore } from "@/stores/signalRStore";

/**
 * MessageInput smart component
 *
 * Handles message input and sending via SignalR
 */
export const MessageInput: FC = memo(() => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { data: conversation } = useConversation(conversationId);
  const { isConnected, invoke } = useSignalRStore();

  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() && conversation?.userId && isConnected) {
      setIsLoading(true);
      try {
        await invoke("SendMessage", {
          content: message.trim(),
          recipientId: conversation.userId,
        });
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (error) {
        console.error("Failed to send message", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [message, conversation?.userId, isConnected, invoke]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setMessage(target.value);

    target.style.height = "auto";
    const newHeight = Math.min(target.scrollHeight, 120);
    target.style.height = `${newHeight}px`;
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    // TODO: From UI/UX standpoint, do we need this?
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="flex items-end gap-2 p-4 border-t border-border bg-background">
      <Popover open={openEmoji} onOpenChange={setOpenEmoji} modal={false}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0" disabled={isLoading}>
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-fit p-0 border-none shadow-lg"
          onFocusOutside={(e) => e.preventDefault()}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} width={350} height={400} />
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" className="shrink-0" disabled={isLoading}>
        <Paperclip className="h-5 w-5" />
      </Button>

      <Textarea
        ref={textareaRef}
        placeholder="Write a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="min-h-10 max-h-32 resize-none"
        rows={1}
      />

      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        size="icon"
        className="shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
});

MessageInput.displayName = "MessageInput";
