import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createConversation } from "@/features/chat/lib/api";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation created");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create conversation");
    },
  });
};
