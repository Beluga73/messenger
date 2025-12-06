import { Separator } from "@/shared/components/ui/separator";

interface MessageDateSeparatorProps {
  date: Date;
}

export function MessageDateSeparator({ date }: MessageDateSeparatorProps) {
  const formatDate = (d: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (d.getFullYear() === today.getFullYear()) {
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    } else {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex items-center gap-3 my-6">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground font-medium">
        {formatDate(date)}
      </span>
      <Separator className="flex-1" />
    </div>
  );
}
