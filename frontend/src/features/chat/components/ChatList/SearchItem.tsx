import { useNavigate } from "react-router-dom";

import { Loader2, UserPlus } from "lucide-react";

import { SearchUserResult } from "@/features/chat/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";

import { useCreateConversation } from "../../hooks/useCreateConversation";

interface SearchItemProps {
  user: SearchUserResult;
  handleClick: () => void;
}

export function SearchItem({ user, handleClick }: SearchItemProps) {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateConversation();
  const displayName = user.name || user.username;
  const displaySubtitle = user.name ? user.username : user.phoneNumber;

  const handleCreateChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newConversation = await mutateAsync(user.id);
      handleClick(); // Close dropdown
      navigate(`/chats/${newConversation.id}`);
    } catch {
      // Error is handled by the hook's toast
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-sm group">
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
            <span className="text-xs flex-shrink-0 text-green-300">{user.status}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{displaySubtitle}</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCreateChat}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
