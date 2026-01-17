import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { SearchUserResult } from "@/features/chat/types";

interface SearchItemProps {
  user: SearchUserResult;
  handleClick: () => void;
}

export function SearchItem({ user, handleClick }: SearchItemProps) {
  const displayName = user.name || user.username;
  const displaySubtitle = user.name ? user.username : user.phoneNumber;

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded-sm hover:bg-accent/50 transition-colors"
      onClick={handleClick}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={user.avatarUrl} alt={displayName} />
        <AvatarFallback className="text-xs font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm font-medium truncate">{displayName}</h3>
          {user.status && (
            <span className="text-xs flex-shrink-0 text-green-300">
              {user.status}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
}
