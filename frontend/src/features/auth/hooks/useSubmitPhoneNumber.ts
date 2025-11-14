import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { sendPhoneNumber } from "../lib/sendPhoneNumber";

export const useSubmitPhoneNumber = (
  options?: UseMutationOptions<unknown, Error, string, unknown>
) => {
  return useMutation({
    mutationFn: sendPhoneNumber,
    ...options,
  });
};
