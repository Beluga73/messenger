import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { sendPhoneNumber } from "../lib/sendPhoneNumber";


type SubmitPhoneNumberArgs = {
  phoneNumber: string;
  recaptchaToken: string;
};

export const useSubmitPhoneNumber = (
  options?: UseMutationOptions<unknown, Error, SubmitPhoneNumberArgs, unknown>
) =>
  useMutation({
    mutationFn: sendPhoneNumber,
    ...options,
  });
