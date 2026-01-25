import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import { verifyOtp } from "../lib/api";

type VerifyOtpVariables = {
  phoneNumber: string;
  code: string;
  sessionInfo: string;
};

type VerifyOtpResponse = {
  jwtToken: string;
  refreshToken: string;
};

export const useSubmitOtp = (
  options?: UseMutationOptions<VerifyOtpResponse, Error, VerifyOtpVariables, unknown>
) =>
  useMutation({
    mutationFn: verifyOtp,
    ...options,
  });
