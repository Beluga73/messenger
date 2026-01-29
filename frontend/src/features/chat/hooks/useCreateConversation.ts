import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createConversation } from "@/features/chat/lib/api";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      // What is coming from an endpoint
      // Can separate type be used instead of 'typeof newConversation'?
      queryClient.setQueryData(["conversations"], (oldData?: (typeof newConversation)[]) => {
        return [newConversation, ...(oldData || [])];
      });
      toast.success("Conversation created");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
};
