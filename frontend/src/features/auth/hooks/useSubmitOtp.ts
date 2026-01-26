import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTokenStore } from "@/stores/tokenStore";

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
  options?: UseMutationOptions<VerifyOtpResponse, Error, VerifyOtpVariables>
) => {
  const { setTokens } = useTokenStore();

  return useMutation({
    ...options,
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setTokens(data.jwtToken, data.refreshToken);
      toast.success("Verification successful");
    },
    onError: (error) => {
      toast.error(error.message || "Verification failed");
    },
  });
};
