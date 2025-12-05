import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { verifyOtp } from "../lib/verifyOtp";

type VerifyOtpVariables = {
  phoneNumber: string;
  code: string;
};

export const useSubmitOtp = (
  options?: UseMutationOptions<unknown, Error, VerifyOtpVariables, unknown>
) =>
  useMutation({
    mutationFn: verifyOtp,
    ...options,
  });
