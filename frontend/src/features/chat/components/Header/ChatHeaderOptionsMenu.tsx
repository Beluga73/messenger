import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface ChatHeaderOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatHeaderOptionsMenu({ isOpen, onClose }: ChatHeaderOptionsMenuProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />
      )}

      {/* Slide-out panel from right */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Options</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center h-[calc(100%-80px)]">
          <p className="text-muted-foreground text-center">Coming soon...</p>
        </div>
      </div>
    </>
  );
}
