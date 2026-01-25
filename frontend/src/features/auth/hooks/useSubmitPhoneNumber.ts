import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import { sendPhoneNumber } from "../lib/api";

type SubmitPhoneNumberArgs = {
  phoneNumber: string;
  recaptchaToken: string;
};

export const useSubmitPhoneNumber = (
  options?: UseMutationOptions<{ sessionInfo: string }, Error, SubmitPhoneNumberArgs, unknown>
) =>
  useMutation({
    mutationFn: sendPhoneNumber,
    ...options,
  });
