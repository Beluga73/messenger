import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { SearchBar } from "@/shared/components/SearchBar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useConversations, useSearchUsers } from "../../hooks";
import { ChatItem } from "./ChatItem";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { SearchItem } from "./SearchItem";

export function ChatList() {
  const { data: convos, isPending } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isPending: isSearching } = useSearchUsers(searchQuery);
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsDropdownVisible(true);
  };

  if (isPending) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Can this header be extracted in separate component  */}
      <div className="chat-header relative" ref={containerRef}>
        <SearchBar
          handleSubmit={setSearchQuery}
          handleFocus={handleFocus}
          placeholder="Search chats..."
        />

        {isDropdownVisible && searchQuery && (
          <div className="absolute top-3/4 left-4 right-4 bg-background border rounded-md shadow-lg z-20 max-h-64 overflow-auto p-1">
            <ScrollArea className="max-h-64">
              {isSearching ? (
                <div className="p-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2 py-1">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-2/3 rounded" />
                        <Skeleton className="h-2 w-1/3 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="py-1">
                  {searchResults.map((user) => (
                    <SearchItem
                      key={user.id}
                      user={user}
                      handleClick={() => {
                        setSearchQuery("");
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  <p className="text-xs text-muted-foreground text-center">No users found</p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-0">
            {!convos || convos.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No conversations yet</p>
            ) : (
              convos.map((convo) => (
                <ChatItem
                  key={convo.id}
                  chat={convo}
                  handleClick={() => navigate(`/chats/${convo.id}`)}
                  selected={!!id && convo.id === id}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
