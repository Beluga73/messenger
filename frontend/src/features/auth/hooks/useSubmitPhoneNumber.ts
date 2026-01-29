import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { sendPhoneNumber } from "../lib/api";

type SubmitPhoneNumberArgs = {
  phoneNumber: string;
  recaptchaToken: string;
};

export const useSubmitPhoneNumber = (
  options?: UseMutationOptions<{ sessionInfo: string }, Error, SubmitPhoneNumberArgs, unknown>
) =>
  useMutation({
    ...options,
    mutationFn: sendPhoneNumber,
    onError: (error) => {
      toast.error(error.message || "Verification failed");
    },
  });
