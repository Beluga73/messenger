import { useState, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Send, Paperclip, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function MessageInput({
  onSendMessage,
  isLoading = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openEmoji, setOpenEmoji] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
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
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={isLoading}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-fit p-0 border-none shadow-lg"
          onFocusOutside={(e) => e.preventDefault()}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={350}
            height={400}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        disabled={isLoading}
      >
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
}
