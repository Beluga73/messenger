import { FC, memo, useLayoutEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import { Paperclip, Send } from "lucide-react";

import { useConversation } from "@/features/chat/hooks/useConversation";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useSignalRStore } from "@/stores/signalRStore";

import { EmojiPicker } from "./EmojiPicker";

export const MessageInput: FC = memo(() => {
  const { id: conversationId } = useParams<{ id: string }>();
  const { data: conversation } = useConversation(conversationId);
  const { isConnected, invoke } = useSignalRStore();

  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursor, setCursor] = useState<number | null>(null);

  const handleSendMessage = async () => {
    if (message.trim() && conversation?.userId && isConnected) {
      try {
        await invoke("SendMessage", {
          content: message.trim(),
          recipientId: conversation.userId,
        });
        setMessage("");
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setMessage(target.value);
  };

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const pos = textarea.selectionStart;
    const newMessage = message.substring(0, pos) + emoji + message.substring(pos);

    setMessage(newMessage);
    setCursor(pos + emoji.length);
  };

  useLayoutEffect(() => {
    if (textareaRef.current && cursor !== null) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursor, cursor);
      setCursor(null); // Reset so it doesn't trigger on every keystroke
    }
  }, [message, cursor]);

  return (
    <div className="chat-footer items-end pb-4 gap-2">
      <Button variant="ghost" size="icon" className="shrink-0">
        <Paperclip className="h-5 w-5" />
      </Button>

      <Textarea
        ref={textareaRef}
        placeholder="Write a message..."
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="min-h-10 resize-none z-10 max-h-84 overflow-y-auto"
        rows={1}
      />

      <EmojiPicker onEmojiClick={handleEmojiClick} />

      <Button
        onClick={handleSendMessage}
        disabled={!message.trim()}
        size="icon"
        className="shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
});

MessageInput.displayName = "MessageInput";
