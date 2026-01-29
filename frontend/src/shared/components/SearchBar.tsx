import { useEffect, useRef, useState } from "react";

import { Command, CommandInput } from "cmdk";

// TODO: Move to features/chat, it's locally used
// for calls another one would be used

interface SearchBarProps {
  handleSubmit: (query: string) => void;
  handleFocus?: () => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  handleSubmit,
  handleFocus,
  placeholder = "Search... ",
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Mac");

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSubmit(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, handleSubmit, debounceMs]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Cmd/Ctrl+K to focus
      const isShortcut =
        key === "k" && ((isMac && e.metaKey) || (!isMac && (e.ctrlKey || e.ctrlKey)));
      if (isShortcut) {
        // don't trigger when typing in input/textarea or contentEditable
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const tag = target.tagName?.toLowerCase();
        const isEditable = tag === "input" || tag === "textarea" || target.isContentEditable;
        if (isEditable) return;

        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMac]);

  return (
    <Command className="relative w-full">
      <CommandInput
        ref={inputRef}
        value={query}
        onValueChange={setQuery}
        placeholder={placeholder}
        className="w-full h-8 px-2 py-1 pr-10 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label={placeholder}
        onFocus={handleFocus}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQuery("");
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
        {isMac ? "⌘" : "Ctrl"}K
      </span>
    </Command>
  );
}
