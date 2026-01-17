import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ChatItem, SearchItem } from "./index";
import { useConversations, useSearchUsers } from "../hooks";
import { ChatListSkeleton } from "./ChatListSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { SearchBar } from "@/shared/components/SearchBar";
import { useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ChatList() {
  const { data: convos, isPending } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isPending: isSearching } =
    useSearchUsers(searchQuery);
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  if (isPending) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="relative h-full">
      <div className="p-4 border-b relative">
        <SearchBar
          handleSubmit={setSearchQuery}
          placeholder="Search chats..."
        />

        {/* Search Dropdown - appears below search bar */}
        {searchQuery && (
          <div className="absolute top-full left-4 right-4 bg-background border rounded-md shadow-lg z-20 max-h-64 overflow-auto p-1">
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
                        // TODO: Handle user selection - start conversation or navigate
                        console.log("Selected user:", user);
                        setSearchQuery(""); // Close dropdown after selection
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  <p className="text-xs text-muted-foreground text-center">
                    No users found
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
      <ScrollArea className="h-full w-full">
        <div className="space-y-0">
          {!convos || convos.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">
              No conversations yet
            </p>
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
  );
}
