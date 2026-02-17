import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Picker } from "emoji-picker-element";
import "emoji-picker-element";
import type { EmojiClickEvent } from "emoji-picker-element/shared";
import { Smile } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useThemeStore } from "@/stores/themeStore";

interface EmojiPickerProps {
  onEmojiClick: (unicode: string) => void;
}

const OPEN_DELAY = 300;
const CLOSE_DELAY = 300;

export const EmojiPicker: FC<EmojiPickerProps> = ({ onEmojiClick }) => {
  const [open, setOpen] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const { theme } = useThemeStore();

  const setPickerRef = useCallback(
    (node: Picker | null) => {
      if (!node) return;

      const handleEmoji = (e: EmojiClickEvent) => {
        if (e.detail.unicode) {
          onEmojiClick(e.detail.unicode);
        }
      };

      node.addEventListener("emoji-click", handleEmoji);
    },
    [onEmojiClick]
  );

  const handleMouseEnter = () => {
    if (open && closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    if (!open) {
      openTimeoutRef.current = setTimeout(() => {
        setOpen(true);
      }, OPEN_DELAY);
    }
  };

  const handleMouseLeave = () => {
    if (!open && openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }

    if (open) {
      closeTimeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, CLOSE_DELAY);
    }
  };

  useEffect(
    () => () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="start"
          className="w-fit p-0 border-none shadow-lg"
          // stop popup from automatically stealing focus
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <emoji-picker
            ref={setPickerRef}
            class={theme}
            onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
          ></emoji-picker>
        </PopoverContent>
      </div>
    </Popover>
  );
};
