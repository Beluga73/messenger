import { Skeleton } from "@/shared/components/ui/skeleton";

export const ChatListSkeleton = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="chat-header bg-muted/20 animate-pulse mb-2" />
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center p-3">
            <Skeleton className="h-12 w-12 rounded-full mr-3" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
